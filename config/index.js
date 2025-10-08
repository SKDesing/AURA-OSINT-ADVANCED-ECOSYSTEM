// ============================================
// config/index.js
// UNIFIED CONFIGURATION - Single Source of Truth
// ============================================

const path = require('path');
const fs = require('fs');

class AURAConfig {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.config = this.loadConfiguration();
  }

  loadConfiguration() {
    const baseConfig = {
      // ========================================
      // CORE SYSTEM
      // ========================================
      system: {
        name: 'AURA TikTok Intelligence',
        version: '2.0.0',
        environment: this.env,
        timezone: 'UTC',
        locale: 'en-US',
      },

      // ========================================
      // PORTS & NETWORKING
      // ========================================
      ports: {
        gui: parseInt(process.env.GUI_PORT) || 3000,
        api: parseInt(process.env.API_PORT) || 4001,
        analytics: parseInt(process.env.ANALYTICS_PORT) || 4002,
        forensic: parseInt(process.env.FORENSIC_PORT) || 4003,
        websocket: parseInt(process.env.WS_PORT) || 4004,
      },

      // ========================================
      // DATABASE CONFIGURATION
      // ========================================
      database: {
        postgresql: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          database: process.env.DB_NAME || 'aura_tiktok',
          username: process.env.DB_USER || 'aura_user',
          password: process.env.DB_PASSWORD || 'secure_password',
          ssl: this.env === 'production',
          pool: {
            min: 2,
            max: 10,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
          },
        },
        
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || null,
          db: parseInt(process.env.REDIS_DB) || 0,
          keyPrefix: 'aura:',
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
        },
      },

      // ========================================
      // TIKTOK ENGINE CONFIGURATION
      // ========================================
      tiktok: {
        browser: {
          headless: process.env.TIKTOK_HEADLESS !== 'false',
          devtools: process.env.TIKTOK_DEVTOOLS === 'true',
          timeout: parseInt(process.env.TIKTOK_TIMEOUT) || 30000,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          viewport: { width: 1920, height: 1080 },
        },
        
        collection: {
          maxConcurrentSessions: parseInt(process.env.TIKTOK_MAX_SESSIONS) || 5,
          messageBufferSize: parseInt(process.env.TIKTOK_BUFFER_SIZE) || 1000,
          collectionInterval: parseInt(process.env.TIKTOK_INTERVAL) || 1000,
          retryAttempts: parseInt(process.env.TIKTOK_RETRIES) || 3,
          sessionTimeout: parseInt(process.env.TIKTOK_SESSION_TIMEOUT) || 3600000, // 1h
        },

        urls: {
          base: 'https://www.tiktok.com',
          live: (username) => `https://www.tiktok.com/@${username}/live`,
          profile: (username) => `https://www.tiktok.com/@${username}`,
        },
      },

      // ========================================
      // SECURITY & FORENSIC
      // ========================================
      security: {
        encryption: {
          algorithm: 'aes-256-gcm',
          keyLength: 32,
          ivLength: 16,
          saltLength: 64,
        },
        
        jwt: {
          secret: process.env.JWT_SECRET || 'aura-super-secret-key-change-in-production',
          expiresIn: '24h',
          issuer: 'AURA-Intelligence',
        },
        
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // requests per window
          message: 'Too many requests from this IP',
        },
        
        forensic: {
          hashAlgorithm: 'sha256',
          signatureAlgorithm: 'RSA-SHA256',
          timestampFormat: 'ISO8601',
          auditLevel: process.env.AUDIT_LEVEL || 'INFO',
        },
      },

      // ========================================
      // STORAGE & ARCHIVING
      // ========================================
      storage: {
        hot: {
          type: 'redis',
          ttl: 3600, // 1 hour
        },
        
        warm: {
          type: 'postgresql',
          retention: '30d',
        },
        
        cold: {
          type: 's3',
          bucket: process.env.S3_BUCKET || 'aura-cold-storage',
          region: process.env.S3_REGION || 'us-east-1',
          retention: '7y',
        },
      },

      // ========================================
      // MONITORING & OBSERVABILITY
      // ========================================
      monitoring: {
        healthCheck: {
          interval: 30000, // 30 seconds
          timeout: 5000,
          retries: 3,
        },
        
        metrics: {
          enabled: true,
          interval: 60000, // 1 minute
          retention: '7d',
        },
        
        logging: {
          level: process.env.LOG_LEVEL || 'info',
          format: 'json',
          maxFiles: 10,
          maxSize: '10m',
          directory: './logs',
        },
      },

      // ========================================
      // ANTI-HARASSMENT ENGINE
      // ========================================
      antiHarassment: {
        ml: {
          modelPath: './ai/models/harassment_detector.pt',
          threshold: 0.7,
          batchSize: 32,
          maxSequenceLength: 512,
        },
        
        detection: {
          severityLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          autoEscalateThreshold: 8,
          coordinatedAttackWindow: 300000, // 5 minutes
          burstThreshold: 5, // messages per minute
        },
        
        response: {
          autoBlock: process.env.AUTO_BLOCK === 'true',
          notifyAuthorities: process.env.NOTIFY_AUTHORITIES === 'true',
          generateReport: true,
          alertWebhook: process.env.ALERT_WEBHOOK_URL,
        },
      },

      // ========================================
      // PERFORMANCE OPTIMIZATION
      // ========================================
      performance: {
        cache: {
          defaultTTL: 300, // 5 minutes
          maxKeys: 10000,
          checkPeriod: 600, // 10 minutes
        },
        
        compression: {
          enabled: true,
          level: 6,
          threshold: 1024,
        },
        
        clustering: {
          enabled: this.env === 'production',
          workers: process.env.CLUSTER_WORKERS || 'auto',
        },
      },
    };

    // Environment-specific overrides
    const envConfig = this.loadEnvironmentConfig();
    return this.deepMerge(baseConfig, envConfig);
  }

  loadEnvironmentConfig() {
    const envConfigPath = path.join(__dirname, `${this.env}.js`);
    
    if (fs.existsSync(envConfigPath)) {
      try {
        return require(envConfigPath);
      } catch (error) {
        console.warn(`Failed to load environment config: ${error.message}`);
      }
    }
    
    return {};
  }

  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // ========================================
  // GETTER METHODS
  // ========================================
  
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  getDatabase(type = 'postgresql') {
    return this.config.database[type];
  }

  getTikTokConfig() {
    return this.config.tiktok;
  }

  getSecurityConfig() {
    return this.config.security;
  }

  getPort(service) {
    return this.config.ports[service];
  }

  isProduction() {
    return this.env === 'production';
  }

  isDevelopment() {
    return this.env === 'development';
  }

  // ========================================
  // VALIDATION
  // ========================================
  
  validate() {
    const required = [
      'database.postgresql.host',
      'database.postgresql.database',
      'security.jwt.secret',
    ];

    const missing = required.filter(path => !this.get(path));
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }

    // Validate ports are not conflicting
    const ports = Object.values(this.config.ports);
    const uniquePorts = new Set(ports);
    
    if (ports.length !== uniquePorts.size) {
      throw new Error('Port conflicts detected in configuration');
    }

    return true;
  }

  // ========================================
  // DYNAMIC UPDATES
  // ========================================
  
  update(path, value) {
    const keys = path.split('.');
    let current = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  // ========================================
  // EXPORT METHODS
  // ========================================
  
  toJSON() {
    return JSON.stringify(this.config, null, 2);
  }

  export() {
    return { ...this.config };
  }
}

// Singleton instance
const config = new AURAConfig();

// Validate configuration on load
try {
  config.validate();
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  process.exit(1);
}

module.exports = config;