/**
 * 🌐 BRAVE PORTABLE DOWNLOADER
 * Télécharge et configure Brave portable pour AURA
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BravePortableDownloader {
    constructor() {
        this.braveDir = path.join(__dirname, 'brave-portable');
        this.downloadUrls = {
            linux: 'https://github.com/brave/brave-browser/releases/latest/download/brave-browser_amd64.deb',
            windows: 'https://github.com/brave/brave-browser/releases/latest/download/BraveBrowserStandaloneSilentSetup.exe',
            mac: 'https://github.com/brave/brave-browser/releases/latest/download/Brave-Browser.dmg'
        };
    }

    // Détecter l'OS
    detectOS() {
        const platform = process.platform;
        if (platform === 'linux') return 'linux';
        if (platform === 'win32') return 'windows';
        if (platform === 'darwin') return 'mac';
        throw new Error('OS non supporté: ' + platform);
    }

    // Créer la structure portable
    async createPortableStructure() {
        const dirs = [
            this.braveDir,
            path.join(this.braveDir, 'profile'),
            path.join(this.braveDir, 'extensions'),
            path.join(this.braveDir, 'config')
        ];

        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Créé: ${dir}`);
            }
        }
    }

    // Télécharger Brave
    async downloadBrave() {
        const os = this.detectOS();
        const url = this.downloadUrls[os];
        const filename = path.basename(url);
        const filepath = path.join(this.braveDir, filename);

        console.log(`🌐 Téléchargement Brave pour ${os}...`);
        console.log(`📥 URL: ${url}`);

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filepath);
            
            https.get(url, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    // Redirection
                    return https.get(response.headers.location, (redirectResponse) => {
                        redirectResponse.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log(`✅ Téléchargé: ${filepath}`);
                            resolve(filepath);
                        });
                    });
                }
                
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Téléchargé: ${filepath}`);
                    resolve(filepath);
                });
            }).on('error', (err) => {
                fs.unlink(filepath, () => {}); // Supprimer le fichier partiel
                reject(err);
            });
        });
    }

    // Installer Brave portable
    async installBravePortable(downloadedFile) {
        const os = this.detectOS();
        
        try {
            if (os === 'linux') {
                // Extraire le .deb
                console.log('📦 Extraction du package Debian...');
                execSync(`dpkg-deb -x "${downloadedFile}" "${this.braveDir}/extracted"`, { stdio: 'inherit' });
                
                // Copier les binaires
                const extractedPath = path.join(this.braveDir, 'extracted/opt/brave.com/brave');
                if (fs.existsSync(extractedPath)) {
                    execSync(`cp -r "${extractedPath}" "${this.braveDir}/brave"`, { stdio: 'inherit' });
                    console.log('✅ Brave installé en mode portable');
                }
            } else if (os === 'windows') {
                console.log('⚠️ Installation Windows nécessite des droits admin');
                console.log('📝 Exécutez manuellement:', downloadedFile);
            }
        } catch (error) {
            console.error('❌ Erreur installation:', error.message);
        }
    }

    // Créer la configuration AURA
    async createAuraConfig() {
        const configPath = path.join(this.braveDir, 'config/aura-config.json');
        const launcherPath = path.join(this.braveDir, 'launch-aura.sh');
        
        const config = {
            name: 'AURA Forensic Browser',
            version: '2.0.0',
            profile: './profile',
            extensions: ['./extensions/aura-interceptor'],
            startupUrls: [
                'http://localhost:3001'
            ],
            flags: [
                '--user-data-dir=./profile',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--allow-running-insecure-content',
                '--disable-extensions-except=./extensions/aura-interceptor',
                '--load-extension=./extensions/aura-interceptor'
            ]
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('⚙️ Configuration AURA créée');

        // Script de lancement
        const launcherScript = `#!/bin/bash
# 🚀 AURA Forensic Browser Launcher

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRAVE_BINARY="$SCRIPT_DIR/brave/brave-browser"
PROFILE_DIR="$SCRIPT_DIR/profile"
EXTENSION_DIR="$SCRIPT_DIR/extensions/aura-interceptor"

# Créer le profil s'il n'existe pas
mkdir -p "$PROFILE_DIR"

# Lancer Brave avec la configuration AURA
"$BRAVE_BINARY" \\
    --user-data-dir="$PROFILE_DIR" \\
    --disable-web-security \\
    --allow-running-insecure-content \\
    --disable-extensions-except="$EXTENSION_DIR" \\
    --load-extension="$EXTENSION_DIR" \\
    --new-window \\
    "http://localhost:3001" \\
    "http://localhost:4000" \\
    "http://localhost:8080" \\
    "http://localhost:9001" \\
    "$@"
`;

        fs.writeFileSync(launcherPath, launcherScript);
        fs.chmodSync(launcherPath, '755');
        console.log('🚀 Lanceur AURA créé');
    }

    // Créer l'extension AURA
    async createAuraExtension() {
        const extDir = path.join(this.braveDir, 'extensions/aura-interceptor');
        fs.mkdirSync(extDir, { recursive: true });

        // Manifest de l'extension
        const manifest = {
            manifest_version: 3,
            name: 'AURA Forensic Interceptor',
            version: '2.0.0',
            description: 'Extension forensique pour capture TikTok Live',
            permissions: [
                'activeTab',
                'storage',
                'webRequest',
                'webRequestBlocking'
            ],
            host_permissions: [
                '*://*.tiktok.com/*',
                '*://localhost/*'
            ],
            content_scripts: [{
                matches: ['*://*.tiktok.com/*'],
                js: ['interceptor.js'],
                run_at: 'document_start'
            }],
            background: {
                service_worker: 'background.js'
            }
        };

        fs.writeFileSync(
            path.join(extDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        // Script d'interception (copier depuis BrowserInterceptor)
        const BrowserInterceptor = require('./live-tracker/browser-interceptor');
        const interceptor = new BrowserInterceptor();
        
        fs.writeFileSync(
            path.join(extDir, 'interceptor.js'),
            interceptor.getInjectionScript()
        );

        // Background script
        const backgroundScript = `
// 🔍 AURA Extension Background
chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 AURA Forensic Extension activée');
});

// Intercepter les requêtes réseau
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.url.includes('tiktok') && details.url.includes('webcast')) {
            console.log('📡 Requête TikTok interceptée:', details.url);
        }
    },
    { urls: ['*://*.tiktok.com/*'] },
    ['requestBody']
);
`;

        fs.writeFileSync(path.join(extDir, 'background.js'), backgroundScript);
        console.log('🔌 Extension AURA créée');
    }

    // Installation complète
    async install() {
        try {
            console.log('🚀 Installation Brave Portable pour AURA');
            console.log('=====================================');

            await this.createPortableStructure();
            const downloadedFile = await this.downloadBrave();
            await this.installBravePortable(downloadedFile);
            await this.createAuraConfig();
            await this.createAuraExtension();

            console.log('');
            console.log('✅ Installation terminée !');
            console.log('🚀 Lanceur: ./brave-portable/launch-aura.sh');
            console.log('⚙️ Config: ./brave-portable/config/aura-config.json');
            console.log('🔌 Extension: ./brave-portable/extensions/aura-interceptor');

        } catch (error) {
            console.error('❌ Erreur installation:', error);
        }
    }
}

// Exécution si appelé directement
if (require.main === module) {
    const downloader = new BravePortableDownloader();
    downloader.install();
}

module.exports = BravePortableDownloader;