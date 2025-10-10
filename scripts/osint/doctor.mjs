#!/usr/bin/env node
import { spawn } from 'child_process';

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
    const ps = spawn(t.name, t.args);
    let stdout = '', stderr = '';
    let finished = false;
    
    // Watchdog: kill after 8s
    const watchdog = setTimeout(() => {
      if (!finished) {
        ps.kill('SIGKILL');
      }
    }, 8000);
    
    ps.stdout?.on('data', (d) => stdout += d.toString());
    ps.stderr?.on('data', (d) => stderr += d.toString());
    
    ps.on('close', (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      
      if (code === 0) {
        const ver = t.parse(stdout || stderr || '');
        process.stdout.write(JSON.stringify({
          t: 'osint_tool',
          ts: Date.now(),
          name: t.name,
          version: ver,
          ok: true,
          dur: Date.now() - start
        }) + '\n');
      } else {
        process.stdout.write(JSON.stringify({
          t: 'osint_tool',
          ts: Date.now(),
          name: t.name,
          ok: false,
          err: `Exit code ${code}`,
          dur: Date.now() - start
        }) + '\n');
      }
      resolve();
    });
    
    ps.on('error', (e) => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      
      process.stdout.write(JSON.stringify({
        t: 'osint_tool',
        ts: Date.now(),
        name: t.name,
        ok: false,
        err: e.message,
        dur: Date.now() - start
      }) + '\n');
      resolve();
    });
  });
}

for (const t of tools) await checkTool(t);