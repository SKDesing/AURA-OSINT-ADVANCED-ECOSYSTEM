// AURA/SCIS - Configuration Centralisée
// ====================================

require('dotenv').config({ path: './ports-config.env' });

const config = {
    // Frontend & Interfaces
    frontend: {
        port: process.env.FRONTEND_PORT || 3000,
        osint: process.env.OSINT_PORT || 3001,
        analyser: process.env.ANALYSER_PORT || 3002,
        profiles: process.env.PROFILES_PORT || 3003,
        lives: process.env.LIVES_PORT || 3004,
        creator: process.env.CREATOR_PORT || 3005,
        database: process.env.DATABASE_PORT || 3006,
        reports: process.env.REPORTS_PORT || 3007,
        forensic: process.env.FORENSIC_PORT || 3008,
        landing: process.env.LANDING_PAGE_PORT || 5000
    },
    
    // Backend & API
    backend: {
        main: process.env.BACKEND_PORT || 4000,
        analyser: process.env.ANALYSER_API_PORT || 4002,
        profiles: process.env.PROFILES_API_PORT || 4003,
        lives: process.env.LIVES_API_PORT || 4004,
        creator: process.env.CREATOR_API_PORT || 4005,
        database: process.env.DATABASE_API_PORT || 4006,
        reports: process.env.REPORTS_API_PORT || 4007
    },
    
    // Infrastructure
    infrastructure: {
        postgres: process.env.POSTGRES_PORT || 5432,
        postgresTest: process.env.POSTGRES_TEST_PORT || 5433,
        redis: process.env.REDIS_PORT || 6379,
        dashboard: process.env.DASHBOARD_PORT || 8080,
        scisDashboard: process.env.SCIS_DASHBOARD_PORT || 9000
    },
    
    // Development
    development: {
        dev: process.env.DEV_PORT || 5001,
        test: process.env.TEST_PORT || 5002,
        staging: process.env.STAGING_PORT || 5003
    }
};

// Fonction utilitaire pour obtenir un port libre
const getAvailablePort = (basePort) => {
    const net = require('net');
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(basePort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(getAvailablePort(basePort + 1));
        });
    });
};

module.exports = { config, getAvailablePort };