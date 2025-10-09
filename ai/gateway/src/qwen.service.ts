import { Injectable } from '@nestjs/common';
import { InputGuardService } from './guardrails/input-guard';
import { OutputGuardService } from './guardrails/output-guard';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { metrics } from './metrics/metrics.registry';
import { preIntelPipeline, PreIntelInput } from './preintel';
import { decisionEngine } from './router/decision-engine';
import { routerBypassTotal, routerConfidenceBucket } from './metrics/ai-metrics';

@Injectable()
export class QwenService {
  private readonly port = process.env.AI_QWEN_PORT || '8090';
  private readonly timeout = parseInt(process.env.AI_QWEN_TIMEOUT_MS || '8000');
  private readonly modelName = 'qwen2-1_5b-instruct-q4_k_m';

  constructor(
    private readonly inputGuard: InputGuardService,
    private readonly outputGuard: OutputGuardService,
  ) {}

  async generate(request: any) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    
    // Input validation
    const guardResult = this.inputGuard.validate(request.prompt);
    if (guardResult.blocked) {
      metrics.aiGuardrailsBlocked.inc({ reason: guardResult.reason });
      metrics.aiRequestTotal.inc({ model: this.modelName, status: 'blocked', engine: 'qwen' });
      
      return {
        status: 'rejected',
        model: this.modelName,
        engine_version: '1.0.0',
        request_id: requestId,
        input_tokens: 0,
        output_tokens: 0,
        latency_ms: Date.now() - startTime,
        content_type: 'free',
        data: { text: '' },
        meta: {
          prompt_hash: this.hashText(request.prompt),
          output_hash: '',
          policy: { blocked: true, reason: guardResult.reason },
          degrade_mode: false
        },
      };
    }

    // Pre-intelligence pipeline
    const preIntelInput: PreIntelInput = {
      text: request.prompt,
      options: {
        enablePruning: true,
        enableSimhash: true,
        enableCache: true
      }
    };
    
    const preIntelResult = await preIntelPipeline.run(preIntelInput);
    const processedPrompt = preIntelResult.processedText;
    
    // Router decision
    const routerDecision = await decisionEngine.decide(
      request.prompt,
      preIntelResult.metadata
    );
    
    // Track router metrics
    routerConfidenceBucket.observe(routerDecision.confidence);
    if (routerDecision.bypass) {
      routerBypassTotal.inc();
    }
    
