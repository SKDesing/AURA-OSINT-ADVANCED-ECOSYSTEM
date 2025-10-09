#!/usr/bin/env bash
set -euo pipefail
METRICS="logs/run/final/metrics.prom"
[ -f "$METRICS" ] || { echo "Metrics file absent: $METRICS"; exit 1; }

extract_total() {
  local name="$1"
  awk -v n="$name" '$1 ~ n {sum+=$NF} END{print (sum?sum:0)}' "$METRICS"
}

TOK_IN=$(extract_total '^ai_tokens_input_total')
TOK_OUT=$(extract_total '^ai_tokens_output_total')
TOK_SAVED=$(extract_total '^ai_tokens_saved_total')
PRUNE_EVT=$(extract_total '^ai_pruning_events_total')
SEM_HITS=$(grep '^ai_semantic_cache_hits_total' "$METRICS" | grep 'result="hit"' | awk '{s+=$NF}END{print s+0}')
SEM_MISS=$(grep '^ai_semantic_cache_hits_total' "$METRICS" | grep 'result="miss"' | awk '{s+=$NF}END{print s+0}')
RAG_RET=$(extract_total '^rag_retrieved_chunks_total')
RAG_ING=$(extract_total '^rag_ingested_chunks_total')

TOTAL=$(( TOK_IN + TOK_OUT ))
if [ "$TOTAL" -gt 0 ]; then
  RATIO=$(awk -v a="$TOK_SAVED" -v b="$TOTAL" 'BEGIN{printf "%.2f", (a/b)*100}')
else
  RATIO="0.00"
fi

if [ $((SEM_HITS+SEM_MISS)) -gt 0 ]; then
  CACHE=$(awk -v h="$SEM_HITS" -v t="$((SEM_HITS+SEM_MISS))" 'BEGIN{printf "%.2f", (h/t)*100}')
else
  CACHE="0.00"
fi

echo "TOKENS_IN=$TOK_IN"
echo "TOKENS_OUT=$TOK_OUT"
echo "TOKENS_SAVED=$TOK_SAVED"
echo "TOKENS_SAVED_RATIO=$RATIO%"
echo "PRUNING_EVENTS=$PRUNE_EVT"
echo "SEM_CACHE_HIT_RATIO=$CACHE%"
echo "RAG_RETRIEVED_CHUNKS_TOTAL=$RAG_RET"
echo "RAG_INGESTED_CHUNKS_TOTAL=$RAG_ING"