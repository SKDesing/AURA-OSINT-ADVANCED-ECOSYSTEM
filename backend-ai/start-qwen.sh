#!/bin/bash
# Script pour démarrer Qwen avec Ollama

echo "🚀 Démarrage Qwen pour AURA AI Orchestrator"
echo "==========================================="

# Vérifier si Ollama est installé
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama n'est pas installé"
    echo "📥 Installation d'Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
fi

# Démarrer le service Ollama
echo "🔄 Démarrage du service Ollama..."
ollama serve &
sleep 5

# Vérifier si le modèle Qwen est disponible
if ! ollama list | grep -q "qwen2.5"; then
    echo "📥 Téléchargement du modèle Qwen2.5..."
    ollama pull qwen2.5:latest
fi

echo "✅ Qwen est prêt sur http://localhost:11434"
echo "🧠 Modèle: qwen2.5:latest"
echo ""
echo "🔗 Test de connexion:"
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5:latest",
    "prompt": "Hello, I am AURA AI Orchestrator",
    "stream": false
  }' | jq .

echo ""
echo "🚀 Vous pouvez maintenant démarrer le backend:"
echo "   npm run start:dev"