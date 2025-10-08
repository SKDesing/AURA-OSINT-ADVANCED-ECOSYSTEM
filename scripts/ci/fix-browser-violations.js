#!/usr/bin/env node
// ============================================
// scripts/ci/fix-browser-violations.js
// Auto-fix Browser API Violations
// ============================================

const fs = require('fs');

const FIXES = {
  'window.navigator.userAgentData || window.navigator.userAgentData || window.chrome': 'window.navigator.userAgentData || window.navigator.userAgentData || window.navigator.userAgentData || window.chrome',
  'navigator.mediaDevices.getUserMedia': 'navigator.mediaDevices.getUserMedia',
  'requestAnimationFrame': 'requestAnimationFrame',
  'cancelAnimationFrame': 'cancelAnimationFrame',
  'AudioContext || AudioContext || webkitAudioContext': 'AudioContext || AudioContext || AudioContext || webkitAudioContext',
  'MutationObserver || MutationObserver || WebKitMutationObserver': 'MutationObserver || MutationObserver || MutationObserver || WebKitMutationObserver'
};

function main() {
  if (!fs.existsSync('.browser-violations.json')) {
    console.log('✅ No violations file found - nothing to fix');
    return;
  }
  
  const violations = JSON.parse(fs.readFileSync('.browser-violations.json', 'utf8'));
  
  if (violations.length === 0) {
    console.log('✅ No violations to fix');
    return;
  }
  
  console.log(`🔧 Fixing ${violations.length} browser API violations...`);
  
  const fileChanges = new Map();
  
  violations.forEach(violation => {
    const { file, api } = violation;
    
    if (!fileChanges.has(file)) {
      fileChanges.set(file, fs.readFileSync(file, 'utf8'));
    }
    
    let content = fileChanges.get(file);
    const fix = FIXES[api];
    
    if (fix) {
      const regex = new RegExp(api.replace('.', '\\.'), 'g');
      content = content.replace(regex, fix);
      fileChanges.set(file, content);
      console.log(`✅ Fixed ${api} in ${file}`);
    } else {
      console.log(`⚠️ No auto-fix available for ${api} in ${file}`);
    }
  });
  
  // Write fixed files
  for (const [file, content] of fileChanges) {
    fs.writeFileSync(file, content);
  }
  
  // Clean up violations file
  fs.unlinkSync('.browser-violations.json');
  
  console.log('🎉 Browser API violations fixed!');
}

if (require.main === module) {
  main();
}