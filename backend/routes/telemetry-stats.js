const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.API_DATABASE_URL });

router.get('/stats', async (_req, res) => {
  try {
    const { rows: r1 } = await pool.query(`SELECT COUNT(*)::int AS c FROM telemetry_events WHERE created_at > now() - interval '1 minute'`);
    const { rows: r5 } = await pool.query(`SELECT COUNT(*)::int AS c FROM telemetry_events WHERE created_at > now() - interval '5 minute'`);
    const { rows: re } = await pool.query(`SELECT COUNT(*)::int AS c FROM telemetry_events WHERE created_at > now() - interval '1 minute' AND (payload->>'t' IN ('net_fail','js_err'))`);
    const { rows: rl } = await pool.query(`SELECT EXTRACT(EPOCH FROM COALESCE(MAX(created_at), now()))::bigint*1000 AS ts FROM telemetry_events`);
    res.json({
      receivedLastMin: r1[0]?.c || 0,
      receivedLast5Min: r5[0]?.c || 0,
      errorsLastMin: re[0]?.c || 0,
      lastFlushTs: Number(rl[0]?.ts || 0)
    });
  } catch (e) {
    console.error('Telemetry stats error:', e);
    res.status(500).json({ error: 'Failed to get telemetry stats' });
  }
});

module.exports = router;