#!/usr/bin/env bash
set -euo pipefail

# Trap pour arrêt propre
cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
    sleep 1
    if lsof -i :4010 >/dev/null 2>&1; then
      pkill -9 -f "backend/mvp-server-fixed.js" || true
    fi
  fi
}
trap cleanup EXIT INT TERM

# Caches IA (fallbacks documentés)
export HF_HOME="${HF_HOME:-$HOME/.cache/huggingface}"
export HF_HUB_CACHE="${HF_HUB_CACHE:-$HF_HOME/hub}"
export AURA_EMBED_CACHE_DIR="${AURA_EMBED_CACHE_DIR:-$HOME/.cache/aura/embeddings}"
mkdir -p "$HF_HUB_CACHE" "$AURA_EMBED_CACHE_DIR"

echo "🚀 DÉMARRAGE ÉCOSYSTÈME AURA - OBSERVATION LOGS"
echo "📊 Backend MVP sur port 4010..."

# Démarrage backend (PID fiable)
node backend/mvp-server-fixed.js > /tmp/aura-backend.log 2>&1 &
BACKEND_PID=$!

# Attente santé avec retries
echo "⏳ Attente santé /ai/health..."
for i in {1..30}; do
  if curl -sfS http://localhost:4010/ai/health >/dev/null; then
    echo "✅ Backend OK"
    break
  fi
  sleep 0.5
  [[ $i -eq 30 ]] && { echo "❌ Backend indisponible"; exit 1; }
done

echo "🏥 Test health endpoints..."
curl -sfS http://localhost:4010/ai/health | jq . || true

echo "📈 Test observability..."
curl -sfS http://localhost:4010/ai/observability/summary | jq . || true

echo "🧠 Test router decisions..."
curl -sfS "http://localhost:4010/ai/router/decisions?limit=5" | jq '. | length' || true

echo "📄 Test artifacts..."
curl -sfS "http://localhost:4010/artifacts?limit=3" | jq '. | length' || true

echo "⚡ Warm-up IA..."
node scripts/audit/ai/warmup.js --embeddings 10 --llm 5 --dataset scripts/audit/ai/router-bench.dataset.json || true

echo "⚡ Benchmarks IA..."
node scripts/audit/ai/embeddings-health.js > /tmp/aura-embeddings.log 2>&1 || true
node scripts/audit/ai/router-bench.js > /tmp/aura-router.log 2>&1 || true

echo "📊 Vérification rapports..."
ls -la reports/audit/AI/ || true

echo "🔍 ANALYSE LOGS - RECHERCHE ERREURS:"
echo "=== BACKEND LOGS ==="
grep -iE "(^|[[:space:][:punct:]])(error|exception|fail|warn)([[:space:][:punct:]]|$)" /tmp/aura-backend.log \
  | grep -vi "error rate:" || echo "Aucune erreur backend"

echo "=== EMBEDDINGS LOGS ==="
grep -iE "(^|[[:space:][:punct:]])(error|exception|fail|warn)([[:space:][:punct:]]|$)" /tmp/aura-embeddings.log \
  | grep -vi "error rate:" || echo "Aucune erreur embeddings"

echo "=== ROUTER LOGS ==="
grep -iE "(^|[[:space:][:punct:]])(error|exception|fail|warn)([[:space:][:punct:]]|$)" /tmp/aura-router.log \
  | grep -vi "error rate:" || echo "Aucune erreur router"

echo "✅ RUN COMPLET"