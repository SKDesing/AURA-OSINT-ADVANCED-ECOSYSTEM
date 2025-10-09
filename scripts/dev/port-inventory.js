#!/usr/bin/env node
/**
 * AURA – Port Inventory
 * - Lit config/ports.manifest.json (source de vérité)
 * - Scanne le repo à la recherche d'indices de ports
 * - Liste les processus OS qui écoutent (lsof/ss)
 * - Détecte les conflits (même port assigné, port occupé)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, 'config', 'ports.manifest.json');

function loadManifest() {
  const j = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return j;
}

function scanCodeForPorts() {
  // Recherche basique de patterns de ports dans les fichiers .js/.ts/.json/.env
  const exts = new Set(['.js', '.ts', '.json', '.env', '.env.local', '.yml', '.yaml']);
  const ignore = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.cache']);
  const hits = new Map();
  function walk(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (ignore.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const ext = path.extname(e.name);
        if (!exts.has(ext) && !e.name.startsWith('.env')) continue;
        let content = '';
        try { content = fs.readFileSync(p, 'utf8'); } catch { continue; }
        const regex = /(?:(?:^|\b)(PORT|VITE_PORT|NEXT_PUBLIC_PORT)\s*=\s*(\d{3,5})|:(\d{3,5}))/g;
        let m;
        while ((m = regex.exec(content)) !== null) {
          const port = Number(m[2] || m[3]);
          if (!port || port < 1000 || port > 65535) continue;
          if (!hits.has(port)) hits.set(port, []);
          hits.get(port).push(path.relative(ROOT, p));
        }
      }
    }
  }
  walk(ROOT);
  return hits;
}

function listListeningPorts() {
  let out = '';
  // Try ss first
  const ss = spawnSync('ss', ['-ltnp'], { encoding: 'utf8' });
  if (ss.status === 0) out = ss.stdout;
  else {
    const lsof = spawnSync('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN'], { encoding: 'utf8' });
    if (lsof.status === 0) out = lsof.stdout;
  }
  const listening = new Map(); // port -> [{pid, proc}]
  const re = /:(\d+)\s.*pid=(\d+),\s*fd=\d+|:(\d+)\s.*\s+(\d+)\/([^\s]+)/g;
  const alt1 = /:(\d+)\s+.*users:\(\("([^"]+)",pid=(\d+),/g; // ss format users
  let m;
  // Generic parse for lsof
  const lines = out.split('\n');
  for (const line of lines) {
    const m2 = line.match(/:(\d+)\s/);
    if (!m2) continue;
    const port = Number(m2[1]);
    const m3 = line.match(/\s(\d+)\/([^\s]+)/);
    let pid = null, proc = null;
    if (m3) { pid = Number(m3[1]); proc = m3[2]; }
    if (!listening.has(port)) listening.set(port, []);
    listening.get(port).push({ pid, proc });
  }
  // Try ss users parsing
  while ((m = alt1.exec(out)) !== null) {
    const port = Number(m[1]);
    const proc = m[2];
    const pid = Number(m[3]);
    if (!listening.has(port)) listening.set(port, []);
    if (!listening.get(port).some(x => x.pid === pid)) {
      listening.get(port).push({ pid, proc });
    }
  }
  return listening;
}

function main() {
  const man = loadManifest();
  const codeHits = scanCodeForPorts();
  const listening = listListeningPorts();

  const assigned = new Map(); // port -> [service names]
  for (const s of man.services) {
    for (const p of s.ports) {
      if (!assigned.has(p)) assigned.set(p, []);
      assigned.get(p).push(s.name);
    }
  }

  const conflicts = [];
  for (const [port, names] of assigned.entries()) {
    if (names.length > 1) {
      conflicts.push({ port, type: 'manifest-dup', details: names });
    }
  }

  for (const [port, procs] of listening.entries()) {
    const names = assigned.get(port) || [];
    // If the port is used by a process but not by the mapped service OR multiple services want it
    if (names.length > 1) {
      conflicts.push({ port, type: 'runtime-vs-multiple-services', details: { services: names, procs } });
    }
    if (names.length === 0) {
      // someone is listening but not in manifest (informational)
    }
  }

  console.log('=== AURA Port Inventory ===');
  console.log('Manifest:', manifestPath);
  console.log('');
  console.log('Assigned ports (manifest):');
  for (const [port, names] of assigned.entries()) {
    console.log(`  ${port}: ${names.join(', ')}`);
  }
  console.log('');
  console.log('Runtime listening ports (subset):');
  for (const [port, procs] of Array.from(listening.entries()).sort((a,b)=>a[0]-b[0]).slice(0,200)) {
    const procStr = procs.map(p => `${p.proc || '?'}#${p.pid || '?'}`).join(', ');
    console.log(`  ${port} -> ${procStr}`);
  }
  console.log('');
  console.log('Code references by port (top 20 ports):');
  let count = 0;
  for (const [port, files] of codeHits.entries()) {
    console.log(`  ${port}: ${files.slice(0,5).join(', ')}${files.length>5?' …':''}`);
    if (++count >= 20) break;
  }
  console.log('');
  if (conflicts.length) {
    console.log('⚠️ Conflicts detected:');
    for (const c of conflicts) {
      console.log(`  - [${c.type}] port ${c.port}:`, c.details);
    }
    process.exitCode = 2;
  } else {
    console.log('✅ No conflicts in manifest assignments.');
  }
}

main();