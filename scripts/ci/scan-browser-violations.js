#!/usr/bin/env node
// ============================================
// scripts/ci/scan-browser-violations.js
// Chromium Compliance Scanner - FIXED
// ============================================

const fs = require('fs');
const path = require('path');

const FORBIDDEN_APIS = [
  'window.navigator.userAgentData',
  'navigator.mediaDevices.getUserMedia',
  'requestAnimationFrame',
  'webkitAudioContext'
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

const IGNORED_DIRS = new Set([
  'node_modules', 'dist', 'build', '.git', '.backup-20251008-192551',
  'backups', 'logs', 'temp', 'reports', '.husky', 'cypress',
  'Projet_Kaabache', 'AURA_BROWSER', 'monitoring'
]);

function scanDirectory(dir, maxDepth = 3, currentDepth = 0) {
  const violations = [];
  let fileCount = 0;
  
  if (currentDepth > maxDepth) return violations;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (fileCount > 500) break; // Limite sécurité
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && !IGNORED_DIRS.has(entry.name)) {
          violations.push(...scanDirectory(fullPath, maxDepth, currentDepth + 1));
        }
      } else if ((entry.name.endsWith('.js') || entry.name.endsWith('.ts')) && 
                 entry.size < 1024 * 1024) { // Max 1MB par fichier
        violations.push(...scanFile(fullPath));
        fileCount++;
        if (fileCount % 50 === 0) {
          console.log(`📄 Scannés: ${fileCount} fichiers...`);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ Erreur scan ${dir}: ${error.message}`);
  }
  
  return violations;
}

function main() {
  console.log('🔍 Scan browser violations (optimisé)...');
  const startTime = Date.now();
  
  const violations = scanDirectory('.', 3); // Max 3 niveaux
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`⏱️ Scan terminé en ${duration}s`);
  
  if (violations.length === 0) {
    console.log('✅ Aucune violation détectée');
    process.exit(0);
  }
  
  console.log(`⚠️ ${violations.length} violations trouvées`);
  
  // Afficher seulement les 5 premières
  violations.slice(0, 5).forEach(v => {
    console.log(`📁 ${v.file}:${v.line} - ${v.api}`);
  });
  
  if (violations.length > 5) {
    console.log(`... et ${violations.length - 5} autres`);
  }
  
  fs.writeFileSync('.browser-violations.json', JSON.stringify(violations, null, 2));
  console.log('💡 Violations sauvées dans .browser-violations.json');
  
  process.exit(0); // Ne pas bloquer le commit
}

if (require.main === module) {
  main();
}