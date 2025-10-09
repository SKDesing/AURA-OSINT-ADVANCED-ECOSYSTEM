#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const registryPath = 'ai/registry/registry.json';
if (!fs.existsSync(registryPath)) {
  console.error('❌ Registry not found');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
let errors = 0;

// Validate models
registry.models.forEach(model => {
  if (model.status === 'active' && model.hash.includes('placeholder')) {
    console.error(`❌ Model ${model.alias} has placeholder hash`);
    errors++;
  }
});

// Validate algorithms  
registry.algorithms.forEach(algo => {
  if (algo.status === 'active' && !fs.existsSync(algo.path)) {
    console.error(`❌ Algorithm ${algo.name} path not found: ${algo.path}`);
    errors++;
  }
});

if (errors === 0) {
  console.log('✅ Registry validation passed');
} else {
  console.error(`❌ Registry validation failed with ${errors} errors`);
  process.exit(1);
}
