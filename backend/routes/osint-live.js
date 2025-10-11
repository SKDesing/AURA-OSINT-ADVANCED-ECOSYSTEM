const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

// Utilitaires
function runCmd(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    let out = '', err = '';
    ps.stdout.on('data', d => out += d.toString());
    ps.stderr.on('data', d => err += d.toString());
    ps.on('close', code => code === 0 ? resolve({ out, err }) : reject(new Error(err || `Exit ${code}`)));
  });
}

// POST /api/osint/live/sherlock { username, platforms?[] }
router.post('/sherlock', async (req, res) => {
  const { username, platforms = [] } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username is required' });

  const args = ['--json', '--print-found', username];
  if (Array.isArray(platforms) && platforms.length) args.push('--site', platforms.join(','));

  try {
    console.log(`🔍 Running Sherlock for: ${username}`);
    const { out } = await runCmd('sherlock', args, { timeout: 60_000 });
    
    let results;
    try { 
      results = JSON.parse(out); 
    } catch {
      results = out.split('\n').filter(Boolean).map(l => { 
        try { return JSON.parse(l); } catch { return null; } 
      }).filter(Boolean);
    }
    
    // Transform to consistent format
    const formattedResults = Object.keys(results || {}).map(site => ({
      site,
      url: results[site]?.url_user || results[site]?.url,
      status: results[site]?.status || 'found',
      response_time: results[site]?.response_time_s
    })).filter(r => r.url);
    
    return res.json({ tool: 'sherlock', username, results: formattedResults });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/osint/live/amass { domain, passive? }
router.post('/amass', async (req, res) => {
  const { domain, passive = true } = req.body || {};
  if (!domain) return res.status(400).json({ error: 'domain is required' });

  const args = ['enum', '-d', domain, ...(passive ? ['-passive'] : [])];
  try {
    console.log(`🔍 Running Amass for: ${domain}`);
    const { out } = await runCmd('/snap/bin/amass', args, { timeout: 120_000 });
    
    const subdomains = out.split('\n')
      .filter(line => line.trim() && line.includes('.'))
      .map(subdomain => ({
        subdomain: subdomain.trim(),
        type: 'subdomain',
        source: 'amass'
      }));
      
    return res.json({
      tool: 'amass',
      domain,
      passive,
      count: subdomains.length,
      results: subdomains.slice(0, 200)
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Alias pour compat Maigret (frontend legacy)
router.post('/maigret', (req, res, next) => {
  req.body = { ...req.body, username: req.body?.username };
  req.url = '/sherlock';
  req.method = 'POST';
  return router.handle(req, res, next);
});

module.exports = router;