import { describe, it, expect } from 'vitest';
import { sha384, createAuditHash, verifyAuditChain } from './hash.js';

describe('sha384', () => {
  it('should produce a 96-character hex string', async () => {
    const hash = await sha384('hello');
    expect(hash).toHaveLength(96);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it('should produce the same hash for the same input', async () => {
    const hash1 = await sha384('test-data');
    const hash2 = await sha384('test-data');
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different inputs', async () => {
    const hash1 = await sha384('input-a');
    const hash2 = await sha384('input-b');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty string', async () => {
    const hash = await sha384('');
    expect(hash).toHaveLength(96);
  });

  it('should handle unicode characters', async () => {
    const hash = await sha384('héllo wörld 🌍');
    expect(hash).toHaveLength(96);
  });
});

describe('createAuditHash', () => {
  it('should produce a deterministic hash for known inputs', async () => {
    const hash = await createAuditHash({ action: 'test', userId: 'u1' }, '0'.repeat(96));
    expect(hash).toHaveLength(96);
  });

  it('should produce different hashes when data changes', async () => {
    const hash1 = await createAuditHash({ action: 'login' }, '0'.repeat(96));
    const hash2 = await createAuditHash({ action: 'logout' }, '0'.repeat(96));
    expect(hash1).not.toBe(hash2);
  });

  it('should produce different hashes when previousHash changes', async () => {
    const hash1 = await createAuditHash({ action: 'login' }, '0'.repeat(96));
    const hash2 = await createAuditHash({ action: 'login' }, '1'.repeat(96));
    expect(hash1).not.toBe(hash2);
  });

  it('should handle nested data objects', async () => {
    const hash = await createAuditHash(
      { action: 'update', resource: { id: 1, name: 'test' } },
      '0'.repeat(96),
    );
    expect(hash).toHaveLength(96);
  });
});

describe('verifyAuditChain', () => {
  it('should verify a valid chain of entries', async () => {
    const entry1 = { action: 'create', resource: 'user', immutableHash: '' };
    const hash1 = await createAuditHash(
      { action: entry1.action, resource: entry1.resource },
      '0'.repeat(96),
    );
    entry1.immutableHash = hash1;

    const entry2 = { action: 'update', resource: 'user', immutableHash: '' };
    const hash2 = await createAuditHash(
      { action: entry2.action, resource: entry2.resource },
      entry1.immutableHash,
    );
    entry2.immutableHash = hash2;

    const result = await verifyAuditChain([entry1, entry2]);
    expect(result.valid).toBe(true);
    expect(result.brokenAtIndex).toBeNull();
  });

  it('should detect a tampered entry in the chain', async () => {
    const entry1 = { action: 'create', resource: 'user', immutableHash: '' };
    const hash1 = await createAuditHash(
      { action: entry1.action, resource: entry1.resource },
      '0'.repeat(96),
    );
    entry1.immutableHash = hash1;

    const entry2: Record<string, unknown> = { action: 'update', resource: 'user', immutableHash: '' };
    const hash2 = await createAuditHash(
      { action: entry2.action, resource: entry2.resource },
      entry1.immutableHash,
    );
    entry2.immutableHash = hash2;

    entry2.action = 'delete';

    const result = await verifyAuditChain([entry1, entry2] as any);
    expect(result.valid).toBe(false);
    expect(result.brokenAtIndex).toBe(1);
  });

  it('should verify a single entry chain', async () => {
    const entry = { action: 'create', resource: 'user', immutableHash: '' };
    const hash = await createAuditHash(
      { action: entry.action, resource: entry.resource },
      '0'.repeat(96),
    );
    entry.immutableHash = hash;

    const result = await verifyAuditChain([entry]);
    expect(result.valid).toBe(true);
    expect(result.brokenAtIndex).toBeNull();
  });

  it('should detect broken chain in first entry', async () => {
    const entry = { action: 'create', immutableHash: 'invalid-hash-value' };
    const result = await verifyAuditChain([entry]);
    expect(result.valid).toBe(false);
    expect(result.brokenAtIndex).toBe(0);
  });

  it('should handle empty chain', async () => {
    const result = await verifyAuditChain([]);
    expect(result.valid).toBe(true);
    expect(result.brokenAtIndex).toBeNull();
  });
});
