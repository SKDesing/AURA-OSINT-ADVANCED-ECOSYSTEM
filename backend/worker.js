// Worker BullMQ minimal pour OSINT
try { require('./utils/ensure-worker-electron-launch')(); } catch { /* best-effort */ }

const { Worker, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');
const { spawn } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { Pool } = require('pg');

const REDIS_URL = process.env.ORCHESTRATOR_REDIS_URL || 'redis://localhost:6379/5';
const SANDBOX = process.env.OSINT_SANDBOX === 'native' ? 'native' : 'docker';
const connection = new IORedis(REDIS_URL);
new QueueScheduler('osint', { connection });

const pool = new Pool({ connectionString: process.env.API_DATABASE_URL });

function makeWorkdir(toolId, jobId) {
  const dir = resolve(process.cwd(), 'var', 'osint', 'work', `${toolId}-${jobId}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

async function persistSubdomains(jobId, entities = []) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const e of entities) {
      await client.query(
        'INSERT INTO osint_results(job_id, entity_type, data) VALUES ($1,$2,$3)',
        [jobId, e.type, e]
      );
      if (e.type === 'subdomain') {
        const sub = e.value;
        const parts = sub.split('.');
        const domain = parts.length >= 2 ? parts.slice(-2).join('.') : sub;
        await client.query(
          'INSERT INTO osint_subdomains(job_id, domain, subdomain, ip, source) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
          [jobId, domain, sub, e.ip || null, e.source || 'amass']
        );
      }
    }
    await client.query('COMMIT');
  } finally {
    client.release();
  }
}

function runDocker(cmdArgs, cwd) {
  return new Promise((resolveP, rejectP) => {
    const ps = spawn('docker', cmdArgs, { cwd });
    let stderr = '';
    ps.stderr.on('data', (d) => (stderr += d.toString()));
    ps.on('close', (code) => {
      if (code === 0) resolveP();
      else rejectP(new Error(`docker exited ${code}: ${stderr}`));
    });
  });
}

function parseAmassJSONL(filePath) {
  // Amass JSON lines → [{type:"subdomain", value: "x.example.com"}]
  const fs = require('fs');
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  const out = [];
  for (const l of lines) {
    try {
      const j = JSON.parse(l);
      if (j.name) out.push({ type: 'subdomain', value: j.name });
    } catch (_) {}
  }
  // dedupe
  const seen = new Set();
  return out.filter((e) => {
    const k = e.value.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function executeAmass(jobId, params) {
  const workdir = makeWorkdir('amass', jobId);
  const outFile = join(workdir, 'amass.json');
  if (SANDBOX === 'docker') {
    const args = [
      'run', '--rm',
      '-v', `${workdir}:/data`,
      // n'activer le host network qu'en actif explicite
      ...(params.activeNetwork ? ['--network', 'host'] : []),
      '--pids-limit','256','--memory','512m',
      'caffix/amass',
      'enum','-d', params.domain,
      '-json','/data/amass.json',
      ...(params.passive ? ['-passive'] : []),
    ];
    await runDocker(args, workdir);
  } else {
    // Option natif si amass est installé sur la machine
    await new Promise((resolveP, rejectP) => {
      const ps = spawn('amass', ['enum','-d', params.domain, '-json', outFile].concat(params.passive ? ['-passive'] : []));
      ps.on('close', (code) => (code === 0 ? resolveP() : rejectP(new Error(`amass exited ${code}`))));
    });
  }
  const entities = parseAmassJSONL(outFile);
  await persistSubdomains(Number(jobId), entities);
  return { entitiesCount: entities.length };
}

const w = new Worker('osint', async (job) => {
  const { toolId, params } = job.data || {};
  if (!toolId) throw new Error('toolId required');
  if (toolId === 'amass') {
    if (!params?.domain) throw new Error('domain is required for amass');
    return await executeAmass(job.id, { passive: true, ...params });
  }
  throw new Error(`Unsupported toolId: ${toolId}`);
}, {
  connection,
  concurrency: Number(process.env.OSINT_CONCURRENCY || 2)
});

w.on('completed', (job, res) => console.log(`[worker] job ${job.id} completed`, res));
w.on('failed', (job, err) => console.error(`[worker] job ${job?.id} failed`, err?.message));
console.log('🔧 OSINT Worker ready');