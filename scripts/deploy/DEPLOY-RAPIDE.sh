#!/bin/bash
# 🚀 DÉPLOIEMENT RAPIDE AURA-OSINT
# Basé sur l'audit actuel

set -e

echo "🚀 DÉPLOIEMENT RAPIDE AURA-OSINT"
echo "================================"
echo ""

# 1. PostgreSQL
echo "1/6 PostgreSQL..."
if ! docker ps | grep -q postgres; then
    docker-compose up -d postgres
    sleep 10
    docker exec -i aura-postgres psql -U aura_user -d aura_osint < database/schema-ultimate-v2.sql
fi
echo "✅ PostgreSQL"

# 2. Redis
echo "2/6 Redis..."
if ! docker ps | grep -q redis; then
    docker-compose up -d redis
fi
echo "✅ Redis"

# 3. Compiler llama.cpp
echo "3/6 llama.cpp..."
if [ ! -f "ai/local-llm/runtime/llama.cpp/build/bin/llama-server" ]; then
    cd ai/local-llm/runtime/llama.cpp
    cmake -B build -DLLAMA_CUDA=ON
    cmake --build build --config Release -j$(nproc)
    cd -
fi
echo "✅ llama.cpp"

# 4. Démarrer Qwen
echo "4/6 Qwen AI..."
if ! pgrep -f "llama.*server" >/dev/null; then
    nohup ./ai/local-llm/scripts/run-llm-qwen.sh > logs/qwen.log 2>&1 &
    sleep 15
fi
echo "✅ Qwen"

# 5. Backend
echo "5/6 Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
if [ ! -d "dist" ]; then
    npm run build
fi
nohup npm run start:prod > ../logs/backend.log 2>&1 &
cd ..
sleep 10
echo "✅ Backend"

# 6. Tests
echo "6/6 Tests..."
curl -s http://localhost:8080/health && echo "✅ Qwen OK"
curl -s http://localhost:3001/api/health && echo "✅ Backend OK"

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ !"
echo ""
echo "Services:"
echo "  • Qwen AI:  http://localhost:8080"
echo "  • Backend:  http://localhost:3001"
echo ""
