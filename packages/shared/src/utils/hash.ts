import { createHash } from 'crypto';

export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function approxTokens(text: string): number {
  // Approximation: 1 token ≈ 4 chars for most models
  return Math.ceil(text.length / 4);
}

export function contextHash(chunkIds: string[], pruneProfile?: string): string {
  const sorted = [...chunkIds].sort();
  const input = sorted.join('|') + (pruneProfile || '');
  return sha256(input);
}

export function promptHash(prompt: string): string {
  return sha256(prompt).substring(0, 16);
}