import http from 'http';

import { Step } from '../types';

export const llmGatewayIntegrationStep: Step = {
  id: '217_llm_gateway_integration',
  title: 'Gateway Qwen Integration',
  description: 'Vérifie l\'intégration gateway AI avec Qwen local',
  
  verify: async () => {
    const gatewayPort = process.env.AI_GATEWAY_PORT || 4010;
    
    return new Promise((resolve) => {
      const testPayload = JSON.stringify({
        prompt: 'Test de connexion AURA',
        max_tokens: 50
      });
      
      const req = http.request({
        hostname: '127.0.0.1',
        port: gatewayPort,
        path: '/ai/local/qwen/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(testPayload)
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status === 'ok' && response.model) {
              resolve({ success: true, message: 'Gateway AI intégré avec succès' });
            } else {
              resolve({ success: false, message: `Réponse gateway invalide: ${data}` });
            }
          } catch (error) {
            resolve({ success: false, message: `Erreur parsing réponse: ${error.message}` });
          }
        });
      });
      
      req.on('error', (error) => {
        resolve({ success: false, message: `Gateway non accessible: ${error.message}` });
      });
      
      req.on('timeout', () => {
        resolve({ success: false, message: 'Timeout gateway AI' });
      });
      
      req.write(testPayload);
      req.end();
    });
  },
  
  run: async () => {
    console.log('🔗 Test intégration Gateway AI...');
    console.log('ℹ️  Assurez-vous que le gateway est démarré:');
    console.log('   npm run ai:gateway');
    
    const result = await this.verify();
    return result;
  }
};