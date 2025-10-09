#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TEST_PROMPTS = [
  {
    text: "What is the weather like today?",
    expectedLang: "en",
    expectPruning: false
  },
  {
    text: "This is basically a test with actually some filler words you know like literally.",
    expectedLang: "en", 
    expectPruning: true
  },
  {
    text: "Quel temps fait-il aujourd'hui dans le monde?",
    expectedLang: "fr",
    expectPruning: false
  }
];

async function validatePreIntel() {
  console.log('🧪 PreIntel Pipeline Validation Starting...');
  
  try {
    // Import the pipeline (would need proper module resolution in real scenario)
    const { PreIntelPipeline } = require('../ai/gateway/src/preintel/index.ts');
    const pipeline = new PreIntelPipeline();
    
    let passed = 0;
    let failed = 0;
    
    for (const [index, testCase] of TEST_PROMPTS.entries()) {
      console.log(`\n📝 Test ${index + 1}: "${testCase.text.substring(0, 50)}..."`);
      
      try {
        const result = await pipeline.run({ text: testCase.text });
        
        // Validate language detection
        if (result.metadata.languageDetected === testCase.expectedLang) {
          console.log(`✅ Language detection: ${result.metadata.languageDetected}`);
        } else {
          console.log(`❌ Language detection: expected ${testCase.expectedLang}, got ${result.metadata.languageDetected}`);
          failed++;
          continue;
        }
        
        // Validate pruning
        if (result.metadata.pruningApplied === testCase.expectPruning) {
          console.log(`✅ Pruning: ${result.metadata.pruningApplied ? 'applied' : 'not applied'}`);
        } else {
          console.log(`❌ Pruning: expected ${testCase.expectPruning}, got ${result.metadata.pruningApplied}`);
          failed++;
          continue;
        }
        
        // Validate basic properties
        if (result.metadata.originalTokens > 0 && result.hash) {
          console.log(`✅ Metadata: ${result.metadata.originalTokens} tokens, hash ${result.hash.substring(0, 8)}...`);
        } else {
          console.log(`❌ Invalid metadata`);
          failed++;
          continue;
        }
        
        passed++;
        
      } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
        failed++;
      }
    }
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      console.log('🎉 All PreIntel validation tests passed!');
      process.exit(0);
    } else {
      console.log('💥 Some PreIntel validation tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ PreIntel validation setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  validatePreIntel();
}