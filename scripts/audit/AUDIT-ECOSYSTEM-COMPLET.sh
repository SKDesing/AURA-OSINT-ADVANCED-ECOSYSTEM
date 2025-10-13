#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           🔍 AUDIT COMPLET - AURA OSINT ECOSYSTEM            ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 1. BASES DE DONNÉES
# ═══════════════════════════════════════════════════════════════════════

echo "📊 1. BASES DE DONNÉES"
echo "══════════════════════════════════════════════════════════════"
echo ""

echo "🐳 Services Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "❌ Docker non accessible"

echo ""

# PostgreSQL
if docker ps 2>/dev/null | grep -q postgres; then
    echo "✅ PostgreSQL: RUNNING"
else
    echo "❌ PostgreSQL: NOT RUNNING"
fi

# Elasticsearch
if curl -s http://localhost:9200/_cluster/health >/dev/null 2>&1; then
    echo "✅ Elasticsearch: RUNNING (port 9200)"
    curl -s http://localhost:9200/_cluster/health?pretty 2>/dev/null | grep status || true
else
    echo "❌ Elasticsearch: NOT RUNNING"
fi

# Qdrant
if curl -s http://localhost:6333/collections >/dev/null 2>&1; then
    echo "✅ Qdrant: RUNNING (port 6333)"
    COLLECTIONS=$(curl -s http://localhost:6333/collections 2>/dev/null | jq -r '.result.collections[]?.name' 2>/dev/null | wc -l)
    echo "   Collections: $COLLECTIONS"
else
    echo "❌ Qdrant: NOT RUNNING"
fi

# Redis
if docker ps 2>/dev/null | grep -q redis; then
    echo "✅ Redis: RUNNING"
else
    echo "❌ Redis: NOT RUNNING"
fi

echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 2. IA QWEN
# ═══════════════════════════════════════════════════════════════════════

echo "🤖 2. IA QWEN (AURA-MIND)"
echo "══════════════════════════════════════════════════════════════"
echo ""

MODELS_DIR="./ai/local-llm/models"

echo "📦 Modèles téléchargés:"
if [ -d "$MODELS_DIR" ]; then
    ls -lh "$MODELS_DIR"/*.gguf 2>/dev/null | awk '{print "   ", $9, "(" $5 ")"}' || echo "   ⚠️  Aucun modèle .gguf trouvé"
    TOTAL_SIZE=$(du -sh "$MODELS_DIR" 2>/dev/null | awk '{print $1}')
    echo "   Total: $TOTAL_SIZE"
else
    echo "   ❌ Dossier models/ introuvable"
fi

echo ""

echo "⚙️  Runtime llama.cpp:"
LLAMA_SERVER="./ai/local-llm/runtime/llama.cpp/llama-server"
if [ -f "$LLAMA_SERVER" ]; then
    echo "   ✅ Compilé (llama-server trouvé)"
elif [ -f "./ai/local-llm/runtime/llama.cpp/build/bin/llama-server" ]; then
    echo "   ✅ Compilé (build/bin/llama-server trouvé)"
elif [ -f "./ai/local-llm/runtime/llama.cpp/build/bin/server" ]; then
    echo "   ✅ Compilé (build/bin/server trouvé)"
else
    echo "   ❌ Non compilé"
fi

echo ""

# Serveur Qwen
if pgrep -f "llama.*server.*qwen" >/dev/null || pgrep -f "server.*qwen" >/dev/null; then
    echo "✅ Serveur Qwen: RUNNING"
    PORT=$(ss -tlnp 2>/dev/null | grep -E ":(8080|8090)" | awk '{print $4}' | cut -d: -f2 | head -1)
    echo "   Port: ${PORT:-8080}"
else
    echo "❌ Serveur Qwen: NOT RUNNING"
fi

echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 3. OUTILS OSINT
# ═══════════════════════════════════════════════════════════════════════

echo "🛠️  3. OUTILS OSINT"
echo "══════════════════════════════════════════════════════════════"
echo ""

TOOLS=(
    "holehe:Social"
    "sherlock:Social"
    "maigret:Social"
    "theHarvester:OSINT"
    "subfinder:Domain"
    "amass:Domain"
    "nuclei:Security"
    "httpx:Network"
    "nmap:Network"
    "whois:Domain"
    "exiftool:Image"
    "ffmpeg:Video"
    "jq:Utils"
)

echo "📦 Outils installés:"
INSTALLED=0
NOT_INSTALLED=0

for tool_info in "${TOOLS[@]}"; do
    IFS=':' read -r tool category <<< "$tool_info"
    
    if command -v "$tool" &> /dev/null; then
        echo "   ✅ $tool ($category)"
        ((INSTALLED++))
    else
        echo "   ❌ $tool ($category)"
        ((NOT_INSTALLED++))
    fi
done

echo ""
echo "   Total: $INSTALLED installés, $NOT_INSTALLED manquants"

echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 4. BACKEND
# ═══════════════════════════════════════════════════════════════════════

echo "🚀 4. BACKEND"
echo "══════════════════════════════════════════════════════════════"
echo ""

if [ -d "./backend/node_modules" ]; then
    echo "✅ node_modules installé"
else
    echo "❌ node_modules manquant"
fi

if [ -f "./backend/.env" ]; then
    echo "✅ .env configuré"
else
    echo "❌ .env manquant"
fi

if [ -d "./backend/dist" ]; then
    echo "✅ Backend compilé"
else
    echo "❌ Backend non compilé"
fi

if pgrep -f "node.*dist/main" >/dev/null || pgrep -f "nest start" >/dev/null; then
    echo "✅ Backend: RUNNING"
else
    echo "❌ Backend: NOT RUNNING"
fi

echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 5. RÉSUMÉ
# ═══════════════════════════════════════════════════════════════════════

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   📋 RÉSUMÉ & RECOMMANDATIONS                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

STEP=1

if ! docker ps 2>/dev/null | grep -q postgres; then
    echo "$STEP. 🐘 Démarrer PostgreSQL: docker-compose up -d postgres"
    ((STEP++))
fi

if [ ! -f "$LLAMA_SERVER" ] && [ ! -f "./ai/local-llm/runtime/llama.cpp/build/bin/server" ]; then
    echo "$STEP. ⚙️  Compiler llama.cpp: cd ai/local-llm/runtime/llama.cpp && make -j\$(nproc)"
    ((STEP++))
fi

if ! pgrep -f "llama.*server.*qwen" >/dev/null; then
    echo "$STEP. 🤖 Démarrer Qwen: ./ai/local-llm/scripts/run-llm-qwen.sh"
    ((STEP++))
fi

if [ $NOT_INSTALLED -gt 0 ]; then
    echo "$STEP. 🛠️  Installer outils OSINT manquants"
    ((STEP++))
fi

if [ ! -d "./backend/dist" ]; then
    echo "$STEP. 🏗️  Compiler backend: cd backend && npm run build"
    ((STEP++))
fi

if ! pgrep -f "node.*dist/main" >/dev/null; then
    echo "$STEP. 🚀 Démarrer backend: cd backend && npm run start:prod"
    ((STEP++))
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
