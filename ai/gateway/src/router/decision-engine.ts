import { RouterFeatures, FeatureExtractor } from './features';
import { sha256 } from '../../../../packages/shared/src/utils/hash';
import { routerDecisionTotal } from '../metrics/ai-metrics';
import fs from 'fs';
import path from 'path';

export interface RouterDecision {
  decision: string;
  confidence: number;
  bypass: boolean;
  reason: string;
  features_hash: string;
  features: RouterFeatures;
  rule_id?: string;
}

interface RouterRule {
  id: string;
  if: Record<string, any>;
  decision: string;
  confidence: number;
  reason: string;
}

interface RouterConfig {
  version: string;
  rules_hash: string;
  rules: RouterRule[];
  fallback: {
    decision: string;
    confidence: number;
    reason: string;
  };
  settings: {
    min_confidence_threshold: number;
    enable_fallback: boolean;
    log_decisions: boolean;
  };
}

export class DecisionEngine {
  private config: RouterConfig;
  private featureExtractor: FeatureExtractor;
  private decisionsLog: any[] = [];

  constructor() {
    this.featureExtractor = new FeatureExtractor();
    this.loadConfig();
  }

  async decide(text: string, preIntelMeta?: any, simulate = false): Promise<RouterDecision> {
    const features = await this.featureExtractor.extract(text, preIntelMeta);
    const featuresHash = this.featureExtractor.hashFeatures(features);

    // Apply rules in order
    for (const rule of this.config.rules) {
      if (this.matchesRule(features, rule)) {
        const decision: RouterDecision = {
          decision: rule.decision,
          confidence: rule.confidence,
          bypass: rule.decision !== 'llm' && rule.decision !== 'rag+llm',
          reason: rule.reason,
          features_hash: featuresHash,
          features,
          rule_id: rule.id
        };

        // Check confidence threshold
        if (decision.confidence < this.config.settings.min_confidence_threshold) {
          continue; // Try next rule
        }

        this.logDecision(decision, simulate);
        return decision;
      }
    }

    // Fallback
    const fallbackDecision: RouterDecision = {
      decision: this.config.fallback.decision,
      confidence: this.config.fallback.confidence,
      bypass: false,
      reason: this.config.fallback.reason,
      features_hash: featuresHash,
      features
    };

    this.logDecision(fallbackDecision, simulate);
    return fallbackDecision;
  }

  private matchesRule(features: RouterFeatures, rule: RouterRule): boolean {
    for (const [key, condition] of Object.entries(rule.if)) {
      const featureValue = (features as any)[key];
      
      if (!this.evaluateCondition(featureValue, condition)) {
        return false;
      }
    }
    return true;
  }

  private evaluateCondition(value: any, condition: any): boolean {
    if (typeof condition === 'string') {
      if (condition.startsWith('>=')) {
        const threshold = parseFloat(condition.substring(2));
        return typeof value === 'number' && value >= threshold;
      }
      if (condition.startsWith('<=')) {
        const threshold = parseFloat(condition.substring(2));
        return typeof value === 'number' && value <= threshold;
      }
      if (condition.startsWith('>')) {
        const threshold = parseFloat(condition.substring(1));
        return typeof value === 'number' && value > threshold;
      }
      if (condition.startsWith('<')) {
        const threshold = parseFloat(condition.substring(1));
        return typeof value === 'number' && value < threshold;
      }
      if (condition.startsWith('!')) {
        const expectedValue = condition.substring(1);
        return value !== expectedValue;
      }
      return value === condition;
    }
    
    if (typeof condition === 'boolean') {
      return value === condition;
    }
    
    if (typeof condition === 'number') {
      return value === condition;
    }
    
    return false;
  }

  private logDecision(decision: RouterDecision, simulate: boolean): void {
    // Metrics
    if (!simulate) {
      routerDecisionTotal.inc({ 
        decision: decision.decision, 
        bypass: decision.bypass.toString() 
      });
    }

    // Decision log
    if (this.config.settings.log_decisions) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        decision: decision.decision,
        confidence: decision.confidence,
        bypass: decision.bypass,
        reason: decision.reason,
        rule_id: decision.rule_id,
        features_hash: decision.features_hash,
        simulate
      };

      this.decisionsLog.push(logEntry);

      // Persist to file periodically
      if (this.decisionsLog.length >= 100) {
        this.flushDecisionLog();
      }
    }
  }

  private flushDecisionLog(): void {
    try {
      const logDir = path.join(process.cwd(), 'logs/router');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(logDir, `router-decisions-${today}.jsonl`);

      const logLines = this.decisionsLog.map(entry => JSON.stringify(entry)).join('\n') + '\n';
      fs.appendFileSync(logFile, logLines);

      this.decisionsLog = [];
    } catch (error) {
      console.error('[Router] Failed to flush decision log:', error.message);
    }
  }

  private loadConfig(): void {
    try {
      const configPath = path.join(__dirname, 'router-rules.json');
      const configContent = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configContent);
    } catch (error) {
      console.error('[Router] Failed to load config, using defaults:', error.message);
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): RouterConfig {
    return {
      version: '1.0.0',
      rules_hash: 'default',
      rules: [],
      fallback: {
        decision: 'llm',
        confidence: 0.50,
        reason: 'default fallback'
      },
      settings: {
        min_confidence_threshold: 0.60,
        enable_fallback: true,
        log_decisions: true
      }
    };
  }

  getStats(): { totalDecisions: number; bypassRate: number; avgConfidence: number } {
    if (this.decisionsLog.length === 0) {
      return { totalDecisions: 0, bypassRate: 0, avgConfidence: 0 };
    }

    const bypasses = this.decisionsLog.filter(d => d.bypass).length;
    const avgConfidence = this.decisionsLog.reduce((sum, d) => sum + d.confidence, 0) / this.decisionsLog.length;

    return {
      totalDecisions: this.decisionsLog.length,
      bypassRate: bypasses / this.decisionsLog.length,
      avgConfidence
    };
  }

  // Force flush for shutdown
  shutdown(): void {
    if (this.decisionsLog.length > 0) {
      this.flushDecisionLog();
    }
  }
}

// Singleton instance
export const decisionEngine = new DecisionEngine();