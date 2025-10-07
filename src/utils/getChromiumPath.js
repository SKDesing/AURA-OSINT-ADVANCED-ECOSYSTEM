// AURA Chromium Path Detector
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
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
            ]
        };

        const platformPaths = paths[platform] || paths.linux;
        
        for (const chromiumPath of platformPaths) {
            if (fs.existsSync(chromiumPath)) {
                console.log(`✅ Chromium trouvé: ${chromiumPath}`);
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

module.exports = ChromiumPathDetector;