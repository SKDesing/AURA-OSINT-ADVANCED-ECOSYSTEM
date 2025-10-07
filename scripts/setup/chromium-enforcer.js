const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ChromiumEnforcer {
    static getChromiumPath() {
        const paths = [
            path.join(__dirname, '../../chrome/chrome'), // AURA Chromium local
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium',
            '/usr/bin/google-chrome',
            '/opt/google/chrome/chrome',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ];
        
        for (const chromiumPath of paths) {
            if (fs.existsSync(chromiumPath)) {
                console.log(`✅ Chromium détecté: ${chromiumPath}`);
                return chromiumPath;
            }
        }
        
        throw new Error('❌ ERREUR CRITIQUE: Aucun navigateur Chromium détecté!\n' +
                       '📋 Installez Chromium: sudo apt install chromium-browser');
    }
    
    static launchWithStartup() {
        try {
            const chromiumPath = this.getChromiumPath();
            const wizardUrl = 'http://localhost:3000/install';
            
            console.log('🚀 Lancement Chromium avec wizard d\'installation...');
            console.log(`🌐 URL: ${wizardUrl}`);
            
            const command = `"${chromiumPath}" --app="${wizardUrl}" --start-maximized --disable-web-security --disable-features=VizDisplayCompositor --disable-dev-shm-usage`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Erreur lancement Chromium:', error);
                } else {
                    console.log('✅ Chromium lancé avec succès');
                }
            });
            
            return true;
        } catch (error) {
            console.error('❌ Échec lancement Chromium:', error.message);
            return false;
        }
    }
    
    static launchMainInterface() {
        try {
            const chromiumPath = this.getChromiumPath();
            const command = `"${chromiumPath}" "http://localhost:3000" --new-window`;
            
            console.log('🌐 Lancement interface principale AURA...');
            exec(command);
            
            return true;
        } catch (error) {
            console.error('❌ Échec lancement interface:', error.message);
            return false;
        }
    }
    
    static enforceChromiumOnly() {
        // Vérifier que Chromium est disponible au démarrage
        try {
            this.getChromiumPath();
            console.log('🛡️ Enforcement Chromium-Only: ACTIF');
            return true;
        } catch (error) {
            console.error('🚨 ENFORCEMENT CHROMIUM ÉCHOUÉ:', error.message);
            process.exit(1);
        }
    }
}

module.exports = ChromiumEnforcer;