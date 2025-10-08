#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 AURA ADVANCED OSINT ECOSYSTEM - Test Suite');
console.log('='.repeat(50));

const tests = [
  {
    name: '1️⃣ Frontend Tests (React)',
    command: 'npm test -- --coverage --watchAll=false',
    description: 'Tests unitaires des composants React'
  },
  {
    name: '2️⃣ Backend Tests (API)',
    command: 'npm run test:api',
    description: 'Tests des endpoints API'
  },
  {
    name: '3️⃣ Linting & Code Quality',
    command: 'npm run lint',
    description: 'Vérification qualité du code'
  },
  {
    name: '4️⃣ Security Audit',
    command: 'npm audit',
    description: 'Audit de sécurité des dépendances'
  }
];

let results = [];

for (const test of tests) {
  console.log(`\n${test.name}`);
  console.log('-'.repeat(30));
  console.log(test.description);
  
  try {
    const output = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ PASSED');
    results.push({ name: test.name, status: 'PASSED', output });
    
  } catch (error) {
    console.log('❌ FAILED');
    console.log(error.stdout || error.message);
    results.push({ name: test.name, status: 'FAILED', error: error.message });
  }
}

// Génération du rapport
const report = {
  timestamp: new Date().toISOString(),
  results,
  summary: {
    total: tests.length,
    passed: results.filter(r => r.status === 'PASSED').length,
    failed: results.filter(r => r.status === 'FAILED').length
  }
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));

console.log('\n📊 RAPPORT FINAL');
console.log('='.repeat(50));
console.log(`Total: ${report.summary.total}`);
console.log(`✅ Réussis: ${report.summary.passed}`);
console.log(`❌ Échoués: ${report.summary.failed}`);
console.log(`📄 Rapport: test-report.json`);

process.exit(report.summary.failed > 0 ? 1 : 0);