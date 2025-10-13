import http from 'http';

import { Step } from '../types';

export const llmLocalHealthcheckStep: Step = {
  id: '216_llm_local_healthcheck',
  title: 'Qwen Local Healthcheck',
  description: 'Vérifie que le serveur Qwen local répond correctement',
  
  verify: async () => {
    const port = process.env.AI_QWEN_PORT || 8090;
    
    return new Promise((resolve) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: port,
        path: '/health',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        if (res.statusCode === 200) {
          resolve({ success: true, message: `Qwen server actif sur port ${port}` });
        } else {
          resolve({ success: false, message: `Qwen server erreur HTTP ${res.statusCode}` });
        }
      });
      
      req.on('error', () => {
        resolve({ success: false, message: `Qwen server non accessible sur port ${port}` });
      });
      
      req.on('timeout', () => {
        resolve({ success: false, message: 'Timeout connexion Qwen server' });
      });
      
      req.end();
    });
  },
  
  run: async () => {
    console.log('🔍 Vérification santé serveur Qwen...');
    console.log('ℹ️  Assurez-vous que le serveur Qwen est démarré:');
    console.log('   npm run llm:run:qwen');
    
    const result = await this.verify();
    return result;
  }
};