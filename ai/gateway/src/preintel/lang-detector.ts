// Lightweight heuristic language detector (FR/EN/ZH) – no external deps
export type ShortLang = 'fr' | 'en' | 'zh' | 'unknown';

const SIGNALS = {
  fr: [/\b(le|la|les|de|du|des|et|ou|à|ce|qui|que|pour|avec|sur|dans|par|une?|cette?|son|sa|ses|mon|ma|mes)\b/gi],
  zh: [/[\u4e00-\u9fff]/g],
  en: [/\b(the|and|or|to|of|in|for|with|on|by|at|from|this|that|these|those|a|an)\b/gi]
};

export function detectLanguage(text: string): { lang: ShortLang; confidence: number } {
  const scores = { fr: 0, en: 0, zh: 0 };
  const textLength = text.length;
  
  if (textLength < 3) return { lang: 'unknown', confidence: 0 };
  
  // Count matches for each language
  for (const [lang, patterns] of Object.entries(SIGNALS)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        scores[lang as keyof typeof scores] += matches.length;
      }
    }
  }
  
  // Normalize scores
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return { lang: 'unknown', confidence: 0 };
  
  const winner = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as ShortLang;
  const confidence = Math.min(maxScore / (textLength / 10), 1.0);
  
  return { lang: winner, confidence };
}