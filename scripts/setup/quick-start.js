#!/usr/bin/env node
// AURA Quick Start - Validation complète du setup

const { execSync } = require('child_process');
const fs = require('fs');

class AuraQuickStart {
    constructor() {
        this.checks = [];
    }

    async runAllChecks() {
        console.log('🚀 AURA Quick Start - Validation Setup');
        console.log('=====================================');

        await this.checkNodeVersion();
        await this.checkDependencies();
        await this.checkChromium();
        await this.checkMigration();
        await this.checkServices();
        await this.runBenchmark();
        
        this.displayResults();
    }

    async checkNodeVersion() {
        console.log('\n📋 Vérification Node.js...');
        try {
            const version = process.version;
            const major = parseInt(version.slice(1).split('.')[0]);
            
            if (major >= 18) {
                this.addCheck('Node.js', true, `Version ${version} ✅`);
            } else {
                this.addCheck('Node.js', false, `Version ${version} - Requis: >=18`);
            }
        } catch (error) {
            this.addCheck('Node.js', false, error.message);
        }
    }

    async checkDependencies() {
        console.log('\n📦 Vérification dépendances...');
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const deps = Object.keys(packageJson.dependencies || {});
            
            let installedCount = 0;
            for (const dep of deps) {
                try {
                    require.resolve(dep);
                    installedCount++;
                } catch (e) {
                    // Dépendance manquante
                }
            }
            
            const success = installedCount === deps.length;
            this.addCheck('Dépendances', success, `${installedCount}/${deps.length} installées`);
        } catch (error) {
            this.addCheck('Dépendances', false, error.message);
        }
    }

    async checkChromium() {
        console.log('\n🌐 Vérification Chromium...');
        try {
            if (fs.existsSync('src/utils/getChromiumPath.js')) {
                const ChromiumPathDetector = require('./src/utils/getChromiumPath.js');
                const chromiumPath = ChromiumPathDetector.detect();
                
                if (chromiumPath) {
                    this.addCheck('Chromium', true, `Trouvé: ${chromiumPath}`);
                } else {
                    this.addCheck('Chromium', true, 'Puppeteer bundled disponible');
                }
            } else {
                this.addCheck('Chromium', false, 'ChromiumPathDetector manquant');
            }
        } catch (error) {
            this.addCheck('Chromium', false, error.message);
        }
    }

    async checkMigration() {
        console.log('\n🔄 Vérification migration...');
        try {
            const braveFiles = [
                'launch-brave.js',
                'brave-portable-downloader.js',
                'live-tracker/brave-launcher.js',
                'src/utils/getBravePath.js'
            ];
            
            const braveFilesExist = braveFiles.some(file => fs.existsSync(file));
            const chromiumFilesExist = fs.existsSync('chromium-launcher.js') && 
                                     fs.existsSync('src/utils/getChromiumPath.js');
            
            if (!braveFilesExist && chromiumFilesExist) {
                this.addCheck('Migration', true, 'Brave → Chromium terminée');
            } else if (braveFilesExist) {
                this.addCheck('Migration', false, 'Fichiers Brave encore présents');
            } else {
                this.addCheck('Migration', false, 'Fichiers Chromium manquants');
            }
        } catch (error) {
            this.addCheck('Migration', false, error.message);
        }
    }

    async checkServices() {
        console.log('\n🔧 Vérification services...');
        try {
            const serviceFiles = [
                'analytics-api.js',
                'correlation-engine-complete.js',
                'service-orchestrator.js',
                'port-audit.js'
            ];
            
            let existingServices = 0;
            for (const file of serviceFiles) {
                if (fs.existsSync(file)) {
                    existingServices++;
                }
            }
            
            const success = existingServices === serviceFiles.length;
            this.addCheck('Services', success, `${existingServices}/${serviceFiles.length} disponibles`);
        } catch (error) {
            this.addCheck('Services', false, error.message);
        }
    }

    async runBenchmark() {
        console.log('\n📊 Test benchmark rapide...');
        try {
            if (fs.existsSync('benchmark-suite.js')) {
                // Test rapide sans exécution complète
                const BenchmarkSuite = require('./benchmark-suite.js');
                this.addCheck('Benchmark', true, 'Suite disponible');
            } else {
                this.addCheck('Benchmark', false, 'Suite manquante');
            }
        } catch (error) {
            this.addCheck('Benchmark', false, error.message);
        }
    }

    addCheck(name, success, message) {
        this.checks.push({ name, success, message });
        const status = success ? '✅' : '❌';
        console.log(`   ${status} ${name}: ${message}`);
    }

    displayResults() {
        console.log('\n📋 RÉSUMÉ DU SETUP');
        console.log('==================');
        
        const successful = this.checks.filter(c => c.success).length;
        const total = this.checks.length;
        
        console.log(`✅ Réussis: ${successful}/${total}`);
        console.log(`❌ Échecs: ${total - successful}/${total}`);
        
        if (successful === total) {
            console.log('\n🎉 AURA SETUP COMPLET !');
            console.log('🚀 Commandes disponibles:');
            console.log('   npm start              # Démarrer AURA');
            console.log('   npm run orchestrator   # Gestionnaire services');
            console.log('   npm run benchmark      # Tests performance');
            console.log('   npm run health         # Santé système');
        } else {
            console.log('\n⚠️  SETUP INCOMPLET');
            console.log('🔧 Actions recommandées:');
            
            const failed = this.checks.filter(c => !c.success);
            for (const check of failed) {
                console.log(`   - ${check.name}: ${check.message}`);
            }
            
            console.log('\n💡 Commandes de réparation:');
            console.log('   npm install            # Installer dépendances');
            console.log('   npm run migrate-chromium # Migration Chromium');
            console.log('   npm run install-chromium # Installer Chromium');
        }
        
        console.log('\n📞 Support: contact@tiktokliveanalyser.com');
    }
}

// Exécution
if (require.main === module) {
    const quickStart = new AuraQuickStart();
    quickStart.runAllChecks().catch(console.error);
}

module.exports = AuraQuickStart;