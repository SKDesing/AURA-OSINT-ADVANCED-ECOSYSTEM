# AURA – Audit Total et Inventaire Technique

## 🎯 **Objectif**
Disposer d'un état des lieux complet, normé, diffable pour piloter les prochaines phases sans zones d'ombre.

## 📋 **Cellules et Livrables**

### 1️⃣ **Cellule Base de données** → `reports/audit/DB/`
- **Cible**: Postgres (prioritaire), Redis (si utilisé), tout entrepôt secondaire
- **Livrables**:
  - `schema.sql` - DDL complet (tables, index, FK, vues, fonctions)
  - `indexes_report.json` - Liste index + tailles + fragmentation
  - `data-catalog.json` - Tables avec description, volumétrie, PII flags, rétention
  - `connections.env.template` - Variables de connexion (sans secrets)
- **Scripts**: EXPLAIN ANALYZE de 5 requêtes critiques
- **Seuils**: Index sur artifacts(hash), SELECT artifacts/:id < 50ms

### 2️⃣ **Cellule IA/Modèles/Embeddings** → `reports/audit/AI/`
- **Cible**: Embeddings locaux Xenova e5-small + tout autre modèle
- **Livrables**:
  - `models-inventory.json` - Nom, licence, taille, device, latence p50/p95
  - `router-bench.json` - Accuracy, bypass, confusion matrix, seuils
  - `embeddings-cache-report.json` - Nombre vecteurs, taille disque, hit ratio
- **Scripts**: `npm run ai:embeddings:health`, `npm run ai:router:bench`
- **Seuils**: Bypass ≥ 0.65, accuracy ≥ 0.75, p50 embed ≤ 30ms

### 3️⃣ **Cellule Orchestrator/CLI/Jobs** → `reports/audit/ORCH/`
- **Cible**: scripts/analysis/*, scripts/ai/*, service-orchestrator.js
- **Livrables**:
  - `jobs-catalog.json` - ID, description, entrée/sortie, durée p50/p95
  - `artifacts-spec.json` - Pipeline BuildArtifact complet
  - `sse-channels.json` - Liste canaux SSE et payload schemas
- **Scripts**: Dry-run de 3 tâches (obsolete-scan, registry-diff, build-artifact)
- **Seuils**: build_ms p50 ≤ 120ms/doc

### 4️⃣ **Cellule Backend/Gateway/API** → `reports/audit/API/`
- **Cible**: ai/gateway/, backend/, middleware/, endpoints MVP 4010
- **Livrables**:
  - `openapi.json` - Swagger NestJS actualisé
  - `endpoints-inventory.md` - Routes, méthodes, auth, timeouts, codes d'erreur
  - `sse-behavior.md` - Keepalive, retry, formats, backoff
- **Tests**: Contrats Zod alignés avec OpenAPI
- **Seuils**: p95 /ai/observability/summary < 150ms, SSE stable > 10min

### 5️⃣ **Cellule Front/UX/Design System** → `reports/audit/FRONT/`
- **Cible**: clients/web-react/, Observability, Router, Artifact Viewer
- **Livrables**:
  - `ui-inventory.md` - Composants DS, tokens, thèmes, a11y checks
  - `telemetry-config.md` - Sentry dev désactivé, wrapper notify
  - `api-client-report.json` - Endpoints consommés, schémas Zod
- **Seuils**: FCP < 1.5s, bundle < 300KB, A11y AA

### 6️⃣ **Cellule Sécurité/Compliance** → `reports/audit/SEC/`
- **Cible**: Secrets, licences, SBOM, CORS, auth/JWT, logs PII
- **Livrables**:
  - `security-audit.json` - Gitleaks, SBOM, license check, osv/npmaudit
  - `policies-hash.json` - Policy/guardrails version + hash
  - `cors-auth-report.md` - Origins, headers, TTL, algos JWT
- **Seuils**: Zéro secret dans Git, zéro wildcard CORS prod

### 7️⃣ **Cellule DevOps/Runtime** → `reports/audit/DEVOPS/`
- **Cible**: Ports, scripts pnpm, healthchecks
- **Livrables**:
  - `ports-state.json` - Résultat port-inventory.js
  - `runbook.md` - Démarrage local coordonné
  - `ci-pipelines.md` - Gates obligatoires
- **Seuils**: Aucun conflit de ports, scripts reproducibles

### 8️⃣ **Cellule Documentation/Qualité** → `reports/audit/DOCS/`
- **Cible**: docs/, duplication, liens cassés, versions
- **Livrables**:
  - `docs-inventory.json` - Index docs, tags, propriétaires, doublons
  - `links-report.json` - Liens/ancres invalides
  - `changelog` - Discipline versionnage et impact

## ⏱️ **Échéancier**
- **T0**: Diffusion + création dossiers reports/audit/*
- **T+24h**: Premiers rapports bruts (JSON) par cellule
- **T+48h**: Synthèses MD + recommandations
- **T+72h**: Réunion convergence, arbitrages, gel contrats

## 🚫 **Règles strictes**
- Pas de nouveaux frameworks/services tant que l'audit n'est pas livré
- Pas de Docker en dev: orchestration 100% Node via pnpm scripts
- Toute PR doit inclure un impact quantifié (tokens, latence, accuracy, sécurité)

## 📊 **Commandes standard**
```bash
pnpm ports:inventory
node scripts/analysis/find-residues.js
pnpm ai:router:bench
pnpm security:audit
```