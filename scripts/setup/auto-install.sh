#!/usr/bin/env bash
set -euo pipefail

echo "🚀 AURA OSINT - Installation automatique complète"
echo "=================================================="

# Vérifier les permissions sudo
if ! sudo -n true 2>/dev/null; then
    echo "🔐 Permissions sudo requises pour installer les outils OSINT"
    sudo -v
fi

# 1. Installation des dépendances Node.js
echo "📦 Installation des dépendances Node.js..."
npm install

# 2. Installation des outils OSINT
echo "🔍 Installation des outils OSINT..."
bash scripts/osint/install-osint-tools.sh

# 3. Installation de llama.cpp pour l'IA
echo "🧠 Installation de llama.cpp..."
bash scripts/ai/install-llama-cpp.sh

# 4. Téléchargement du modèle IA Qwen2
echo "⬇️ Téléchargement du modèle IA Qwen2 (1.5B)..."
bash ai/local-llm/scripts/download-qwen2-1_5b.sh

# 5. Vérification de l'installation
echo "✅ Vérification de l'installation..."
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"

# Vérifier quelques outils OSINT
if command -v sherlock &> /dev/null; then
    echo "   - Sherlock: ✅ Installé"
else
    echo "   - Sherlock: ❌ Non trouvé"
fi

if command -v amass &> /dev/null; then
    echo "   - Amass: ✅ Installé"
else
    echo "   - Amass: ❌ Non trouvé"
fi

# Vérifier le modèle IA
if [[ -f "ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf" ]]; then
    echo "   - Modèle Qwen2: ✅ Téléchargé"
else
    echo "   - Modèle Qwen2: ❌ Non trouvé"
fi

echo ""
echo "🎉 Installation terminée !"
echo "🚀 Démarrer AURA: npm start"
echo "🌐 Interface web: npm run mvp:start"