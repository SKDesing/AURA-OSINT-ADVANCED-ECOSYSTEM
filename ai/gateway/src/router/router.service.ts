import { Injectable } from '@nestjs/common';
import { AlgorithmRouter, RouterDecision } from '../../../router/algorithm-router';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class RouterService {
  private router = new AlgorithmRouter();

  constructor(private metricsService: MetricsService) {}

  async makeDecision(prompt: string, lexicalScore: number, language: string): Promise<RouterDecision> {
    const decision = this.router.decide(prompt, lexicalScore, language);
    
    // Update metrics
    this.metricsService.incrementCounter('ai_router_decision_total', { decision: decision.matched_algorithm });
    
    if (decision.tokens_saved_estimate && decision.tokens_saved_estimate > 0) {
      this.metricsService.incrementCounter('ai_router_tokens_saved_total', {}, decision.tokens_saved_estimate);
    }

    return decision;
  }

  async getMetrics() {
    return this.router.getMetrics();
  }

  async diagnose(prompt: string, expectedAlgorithm?: string) {
    const decision = this.router.decide(prompt, 0.3, 'fr');
    
    return {
      decision,
      expected: expectedAlgorithm,
      match: expectedAlgorithm ? decision.matched_algorithm === expectedAlgorithm : null,
      debug: {
        prompt_length: prompt.length,
        entities_detected: decision.extraction_entities?.length || 0,
        confidence_level: decision.confidence > 0.8 ? 'high' : decision.confidence > 0.6 ? 'medium' : 'low'
      }
    };
  }
}