#!/usr/bin/env node
/**
 * AURA – Générateur d'issues GitHub pour audit par cellules
 * Crée automatiquement les 8 issues d'audit avec les spécifications détaillées
 */

const cellules = [
  {
    category: 'DB',
    title: 'Base de données',
    cible: 'Postgres (prioritaire), Redis (si utilisé), tout entrepôt secondaire',
    livrables: [
      'schema.sql - DDL complet (tables, index, FK, vues, fonctions)',
      'indexes_report.json - Liste index + tailles + fragmentation', 
      'data-catalog.json - Tables avec description, volumétrie, PII flags, rétention',
      'connections.env.template - Variables de connexion (sans secrets)'
    ],
    scripts: [
      'EXPLAIN ANALYZE de 5 requêtes critiques',
      'Vacuum/Analyze état (si applicable)'
    ],
    seuils: [
      'Index sur artifacts(hash), artifacts(context_hash)',
      'Temps SELECT artifacts/:id < 50ms en local sur échantillon'
    ]
  },
  {
    category: 'AI',
    title: 'IA/Modèles/Embeddings',
    cible: 'Embeddings locaux Xenova e5-small + tout autre modèle (local/remote)',
    livrables: [
      'models-inventory.json - Nom modèle, licence, taille, device, latence p50/p95, dimensions',
      'router-bench.json - Accuracy, bypass, confusion matrix par classe, seuils retenus',
      'embeddings-cache-report.json - Nombre vecteurs, taille disque, hit ratio'
    ],
    scripts: [
      'npm run ai:embeddings:health',
      'npm run ai:router:bench'
    ],
    seuils: [
      'bypass ≥ 0.65, accuracy ≥ 0.75',
      'p50 embed ≤ 30ms en local'
    ]
  },
  {
    category: 'ORCH',
    title: 'Orchestrator/CLI/Jobs',
    cible: 'scripts/analysis/*, scripts/ai/*, scripts/run/*, service-orchestrator.js',
    livrables: [
      'jobs-catalog.json - ID, description, entrée/sortie, durée p50/p95, dépendances',
      'artifacts-spec.json - BuildArtifact: pipeline steps complet',
      'sse-channels.json - Liste des canaux SSE émis et payload schemas'
    ],
    scripts: [
      'Dry-run de 3 tâches: obsolete-scan, registry-diff, build-artifact (10 docs)'
    ],
    seuils: [
      'build_ms p50 ≤ 120ms/doc (sur échantillon local)'
    ]
  },
  {
    category: 'API',
    title: 'Backend/Gateway/API',
    cible: 'ai/gateway/, backend/, middleware/, endpoints MVP 4010',
    livrables: [
      'openapi.json - Swagger NestJS actualisé',
      'endpoints-inventory.md - Routes, méthodes, auth (RBAC), timeouts, codes d\'erreur, samples',
      'sse-behavior.md - Keepalive, retry, formats, backoff conseillé au front'
    ],
    scripts: [
      'Contrats Zod côté front alignés avec OpenAPI (diff)'
    ],
    seuils: [
      'p95 /ai/observability/summary < 150ms en local',
      '/ai/stream/metrics stable > 10min sans leak'
    ]
  },
  {
    category: 'FRONT',
    title: 'Front/UX/Design System',
    cible: 'clients/web-react/ (ou apps/web), Observability, Router, Artifact Viewer',
    livrables: [
      'ui-inventory.md - Liste composants DS (atoms→organisms), tokens, thèmes, a11y checks',
      'telemetry-config.md - Sentry dev désactivé, wrapper notify (SweetAlert2 + toasts), event bus UI',
      'api-client-report.json - Endpoints consommés, schémas Zod utilisés, gestion erreurs'
    ],
    scripts: [
      'Bundle analysis et performance audit'
    ],
    seuils: [
      'FCP < 1.5s (intranet), bundle initial < 300KB hors charts',
      'A11y: focus visible, aria des modales, contrastes AA'
    ]
  },
  {
    category: 'SEC',
    title: 'Sécurité/Compliance',
    cible: 'Secrets, licences, SBOM, CORS, auth/JWT, logs PII',
    livrables: [
      'security-audit.json - Gitleaks result, SBOM (syft), license check, osv/npmaudit, semgrep',
      'policies-hash.json - Policy/guardrails version + hash, context_hash/decision_hash propagation',
      'cors-auth-report.md - Origins autorisés, headers, TTL, algos JWT, rotation clés'
    ],
    scripts: [
      'npm run security:audit',
      'gitleaks detect --source .',
      'npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD"'
    ],
    seuils: [
      'Zéro secret dans Git, zéro wildcard CORS en prod',
      'JWT alg HS256/RS256 explicite'
    ]
  },
  {
    category: 'DEVOPS',
    title: 'DevOps/Runtime',
    cible: 'Ports, scripts de lancement pnpm, healthchecks',
    livrables: [
      'ports-state.json - Résultat de scripts/dev/port-inventory.js',
      'runbook.md - Démarrage local coordonné (Front 54112, Back 4010, Gateway 4001), commandes pnpm',
      'ci-pipelines.md - Gates obligatoires (lint, typecheck, tests, security scans)'
    ],
    scripts: [
      'npm run ports:inventory',
      'npm run mvp:dev (test de démarrage)'
    ],
    seuils: [
      'Aucun conflit de ports (ports:inventory clean)',
      'Scripts reproducibles'
    ]
  },
  {
    category: 'DOCS',
    title: 'Documentation/Qualité',
    cible: 'docs/, duplication, liens cassés, versions',
    livrables: [
      'docs-inventory.json - Index des docs, tags, propriétaires, doublons potentiels',
      'links-report.json - Liens/ancres invalides',
      'changelog - Discipline versionnage et résumé impact (tokens/latence/accuracy)'
    ],
    scripts: [
      'Scan des liens cassés',
      'Détection de duplication documentaire'
    ],
    seuils: [
      'Zéro lien cassé interne',
      'Changelog à jour avec impacts quantifiés'
    ]
  }
];

function generateIssueContent(cellule) {
  const livrablesList = cellule.livrables.map(l => `- [ ] **${l.split(' - ')[0]}**: ${l.split(' - ')[1] || l}`).join('\n');
  const scriptsList = cellule.scripts.map(s => `# ${s}`).join('\n');
  const seuilsList = cellule.seuils.map(s => `- [ ] ${s}`).join('\n');
  
  return `---
name: Audit Cellule ${cellule.category}
about: Audit technique pour la cellule ${cellule.title}
title: '[AUDIT] Cellule ${cellule.category} - ${cellule.title}'
labels: audit, inventory, ${cellule.category.toLowerCase()}
assignees: ''
---

## 🎯 **Cellule**: ${cellule.category} - ${cellule.title}

### **Cible**
${cellule.cible}

### **Livrables attendus**
${livrablesList}

### **Scripts à exécuter**
\`\`\`bash
${scriptsList}
\`\`\`

### **Seuils de qualité**
${seuilsList}

### **Dépôt des livrables**
📁 **Dossier**: \`reports/audit/${cellule.category}/\`

### **Échéancier**
- **T+24h**: Premiers rapports bruts (JSON)
- **T+48h**: Synthèses MD + recommandations  
- **T+72h**: Prêt pour convergence

### **Notes importantes**
- ❌ Pas de nouveaux frameworks tant que l'audit n'est pas livré
- ❌ Pas de Docker en dev: orchestration 100% Node via pnpm scripts
- ✅ Toute PR doit inclure un impact quantifié (tokens, latence, accuracy, sécurité)
- ✅ Format JSON pour données machine, MD pour résumés humains

### **Commandes standard**
\`\`\`bash
npm run audit:full
npm run ports:inventory
npm run security:audit
\`\`\`

---
**Priorité**: 🔥 Haute  
**Deadline**: T+48h  
**Status**: 📋 À faire`;
}

function main() {
  console.log('🚀 Génération des issues d\'audit AURA...\n');
  
  cellules.forEach((cellule, index) => {
    const filename = `audit-${cellule.category.toLowerCase()}.md`;
    const content = generateIssueContent(cellule);
    
    console.log(`${index + 1}. 📋 Cellule ${cellule.category} - ${cellule.title}`);
    console.log(`   📁 Fichier: .github/ISSUE_TEMPLATE/${filename}`);
    console.log(`   🎯 Cible: ${cellule.cible}`);
    console.log(`   📊 Livrables: ${cellule.livrables.length}`);
    console.log('');
  });
  
  console.log('✅ Templates d\'issues générés !');
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Créer les issues sur GitHub avec ces templates');
  console.log('2. Assigner chaque issue à la cellule correspondante');
  console.log('3. Lancer npm run audit:full pour les audits automatisés');
  console.log('4. Planifier la réunion de convergence à T+72h');
}

main();