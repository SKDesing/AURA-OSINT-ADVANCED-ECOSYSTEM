#!/bin/bash
# 🚀 DÉPLOIEMENT FINAL AURA-OSINT
# Utilise les services existants

set -e

echo "🚀 DÉPLOIEMENT AURA-OSINT"
echo "========================="
echo ""

# Vérifier services existants
echo "📊 Vérification services..."
redis-cli ping >/dev/null 2>&1 && echo "✅ Redis (système)" || echo "❌ Redis"
curl -sf http://localhost:9200 >/dev/null 2>&1 && echo "✅ Elasticsearch" || echo "❌ Elasticsearch"
curl -sf http://localhost:6333 >/dev/null 2>&1 && echo "✅ Qdrant" || echo "❌ Qdrant"
echo ""

# 1. Compiler llama.cpp
echo "1/3 🔨 llama.cpp..."
LLAMA_SERVER="ai/local-llm/runtime/llama.cpp/build/bin/llama-server"
if [ ! -f "$LLAMA_SERVER" ]; then
    echo "Compilation (5-10 min)..."
    cd ai/local-llm/runtime/llama.cpp
    if command -v nvidia-smi >/dev/null 2>&1; then
        echo "CUDA détecté"
        cmake -B build -DLLAMA_CUDA=ON
    else
        cmake -B build
    fi
    cmake --build build --config Release -j$(nproc)
    cd -
    echo "✅ Compilation terminée"
else
    echo "✅ Déjà compilé"
fi
echo ""

# 2. Démarrer Qwen
echo "2/3 🤖 Qwen AI..."
if pgrep -f "llama.*server" >/dev/null; then
    echo "✅ Déjà actif"
else
    echo "Démarrage..."
    nohup ./ai/local-llm/scripts/run-llm-qwen.sh > logs/qwen.log 2>&1 &
    echo "PID: $!"
    
    echo "Attente (30s)..."
    for i in {1..30}; do
        if curl -sf http://localhost:8080/health >/dev/null 2>&1; then
            echo "✅ Qwen démarré"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
fi
echo ""

# 3. Backend
echo "3/3 🚀 Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installation npm..."
    npm install
fi

# Backend Express - pas de build nécessaire
echo "Backend Express prêt"

if pgrep -f "nest.*start" >/dev/null; then
    echo "✅ Déjà actif"
else
    echo "Démarrage..."
    nohup npm run start:prod > ../logs/backend.log 2>&1 &
    echo "PID: $!"
    
    echo "Attente (20s)..."
    for i in {1..20}; do
        if curl -sf http://localhost:4011/api/health >/dev/null 2>&1; then
            echo "✅ Backend démarré"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
fi

cd ..
echo ""

# Tests finaux
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Tests finaux..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TESTS=0
curl -sf http://localhost:8080/health >/dev/null 2>&1 && { echo "✅ Qwen AI"; ((TESTS++)); } || echo "❌ Qwen AI"
curl -sf http://localhost:4011/api/health >/dev/null 2>&1 && { echo "✅ Backend"; ((TESTS++)); } || echo "❌ Backend"
redis-cli ping >/dev/null 2>&1 && { echo "✅ Redis"; ((TESTS++)); } || echo "❌ Redis"

echo ""
echo "Score: $TESTS/3"
echo ""

if [ $TESTS -ge 2 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Services:"
    echo "  🤖 Qwen AI:        http://localhost:8080"
    echo "  🚀 Backend API:    http://localhost:4011"
    echo "  📚 API Docs:       http://localhost:4011/api/docs"
    echo "  🔴 Redis:          localhost:6379"
    echo "  🔍 Elasticsearch:  http://localhost:9200"
    echo "  📊 Qdrant:         http://localhost:6333"
    echo ""
    echo "📋 Logs:"
    echo "  tail -f logs/qwen.log"
    echo "  tail -f logs/backend.log"
    echo ""
    exit 0
else
    echo "⚠️  Déploiement partiel ($TESTS/3)"
    echo "Vérifier les logs"
    exit 1
fi
