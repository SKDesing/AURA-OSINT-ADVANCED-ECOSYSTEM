import { Step } from '../types';
import fs from 'fs';
import path from 'path';

export const aiRefactorStep: Step = {
  id: '060_ai_refactor_scaffold',
  title: 'AI Structure Scaffold',
  description: 'Create AI directory structure and move legacy components',
  order: 60,
  
  verify: async () => {
    const requiredDirs = [
      'ai/engines/harassment',
      'ai/gateway/src',
      'ai/dataset/captured',
      'ai/guardrails'
    ];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        return { success: false, message: `Missing directory: ${dir}` };
      }
    }
    
    // Check if harassment engine was moved
    if (!fs.existsSync('ai/engines/harassment/engine-legacy.js')) {
      return { success: false, message: 'Harassment engine not migrated' };
    }
    
    // Check if wrapper exists
    if (!fs.existsSync('ai/engines/harassment/engine.js')) {
      return { success: false, message: 'Engine wrapper missing' };
    }
    
    return { success: true, message: 'AI structure scaffold completed' };
  },
  
  run: async () => {
    console.log('🏗️  Creating AI directory structure...');
    
    // Create directory structure
    const dirs = [
      'ai/engines/harassment/tests',
      'ai/engines/harassment/pipelines',
      'ai/gateway/src/guardrails',
      'ai/local-llm/models',
      'ai/local-llm/scripts', 
      'ai/local-llm/runtime',
      'ai/local-llm/prompt-templates',
      'ai/adapters',
      'ai/dataset/captured',
      'ai/dataset/schema',
      'ai/guardrails',
      'ai/vector/migrations',
      'ai/evaluation/datasets',
      'ai/evaluation/reports',
      'ai/audit'
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created ${dir}`);
      }
    }
    
    // Move harassment detector if exists and not already moved
    const legacyPath = 'ai/models/harassment-detector.js';
    const newPath = 'ai/engines/harassment/engine-legacy.js';
    
    if (fs.existsSync(legacyPath) && !fs.existsSync(newPath)) {
      fs.copyFileSync(legacyPath, newPath);
      console.log('✅ Moved harassment detector to engines/');
    }
    
    // Create engine wrapper if not exists
    if (!fs.existsSync('ai/engines/harassment/engine.js')) {
      const wrapperCode = `// Unified Harassment Engine Wrapper
const legacy = require('./engine-legacy');
const VERSION = 'heuristic-1.0.0';

function normalizeOutput(raw) {
  return {
    engine: 'harassment',
    engine_version: VERSION,
    is_match: raw.isHarassment || false,
    score: raw.confidence || 0,
    severity: raw.severity || 0,
    category: raw.category || 'normal',
    evidence: raw.keywords?.map(k => k.word) || [],
    confidence: raw.confidence || 0,
    explanation: raw.explanation || '',
    meta: {
      processing_ms: raw.processingTime || 0,
      latency_ms: raw.processingTime || 0
    }
  };
}

async function analyze(text, context = {}) {
  const startTime = Date.now();
  
  try {
    const raw = await legacy.analyze(text, context);
    const result = normalizeOutput(raw);
    result.meta.latency_ms = Date.now() - startTime;
    return result;
  } catch (error) {
    return {
      engine: 'harassment',
      engine_version: VERSION,
      is_match: false,
      score: 0,
      severity: 0,
      category: 'error',
      evidence: [],
      confidence: 0,
      explanation: \`Error: \${error.message}\`,
      meta: {
        processing_ms: Date.now() - startTime,
        latency_ms: Date.now() - startTime,
        error: true
      }
    };
  }
}

module.exports = { analyze, VERSION };`;
      
      fs.writeFileSync('ai/engines/harassment/engine.js', wrapperCode);
      console.log('✅ Created engine wrapper');
    }
    
    // Create version.json
    if (!fs.existsSync('ai/engines/harassment/version.json')) {
      const versionInfo = {
        model_version: 'heuristic-1.0.0',
        release_date: new Date().toISOString().split('T')[0],
        accuracy_claim: 'Dev baseline – validate with dataset phase 0',
        license: 'MIT (code) / patterns curated',
        performance: {
          recall_target: 0.8,
          precision_target: 0.7,
          f1_target: 0.75
        },
        languages: ['fr', 'en'],
        categories: ['threats', 'insults', 'doxxing', 'sexualHarassment', 'cyberbullying']
      };
      
      fs.writeFileSync('ai/engines/harassment/version.json', JSON.stringify(versionInfo, null, 2));
      console.log('✅ Created version.json');
    }
    
    // Create test placeholder
    if (!fs.existsSync('ai/engines/harassment/tests/engine.test.js')) {
      const testCode = `// Harassment Engine Tests - Placeholder
const engine = require('../engine');

// TODO: Add real test dataset
const testCases = [
  { text: "Je vais te tuer", expected: true },
  { text: "Bonjour", expected: false }
];

async function runTests() {
  console.log('🧪 Harassment Engine Tests');
  
  for (const testCase of testCases) {
    const result = await engine.analyze(testCase.text);
    const success = result.is_match === testCase.expected;
    console.log(\`\${success ? '✅' : '❌'} "\${testCase.text}" - Expected: \${testCase.expected}, Got: \${result.is_match}\`);
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };`;
      
      fs.writeFileSync('ai/engines/harassment/tests/engine.test.js', testCode);
      console.log('✅ Created test placeholder');
    }
    
    return { success: true, message: 'AI structure scaffold completed' };
  }
};