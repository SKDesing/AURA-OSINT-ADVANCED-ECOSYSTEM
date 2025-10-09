/**
 * Stub hiérarchique:
 * - Si trop long, on chunk et on fait un pseudo "résumé" heuristique (phrases initiales).
 * - Phase future: appel récursif LLM interne avec budget tokens.
 */
export function hierarchicalSummarize(
  text: string,
  targetTokens: number
): { summary: string; reduced: boolean } {
  const approxTokens = Math.ceil(text.length / 4);
  if (approxTokens <= targetTokens) {
    return { summary: text, reduced: false };
  }
  const lines = text.split(/\n+/).filter(l => l.trim());
  const take = Math.max(3, Math.min(15, Math.ceil(targetTokens / 50)));
  const selected = lines.slice(0, take);
  const summary = selected.join('\n').slice(0, targetTokens * 4);
  return { summary, reduced: true };
}