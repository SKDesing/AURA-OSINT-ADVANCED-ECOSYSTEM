module.exports = {
  // Configuration de la base de données
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'live_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Mohand/06'
  },

  // Configuration des serveurs
  servers: {
    backend: {
      port: process.env.BACKEND_PORT || 4000,
      host: process.env.BACKEND_HOST || 'localhost'
    },
    frontend: {
      port: process.env.FRONTEND_PORT || 3000,
      host: process.env.FRONTEND_HOST || 'localhost'
    }
  },

  // Configuration Puppeteer/Brave
  browser: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/snap/bin/brave',
    userDataDir: process.env.PUPPETEER_USER_DATA_DIR || (process.env.HOME + '/.config/BraveSoftware/Brave-Browser'),
    headless: process.env.NODE_ENV === 'production' ? true : false,
    args: [
      '--no-first-run',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  },

  // Profils TikTok à analyser
  profiles: [
    'historia_med',
    'titilepirate2', 
    'titi.le.pirate',
    'titilepirate3',
    'saadallahnordine',
    'sedsky777'
  ],

  // Configuration forensique
  forensic: {
    evidenceDir: process.env.EVIDENCE_DIR || './evidence',
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    screenshotQuality: parseInt(process.env.SCREENSHOT_QUALITY) || 90,
    enableNetworkLogging: process.env.ENABLE_NETWORK_LOGGING !== 'false',
    enableScreenshots: process.env.ENABLE_SCREENSHOTS !== 'false'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    files: {
      main: process.env.LOG_MAIN_FILE || 'app.log',
      scraper: process.env.LOG_SCRAPER_FILE || 'tiktok-scraper.log',
      evidence: process.env.LOG_EVIDENCE_FILE || 'evidence.log'
    }
  }
};