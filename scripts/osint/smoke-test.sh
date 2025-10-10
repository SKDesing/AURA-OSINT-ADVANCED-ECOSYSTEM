#!/bin/bash
set -euo pipefail

API_BASE="http://localhost:4011"
echo "🧪 OSINT API Smoke Test - $API_BASE"

# 1. Health check
echo -n "Health: "
if curl -sS "$API_BASE/health" >/dev/null; then
    echo "✅ OK"
else
    echo "❌ FAIL"
    exit 1
fi

# 2. Security headers
echo -n "Security headers: "
HEADERS=$(curl -sSI "$API_BASE/api/osint/tools" | grep -Ei 'x-content-type-options|x-frame-options|content-security-policy' | wc -l)
if [ "$HEADERS" -ge 2 ]; then
    echo "✅ OK ($HEADERS headers)"
else
    echo "⚠️ Missing ($HEADERS/3)"
fi

# 3. Tools endpoint
echo -n "GET /api/osint/tools: "
TOOLS=$(curl -sS "$API_BASE/api/osint/tools" | jq -r '.tools | length' 2>/dev/null || echo "0")
if [ "$TOOLS" -gt 0 ]; then
    echo "✅ OK ($TOOLS tools)"
else
    echo "❌ FAIL"
fi

# 4. Job creation
echo -n "POST /api/osint/jobs: "
JOB_RESPONSE=$(curl -sS -X POST "$API_BASE/api/osint/jobs" \
    -H "Content-Type: application/json" \
    -d '{"toolId":"amass","params":{"domain":"example.com","passive":true}}' 2>/dev/null || echo "{}")
JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.jobId // empty' 2>/dev/null)
if [ -n "$JOB_ID" ]; then
    echo "✅ OK (jobId: $JOB_ID)"
else
    echo "❌ FAIL"
fi

# 5. Results endpoint
echo -n "GET /api/osint/results: "
if curl -sS "$API_BASE/api/osint/results" >/dev/null; then
    echo "✅ OK"
else
    echo "❌ FAIL"
fi

echo ""
echo "🎯 Smoke test completed"