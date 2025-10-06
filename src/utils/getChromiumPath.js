const { execSync } = require('child_process');
const fs = require('fs');

function getChromiumPath() {
    const paths = [
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/snap/bin/chromium',
        '/opt/google/chrome/chrome'
    ];
    
    for (const path of paths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    
    try {
        return execSync('which chromium || which google-chrome', { encoding: 'utf8' }).trim();
    } catch {
        return '/usr/bin/chromium';
    }
}

module.exports = getChromiumPath;