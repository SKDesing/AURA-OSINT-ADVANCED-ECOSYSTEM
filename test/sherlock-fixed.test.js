const sherlockWrapper = require('../tools/wrappers/sherlock.wrapper');

async function quickTest() {
  console.log('🧪 TEST RAPIDE: Parsing corrigé\n');
  console.log('='.repeat(60));

  console.log('\n🔍 Test: elonmusk');
  console.log('-'.repeat(60));

  const result = await sherlockWrapper.execute('elonmusk', { timeout: 10 });

  if (result.success) {
    console.log('\n✅ SUCCÈS!');
    console.log(`⏱️  Temps: ${result.metadata.executionTime}ms`);
    console.log(`🎯 Trouvés: ${result.output.summary.found}`);
    console.log(`📊 Taux: ${result.output.summary.successRate}`);

    if (result.output.found.length > 0) {
      console.log('\n📋 Top 15 résultats:');
      result.output.found.slice(0, 15).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.platform}: ${p.url}`);
      });
    }

    // Export
    const fs = require('fs').promises;
    await fs.writeFile(
      '/tmp/sherlock-result-fixed.json',
      JSON.stringify(result, null, 2)
    );
    console.log('\n💾 Résultat: /tmp/sherlock-result-fixed.json');
  } else {
    console.error(`\n❌ ÉCHEC: ${result.error}`);
  }
}

quickTest()
  .then(() => {
    console.log('\n✅ Test terminé!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
