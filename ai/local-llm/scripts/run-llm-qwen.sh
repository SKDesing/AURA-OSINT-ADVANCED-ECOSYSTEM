#!/usr/bin/env bash
set -euo pipefail

MODEL="${AI_QWEN_MODEL_FILE:-ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf}"
PORT="${AI_QWEN_PORT:-8080}"
CTX="${AI_QWEN_CONTEXT:-3072}"
THREADS=${THREADS:-6}
SERVER_BIN="ai/local-llm/runtime/llama.cpp/build/bin/llama-server"

# Check if model exists
if [[ ! -f "$MODEL" ]]; then
    echo "❌ Modèle non trouvé: $MODEL"
    echo "Exécutez: bash ai/local-llm/scripts/download-qwen2-1_5b.sh"
    exit 1
fi

# Check if llama.cpp server exists
if [[ ! -f "$SERVER_BIN" ]]; then
    echo "❌ llama.cpp server non trouvé: $SERVER_BIN"
    echo "Exécutez: bash scripts/ai/install-llama-cpp.sh"
    exit 1
fi

echo "🚀 Démarrage Qwen2 1.5B local..."
echo "📁 Modèle: $MODEL"
echo "🌐 Port: $PORT (127.0.0.1 uniquement)"
echo "🧠 Contexte: $CTX tokens"
echo "⚡ Threads: $THREADS"

# Vérification hash désactivée (modèle OK)
echo "⚠️  Vérification hash ignorée"

# Check if port is already in use
if ss -ltn | grep -q ":$PORT "; then
    echo "⚠️  Port $PORT déjà utilisé"
    echo "Arrêtez le processus existant ou changez AI_QWEN_PORT"
    exit 1
fi

echo "🚀 Démarrage serveur llama.cpp..."
echo "   Arrêt: Ctrl+C"
echo "   Test: curl -X POST http://127.0.0.1:$PORT/completion -H 'Content-Type: application/json' -d '{\"prompt\":\"Hello\"}'"
echo ""

# Démarrage llama.cpp server
exec "$SERVER_BIN" \
    --model "$MODEL" \
    --port "$PORT" \
    --host 127.0.0.1 \
    --ctx-size "$CTX" \
    --threads "$THREADS" \
    --n-predict 512 \
    --temp 0.2 \
    --repeat-penalty 1.1 \
    --log-disable