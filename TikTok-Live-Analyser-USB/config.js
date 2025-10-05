module.exports = {
  // Configuration des serveurs avec ports séparés
  servers: {
    backend: {
      port: process.env.BACKEND_PORT || 4000,
      host: process.env.BACKEND_HOST || 'localhost'
    },
    frontend: {
      port: process.env.FRONTEND_PORT || 3000,
      host: process.env.FRONTEND_HOST || 'localhost'
    },
    osint: {
      port: process.env.OSINT_PORT || 3001,
      host: process.env.OSINT_HOST || 'localhost'
    },
    microservices: {
      analyser: 3010,
      profiles: 3011,
      lives: 3012,
      database: 3013,
      dashboard: 3014,
      reports: 3015,
      create: 3016,
      forensic: 3017
    }
  },

  // Configuration de la base de données
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aura_investigations',
    user: process.env.DB_USER || 'aura_user',
    password: process.env.DB_PASSWORD || 'aura_secure_2024'
  },

  // Configuration forensique
  forensic: {
    evidenceDir: './evidence',
    maxRetries: 3,
    screenshotQuality: 90,
    enableNetworkLogging: true,
    enableScreenshots: true
  },

  // Logging
  logging: {
    level: 'info',
    files: {
      main: './logs/app.log',
      scraper: './logs/tiktok-scraper.log',
      evidence: './logs/evidence.log'
    }
  }
};