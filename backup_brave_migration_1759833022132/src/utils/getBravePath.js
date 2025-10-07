const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getBraveExecutablePath() {
    if (process.env.BRAVE_EXECUTABLE_PATH) {
        console.log(`🔧 Utilisation de Brave depuis la variable d'environnement: ${process.env.BRAVE_EXECUTABLE_PATH}`);
        if (fs.existsSync(process.env.BRAVE_EXECUTABLE_PATH)) {
            return process.env.BRAVE_EXECUTABLE_PATH;
        }
        console.warn(`⚠️ Le chemin dans BRAVE_EXECUTABLE_PATH est invalide: ${process.env.BRAVE_EXECUTABLE_PATH}`);
    }

    const platform = os.platform();
    let bravePath;

    console.log(`🔍 Recherche automatique de Brave pour la plateforme: ${platform}`);

    switch (platform) {
        case 'win32':
            const winPaths = [
                path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
                path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe')
            ];
            bravePath = winPaths.find(fs.existsSync);
            break;

        case 'darwin':
            const macPath = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
            if (fs.existsSync(macPath)) {
                bravePath = macPath;
            }
            break;

        case 'linux':
            const linuxPaths = [
                '/snap/bin/brave',
                '/usr/bin/brave-browser',
                '/usr/local/bin/brave',
                '/opt/brave.com/brave/brave-browser'
            ];
            bravePath = linuxPaths.find(fs.existsSync);

            if (!bravePath) {
                try {
                    const whichPath = execSync('which brave-browser || which brave', { encoding: 'utf8' }).trim();
                    if (whichPath) {
                        bravePath = whichPath;
                    }
                } catch (e) {}
            }
            break;

        default:
            throw new Error(`❌ Plateforme non supportée: ${platform}`);
    }

    if (bravePath) {
        console.log(`✅ Brave détecté automatiquement à: ${bravePath}`);
        return bravePath;
    }

    throw new Error(`❌ Brave n'a pas été trouvé sur ce système.

Veuillez installer Brave Browser ou définir le chemin manuellement avec la variable d'environnement 'BRAVE_EXECUTABLE_PATH'.

Exemples:
- Windows: set BRAVE_EXECUTABLE_PATH="C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
- macOS: export BRAVE_EXECUTABLE_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
- Linux: export BRAVE_EXECUTABLE_PATH="/snap/bin/brave"`);
}

module.exports = { getBraveExecutablePath };