import { sha256 } from '../../../../packages/shared/src/utils/hash';
import { EmbeddingService } from '../rag/embedding.service';
import cosine from 'cosine-similarity';
import prototypes from './prototypes.json';

export interface RouterFeatures {
  lexical_bucket: 'low' | 'med' | 'high';
  lang: string;
  ent_count: number;
  forensic_terms: number;
  timeline_markers: number;
  length_bucket: 'short' | 'medium' | 'long';
  has_question: boolean;
  risk_lexical: number;
  contains_policy_request: boolean;
  task_hint: string | null;
  // Semantic features
  sim_bypass: number;
  sim_forensic: number;
  sim_harassment: number;
  sim_rag_llm: number;
  sim_escalate: number;
  sim_top1: number;
  sim_top1_class: string;
  sim_top2: number;
  sim_margin_top2: number;
}

type ProtoIndex = {
  class: string;
  centroid: number[];
  size: number;
};

let protoIndex: ProtoIndex[] | null = null;

export class FeatureExtractor {
  private readonly forensicTerms = [
    'timeline', 'chronologie', 'séquence', 'burst', 'pic', 'anomalie',
    'corrélation', 'pattern', 'tendance', 'évolution', 'historique'
  ];

  private readonly policyTerms = [
    'selon nos données', 'analyse', 'extract', 'résume', 'classify',
    'identifie', 'détermine', 'évalue', 'compare', 'liste'
  ];

  private readonly taskHints = [
    'extract', 'analyse', 'classify', 'identifie', 'résume', 'compare',
    'liste', 'détermine', 'évalue', 'trouve', 'cherche'
  ];

  async extract(text: string, preIntelMeta?: any): Promise<RouterFeatures> {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    // Length bucket
    const charCount = text.length;
    let lengthBucket: 'short' | 'medium' | 'long';
    if (charCount < 100) lengthBucket = 'short';
    else if (charCount < 500) lengthBucket = 'medium';
    else lengthBucket = 'long';

    // Entity count (simple heuristic)
    const entCount = this.countEntities(text);

    // Forensic terms
    const forensicCount = this.countTerms(text, this.forensicTerms);

    // Timeline markers (dates, times, temporal expressions)
    const timelineCount = this.countTimelineMarkers(text);

    // Risk lexical (from preIntel or calculate)
    const riskLexical = preIntelMeta?.risk_lexical || this.calculateRisk(text);

    // Lexical bucket based on risk
    let lexicalBucket: 'low' | 'med' | 'high';
    if (riskLexical < 0.3) lexicalBucket = 'low';
    else if (riskLexical < 0.7) lexicalBucket = 'med';
    else lexicalBucket = 'high';

    // Language (from preIntel or detect)
    const lang = preIntelMeta?.language || this.detectLanguage(text);

    // Question detection
    const hasQuestion = /\?/.test(text) || /^(qui|que|quoi|où|quand|comment|pourquoi|what|who|where|when|how|why)/i.test(text);

    // Policy request detection
    const containsPolicyRequest = this.countTerms(text, this.policyTerms) > 0;

    // Task hint detection
    const taskHint = this.detectTaskHint(text);

    // Get semantic features
    const semanticFeatures = await this.extractSemanticFeatures(text);

    return {
      lexical_bucket: lexicalBucket,
      lang,
      ent_count: entCount,
      forensic_terms: forensicCount,
      timeline_markers: timelineCount,
      length_bucket: lengthBucket,
      has_question: hasQuestion,
      risk_lexical: riskLexical,
      contains_policy_request: containsPolicyRequest,
      task_hint: taskHint,
      ...semanticFeatures
    };
  }

  hashFeatures(features: RouterFeatures): string {
    const normalized = JSON.stringify(features, Object.keys(features).sort());
    return sha256(normalized).substring(0, 16);
  }

  private countEntities(text: string): number {
    // Simple entity detection heuristics
    const patterns = [
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Proper names
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // Dates
      /\b\d{1,2}h\d{2}\b/g, // Times
      /\b[A-Z]{2,}\b/g, // Acronyms
      /@\w+/g, // Mentions
      /#\w+/g // Hashtags
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    });

