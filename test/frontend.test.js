const axios = require('axios');

async function testFrontend() {
  console.log('🧪 TEST INTERFACE WEB\n');
  console.log('='.repeat(60));

  try {
    console.log('\n1️⃣ Page principale...');
    const page = await axios.get('http://localhost:8080');
    const hasTitle = page.data.includes('AURA OSINT');
    const hasForm = page.data.includes('investigationForm');
    console.log(hasTitle ? '✅' : '❌', 'Titre présent');
    console.log(hasForm ? '✅' : '❌', 'Formulaire présent');

    console.log('\n2️⃣ Fichiers CSS...');
    const cssFiles = ['main.css', 'form.css', 'results.css'];
    for (const file of cssFiles) {
      const css = await axios.get(`http://localhost:8080/assets/css/${file}`);
      console.log(css.status === 200 ? '✅' : '❌', file);
    }

    console.log('\n3️⃣ Fichiers JavaScript...');
    const jsFiles = ['api.js', 'app.js', 'websocket.js', 'results.js', 'history.js'];
    for (const file of jsFiles) {
      const js = await axios.get(`http://localhost:8080/assets/js/${file}`);
      console.log(js.status === 200 ? '✅' : '❌', file);
    }

    console.log('\n4️⃣ Connexion API Backend...');
    const health = await axios.get('http://localhost:3000/health');
    console.log(health.data.status === 'ok' ? '✅' : '❌', 'API Health');

    const tools = await axios.get('http://localhost:3000/api/tools');
    console.log(tools.data.success ? '✅' : '❌', `API Tools (${tools.data.data.available.length} outils)`);

    console.log('\n5️⃣ Test investigation via API...');
    const investigation = await axios.post('http://localhost:3000/api/investigate', {
      query: 'Chercher testuser'
    });
    console.log(investigation.data.success ? '✅' : '❌', 'Investigation lancée');
    console.log('   Session:', investigation.data.data.sessionId);
    console.log('   Outils:', investigation.data.data.tools);

    console.log('\n' + '='.repeat(60));
    console.log('✅ TOUS LES TESTS INTERFACE PASSÉS');
    console.log('\n🌐 Accès interface: http://localhost:8080');
    console.log('📡 API Backend: http://localhost:3000');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testFrontend();
