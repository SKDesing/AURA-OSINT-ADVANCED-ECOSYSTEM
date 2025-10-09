# AURA – RUN OBSERVATION REPORT ({DATE})

## 1. Overview
Date: {DATE}  
Dataset File: {DATASET_FILE}  
Dataset Lines: {DATASET_LINES}  
Dataset Hash: {DATASET_HASH}

## 2. Core Metrics
| Metric | Value |
|--------|-------|
| Tokens In | {TOKENS_IN} |
| Tokens Out | {TOKENS_OUT} |
| Tokens Saved | {TOKENS_SAVED} |
| Tokens Saved Ratio | {TOKENS_SAVE_RATIO} |
| Pruning Events | {PRUNING_EVENTS} |
| Semantic Cache Hit Ratio | {SEM_CACHE_HIT_RATIO} |
| RAG Retrieved Chunks Total | {RAG_CHUNKS} |
| RAG Ingested Chunks Total | {RAG_INGESTED} |
| RAG Cache Ratio | {RAG_CACHE_RATIO} |
| Stress Count | {STRESS_COUNT} |
| Stress Latency p50 (ms) | {STRESS_P50} |
| Stress Latency p95 (ms) | {STRESS_P95} |
| Stress Latency Avg (ms) | {STRESS_AVG} |

## 3. Scenario Outcomes
- A (LLM Baseline): (Résumer latence / tokens)
- B (Router NER): (Bypass confirmé ?)
- C (Forensic): (Algorithme utilisé ?)
- D (Harassment): (lexical_score & classification)
- E (Cache): (Hit sur seconde requête)
- F (Pruning): (tokens_saved_est > ?)
- G (RAG): (chunks, latence retrieval)
- H (Guardrails): (block / sanitize)
- I (Degrade): (si simulé)
- J (Stress): (stabilité p95)

## 4. Observability Insights
- Tokens Efficiency: ...
- Cache Behavior: ...
- Retrieval Quality: ...
- Guardrails Efficacy: ...

## 5. Anomalies
| Area | Description | Impact | Action |
|------|-------------|--------|--------|
| ...  | ...         | ...    | ...    |

## 6. Strengths
1. ...
2. ...
3. ...

## 7. Recommendations (Top Priority)
1. ...
2. ...
3. ...

## 8. Next Steps
- Guardrails++ / EVAL harness / Fine-tune prep.

## 9. Appendix
Raw metrics: logs/run/final/metrics.prom  
Stress latencies: logs/run/during/stress-latencies.txt