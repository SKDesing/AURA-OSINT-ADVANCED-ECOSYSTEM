#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const rawDir = path.join(ROOT, "var", "osint", "raw");
const outDir = path.join(ROOT, "var", "osint", "results");
fs.mkdirSync(outDir, { recursive: true });

function* readLines(file) {
  const data = fs.readFileSync(file, "utf8");
  for (const line of data.split(/\r?\n/)) yield line;
}

function writeNDJSON(file, items) {
  const s = items.map((o) => JSON.stringify(o)).join("\n") + "\n";
  fs.writeFileSync(file, s, "utf8");
  console.log(`✓ ${items.length} lignes → ${file}`);
}

// 1) Subdomains (liste texte + bruits éventuels)
function parseSubdomains() {
  const f = path.join(rawDir, "subdomains.txt");
  if (!fs.existsSync(f)) return [];
  const out = [];
  for (const line of readLines(f)) {
    const l = line.trim();
    if (!l) continue;
    if (l.startsWith("[") || l.startsWith("{")) continue; // ignore logs/json stray
    // filtre une forme host.example.com (évite les [INF]…)
    if (!/[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(l)) continue;
    out.push({ type: "subdomain", value: l });
  }
  return dedupe(out, (e) => e.value.toLowerCase());
}

// 2) Maigret (parse lignes "[+] Site: URL")
function parseMaigret() {
  const f = path.join(rawDir, "maigret.log");
  if (!fs.existsSync(f)) return [];
  const out = [];
  const re = /^\[\+\]\s*([^:]+):\s*(\S+)/; // [+] SiteName: URL
  for (const line of readLines(f)) {
    const m = line.match(re);
    if (m) {
      const site = m[1].trim();
      const url = m[2].trim();
      out.push({ type: "account", site, url });
    }
  }
  return dedupe(out, (e) => `${e.site} ${e.url}`.toLowerCase());
}

// 3) holehe (parse email courant + lignes "[+]/[-]/[x] domaine")
function parseHolehe() {
  const f = path.join(rawDir, "holehe.log");
  if (!fs.existsSync(f)) return [];
  const out = [];
  let currentEmail = "";
  const reEmailHeader = /^\*+\s*([^\s*]+@[^\s*]+)\s*\*+$/; // **************** email ****************
  const reLine = /^\[([+\-xX])\]\s*([A-Za-z0-9._-]+\.[A-Za-z]{2,})/; // [+] domain.tld

  for (const line of readLines(f)) {
    const h = line.match(reEmailHeader);
    if (h) {
      currentEmail = h[1].trim();
      continue;
    }
    const m = line.match(reLine);
    if (m && currentEmail) {
      const mark = m[1];
      const site = m[2].toLowerCase();
      const status =
        mark === "+" ? "used" : mark === "-" ? "not_used" : "rate_limited";
      out.push({ type: "email_usage", site, email: currentEmail, status });
    }
  }
  return dedupe(out, (e) => `${e.email} ${e.site} ${e.status}`);
}

// Utils
function dedupe(arr, keyFn) {
  const seen = new Set();
  const res = [];
  for (const e of arr) {
    const k = keyFn(e);
    if (!seen.has(k)) {
      seen.add(k);
      res.push(e);
    }
  }
  return res;
}

// Run
const subdomains = parseSubdomains();
const accounts = parseMaigret();
const emailUsage = parseHolehe();

if (subdomains.length) writeNDJSON(path.join(outDir, "subdomains.ndjson"), subdomains);
if (accounts.length) writeNDJSON(path.join(outDir, "accounts.ndjson"), accounts);
if (emailUsage.length) writeNDJSON(path.join(outDir, "email_usage.ndjson"), emailUsage);

if (!subdomains.length && !accounts.length && !emailUsage.length) {
  console.warn("Aucune donnée normalisée. Vérifiez var/osint/raw/* fichiers.");
}