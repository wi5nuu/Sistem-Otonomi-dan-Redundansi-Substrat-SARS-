import { describe, it, expect } from 'vitest';
import {
  calculateComputeHealth,
  calculateStorageHealth,
  calculateNetworkHealth,
  calculateGlobalHealth,
} from './health-score.js';

describe('calculateComputeHealth', () => {
  it('should return a score between 0 and 100', () => {
    const score = calculateComputeHealth({
      cpuPercent: 50,
      ramPercent: 50,
      nodeStatuses: [{ status: 'ACTIVE' }, { status: 'ACTIVE' }],
      uptimeSeconds: 86400,
      temperatureCelsius: 60,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return 100 for perfect metrics', () => {
    const score = calculateComputeHealth({
      cpuPercent: 0,
      ramPercent: 0,
      nodeStatuses: [{ status: 'ACTIVE' }],
      uptimeSeconds: 86400 * 10,
      temperatureCelsius: 30,
    });
    expect(score).toBe(100);
  });

  it('should return 0 for all metrics failing', () => {
    const score = calculateComputeHealth({
      cpuPercent: 100,
      ramPercent: 100,
      nodeStatuses: [{ status: 'OFFLINE' }],
      uptimeSeconds: 0,
      temperatureCelsius: 130,
    });
    expect(score).toBe(0);
  });

  it('should handle empty node list', () => {
    const score = calculateComputeHealth({
      cpuPercent: 0,
      ramPercent: 0,
      nodeStatuses: [],
      uptimeSeconds: 86400,
      temperatureCelsius: 30,
    });
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should penalize high temperature', () => {
    const cool = calculateComputeHealth({
      cpuPercent: 0, ramPercent: 0,
      nodeStatuses: [{ status: 'ACTIVE' }],
      uptimeSeconds: 86400 * 10, temperatureCelsius: 30,
    });
    const hot = calculateComputeHealth({
      cpuPercent: 0, ramPercent: 0,
      nodeStatuses: [{ status: 'ACTIVE' }],
      uptimeSeconds: 86400 * 10, temperatureCelsius: 100,
    });
    expect(hot).toBeLessThan(cool);
  });
});

describe('calculateStorageHealth', () => {
  it('should return a score between 0 and 100', () => {
    const score = calculateStorageHealth({
      usedRatio: 0.5,
      clusters: [{ status: 'ONLINE' }, { status: 'ONLINE' }],
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return 100 for perfect metrics', () => {
    const score = calculateStorageHealth({
      usedRatio: 0,
      clusters: [{ status: 'ONLINE' }],
    });
    expect(score).toBe(100);
  });

  it('should return 0 for fully used with offline clusters', () => {
    const score = calculateStorageHealth({
      usedRatio: 1,
      clusters: [{ status: 'OFFLINE' }],
    });
    expect(score).toBe(0);
  });

  it('should handle empty cluster list', () => {
    const score = calculateStorageHealth({
      usedRatio: 0.5,
      clusters: [],
    });
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateNetworkHealth', () => {
  it('should return a score between 0 and 100', () => {
    const score = calculateNetworkHealth({
      links: [{ status: 'ACTIVE' }, { status: 'ACTIVE' }],
      avgLatencyMs: 10,
      avgPacketLoss: 0.01,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return 100 for perfect metrics', () => {
    const score = calculateNetworkHealth({
      links: [{ status: 'ACTIVE' }],
      avgLatencyMs: 0,
      avgPacketLoss: 0,
    });
    expect(score).toBe(100);
  });

  it('should return low score for poor metrics', () => {
    const score = calculateNetworkHealth({
      links: [{ status: 'OFFLINE' }],
      avgLatencyMs: 200,
      avgPacketLoss: 1,
    });
    expect(score).toBeLessThan(20);
  });

  it('should handle empty links list', () => {
    const score = calculateNetworkHealth({
      links: [],
      avgLatencyMs: 10,
      avgPacketLoss: 0.01,
    });
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateGlobalHealth', () => {
  it('should return a score between 0 and 100', () => {
    const score = calculateGlobalHealth([80, 90, 70]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should apply weight normalization (earlier scores weighted higher)', () => {
    const highFirst = calculateGlobalHealth([100, 0]);
    const lowFirst = calculateGlobalHealth([0, 100]);
    expect(highFirst).toBeGreaterThan(lowFirst);
  });

  it('should return 0 for empty scores', () => {
    expect(calculateGlobalHealth([])).toBe(0);
  });

  it('should return 100 for all perfect scores', () => {
    expect(calculateGlobalHealth([100, 100, 100])).toBe(100);
  });

  it('should return 0 for all zero scores', () => {
    expect(calculateGlobalHealth([0, 0, 0])).toBe(0);
  });
});
