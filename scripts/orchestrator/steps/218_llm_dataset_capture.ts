import fs from 'fs';
import path from 'path';

import { Step } from '../types';

export const llmDatasetCaptureStep: Step = {
  id: '218_llm_dataset_capture',
  title: 'LLM Dataset Capture Check',
  description: 'Vérifie la configuration de capture dataset pour fine-tuning futur',
  
  verify: async () => {
    const captureDir = 'ai/dataset/captured';
    const schemaFile = 'ai/dataset/schema/interaction.schema.json';
    
    if (!fs.existsSync(captureDir)) {
      return { success: false, message: 'Répertoire capture dataset manquant' };
    }
    
    if (!fs.existsSync(schemaFile)) {
      return { success: false, message: 'Schema interaction manquant' };
    }
    
    // Vérifier permissions écriture
    try {
      const testFile = path.join(captureDir, 'test-write.tmp');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    } catch (error) {
      return { success: false, message: 'Permissions écriture dataset insuffisantes' };
    }
    
    // Vérifier variables d'environnement
    const captureEnabled = process.env.AI_DATASET_CAPTURE;
    const logPrompts = process.env.AI_LOG_PROMPTS;
    
    return { 
      success: true, 
      message: `Dataset capture configuré (enabled=${captureEnabled}, log_prompts=${logPrompts})` 
    };
  },
  
  run: async () => {
    console.log('📊 Configuration capture dataset...');
    
    // Créer fichier de test
    const today = new Date().toISOString().split('T')[0];
    const testFile = `ai/dataset/captured/interactions-${today}.jsonl`;
    
    const testInteraction = {
      ts: new Date().toISOString(),
      request_id: 'test-setup',
      model: 'qwen2-1_5b-instruct-q4_k_m',
      prompt_hash: 'sha256:test',
      output_hash: 'sha256:test',
      task_type: 'internal_test',
      tags: ['setup', 'test'],
      latency_ms: 0,
      input_tokens: 0,
      output_tokens: 0,
      blocked: false
    };
    
    try {
      fs.appendFileSync(testFile, JSON.stringify(testInteraction) + '\n');
      console.log(`✅ Test capture écrit: ${testFile}`);
      
      return { success: true, message: 'Dataset capture opérationnel' };
    } catch (error) {
      return { success: false, message: `Erreur test capture: ${error.message}` };
    }
  }
};