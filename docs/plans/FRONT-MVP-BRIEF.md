# AURA Front – MVP Brief (2 semaines)

## Scope MVP
- **Observability v0**: 4 KPIs (tokens_saved_ratio, cache_hit_ratio, rag_p95, bypass_rate)
- **Router Decisions**: table + drawer features (sim_*, confidence, features_hash)
- **Artifact Viewer**: serve index.html, meta.json (hashes, entities)

## Livrables techniques
- **App Shell** + API Client (OpenAPI) + SSE Hook
- **Endpoints Back**: `/ai/observability/summary`, `/ai/router/decisions`, `/artifacts/:id` (html/meta)
- **Tests**: smoke + contrat; **CI**: lint, typecheck, gitleaks, SBOM, osv/semgrep

## Non-inclus (Phase 2)
- Guardrails UI, Forensic, Entities avancé

## UX/DS
- **DS tokens**, dark/light, a11y AA
- **SweetAlert2** via wrapper + toasts
- **Icons**: Lucide (UI), Simple Icons (brands)

## Perf cibles
- **FCP** < 1.5s (intranet)
- **Bundle initial** < 300KB hors charts
- **SSE reconnect** backoff

## Stack technique
```
React 18 + Vite + TypeScript
React Query + Zustand + Zod
SSE Hook + API Client (OpenAPI)
Lucide Icons + SweetAlert2
```

## Endpoints requis
```
GET /ai/observability/summary
GET /ai/router/decisions?limit=50
GET /artifacts/:id
GET /artifacts/:id/meta.json
```