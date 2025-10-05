const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class SherlockWrapper {
    constructor() {
        this.toolPath = path.join(__dirname, 'sherlock');
        this.pythonPath = process.platform === 'win32' ? 'python' : 'python3';
    }

    async searchUsername(username, options = {}) {
        return new Promise((resolve, reject) => {
            const args = [
                path.join(this.toolPath, 'sherlock.py'),
                username,
                '--output', path.join(this.toolPath, 'results'),
                '--json', path.join(this.toolPath, 'results', `${username}.json`)
            ];

            if (options.timeout) args.push('--timeout', options.timeout);
            if (options.sites) args.push('--site', ...options.sites);

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
                        const resultFile = path.join(this.toolPath, 'results', `${username}.json`);
                        if (fs.existsSync(resultFile)) {
                            const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
                            resolve({ success: true, results, output });
                        } else {
                            resolve({ success: true, results: {}, output });
                        }
                    } catch (e) {
                        resolve({ success: true, results: {}, output, error: e.message });
                    }
                } else {
                    reject({ success: false, error, output });
                }
            });
        });
    }
}

module.exports = SherlockWrapper;