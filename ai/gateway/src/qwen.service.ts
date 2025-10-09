import { Injectable } from '@nestjs/common';
import { InputGuardService } from './guardrails/input-guard';
import { OutputGuardService } from './guardrails/output-guard';
import { qwenClient } from '../../../ai/adapters/qwen-client';

@Injectable()
export class QwenService {
  constructor(
    private readonly inputGuard: InputGuardService,
    private readonly outputGuard: OutputGuardService,
  ) {}

  async generate(request: any) {
    // Input validation
    const guardResult = this.inputGuard.validate(request.prompt);
    if (guardResult.blocked) {
      return {
        status: 'rejected',
        model: 'qwen2-1_5b-instruct-q4_k_m',
        engine_version: '1.0.0',
        request_id: 'blocked',
        input_tokens: 0,
        output_tokens: 0,
        latency_ms: 0,
        content_type: 'free',
        data: { text: '' },
        meta: {
          prompt_hash: '',
          output_hash: '',
          policy: { blocked: true, reason: guardResult.reason },
        },
      };
    }

    // Generate response
    const response = await qwenClient.generate({
      prompt: request.prompt,
      max_tokens: request.max_tokens,
      temperature: request.temperature,
      structured: request.structured,
    });

    // Output filtering
    const filtered = this.outputGuard.filter(response);
    
    // Dataset capture
    if (process.env.AI_DATASET_CAPTURE === 'true') {
      this.captureInteraction(request, filtered);
    }

    return filtered;
  }

  async healthCheck(): Promise<boolean> {
    return qwenClient.healthCheck();
  }

  private captureInteraction(request: any, response: any) {
    // TODO: Implement dataset capture to JSONL
    console.log('[AI] Dataset capture:', {
      ts: new Date().toISOString(),
      model: response.model,
      latency_ms: response.latency_ms,
      input_tokens: response.input_tokens,
      output_tokens: response.output_tokens,
    });
  }
}