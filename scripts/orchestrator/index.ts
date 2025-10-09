#!/usr/bin/env ts-node
/**
 * AURA OSINT Orchestrator - Main Entry Point
 * Executes steps in order with state management and idempotence
 */

import { StepRegistry } from './step-registry.js';
import { StateManager } from './state-manager.js';
import { Step, StepResult, OrchestratorOptions } from './types.js';

class AuraOrchestrator {
  private registry: StepRegistry;
  private stateManager: StateManager;

  constructor() {
    this.registry = new StepRegistry();
    this.stateManager = new StateManager();
  }

  async run(options: OrchestratorOptions = {}): Promise<void> {
    const { dryRun = false, force = false, stepFilter } = options;
    
    console.log('🚀 AURA OSINT Orchestrator Starting...');
    console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'EXECUTION'}`);
    
    const steps = this.registry.getAllSteps();
    const filteredSteps = stepFilter ? 
      steps.filter(step => step.id.includes(stepFilter)) : steps;
    
    console.log(`📋 Steps to execute: ${filteredSteps.length}`);
    
    for (const step of filteredSteps) {
      await this.executeStep(step, { dryRun, force });
    }
    
    console.log('✅ Orchestrator completed');
  }

  private async executeStep(step: Step, options: { dryRun: boolean; force: boolean }): Promise<void> {
    const { dryRun, force } = options;
    
    console.log(`\n🔍 Step ${step.id}: ${step.title}`);
    
    // Check if already completed (unless force)
    if (!force && this.stateManager.isCompleted(step.id)) {
      console.log(`⏭️  Skipped (already completed)`);
      return;
    }
    
    try {
      // Verify step prerequisites
      const verifyResult = await step.verify();
      
      if (verifyResult.success) {
        console.log(`✅ Verified: ${verifyResult.message}`);
        this.stateManager.markCompleted(step.id, verifyResult);
        return;
      }
      
      console.log(`⚠️  Needs execution: ${verifyResult.message}`);
      
      if (dryRun) {
        console.log(`🔍 DRY-RUN: Would execute step ${step.id}`);
        return;
      }
      
      // Execute step
      console.log(`⚡ Executing...`);
      const runResult = await step.run();
      
      if (runResult.success) {
        console.log(`✅ Success: ${runResult.message}`);
        this.stateManager.markCompleted(step.id, runResult);
      } else {
        console.log(`❌ Failed: ${runResult.message}`);
        throw new Error(`Step ${step.id} failed: ${runResult.message}`);
      }
      
    } catch (error: any) {
      console.log(`💥 Error in step ${step.id}: ${error.message}`);
      this.stateManager.markFailed(step.id, error.message);
      
      if (!step.optional) {
        throw error;
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: OrchestratorOptions = {};
  
  if (args.includes('--dry-run')) options.dryRun = true;
  if (args.includes('--force')) options.force = true;
  
  const filterIndex = args.indexOf('--filter');
  if (filterIndex !== -1 && args[filterIndex + 1]) {
    options.stepFilter = args[filterIndex + 1];
  }
  
  const orchestrator = new AuraOrchestrator();
  
  try {
    await orchestrator.run(options);
    process.exit(0);
  } catch (error: any) {
    console.error('💥 Orchestrator failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AuraOrchestrator };