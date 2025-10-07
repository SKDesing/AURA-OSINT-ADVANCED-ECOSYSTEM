const fs = require('fs');
const path = require('path');
const os = require('os');

class ChromiumPathDetector {
    static detect() {
        const paths = [
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
                return chromiumPath;
            }
        }
        
        throw new Error('Chromium non trouvé');
    }
    
    static getProfileDir() {
        const homeDir = os.homedir();
        return path.join(homeDir, '.config', 'aura-chromium');
    }
}

module.exports = ChromiumPathDetector;