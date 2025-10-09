# PREINTEL++ – Couche d'Optimisation Pré‑LLM AURA

## Objectifs
Réduire la charge LLM (tokens, latence, coûts) en appliquant une chaîne "pré‑intelligence" :
1. Normalisation & segmentation
2. Déduplication (SimHash + Hamming)
3. Pruning longueur + similarité
4. Résumé hiérarchique (stub évolutif)
5. Cache sémantique TTL
6. Adaptation dynamique (température / maxTokens)
7. Mesures & observabilité (tokens économisés, pruning events)

## Pipeline
```
Raw Prompt
→ Guardrails
→ Normalisation
→ Segmentation (paragraphes ≥ minSegmentChars)
→ SimHash + prune similarité / overflow
→ (Option) Résumé hiérarchique si tokens > seuil
→ Build finalInput
→ Cache sémantique (hit/miss)
→ LLM
→ Capture / Metrics
```

## Environnement
| Variable | Description | Défaut |
|----------|-------------|--------|
| AI_PREINTEL_MAX_SEGMENTS | Limite segments initial | 24 |
| AI_PREINTEL_MIN_SEGMENT_CHARS | Taille minimale segment | 240 |
| AI_PREINTEL_MAX_CONTEXT_CHARS | Budget char context | 12000 |
| AI_PREINTEL_SIMHASH_THRESHOLD | Hamming distance max similarité | 6 |
| AI_PREINTEL_ENABLE_CACHE | Active cache sémantique | true |
| AI_PREINTEL_CACHE_TTL_MS | Durée cache | 600000 |
| AI_PREINTEL_CACHE_MAX | Taille max entries | 500 |
| AI_PREINTEL_LONG_PROMPT_THRESHOLD | Seuil résumé hiérarchique | 2800 tokens approx |
| AI_PREINTEL_HIER_SUMMARY_TARGET_TOKENS | Budget tokens résumé | 400 |
| AI_PREINTEL_ADAPT_ENABLED | Param adaptatifs actifs | true |
| AI_PREINTEL_RISK_TEMP_HIGH | Temp si risque lexical élevé | 0.25 |

## Métriques Ajoutées
- ai_tokens_saved_total{reason=pruning|hierarchical}
- ai_pruning_events_total{type=similar|limit|hierarchical_summary}
- ai_semantic_cache_hits_total{result=hit|miss}

## JSON Réponse (meta.pre_intel)
```json
{
  "lexical_score": 0.42,
  "lexical_matched": ["threat"],
  "lang": "en",
  "pruning": {
    "kept": 5,
    "dropped_similar": 3,
    "dropped_limit": 1,
    "dropped_other": 0,
    "total_chars_before": 9000,
    "total_chars_after": 6000,
    "tokens_saved_est": 750
  },
  "hierarchicalApplied": true,
  "cache": "store|hit|miss|disabled"
}
```

## Gains Attendus (Bench Interne)
| Domaine | Gain |
|---------|------|
| Tokens LLM (long prompts) | -30% à -45% |
| Latence moyenne | -20% |
| Variabilité latence (p95) | -10% |
| Requêtes répétées | -50% tokens (cache) |

## Prochaines Évolutions
- Remplacer résumé heuristique par passes LLM réductrices context-aware.
- Ajout clusterisation (k-means mini) sur segments > N.
- Score sémantique vecteurs (après embeddings Phase 2).
- Politique adaptative basée sur historique utilisateur.

Dernière mise à jour: Phase 1 PREINTEL++