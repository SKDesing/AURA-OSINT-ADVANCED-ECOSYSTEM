#!/usr/bin/env node

const axios = require('axios');

async function testQwen() {
  console.log('🧪 Test de Qwen AI...');
  
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'qwen2.5:latest',
      prompt: `Tu es un assistant OSINT expert. Analyse cette requête et extrais l'intent en JSON:
{
  "type": "profile|domain|person|hashtag",
  "target": "cible_principale", 
  "platforms": ["tiktok", "instagram"],
  "depth": "quick|standard|deep"
}

Requête utilisateur: "Analyser le profil TikTok @johndoe"`,
      stream: false,
      options: {
        temperature: 0.1,
        max_tokens: 500
      }
    });
    
    console.log('✅ Qwen répond:');
    console.log(response.data.response);
    
  } catch (error) {
    console.log('❌ Erreur Qwen:', error.message);
    console.log('💡 Assurez-vous que Ollama est démarré: ./start-qwen.sh');
  }
}

testQwen();