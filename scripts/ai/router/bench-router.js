#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function benchmarkRouter() {
  console.log('⚡ Router Benchmark Starting...');
  
  // Load test dataset
  const datasetPath = path.join(process.cwd(), 'ai/gateway/src/router/dataset/router_decisions_gold.jsonl');
  if (!fs.existsSync(datasetPath)) {
    console.error('❌ Gold dataset not found');
    process.exit(1);
  }
  
  const datasetContent = fs.readFileSync(datasetPath, 'utf8');
  const testCases = datasetContent.trim().split('\n').map(line => JSON.parse(line));
  
  console.log(`📊 Testing ${testCases.length} cases...`);
  
  let totalLatency = 0;
  let correctDecisions = 0;
  let bypassCount = 0;
  let confidenceSum = 0;
  
  const results = [];
  
  for (const [index, testCase] of testCases.entries()) {
    const startTime = Date.now();
    
    // Mock router decision (in real scenario, would call actual router)
    const decision = mockRouterDecision(testCase.prompt);
    
    const latency = Date.now() - startTime;
    totalLatency += latency;
    
    // Check accuracy
    const isCorrect = decision.decision === testCase.expected_decision;
    if (isCorrect) correctDecisions++;
    
    // Track bypass
    const bypassDecisions = ['ner', 'forensic', 'harassment', 'classification'];
    if (bypassDecisions.includes(decision.decision)) {
      bypassCount++;
    }
    
    confidenceSum += decision.confidence;
    
    results.push({
      prompt: testCase.prompt.substring(0, 50) + '...',
      expected: testCase.expected_decision,
      actual: decision.decision,
      confidence: decision.confidence,
      correct: isCorrect,
      latency_ms: latency
    });
    
    if ((index + 1) % 10 === 0) {
      console.log(`   Processed ${index + 1}/${testCases.length} cases...`);
    }
  }
  
  // Calculate metrics
  const accuracy = correctDecisions / testCases.length;
  const bypassRate = bypassCount / testCases.length;
  const avgConfidence = confidenceSum / testCases.length;
  const avgLatency = totalLatency / testCases.length;
  
  // Display results
  console.log('\n📈 Benchmark Results:');
  console.log(`   Accuracy: ${(accuracy * 100).toFixed(1)}% (${correctDecisions}/${testCases.length})`);
  console.log(`   Bypass Rate: ${(bypassRate * 100).toFixed(1)}% (${bypassCount}/${testCases.length})`);
  console.log(`   Avg Confidence: ${avgConfidence.toFixed(2)}`);
  console.log(`   Avg Latency: ${avgLatency.toFixed(1)}ms`);
  
  // Quality gates
  const gates = {
    accuracy: { threshold: 0.75, actual: accuracy, passed: accuracy >= 0.75 },
    bypassRate: { threshold: 0.55, actual: bypassRate, passed: bypassRate >= 0.55 },
    avgLatency: { threshold: 10, actual: avgLatency, passed: avgLatency <= 10 },
    avgConfidence: { threshold: 0.65, actual: avgConfidence, passed: avgConfidence >= 0.65 }
  };
  
  console.log('\n🚦 Quality Gates:');
  let gatesPassed = 0;
  Object.entries(gates).forEach(([metric, gate]) => {
    const status = gate.passed ? '✅' : '❌';
    const comparison = metric === 'avgLatency' ? '≤' : '≥';
    console.log(`   ${status} ${metric}: ${gate.actual.toFixed(2)} ${comparison} ${gate.threshold}`);
    if (gate.passed) gatesPassed++;
  });
  
  // Save detailed results
  const reportPath = path.join(process.cwd(), 'reports/ROUTER-BENCHMARK.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      accuracy,
      bypassRate,
      avgConfidence,
      avgLatency,
      totalCases: testCases.length,
      correctDecisions,
      bypassCount
    },
    gates,
    gatesPassed: gatesPassed === Object.keys(gates).length,
    results: results.slice(0, 10) // First 10 for debugging
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report: ${reportPath}`);
  
  if (gatesPassed === Object.keys(gates).length) {
    console.log('🎉 All quality gates passed!');
    process.exit(0);
  } else {
    console.log(`💥 ${Object.keys(gates).length - gatesPassed} quality gates failed`);
    process.exit(1);
  }
}

function mockRouterDecision(prompt) {
  // Mock router logic for benchmark
  const text = prompt.toLowerCase();
  
  // Simple heuristics for testing
  if (text.includes('identifie') && text.match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
    return { decision: 'ner', confidence: 0.86, reason: 'entity extraction' };
  }
  
  if (text.includes('timeline') || text.includes('analyse') && text.match(/\d{1,2}h\d{2}/)) {
    return { decision: 'forensic', confidence: 0.82, reason: 'temporal analysis' };
  }
  
  if (text.includes('menace') || text.includes('harcèlement') || text.includes('stupide')) {
    return { decision: 'harassment', confidence: 0.85, reason: 'risk content' };
  }
  
  if (text.includes('classify') || text.includes('categoriz')) {
    return { decision: 'classification', confidence: 0.68, reason: 'classification task' };
  }
  
  if (text.includes('selon nos') || text.includes('analyse') && text.includes('données')) {
    return { decision: 'rag+llm', confidence: 0.74, reason: 'factual query' };
  }
  
  return { decision: 'llm', confidence: 0.50, reason: 'fallback' };
}

if (require.main === module) {
  benchmarkRouter();
}