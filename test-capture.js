// Script de test pour vérifier la capture TikTok
const axios = require('axios');

async function testCapture() {
  console.log('🧪 Test de la capture TikTok...');
  
  try {
    // Test 1: Créer une session
    console.log('📝 Création d\'une session de test...');
    const response = await axios.post('http://localhost:3002/api/sessions', {
      url: 'https://www.tiktok.com/@test/live',
      title: 'Test Capture'
    });
    
    console.log('✅ Session créée:', response.data);
    
    // Test 2: Vérifier les processus
    setTimeout(() => {
      console.log('🔍 Vérifiez les logs du backend avec: docker logs aura_backend --tail 20');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testCapture();