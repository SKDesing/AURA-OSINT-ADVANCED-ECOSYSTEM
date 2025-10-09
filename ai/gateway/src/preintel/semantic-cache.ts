/**
 * Cache sémantique simple in-memory:
 * key = hash(prompt + contextFingerprint)
 * value = { output, output_hash, expiresAt, tokens_in, tokens_out }
 */
import crypto from 'crypto';

interface CacheEntry {
  output: string;
  outputHash: string;
  expiresAt: number;
  tokensIn: number;
  tokensOut: number;
}

export class SemanticCache {
  private store = new Map<string, CacheEntry>();

  constructor(private ttlMs: number, private maxEntries: number) {}

  private gc() {
    if (this.store.size <= this.maxEntries) return;
    // Supprimer les plus anciens (approche simple: parcours + tri)
    const arr = [...this.store.entries()];
    arr.sort((a,b) => a[1].expiresAt - b[1].expiresAt);
    const remove = arr.slice(0, Math.ceil(arr.length * 0.2));
    for (const [k] of remove) this.store.delete(k);
  }

  makeKey(prompt: string, context: string): string {
    return crypto.createHash('sha256').update(prompt + '||' + context).digest('hex');
  }

  get(key: string) {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e;
  }

  set(key: string, entry: Omit<CacheEntry,'expiresAt'>) {
    this.gc();
    this.store.set(key, {
      ...entry,
      expiresAt: Date.now() + this.ttlMs
    });
  }
}