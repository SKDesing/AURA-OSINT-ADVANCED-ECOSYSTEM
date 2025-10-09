const engine = require('../engine');

// Dataset minimal pour tests
const testCases = [
  // Cas toxiques
  { text: "Je vais te tuer", expected: true, category: "threats" },
  { text: "Tu vas mourir", expected: true, category: "threats" },
  { text: "I will kill you", expected: true, category: "threats" },
  { text: "Tu es un con", expected: true, category: "insults" },
  { text: "You're an idiot", expected: true, category: "insults" },
  { text: "Envoie-moi des nudes", expected: true, category: "sexualHarassment" },
  { text: "Nobody likes you, kill yourself", expected: true, category: "cyberbullying" },
  { text: "Mon email: test@example.com", expected: true, category: "doxxing" },
  { text: "Call me at 0123456789", expected: true, category: "doxxing" },
  { text: "Salope de merde", expected: true, category: "insults" },
  
  // Cas sains
  { text: "Bonjour, comment allez-vous ?", expected: false, category: "normal" },
  { text: "Merci pour votre aide", expected: false, category: "normal" },
  { text: "J'aime ce projet", expected: false, category: "normal" },
  { text: "Pouvez-vous m'aider ?", expected: false, category: "normal" },
  { text: "Bonne journée", expected: false, category: "normal" },
  { text: "C'est intéressant", expected: false, category: "normal" },
  { text: "Je ne comprends pas", expected: false, category: "normal" },
  { text: "Excellent travail", expected: false, category: "normal" },
  { text: "À bientôt", expected: false, category: "normal" },
  { text: "Bonne chance", expected: false, category: "normal" }
];

async function runTests() {
  console.log('🧪 Tests Harassment Engine - AURA OSINT');
  console.log('==========================================');
  
  let passed = 0;
  let failed = 0;
  let totalLatency = 0;
  
  for (const testCase of testCases) {
    const startTime = Date.now();
    
    try {
      const result = await engine.analyze(testCase.text);
      const latency = Date.now() - startTime;
      totalLatency += latency;
      
      const success = result.is_match === testCase.expected;
      
      if (success) {
        passed++;
        console.log(`✅ "${testCase.text.substring(0, 30)}..." - ${latency}ms`);
      } else {
        failed++;
        console.log(`❌ "${testCase.text.substring(0, 30)}..." - Expected: ${testCase.expected}, Got: ${result.is_match}`);
        console.log(`   Score: ${result.score}, Category: ${result.category}, Confidence: ${result.confidence}`);
      }
    } catch (error) {
      failed++;
      console.log(`💥 "${testCase.text.substring(0, 30)}..." - Error: ${error.message}`);
    }
  }
  
  console.log('\n📊 RÉSULTATS');
  console.log('=============');
  console.log(`✅ Réussis: ${passed}/${testCases.length}`);
  console.log(`❌ Échoués: ${failed}/${testCases.length}`);
  console.log(`📈 Précision: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log(`⚡ Latence moyenne: ${(totalLatency / testCases.length).toFixed(0)}ms`);
  
  // Calcul métriques détaillées
  const toxicCases = testCases.filter(t => t.expected === true);
  const safeCases = testCases.filter(t => t.expected === false);
  
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;
  
  for (const testCase of testCases) {
    const result = await engine.analyze(testCase.text);
    
    if (testCase.expected === true && result.is_match === true) truePositives++;
    if (testCase.expected === false && result.is_match === true) falsePositives++;
    if (testCase.expected === false && result.is_match === false) trueNegatives++;
    if (testCase.expected === true && result.is_match === false) falseNegatives++;
  }
  
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  
  console.log(`\n🎯 MÉTRIQUES DÉTAILLÉES`);
  console.log('========================');
  console.log(`Precision: ${(precision * 100).toFixed(1)}% (cible: ≥70%)`);
  console.log(`Recall: ${(recall * 100).toFixed(1)}% (cible: ≥80%)`);
  console.log(`F1-Score: ${(f1 * 100).toFixed(1)}% (cible: ≥75%)`);
  
  // Validation seuils
  const precisionOK = precision >= 0.7;
  const recallOK = recall >= 0.8;
  const f1OK = f1 >= 0.75;
  
  console.log(`\n🏆 VALIDATION SEUILS`);
  console.log('====================');
  console.log(`${precisionOK ? '✅' : '❌'} Precision ≥ 70%`);
  console.log(`${recallOK ? '✅' : '❌'} Recall ≥ 80%`);
  console.log(`${f1OK ? '✅' : '❌'} F1-Score ≥ 75%`);
  
  const allPassed = precisionOK && recallOK && f1OK;
  console.log(`\n${allPassed ? '🎉 TOUS LES SEUILS VALIDÉS' : '⚠️  SEUILS NON ATTEINTS'}`);
  
  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testCases };