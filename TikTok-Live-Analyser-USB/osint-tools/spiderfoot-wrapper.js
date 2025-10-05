const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

class SpiderFootWrapper {
    constructor() {
        this.toolPath = path.join(__dirname, 'spiderfoot');
        this.pythonPath = process.platform === 'win32' ? 'python' : 'python3';
        this.serverProcess = null;
        this.serverPort = 5001;
        this.isRunning = false;
    }

    async startServer() {
        if (this.isRunning) return true;

        return new Promise((resolve, reject) => {
            const args = [
                path.join(this.toolPath, 'sf.py'),
                '-l', `127.0.0.1:${this.serverPort}`
            ];

            this.serverProcess = spawn(this.pythonPath, args, {
                cwd: this.toolPath,
                env: { ...process.env, PYTHONPATH: path.join(this.toolPath, 'lib') }
            });

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Web server running')) {
                    this.isRunning = true;
                    resolve(true);
                }
            });

            this.serverProcess.on('error', (error) => {
                reject(error);
            });

            // Timeout après 30 secondes
            setTimeout(() => {
                if (!this.isRunning) {
                    reject(new Error('SpiderFoot server failed to start'));
                }
            }, 30000);
        });
    }

    async stopServer() {
        if (this.serverProcess) {
            this.serverProcess.kill();
            this.serverProcess = null;
            this.isRunning = false;
        }
    }

    async createScan(target, scanName, modules = []) {
        try {
            const response = await axios.post(`http://127.0.0.1:${this.serverPort}/api/scan`, {
                scanname: scanName,
                scantarget: target,
                modulelist: modules.length > 0 ? modules : ['sfp_dnsresolve', 'sfp_whois', 'sfp_social']
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create scan: ${error.message}`);
        }
    }

    async getScanStatus(scanId) {
        try {
            const response = await axios.get(`http://127.0.0.1:${this.serverPort}/api/scan/${scanId}/status`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get scan status: ${error.message}`);
        }
    }

    async getScanResults(scanId) {
        try {
            const response = await axios.get(`http://127.0.0.1:${this.serverPort}/api/scan/${scanId}/data`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get scan results: ${error.message}`);
        }
    }

    async runQuickScan(target, scanName = `Quick_${Date.now()}`) {
        await this.startServer();
        
        // Attendre que le serveur soit prêt
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const scan = await this.createScan(target, scanName);
        const scanId = scan.id;
        
        // Attendre la fin du scan
        let status = 'RUNNING';
        while (status === 'RUNNING') {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const statusResponse = await this.getScanStatus(scanId);
            status = statusResponse.status;
        }
        
        const results = await this.getScanResults(scanId);
        return { scanId, status, results };
    }
}

module.exports = SpiderFootWrapper;