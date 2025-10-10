# Directives "sans pitié" pour remettre le dépôt au carré

**Objectif**: transformer ce dépôt en monorepo propre, sécurisé, maintenable, et industrialisable. On standardise, on purge, on nomme, on isole, on automatise. Pas d'exceptions.

**Responsable global**: Tech Lead Monorepo  
**Deadline phase 1** (Purge + Move): 48h  
**Deadline phase 2** (Build/CI/Qualité): 5 jours ouvrés  
**Deadline phase 3** (Sécurité + Docs): 7 jours ouvrés

---

## 0) Freeze, sauvegarde et garde-fous

- Geler les merges sur main: activer la protection de branche (2 reviews mini, status checks requis)
- Tag de sauvegarde: `git tag backup/pre-reorg-2025-10-09 && git push --tags`
- Branche sauvegarde: `git branch backup/pre-reorg-2025-10-09 && git push -u origin backup/pre-reorg-2025-10-09`
- Ouvrir une PR "chore(reorg): monorepo structure + purge" — aucun autre changement fonctionnel dans cette PR

---

## 1) Cible: structure monorepo standardisée

**Top-level strict**:

- **apps/** … applications exécutable(s)
  - apps/web (ancien clients/src/public…)
  - apps/api (ancien backend)
  - apps/desktop (ancien desktop)
  - apps/proxy (ancien aura-proxy)
  - apps/browser (ancien AURA_BROWSER)
  - apps/extensions/chrome-tiktok (ancien extensions/chrome-tiktok)
  - apps/live-tracker (ancien live-tracker)
- **packages/** … bibliothèques partagées
  - packages/shared (ancien shared)
  - packages/core (ancien core/engine-base renommé engine-base → core)
  - packages/algorithms (ancien algorithms)
  - packages/ai (ancien ai)
  - packages/middleware (ancien middleware)
  - packages/adapters/instagram (ancien platform-adapters/instagram)
  - packages/osint-advanced (ancien osint-tools-advanced)
  - packages/orchestrator (ancien service-orchestrator.js → module)
  - packages/assets (ancien assets s'il contient des ressources partagées)
- **infra/**
  - infra/docker (ancien docker)
  - infra/database (ancien database)
  - infra/monitoring (ancien monitoring si infra-tech; sinon services/monitoring)
- **services/**
  - services/monitoring (si c'est un service applicatif actif)
- **scripts/** (tous les .sh, .bat, utilitaires)
- **docs/**
  - docs/audits (tous les AUDIT-*.md, REPORTS, ANALYSIS, EXECUTIVE-SUMMARY, etc.)
  - docs/architecture (ARCHITECTURE-*, AURA-FRONT-ARCHITECTURE.md, DIAGRAMS → diagrams/ sous ce répertoire)
  - docs/reports (REPORT-DIFF.js → convertir en md si possible ou déplacer en tools/)
  - docs/roadmaps (ROADMAP-*.md, EXPANSION-ROADMAP.md)
  - docs/process (CONTRIBUTING.md, SPRINT-*.md, VALIDATION-*.md)
  - docs/security (SECURITY.md, AURA-SECURITY-CHECKLIST.md.enc, gitleaks usage)
  - docs/migration (REORGANISATION-COMPLETE.md, RENAME-COMPLETE.md, MIGRATION-PNPM-CHROMIUM-RESPONSE.md, NETTOYAGE-*.md)
  - docs/marketing (ancien marketing)
  - docs/archive (Projet_Kaabache, fichiers obsolètes ou historiques)
  - docs/sensitive (fichiers .enc et tout ce qui doit rester sous git-crypt)
- **tools/**
  - tools/launchers (chromium-launcher.js)
  - tools/config (gitleaks.toml, .obsolete-patterns.json, .inventoryignore si nécessaire)
  - tools/ci (scripts CI spécifiques)
- **config/**
  - config/app/<app>.config.{js,ts} (ancien config.js si app landing page)
  - config/eslint/.eslintrc.js (ou racine)
  - config/prettier/.prettierrc (ou racine)

**Interdits à la racine** (après réorg): node_modules, dist, public, src, docs dispersés, .env*, logs, binaires.

---

## 2) Purge immédiate (obligatoire)

- **Supprimer du suivi Git**:
  - node_modules, dist, .cache, coverage, .env, *.log, .DS_Store, tmp, build, out
  - package-lock.json (standard PNPM)
- **Secrets**:
  - Purger toute fuite historique: BFG Repo-Cleaner sur patterns: .env, .aura-key, id_rsa, *.pem, *.p12, *.pfx, *.key, *.enc non git-crypt, tokens, apiKeys, serviceAccount.json, private_key, client_secret
  - Rotation des secrets impactés: TOUS les tokens/clés exposés (GitHub, cloud, DB, proxies, API tiers, Mailtrap, Redis)

---

## 3) Standard monorepo PNPM

- **Conserver PNPM**: pnpm-workspace.yaml (nettoyer pour refléter apps/** et packages/**)
- **Supprimer** yarn.lock et package-lock.json s'ils existent
- **Root package.json**:
  - engines.node: ">=20"
  - packageManager: "pnpm@x.y.z"
  - scripts: build, lint, test, typecheck, clean

---

## 4) Plan d'exécution (phases)

- **Phase 0** (Jour 0): Freeze + backup + PR ouverte
- **Phase 1** (Jours 0-2): Purge + Moves via git mv + .gitignore + pnpm workspace aligné
- **Phase 2** (Jours 2-5): Fix imports, build, tests, CI verte, gitleaks verte
- **Phase 3** (Jours 5-7): BFG + rotation secrets + docs finalisées

---

## 5) Acceptation finale (Definition of Done)

- Arborescence identique à la section 1
- Lint/typecheck/test/build/ci passent sur main
- 0 secrets traçables (gitleaks ok, BFG effectué, rotation faite)
- README + docs/architecture + docs/migration à jour
- Aucune référence cassée dans docker, scripts, imports, workspaces
- Taille repo réduite (post-BFG), historique nettoyé

**Fin. Pas de raccourcis, pas d'exceptions.**