/**
 * AURA OSINT Orchestrator - Type Definitions
 */

export interface StepResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  order?: number;
  optional?: boolean;
  verify(): Promise<StepResult>;
  run(): Promise<StepResult>;
}

export interface OrchestratorOptions {
  dryRun?: boolean;
  force?: boolean;
  stepFilter?: string;
}

export interface StepState {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  lastRun?: Date;
  result?: StepResult;
  error?: string;
}