// Pre-intelligence lexical risk scoring (Phase 1 MVP)
export const LEXICAL_WEIGHTS: Record<string, number> = {
  // English
  kill: 1.0, hate: 0.8, threat: 0.9, destroy: 0.85, attack: 0.9,
  violence: 0.85, bomb: 1.0, weapon: 0.8, murder: 1.0, death: 0.7,
  suicide: 0.9, harm: 0.6, abuse: 0.7, harass: 0.8, stalk: 0.8,
  rape: 1.0, molest: 1.0, pedophile: 1.0, terrorist: 1.0, nazi: 0.9,
  fuck: 0.4, shit: 0.3, damn: 0.2, stupid: 0.3, idiot: 0.3,
  // French
  tuer: 1.0, haine: 0.8, menace: 0.9, bombe: 1.0,
  arme: 0.8, meurtre: 1.0, mort: 0.7, mal: 0.6,
  // Chinese
  杀: 1.0, 恨: 0.8, 威胁: 0.9, 暴力: 0.85, 炸弹: 1.0, 武器: 0.8
};

const LEXICON = LEXICAL_WEIGHTS;

export interface RiskScore {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  matches: string[];
  confidence: number;
}

export function assessRisk(text: string): RiskScore {
  const words = text.toLowerCase().split(/\s+/);
  const matches: string[] = [];
  let totalScore = 0;
  
  for (const word of words) {
    const cleanWord = word.replace(/[^\w\u4e00-\u9fff]/g, '');
    if (LEXICON[cleanWord]) {
      matches.push(cleanWord);
      totalScore += LEXICON[cleanWord];
    }
  }
  
  const normalizedScore = Math.min(totalScore / words.length * 10, 1.0);
  
  let level: RiskScore['level'] = 'low';
  if (normalizedScore >= 0.8) level = 'critical';
  else if (normalizedScore >= 0.5) level = 'high';
  else if (normalizedScore >= 0.2) level = 'medium';
  
  return {
    score: normalizedScore,
    level,
    matches,
    confidence: matches.length > 0 ? Math.min(matches.length / 3, 1.0) : 0
  };
}