    try {
      // Check if we can bypass LLM
      if (routerDecision.bypass && routerDecision.confidence >= 0.70) {
        // Handle bypass cases
        const bypassResponse = this.handleBypass(routerDecision, request.prompt);
        if (bypassResponse) {
          const latencyMs = Date.now() - startTime;
          
          metrics.aiRequestTotal.inc({ model: this.modelName, status: 'bypass', engine: 'router' });
          
          return {
            status: 'ok',
            model: this.modelName,
            engine_version: '1.0.0',
            request_id: requestId,
            input_tokens: preIntelResult.metadata.finalTokens,
            output_tokens: 0, // No LLM tokens used
            latency_ms: latencyMs,
            content_type: 'free',
            data: { text: bypassResponse },
            meta: {
              prompt_hash: this.hashText(request.prompt),
              output_hash: this.hashText(bypassResponse),
              policy: { blocked: false },
              degrade_mode: false,
              routing: {
                decision: routerDecision.decision,
                confidence: routerDecision.confidence,
                bypass: true,
                reason: routerDecision.reason,
                features_hash: routerDecision.features_hash
              },
              pre_intel: {
                tokens_saved: preIntelResult.metadata.tokensSaved,
                language: preIntelResult.metadata.languageDetected,
                pruning_applied: preIntelResult.metadata.pruningApplied,
                cache_hit: preIntelResult.metadata.cacheHit,
                processing_time_ms: preIntelResult.metadata.processingTimeMs
              }
            },
          };
        }
      }
      
      // Call llama.cpp HTTP server
      const response = await this.callLlamaCpp({
        prompt: processedPrompt,
        n_predict: request.maxTokens || 256,
        temperature: request.temperature || 0.3,
        stop: ['</s>', '\n\n']
      });
      
      const outputText = response.content || '';
      const latencyMs = Date.now() - startTime;
      
      // Use PreIntel token estimates
      const inputTokens = preIntelResult.metadata.finalTokens;
      const outputTokens = Math.ceil(outputText.length / 4);
      
      // Track tokens saved
      if (preIntelResult.metadata.tokensSaved > 0) {
        metrics.aiTokensSaved?.inc({ model: this.modelName }, preIntelResult.metadata.tokensSaved);
      }
      
      // Metrics
      metrics.aiRequestTotal.inc({ model: this.modelName, status: 'success', engine: 'qwen' });
      metrics.aiLatencyMs.observe({ model: this.modelName, engine: 'qwen' }, latencyMs);
      metrics.aiTokensInput.inc({ model: this.modelName }, inputTokens);
      metrics.aiTokensOutput.inc({ model: this.modelName }, outputTokens);
      
      const result = {
        status: 'ok',
        model: this.modelName,
        engine_version: '1.0.0',
        request_id: requestId,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        latency_ms: latencyMs,
        content_type: 'free',
        data: { text: outputText },
        meta: {
          prompt_hash: this.hashText(request.prompt),
          output_hash: this.hashText(outputText),
          policy: { blocked: false },
          degrade_mode: false,
          routing: {
            decision: routerDecision.decision,
            confidence: routerDecision.confidence,
            bypass: false,
            reason: routerDecision.reason,
            features_hash: routerDecision.features_hash
          },
          pre_intel: {
            tokens_saved: preIntelResult.metadata.tokensSaved,
            language: preIntelResult.metadata.languageDetected,
            pruning_applied: preIntelResult.metadata.pruningApplied,
            cache_hit: preIntelResult.metadata.cacheHit,
            processing_time_ms: preIntelResult.metadata.processingTimeMs
          }
        },
      };
      
      // Dataset capture
      if (process.env.AI_DATASET_CAPTURE === 'true') {
        this.captureInteraction(request, result);
      }
      
      return result;
      
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      metrics.aiRequestTotal.inc({ model: this.modelName, status: 'error', engine: 'qwen' });
      
      return {
        status: 'error',
        model: this.modelName,
        engine_version: '1.0.0',
        request_id: requestId,
        input_tokens: 0,
        output_tokens: 0,
        latency_ms: latencyMs,
        content_type: 'free',
        data: { text: '' },
        meta: {
          prompt_hash: this.hashText(request.prompt),
          output_hash: '',
          policy: { blocked: false },
          degrade_mode: true,
          error: error.message
        },
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`http://127.0.0.1:${this.port}/health`, {
        method: 'GET',
        timeout: 2000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async callLlamaCpp(payload: any): Promise<any> {
    const response = await fetch(`http://127.0.0.1:${this.port}/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      timeout: this.timeout
    });
    
    if (!response.ok) {
      throw new Error(`llama.cpp server error: ${response.status}`);
    }
    
    return response.json();
  }

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
  }

  private handleBypass(routerDecision: any, prompt: string): string | null {
    switch (routerDecision.decision) {
      case 'ner':
        return 'Extraction d\'entités détectée. Utilisez le module NER spécialisé pour de meilleurs résultats.';
      
      case 'forensic':
        return 'Analyse temporelle détectée. Utilisez le module d\'analyse forensique pour une timeline précise.';
      
      case 'harassment':
        return 'Contenu à risque détecté. Cette requête a été bloquée par nos systèmes de sécurité.';
      
      case 'classification':
        return 'Tâche de classification détectée. Utilisez les algorithmes de classification spécialisés.';
      
      default:
        return null; // No bypass available
    }
  }

  private captureInteraction(request: any, response: any) {
    try {
      const captureDir = process.env.AI_DATASET_DIR || 'ai/dataset/captured';
      if (!fs.existsSync(captureDir)) {
        fs.mkdirSync(captureDir, { recursive: true });
      }
      
      const today = new Date().toISOString().split('T')[0];
      const filename = path.join(captureDir, `interactions-${today}.jsonl`);
      
      const entry = {
        timestamp: new Date().toISOString(),
        request_id: response.request_id,
        model: response.model,
        prompt_hash: response.meta.prompt_hash,
        output_hash: response.meta.output_hash,
        input_tokens: response.input_tokens,
        output_tokens: response.output_tokens,
        latency_ms: response.latency_ms,
        status: response.status,
        pre_intel: response.meta.pre_intel || null
      };
      
      fs.appendFileSync(filename, JSON.stringify(entry) + '\n');
    } catch (error) {
      console.error('[AI] Dataset capture failed:', error.message);
    }
  }
}