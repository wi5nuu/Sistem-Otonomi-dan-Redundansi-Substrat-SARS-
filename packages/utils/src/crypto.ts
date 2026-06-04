import { webcrypto } from 'node:crypto';

const ENC = new TextEncoder();
const DEC = new TextDecoder();

export async function generateKey(): Promise<webcrypto.CryptoKey> {
  return webcrypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(plaintext: string, key: webcrypto.CryptoKey): Promise<string> {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const encrypted = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    ENC.encode(plaintext),
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return Buffer.from(combined).toString('base64');
}

export async function decrypt(ciphertext: string, key: webcrypto.CryptoKey): Promise<string> {
  const data = Buffer.from(ciphertext, 'base64');
  const iv = data.subarray(0, 12);
  const encrypted = data.subarray(12);
  const decrypted = await webcrypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted,
  );
  return DEC.decode(decrypted);
}

export function randomBytes(length: number): string {
  const bytes = webcrypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
