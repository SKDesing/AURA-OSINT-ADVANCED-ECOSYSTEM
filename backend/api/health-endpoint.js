const express = require('express');
const healthChecks = require('../../monitoring/health-checks');
const systemMonitor = require('../../monitoring/system-monitor');
const backupScheduler = require('../../backups/backup-scheduler');

const router = express.Router();

// Main health endpoint
router.get('/health', healthChecks.middleware());

// Detailed system status
router.get('/health/detailed', async (req, res) => {
    try {
        const health = await healthChecks.runAllChecks();
        const metrics = systemMonitor.getMetrics();
        const backupStatus = backupScheduler.getBackupStatus();

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            uptime: process.uptime(),
            health,
            metrics: metrics.slice(-5), // Last 5 metrics
            backups: backupStatus
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Quick ping endpoint
router.get('/ping', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'AURA'
    });
});

// Readiness probe
router.get('/ready', async (req, res) => {
    try {
        const health = await healthChecks.runAllChecks();
        const isReady = Object.values(health).every(check => 
            check.status === 'healthy' || check.status === 'warning'
        );

        if (isReady) {
            res.json({ status: 'ready', timestamp: new Date().toISOString() });
        } else {
            res.status(503).json({ 
                status: 'not_ready', 
                timestamp: new Date().toISOString(),
                issues: Object.entries(health)
                    .filter(([_, check]) => check.status === 'unhealthy')
                    .map(([name, check]) => ({ service: name, issue: check.message }))
            });
        }
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Liveness probe
router.get('/live', (req, res) => {
    res.json({ 
        status: 'alive', 
        timestamp: new Date().toISOString(),
        pid: process.pid,
        uptime: process.uptime()
    });
});

module.exports = router;