    return Math.min(count, 20); // Cap at 20
  }

  private countTerms(text: string, terms: string[]): number {
    const lowerText = text.toLowerCase();
    return terms.filter(term => lowerText.includes(term)).length;
  }

  private countTimelineMarkers(text: string): number {
    const patterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // Dates DD/MM/YYYY
      /\b\d{4}-\d{2}-\d{2}\b/g, // Dates YYYY-MM-DD
      /\b\d{1,2}h\d{2}\b/g, // Times
      /\b(hier|aujourd'hui|demain|yesterday|today|tomorrow)\b/gi,
      /\b(avant|après|pendant|during|before|after)\b/gi,
      /\b(début|fin|milieu|start|end|middle)\b/gi
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  private calculateRisk(text: string): number {
    const riskTerms = [
      'menace', 'danger', 'attaque', 'violence', 'harcèlement',
      'threat', 'danger', 'attack', 'violence', 'harassment'
    ];
    
    const riskCount = this.countTerms(text, riskTerms);
    const totalWords = text.split(/\s+/).length;
    
    return Math.min(riskCount / Math.max(totalWords, 1) * 10, 1.0);
  }

  private detectLanguage(text: string): string {
    const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec'];
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    
    const words = text.toLowerCase().split(/\s+/).slice(0, 50);
    const frenchCount = words.filter(word => frenchWords.includes(word)).length;
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    
    if (frenchCount > englishCount) return 'fr';
    if (englishCount > frenchCount) return 'en';
    return 'unknown';
  }

  private detectTaskHint(text: string): string | null {
    const firstWords = text.toLowerCase().split(/\s+/).slice(0, 3);
    
    for (const hint of this.taskHints) {
      if (firstWords.some(word => word.startsWith(hint))) {
        return hint;
      }
    }
    
    return null;
  }

  private async buildProtoIndex(): Promise<ProtoIndex[]> {
    const emb = EmbeddingService.get();
    const index: ProtoIndex[] = [];
    
    for (const [klass, samples] of Object.entries(prototypes)) {
      const vecs = await emb.batchEmbed(samples as string[]);
      const dim = vecs[0].length;
      const centroid = new Array(dim).fill(0);
      
      // Calculate centroid
      for (const v of vecs) {
        for (let i = 0; i < dim; i++) {
          centroid[i] += v[i];
        }
      }
      for (let i = 0; i < dim; i++) {
        centroid[i] /= vecs.length;
      }
      
      index.push({ class: klass, centroid, size: vecs.length });
    }
    
    return index;
  }

  private async extractSemanticFeatures(prompt: string): Promise<Partial<RouterFeatures>> {
    try {
      if (!protoIndex) {
        protoIndex = await this.buildProtoIndex();
      }
      
      const emb = EmbeddingService.get();
      const vector = await emb.embedText(prompt);
      
      // Compute cosine similarity to each centroid
      const sims = protoIndex.map(p => ({
        klass: p.class,
        sim: cosine(vector, p.centroid)
      })).sort((a, b) => b.sim - a.sim);
      
      const top1 = sims[0];
      const top2 = sims[1] || { sim: 0, klass: 'none' };
      const margin = top1.sim - top2.sim;
      
      return {
        sim_bypass: sims.find(s => s.klass === 'bypass')?.sim ?? 0,
        sim_forensic: sims.find(s => s.klass === 'forensic')?.sim ?? 0,
        sim_harassment: sims.find(s => s.klass === 'harassment')?.sim ?? 0,
        sim_rag_llm: sims.find(s => s.klass === 'rag_llm')?.sim ?? 0,
        sim_escalate: sims.find(s => s.klass === 'escalate')?.sim ?? 0,
        sim_top1: top1.sim,
        sim_top1_class: top1.klass,
        sim_top2: top2.sim,
        sim_margin_top2: Number(margin.toFixed(4))
      };
    } catch (error) {
      console.error('[Router] Semantic features extraction failed:', error);
      // Return default values if semantic features fail
      return {
        sim_bypass: 0,
        sim_forensic: 0,
        sim_harassment: 0,
        sim_rag_llm: 0,
        sim_escalate: 0,
        sim_top1: 0,
        sim_top1_class: 'unknown',
        sim_top2: 0,
        sim_margin_top2: 0
      };
    }
  }
}