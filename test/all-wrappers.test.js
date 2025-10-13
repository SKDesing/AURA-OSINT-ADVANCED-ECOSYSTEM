const sherlock = require('../tools/wrappers/sherlock.wrapper');
const holehe = require('../tools/wrappers/holehe.wrapper');
const maigret = require('../tools/wrappers/maigret.wrapper');
const amass = require('../tools/wrappers/amass.wrapper');
const subfinder = require('../tools/wrappers/subfinder.wrapper');

async function testAllWrappers() {
  console.log('🧪 TEST SUITE: TOUS LES WRAPPERS\n');
  console.log('='.repeat(60));

  const results = [];

  // Test 1: Sherlock
  console.log('\n1️⃣ SHERLOCK (Username)');
  console.log('-'.repeat(60));
  try {
    const r1 = await sherlock.execute('elonmusk');
    results.push({ tool: 'sherlock', success: r1.success, found: r1.output?.summary?.found || 0 });
    console.log(`   ${r1.success ? '✅' : '❌'} ${r1.output?.summary?.found || 0} résultats`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.push({ tool: 'sherlock', success: false, found: 0 });
  }

  // Test 2: Holehe
  console.log('\n2️⃣ HOLEHE (Email)');
  console.log('-'.repeat(60));
  try {
    const r2 = await holehe.execute({ email: 'test@example.com' });
    results.push({ tool: 'holehe', success: r2.success, found: r2.output?.summary?.found || 0 });
    console.log(`   ${r2.success ? '✅' : '❌'} ${r2.output?.summary?.found || 0} résultats`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.push({ tool: 'holehe', success: false, found: 0 });
  }

  // Test 3: Maigret
  console.log('\n3️⃣ MAIGRET (Username)');
  console.log('-'.repeat(60));
  try {
    const r3 = await maigret.execute({ username: 'elonmusk' });
    results.push({ tool: 'maigret', success: r3.success, found: r3.output?.summary?.found || 0 });
    console.log(`   ${r3.success ? '✅' : '❌'} ${r3.output?.summary?.found || 0} résultats`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.push({ tool: 'maigret', success: false, found: 0 });
  }

  // Test 4: Amass
  console.log('\n4️⃣ AMASS (Domain)');
  console.log('-'.repeat(60));
  try {
    const r4 = await amass.execute({ domain: 'example.com' });
    results.push({ tool: 'amass', success: r4.success, found: r4.output?.summary?.total || 0 });
    console.log(`   ${r4.success ? '✅' : '❌'} ${r4.output?.summary?.total || 0} subdomains`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.push({ tool: 'amass', success: false, found: 0 });
  }

  // Test 5: Subfinder
  console.log('\n5️⃣ SUBFINDER (Domain)');
  console.log('-'.repeat(60));
  try {
    const r5 = await subfinder.execute({ domain: 'example.com' });
    results.push({ tool: 'subfinder', success: r5.success, found: r5.output?.summary?.total || 0 });
    console.log(`   ${r5.success ? '✅' : '❌'} ${r5.output?.summary?.total || 0} subdomains`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    results.push({ tool: 'subfinder', success: false, found: 0 });
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ ${successCount}/5 outils fonctionnels\n`);
  
  results.forEach(r => {
    console.log(`   ${r.tool.padEnd(15)} ${r.success ? '✅' : '❌'} ${r.found} résultats`);
  });
}

testAllWrappers()
  .then(() => {
    console.log('\n✅ Tests terminés!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });
