const express = require('express');
const { spawn } = require('node:child_process');
const path = require('node:path');

const router = express.Router();

router.get('/doctor', async (_req, res) => {
  try {
    const script = path.resolve(process.cwd(), 'scripts', 'osint', 'doctor.mjs');
    const ps = spawn(process.execPath, [script], { stdio: ['ignore', 'pipe', 'pipe'] });
    const rows = [];
    let stderr = '';

    const watchdog = setTimeout(() => { try { ps.kill('SIGKILL'); } catch {} }, 15000);

    ps.stdout.on('data', (d) => {
      const lines = d.toString().split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        try { rows.push(JSON.parse(line)); } catch {}
      }
    });
    ps.stderr.on('data', (d) => { stderr += d.toString(); });
    ps.on('close', () => {
      clearTimeout(watchdog);
      res.json({ rows, stderr: stderr || undefined });
    });
    ps.on('error', (e) => {
      clearTimeout(watchdog);
      res.status(500).json({ error: e.message || 'doctor failed' });
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'doctor failed' });
  }
});

module.exports = router;