#!/usr/bin/env node
import { spawn } from 'child_process';

// Evite les crashs EPIPE si la sortie est coupée (ex: `head`)
process.stdout.on('error', (e) => {
  if (e && e.code === 'EPIPE') {
    try { process.exit(0); } catch {}
  }
});

const tools = [
  { name: 'amass', args: ['-version'], parse: (s) => s.split('\n')[0] },
  { name: 'subfinder', args: ['-version'], parse: (s) => s.trim() },
  { name: 'maigret', args: ['--version'], parse: (s) => s.trim() },
  { name: 'holehe', args: ['--version'], parse: (s) => s.trim() },
  { name: 'dnsrecon', args: ['-h'], parse: (s) => (s.match(/version\s+([^\s]+)/i)?.[1] || 'unknown') },
  { name: 'dnsenum', args: ['--help'], parse: (s) => (s.match(/Version\s+([^\s]+)/i)?.[1] || 'unknown') },
  { name: 'fierce', args: ['-h'], parse: (s) => 'ok' },
  { name: 'whatweb', args: ['--version'], parse: (s) => s.trim() },
  { name: 'wafw00f', args: ['--version'], parse: (s) => s.trim() },
  { name: 'whois', args: ['--version'], parse: (s) => s.split('\n')[0] },
  { name: 'exiftool', args: ['-ver'], parse: (s) => s.trim() },
  { name: 'mat2', args: ['--version'], parse: (s) => s.trim() },
  { name: 'instaloader', args: ['--version'], parse: (s) => s.trim() },
];

async function checkTool(t) {
  const start = Date.now();
  return new Promise((resolve) => {
    const ps = spawn(t.name, t.args, { timeout: 0 });
    let stdout = '', stderr = '';

    // Watchdog: tue le process après 8s si bloqué
    const watchdog = setTimeout(() => {
      if (!ps.killed) {
        try { ps.kill('SIGKILL'); } catch {}
      }
    }, 8000);

    ps.stdout?.on('data', (d) => { stdout += d.toString(); });
    ps.stderr?.on('data', (d) => { stderr += d.toString(); });

    const finishOk = () => {
      clearTimeout(watchdog);
      try {
        const ver = t.parse(stdout || stderr || '');
        process.stdout.write(JSON.stringify({
          t: 'osint_tool',
          ts: Date.now(),
          name: t.name,
          version: ver,
          ok: true,
          dur: Date.now() - start
        }) + '\n');
      } catch (e) {
        process.stdout.write(JSON.stringify({
          t: 'osint_tool',
          ts: Date.now(),
          name: t.name,
          ok: false,
          err: e?.message || 'Parse error',
          dur: Date.now() - start
        }) + '\n');
      }
      resolve();
    };

    const finishErr = (message) => {
      clearTimeout(watchdog);
      try {
        process.stdout.write(JSON.stringify({
          t: 'osint_tool',
          ts: Date.now(),
          name: t.name,
          ok: false,
          err: message,
          dur: Date.now() - start
        }) + '\n');
      } catch {}
      resolve();
    };

    ps.on('close', (code) => {
      if (code === 0) finishOk();
      else finishErr(`Exit code ${code}`);
    });

    ps.on('error', (e) => {
      finishErr(e?.message || 'spawn error');
    });
  });
}

for (const t of tools) await checkTool(t);