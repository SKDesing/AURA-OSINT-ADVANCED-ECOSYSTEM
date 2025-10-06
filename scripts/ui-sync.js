#!/usr/bin/env node
// AURA UI Sync - Synchronisation des assets TikTok UI

const fs = require('fs');
const path = require('path');

class UISyncManager {
    constructor() {
        this.sourceDir = path.join(__dirname, '../assets/ui');
        this.targets = [
            path.join(__dirname, '../gui/assets/ui'),
            path.join(__dirname, '../electron/assets/ui'),
            path.join(__dirname, '../mobile/assets/ui')
        ];
    }

    // Synchroniser les assets vers tous les targets
    syncAssets() {
        console.log('🎨 Synchronisation des assets TikTok UI...');
        
        this.targets.forEach(target => {
            if (this.copyDirectory(this.sourceDir, target)) {
                console.log(`✅ Assets synchronisés vers ${target}`);
            } else {
                console.log(`⚠️  Target ignoré: ${target}`);
            }
        });
    }

    // Copier récursivement un dossier
    copyDirectory(source, target) {
        if (!fs.existsSync(source)) {
            console.log(`❌ Source introuvable: ${source}`);
            return false;
        }

        // Créer le dossier target s'il n'existe pas
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        const files = fs.readdirSync(source);
        
        files.forEach(file => {
            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);
            
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectory(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        });

        return true;
    }

    // Vérifier l'intégrité des assets
    checkIntegrity() {
        console.log('🔍 Vérification de l\'intégrité des assets...');
        
        const requiredFiles = [
            'theme.css',
            'icons/home.svg',
            'icons/search.svg',
            'icons/analytics.svg',
            'icons/security.svg',
            'logos/aura-logo.svg'
        ];

        let allValid = true;

        this.targets.forEach(target => {
            if (!fs.existsSync(target)) return;
            
            console.log(`\n📁 Vérification: ${target}`);
            
            requiredFiles.forEach(file => {
                const filePath = path.join(target, file);
                if (fs.existsSync(filePath)) {
                    console.log(`  ✅ ${file}`);
                } else {
                    console.log(`  ❌ ${file} - MANQUANT`);
                    allValid = false;
                }
            });
        });

        if (allValid) {
            console.log('\n🎉 Tous les assets sont présents !');
        } else {
            console.log('\n⚠️  Certains assets sont manquants. Lancez: npm run ui-sync');
        }

        return allValid;
    }

    // Générer un rapport des assets
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            source: this.sourceDir,
            targets: [],
            totalFiles: 0
        };

        // Compter les fichiers source
        report.totalFiles = this.countFiles(this.sourceDir);

        // Vérifier chaque target
        this.targets.forEach(target => {
            if (fs.existsSync(target)) {
                report.targets.push({
                    path: target,
                    files: this.countFiles(target),
                    status: 'synced'
                });
            } else {
                report.targets.push({
                    path: target,
                    files: 0,
                    status: 'missing'
                });
            }
        });

        return report;
    }

    // Compter les fichiers dans un dossier
    countFiles(dir) {
        if (!fs.existsSync(dir)) return 0;
        
        let count = 0;
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                count += this.countFiles(filePath);
            } else {
                count++;
            }
        });
        
        return count;
    }

    // Nettoyer les assets obsolètes
    cleanup() {
        console.log('🧹 Nettoyage des assets obsolètes...');
        
        this.targets.forEach(target => {
            if (fs.existsSync(target)) {
                // Supprimer et recréer pour un nettoyage complet
                fs.rmSync(target, { recursive: true, force: true });
                console.log(`🗑️  Nettoyé: ${target}`);
            }
        });
        
        // Re-synchroniser après nettoyage
        this.syncAssets();
    }
}

// CLI Interface
if (require.main === module) {
    const manager = new UISyncManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'sync':
            manager.syncAssets();
            break;
        case 'check':
            manager.checkIntegrity();
            break;
        case 'report':
            const report = manager.generateReport();
            console.log(JSON.stringify(report, null, 2));
            break;
        case 'cleanup':
            manager.cleanup();
            break;
        default:
            console.log('Usage: node ui-sync.js [sync|check|report|cleanup]');
            console.log('');
            console.log('Commands:');
            console.log('  sync    - Synchroniser les assets vers tous les targets');
            console.log('  check   - Vérifier l\'intégrité des assets');
            console.log('  report  - Générer un rapport détaillé');
            console.log('  cleanup - Nettoyer et re-synchroniser');
    }
}

module.exports = UISyncManager;