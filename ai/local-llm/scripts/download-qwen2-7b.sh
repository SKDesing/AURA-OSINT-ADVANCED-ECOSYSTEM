#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="ai/local-llm/models"
MODEL_FILE="qwen2-7b-instruct-q5_k_m.gguf"
URL="https://huggingface.co/Qwen/Qwen2-7B-Instruct-GGUF/resolve/main/qwen2-7b-instruct-q5_k_m.gguf"

mkdir -p "$MODEL_DIR"

echo "🔽 Téléchargement Qwen2 7B Instruct (Q5_K_M) - ~5GB..."
echo "⚠️  Ce téléchargement peut prendre 10-30 minutes selon votre connexion"

if [[ ! -f "$MODEL_DIR/$MODEL_FILE" ]]; then
    # Vérifier l'espace disque (besoin de ~6GB)
    AVAILABLE_GB=$(df "$MODEL_DIR" | tail -1 | awk '{print int($4/1024/1024)}')
    if [[ $AVAILABLE_GB -lt 6 ]]; then
        echo "❌ Espace disque insuffisant: ${AVAILABLE_GB}GB disponible, 6GB requis"
        exit 1
    fi
    
    echo "💾 Espace disponible: ${AVAILABLE_GB}GB"
    echo "📥 Téléchargement en cours..."
    
    # Téléchargement avec barre de progression
    if curl --help | grep -q progress-bar; then
        CURL_OPTS="--progress-bar"
    else
        CURL_OPTS="-#"
    fi
    
    # Téléchargement avec reprise automatique
    curl -L $CURL_OPTS -C - -o "$MODEL_DIR/$MODEL_FILE" "$URL"
    
    echo "✅ Modèle téléchargé: $MODEL_DIR/$MODEL_FILE"
else
    echo "ℹ️  Modèle déjà présent: $MODEL_DIR/$MODEL_FILE"
fi

echo "🔐 Génération hash SHA256..."
ACTUAL_SHA256=$(sha256sum "$MODEL_DIR/$MODEL_FILE" | cut -d' ' -f1)
echo "$ACTUAL_SHA256" > "$MODEL_DIR/$MODEL_FILE.sha256"

ACTUAL_SIZE=$(du -h "$MODEL_DIR/$MODEL_FILE" | cut -f1)
echo "📊 Taille: $ACTUAL_SIZE"
echo "🔑 Hash: $ACTUAL_SHA256"
echo "📝 Hash sauvegardé: $MODEL_DIR/$MODEL_FILE.sha256"

# Vérifier que le modèle n'est pas dans Git
echo "🛡️  Vérification exclusion Git..."
if git check-ignore "$MODEL_DIR/$MODEL_FILE" >/dev/null 2>&1; then
    echo "✅ Modèle exclu de Git (sécurisé)"
else
    echo "⚠️  ATTENTION: Modèle pourrait être commité dans Git!"
    echo "   Vérifiez votre .gitignore"
fi

echo "✅ Qwen2 7B prêt pour utilisation"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Installer llama.cpp: bash scripts/ai/install-llama-cpp.sh"
echo "   2. Démarrer serveur: AI_QWEN_MODEL_FILE=$MODEL_DIR/$MODEL_FILE bash ai/local-llm/scripts/run-llm-qwen.sh"
echo "   3. Tester: curl -X POST http://127.0.0.1:8090/completion -H 'Content-Type: application/json' -d '{\"prompt\":\"Hello\"}'"