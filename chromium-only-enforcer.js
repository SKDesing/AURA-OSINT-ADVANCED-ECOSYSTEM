#!/usr/bin/env node
// AURA Chromium Only Enforcer - Détection et nettoyage des appels navigateur par défaut

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ChromiumOnlyEnforcer {
    constructor() {
        this.forbiddenPatterns = [
            /\bopen\s*\(/g,
            /\bstart\s+/g,
            /\bxdg-open\s+/g,
            /require\s*\(\s*['"]open['"]\s*\)/g,
            /require\s*\(\s*['"]opn['"]\s*\)/g,
            /import.*from\s+['"]open['"]/g,
            /spawn\s*\(\s*['"]open['"]/g,
            /spawn\s*\(\s*['"]start['"]/g,
            /spawn\s*\(\s*['"]xdg-open['"]/g
        ];
        
        this.fileExtensions = ['.js', '.ts', '.sh', '.bat', '.cmd', '.ps1'];
        this.violations = [];
    }

    async scanRepository() {
        console.log('🔍 AURA Chromium Only Enforcer');
        console.log('==============================');
        console.log('🎯 Recherche des appels navigateur par défaut...');
        
        await this.scanDirectory('.');
        await this.generateReport();
        await this.suggestFixes();
    }

    async scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            // Ignorer certains dossiers
            if (entry.isDirectory()) {
                if (!this.shouldSkipDirectory(entry.name)) {
                    await this.scanDirectory(fullPath);
                }
            } else if (entry.isFile()) {
                if (this.shouldScanFile(entry.name)) {
                    await this.scanFile(fullPath);
                }
            }
        }
    }

    shouldSkipDirectory(name) {
        const skipDirs = [
            'node_modules', '.git', 'dist', 'build', 'coverage',
            '.next', '.nuxt', 'backup_brave_migration_'
        ];
        return skipDirs.some(skip => name.startsWith(skip));
    }

    shouldScanFile(name) {
        return this.fileExtensions.some(ext => name.endsWith(ext));
    }

    async scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            for (const pattern of this.forbiddenPatterns) {
                const matches = [...content.matchAll(pattern)];
                
                for (const match of matches) {
                    const lines = content.substring(0, match.index).split('\n');
                    const lineNumber = lines.length;
                    const lineContent = lines[lines.length - 1] + match[0];
                    
                    this.violations.push({
                        file: filePath,
                        line: lineNumber,
                        content: lineContent.trim(),
                        pattern: pattern.source,
                        match: match[0]
                    });
                }
            }
        } catch (error) {
            console.log(`⚠️  Erreur lecture ${filePath}: ${error.message}`);
        }
    }

    async generateReport() {
        console.log('\n📊 RAPPORT DE SCAN');
        console.log('==================');
        
        if (this.violations.length === 0) {
            console.log('✅ Aucun appel navigateur par défaut détecté !');
            console.log('🎯 AURA est 100% Chromium Only');
            return;
        }
        
        console.log(`❌ ${this.violations.length} violations détectées :`);
        
        const groupedByFile = this.violations.reduce((acc, violation) => {
            if (!acc[violation.file]) acc[violation.file] = [];
            acc[violation.file].push(violation);
            return acc;
        }, {});
        
        for (const [file, violations] of Object.entries(groupedByFile)) {
            console.log(`\n📁 ${file}:`);
            for (const violation of violations) {
                console.log(`   Ligne ${violation.line}: ${violation.content}`);
                console.log(`   Pattern: ${violation.pattern}`);
            }
        }
    }

    async suggestFixes() {
        if (this.violations.length === 0) return;
        
        console.log('\n🔧 CORRECTIONS SUGGÉRÉES');
        console.log('========================');
        
        const fixes = {
            'open(': 'ChromiumLauncher.launch()',
            'start ': 'ChromiumLauncher.launch()',
            'xdg-open ': 'ChromiumLauncher.launch()',
            "require('open')": "require('./chromium-launcher')",
            "require('opn')": "require('./chromium-launcher')",
            'spawn(\'open\'': 'ChromiumLauncher.spawn(',
            'spawn(\'start\'': 'ChromiumLauncher.spawn(',
            'spawn(\'xdg-open\'': 'ChromiumLauncher.spawn('
        };
        
        console.log('Remplacements recommandés :');
        for (const [old, replacement] of Object.entries(fixes)) {
            console.log(`   ${old} → ${replacement}`);
        }
        
        console.log('\n💡 Actions recommandées :');
        console.log('1. Utiliser ChromiumLauncher.launch() pour ouvrir des URLs');
        console.log('2. Remplacer tous les appels open/start/xdg-open');
        console.log('3. Supprimer les dépendances "open" et "opn" du package.json');
        console.log('4. Tester avec npm run test-migration');
    }

    async autoFix() {
        console.log('\n🔄 AUTO-CORRECTION');
        console.log('==================');
        
        if (this.violations.length === 0) {
            console.log('✅ Rien à corriger');
            return;
        }
        
        const groupedByFile = this.violations.reduce((acc, violation) => {
            if (!acc[violation.file]) acc[violation.file] = [];
            acc[violation.file].push(violation);
            return acc;
        }, {});
        
        for (const [file, violations] of Object.entries(groupedByFile)) {
            console.log(`🔧 Correction de ${file}...`);
            
            let content = fs.readFileSync(file, 'utf8');
            let modified = false;
            
            // Remplacements simples
            const replacements = [
                [/\bopen\s*\(/g, 'ChromiumLauncher.launch('],
                [/require\s*\(\s*['"]open['"]\s*\)/g, "require('./chromium-launcher')"],
                [/require\s*\(\s*['"]opn['"]\s*\)/g, "require('./chromium-launcher')"]
            ];
            
            for (const [pattern, replacement] of replacements) {
                if (pattern.test(content)) {
                    content = content.replace(pattern, replacement);
                    modified = true;
                }
            }
            
            if (modified) {
                // Créer backup
                const backupPath = `${file}.backup`;
                fs.copyFileSync(file, backupPath);
                
                // Appliquer corrections
                fs.writeFileSync(file, content);
                console.log(`   ✅ ${file} corrigé (backup: ${backupPath})`);
            }
        }
    }
}

// Classe ChromiumLauncher améliorée
class ChromiumLauncher {
    static detect() {
        const ChromiumPathDetector = require('./src/utils/getChromiumPath');
        return ChromiumPathDetector.detect();
    }
    
    static async launch(url, options = {}) {
        const chromiumPath = this.detect();
        
        if (!chromiumPath) {
            throw new Error('Chromium non trouvé. Installez Chromium avec: npm run install-chromium');
        }
        
        const { spawn } = require('child_process');
        const args = [url];
        
        if (options.headless) {
            args.unshift('--headless');
        }
        
        if (options.incognito) {
            args.unshift('--incognito');
        }
        
        console.log(`🚀 Lancement Chromium: ${chromiumPath} ${args.join(' ')}`);
        
        const process = spawn(chromiumPath, args, {
            detached: true,
            stdio: 'ignore'
        });
        
        process.unref();
        return process;
    }
    
    static async spawn(url, options = {}) {
        return this.launch(url, options);
    }
}

// CLI
if (require.main === module) {
    const enforcer = new ChromiumOnlyEnforcer();
    const command = process.argv[2];
    
    switch (command) {
        case 'scan':
            enforcer.scanRepository();
            break;
        case 'fix':
            enforcer.scanRepository().then(() => {
                if (enforcer.violations.length > 0) {
                    enforcer.autoFix();
                }
            });
            break;
        case 'test':
            // Test du ChromiumLauncher
            console.log('🧪 Test ChromiumLauncher...');
            try {
                const path = ChromiumLauncher.detect();
                console.log(`✅ Chromium détecté: ${path || 'Puppeteer bundled'}`);
            } catch (error) {
                console.log(`❌ Erreur: ${error.message}`);
            }
            break;
        default:
            console.log('🎯 AURA Chromium Only Enforcer');
            console.log('Usage:');
            console.log('  node chromium-only-enforcer.js scan    # Scanner les violations');
            console.log('  node chromium-only-enforcer.js fix     # Scanner et corriger');
            console.log('  node chromium-only-enforcer.js test    # Tester ChromiumLauncher');
    }
}

module.exports = { ChromiumOnlyEnforcer, ChromiumLauncher };