const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TheHarvesterWrapper {
    constructor() {
        this.toolPath = path.join(__dirname, 'theHarvester');
        this.pythonPath = process.platform === 'win32' ? 'python' : 'python3';
    }

    async harvest(domain, sources = ['google', 'bing', 'yahoo'], limit = 500) {
        return new Promise((resolve, reject) => {
            const outputFile = path.join(this.toolPath, 'results', `${domain}_${Date.now()}.json`);
            
            const args = [
                path.join(this.toolPath, 'theHarvester.py'),
                '-d', domain,
                '-l', limit.toString(),
                '-b', sources.join(','),
                '-f', outputFile
            ];

            const process = spawn(this.pythonPath, args, {
                cwd: this.toolPath,
                env: { ...process.env, PYTHONPATH: path.join(this.toolPath, 'lib') }
            });

            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        if (fs.existsSync(outputFile)) {
                            const results = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
                            resolve({ success: true, results, output });
                        } else {
                            // Parser la sortie texte si pas de JSON
                            const parsed = this.parseTextOutput(output);
                            resolve({ success: true, results: parsed, output });
                        }
                    } catch (e) {
                        resolve({ success: true, results: { raw: output }, output });
                    }
                } else {
                    reject({ success: false, error, output });
                }
            });
        });
    }

    parseTextOutput(output) {
        const emails = [];
        const hosts = [];
        const ips = [];

        const lines = output.split('\n');
        let currentSection = '';

        for (const line of lines) {
            if (line.includes('Emails found:')) currentSection = 'emails';
            else if (line.includes('Hosts found:')) currentSection = 'hosts';
            else if (line.includes('IPs found:')) currentSection = 'ips';
            else if (line.trim() && !line.startsWith('[')) {
                if (currentSection === 'emails' && line.includes('@')) {
                    emails.push(line.trim());
                } else if (currentSection === 'hosts') {
                    hosts.push(line.trim());
                } else if (currentSection === 'ips') {
                    ips.push(line.trim());
                }
            }
        }

        return { emails, hosts, ips };
    }
}

module.exports = TheHarvesterWrapper;