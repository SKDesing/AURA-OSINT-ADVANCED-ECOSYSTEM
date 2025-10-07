const { exec } = require('child_process');
const path = require('path');

/**
 * 🚀 BRAVE LAUNCHER
 * Lance Brave avec une nouvelle fenêtre et onglets séparés
 */
class BraveLauncher {
    constructor() {
        this.bravePaths = [
            'brave-browser',
            'brave',
            '/usr/bin/brave-browser',
            '/snap/bin/brave',
            '/opt/brave.com/brave/brave-browser',
            '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
        ];
    }

    async findBrave() {
        for (const bravePath of this.bravePaths) {
            try {
                await new Promise((resolve, reject) => {
                    exec(`which ${bravePath}`, (error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });
                return bravePath;
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async launchWithNewWindow() {
        const bravePath = await this.findBrave();
        
        if (!bravePath) {
            throw new Error('Brave browser not found');
        }

        const urls = [
            'http://localhost:3001',
            'http://localhost:4000',
            'http://localhost:8080',
            'http://localhost:9001'
        ];

        // Créer un profil temporaire pour isoler la session
        const tempProfile = `/tmp/aura-brave-${Date.now()}`;
        
        const command = `${bravePath} --new-window --user-data-dir="${tempProfile}" --no-first-run --disable-default-apps --disable-extensions --app-auto-launched --no-startup-window ${urls.join(' ')}`;

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Erreur lancement Brave:', error);
                    reject(error);
                } else {
                    console.log('✅ Brave lancé avec succès');
                    resolve({ success: true, urls });
                }
            });
        });
    }

    async launchSeparateWindows() {
        const bravePath = await this.findBrave();
        
        if (!bravePath) {
            throw new Error('Brave browser not found');
        }

        const services = [
            { name: 'Frontend', url: 'http://localhost:3001' },
            { name: 'Backend API', url: 'http://localhost:4000' },
            { name: 'Interface USB', url: 'http://localhost:8080' },
            { name: 'MinIO Console', url: 'http://localhost:9001' }
        ];

        const promises = services.map((service, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const tempProfile = `/tmp/aura-${service.name.toLowerCase()}-${Date.now()}`;
                    const command = `${bravePath} --new-window --user-data-dir="${tempProfile}" --no-first-run --app="${service.url}"`;
                    
                    exec(command, (error) => {
                        if (error) {
                            console.error(`Erreur ${service.name}:`, error);
                        } else {
                            console.log(`✅ ${service.name} ouvert: ${service.url}`);
                        }
                        resolve();
                    });
                }, index * 1000);
            });
        });

        await Promise.all(promises);
        return { success: true, services };
    }
}

module.exports = BraveLauncher;