const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.API_DATABASE_URL });

// GET /api/osint/results?q=&type=&limit=
router.get('/results', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const type = (req.query.type || '').toString().trim();
    const limit = Math.min(Number(req.query.limit || 200), 1000);

    const params = [];
    let where = [];
    if (type) { params.push(type); where.push(`entity_type = $${params.length}`); }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(data::text ILIKE $${params.length})`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT id, job_id, entity_type, data, created_at
      FROM osint_results
      ${whereSql}
      ORDER BY id DESC
      LIMIT ${limit}
    `;
    const { rows } = await pool.query(sql, params);

    const results = rows.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      type: r.entity_type,
      value: r.data?.value,
      site: r.data?.site,
      url: r.data?.url,
      email: r.data?.email,
      status: r.data?.status,
      source: r.data?.source,
      createdAt: r.created_at,
    }));
    res.json({ results });
  } catch (e) {
    console.error('List results error:', e);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

module.exports = router;