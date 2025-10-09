const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:aura_secure_2025@localhost:5432/aura_osint',
  max: 50,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = { pool };