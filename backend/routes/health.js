const express = require('express');
const { pool } = require('../config/database');
const redis = require('../config/redis');

const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    await pool.query('SELECT 1');
    health.services.postgres = { status: 'healthy' };
  } catch (error) {
    health.services.postgres = { status: 'unhealthy', error: error.message };
    health.status = 'degraded';
  }

  try {
    await redis.ping();
    health.services.redis = { status: 'healthy' };
  } catch (error) {
    health.services.redis = { status: 'unhealthy', error: error.message };
    health.status = 'degraded';
  }

  const memUsage = process.memoryUsage();
  health.memory = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024),
    total: Math.round(memUsage.heapTotal / 1024 / 1024)
  };

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;