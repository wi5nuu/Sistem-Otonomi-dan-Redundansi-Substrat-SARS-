export async function sha384(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-384', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createAuditHash(
  data: Record<string, unknown>,
  previousHash: string,
): Promise<string> {
  const content = JSON.stringify({ ...data, previousHash });
  return sha384(content);
}

export async function verifyAuditChain(
  entries: Array<{ immutableHash: string; [key: string]: unknown }>,
): Promise<{ valid: boolean; brokenAtIndex: number | null }> {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const previousHash = i === 0 ? '0'.repeat(96) : entries[i - 1]!.immutableHash;
    const { immutableHash, ...rest } = entry;
    const expectedHash = await createAuditHash(rest as Record<string, unknown>, previousHash);
    if (expectedHash !== immutableHash) {
      return { valid: false, brokenAtIndex: i };
    }
  }
  return { valid: true, brokenAtIndex: null };
}
