#!/usr/bin/env node
// AURA Migration Script - Brave to Chromium Only

const fs = require('fs');
const path = require('path');

class BraveToChromiumMigrator {
    constructor() {
        this.filesToRemove = [
            'launch-brave.js',
            'brave-portable-downloader.js',
            'live-tracker/brave-launcher.js',
            'src/utils/getBravePath.js'
        ];
        
        this.filesToUpdate = [
            'LANCER-APPLICATION.bat',
            'scripts/deployment/install.sh',
            'app-launcher.js',
            'live-tracker/server.js',
            'docs/guides/LIRE-MOI.html',
            'CHANGELOG.md'
        ];
        
        this.backupDir = `backup_brave_migration_${Date.now()}`;
    }

    async migrate() {
        console.log('🔄 AURA Migration: Brave → Chromium Only');
        console.log('========================================');
        
        // 1. Créer backup
        await this.createBackup();
        
        // 2. Supprimer fichiers Brave
        await this.removeBraveFiles();
        
        // 3. Créer utilitaires Chromium
        await this.createChromiumUtils();
        
        // 4. Mettre à jour fichiers existants
        await this.updateExistingFiles();
        
        // 5. Nettoyer documentation
        await this.updateDocumentation();
        
        console.log('\n✅ Migration terminée avec succès !');
        console.log(`📁 Backup créé dans: ${this.backupDir}`);
        console.log('🎯 AURA utilise maintenant Chromium uniquement');
    }

    async createBackup() {
        console.log('\n📦 Création du backup...');
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        for (const file of [...this.filesToRemove, ...this.filesToUpdate]) {
            if (fs.existsSync(file)) {
                const backupPath = path.join(this.backupDir, file);
                const backupDir = path.dirname(backupPath);
                
                if (!fs.existsSync(backupDir)) {
                    fs.mkdirSync(backupDir, { recursive: true });
                }
                
                fs.copyFileSync(file, backupPath);
                console.log(`   ✅ ${file} → ${backupPath}`);
            }
        }
    }

