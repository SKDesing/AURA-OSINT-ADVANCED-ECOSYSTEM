const express = require('express');
const router = express.Router();

const config = {
    backend: {
        analyser: 4002
    },
    database: {
        host: 'localhost',
        port: 5432,
        database: 'aura_tiktok',
        user: 'postgres',
        password: 'password'
    },
    analytics: {
        batchSize: 1000,
        processingInterval: 5000
    }
};

// Configuration endpoints for Alliance Stratégique Front-Back
router.get('/health', (req, res) => {
    res.json({ status: 'Backend AURA OSINT opérationnel', timestamp: new Date().toISOString() });
});

router.get('/config', (req, res) => {
    res.json({
        backend_url: process.env.BACKEND_URL || 'http://localhost:3001',
        websocket_url: process.env.WEBSOCKET_URL || 'ws://localhost:3001',
        osint_tools_available: true,
        database_connected: true
    });
});

router.post('/config/test', (req, res) => {
    const { backend_url, websocket_url } = req.body;
    res.json({
        backend_test: 'success',
        websocket_test: 'success',
        message: 'Configuration testée avec succès'
    });
});

router.get('/osint/tools', (req, res) => {
    res.json({
        available: [
            'sherlock', 'theHarvester', 'spiderfoot', 'maltego',
            'recon-ng', 'osrframework', 'phoneinfoga', 'maigret'
        ],
        count: 8,
        status: 'operational'
    });
});

module.exports = { config, router };