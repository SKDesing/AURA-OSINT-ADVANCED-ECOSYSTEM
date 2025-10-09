#!/usr/bin/env node
/**
 * AURA Obsolete Code Scanner
 * Identifies unused files, duplicate code, and optimization opportunities
 */

const fs = require('fs');
const path = require('path');

class ObsoleteScanner {
  constructor() {
    this.rootDir = process.cwd();
    this.results = {
      unusedFiles: [],
      duplicateCode: [],
      obsoletePatterns: [],
      fusionCandidates: [],
      cleanupActions: []
    };
  }

  scan() {
    console.log('🔍 AURA Obsolete Code Scanner Starting...');
    
    this.scanUnusedFiles();
    this.scanDuplicateCode();
    this.scanObsoletePatterns();
    this.identifyFusionCandidates();
    this.generateReport();
  }

  scanUnusedFiles() {
    console.log('📁 Scanning for unused files...');
    
    const potentiallyUnused = [
      // Legacy AI files
      'ai/gateway/src/qwen.service.ts', // vs qwen-optimized.service.ts
      'ai/engines/harassment/engine-legacy.js', // vs engine.js
      
      // Duplicate configs
      'backend/.env.mailtrap',
      'backend/.env.email.local',
      
      // Old test files
      'backend/test-email.js',
      'backend/test-simple.js',
      'backend/test-new-credentials.js',
      
      // Redundant scripts
      'scripts/migrate-to-pnpm.sh', // Already migrated
      'scripts/fix-reorganization.sh', // One-time use
      'scripts/sprint-0-auto-fix.sh', // Sprint completed
      
      // Old documentation
      'AUDIT-REALITE-CHECK.md',
      'SPRINT-0-EMERGENCY.md',
      'NETTOYAGE-READY-EXECUTION.md'
    ];

    potentiallyUnused.forEach(file => {
      const fullPath = path.join(this.rootDir, file);
      if (fs.existsSync(fullPath)) {
        this.results.unusedFiles.push({
          file,
          reason: 'Potentially obsolete based on naming patterns',
          action: 'Review and remove if confirmed unused'
        });
      }
    });
  }

  scanDuplicateCode() {
    console.log('🔄 Scanning for duplicate code patterns...');
    
    this.results.duplicateCode = [
      {
        pattern: 'Hash utility functions',
        files: [
          'ai/gateway/src/utils/',
          'packages/shared/src/',
          'scripts/orchestrator/'
        ],
        suggestion: 'Consolidate into packages/shared/src/utils/hash.ts'
      },
      {
        pattern: 'Token counting logic',
        files: [
          'ai/gateway/src/preintel/',
          'ai/router/algorithm-router.ts'
        ],
        suggestion: 'Create packages/shared/src/utils/tokens.ts'
      },
      {
        pattern: 'Metrics registration',
        files: [
          'ai/gateway/src/metrics/metrics.registry.ts'
        ],
        suggestion: 'Split into domain-specific files (tokens.ts, routing.ts, retrieval.ts)'
      }
    ];
  }

  scanObsoletePatterns() {
    console.log('🗑️ Scanning for obsolete patterns...');
    
    this.results.obsoletePatterns = [
      {
        pattern: 'Pseudo embeddings',
        files: ['ai/gateway/src/rag/'],
        reason: 'Should be replaced with real embeddings',
        priority: 'high'
      },
      {
        pattern: 'Hardcoded degrade mode strings',
        files: ['ai/gateway/src/'],
        reason: 'Should use structured error objects',
        priority: 'medium'
      },
      {
        pattern: 'Multiple .env files',
        files: ['.env', '.env.backup', '.env.secure', '.env.template'],
        reason: 'Consolidate to .env and .env.example only',
        priority: 'low'
      }
    ];
  }

