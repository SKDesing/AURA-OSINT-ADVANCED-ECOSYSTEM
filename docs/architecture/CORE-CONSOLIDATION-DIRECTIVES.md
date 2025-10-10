# Directive "sans pitié" — Consolidation maximale dans `packages/core`

## Objectif
- Réduire l'encombrement des packages en fusionnant TOUT ce qui est transverse dans `packages/core`
- Standardiser les API publiques, supprimer les doublons, centraliser types, utils, orchestrations
- Résultat: apps/* deviennent minces, toute la logique commune est dans `@aura/core`

**Responsable**: Core Tech Lead  
**Deadline phase 1** (Move + Build vert): 72h  
**Deadline phase 2** (API surface + Deprecations): 5 jours ouvrés  
**Tolérance**: zéro; pas d'exceptions

---

## 1) Cible: structure du core

`packages/core/src/` — modules standardisés:

- **config/** … chargement env, schémas validation (Zod), résolution multi-app
- **logging/** … logger unifié (pino) + formats + redaction
- **telemetry/** … metrics (Prometheus), tracing, health
- **security/** … crypto, hash, signatures, jwt, policies
- **db/**
  - postgres/ … client/pool, migrations helper, repositories
  - vector/ … pgvector client, Qdrant client, abstractions
- **cache/**
  - redis/ … clients communs, rate-limit, kv, bullmq helpers
  - memory/ … fallback LRU
- **queue/** … bullmq wrappers, orchestration helpers
- **http/**
  - server/ … express wrappers, middlewares (cors, helmet, rate, auth)
  - client/ … fetch/axios, retry, circuit breaker
- **browser/**
  - chromium/ … lanceur, policies, stealth helpers
- **orchestrator/** … scheduler, worker runners, service orchestrator
- **osint/**
  - adapters/ … providers (instagram, tiktok, etc.)
  - tools-advanced/ … outils consolidés
- **ai/**
  - embeddings/ … interfaces, pgvector/Qdrant bridge
  - llm/ … abstractions, routers
- **algorithms/** … fonctions ML/heuristiques/détection
- **middleware/** … middlewares réutilisables
- **shared/**
  - types/ … types globaux
  - utils/ … date, string, array, files, etc.
  - constants/

---

## 2) Ce qui DOIT fusionner (mapping)

- `packages/shared` → `core/shared/*`
- `packages/algorithms` → `core/algorithms/*`
- `packages/middleware` → `core/middleware/*`
- `packages/adapters/instagram` → `core/osint/adapters/instagram/*`
- `packages/osint-advanced` → `core/osint/tools-advanced/*`
- `packages/orchestrator` → `core/orchestrator/*`
- `core/engine-base` → `core/runtime`
- `ai` → `core/ai/*` (interfaces uniquement)
- `service-orchestrator.js` → `core/orchestrator/service-orchestrator.ts`
- `chromium-launcher.js` → `core/browser/chromium/chromium-launcher.ts`

---

## 3) Processus de migration

**Étape 0**: branche `chore/core-merge`, backup tag  
**Étape 1**: créer arborescence core, `git mv` pour garder historique  
**Étape 2**: `index.ts` (barrel exports) + `package.json` (exports)  
**Étape 3**: codemods pour réécrire imports vers `@aura/core`  
**Étape 4**: build + tests + typecheck sur apps  
**Étape 5**: marquer packages dépréciés `"private": true`  
**Étape 6**: ESLint guard rails + CI fail si import legacy

---

## 4) Definition of Done

- apps/* n'importent plus AUCUN ancien package; uniquement `@aura/core`
- build/test/typecheck/ci passent
- exports du core documentés
- packages dépréciés marqués private + guard runtime
- Aucune duplication de types/utils restante

**Sans pitié**: si un module ne justifie pas d'être séparé, il va dans `@aura/core`.