const AIController = require('../ai-interface/controller');

async function testAIInterface() {
  console.log('🧪 TEST: INTERFACE IA\n');
  console.log('='.repeat(60));

  const ai = new AIController();

  console.log('\n1️⃣ TEST: Requête "Chercher elonmusk"');
  console.log('-'.repeat(60));
  
  const test1 = await ai.startInvestigation('Chercher elonmusk');
  
  console.log('\n\n2️⃣ TEST: Requête "Analyser domain: example.com"');
  console.log('-'.repeat(60));
  
  const test2 = await ai.startInvestigation('Analyser domain: example.com');

  console.log('\n\n3️⃣ TEST: Requête "Username: testuser, Domain: test.com"');
  console.log('-'.repeat(60));
  
  const test3 = await ai.startInvestigation('Username: testuser, Domain: test.com');

  console.log('\n' + '='.repeat(60));
  console.log('✅ TOUS LES TESTS TERMINÉS');
}

testAIInterface().catch(console.error);
