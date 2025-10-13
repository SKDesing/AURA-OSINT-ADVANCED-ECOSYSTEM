const sherlockWrapper = require('../tools/wrappers/sherlock.wrapper');

async function runTests() {
  console.log('🧪 TEST SUITE: SHERLOCK WRAPPER\n');
  console.log('='.repeat(60));

  // TEST 1: Username valide
  console.log('\n1️⃣ TEST: Username valide (elonmusk)');
  console.log('-'.repeat(60));
  try {
    const test1 = await sherlockWrapper.execute('elonmusk');
    console.log(`✅ Succès: ${test1.success}`);
    console.log(`⏱️  Temps: ${test1.metadata.executionTime}ms`);
    console.log(`🎯 Trouvés: ${test1.metadata.platformsFound || 0}`);
    console.log(`📊 Taux: ${test1.output?.summary?.successRate || '0%'}`);
    
    if (test1.output?.found && test1.output.found.length > 0) {
      console.log('\n📋 Top 10 plateformes:');
      test1.output.found.slice(0, 10).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.platform}: ${p.url}`);
      });
    }
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
  }

  // TEST 2: Username moins commun
  console.log('\n\n2️⃣ TEST: Username moins commun (testuser123)');
  console.log('-'.repeat(60));
  try {
    const test2 = await sherlockWrapper.execute('testuser123');
    console.log(`✅ Succès: ${test2.success}`);
    console.log(`⏱️  Temps: ${test2.metadata.executionTime}ms`);
    console.log(`🎯 Trouvés: ${test2.metadata.platformsFound || 0}`);
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
  }

  // TEST 3: Validation - Username court
  console.log('\n\n3️⃣ TEST: Validation (username trop court)');
  console.log('-'.repeat(60));
  try {
    const test3 = await sherlockWrapper.execute('ab');
    console.log(`❌ Échec attendu: ${!test3.success}`);
    console.log(`🔴 Erreur: ${test3.error}`);
  } catch (error) {
    console.log('✅ Exception capturée');
  }

  // TEST 4: Validation - Caractères invalides
  console.log('\n\n4️⃣ TEST: Validation (caractères invalides)');
  console.log('-'.repeat(60));
  try {
    const test4 = await sherlockWrapper.execute('test@user');
    console.log(`❌ Échec attendu: ${!test4.success}`);
    console.log(`🔴 Erreur: ${test4.error}`);
  } catch (error) {
    console.log('✅ Exception capturée');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 TESTS TERMINÉS');
  console.log('='.repeat(60));
}

// Exécution
runTests()
  .then(() => {
    console.log('\n✅ Tous les tests terminés!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
