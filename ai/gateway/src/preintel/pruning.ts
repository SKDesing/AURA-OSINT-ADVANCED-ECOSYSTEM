/**
 * Stratégies de pruning:
 * - Similarité (SimHash + Hamming)
 * - Jaccard fallback (option)
 * - Limitation cumulative chars
 * - Tokens approximés chars/4
 */
import { simhash, hammingDistance, tokenize } from './simhash';
import { Segment } from './text-normalize';

export interface PruneStats {
  kept: number;
  dropped_similar: number;
  dropped_limit: number;
  dropped_other: number;
  total_chars_before: number;
  total_chars_after: number;
  tokens_saved_est: number;
}

export function pruneSegments(
  segments: Segment[],
  opts: {
    simhashThreshold: number;
    maxContextChars: number;
  }
): { segments: Segment[]; stats: PruneStats } {
  const threshold = opts.simhashThreshold;
  const kept: Segment[] = [];
  const stats: PruneStats = {
    kept: 0,
    dropped_similar: 0,
    dropped_limit: 0,
    dropped_other: 0,
    total_chars_before: segments.reduce((a, s) => a + s.chars, 0),
    total_chars_after: 0,
    tokens_saved_est: 0
  };
  let cumulative = 0;
  const seenHashes: bigint[] = [];
  for (const seg of segments) {
    const h = simhash(seg.normalized);
    seg.simHash = h.hash;
    let isSimilar = false;
    for (const prev of seenHashes) {
      const d = hammingDistance(prev, h.hash);
      if (d <= threshold) {
        isSimilar = true;
        break;
      }
    }
    if (isSimilar) {
      stats.dropped_similar++;
      continue;
    }
    if (cumulative + seg.chars > opts.maxContextChars) {
      stats.dropped_limit++;
      continue;
    }
    kept.push(seg);
    seenHashes.push(h.hash);
    cumulative += seg.chars;
  }
  stats.kept = kept.length;
  stats.total_chars_after = cumulative;
  stats.tokens_saved_est = Math.max(
    0,
    Math.round((stats.total_chars_before - stats.total_chars_after) / 4)
  );
  return { segments: kept, stats };
}

export function assembleContext(segments: Segment[]): string {
  return segments.map(s => s.normalized).join('\n\n');
}