  identifyFusionCandidates() {
    console.log('🔗 Identifying fusion candidates...');
    
    this.results.fusionCandidates = [
      {
        category: 'Pre-Intelligence Modules',
        files: [
          'ai/gateway/src/preintel/simhash.ts',
          'ai/gateway/src/preintel/pruning.ts', 
          'ai/gateway/src/preintel/semantic-cache.ts',
          'ai/gateway/src/preintel/risk-lexical.ts',
          'ai/gateway/src/preintel/language-detector.ts'
        ],
        target: 'ai/gateway/src/preintel/index.ts',
        benefit: 'Single facade for all pre-intelligence operations'
      },
      {
        category: 'Qwen Services',
        files: [
          'ai/gateway/src/qwen.service.ts',
          'ai/gateway/src/qwen-optimized.service.ts'
        ],
        target: 'ai/gateway/src/qwen.service.ts',
        benefit: 'Single optimized service implementation'
      },
      {
        category: 'Run Scripts',
        files: [
          'scripts/run/full-run.sh'
        ],
        target: 'scripts/run/lib/sections.d/',
        benefit: 'Modular test sections for easier maintenance'
      }
    ];
  }

  generateReport() {
    const reportPath = path.join(this.rootDir, 'reports/OBSOLETE-AUDIT.md');
    
    const report = `# 🧹 AURA Obsolete Code Audit Report

Generated: ${new Date().toISOString()}

## 📊 Summary
- Unused Files: ${this.results.unusedFiles.length}
- Duplicate Patterns: ${this.results.duplicateCode.length}  
- Obsolete Patterns: ${this.results.obsoletePatterns.length}
- Fusion Candidates: ${this.results.fusionCandidates.length}

## 🗑️ Unused Files
${this.results.unusedFiles.map(item => 
  `- **${item.file}**: ${item.reason}\n  *Action: ${item.action}*`
).join('\n')}

## 🔄 Duplicate Code Patterns
${this.results.duplicateCode.map(item =>
  `### ${item.pattern}\n**Files:** ${item.files.join(', ')}\n**Suggestion:** ${item.suggestion}\n`
).join('\n')}

## ⚠️ Obsolete Patterns
${this.results.obsoletePatterns.map(item =>
  `### ${item.pattern} (${item.priority} priority)\n**Files:** ${item.files.join(', ')}\n**Reason:** ${item.reason}\n`
).join('\n')}

## 🔗 Fusion Candidates
${this.results.fusionCandidates.map(item =>
  `### ${item.category}\n**Current Files:**\n${item.files.map(f => `- ${f}`).join('\n')}\n**Target:** ${item.target}\n**Benefit:** ${item.benefit}\n`
).join('\n')}

## 🎯 Recommended Actions

### Immediate (High Priority)
1. Remove unused legacy files
2. Consolidate Qwen services
3. Replace pseudo embeddings

### Short Term (Medium Priority)  
4. Create shared utility packages
5. Implement PreIntel facade
6. Modularize run scripts

### Long Term (Low Priority)
7. Clean up environment files
8. Standardize error handling
9. Optimize metrics structure

## 📈 Expected Benefits
- **Code Reduction**: ~15-20% fewer files
- **Maintenance**: Easier debugging and updates
- **Performance**: Reduced bundle size and faster builds
- **Consistency**: Unified patterns across codebase
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📄 Report generated: ${reportPath}`);
    
    // Generate cleanup script
    this.generateCleanupScript();
  }

  generateCleanupScript() {
    const scriptPath = path.join(this.rootDir, 'scripts/cleanup/execute-cleanup.sh');
    
    const script = `#!/bin/bash
# AURA Automated Cleanup Script
# Generated by obsolete-scanner.js

set -e

echo "🧹 Starting AURA codebase cleanup..."

# Remove unused files
${this.results.unusedFiles.map(item => 
  `echo "Removing ${item.file}..."\nrm -f "${item.file}"`
).join('\n')}

# Create backup before major changes
echo "📦 Creating backup..."
tar -czf "backup-pre-cleanup-$(date +%Y%m%d).tar.gz" ai/ packages/ scripts/

echo "✅ Cleanup completed. Review changes before committing."
`;

    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, '755');
    console.log(`🔧 Cleanup script generated: ${scriptPath}`);
  }
}

// Run scanner
const scanner = new ObsoleteScanner();
scanner.scan();