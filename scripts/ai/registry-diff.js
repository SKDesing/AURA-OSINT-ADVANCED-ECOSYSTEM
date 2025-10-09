#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REGISTRY_PATH = 'ai/registry/registry.json';

function loadRegistry(ref = 'HEAD') {
  try {
    if (ref === 'current') {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    }
    const content = execSync(`git show ${ref}:${REGISTRY_PATH}`, { encoding: 'utf8' });
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function diffRegistries(current, previous) {
  const changes = {
    models: { added: [], modified: [], removed: [] },
    algorithms: { added: [], modified: [], removed: [] },
    policies: { added: [], modified: [], removed: [] },
    version_changed: current.registry_version !== previous.registry_version,
    integrity_changed: current.integrity_hash !== previous.integrity_hash
  };

  ['models', 'algorithms', 'policies'].forEach(section => {
    const currentItems = current[section] || {};
    const previousItems = previous[section] || {};

    Object.keys(currentItems).forEach(key => {
      if (!previousItems[key]) {
        changes[section].added.push(key);
      } else if (JSON.stringify(currentItems[key]) !== JSON.stringify(previousItems[key])) {
        changes[section].modified.push(key);
      }
    });

    Object.keys(previousItems).forEach(key => {
      if (!currentItems[key]) {
        changes[section].removed.push(key);
      }
    });
  });

  return changes;
}

function main() {
  const args = process.argv.slice(2);
  const baseRef = args[0] || 'main';
  
  console.log(`🔍 Registry diff: current vs ${baseRef}`);
  
  const current = loadRegistry('current');
  const previous = loadRegistry(baseRef);
  
  if (!current) {
    console.error('❌ Cannot load current registry');
    process.exit(1);
  }
  
  if (!previous) {
    console.warn(`⚠️ Cannot load registry from ${baseRef}, assuming empty`);
    console.log('✅ Registry diff: NEW registry detected');
    return;
  }
  
  const changes = diffRegistries(current, previous);
  
  let hasChanges = false;
  
  if (changes.version_changed) {
    console.log(`📦 Version: ${previous.registry_version} → ${current.registry_version}`);
    hasChanges = true;
  }
  
  if (changes.integrity_changed) {
    console.log(`🔒 Integrity: ${previous.integrity_hash.substring(0, 8)}... → ${current.integrity_hash.substring(0, 8)}...`);
    hasChanges = true;
  }
  
  ['models', 'algorithms', 'policies'].forEach(section => {
    const sectionChanges = changes[section];
    if (sectionChanges.added.length || sectionChanges.modified.length || sectionChanges.removed.length) {
      console.log(`\n📋 ${section.toUpperCase()}:`);
      sectionChanges.added.forEach(item => console.log(`  + ${item}`));
      sectionChanges.modified.forEach(item => console.log(`  ~ ${item}`));
      sectionChanges.removed.forEach(item => console.log(`  - ${item}`));
      hasChanges = true;
    }
  });
  
  if (!hasChanges) {
    console.log('✅ No registry changes detected');
  } else {
    console.log('\n🎯 Registry changes detected - ensure proper justification in PR');
  }
}

if (require.main === module) {
  main();
}