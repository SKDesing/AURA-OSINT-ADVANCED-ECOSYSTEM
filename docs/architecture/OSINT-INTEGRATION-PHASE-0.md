# Intégration OSINT — Phase 0 (MVP exécutable)

## Ce que cette PR apporte
- Système de plugins OSINT dans @aura/core (enregistrement d'Amass pour commencer).
- Orchestration BullMQ + sandbox Docker + workdir standard var/osint/work/<tool>-<jobId>.
- API REST: /api/osint/tools, /api/osint/jobs, /api/osint/results.
- Persistance minimale (tables osint_* + repo).
- docker-compose OSINT (SpiderFoot/PhoneInfoga, volumes persistants).
- UI: ToolRunner (formulaire dynamique) + ResultsExplorer.

## Runbook
- Démarrage services OSINT: docker compose -f infra/docker/osint/docker-compose.osint.yml up -d
- Lancer API/Workers/Web avec vos scripts habituels.
- UI → OSINT → ToolRunner → "amass", domain=exemple.com → Run
- Consulter les résultats dans ResultsExplorer (+ filtres).

## Sécurité et limites
- OSINT_SANDBOX=docker en dev par défaut.
- Pas de secrets en clair; injection via Secret Manager (à brancher en Phase 2).
- Scans actifs désactivés par défaut; toggle + avertissement légal à venir.

## Étapes phase suivante (Phase 1)
- Adapters subfinder, theHarvester, maigret, holehe, exiftool.
- Export CSV/JSON depuis ResultsExplorer.
- Tests unitaires parsers (fixtures CLI).