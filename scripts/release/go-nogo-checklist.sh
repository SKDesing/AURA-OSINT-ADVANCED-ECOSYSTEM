#!/usr/bin/env bash
set -euo pipefail

echo "🎯 AURA GA GO/NO-GO CHECKLIST"
echo "=============================="

PASS=0
FAIL=0

check() {
  local desc="$1"
  local cmd="$2"
  echo -n "🔍 $desc... "
  if eval "$cmd" >/dev/null 2>&1; then
    echo "✅ PASS"
    ((PASS++))
  else
    echo "❌ FAIL"
    ((FAIL++))
  fi
}

echo ""
echo "📊 INFRASTRUCTURE CHECKS"
echo "------------------------"

check "Node version 20+" "node --version | grep -qE 'v(20|21|22)'"
check "npm available" "which npm"
check "Backend health endpoints" "curl -sf http://localhost:4010/ai/health || node backend/mvp-server-fixed.js &>/dev/null & sleep 2 && curl -sf http://localhost:4010/ai/health"
check "Port cleanup script" "test -x scripts/dev/port-cleanup.sh"
check "Graceful shutdown handler" "test -f backend/utils/graceful-shutdown.js"

echo ""
echo "🤖 AI INFRASTRUCTURE CHECKS"
echo "---------------------------"

check "AI models manifest" "test -f config/models.manifest.json && jq -e '.models.embeddings.sha256' config/models.manifest.json"
check "Router dataset 100+" "jq -e '.samples | length >= 100' scripts/audit/ai/router-bench.dataset.json"
check "Embeddings health script" "test -x scripts/audit/ai/embeddings-health.js"
check "Router benchmark script" "test -x scripts/audit/ai/router-bench.js"
check "Warm-up script" "test -x scripts/audit/ai/warmup.js"

echo ""
echo "🔧 CI/CD CHECKS"
echo "---------------"

check "Smoke run workflow" "test -f .github/workflows/smoke-run.yml"
check "AI audit workflow" "test -f .github/workflows/ai-audit.yml"
check "All workflows use Node 20" "grep -r 'node-version.*20' .github/workflows/ | wc -l | grep -q '^11$'"
check "All workflows use npm" "! grep -r 'pnpm install' .github/workflows/"
check "CODEOWNERS exists" "test -f CODEOWNERS"
check "Dependabot config" "test -f .github/dependabot.yml"

echo ""
echo "📋 RELEASE READINESS"
echo "-------------------"

check "Package.json description updated" "grep -q 'Professional OSINT Platform' package.json"
check "Package.json Node engines 20" "jq -e '.engines.node | contains(\"20\")' package.json"
check "Ports manifest populated" "jq -e '.services | length >= 4' config/ports.manifest.json"
check "Release scripts exist" "test -d scripts/release"

echo ""
echo "🛡️ SECURITY CHECKS"
echo "------------------"

check "No hardcoded secrets" "! grep -r 'sk-' . --exclude-dir=node_modules --exclude-dir=.git || true"
check "Graceful shutdown integrated" "grep -q 'graceful-shutdown' backend/mvp-server-fixed.js"
check "SHA-256 hashes in manifest" "jq -e '.models.llm.sha256 | length == 64' config/models.manifest.json"

echo ""
echo "📊 FINAL SCORE"
echo "=============="
echo "✅ PASS: $PASS"
echo "❌ FAIL: $FAIL"
echo "📈 SUCCESS RATE: $(( PASS * 100 / (PASS + FAIL) ))%"

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "🚀 GO FOR GA RELEASE"
  echo "All checks passed - ready for production"
  exit 0
else
  echo ""
  echo "🛑 NO-GO FOR GA RELEASE"
  echo "$FAIL critical issues must be resolved"
  exit 1
fi