    async removeBraveFiles() {
        console.log('\n🗑️  Suppression des fichiers Brave...');
        
        for (const file of this.filesToRemove) {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log(`   ❌ Supprimé: ${file}`);
            } else {
                console.log(`   ⚠️  Non trouvé: ${file}`);
            }
        }
    }

    async createChromiumUtils() {
        console.log('\n🔧 Création des utilitaires Chromium...');
        
        // Créer getChromiumPath.js
        const chromiumPathContent = `// AURA Chromium Path Detector
const fs = require('fs');
const os = require('os');
const path = require('path');

class ChromiumPathDetector {
    static detect() {
        const platform = os.platform();
        
        const paths = {
            linux: [
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium',
                '/usr/bin/google-chrome',
                '/usr/bin/google-chrome-stable',
                '/snap/bin/chromium'
            ],
            darwin: [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ],
            win32: [
                'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
                'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
                process.env.LOCALAPPDATA + '\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'
            ]
        };

        const platformPaths = paths[platform] || paths.linux;
        
        for (const chromiumPath of platformPaths) {
            if (fs.existsSync(chromiumPath)) {
                console.log(\`✅ Chromium trouvé: \${chromiumPath}\`);
                return chromiumPath;
            }
        }
        
        console.log('⚠️  Chromium non trouvé, utilisation du Chromium Puppeteer');
        return null; // Puppeteer utilisera son Chromium bundled
    }
    
    static getProfileDir() {
        const platform = os.platform();
        const homeDir = os.homedir();
        
        const profileDirs = {
            linux: path.join(homeDir, '.config', 'aura-chromium'),
            darwin: path.join(homeDir, 'Library', 'Application Support', 'aura-chromium'),
            win32: path.join(homeDir, 'AppData', 'Local', 'aura-chromium')
        };
        
        return profileDirs[platform] || profileDirs.linux;
    }
}

module.exports = ChromiumPathDetector;`;

        const chromiumDir = path.dirname('src/utils/getChromiumPath.js');
        if (!fs.existsSync(chromiumDir)) {
            fs.mkdirSync(chromiumDir, { recursive: true });
        }
        
        fs.writeFileSync('src/utils/getChromiumPath.js', chromiumPathContent);
        console.log('   ✅ Créé: src/utils/getChromiumPath.js');

        // Créer chromium-launcher.js
        const chromiumLauncherContent = `// AURA Chromium Launcher
const puppeteer = require('puppeteer');
const ChromiumPathDetector = require('../src/utils/getChromiumPath');

class ChromiumLauncher {
    constructor(options = {}) {
        this.options = {
            headless: options.headless !== false,
            devtools: options.devtools || false,
            userDataDir: options.userDataDir || ChromiumPathDetector.getProfileDir(),
            ...options
        };
    }

    async launch() {
        const executablePath = ChromiumPathDetector.detect();
        
        const launchOptions = {
            headless: this.options.headless,
            devtools: this.options.devtools,
            userDataDir: this.options.userDataDir,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        };

        if (executablePath) {
            launchOptions.executablePath = executablePath;
        }

        console.log('🚀 Lancement de Chromium...');
        const browser = await puppeteer.launch(launchOptions);
        
        console.log('✅ Chromium démarré avec succès');
        return browser;
    }

    async launchWithUrl(url) {
        const browser = await this.launch();
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        return { browser, page };
    }
}

module.exports = ChromiumLauncher;`;

        fs.writeFileSync('chromium-launcher.js', chromiumLauncherContent);
        console.log('   ✅ Créé: chromium-launcher.js');
    }

    async updateExistingFiles() {
        console.log('\n📝 Mise à jour des fichiers existants...');
        
        // Mettre à jour app-launcher.js
        if (fs.existsSync('app-launcher.js')) {
            let content = fs.readFileSync('app-launcher.js', 'utf8');
            content = content.replace(/brave/gi, 'chromium');
            content = content.replace(/getBravePath/g, 'getChromiumPath');
            fs.writeFileSync('app-launcher.js', content);
            console.log('   ✅ Mis à jour: app-launcher.js');
        }

        // Mettre à jour live-tracker/server.js
        if (fs.existsSync('live-tracker/server.js')) {
            let content = fs.readFileSync('live-tracker/server.js', 'utf8');
            content = content.replace(/executablePath:\s*['"][^'"]*brave[^'"]*['"]/g, 
                "executablePath: require('../src/utils/getChromiumPath').detect()");
            content = content.replace(/brave-browser/g, 'chromium-browser');
            fs.writeFileSync('live-tracker/server.js', content);
            console.log('   ✅ Mis à jour: live-tracker/server.js');
        }

        // Mettre à jour install.sh
        if (fs.existsSync('scripts/deployment/install.sh')) {
            let content = fs.readFileSync('scripts/deployment/install.sh', 'utf8');
            content = content.replace(/brave-browser/g, 'chromium-browser');
            content = content.replace(/brave-keyring/g, '# brave-keyring removed');
            fs.writeFileSync('scripts/deployment/install.sh', content);
            console.log('   ✅ Mis à jour: scripts/deployment/install.sh');
        }

        // Mettre à jour LANCER-APPLICATION.bat
        if (fs.existsSync('LANCER-APPLICATION.bat')) {
            let content = fs.readFileSync('LANCER-APPLICATION.bat', 'utf8');
            content = content.replace(/brave/gi, 'chrome');
            content = content.replace(/Brave/g, 'Chrome');
            fs.writeFileSync('LANCER-APPLICATION.bat', content);
            console.log('   ✅ Mis à jour: LANCER-APPLICATION.bat');
        }
    }

    async updateDocumentation() {
        console.log('\n📚 Mise à jour de la documentation...');
        
        // Mettre à jour CHANGELOG.md
        if (fs.existsSync('CHANGELOG.md')) {
            let content = fs.readFileSync('CHANGELOG.md', 'utf8');
            const migrationEntry = `
## [Migration] - ${new Date().toISOString().split('T')[0]}
### Changed
- 🔄 Migration complète de Brave vers Chromium uniquement
- ✅ Suppression de toutes les dépendances Brave
- 🚀 Nouveau ChromiumLauncher pour une meilleure compatibilité
- 📦 Détection automatique du chemin Chromium selon l'OS
- 🛡️ Configuration sécurisée par défaut (headless, no-sandbox)

### Removed
- ❌ launch-brave.js
- ❌ brave-portable-downloader.js
- ❌ live-tracker/brave-launcher.js
- ❌ src/utils/getBravePath.js

### Added
- ✅ src/utils/getChromiumPath.js
- ✅ chromium-launcher.js
- ✅ Support universel Chromium/Chrome

`;
            content = migrationEntry + content;
            fs.writeFileSync('CHANGELOG.md', content);
            console.log('   ✅ Mis à jour: CHANGELOG.md');
        }

        // Mettre à jour README ou docs
        const docFiles = ['README.md', 'docs/guides/LIRE-MOI.html'];
        for (const docFile of docFiles) {
            if (fs.existsSync(docFile)) {
                let content = fs.readFileSync(docFile, 'utf8');
                content = content.replace(/Brave/g, 'Chromium/Chrome');
                content = content.replace(/brave/g, 'chromium');
                fs.writeFileSync(docFile, content);
                console.log(`   ✅ Mis à jour: ${docFile}`);
            }
        }
    }
}

// Exécution si appelé directement
if (require.main === module) {
    const migrator = new BraveToChromiumMigrator();
    migrator.migrate().catch(console.error);
}

module.exports = BraveToChromiumMigrator;