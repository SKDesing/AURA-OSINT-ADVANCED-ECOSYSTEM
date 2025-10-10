# OSINT Phase 0 - Setup E2E

## Variables d'environnement requises
```bash
API_DATABASE_URL=postgres://user:pass@host:port/db
ORCHESTRATOR_REDIS_URL=redis://localhost:6379/5
OSINT_SANDBOX=docker
```

## Migration base de données
```bash
psql "$API_DATABASE_URL" -f database/migrations/2025_10_10_osint.sql
```

## Démarrage services OSINT
```bash
docker compose -f infra/docker/osint/docker-compose.osint.yml up -d
```

## Smoke tests
```bash
# Lister les outils disponibles
curl http://localhost:4010/api/osint/tools

# Lancer un job Amass
curl -X POST http://localhost:4010/api/osint/jobs \
  -H "Content-Type: application/json" \
  -d '{"toolId": "amass", "params": {"domain": "example.com", "passive": true}}'

# Consulter les résultats
curl http://localhost:4010/api/osint/results
```