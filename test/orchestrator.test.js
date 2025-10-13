const OsintOrchestrator = require('../orchestrator');

async function testOrchestrator() {
  console.log('🧪 TEST: ORCHESTRATEUR\n');
  console.log('='.repeat(60));

  const orchestrator = new OsintOrchestrator();

  // Test 1: Username
  console.log('\n1️⃣ TEST: Username (elonmusk)');
  console.log('-'.repeat(60));
  const test1 = await orchestrator.investigate({ username: 'elonmusk' });
  
  console.log(`\n✅ Résultat:`);
  console.log(`   Session: ${test1.sessionId}`);
  console.log(`   Outils: ${test1.tools}`);
  console.log(`   Succès: ${test1.successful}/${test1.tools}`);
  console.log(`   Temps: ${test1.totalTime}ms`);

  if (test1.results.Sherlock) {
    const sherlock = test1.results.Sherlock;
    console.log(`\n   Sherlock: ${sherlock.success ? '✅' : '❌'}`);
    if (sherlock.data?.summary) {
      console.log(`      Trouvés: ${sherlock.data.summary.found}`);
    }
  }

  // Test 2: Domain
  console.log('\n\n2️⃣ TEST: Domain (example.com)');
  console.log('-'.repeat(60));
  const test2 = await orchestrator.investigate({ domain: 'example.com' });
  
  console.log(`\n✅ Résultat:`);
  console.log(`   Session: ${test2.sessionId}`);
  console.log(`   Outils: ${test2.tools}`);
  console.log(`   Succès: ${test2.successful}/${test2.tools}`);

  if (test2.results.Subfinder) {
    const subfinder = test2.results.Subfinder;
    console.log(`\n   Subfinder: ${subfinder.success ? '✅' : '❌'}`);
    if (subfinder.data?.summary) {
      console.log(`      Subdomains: ${subfinder.data.summary.total}`);
    }
  }

  // Test 3: Multi-inputs
  console.log('\n\n3️⃣ TEST: Multi-inputs (username + domain)');
  console.log('-'.repeat(60));
  const test3 = await orchestrator.investigate({
    username: 'testuser',
    domain: 'test.com'
  });

  console.log(`\n✅ Résultat:`);
  console.log(`   Outils: ${test3.tools}`);
  console.log(`   Succès: ${test3.successful}/${test3.tools}`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ TESTS TERMINÉS');
}

testOrchestrator()
  .then(() => {
    console.log('\n✅ Orchestrateur opérationnel!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
