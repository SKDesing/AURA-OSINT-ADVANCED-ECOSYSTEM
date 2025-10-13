const axios = require('axios');

async function testAPI() {
  const API_URL = 'http://localhost:3000';

  console.log('🧪 TEST API AURA OSINT\n');
  console.log('='.repeat(60));

  try {
    console.log('\n1️⃣ Health check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅', health.data);

    console.log('\n2️⃣ Liste outils disponibles...');
    const tools = await axios.get(`${API_URL}/api/tools`);
    console.log('✅ Outils:', tools.data.data.available.length);

    console.log('\n3️⃣ Investigation "Chercher elonmusk"...');
    const investigation = await axios.post(`${API_URL}/api/investigate`, {
      query: 'Chercher elonmusk'
    });
    console.log('✅ Session:', investigation.data.data.sessionId);
    console.log('✅ Outils utilisés:', investigation.data.data.tools);
    console.log('✅ Succès:', investigation.data.data.successCount);

    const sessionId = investigation.data.data.sessionId;

    console.log('\n4️⃣ Récupération statut investigation...');
    const status = await axios.get(`${API_URL}/api/investigate/${sessionId}`);
    console.log('✅ Status récupéré');

    console.log('\n5️⃣ Liste toutes investigations...');
    const list = await axios.get(`${API_URL}/api/investigate`);
    console.log('✅ Total investigations:', list.data.data.length);

    console.log('\n' + '='.repeat(60));
    console.log('✅ TOUS LES TESTS API PASSÉS');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
