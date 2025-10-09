import { Injectable } from '@nestjs/common';
import { InputGuardService } from './guardrails/input-guard';
import { OutputGuardService } from './guardrails/output-guard';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { metrics } from './metrics/metrics.registry';
import { assessRisk } from './preintel/risk-lexical';
import { detectLanguage } from './preintel/lang-detector';
import { AlgorithmRouter } from './preintel/algorithm-router';

@Injectable()
export class QwenOptimizedService {
  private readonly port = process.env.AI_QWEN_PORT || '8090';
  private readonly timeout = parseInt(process.env.AI_QWEN_TIMEOUT_MS || '8000');
  private readonly modelName = 'qwen2-1_5b-instruct-q4_k_m';
  private readonly algorithmRouter = new AlgorithmRouter();

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
      return this.createBlockedResponse(requestId, request.prompt, guardResult.reason, startTime);
    }

    // Pre-intelligence analysis
    const riskScore = assessRisk(request.prompt);
    const langDetection = detectLanguage(request.prompt);
    
    // ALGORITHME ROUTING - ÉCONOMIE IA MASSIVE
    const routingDecision = await this.algorithmRouter.route(request.prompt, request.context);
    
    if (routingDecision.useLocal) {
      // Exécution algorithme local (économie massive)
      try {
        const localResult = await this.algorithmRouter.executeLocal(
          routingDecision.algorithm!,
          request.prompt,
          request.context
        );
        
        const latencyMs = Date.now() - startTime;
        const inputTokens = Math.ceil(request.prompt.length / 4);
        
        // Métriques économie
        metrics.aiTokensSaved.inc({ reason: 'algorithm_local' }, routingDecision.estimatedTokensSaved);
        metrics.aiRequestTotal.inc({ model: 'local_algorithm', status: 'success', engine: routingDecision.algorithm! });
        metrics.aiLatencyMs.observe({ model: 'local_algorithm', engine: routingDecision.algorithm! }, latencyMs);
        
        const result = {
          status: 'ok',
          model: 'local_algorithm',
          engine_version: '1.0.0',
          request_id: requestId,
          input_tokens: inputTokens,
          output_tokens: 0, // Pas de génération textuelle
          latency_ms: latencyMs,
          content_type: 'structured',
          data: localResult,
          meta: {
            prompt_hash: this.hashText(request.prompt),
            output_hash: this.hashText(JSON.stringify(localResult)),
            policy: { blocked: false },
            degrade_mode: false,
            algorithm_used: routingDecision.algorithm,
            tokens_saved: routingDecision.estimatedTokensSaved,
            pre_intel: {
              lexical_risk: riskScore,
              language: langDetection,
              routing: routingDecision
            }
          },
        };
        
        if (process.env.AI_DATASET_CAPTURE === 'true') {
          this.captureInteraction(request, result);
        }
        
        return result;
        
      } catch (error) {
        console.warn('[AI] Local algorithm failed, fallback to LLM:', error.message);
        // Continue vers LLM
      }
    }
    
    // Fallback LLM standard
    return this.generateWithLLM(request, requestId, startTime, riskScore, langDetection);
  }

  private async generateWithLLM(request: any, requestId: string, startTime: number, riskScore: any, langDetection: any) {
    try {
      const response = await this.callLlamaCpp({
        prompt: request.prompt,
        n_predict: request.maxTokens || 256,
        temperature: request.temperature || 0.3,
        stop: ['</s>', '\n\n']
      });
      
      const outputText = response.content || '';
      const latencyMs = Date.now() - startTime;
      const inputTokens = Math.ceil(request.prompt.length / 4);
      const outputTokens = Math.ceil(outputText.length / 4);
      
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
          pre_intel: {
            lexical_risk: riskScore,
            language: langDetection
          }
        },
      };
      
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

  private createBlockedResponse(requestId: string, prompt: string, reason: string, startTime: number) {
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
        prompt_hash: this.hashText(prompt),
        output_hash: '',
        policy: { blocked: true, reason },
        degrade_mode: false
      },
    };
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
        algorithm_used: response.meta.algorithm_used || null,
        tokens_saved: response.meta.tokens_saved || 0,
        pre_intel: response.meta.pre_intel || null
      };
      
      fs.appendFileSync(filename, JSON.stringify(entry) + '\n');
    } catch (error) {
      console.error('[AI] Dataset capture failed:', error.message);
    }
  }
}