/**
 * Normalisation légère + segmentation intelligible.
 */
export interface Segment {
  original: string;
  normalized: string;
  chars: number;
  simHash?: bigint;
}

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0]+/g, ' ')
    .trim();
}

export function segmentText(
  text: string,
  opts: { maxSegments: number; minSegmentChars: number }
): Segment[] {
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(b => b.length >= opts.minSegmentChars);
  const segments: Segment[] = [];
  for (const b of blocks) {
    segments.push({
      original: b,
      normalized: normalizeText(b),
      chars: b.length
    });
    if (segments.length >= opts.maxSegments) break;
  }
  if (!segments.length && text.length) {
    segments.push({ original: text, normalized: normalizeText(text), chars: text.length });
  }
  return segments;
}