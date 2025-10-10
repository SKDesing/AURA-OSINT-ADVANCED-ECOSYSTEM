#!/usr/bin/env bash
set -euo pipefail

# Ensure directories exist
mkdir -p reports/benchmarks

# Run the TS load generator via ts-node if available, else transpile on the fly
if ! command -v ts-node >/dev/null 2>&1; then
  pnpm dlx ts-node --version >/dev/null 2>&1 || pnpm add -D ts-node typescript >/dev/null
fi

export RATE_PER_MIN="${RATE_PER_MIN:-3000}"
export DURATION_MIN="${DURATION_MIN:-1}"
export ENDPOINT="${ENDPOINT:-http://localhost:4010/ingest}"

echo "Running CI benchmark: rate=${RATE_PER_MIN}/min duration=${DURATION_MIN}m endpoint=${ENDPOINT}"
pnpm dlx ts-node scripts/benchmarks/generate-load.ts

REPORT="reports/benchmarks/ingest-latency.json"
if [ ! -f "$REPORT" ]; then
  echo "No report found at $REPORT"
  exit 1
fi

P95=$(jq -r '.latency.p95' "$REPORT" 2>/dev/null || echo "0")
COUNT=$(jq -r '.actual.count' "$REPORT" 2>/dev/null || echo "0")
echo "p95=${P95}ms count=${COUNT}"

# SLO guardrail for CI smoke: p95 <= 800ms
THRESHOLD=800
if (( $(echo "$P95 > $THRESHOLD" | bc -l) )); then
  echo "❌ SLO violation: p95 ${P95}ms > ${THRESHOLD}ms"
  exit 2
fi

echo "✅ SLO OK: p95=${P95}ms <= ${THRESHOLD}ms"