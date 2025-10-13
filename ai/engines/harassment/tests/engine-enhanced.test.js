const fs = require('fs');
const path = require('path');

const engine = require('../engine');

// Load real OSINT dataset
function loadDataset() {
  const datasetPath = path.join(__dirname, 'dataset-sample.jsonl');
  const lines = fs.readFileSync(datasetPath, 'utf8').trim().split('\n');
  return lines.map(line => JSON.parse(line));
}

async function runEnhancedTests() {
  console.log('🧪 AURA Harassment Engine Tests - OSINT Enhanced Dataset');
  console.log('========================================================');
  
  const dataset = loadDataset();
  let passed = 0;
  let failed = 0;
  let totalLatency = 0;
  
  // Metrics tracking
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;
  
  for (const testCase of dataset) {
    const startTime = Date.now();
    
    try {
      const result = await engine.analyze(testCase.text);
      const latency = Date.now() - startTime;
      totalLatency += latency;
      
      const expected = testCase.label === 'harassment';
      const actual = result.is_match;
      
      // Update confusion matrix
      if (expected && actual) truePositives++;
      else if (!expected && actual) falsePositives++;
      else if (!expected && !actual) trueNegatives++;
      else if (expected && !actual) falseNegatives++;
      
      const success = actual === expected;
      
      if (success) {
        passed++;
        console.log(`✅ "${testCase.text.substring(0, 30)}..." [${testCase.platform}] - ${latency}ms`);
      } else {
        failed++;
        console.log(`❌ "${testCase.text.substring(0, 30)}..." [${testCase.platform}] - Expected: ${expected}, Got: ${actual}`);
        console.log(`   Category: ${result.category}, Score: ${result.score}, Confidence: ${result.confidence}`);
      }
    } catch (error) {
      failed++;
      console.log(`💥 "${testCase.text.substring(0, 30)}..." - Error: ${error.message}`);
    }
  }
  
  // Calculate metrics
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  const accuracy = (truePositives + trueNegatives) / dataset.length;
  
  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('====================');
  console.log(`✅ Réussis: ${passed}/${dataset.length}`);
  console.log(`❌ Échoués: ${failed}/${dataset.length}`);
  console.log(`📈 Accuracy: ${(accuracy * 100).toFixed(1)}%`);
  console.log(`⚡ Latence moyenne: ${(totalLatency / dataset.length).toFixed(0)}ms`);
  
  console.log('\n🎯 MÉTRIQUES OSINT AURA');
  console.log('========================');
  console.log(`Precision: ${(precision * 100).toFixed(1)}% (cible: ≥70%)`);
  console.log(`Recall: ${(recall * 100).toFixed(1)}% (cible: ≥80%)`);
  console.log(`F1-Score: ${(f1 * 100).toFixed(1)}% (cible: ≥75%)`);
  
  // Platform breakdown
  const platforms = [...new Set(dataset.map(d => d.platform))];
  console.log('\n🌐 RÉPARTITION PAR PLATEFORME');
  console.log('==============================');
  for (const platform of platforms) {
    const platformData = dataset.filter(d => d.platform === platform);
    const platformCount = platformData.length;
    console.log(`${platform.toUpperCase()}: ${platformCount} échantillons`);
  }
  
  // Validation seuils AURA
  const precisionOK = precision >= 0.7;
  const recallOK = recall >= 0.8;
  const f1OK = f1 >= 0.75;
  
  console.log('\n🏆 VALIDATION SEUILS AURA');
  console.log('===========================');
  console.log(`${precisionOK ? '✅' : '❌'} Precision ≥ 70%`);
  console.log(`${recallOK ? '✅' : '❌'} Recall ≥ 80%`);
  console.log(`${f1OK ? '✅' : '❌'} F1-Score ≥ 75%`);
  
  const allPassed = precisionOK && recallOK && f1OK;
  console.log(`\n${allPassed ? '🎉 SEUILS AURA VALIDÉS' : '⚠️  AMÉLIORATION REQUISE'}`);
  
  return {
    passed,
    failed,
    precision,
    recall,
    f1,
    accuracy,
    avgLatency: totalLatency / dataset.length,
    meetsTargets: allPassed
  };
}

if (require.main === module) {
  runEnhancedTests().then(results => {
    process.exit(results.meetsTargets ? 0 : 1);
  }).catch(console.error);
}

module.exports = { runEnhancedTests, loadDataset };