/**
 * AURA OSINT Orchestrator - Step Registry
 * Manages and orders all orchestrator steps
 */

import { Step } from './types.js';

// Import steps (will be added as they're created)
// import { prereqStep } from './steps/010_prereq';
// import { securityScanStep } from './steps/020_security_scan_stub';
// import { aiInventoryStep } from './steps/050_ai_inventory';
// import { aiRefactorStep } from './steps/060_ai_refactor_scaffold';
// import { llmLocalSetupStep } from './steps/215_llm_local_setup';
// import { llmLocalHealthcheckStep } from './steps/216_llm_local_healthcheck';
// import { llmGatewayIntegrationStep } from './steps/217_llm_gateway_integration';
// import { llmDatasetCaptureStep } from './steps/218_llm_dataset_capture';

export class StepRegistry {
  private steps: Step[] = [];

  constructor() {
    this.registerSteps();
  }

  private registerSteps(): void {
    // Phase 0: Prerequisites (temporarily disabled for structure validation)
    // this.register(prereqStep);
    // this.register(securityScanStep);
    
    // Phase 1: AI Structure
    // this.register(aiInventoryStep);
    // this.register(aiRefactorStep);
    
    // Phase 2: LLM Setup (marked pending for now)
    // this.register(llmLocalSetupStep);
    // this.register(llmLocalHealthcheckStep);
    // this.register(llmGatewayIntegrationStep);
    // this.register(llmDatasetCaptureStep);
    
    console.log('📋 Step registry initialized (steps temporarily disabled for structure validation)');
  }

  register(step: Step): void {
    this.steps.push(step);
  }

  getAllSteps(): Step[] {
    return this.steps.sort((a, b) => {
      const orderA = a.order || parseInt(a.id.split('_')[0]) || 999;
      const orderB = b.order || parseInt(b.id.split('_')[0]) || 999;
      return orderA - orderB;
    });
  }

  getStep(id: string): Step | undefined {
    return this.steps.find(step => step.id === id);
  }

  getStepsByPhase(phase: string): Step[] {
    return this.steps.filter(step => step.id.includes(phase));
  }
}