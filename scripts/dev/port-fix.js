#!/usr/bin/env node
/**
 * AURA – Port Fix
 * - Applique les valeurs du manifeste dans les fichiers .env ciblés
 * - Vérifie si les ports sont libres; propose un port alternatif dans la même plage si occupé
 * Usage: node scripts/dev/port-fix.js [--apply]
 */
const fs = require('fs');
const path = require('path');
const net = require('net');

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, 'config', 'ports.manifest.json');
const APPLY = process.argv.includes('--apply');

function loadManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function checkPortFree(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => {
      srv.close(() => resolve(true));
    });
    srv.listen(port, host);
  });
}

async function findFreeNear(port, range = 20) {
  for (let i = 0; i <= range; i++) {
    const candUp = port + i;
    if (await checkPortFree(candUp)) return candUp;
    const candDown = port - i;
    if (candDown > 1024 && await checkPortFree(candDown)) return candDown;
  }
  return null;
}

function ensureEnvKV(envContent, key, value) {
  const lines = envContent.split('\n');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      found = true;
      break;
    }
  }
  if (!found) lines.push(`${key}=${value}`);
  return lines.join('\n');
}

async function main() {
  const man = loadManifest();
  console.log(`Using manifest: ${manifestPath}`);
  let changes = [];
  for (const svc of man.services) {
    const baseDir = path.join(ROOT, svc.pathHint || '.');
    for (const env of (svc.env || [])) {
      const envPath = path.join(baseDir, env.file);
      let targetPort = env.key.toLowerCase().includes('port') ? Number(env.value) : null;
      // Check availability if it's a port
      if (targetPort) {
        const free = await checkPortFree(targetPort);
        if (!free) {
          const alt = await findFreeNear(targetPort, 50);
          if (alt) {
            console.warn(`Port ${targetPort} busy for ${svc.name}. Suggesting ${alt}.`);
            env.value = alt;
            // Also update other variables referencing this base (like API_BASE)
            for (const e2 of svc.env) {
              if (typeof e2.value === 'string' && e2.value.includes(`:${targetPort}`)) {
                e2.value = e2.value.replace(`:${targetPort}`, `:${alt}`);
              }
            }
          } else {
            console.error(`No free port near ${targetPort} for ${svc.name}. Manual action required.`);
          }
        }
      }
      // Prepare write
      changes.push({ envPath, key: env.key, value: env.value });
    }
  }

  // Group changes per file
  const byFile = new Map();
  for (const c of changes) {
    if (!byFile.has(c.envPath)) byFile.set(c.envPath, []);
    byFile.get(c.envPath).push(c);
  }

  for (const [file, entries] of byFile.entries()) {
    let content = '';
    try { content = fs.readFileSync(file, 'utf8'); } catch { content = ''; }
    for (const e of entries) {
      content = ensureEnvKV(content, e.key, e.value);
    }
    if (APPLY) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
      console.log(`✅ Applied: ${path.relative(ROOT, file)}`);
    } else {
      console.log(`➡️ Would apply to ${path.relative(ROOT, file)}:`);
      for (const e of entries) console.log(`   ${e.key}=${e.value}`);
    }
  }

  if (!APPLY) {
    console.log('\nRun with --apply to write changes.');
  } else {
    console.log('\nDone. Restart services to take effect.');
  }
}

main();