import { sha256, approxTokens } from '../../../../packages/shared/src/utils/hash';
import { aiPreintelLatency } from '../metrics/ai-metrics';

export interface PreIntelInput {
  text: string;
  context?: string;
  options?: {
    enablePruning?: boolean;
    enableSimhash?: boolean;
    enableCache?: boolean;
    maxPruningRatio?: number;
  };
}

export interface PreIntelResult {
  processedText: string;
  metadata: {
    originalTokens: number;
    finalTokens: number;
    tokensSaved: number;
    languageDetected: string;
    pruningApplied: boolean;
    cacheHit: boolean;
    simhashScore?: number;
    processingTimeMs: number;
  };
  hash: string;
}

export class PreIntelPipeline {
  private cache = new Map<string, PreIntelResult>();

  async run(input: PreIntelInput, dry = false): Promise<PreIntelResult> {
    const startTime = Date.now();
    const timer = aiPreintelLatency.startTimer({ operation: dry ? 'dry' : 'full' });

    try {
      const inputHash = sha256(input.text);
      
      // Check cache first
      if (input.options?.enableCache !== false && this.cache.has(inputHash)) {
        const cached = this.cache.get(inputHash)!;
        timer();
        return { ...cached, metadata: { ...cached.metadata, cacheHit: true } };
      }

      const originalTokens = approxTokens(input.text);
      let processedText = input.text;
      let tokensSaved = 0;
      let pruningApplied = false;
      let simhashScore: number | undefined;

      // Language detection
      const languageDetected = this.detectLanguage(input.text);

      // Simhash deduplication
      if (input.options?.enableSimhash !== false) {
        const { isDuplicate, score } = this.checkSimhash(input.text);
        simhashScore = score;
        if (isDuplicate && !dry) {
          processedText = this.generateDuplicateResponse(input.text);
          tokensSaved = originalTokens - approxTokens(processedText);
        }
      }

      // Pruning
      if (input.options?.enablePruning !== false && simhashScore !== undefined && simhashScore < 0.8) {
        const pruned = this.applyPruning(processedText, input.options?.maxPruningRatio || 0.3);
        if (pruned.applied && !dry) {
          processedText = pruned.text;
          tokensSaved += pruned.tokensSaved;
          pruningApplied = true;
        }
      }

      const finalTokens = approxTokens(processedText);
      const processingTimeMs = Date.now() - startTime;

      const result: PreIntelResult = {
        processedText,
        metadata: {
          originalTokens,
          finalTokens,
          tokensSaved,
          languageDetected,
          pruningApplied,
          cacheHit: false,
          simhashScore,
          processingTimeMs
        },
        hash: sha256(processedText)
      };

      // Cache result if not dry run
      if (!dry && input.options?.enableCache !== false) {
        this.cache.set(inputHash, result);
      }

      timer();
      return result;

    } catch (error) {
      timer();
      throw error;
    }
  }

  private detectLanguage(text: string): string {
    // Simple heuristic - can be enhanced with proper language detection
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec', 'par'];
    
    const words = text.toLowerCase().split(/\s+/).slice(0, 50);
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    const frenchCount = words.filter(word => frenchWords.includes(word)).length;
    
    if (englishCount > frenchCount) return 'en';
    if (frenchCount > englishCount) return 'fr';
    return 'unknown';
  }

  private checkSimhash(text: string): { isDuplicate: boolean; score: number } {
    // Simplified simhash - replace with actual implementation
    const hash = sha256(text);
    const score = Math.random() * 0.3 + 0.7; // Mock score between 0.7-1.0
    return {
      isDuplicate: score > 0.85,
      score
    };
  }

  private generateDuplicateResponse(text: string): string {
    return "Cette question a déjà été traitée récemment. Veuillez consulter les réponses précédentes.";
  }

  private applyPruning(text: string, maxRatio: number): { text: string; applied: boolean; tokensSaved: number } {
    const originalTokens = approxTokens(text);
    
    // Simple pruning: remove redundant phrases and filler words
    const fillerWords = ['basically', 'actually', 'literally', 'you know', 'like', 'um', 'uh'];
    let prunedText = text;
    
    fillerWords.forEach(filler => {
      prunedText = prunedText.replace(new RegExp(`\\b${filler}\\b`, 'gi'), '');
    });
    
    // Remove excessive whitespace
    prunedText = prunedText.replace(/\s+/g, ' ').trim();
    
    const finalTokens = approxTokens(prunedText);
    const tokensSaved = originalTokens - finalTokens;
    const ratio = tokensSaved / originalTokens;
    
    return {
      text: ratio <= maxRatio ? prunedText : text,
      applied: ratio <= maxRatio && ratio > 0.05,
      tokensSaved: ratio <= maxRatio ? tokensSaved : 0
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    // Simplified cache stats
    return {
      size: this.cache.size,
      hitRate: 0.0 // Would need to track hits/misses
    };
  }
}

// Singleton instance
export const preIntelPipeline = new PreIntelPipeline();