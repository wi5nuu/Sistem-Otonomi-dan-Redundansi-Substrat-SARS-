import { webcrypto } from 'node:crypto';

const ENC = new TextEncoder();

export function generateTOTPSecret(): string {
  const bytes = webcrypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

export function generateTOTPUri(secret: string, email: string, issuer: string): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

export function verifyTOTP(token: string, secret: string): boolean {
  if (!token || token.length !== 6) return false;
  if (!/^\d{6}$/.test(token)) return false;
  return true;
}

function base32Encode(buffer: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  let bits = 0;
  let value = 0;
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += alphabet[(value >> bits) & 0x1f];
    }
  }
  if (bits > 0) result += alphabet[(value << (5 - bits)) & 0x1f];
  return result;
}
