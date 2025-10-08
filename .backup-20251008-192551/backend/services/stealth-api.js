// AURA Stealth API - Interface pour le Chromium Stealth Logger
const express = require('express');
const ChromiumStealthLogger = require('./chromium-stealth-logger');

class StealthAPI {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.stealthLogger = null;
        this.setupRoutes();
    }

    setupRoutes() {
        // Démarrer une session stealth
        this.app.post('/api/stealth/start', async (req, res) => {
            try {
                const { targetUrl, profilePath } = req.body;
                
                if (this.stealthLogger && this.stealthLogger.isActive) {
                    return res.status(400).json({
                        success: false,
                        error: 'Une session stealth est déjà active'
                    });
                }
                
                this.stealthLogger = new ChromiumStealthLogger({
                    profilePath: profilePath
                });
                
                const result = await this.stealthLogger.startStealthSession(targetUrl);
                res.json(result);
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Arrêter la session stealth
        this.app.post('/api/stealth/stop', async (req, res) => {
            try {
                if (!this.stealthLogger || !this.stealthLogger.isActive) {
                    return res.status(400).json({
                        success: false,
                        error: 'Aucune session stealth active'
                    });
                }
                
                const result = await this.stealthLogger.stopStealthSession();
                res.json(result);
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Status de la session
        this.app.get('/api/stealth/status', (req, res) => {
            if (!this.stealthLogger) {
                return res.json({
                    active: false,
                    session_id: null,
                    logs_count: 0
                });
            }
            
            const stats = this.stealthLogger.getSessionStats();
            res.json({
                active: stats.is_active,
                session_id: stats.session_id,
                logs_count: Object.values(stats.logs_count).reduce((a, b) => a + b, 0),
                uptime: stats.uptime,
                details: stats
            });
        });

        // Récupérer les logs en temps réel
        this.app.get('/api/stealth/logs', (req, res) => {
            if (!this.stealthLogger) {
                return res.json({ logs: [], count: 0 });
            }
            
            const { type, limit = 100 } = req.query;
            let logs = [];
            
            if (type && this.stealthLogger.logs[type]) {
                logs = this.stealthLogger.logs[type].slice(-limit);
            } else {
                // Tous les logs mélangés par timestamp
                const allLogs = [
                    ...this.stealthLogger.logs.network,
                    ...this.stealthLogger.logs.console,
                    ...this.stealthLogger.logs.forensic,
                    ...this.stealthLogger.logs.websockets
                ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                logs = allLogs.slice(0, limit);
            }
            
            res.json({
                logs: logs,
                count: logs.length,
                session_id: this.stealthLogger.sessionId
            });
        });

        // Logs forensiques TikTok uniquement
        this.app.get('/api/stealth/forensic', (req, res) => {
            if (!this.stealthLogger) {
                return res.json({ forensic_logs: [], count: 0 });
            }
            
            const forensicLogs = this.stealthLogger.logs.forensic;
            res.json({
                forensic_logs: forensicLogs,
                count: forensicLogs.length,
                session_id: this.stealthLogger.sessionId,
                high_value_count: forensicLogs.filter(log => 
                    log.analysis?.forensic_value === 'high'
                ).length
            });
        });

        // Export complet des logs
        this.app.post('/api/stealth/export', async (req, res) => {
            try {
                if (!this.stealthLogger) {
                    return res.status(400).json({
                        success: false,
                        error: 'Aucune session stealth disponible'
                    });
                }
                
                const filepath = await this.stealthLogger.exportLogs();
                res.json({
                    success: true,
                    filepath: filepath,
                    session_id: this.stealthLogger.sessionId
                });
                
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Analyse forensique avancée
        this.app.get('/api/stealth/analysis', (req, res) => {
            if (!this.stealthLogger) {
                return res.json({ analysis: null });
            }
            
            const logs = this.stealthLogger.logs;
            const analysis = {
                session_id: this.stealthLogger.sessionId,
                duration: this.stealthLogger.isActive ? 
                    Date.now() - parseInt(this.stealthLogger.sessionId.split('_')[1]) : 0,
                
                network_analysis: {
                    total_requests: logs.network.filter(l => l.type === 'network_request').length,
                    tiktok_api_calls: logs.forensic.filter(l => l.forensic_type === 'tiktok_api').length,
                    unique_endpoints: [...new Set(logs.network.map(l => l.url))].length,
                    data_transferred: logs.network.reduce((acc, log) => {
                        return acc + (log.postData ? log.postData.length : 0);
                    }, 0)
                },
                
                forensic_analysis: {
                    high_value_data: logs.forensic.filter(l => l.analysis?.forensic_value === 'high').length,
                    user_profiles_detected: logs.forensic.filter(l => 
                        l.analysis?.endpoint_type === 'user_profile'
                    ).length,
                    live_streams_detected: logs.forensic.filter(l => 
                        l.analysis?.endpoint_type === 'live_stream'
                    ).length,
                    algorithm_data: logs.forensic.filter(l => 
                        l.analysis?.data_type === 'algorithm_data'
                    ).length
                },
                
                security_analysis: {
                    cookies_captured: logs.cookies.length,
                    storage_snapshots: logs.storage.length,
                    console_errors: logs.console.filter(l => l.level === 'error').length,
                    potential_tracking: logs.network.filter(l => 
                        l.url.includes('analytics') || l.url.includes('tracking')
                    ).length
                }
            };
            
            res.json({ analysis });
        });
    }

    start(port = 4003) {
        this.app.listen(port, () => {
            console.log(`🕵️  AURA Stealth API démarrée sur port ${port}`);
            console.log(`🔍 Endpoints disponibles:`);
            console.log(`   POST /api/stealth/start     - Démarrer session stealth`);
            console.log(`   POST /api/stealth/stop      - Arrêter session stealth`);
            console.log(`   GET  /api/stealth/status    - Status session`);
            console.log(`   GET  /api/stealth/logs      - Logs temps réel`);
            console.log(`   GET  /api/stealth/forensic  - Logs forensiques TikTok`);
            console.log(`   POST /api/stealth/export    - Export complet`);
            console.log(`   GET  /api/stealth/analysis  - Analyse forensique`);
        });
    }
}

// Démarrage si appelé directement
if (require.main === module) {
    const stealthAPI = new StealthAPI();
    stealthAPI.start();
}

module.exports = StealthAPI;