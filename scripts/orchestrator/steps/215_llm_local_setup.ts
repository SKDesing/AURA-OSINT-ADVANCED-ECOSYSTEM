import { Step } from '../types';
import { execSync } from 'child_process';
import fs from 'fs';

export const llmLocalSetupStep: Step = {
  id: '215_llm_local_setup',
  title: 'LLM Local Setup - Qwen2 1.5B',
  description: 'Télécharge et configure Qwen2 1.5B Instruct (Q4_K_M) pour usage local',
  
  verify: async () => {
    const modelPath = 'ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf';
    const hashPath = `${modelPath}.sha256`;
    
    if (!fs.existsSync(modelPath)) {
      return { success: false, message: 'Modèle Qwen2 non trouvé' };
    }
    
    if (!fs.existsSync(hashPath)) {
      return { success: false, message: 'Hash SHA256 manquant' };
    }
    
    // Vérification hash
    try {
      const expectedHash = fs.readFileSync(hashPath, 'utf8').trim();
      const actualHash = execSync(`sha256sum ${modelPath} | cut -d' ' -f1`).toString().trim();
      
      if (expectedHash !== actualHash) {
        return { success: false, message: 'Hash mismatch - modèle corrompu' };
      }
    } catch (error) {
      return { success: false, message: `Erreur vérification hash: ${error.message}` };
    }
    
    return { success: true, message: 'Qwen2 1.5B configuré et vérifié' };
  },
  
  run: async () => {
    try {
      console.log('🔽 Téléchargement Qwen2 1.5B Instruct...');
      execSync('npm run llm:download:qwen', { stdio: 'inherit' });
      
      console.log('✅ Qwen2 1.5B installé avec succès');
      return { success: true, message: 'Installation Qwen2 terminée' };
    } catch (error) {
      return { success: false, message: `Erreur installation: ${error.message}` };
    }
  }
};