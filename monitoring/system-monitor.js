const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');

class SystemMonitor {
    constructor() {
        this.metricsDir = path.join(__dirname, 'metrics');
        this.alertsDir = path.join(__dirname, 'alerts');
        this.thresholds = {
            cpu: 80,
            memory: 85,
            disk: 90,
            responseTime: 5000
        };
        this.metricsInterval = null;
        this.healthInterval = null;
        this.ensureDirs();
        this.startMonitoring();
    }

    ensureDirs() {
        [this.metricsDir, this.alertsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    startMonitoring() {
        this.collectMetrics();
        this.healthCheck();
        
        this.metricsInterval = setInterval(() => this.collectMetrics(), 30000);
        this.healthInterval = setInterval(() => this.healthCheck(), 60000);
    }

    async collectMetrics() {
        try {
            const metrics = {
                timestamp: new Date().toISOString(),
                cpu: this.getCPUUsage(),
                memory: this.getMemoryUsage(),
                disk: await this.getDiskUsage(),
                network: this.getNetworkStats(),
                processes: await this.getProcessCount()
            };

            this.saveMetrics(metrics);
            this.checkThresholds(metrics);
            return metrics;
        } catch (error) {
            console.error('❌ Erreur collecte métriques:', error.message);
            return null;
        }
    }

    getCPUUsage() {
        const cpus = os.cpus();
        let totalIdle = 0, totalTick = 0;
        
        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        return Math.round(100 - (totalIdle / totalTick) * 100);
    }

    getMemoryUsage() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;
        return {
            total: Math.round(total / 1024 / 1024),
            used: Math.round(used / 1024 / 1024),
            free: Math.round(free / 1024 / 1024),
            percentage: Math.round((used / total) * 100)
        };
    }

    async getDiskUsage() {
        return new Promise((resolve) => {
            exec('df -h /', (error, stdout) => {
                if (error) {
                    resolve({ percentage: 0, available: 'unknown', used: 'unknown' });
                    return;
                }
                const lines = stdout.split('\n');
                const data = lines[1].split(/\s+/);
                resolve({
                    percentage: parseInt(data[4]),
                    available: data[3],
                    used: data[2],
                    total: data[1]
                });
            });
        });
    }

    getNetworkStats() {
        const interfaces = os.networkInterfaces();
        let activeConnections = 0;
        const activeInterfaces = [];

        Object.keys(interfaces).forEach(name => {
            interfaces[name].forEach(iface => {
                if (!iface.internal && iface.family === 'IPv4') {
                    activeConnections++;
                    activeInterfaces.push({
                        name,
                        address: iface.address,
                        netmask: iface.netmask
                    });
                }
            });
        });

        return { 
            activeConnections,
            interfaces: activeInterfaces
        };
    }

    async getProcessCount() {
        return new Promise((resolve) => {
            exec('ps aux | wc -l', (error, stdout) => {
                if (error) {
                    resolve(0);
                    return;
                }
                resolve(parseInt(stdout.trim()) || 0);
            });
        });
    }

    saveMetrics(metrics) {
        try {
            const file = path.join(this.metricsDir, `metrics-${new Date().toISOString().split('T')[0]}.json`);
            
            let data = [];
            if (fs.existsSync(file)) {
                data = JSON.parse(fs.readFileSync(file, 'utf8'));
            }
            
            data.push(metrics);
            
            if (data.length > 2880) {
                data = data.slice(-2880);
            }
            
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('❌ Erreur sauvegarde métriques:', error.message);
        }
    }

    checkThresholds(metrics) {
        const alerts = [];

        if (metrics.cpu > this.thresholds.cpu) {
            alerts.push({
                type: 'CPU_HIGH',
                value: metrics.cpu,
                threshold: this.thresholds.cpu,
                severity: 'WARNING'
            });
        }

        if (metrics.memory.percentage > this.thresholds.memory) {
            alerts.push({
                type: 'MEMORY_HIGH',
                value: metrics.memory.percentage,
                threshold: this.thresholds.memory,
                severity: 'WARNING'
            });
        }

        if (metrics.disk.percentage > this.thresholds.disk) {
            alerts.push({
                type: 'DISK_HIGH',
                value: metrics.disk.percentage,
                threshold: this.thresholds.disk,
                severity: 'CRITICAL'
            });
        }

        if (alerts.length > 0) {
            this.triggerAlerts(alerts);
        }
    }

    triggerAlerts(alerts) {
        try {
            const alertFile = path.join(this.alertsDir, `alerts-${new Date().toISOString().split('T')[0]}.json`);
            
            const alertData = {
                timestamp: new Date().toISOString(),
                alerts,
                severity: alerts.some(a => a.severity === 'CRITICAL') ? 'CRITICAL' : 'WARNING'
            };

            const existingAlerts = fs.existsSync(alertFile) 
                ? JSON.parse(fs.readFileSync(alertFile, 'utf8')) 
                : [];
            
            existingAlerts.push(alertData);
            fs.writeFileSync(alertFile, JSON.stringify(existingAlerts, null, 2));

            const emoji = alertData.severity === 'CRITICAL' ? '🔴' : '🟠';
            console.log(`${emoji} ${alertData.severity}: ${alerts.map(a => `${a.type}: ${a.value}%`).join(', ')}`);
        } catch (error) {
            console.error('❌ Erreur déclenchement alertes:', error.message);
        }
    }

    async healthCheck() {
        try {
            const health = {
                timestamp: new Date().toISOString(),
                status: 'healthy',
                services: await this.checkServices(),
                uptime: Math.round(process.uptime()),
                version: process.version,
                platform: os.platform(),
                hostname: os.hostname()
            };

            const unhealthyServices = health.services.filter(s => !s.healthy);
            if (unhealthyServices.length > 0) {
                health.status = 'degraded';
                this.triggerAlerts([{
                    type: 'SERVICE_DOWN',
                    services: unhealthyServices.map(s => s.name),
                    severity: 'CRITICAL'
                }]);
            }

            fs.writeFileSync(path.join(this.metricsDir, 'health.json'), JSON.stringify(health, null, 2));
            return health;
        } catch (error) {
            console.error('❌ Erreur health check:', error.message);
            return { status: 'error', error: error.message };
        }
    }

    async checkServices() {
        const services = [
            { name: 'database', port: 5432, path: '/health' },
            { name: 'api', port: 4002, path: '/health' },
            { name: 'gui', port: 3000, path: '/' }
        ];

        return Promise.all(services.map(async service => {
            try {
                const response = await axios.get(
                    `http://localhost:${service.port}${service.path}`,
                    { timeout: 3000 }
                );
                
                return {
                    name: service.name,
                    healthy: response.status === 200,
                    port: service.port,
                    responseTime: response.headers['x-response-time'] || 'N/A'
                };
            } catch (error) {
                return {
                    name: service.name,
                    healthy: false,
                    port: service.port,
                    error: error.message
                };
            }
        }));
    }

    getMetrics(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const file = path.join(this.metricsDir, `metrics-${targetDate}.json`);
        
        if (!fs.existsSync(file)) {
            return [];
        }
        
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (error) {
            console.error('❌ Erreur lecture métriques:', error.message);
            return [];
        }
    }

    getAggregatedStats(date = null) {
        const metrics = this.getMetrics(date);
        if (metrics.length === 0) return null;

        const cpuValues = metrics.map(m => m.cpu);
        const memValues = metrics.map(m => m.memory.percentage);

        return {
            cpu: {
                avg: Math.round(cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length),
                max: Math.max(...cpuValues),
                min: Math.min(...cpuValues)
            },
            memory: {
                avg: Math.round(memValues.reduce((a, b) => a + b, 0) / memValues.length),
                max: Math.max(...memValues),
                min: Math.min(...memValues)
            },
            dataPoints: metrics.length
        };
    }

    stop() {
        if (this.metricsInterval) clearInterval(this.metricsInterval);
        if (this.healthInterval) clearInterval(this.healthInterval);
        console.log('✅ SystemMonitor arrêté proprement');
    }
}

module.exports = new SystemMonitor();