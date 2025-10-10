# Runbook — AURA OSINT (Dev local)

## Prérequis
- Docker Desktop/Engine + docker compose v2
- Node 20 LTS, npm, (optionnel: pnpm)
- curl, jq, psql, redis-cli

## 1) Démarrer Postgres + Redis
```bash
docker compose -f infra/docker/database/docker-compose.db.yml up -d
```
Attendre le "healthy"

## 2) Créer le schéma
```bash
psql "$API_DATABASE_URL" -f database/migrations/2025_10_10_osint.sql
```

## 3) Démarrer PhoneInfoga (optionnel, MVP OK sans SpiderFoot)
```bash
docker compose -f infra/docker/osint/docker-compose.osint.yml up -d
```

## 4) Lancer API + Worker
```bash
cd backend
cp .env.example .env   # puis ajuster si besoin
npm i
npm run dev:api
```
Dans un autre terminal:
```bash
npm run worker
```

## 5) Tests rapides
```bash
# Health check
curl -sS http://localhost:${PORT:-4011}/health | jq

# Tools (si route active)
curl -sS http://localhost:${PORT:-4011}/api/osint/tools | jq

# Lancer un job Amass
curl -sS -X POST http://localhost:${PORT:-4011}/api/osint/jobs \
  -H "Content-Type: application/json" \
  -d '{"toolId":"amass","params":{"domain":"example.com","passive":true}}' | jq

# Lire les résultats
curl -sS "http://localhost:${PORT:-4011}/api/osint/results?entity_type=subdomain" | jq
```

## Dépannage
- **Port occupé**: `lsof -ti:4011 | xargs -r kill -9`
- **DB**: vérifier `psql "$API_DATABASE_URL" -c '\dt'`
- **Redis**: `redis-cli -u "$ORCHESTRATOR_REDIS_URL" ping`
- **Docker**: `docker ps; docker logs aura_phoneinfoga`