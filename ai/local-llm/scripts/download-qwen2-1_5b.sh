#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="ai/local-llm/models"
MODEL_FILE="qwen2-1_5b-instruct-q4_k_m.gguf"
URL="https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF/resolve/main/qwen2-1_5b-instruct-q4_k_m.gguf"

mkdir -p "$MODEL_DIR"

echo "🔽 Téléchargement Qwen2 1.5B Instruct (Q4_K_M)..."
if [[ ! -f "$MODEL_DIR/$MODEL_FILE" ]]; then
    # Check if curl supports --progress-bar
    if curl --help | grep -q progress-bar; then
        CURL_OPTS="--progress-bar"
    else
        CURL_OPTS="-#"
    fi
    
    curl -L $CURL_OPTS -o "$MODEL_DIR/$MODEL_FILE" "$URL"
    echo "✅ Modèle téléchargé: $MODEL_DIR/$MODEL_FILE"
else
    echo "ℹ️  Modèle déjà présent: $MODEL_DIR/$MODEL_FILE"
fi

echo "🔐 Génération hash SHA256..."
ACTUAL_SHA256=$(sha256sum "$MODEL_DIR/$MODEL_FILE" | cut -d' ' -f1)
echo "$ACTUAL_SHA256" > "$MODEL_DIR/$MODEL_FILE.sha256"

echo "📊 Taille: $(du -h "$MODEL_DIR/$MODEL_FILE" | cut -f1)"
echo "🔑 Hash: $ACTUAL_SHA256"
echo "📝 Hash sauvegardé: $MODEL_DIR/$MODEL_FILE.sha256"
echo "✅ Qwen2 1.5B prêt pour utilisation"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Installer llama.cpp: bash scripts/ai/install-llama-cpp.sh"
echo "   2. Démarrer serveur: bash ai/local-llm/scripts/run-llm-qwen.sh"
echo "   3. Tester: bash scripts/ai/bench-qwen.sh"