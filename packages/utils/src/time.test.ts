import { describe, it, expect } from 'vitest';
import { formatDuration, timeAgo, isExpiring } from './time.js';

describe('formatDuration', () => {
  it('should format seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2m 5s');
  });

  it('should format hours, minutes, seconds', () => {
    expect(formatDuration(3661)).toBe('1h 1m 1s');
  });

  it('should format days, hours, minutes, seconds', () => {
    expect(formatDuration(90061)).toBe('1d 1h 1m 1s');
  });

  it('should handle zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should handle large values', () => {
    const result = formatDuration(86400 * 365);
    expect(result).toContain('365d');
  });
});

describe('timeAgo', () => {
  it('should return seconds ago', () => {
    const result = timeAgo(new Date(Date.now() - 30000));
    expect(result).toMatch(/^\d+s ago$/);
  });

  it('should return minutes ago', () => {
    const result = timeAgo(new Date(Date.now() - 120000));
    expect(result).toMatch(/^\d+m ago$/);
  });

  it('should return hours ago', () => {
    const result = timeAgo(new Date(Date.now() - 7200000));
    expect(result).toMatch(/^\d+h ago$/);
  });

  it('should return days ago', () => {
    const result = timeAgo(new Date(Date.now() - 86400000 * 5));
    expect(result).toMatch(/^\d+d ago$/);
  });

  it('should return months ago', () => {
    const result = timeAgo(new Date(Date.now() - 86400000 * 60));
    expect(result).toMatch(/^\d+mo ago$/);
  });

  it('should accept string date', () => {
    const past = new Date(Date.now() - 60000).toISOString();
    const result = timeAgo(past);
    expect(result).toMatch(/^\d+m ago$/);
  });
});

describe('isExpiring', () => {
  it('should return true for a past date', () => {
    expect(isExpiring(new Date('2020-01-01'))).toBe(true);
  });

  it('should return true for a date within the threshold', () => {
    const future = new Date();
    future.setDate(future.getDate() + 15);
    expect(isExpiring(future)).toBe(true);
  });

  it('should return false for a date far in the future', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5);
    expect(isExpiring(future)).toBe(false);
  });

  it('should accept custom withinDays threshold', () => {
    const future = new Date();
    future.setDate(future.getDate() + 60);
    expect(isExpiring(future, 90)).toBe(true);
    expect(isExpiring(future, 30)).toBe(false);
  });

  it('should accept string date', () => {
    expect(isExpiring(new Date(Date.now() + 86400000 * 10).toISOString())).toBe(true);
  });
});
