#!/usr/bin/env bash
set -euo pipefail

echo "🚀 AURA Pipeline Benchmark Suite"

# Configuration
RATE_PER_MIN=${RATE_PER_MIN:-120000}
DURATION_MIN=${DURATION_MIN:-10}
ENDPOINT=${ENDPOINT:-"http://localhost:4010/ingest"}

# Ensure reports directory exists
mkdir -p reports/benchmarks

# Check if backend is running
if ! curl -s "$ENDPOINT/health" > /dev/null 2>&1; then
    echo "❌ Backend not responding at $ENDPOINT"
    echo "   Start backend first: npm run start:backend"
    exit 1
fi

echo "✅ Backend healthy at $ENDPOINT"
echo "📊 Target: ${RATE_PER_MIN}/min for ${DURATION_MIN} minutes"

# Run load generation
RATE_PER_MIN=$RATE_PER_MIN \
DURATION_MIN=$DURATION_MIN \
ENDPOINT=$ENDPOINT \
npx ts-node scripts/benchmarks/generate-load.ts

# Generate summary report
if [ -f "reports/benchmarks/ingest-latency.json" ]; then
    echo ""
    echo "📈 Benchmark Results:"
    cat reports/benchmarks/ingest-latency.json | jq -r '
        "Rate: \(.actual.ratePerMin)/min (target: \(.target.ratePerMin))",
        "Latency P95: \(.latency.p95)ms",
        "Latency P99: \(.latency.p99)ms",
        "Records: \(.actual.count)",
        "Timestamp: \(.timestamp)"
    '
    
    # Check SLO compliance
    P95=$(cat reports/benchmarks/ingest-latency.json | jq -r '.latency.p95')
    ACTUAL_RATE=$(cat reports/benchmarks/ingest-latency.json | jq -r '.actual.ratePerMin')
    
    echo ""
    if (( $(echo "$P95 < 800" | bc -l) )) && (( $(echo "$ACTUAL_RATE >= 120000" | bc -l) )); then
        echo "✅ SLO PASSED: P95 < 800ms AND rate >= 120k/min"
    else
        echo "❌ SLO FAILED: P95=$P95ms (target <800ms), rate=${ACTUAL_RATE}/min (target >=120k/min)"
        exit 1
    fi
else
    echo "❌ No benchmark results generated"
    exit 1
fi