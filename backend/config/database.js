const knex = require('knex');
const logger = require('../utils/logger');

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aura_osint',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

const db = knex(config);

const connectDB = async () => {
  try {
    await db.raw('SELECT 1+1 as result');
    logger.info('✅ Database connected successfully');
    
    // Run migrations in production
    if (process.env.NODE_ENV === 'production') {
      await db.migrate.latest();
      logger.info('✅ Database migrations completed');
    }
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

module.exports = { db, connectDB };