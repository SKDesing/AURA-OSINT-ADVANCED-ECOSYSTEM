/**
 * AURA OSINT Orchestrator - State Manager
 * Manages step execution state and persistence
 */

import fs from 'fs';
import path from 'path';
import { StepResult, StepState } from './types.js';

export class StateManager {
  private stateFile: string;
  private state: Map<string, StepState>;

  constructor() {
    this.stateFile = path.join(process.cwd(), '.orchestrator-state.json');
    this.state = new Map();
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.stateFile)) {
        const data = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        Object.entries(data).forEach(([id, state]) => {
          this.state.set(id, state as StepState);
        });
      }
    } catch (error) {
      console.warn('⚠️  Could not load orchestrator state:', error.message);
    }
  }

  private saveState(): void {
    try {
      const data = Object.fromEntries(this.state);
      fs.writeFileSync(this.stateFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('⚠️  Could not save orchestrator state:', error.message);
    }
  }

  isCompleted(stepId: string): boolean {
    const state = this.state.get(stepId);
    return state?.status === 'completed';
  }

  isFailed(stepId: string): boolean {
    const state = this.state.get(stepId);
    return state?.status === 'failed';
  }

  markCompleted(stepId: string, result: StepResult): void {
    this.state.set(stepId, {
      id: stepId,
      status: 'completed',
      lastRun: new Date(),
      result
    });
    this.saveState();
  }

  markFailed(stepId: string, error: string): void {
    this.state.set(stepId, {
      id: stepId,
      status: 'failed',
      lastRun: new Date(),
      error
    });
    this.saveState();
  }

  getState(stepId: string): StepState | undefined {
    return this.state.get(stepId);
  }

  getAllStates(): StepState[] {
    return Array.from(this.state.values());
  }

  reset(stepId?: string): void {
    if (stepId) {
      this.state.delete(stepId);
    } else {
      this.state.clear();
    }
    this.saveState();
  }
}