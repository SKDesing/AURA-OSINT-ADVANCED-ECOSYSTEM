# AURA – Étude impartiale architecture (Front ↔ Back ↔ CLI)

## Résumé exécutif
- **Pertinence élevée** de l'architecture Front et des flux Orchestrator/SSE
- **Priorités immédiates**: hygiène dépôt, CI sécurité, MVP Observability/Router/Artifacts

## Constats clés
- **Artifacts et secrets versionnés** (.env, node_modules, dist, reports/*) → à retirer
- **Double lockfile** (pnpm + npm) → unifier (pnpm recommandé)
- **Docker-compose présent** → clarifier politique (dev/prod)

## Décisions
- **UI par schéma**: RJSF + Zod (MIT), pas de Form.io serveur (Mongo+AGPL) pour l'instant
- **Pipeline artefact**: HTML/CSS/JS + meta.json → Postgres
- **SSE + fallback polling** pour résilience

## Risques identifiés
- **Complexité multi-modules** → MVP focalisé 3 modules
- **SSE sous proxy/firewall** → backoff + healthcheck

## Roadmap (2 semaines)
- **Semaine 1**: Hygiène + MVP Observability/Router/Artifacts
- **Semaine 2**: Pipeline artefact, bench router + gates

## KPI cibles
- `tokens_saved_ratio ≥ 0.60`
- `bypass ≥ 0.65`
- `rag_p95 ≤ 600ms`
- `build_ms p50 ≤ 120ms`
- `PII recall ≥ 0.98`

## Architecture validée
```
Frontend (React + Vite + SSE) ↔ Backend APIs ↔ CLI/Orchestrator
                ↓
        Postgres (artifacts + meta)
                ↓
        Embeddings locaux (e5-small)
```

## Go/No-Go
✅ **GO**: RJSF + Zod, SSE + polling, embeddings locaux  
❌ **NO-GO**: Versionner secrets/artifacts, Form.io serveur sans besoin avéré