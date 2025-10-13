#!/bin/bash
# 🚀 DÉPLOIEMENT SIMPLE AURA-OSINT
# Sans PostgreSQL Docker (utilise système)

set -e

echo "🚀 DÉPLOIEMENT AURA-OSINT"
echo "========================="
echo ""

# 1. Redis
echo "1/4 Redis..."
if ! docker ps | grep -q aura-redis; then
    docker-compose up -d redis
    sleep 3
fi
docker exec aura-redis redis-cli ping && echo "✅ Redis OK"
echo ""

# 2. Compiler llama.cpp
echo "2/4 llama.cpp..."
LLAMA_SERVER="ai/local-llm/runtime/llama.cpp/build/bin/llama-server"
if [ ! -f "$LLAMA_SERVER" ]; then
    echo "Compilation (5-10 min)..."
    cd ai/local-llm/runtime/llama.cpp
    cmake -B build -DLLAMA_CUDA=ON 2>/dev/null || cmake -B build
    cmake --build build --config Release -j$(nproc)
    cd -
fi
echo "✅ llama.cpp OK"
echo ""

# 3. Démarrer Qwen
echo "3/4 Qwen AI..."
if ! pgrep -f "llama.*server" >/dev/null; then
    nohup ./ai/local-llm/scripts/run-llm-qwen.sh > logs/qwen.log 2>&1 &
    echo "Attente démarrage (30s)..."
    sleep 30
fi

if curl -sf http://localhost:8080/health >/dev/null 2>&1; then
    echo "✅ Qwen OK"
else
    echo "⚠️  Qwen en cours de démarrage..."
fi
echo ""

# 4. Backend
echo "4/4 Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installation npm..."
    npm install
fi

if [ ! -d "dist" ]; then
    echo "Build..."
    npm run build
fi

if ! pgrep -f "nest.*start" >/dev/null; then
    nohup npm run start:prod > ../logs/backend.log 2>&1 &
    echo "Attente démarrage (20s)..."
    sleep 20
fi

cd ..

if curl -sf http://localhost:4011/api/health >/dev/null 2>&1; then
    echo "✅ Backend OK"
else
    echo "⚠️  Backend en cours de démarrage..."
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Services:"
echo "  🤖 Qwen AI:  http://localhost:8080"
echo "  🚀 Backend:  http://localhost:4011"
echo "  🔴 Redis:    localhost:6379"
echo ""
echo "Logs:"
echo "  • Qwen:   tail -f logs/qwen.log"
echo "  • Backend: tail -f logs/backend.log"
echo ""
