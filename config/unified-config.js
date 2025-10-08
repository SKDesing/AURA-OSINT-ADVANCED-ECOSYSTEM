const path = require('path');

class UnifiedConfig {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.config = this.loadConfig();
    }

    loadConfig() {
        const baseConfig = {
            app: {
                name: 'AURA',
                version: '2.0.0',
                port: process.env.PORT || 4002,
                host: process.env.HOST || 'localhost'
            },
            
            database: {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                name: process.env.DB_NAME || 'aura_forensic',
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'fortress_secure_2024',
                ssl: this.env === 'production',
                pool: {
                    min: 2,
                    max: 10,
                    idle: 30000
                }
            },

            security: {
                jwtSecret: process.env.JWT_SECRET || 'aura-secure-2024',
                jwtExpiry: '24h',
                bcryptRounds: 12,
                rateLimiting: {
                    api: { requests: 100, window: 60000 },
                    auth: { requests: 5, window: 300000 },
                    search: { requests: 50, window: 60000 }
                },
                cors: {
                    origin: this.env === 'production' ? 
                        ['https://aura.forensic.com'] : 
                        ['http://localhost:XXXX', 'http://localhost:XXXX'],
                    credentials: true
                }
            },

            monitoring: {
                enabled: true,
                interval: 30000,
                retention: {
                    metrics: 30, // days
                    logs: 90,    // days
                    alerts: 365  // days
                },
                thresholds: {
                    cpu: 80,
                    memory: 85,
                    disk: 90,
                    responseTime: 5000
                }
            },

            backup: {
                enabled: true,
                schedule: {
                    database: '0 2 * * *',
                    files: '0 3 * * 0',
                    logs: '0 1 * * *'
                },
                retention: {
                    daily: 7,
                    weekly: 4,
                    monthly: 12
                },
                compression: true,
                encryption: true
            },

            logging: {
                level: this.env === 'production' ? 'info' : 'debug',
                forensic: {
                    enabled: true,
                    integrity: true,
                    encryption: true
                },
                files: {
                    application: path.join(__dirname, '../logs/application'),
                    security: path.join(__dirname, '../logs/security'),
                    forensic: path.join(__dirname, '../logs/forensic'),
                    performance: path.join(__dirname, '../logs/performance')
                }
            },

            services: {
                chromium: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                },
                correlation: {
                    cacheSize: 1000,
                    cacheTTL: 300000,
                    batchSize: 100
                },
                analytics: {
                    realtime: true,
                    aggregation: 'hourly',
                    retention: 365
                }
            },

            paths: {
                root: path.join(__dirname, '..'),
                logs: path.join(__dirname, '../logs'),
                backups: path.join(__dirname, '../backups'),
                temp: path.join(__dirname, '../temp'),
                uploads: path.join(__dirname, '../uploads'),
                browser: path.join(__dirname, '../browser')
            }
        };

        // Environment-specific overrides
        const envConfig = this.getEnvironmentConfig();
        return this.mergeConfig(baseConfig, envConfig);
    }

    getEnvironmentConfig() {
        switch (this.env) {
            case 'production':
                return {
                    app: {
                        port: 443,
                        host: '0.0.0.0'
                    },
                    database: {
                        ssl: true,
                        pool: { min: 5, max: 20 }
                    },
                    security: {
                        rateLimiting: {
                            api: { requests: 50, window: 60000 },
                            auth: { requests: 3, window: 300000 }
                        }
                    },
                    logging: {
                        level: 'warn'
                    }
                };

            case 'test':
                return {
                    database: {
                        name: 'aura_test',
                        pool: { min: 1, max: 5 }
                    },
                    monitoring: {
                        enabled: false
                    },
                    backup: {
                        enabled: false
                    }
                };

            default: // development
                return {
                    security: {
                        rateLimiting: {
                            api: { requests: 1000, window: 60000 }
                        }
                    }
                };
        }
    }

    mergeConfig(base, override) {
        const result = { ...base };
        
        for (const key in override) {
            if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
                result[key] = this.mergeConfig(base[key] || {}, override[key]);
            } else {
                result[key] = override[key];
            }
        }
        
        return result;
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    getDatabaseUrl() {
        const db = this.config.database;
        return `postgresql://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`;
    }

    getRedisUrl() {
        return process.env.REDIS_URL || 'redis://localhost:XXXX';
    }

    isProduction() {
        return this.env === 'production';
    }

    isDevelopment() {
        return this.env === 'development';
    }

    isTest() {
        return this.env === 'test';
    }

    validate() {
        const required = [
            'app.name',
            'app.port',
            'database.host',
            'database.name',
            'security.jwtSecret'
        ];

        const missing = required.filter(path => !this.get(path));
        
        if (missing.length > 0) {
            throw new Error(`Missing required configuration: ${missing.join(', ')}`);
        }

        return true;
    }

    export() {
        return {
            ...this.config,
            env: this.env,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new UnifiedConfig();