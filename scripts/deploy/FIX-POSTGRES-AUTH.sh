#!/bin/bash
set -e

echo "🔧 Correction authentification PostgreSQL..."

cd backend

# Créer .env avec auth système
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura_osint
DB_USER=soufiane
DB_PASSWORD=

REDIS_HOST=localhost
REDIS_PORT=6379

QWEN_API_URL=http://localhost:8080
ELASTICSEARCH_URL=http://localhost:9200
QDRANT_URL=http://localhost:6333

JWT_SECRET=aura-osint-secret-2024
PORT=4011
NODE_ENV=production
EOF

# Modifier config/database.js
cat > config/database.js << 'EOF'
const { Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'aura_osint',
  user: process.env.DB_USER || 'soufiane',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

if (process.env.DB_PASSWORD) {
  config.password = process.env.DB_PASSWORD;
}

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('✅ PostgreSQL connecté');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL erreur:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  connectDB: async () => {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Database connection OK');
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      throw err;
    }
  }
};
EOF

echo "✅ Configuration corrigée"
