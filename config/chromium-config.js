/**
 * @module ChromiumConfig
 * @description Configuration centralisée pour AURA OSINT Chromium Engine
 * @compliance ISO/IEC 27037:2012 (Digital Evidence Handling)
 * @version 3.0.0
 */

const path = require('path');
const os = require('os');

const ENV = process.env.NODE_ENV || 'production';
const IS_DOCKER = process.env.DOCKER === 'true';
const IS_CI = process.env.CI === 'true';

module.exports = {
  environment: ENV,
  headless: process.env.CHROMIUM_HEADLESS !== 'false',
  userAgent: process.env.CHROMIUM_USER_AGENT || generateForensicUserAgent(),
  
  network: {
    proxy: {
      enabled: process.env.CHROMIUM_PROXY_ENABLED === 'true',
      server: process.env.CHROMIUM_PROXY_SERVER || 'socks5://127.0.0.1:9050',
      bypass: process.env.CHROMIUM_PROXY_BYPASS || '<-loopback>'
    },
    timeouts: {
      navigation: parseInt(process.env.CHROMIUM_NAV_TIMEOUT) || 30000,
      domContentLoaded: 15000,
      networkIdle: 5000
    }
  },

  forensics: {
    profileIsolation: true,
    profilesDirectory: process.env.AURA_PROFILES_DIR || path.join(__dirname, '../forensic-profiles'),
    profileNamingScheme: 'aura-{timestamp}-{uuid}',
    profileRetentionDays: parseInt(process.env.PROFILE_RETENTION_DAYS) || 90,
    integrityHashing: { enabled: true, algorithm: 'sha256' },
    chainOfCustody: {
      enabled: true,
      operator: process.env.AURA_OPERATOR || 'SYSTEM',
      organization: process.env.AURA_ORG || 'AURA-OSINT-Lab'
    }
  },

  flags: [
    IS_DOCKER || IS_CI ? '--no-sandbox' : null,
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--disable-web-security',
    '--disable-background-networking',
    '--no-first-run',
    '--no-default-browser-check',
    '--lang=en-US,en',
    `--disk-cache-size=${50 * 1024 * 1024}`
  ].filter(Boolean),

  resources: {
    maxMemoryMB: parseInt(process.env.CHROMIUM_MAX_MEMORY) || 1024,
    maxConcurrentInstances: parseInt(process.env.CHROMIUM_MAX_INSTANCES) || os.cpus().length
  },

  security: {
    ignoreHTTPSErrors: process.env.CHROMIUM_IGNORE_HTTPS === 'true',
    blockedDomains: ['doubleclick.net', 'googleadservices.com', 'googlesyndication.com']
  },

  monitoring: {
    enabled: true,
    logLevel: process.env.LOG_LEVEL || 'info',
    autoScreenshot: { enabled: true, interval: 5000, quality: 80 }
  }
};

function generateForensicUserAgent() {
  const chromeVersions = ['120.0.6099.109', '119.0.6045.199', '121.0.6167.85'];
  const platforms = [
    'Windows NT 10.0; Win64; x64',
    'Macintosh; Intel Mac OS X 10_15_7',
    'X11; Linux x86_64'
  ];
  
  const version = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  return `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36 AURA-OSINT`;
}