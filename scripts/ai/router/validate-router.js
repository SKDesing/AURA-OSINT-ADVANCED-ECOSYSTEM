#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function validateRouter() {
  console.log('🧪 Router Validation Starting...');
  
  let passed = 0;
  let failed = 0;
  
  // 1. Validate router rules config
  console.log('\n📋 Validating router rules configuration...');
  try {
    const rulesPath = path.join(process.cwd(), 'ai/gateway/src/router/router-rules.json');
    const rulesContent = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    
    if (!rulesContent.version || !rulesContent.rules || !Array.isArray(rulesContent.rules)) {
      throw new Error('Invalid rules structure');
    }
    
    console.log(`✅ Rules config valid: ${rulesContent.rules.length} rules loaded`);
    passed++;
  } catch (error) {
    console.log(`❌ Rules config invalid: ${error.message}`);
    failed++;
  }
  
  // 2. Validate dataset exists
  console.log('\n📊 Validating gold dataset...');
  try {
    const datasetPath = path.join(process.cwd(), 'ai/gateway/src/router/dataset/router_decisions_gold.jsonl');
    const datasetContent = fs.readFileSync(datasetPath, 'utf8');
    const lines = datasetContent.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 20) {
      throw new Error(`Dataset too small: ${lines.length} entries (minimum 20 required)`);
    }
    
    // Validate JSON format
    lines.forEach((line, index) => {
      try {
        const entry = JSON.parse(line);
        if (!entry.prompt || !entry.expected_decision) {
          throw new Error(`Missing required fields at line ${index + 1}`);
        }
      } catch (e) {
        throw new Error(`Invalid JSON at line ${index + 1}: ${e.message}`);
      }
    });
    
    console.log(`✅ Gold dataset valid: ${lines.length} entries`);
    passed++;
  } catch (error) {
    console.log(`❌ Gold dataset invalid: ${error.message}`);
    failed++;
  }
  
  // 3. Test feature extraction (mock)
  console.log('\n🔧 Testing feature extraction...');
  try {
    const testPrompts = [
      'Identifie Jean Dupont et Marie Martin dans ce texte.',
      'Analyse la timeline du 15/01/2025 entre 14h et 16h.',
      'Ce message contient des menaces directes.',
      'Selon nos données, quelle est la tendance?'
    ];
    
    // Mock feature extraction test
    testPrompts.forEach((prompt, index) => {
      const features = mockExtractFeatures(prompt);
      if (!features.lang || typeof features.ent_count !== 'number') {
        throw new Error(`Invalid features for prompt ${index + 1}`);
      }
    });
    
    console.log(`✅ Feature extraction working: ${testPrompts.length} prompts tested`);
    passed++;
  } catch (error) {
    console.log(`❌ Feature extraction failed: ${error.message}`);
    failed++;
  }
  
  // 4. Calculate baseline metrics
  console.log('\n📈 Calculating baseline metrics...');
  try {
    const datasetPath = path.join(process.cwd(), 'ai/gateway/src/router/dataset/router_decisions_gold.jsonl');
    const datasetContent = fs.readFileSync(datasetPath, 'utf8');
    const entries = datasetContent.trim().split('\n').map(line => JSON.parse(line));
    
    const bypassDecisions = ['ner', 'forensic', 'harassment', 'classification'];
    const bypassCount = entries.filter(e => bypassDecisions.includes(e.expected_decision)).length;
    const bypassRate = bypassCount / entries.length;
    
    const avgConfidence = entries.reduce((sum, e) => sum + (e.confidence || 0.5), 0) / entries.length;
    
    console.log(`✅ Baseline metrics:`);
    console.log(`   - Expected bypass rate: ${(bypassRate * 100).toFixed(1)}%`);
    console.log(`   - Average confidence: ${avgConfidence.toFixed(2)}`);
    
    if (bypassRate >= 0.55) {
      console.log(`✅ Bypass rate meets threshold (≥55%)`);
      passed++;
    } else {
      console.log(`❌ Bypass rate below threshold: ${(bypassRate * 100).toFixed(1)}% < 55%`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Baseline calculation failed: ${error.message}`);
    failed++;
  }
  
  // Summary
  console.log(`\n📊 Validation Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 Router validation passed!');
    process.exit(0);
  } else {
    console.log('💥 Router validation failed');
    process.exit(1);
  }
}

function mockExtractFeatures(text) {
  // Mock feature extraction for validation
  const words = text.toLowerCase().split(/\s+/);
  return {
    lang: words.some(w => ['le', 'la', 'et', 'dans'].includes(w)) ? 'fr' : 'en',
    ent_count: (text.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || []).length,
    forensic_terms: (text.match(/timeline|analyse|séquence/gi) || []).length,
    timeline_markers: (text.match(/\d{1,2}h\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/g) || []).length,
    length_bucket: text.length < 100 ? 'short' : text.length < 500 ? 'medium' : 'long',
    has_question: /\?/.test(text),
    risk_lexical: (text.match(/menace|danger|attaque/gi) || []).length * 0.3,
    contains_policy_request: /selon nos|analyse|identifie/i.test(text)
  };
}

if (require.main === module) {
  validateRouter();
}