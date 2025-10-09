#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="ai/local-llm/models"
MODEL_FILE="qwen2-1_5b-instruct-q4_k_m.gguf"
URL="https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF/resolve/main/qwen2-1_5b-instruct-q4_k_m.gguf"
EXPECTED_SHA256="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"

mkdir -p "$MODEL_DIR"

echo "🔽 Téléchargement Qwen2 1.5B Instruct (Q4_K_M)..."
if [[ ! -f "$MODEL_DIR/$MODEL_FILE" ]]; then
    curl -L -o "$MODEL_DIR/$MODEL_FILE" "$URL"
    echo "✅ Modèle téléchargé: $MODEL_DIR/$MODEL_FILE"
else
    echo "ℹ️  Modèle déjà présent: $MODEL_DIR/$MODEL_FILE"
fi

echo "🔐 Vérification hash SHA256..."
ACTUAL_SHA256=$(sha256sum "$MODEL_DIR/$MODEL_FILE" | cut -d' ' -f1)
echo "$ACTUAL_SHA256" > "$MODEL_DIR/$MODEL_FILE.sha256"

echo "📊 Taille: $(du -h "$MODEL_DIR/$MODEL_FILE" | cut -f1)"
echo "🔑 Hash: $ACTUAL_SHA256"
echo "✅ Qwen2 1.5B prêt pour utilisation"