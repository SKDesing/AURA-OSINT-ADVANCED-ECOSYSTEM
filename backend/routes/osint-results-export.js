const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.API_DATABASE_URL });

// GET /api/osint/results/export?type=&q=&format=csv|ndjson
router.get('/results/export', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const type = (req.query.type || '').toString().trim();
    const format = ((req.query.format || 'csv').toString().trim().toLowerCase());
    const limit = Math.min(Number(req.query.limit || 5000), 20000);

    const params = [];
    const where = [];
    if (type) { params.push(type); where.push(`entity_type = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`(data::text ILIKE $${params.length})`); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT id, job_id, entity_type, data, created_at
      FROM osint_results
      ${whereSql}
      ORDER BY id DESC
      LIMIT ${limit}
    `;
    const { rows } = await pool.query(sql, params);

    if (format === 'ndjson') {
      res.setHeader('Content-Type', 'application/x-ndjson');
      for (const r of rows) {
        const o = {
          id: r.id, jobId: r.job_id, type: r.entity_type, createdAt: r.created_at,
          ...r.data
        };
        res.write(JSON.stringify(o) + '\n');
      }
      return res.end();
    }

    // CSV
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.write('id,jobId,type,value,site,url,email,status,source,createdAt\n');
    for (const r of rows) {
      const d = r.data || {};
      const line = [
        r.id, r.job_id, r.entity_type,
        (d.value || ''), (d.site || ''), (d.url || ''), (d.email || ''), (d.status || ''), (d.source || ''),
        r.created_at?.toISOString?.() || r.created_at
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',');
      res.write(line + '\n');
    }
    res.end();
  } catch (e) {
    console.error('Export results error:', e);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

module.exports = router;