import { Injectable } from '@nestjs/common';
import { InputGuardService } from './guardrails/input-guard';
import { OutputGuardService } from './guardrails/output-guard';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const engine = require('../../../ai/engines/harassment/engine');

@Injectable()
export class HarassmentService {
  constructor(
    private readonly inputGuard: InputGuardService,
    private readonly outputGuard: OutputGuardService,
  ) {}

  async analyze(text: string, context: any = {}) {
    // Input validation
    const guardResult = this.inputGuard.validate(text);
    if (guardResult.blocked) {
      return {
        engine: 'harassment',
        engine_version: 'heuristic-1.0.0',
        is_match: false,
        score: 0,
        severity: 0,
        category: 'blocked',
        evidence: [],
        confidence: 0,
        explanation: `Blocked: ${guardResult.reason}`,
        meta: { processing_ms: 0, latency_ms: 0, blocked: true },
      };
    }

    // Analyze harassment
    const result = await engine.analyze(text, context);
    
    // Output filtering
    const filtered = this.outputGuard.filter(result);
    
    return filtered;
  }
}