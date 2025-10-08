#!/usr/bin/env node
// ============================================
// scripts/ci/scan-browser-violations.js
// Chromium Compliance Scanner - FIXED
// ============================================

const fs = require('fs');
const path = require('path');

const FORBIDDEN_APIS = [
  'window.navigator.userAgentData || window.chrome',
  'navigator.mediaDevices.getUserMedia',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'webkitAudioContext',
  'WebKitMutationObserver'
];

const ALLOWED_PATTERNS = [
  /puppeteer/i,
  /playwright/i,
  /chromium-launcher/i
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    FORBIDDEN_APIS.forEach(api => {
      const regex = new RegExp(api.replace('.', '\\.'), 'g');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        
        // Check if it's in an allowed context
        const isAllowed = ALLOWED_PATTERNS.some(pattern => 
          pattern.test(content.substring(Math.max(0, match.index - 100), match.index + 100))
        );
        
        if (!isAllowed) {
          violations.push({
            file: filePath,
            line,
            api,
            context: content.substring(Math.max(0, match.index - 50), match.index + 50)
          });
        }
      }
    });
    
    return violations;
  } catch (error) {
    console.warn(`Warning: Could not scan ${filePath}: ${error.message}`);
    return [];
  }
}

function scanDirectory(dir) {
  const violations = [];
  
  function scan(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && 
              entry.name !== 'node_modules' && 
              entry.name !== 'dist' &&
              entry.name !== 'build') {
            scan(fullPath);
          }
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) {
          violations.push(...scanFile(fullPath));
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}: ${error.message}`);
    }
  }
  
  scan(dir);
  return violations;
}

function main() {
  console.log('🔍 Scanning for browser API violations...');
  
  const violations = scanDirectory('.');
  
  if (violations.length === 0) {
    console.log('✅ No browser API violations found');
    process.exit(0);
  }
  
  console.log(`❌ Found ${violations.length} browser API violations:`);
  
  violations.forEach(violation => {
    console.log(`\n📁 ${violation.file}:${violation.line}`);
    console.log(`🚫 API: ${violation.api}`);
    console.log(`📝 Context: ${violation.context.trim()}`);
  });
  
  // Write violations to file for auto-fix
  try {
    fs.writeFileSync('.browser-violations.json', JSON.stringify(violations, null, 2));
    console.log('\n💡 Run `npm run fix-browser-calls` to auto-fix these violations');
  } catch (error) {
    console.warn('Warning: Could not write violations file:', error.message);
  }
  
  process.exit(1);
}

if (require.main === module) {
  main();
}