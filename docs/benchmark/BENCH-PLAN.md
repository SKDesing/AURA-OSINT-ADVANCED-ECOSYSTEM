# AURA – Plan de benchmark scientifique (algorithmes > IA)

## Objectif
Maximiser le pré-traitement algorithmique pour réduire l'usage IA, tout en augmentant l'accuracy et la vitesse.

## Métriques
- `tokens_saved_ratio`, `router_bypass_rate`, `rag_latency_p95`, `preintel_latency_p50`, `html_artifact_build_time_p50`, `accuracy_router`, precision/recall PII masking.

## Datasets
- 200 prompts gold (5 classes équilibrées)
- 100 documents OSINT (FR/EN), anonymisés

## Procédure
1) **Router Bench**
   - Calibrer seuils sim_* (grid search) → viser accuracy ≥75%, bypass ≥65%
2) **RAG Latency**
   - mesurer p50/p95 local CPU
3) **PreIntel Latency**
   - mesurer end-to-end (normalise→mask→chunk→rank)
4) **Build Artifact**
   - moyenne/percentiles pour génération HTML/CSS/JS
5) **Quality**
   - PII masking recall ≥ 0.98 (regex + dictionnaires)
   - Dedup SimHash: duplication rate < 3%

## Rapports
- `reports/BENCH-ROUTER.json`
- `reports/BENCH-RAG.json`
- `reports/BENCH-ARTIFACT.json`

## Seuils (quality gate)
- `router_bypass_rate` ≥ 0.65
- `html_artifact_build_time_p50` ≤ 120ms / doc
- `rag_latency_p95` ≤ 600ms
- `tokens_saved_ratio` ≥ 0.60