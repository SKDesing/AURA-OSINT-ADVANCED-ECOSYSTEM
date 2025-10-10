# Directives par spécialité — AURA OSINT (mode "sans pitié")

## Objectif global
- Rendre le dépôt propre, industrialisable et commercialisable.
- Exécuter: consolidation core, normalisation monorepo, purge de secrets, CI/CD bloquante, intégration OSINT avec UI, conformité RGPD minimale.

## Jalons communs
- J+0: Freeze main, protection de branche (2 reviews + checks), tag backup.
- J+2: Purge + réorg (moves) terminées.
- J+5: CI "release-readiness" verte.
- J+14: P0 fermés; P1 en cours.
- J+45: RGPD minimum viable validé.

## Rappels clés
- Aucun secret en Git (.env, clés, .aura-key) → BFG + rotation.
- Monorepo standard: apps/*, packages/*, infra/*, scripts/*, docs/*.
- Core unique: @aura/core regroupe utilitaires/algos/adapters/middlewares/orchestrator.

## Références obligatoires
- docs/architecture/OSINT-INTEGRATION-DIRECTIVES.md
- docs/architecture/OSINT-FILESYSTEM-STANDARD.md
- docs/architecture/DATABASE-PLAN.md
- docs/RELEASE-EXECUTION-PLAN.md
- scripts/merge-to-core.sh, scripts/codemod-imports-to-core.sh, scripts/verify-core-consolidation.sh
- scripts/osint/bootstrap-osint.sh, scripts/osint/run-*.sh
- infra/docker/docker-compose.osint.yml
- .github/workflows/release-readiness.yml

---

## 1) Release Manager (RM)
**Responsabilités**
- Orchestration de tous les jalons, suivi des blockers (P0/P1), arbitrages de scope.
- Protection de branche main, gestion des labels, release notes.

**Actions immédiates**
- Activer protection de branche main (status checks: release-readiness; 2 reviews).
- Synchroniser les blockers (scripts/create-release-issues.sh) et assigner owners/ETAs.
- Mettre à jour docs/RELEASE-EXECUTION-PLAN.md avec jalons.

**Livrables**
- Tableau de bord blockers (issues GitHub labellisées).
- Release plan validé (docs/release/RELEASE-PLAN.md).
- Release notes draft.

**DoD**
- 100% P0 assignés + ETA < 48h; CI bloquante activée.

---

## 2) Tech Lead Monorepo & Core
**Responsabilités**
- Consolidation maximale dans @aura/core; aligner le workspace PNPM; conventions.

**Actions**
- Exécuter: ./scripts/merge-to-core.sh puis ./scripts/codemod-imports-to-core.sh
- Exports publics: packages/core/src/index.ts; interdire imports legacy (ESLint guards).
- Corriger builds/imports; tsconfig paths; pnpm-workspace.yaml.
- Vérifier: ./scripts/verify-core-consolidation.sh

**Livrables**
- packages/core complet (algorithmes, middleware, adapters OSINT, orchestrator).
- Packages legacy marqués "private" ou supprimés.

**DoD**
- apps/* n'importent que @aura/core; CI verte.

---

## 3) DevOps / Infra
**Responsabilités**
- CI/CD, images, orchestration, exécutions Docker OSINT, caches, sécurité pipelines.

**Actions**
- Vérifier/étendre .github/workflows/release-readiness.yml (build, lint, test, gitleaks, db-validate, core-verify).
- docker-compose: infra/database (Postgres/Redis), infra/docker/osint (SpiderFoot, PhoneInfoga).
- Préparer caches PNPM/Turbo, PR templates, CODEOWNERS.
- Secrets: brancher Secret Manager (ex: Doppler/SOPS/1Password) côté runners.

**Livrables**
- Pipelines reproductibles; images OSINT tirées ou construites; volumes var/osint/ montés.
- Documentation déploiement (dev/staging/prod).

**DoD**
- Pipelines verts et bloquants; déploiements reproductibles.

---

## 4) Sécurité / DevSecOps
**Responsabilités**
- Purge historiques, rotation secrets, politique de secrets, scans (SAST/DAST), hardening.

**Actions**
- Purge via BFG (patterns: .env, *.pem, id_rsa, *.key, …); force push après backup.
- Activer gitleaks en pre-commit/CI; durcir gitleaks.toml; revue de .gitleaksignore.
- Audit scripts/verification-securite.sh + TESTS-SECURITE-AUTOMATISES.sh.
- Hardening Docker (no-root, read-only fs quand possible, pas de --network host si évitable).

**Livrables**
- Rapport purge + rotation; politique secrets; check-list sécurité actualisée.

**DoD**
- gitleaks = 0 findings; historique nettoyé; secrets rotated.

---

## 5) Base de Données (PostgreSQL/Redis/Vector)
**Responsabilités**
- Provisionning, schémas, migrations, perfs, sauvegardes.

**Actions**
- Appliquer docs/architecture/DATABASE-PLAN.md; mettre en place infra/database/* (compose + init).
- Créer migrations pour osint_* tables (database/migrations/*).
- Santé: scripts/check-db-wiring.sh en CI; indexes; paramètres pool.

**Livrables**
- .env.template complété (URLs dev), .env.example par app.
- Schémas validés (API, tracker, osint).

**DoD**
- Health checks ok; migration dry-run ok; CI db-validate verte.

---

## 6) Backend / API
**Responsabilités**
- Endpoints OSINT (jobs/results/tools), sécurité, rate-limit, journaux, persistance.

**Actions**
- Implémenter /api/osint/tools, /jobs (POST), /jobs/:id, /jobs/:id/stream (SSE), /results (GET).
- Enregistrer les plugins au boot (apps/api/src/bootstrap/osint.ts).
- Repository: apps/api/src/repos/osintRepo.ts (persist results typed + raw).
- Rate limit/rbac; redaction des logs; validation (zod).

**Livrables**
- API contract (OpenAPI ou markdown); tests unitaires/intégration.

**DoD**
- E2E sur un domaine de test (amass/subfinder) → résultats persistés; CI verte.

---

## 7) Orchestration / Workers
**Responsabilités**
- BullMQ queues, sandbox Docker, workdir standard, secrets injection, logs.

**Actions**
- apps/api/src/workers/osintWorker.ts: workdir var/osint/work/<tool>-<jobId>, sandbox docker, timeouts.
- Limiter concurrency/attempts; removeOnComplete; TTL.
- Injecter secrets via Secret Manager (pas via params utilisateur).

**Livrables**
- Workers stables, journalisation propre, métriques (durée, taux succès/échec).

**DoD**
- Jobs stables, limites respectées, aucune fuite de secrets en logs.

---

## 8) Plugins OSINT (Core)
**Responsabilités**
- Adapters CLI/API → entités normalisées; metadata paramétrique pour UI.

**P0**
- Amass, Subfinder, theHarvester, Maigret, holehe, ExifTool.

**P1**
- SpiderFoot API, PhoneInfoga, whatweb, wafw00f, DNSRecon.

**Actions**
- Implémenter packages/core/src/osint/adapters/<tool>.ts (+ tests parsers).
- Respecter ToolPlugin (validate/execute/parse), timeouts, JSON output.

**Livrables**
- Adapters + fixtures tests; docs/usage par outil.

**DoD**
- Résultats normalisés en base; ToolRunner opère sans erreurs.

---

## 9) Frontend / Web (UI)
**Responsabilités**
- Modules "Tool Runner", "Results Explorer", "Investigations", "Graph", "Settings".

**Actions (Phase 0)**
- ToolRunner: formulaires dynamiques (types boolean/enum/file), lancement jobs.
- ResultsExplorer: filtre par entité, export CSV/JSON; gestion état (loading/erreurs).
- Wiring auth/rate-limit UI → API.
- Plus tard: SSE live, Graph, Settings (API keys côté serveur).

**Livrables**
- UI fonctionnelle pour P0; style cohérent; doc d'usage.

**DoD**
- Lancement & suivi d'un job fonctionnent; résultats visibles et exportables.

---

## Commandes utiles

**Core consolidation:**
```bash
./scripts/merge-to-core.sh
./scripts/codemod-imports-to-core.sh
./scripts/verify-core-consolidation.sh
```

**OSINT bootstrap & tests rapides:**
```bash
bash scripts/osint/bootstrap-osint.sh
scripts/osint/run-amass.sh exemple.com --passive
scripts/osint/run-subfinder.sh exemple.com
```

**Bases de données:**
```bash
docker compose -f infra/database/docker-compose.db.yml up -d
psql/redis-cli health via scripts/check-db-wiring.sh
```

**CI / Labels / Blockers:**
```bash
git push  # labels sync auto
bash scripts/create-release-issues.sh
```

**Consolidation docs:**
```bash
bash scripts/docs/execute-md-consolidation.sh         # dry-run
bash scripts/docs/execute-md-consolidation.sh --apply # applique + archive
```

## Definition of Done (programme)
- Arborescence monorepo conforme, core consolidé, CI verte, secrets purgés/rotations faites.
- OSINT P0 opérationnels via UI + persistance + export.
- Monitoring et runbooks en place.
- RGPD minimum viable validé.