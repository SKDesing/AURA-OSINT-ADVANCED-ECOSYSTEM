#!/usr/bin/env bash
#
# AURA AI Observability Gating Script
# Validates observability run results against quality thresholds
# Exit 0 = PASS, Exit 1 = FAIL (blocks CI/merge)
#
set -euo pipefail

METRICS_FILE="logs/run/final/metrics.prom"
QUICK_METRICS_OUT="logs/run/quick-metrics.out"
ARTIFACTS_DIR="artifacts"

# Thresholds (configurable via env)
MIN_TOKENS_SAVED_RATIO="${MIN_TOKENS_SAVED_RATIO:-45}"
MAX_STRESS_P95_MS="${MAX_STRESS_P95_MS:-2500}"
MIN_CACHE_HIT_RATIO="${MIN_CACHE_HIT_RATIO:-30}"
MIN_RAG_CHUNKS="${MIN_RAG_CHUNKS:-1}"
MAX_DEGRADE_RATIO="${MAX_DEGRADE_RATIO:-5}"

# Colors
C_RESET="\033[0m"; C_OK="\033[32m"; C_FAIL="\033[31m"; C_WARN="\033[33m"

pass() { echo -e "${C_OK}[PASS]${C_RESET} $*"; }
fail() { echo -e "${C_FAIL}[FAIL]${C_RESET} $*"; GATE_FAILED=1; }
warn() { echo -e "${C_WARN}[WARN]${C_RESET} $*"; }

GATE_FAILED=0

echo "🚪 AURA AI Observability Gating"
echo "================================"

# Generate quick metrics if not exists
if [ ! -f "$QUICK_METRICS_OUT" ]; then
  echo "Generating quick metrics..."
  bash scripts/run/quick-metrics.sh > "$QUICK_METRICS_OUT"
fi

# Extract values
get_metric() {
  grep "^$1=" "$QUICK_METRICS_OUT" | cut -d= -f2 | tr -d '%'
}

TOKENS_SAVED_RATIO=$(get_metric "TOKENS_SAVED_RATIO")
SEM_CACHE_HIT_RATIO=$(get_metric "SEM_CACHE_HIT_RATIO")
RAG_CHUNKS=$(get_metric "RAG_RETRIEVED_CHUNKS_TOTAL")

# Extract stress latency from summary
STRESS_P95=0
if [ -f "logs/run/final/stress-summary.txt" ]; then
  STRESS_P95=$(grep "p95=" logs/run/final/stress-summary.txt | sed 's/.*p95=\([0-9]*\)ms.*/\1/')
fi

# Calculate degrade ratio from metrics
DEGRADE_COUNT=0
TOTAL_REQUESTS=0
if [ -f "$METRICS_FILE" ]; then
  DEGRADE_COUNT=$(grep "ai_request_total.*degrade" "$METRICS_FILE" | awk '{sum+=$NF}END{print sum+0}')
  TOTAL_REQUESTS=$(grep "ai_request_total" "$METRICS_FILE" | awk '{sum+=$NF}END{print sum+0}')
fi
DEGRADE_RATIO=0
if [ "$TOTAL_REQUESTS" -gt 0 ]; then
  DEGRADE_RATIO=$(awk -v d="$DEGRADE_COUNT" -v t="$TOTAL_REQUESTS" 'BEGIN{printf "%.1f", (d/t)*100}')
fi

echo "Current Metrics:"
echo "  Tokens Saved Ratio: ${TOKENS_SAVED_RATIO}% (min: ${MIN_TOKENS_SAVED_RATIO}%)"
echo "  Stress p95 Latency: ${STRESS_P95}ms (max: ${MAX_STRESS_P95_MS}ms)"
echo "  Cache Hit Ratio: ${SEM_CACHE_HIT_RATIO}% (min: ${MIN_CACHE_HIT_RATIO}%)"
echo "  RAG Chunks Retrieved: ${RAG_CHUNKS} (min: ${MIN_RAG_CHUNKS})"
echo "  Degrade Ratio: ${DEGRADE_RATIO}% (max: ${MAX_DEGRADE_RATIO}%)"
echo ""

# Gate checks
if [ "${TOKENS_SAVED_RATIO%.*}" -ge "$MIN_TOKENS_SAVED_RATIO" ]; then
  pass "Tokens saved ratio: ${TOKENS_SAVED_RATIO}%"
else
  fail "Tokens saved ratio too low: ${TOKENS_SAVED_RATIO}% < ${MIN_TOKENS_SAVED_RATIO}%"
fi

if [ "$STRESS_P95" -le "$MAX_STRESS_P95_MS" ]; then
  pass "Stress p95 latency: ${STRESS_P95}ms"
else
  fail "Stress p95 latency too high: ${STRESS_P95}ms > ${MAX_STRESS_P95_MS}ms"
fi

if [ "${SEM_CACHE_HIT_RATIO%.*}" -ge "$MIN_CACHE_HIT_RATIO" ]; then
  pass "Cache hit ratio: ${SEM_CACHE_HIT_RATIO}%"
else
  fail "Cache hit ratio too low: ${SEM_CACHE_HIT_RATIO}% < ${MIN_CACHE_HIT_RATIO}%"
fi

if [ "$RAG_CHUNKS" -ge "$MIN_RAG_CHUNKS" ]; then
  pass "RAG chunks retrieved: ${RAG_CHUNKS}"
else
  fail "RAG chunks too low: ${RAG_CHUNKS} < ${MIN_RAG_CHUNKS}"
fi

if [ "${DEGRADE_RATIO%.*}" -le "$MAX_DEGRADE_RATIO" ]; then
  pass "Degrade ratio: ${DEGRADE_RATIO}%"
else
  fail "Degrade ratio too high: ${DEGRADE_RATIO}% > ${MAX_DEGRADE_RATIO}%"
fi

# Network egress check
echo ""
echo "🔒 Security Checks:"
EXTERNAL_SOCKETS=$(sudo lsof -i -P -n 2>/dev/null | grep -v 127.0.0.1 | grep -E 'llama|gateway' | wc -l || echo 0)
if [ "$EXTERNAL_SOCKETS" -eq 0 ]; then
  pass "No external network connections detected"
else
  fail "External network connections found: $EXTERNAL_SOCKETS"
fi

# Final result
echo ""
if [ "$GATE_FAILED" -eq 0 ]; then
  echo -e "${C_OK}✅ GATE PASSED${C_RESET} - All quality thresholds met"
  exit 0
else
  echo -e "${C_FAIL}❌ GATE FAILED${C_RESET} - Quality thresholds not met"
  exit 1
fi