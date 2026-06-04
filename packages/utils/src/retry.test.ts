import { describe, it, expect } from 'vitest';
import { withRetry } from './retry.js';

describe('withRetry', () => {
  it('should succeed on first try', async () => {
    const result = await withRetry(async () => 'success');
    expect(result).toBe('success');
  });

  it('should retry on failure and eventually succeed', async () => {
    let attempts = 0;
    const result = await withRetry(async () => {
      attempts++;
      if (attempts < 3) throw new Error('temporary failure');
      return 'recovered';
    }, { maxAttempts: 3, baseDelayMs: 10 });
    expect(result).toBe('recovered');
    expect(attempts).toBe(3);
  });

  it('should exhaust all attempts and throw', async () => {
    let attempts = 0;
    await expect(
      withRetry(async () => {
        attempts++;
        throw new Error('persistent failure');
      }, { maxAttempts: 3, baseDelayMs: 10 }),
    ).rejects.toThrow('persistent failure');
    expect(attempts).toBe(3);
  });

  it('should use default options when not provided', async () => {
    await expect(
      withRetry(async () => { throw new Error('fail'); }),
    ).rejects.toThrow('fail');
  });

  it('should work with a single attempt', async () => {
    await expect(
      withRetry(async () => { throw new Error('no retry'); }, { maxAttempts: 1 }),
    ).rejects.toThrow('no retry');
  });

  it('should wrap non-Error throws in an Error', async () => {
    await expect(
      withRetry(async () => { throw 'string error'; }, { maxAttempts: 1 }),
    ).rejects.toThrow('string error');
  });

  it('should return the resolved value from a successful retry', async () => {
    const result = await withRetry(async () => 42, { maxAttempts: 5, baseDelayMs: 10 });
    expect(result).toBe(42);
  });
});
