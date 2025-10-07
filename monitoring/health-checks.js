const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class HealthChecks {
    constructor() {
        this.checks = new Map();
        this.results = new Map();
        this.setupChecks();
        this.startHealthMonitoring();
    }

    setupChecks() {
        this.checks.set('database', () => this.checkDatabase());
        this.checks.set('filesystem', () => this.checkFilesystem());
        this.checks.set('memory', () => this.checkMemory());
        this.checks.set('processes', () => this.checkProcesses());
        this.checks.set('network', () => this.checkNetwork());
        this.checks.set('services', () => this.checkServices());
    }

    startHealthMonitoring() {
        // Run health checks every 2 minutes
        setInterval(() => this.runAllChecks(), 120000);
        
        // Initial check
        this.runAllChecks();
    }

    async runAllChecks() {
        const results = {};
        
        for (const [name, checkFn] of this.checks) {
            try {
                results[name] = await checkFn();
            } catch (error) {
                results[name] = {
                    status: 'error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }

        this.results.set('latest', results);
        this.saveHealthReport(results);
        
        const overallStatus = this.calculateOverallStatus(results);
        console.log(`💓 Health Check: ${overallStatus.status.toUpperCase()}`);
        
        return results;
    }

    async checkDatabase() {
        return new Promise((resolve) => {
            exec('pg_isready -h localhost -p 5432', (error, stdout, stderr) => {
                resolve({
                    status: error ? 'unhealthy' : 'healthy',
                    message: error ? 'Database connection failed' : 'Database accessible',
                    details: { stdout, stderr },
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    async checkFilesystem() {
        const checks = [];
        const criticalPaths = [
            './logs',
            './backups',
            './database',
            './browser/profiles'
        ];

        for (const pathToCheck of criticalPaths) {
            const exists = fs.existsSync(pathToCheck);
            const writable = exists ? this.isWritable(pathToCheck) : false;
            
            checks.push({
                path: pathToCheck,
                exists,
                writable,
                status: exists && writable ? 'healthy' : 'unhealthy'
            });
        }

        const allHealthy = checks.every(check => check.status === 'healthy');
        
        return {
            status: allHealthy ? 'healthy' : 'unhealthy',
            message: allHealthy ? 'All paths accessible' : 'Some paths have issues',
            details: checks,
            timestamp: new Date().toISOString()
        };
    }

    isWritable(pathToCheck) {
        try {
            const testFile = path.join(pathToCheck, '.write-test');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            return true;
        } catch {
            return false;
        }
    }

    async checkMemory() {
        const usage = process.memoryUsage();
        const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
        const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
        const percentage = Math.round((usedMB / totalMB) * 100);

        return {
            status: percentage > 90 ? 'unhealthy' : percentage > 70 ? 'warning' : 'healthy',
            message: `Memory usage: ${percentage}%`,
            details: {
                heapUsed: usedMB + ' MB',
                heapTotal: totalMB + ' MB',
                percentage
            },
            timestamp: new Date().toISOString()
        };
    }

    async checkProcesses() {
        const uptime = process.uptime();
        const uptimeHours = Math.round(uptime / 3600);

        return {
            status: uptime > 60 ? 'healthy' : 'warning',
            message: `Process uptime: ${uptimeHours}h`,
            details: {
                pid: process.pid,
                uptime: uptime,
                uptimeFormatted: `${uptimeHours}h ${Math.round((uptime % 3600) / 60)}m`
            },
            timestamp: new Date().toISOString()
        };
    }

    async checkNetwork() {
        const testUrls = [
            'http://localhost:3000',
            'http://localhost:4002'
        ];

        const results = await Promise.all(
            testUrls.map(async url => {
                try {
                    const response = await fetch(url, { timeout: 5000 });
                    return {
                        url,
                        status: response.ok ? 'healthy' : 'unhealthy',
                        responseTime: Date.now()
                    };
                } catch (error) {
                    return {
                        url,
                        status: 'unhealthy',
                        error: error.message
                    };
                }
            })
        );

        const healthyCount = results.filter(r => r.status === 'healthy').length;
        
        return {
            status: healthyCount === results.length ? 'healthy' : 
                   healthyCount > 0 ? 'warning' : 'unhealthy',
            message: `${healthyCount}/${results.length} services responding`,
            details: results,
            timestamp: new Date().toISOString()
        };
    }

    async checkServices() {
        const services = [
            { name: 'forensic-logger', check: () => fs.existsSync('./logs/forensic') },
            { name: 'system-monitor', check: () => fs.existsSync('./monitoring/metrics') },
            { name: 'backup-scheduler', check: () => fs.existsSync('./backups') }
        ];

        const results = services.map(service => ({
            name: service.name,
            status: service.check() ? 'healthy' : 'unhealthy'
        }));

        const healthyServices = results.filter(r => r.status === 'healthy').length;

        return {
            status: healthyServices === services.length ? 'healthy' : 'warning',
            message: `${healthyServices}/${services.length} services healthy`,
            details: results,
            timestamp: new Date().toISOString()
        };
    }

    calculateOverallStatus(results) {
        const statuses = Object.values(results).map(r => r.status);
        
        if (statuses.includes('unhealthy')) {
            return { status: 'unhealthy', level: 'critical' };
        } else if (statuses.includes('warning')) {
            return { status: 'warning', level: 'warning' };
        } else {
            return { status: 'healthy', level: 'info' };
        }
    }

    saveHealthReport(results) {
        const reportPath = path.join(__dirname, 'health-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            overall: this.calculateOverallStatus(results),
            checks: results
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    }

    getHealthStatus() {
        return this.results.get('latest') || {};
    }

    // Express middleware for health endpoint
    middleware() {
        return async (req, res) => {
            const health = await this.runAllChecks();
            const overall = this.calculateOverallStatus(health);
            
            res.status(overall.status === 'healthy' ? 200 : 503).json({
                status: overall.status,
                timestamp: new Date().toISOString(),
                checks: health
            });
        };
    }
}

module.exports = new HealthChecks();