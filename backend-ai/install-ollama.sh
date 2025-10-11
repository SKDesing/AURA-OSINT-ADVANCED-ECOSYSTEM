#!/bin/bash
# Installation manuelle d'Ollama

echo "📥 Installation d'Ollama pour AURA..."

# Télécharger Ollama
wget -O ollama https://github.com/ollama/ollama/releases/latest/download/ollama-linux-amd64
chmod +x ollama

# Créer le dossier local
mkdir -p ~/.local/bin
mv ollama ~/.local/bin/

# Ajouter au PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

echo "✅ Ollama installé dans ~/.local/bin/"
echo "🔄 Rechargez votre terminal ou exécutez:"
echo "   export PATH=\"\$HOME/.local/bin:\$PATH\""
echo "   ~/.local/bin/ollama serve"