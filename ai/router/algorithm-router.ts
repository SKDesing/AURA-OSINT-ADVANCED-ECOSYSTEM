import { createHash } from 'crypto';

export interface RouterDecision {
  router_version: string;
  matched_algorithm: 'ner' | 'forensic' | 'nlp' | 'harassment' | 'rag+llm' | 'llm';
  confidence: number;
  extraction_entities?: string[];
  reason: string;
  preintel_signature: string;
  tokens_saved_estimate?: number;
}

export interface RouterMetrics {
  router_accuracy: number;
  router_llm_bypass_rate: number;
  router_false_negative: number;
  tokens_saved_by_routing_total: number;
}

export class AlgorithmRouter {
  private version = '1.0.0';
  private metrics: RouterMetrics = {
    router_accuracy: 0,
    router_llm_bypass_rate: 0,
    router_false_negative: 0,
    tokens_saved_by_routing_total: 0
  };

  private entityPatterns = [
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, // Noms propres
    /\b\d{14}\b/g, // SIRET
    /\b\d{9}\b/g, // SIREN
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, // Email
    /\b(?:\+33|0)[1-9](?:[0-9]{8})\b/g // Téléphone FR
  ];

  private forensicKeywords = [
    'timeline', 'chronologie', 'séquence', 'simultané', 'coordonné',
    'burst', 'pattern', 'corrélation', 'temporel', 'sequence'
  ];

  private harassmentKeywords = [
    'insultant', 'toxic', 'haineux', 'harass', 'menace', 'injure'
  ];

  private ragKeywords = [
    'que dit', 'résumé', 'sources', 'selon nos données', 'extraits',
    'document', 'contexte', 'information'
  ];

  decide(prompt: string, lexicalScore: number, language: string): RouterDecision {
    const preprocessed = this.preprocessPrompt(prompt);
    const signature = this.generateSignature(preprocessed, lexicalScore, language);
    
    // NER Detection
    const entities = this.extractEntities(prompt); // Use original text for entity extraction
    if (entities.length >= 1) {
      return {
        router_version: this.version,
        matched_algorithm: 'ner',
        confidence: 0.9,
        extraction_entities: entities,
        reason: `Detected ${entities.length} entities requiring extraction`,
        preintel_signature: signature,
        tokens_saved_estimate: Math.floor(prompt.length * 0.85)
      };
    }

    // Forensic Analysis
    if (this.matchesKeywords(preprocessed, this.forensicKeywords)) {
      return {
        router_version: this.version,
        matched_algorithm: 'forensic',
        confidence: 0.85,
        reason: 'Timeline/correlation analysis patterns detected',
        preintel_signature: signature,
        tokens_saved_estimate: Math.floor(prompt.length * 0.8)
      };
    }

    // Harassment Detection
    if (lexicalScore > 0.5 && this.matchesKeywords(preprocessed, this.harassmentKeywords)) {
      return {
        router_version: this.version,
        matched_algorithm: 'harassment',
        confidence: 0.95,
        reason: `High lexical risk (${lexicalScore}) + harassment patterns`,
        preintel_signature: signature,
        tokens_saved_estimate: Math.floor(prompt.length * 0.9)
      };
    }

    // NLP Classification - check for toxicity questions
    if (preprocessed.includes('insultant') || preprocessed.includes('haineux') || preprocessed.includes('toxique')) {
      return {
        router_version: this.version,
        matched_algorithm: 'nlp',
        confidence: 0.75,
        reason: 'Sentiment/toxicity classification needed',
        preintel_signature: signature,
        tokens_saved_estimate: Math.floor(prompt.length * 0.6)
      };
    }

    // RAG + LLM
    if (this.matchesKeywords(preprocessed, this.ragKeywords)) {
      return {
        router_version: this.version,
        matched_algorithm: 'rag+llm',
        confidence: 0.8,
        reason: 'Contextual information retrieval required',
        preintel_signature: signature,
        tokens_saved_estimate: 0 // No savings but better accuracy
      };
    }

    // Fallback to LLM
    return {
      router_version: this.version,
      matched_algorithm: 'llm',
      confidence: 0.6,
      reason: 'No specialized algorithm match - direct LLM',
      preintel_signature: signature,
      tokens_saved_estimate: 0
    };
  }

  private preprocessPrompt(prompt: string): string {
    return prompt.toLowerCase().trim();
  }

  private extractEntities(text: string): string[] {
    const entities: string[] = [];
    this.entityPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) entities.push(...matches);
    });
    return [...new Set(entities)];
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  private generateSignature(preprocessed: string, lexicalScore: number, language: string): string {
    const data = `${preprocessed}|${lexicalScore}|${language}`;
    return createHash('sha256').update(data).digest('hex');
  }

  updateMetrics(decision: RouterDecision, actualUsage: string, tokensSaved: number): void {
    if (decision.matched_algorithm !== 'llm') {
      this.metrics.router_llm_bypass_rate += 1;
    }
    
    if (tokensSaved > 0) {
      this.metrics.tokens_saved_by_routing_total += tokensSaved;
    }

    // Track accuracy (requires ground truth)
    if (actualUsage === decision.matched_algorithm) {
      this.metrics.router_accuracy += 1;
    }
  }

  getMetrics(): RouterMetrics {
    return { ...this.metrics };
  }
}