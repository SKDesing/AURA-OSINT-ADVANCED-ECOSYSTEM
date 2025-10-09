#!/usr/bin/env node
/**
 * AURA Obsolete Code Scanner (v2)
 * Analyse : références, duplications, patterns obsolètes, fusions candidates.
 * Usage:
 *   node scripts/cleanup/obsolete-scanner-v2.js
 *   node scripts/cleanup/obsolete-scanner-v2.js --json --markdown --limit=30
 *   node scripts/cleanup/obsolete-scanner-v2.js --apply (génère scripts de nettoyage)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = {
  info: msg => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  warn: msg => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  error: msg => console.error(`\x1b[31m[ERR]\x1b[0m ${msg}`),
  ok: msg => console.log(`\x1b[32m[OK]\x1b[0m ${msg}`)
};

const ARGS = process.argv.slice(2);
const FLAGS = new Set(ARGS.filter(a => a.startsWith('--')).map(a => a.replace(/=.*/,'').trim()));
function getFlagValue(name, def = null) {
  const prefix = `--${name}=`;
  const found = ARGS.find(a => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : def;
}

class ObsoleteScanner {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.includeExtensions = new Set(['.ts','.js','.mjs','.cjs','.tsx','.jsx','.py','.sh','.json','.md']);
    this.ignoreDirs = new Set(['node_modules','.git','dist','build','coverage','artifacts','logs','external']);
    this.files = [];
    this.fileIndex = {};        // id -> { path, rel, content, hash, lines[] }
    this.references = new Map(); // rel -> Set(relPathsReferenced)
    this.reverse = new Map();    // rel -> Set(relPathsReferrers)
    this.duplicates = [];
    this.blockDuplicates = [];
    this.functionDuplicates = [];
    this.results = {
      unusedFiles: [],
      duplicateFiles: [],
      duplicateBlocks: [],
      duplicateFunctions: [],
      obsoletePatterns: [],
      fusionCandidates: [],
      summary: {},
      generatedScripts: [],
      scoring: []
    };
    this.configPatterns = this.loadPatternsFile();
    this.entryPoints = [
      'ai/gateway/src/main.ts',
      'scripts/orchestrator/index.ts',
      'scripts/run/full-run.sh'
    ];
  }

  loadPatternsFile() {
    const f = path.join(this.rootDir, '.obsolete-patterns.json');
    if (fs.existsSync(f)) {
      try {
        return JSON.parse(fs.readFileSync(f,'utf8'));
      } catch(e) {
        C.warn(`Impossible de parser .obsolete-patterns.json : ${e.message}`);
      }
    }
    return {
      pseudoEmbeddings: { pattern: 'pseudoEmbed(', severity: 'high', reason: 'Remplacer par embeddings réels' },
      degradeLiteral: { pattern: '\\[DEGRADE\\]', severity: 'medium', reason: 'Utiliser objet erreur structuré' }
    };
  }

  run() {
    C.info('Démarrage scanner obsolescence v2');
    this.collectFiles();
    this.buildReferenceGraph();
    this.detectUnusedFiles();
    this.detectDuplicateFiles();
    this.detectDuplicateBlocks();
    this.detectDuplicateFunctions();
    this.scanObsoletePatterns();
    this.identifyFusionCandidates();
    this.computeScoring();
    this.generateOutputs();
  }

  collectFiles() {
    C.info('Collecte des fichiers...');
    const walk = dir => {
      const list = fs.readdirSync(dir,{withFileTypes:true});
      for (const ent of list) {
        if (ent.name.startsWith('.')) continue;
        if (this.ignoreDirs.has(ent.name)) continue;
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          walk(full);
        } else {
          const rel = path.relative(this.rootDir, full);
            const ext = path.extname(ent.name);
          if (!this.includeExtensions.has(ext)) continue;
          try {
            const content = fs.readFileSync(full,'utf8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            const lines = content.split(/\r?\n/);
            this.fileIndex[rel] = { path: full, rel, content, hash, lines };
            this.files.push(rel);
          } catch(e) {
            C.warn(`Lecture échouée: ${rel} ${e.message}`);
          }
        }
      }
    };
    walk(this.rootDir);
    C.ok(`Fichiers indexés: ${this.files.length}`);
  }

  buildReferenceGraph() {
    C.info('Construction graphe références...');
    const importRegexes = [
      /import\s+[^'"]*['"]([^'"]+)['"]/g,
      /require\(\s*['"]([^'"]+)['"]\s*\)/g,
      /from\s+['"]([^'"]+)['"]/g
    ];
    for (const rel of this.files) {
      const entry = this.fileIndex[rel];
      const refs = new Set();
      const dir = path.dirname(rel);
      for (const rx of importRegexes) {
        let m;
        while ((m = rx.exec(entry.content)) !== null) {
          let ref = m[1];
          if (ref.startsWith('.')) {
            // local relative
            let fullRel = path.normalize(path.join(dir, ref));
            // essayer résolutions extensions
            const candidates = [
              fullRel,
              `${fullRel}.ts`,
              `${fullRel}.js`,
              `${fullRel}.tsx`,
              `${fullRel}.jsx`,
              `${fullRel}/index.ts`,
              `${fullRel}/index.js`
            ];
            const found = candidates.find(c => this.fileIndex[c]);
            if (found) refs.add(found);
          }
        }
      }
      this.references.set(rel, refs);
      for (const r of refs) {
        if (!this.reverse.has(r)) this.reverse.set(r, new Set());
        this.reverse.get(r).add(rel);
      }
    }
    C.ok('Graphe références établi.');
  }

  detectUnusedFiles() {
    C.info('Détection fichiers potentiellement non référencés...');
    // BFS depuis entry points
    const visited = new Set();
    const queue = [...this.entryPoints.filter(e => this.fileIndex[e])];
    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      const refs = this.references.get(cur);
      if (refs) {
        for (const r of refs) {
          if (!visited.has(r)) queue.push(r);
        }
      }
    }
    for (const f of this.files) {
      if (!visited.has(f) && !this.entryPoints.includes(f)) {
        // Heuristique : ignorer markdown & docs pour unused code
        if (f.endsWith('.md')) continue;
        this.results.unusedFiles.push({
          file: f,
          reason: 'Non référencé depuis entry points',
          action: 'Vérifier si safe à supprimer',
          safe: !f.includes('legacy') ? false : true
        });
      }
    }
  }

  detectDuplicateFiles() {
    C.info('Détection duplication fichier complet...');
    const byHash = new Map();
    for (const rel of this.files) {
      const h = this.fileIndex[rel].hash;
      if (!byHash.has(h)) byHash.set(h, []);
      byHash.get(h).push(rel);
    }
    for (const [hash, group] of byHash.entries()) {
      if (group.length > 1) {
        this.results.duplicateFiles.push({ hash, files: group });
      }
    }
  }

  detectDuplicateBlocks() {
    C.info('Détection duplication blocs (fenêtre 12 lignes)...');
    const windowSize = parseInt(getFlagValue('hash-block-min','12'),10);
    const blockMap = new Map();
    for (const rel of this.files) {
      const { lines } = this.fileIndex[rel];
      for (let i=0;i<=lines.length-windowSize;i++) {
        const slice = lines.slice(i,i+windowSize).join('\n').trim();
        if (slice.length < 40) continue;
        const hash = crypto.createHash('sha256').update(slice).digest('hex');
        if (!blockMap.has(hash)) blockMap.set(hash, []);
        blockMap.get(hash).push({ file: rel, start: i+1, end: i+windowSize });
      }
    }
    for (const [h, arr] of blockMap.entries()) {
      if (arr.length > 1) {
        this.results.duplicateBlocks.push({
          hash: h,
          occurrences: arr,
          suggestion: 'Factoriser dans util commun ou façade'
        });
      }
    }
  }

  detectDuplicateFunctions() {
    C.info('Détection duplication fonctions/export (heuristique TS/JS)...');
    const funcRegex = /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g;
    const map = new Map();
    for (const rel of this.files) {
      if (!rel.endsWith('.ts') && !rel.endsWith('.js')) continue;
      const content = this.fileIndex[rel].content;
      let m;
      while ((m = funcRegex.exec(content)) !== null) {
        const name = m[1];
        const sigHash = crypto.createHash('sha256').update(name + ':' + rel).digest('hex');
        if (!map.has(name)) map.set(name, []);
        map.get(name).push({ file: rel, hash: sigHash });
      }
    }
    for (const [name, arr] of map.entries()) {
      if (arr.length > 1) {
        this.results.duplicateFunctions.push({
          name,
          occurrences: arr,
          suggestion: 'Centraliser export unique (index facade)'
        });
      }
    }
  }

  scanObsoletePatterns() {
    C.info('Scan patterns obsolètes (config + heuristiques) ...');
    // From config
    for (const key of Object.keys(this.configPatterns)) {
      const { pattern, severity, reason } = this.configPatterns[key];
      const rx = new RegExp(pattern, 'g');
      const hits = [];
      for (const rel of this.files) {
        const entry = this.fileIndex[rel];
        if (rx.test(entry.content)) {
          hits.push(rel);
        }
      }
      if (hits.length) {
        this.results.obsoletePatterns.push({
          id: key,
          severity,
          reason,
          files: hits
        });
      }
    }
    // Doublon degrade string
    const degradeFiles = [];
    for (const rel of this.files) {
      if (/\[DEGRADE\]/.test(this.fileIndex[rel].content)) degradeFiles.push(rel);
    }
    if (degradeFiles.length) {
      this.results.obsoletePatterns.push({
        id: 'degrade_literal',
        severity: 'medium',
        reason: 'Utiliser structured error object {status:"degraded", code:"RUNTIME_DOWN"}',
        files: degradeFiles
      });
    }
  }

  identifyFusionCandidates() {
    C.info('Identification fusion candidats...');
    this.results.fusionCandidates = [
      {
        category: 'Pre-Intel',
        files: this.files.filter(f => f.startsWith('ai/gateway/src/preintel/')),
        target: 'ai/gateway/src/preintel/index.ts',
        rationale: 'Façade unifiée pour exécution pipeline',
        priority: 'high'
      },
      {
        category: 'Qwen Services',
        files: this.files.filter(f => /qwen-optimized\.service\.ts$|qwen\.service\.ts$/.test(f)),
        target: 'ai/gateway/src/qwen.service.ts',
        rationale: 'Une seule implémentation normalisée',
        priority: 'high'
      },
      {
        category: 'Metrics Registry',
        files: this.files.filter(f => f.includes('metrics.registry')),
        target: 'ai/gateway/src/observability/metrics/',
        rationale: 'Division par domaines tokens/rag/router/guardrails',
        priority: 'medium'
      }
    ];
  }

  computeScoring() {
    C.info('Calcul scoring obsolescence...');
    // Heuristique : score = (unusedFiles*2 + duplicateBlocks + obsoletePatterns*3)
    const u = this.results.unusedFiles.length;
    const db = this.results.duplicateBlocks.length;
    const op = this.results.obsoletePatterns.length;
    const base = u*2 + db + op*3;
    const normalized = Math.min(100, Math.round((base / (this.files.length || 1)) * 100));
    this.results.summary = {
      totalFiles: this.files.length,
      unusedFiles: u,
      duplicateBlocks: db,
      obsoletePatterns: op,
      score: normalized
    };
  }

  generateOutputs() {
    const outDir = path.join(this.rootDir, 'reports');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const jsonOut = {
      version: '2.0.0',
      generated_at: new Date().toISOString(),
      summary: this.results.summary,
      unused_files: this.results.unusedFiles,
      duplicate_files: this.results.duplicateFiles,
      duplicate_blocks: this.results.duplicateBlocks.slice(0, 50),
      duplicate_functions: this.results.duplicateFunctions.slice(0, 50),
      obsolete_patterns: this.results.obsoletePatterns,
      fusion_candidates: this.results.fusionCandidates
    };

    if (FLAGS.has('--json')) {
      const jsonPath = path.join(outDir, 'OBSOLETE-AUDIT.json');
      fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));
      C.ok(`JSON audit: ${jsonPath}`);
    }

    if (FLAGS.has('--markdown') || !FLAGS.has('--json')) {
      const md = this.renderMarkdown(jsonOut);
      const mdPath = path.join(outDir, 'OBSOLETE-AUDIT.md');
      fs.writeFileSync(mdPath, md);
      C.ok(`Markdown audit: ${mdPath}`);
    }

    if (FLAGS.has('--apply')) {
      this.generateCleanupScripts();
    }
  }

  renderMarkdown(data) {
    return `# 🧹 AURA Obsolete Code Audit (v${data.version})

Généré: ${data.generated_at}

## 📊 Synthèse
| Metric | Value |
|--------|-------|
| Fichiers analysés | ${data.summary.totalFiles} |
| Fichiers non référencés | ${data.summary.unusedFiles} |
| Blocs dupliqués | ${data.summary.duplicateBlocks} |
| Patterns obsolètes | ${data.summary.obsoletePatterns} |
| Score obsolescence (0=parfait, 100=critique) | ${data.summary.score} |

## 🗑️ Fichiers potentiellement non référencés
${data.unused_files.slice(0,50).map(f => `- ${f.file} (${f.reason})`).join('\n') || '_Aucun_'}

## 🔄 Duplications (fichiers)
${data.duplicate_files.length ? data.duplicate_files.slice(0,10).map(d => `- Hash ${d.hash.slice(0,10)}… : ${d.files.join(', ')}`).join('\n') : '_Aucune_'}

## 🧩 Duplications Blocs (top 10)
${data.duplicate_blocks.slice(0,10).map(b => `- ${b.hash.slice(0,12)}… (${b.occurrences.length} occurrences)`).join('\n') || '_Aucune_'}

## 🛠️ Duplications Fonctions (top 10)
${data.duplicate_functions.slice(0,10).map(fn => `- ${fn.name}: ${fn.occurrences.map(o=>o.file).join(', ')}`).join('\n') || '_Aucune_'}

## ⚠️ Patterns Obsolètes
${data.obsolete_patterns.map(p => `### ${p.id} (${p.severity})\nRaison: ${p.reason}\nFichiers:\n${p.files.slice(0,10).map(f=>'- '+f).join('\n')}\n`).join('\n') || '_Aucun_'}

## 🔗 Fusion Candidates
${data.fusion_candidates.map(fc => `### ${fc.category}\nTarget: ${fc.target}\nPriority: ${fc.priority}\nFichiers:\n${fc.files.slice(0,8).map(f=>'- '+f).join('\n')}\n`).join('\n')}

## 🧭 Recommandations
1. Supprimer / archiver fichiers non référencés après revue
2. Créer façade Pre-Intel
3. Factoriser duplications util hash / tokens
4. Externaliser metrics par domaines
5. Remplacer pseudoEmbed → embeddings réels
6. Introduire structured degrade object

_Machine readable version: OBSOLETE-AUDIT.json_
`;
  }

  generateCleanupScripts() {
    const scriptDir = path.join(this.rootDir, 'scripts/cleanup');
    if (!fs.existsSync(scriptDir)) fs.mkdirSync(scriptDir,{ recursive: true });

    const removable = this.results.unusedFiles
      .filter(f => !f.file.endsWith('.json') && !f.file.endsWith('.lock'))
      .map(f => f.file);

    const safeList = removable.filter(f => f.includes('legacy') || f.includes('test-'));
    const reviewList = removable.filter(f => !safeList.includes(f));

    const script = `#!/bin/bash
# AURA Cleanup Script (Generated)
set -e

echo "🧹 Cleanup démarré (mode dry-run par défaut)"
MODE="$1"
if [ "$MODE" != "apply" ]; then
  echo "Utilisation: $0 apply  (pour vraiment supprimer)"
fi

echo "Safe removals (legacy/tests):"
${safeList.map(f => `echo " - ${f}"`).join('\n')}

echo "Review required before removing:"
${reviewList.map(f => `echo " - ${f}"`).join('\n')}

if [ "$MODE" = "apply" ]; then
  echo "Suppression effective..."
${safeList.map(f => `  rm -f "${f}"`).join('\n')}
  echo "⚠️ Les fichiers nécessitant revue NE sont PAS supprimés automatiquement."
fi

echo "✅ Terminé."
`;
    const scriptPath = path.join(scriptDir,'execute-cleanup.sh');
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, 0o755);
    this.results.generatedScripts.push(scriptPath);
    C.ok(`Script de cleanup généré: ${scriptPath}`);
  }
}

if (require.main === module) {
  const scanner = new ObsoleteScanner(process.cwd());
  scanner.run();
}