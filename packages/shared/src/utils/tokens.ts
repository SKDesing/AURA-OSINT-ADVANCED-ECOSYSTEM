/**
 * Unified token counting utilities for AURA ecosystem
 */

export function approximateTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for most languages
  // More accurate for production use with tiktoken or similar
  return Math.ceil(text.length / 4);
}

export function estimateTokensSaved(originalLength: number, processedLength: number): number {
  return Math.max(0, approximateTokens(originalLength.toString()) - approximateTokens(processedLength.toString()));
}

export function calculateTokenEfficiency(tokensIn: number, tokensOut: number, tokensSaved: number): number {
  const total = tokensIn + tokensOut;
  return total > 0 ? (tokensSaved / total) * 100 : 0;
}

export function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function validateTokenLimit(text: string, maxTokens: number): { valid: boolean; actual: number; max: number } {
  const actual = approximateTokens(text);
  return {
    valid: actual <= maxTokens,
    actual,
    max: maxTokens
  };
}