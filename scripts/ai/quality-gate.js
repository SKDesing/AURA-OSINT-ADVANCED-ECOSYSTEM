#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const THRESHOLDS = {
  tokens_saved_ratio: 0.60,
  degrade_ratio: 0.02,
  cache_hit_ratio: 0.50,
  router_bypass_rate: 0.65
};

function loadMetrics() {
  try {
    const metricsPath = path.join(process.cwd(), 'reports/KPIS-Daily.json');
    if (!fs.existsSync(metricsPath)) {
      console.error('❌ Metrics file not found. Run: npm run ai:metrics');
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  } catch (e) {
    console.error('❌ Failed to load metrics:', e.message);
    process.exit(1);
  }
}

function checkRegistry() {
  try {
    const registryPath = path.join(process.cwd(), 'ai/registry/registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    
    if (!registry.integrity_hash || registry.integrity_hash.includes('placeholder')) {
      console.error('❌ Registry integrity hash missing or placeholder');
      return false;
    }
    
    console.log('✅ Registry integrity check passed');
    return true;
  } catch (e) {
    console.error('❌ Registry check failed:', e.message);
    return false;
  }
}

function main() {
  console.log('🚦 AI Quality Gate Starting...');
  
  // Check registry integrity
  if (!checkRegistry()) {
    process.exit(1);
  }
  
  // Load and check metrics
  const metrics = loadMetrics();
  const failures = [];
  
  Object.entries(THRESHOLDS).forEach(([metric, threshold]) => {
    const value = metrics[metric];
    if (value === undefined) {
      failures.push(`${metric}: missing`);
    } else if (value < threshold) {
      failures.push(`${metric}: ${value} < ${threshold}`);
    } else {
      console.log(`✅ ${metric}: ${value} >= ${threshold}`);
    }
  });
  
  if (failures.length > 0) {
    console.error('❌ Quality gate failures:');
    failures.forEach(failure => console.error(`  - ${failure}`));
    process.exit(1);
  }
  
  console.log('🎯 All quality gates passed!');
}

if (require.main === module) {
  main();
}