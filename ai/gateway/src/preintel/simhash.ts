/**
 * SimHash + Hamming distance util pour détection similarité rapide.
 * Basé sur hashing pondéré des tokens (hash murmur-lite).
 */
import crypto from 'crypto';

export interface SimHashResult {
  hash: bigint;
  bits: number;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u017f\s]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function hashToken(token: string): bigint {
  // murmur-lite via sha1 -> prendre 64 bits
  const h = crypto.createHash('sha1').update(token).digest();
  const hi = h.readUInt32BE(0);
  const lo = h.readUInt32BE(4);
  return (BigInt(hi) << 32n) ^ BigInt(lo);
}

export function simhash(text: string, weightFn?: (tok: string) => number): SimHashResult {
  const tokens = tokenize(text);
  if (!tokens.length) {
    return { hash: 0n, bits: 64 };
  }
  const vector = new Array<number>(64).fill(0);
  for (const t of tokens) {
    const w = weightFn ? weightFn(t) : 1;
    const hv = hashToken(t);
    for (let i = 0; i < 64; i++) {
      const bit = (hv >> BigInt(i)) & 1n;
      vector[i] += bit === 1n ? w : -w;
    }
  }
  let fingerprint = 0n;
  for (let i = 0; i < 64; i++) {
    if (vector[i] > 0) {
      fingerprint |= 1n << BigInt(i);
    }
  }
  return { hash: fingerprint, bits: 64 };
}

export function hammingDistance(a: bigint, b: bigint): number {
  let x = a ^ b;
  let dist = 0;
  while (x) {
    x &= x - 1n;
    dist++;
  }
  return dist;
}

export function jaccard(aTokens: string[], bTokens: string[]): number {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter || 1);
}