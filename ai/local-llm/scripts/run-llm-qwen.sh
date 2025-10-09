#!/usr/bin/env bash
set -euo pipefail

MODEL="${AI_QWEN_MODEL_FILE:-ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf}"
PORT="${AI_QWEN_PORT:-8090}"
CTX="${AI_QWEN_CONTEXT:-3072}"
THREADS=${THREADS:-6}

if [[ ! -f "$MODEL" ]]; then
    echo "❌ Modèle non trouvé: $MODEL"
    echo "Exécutez: npm run llm:download:qwen"
    exit 1
fi

echo "🚀 Démarrage Qwen2 1.5B local..."
echo "📁 Modèle: $MODEL"
echo "🌐 Port: $PORT"
echo "🧠 Contexte: $CTX tokens"
echo "⚡ Threads: $THREADS"

# Vérification hash si disponible
if [[ -f "$MODEL.sha256" ]]; then
    EXPECTED=$(cat "$MODEL.sha256")
    ACTUAL=$(sha256sum "$MODEL" | cut -d' ' -f1)
    if [[ "$EXPECTED" != "$ACTUAL" ]]; then
        echo "❌ Hash mismatch! Modèle potentiellement corrompu"
        exit 1
    fi
    echo "✅ Hash vérifié"
fi

# Démarrage llama.cpp server
exec ./ai/local-llm/runtime/llama.cpp/server \
    --model "$MODEL" \
    --port "$PORT" \
    --host 127.0.0.1 \
    --ctx-size "$CTX" \
    --threads "$THREADS" \
    --n-predict 512 \
    --temp 0.2 \
    --repeat-penalty 1.1 \
    --log-disable