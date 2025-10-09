# Plan de connexion bases de données par service (AURA Monorepo)

## Objectif
- Connecter chaque service à SA base de données dédiée, standardiser les variables d'environnement
- Minimiser le couplage: un service = 1 base de données (ou 1 schéma) + caches/queues séparés
- Postgres 16 (image Timescale), Redis 7, Vector store: pgvector (par défaut) ou Qdrant (optionnel)

## Standards et conventions

**SGBD/Cache par défaut**:
- Transactionnel: PostgreSQL 16
- Cache & queues: Redis 7 (DB index dédié par service)
- Vector store: pgvector dans PostgreSQL (par défaut) OU Qdrant (optionnel)

**Nommage des bases** (par environnement):
- `aura_<env>_<service>`
- Ex: aura_dev_api, aura_dev_tracker

**Variables d'environnement**:
- `<SERVICE>_DATABASE_URL` (Postgres)
- `<SERVICE>_REDIS_URL`
- `VECTOR_DATABASE_URL` ou `QDRANT_URL`

## Cartographie service → DB/Cache/Vector

### apps/api
- PostgreSQL: `aura_<env>_api`
- Redis: DB 0 (sessions, rate-limit, cache)
- Vector: pgvector (table embeddings_*)
- ENV: `API_DATABASE_URL`, `API_REDIS_URL`, `VECTOR_DATABASE_URL`

### apps/proxy
- Redis: DB 1 (rate limiting, bans)
- PostgreSQL optionnel: `aura_<env>_proxy` (journalisation/audit)
- ENV: `PROXY_REDIS_URL`, `PROXY_DATABASE_URL`

### apps/browser
- Redis: DB 2 (job queue/BullMQ)
- ENV: `BROWSER_REDIS_URL`, `API_BASE_URL`

### apps/live-tracker
- PostgreSQL: `aura_<env>_tracker` + extension timescaledb
- Redis: DB 3 (queues/états)
- ENV: `TRACKER_DATABASE_URL`, `TRACKER_REDIS_URL`

### packages/ai
- Vector store: pgvector ou Qdrant dédié
- Cache: Redis DB 4
- ENV: `VECTOR_DATABASE_URL`, `AI_REDIS_URL`

### packages/orchestrator
- Redis DB 5
- ENV: `ORCHESTRATOR_REDIS_URL`

## Definition of Done
- Chaque service dispose des .env.example nécessaires
- `docker-compose.db up` → toutes les bases/redis up + init ok
- CI "db:validate" passe
- Documentation à jour