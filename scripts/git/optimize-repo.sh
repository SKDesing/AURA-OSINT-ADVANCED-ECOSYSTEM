#!/bin/bash

# 🚀 AURA REPO OPTIMIZATION - Actions critiques post-push
set -e

echo "🔧 OPTIMISATION CRITIQUE DU REPO"
echo "================================="

# 1. Supprimer node_modules du tracking (CRITIQUE)
echo "🧹 Suppression node_modules du tracking..."
git rm -r --cached node_modules/ 2>/dev/null || echo "Déjà supprimé"

# 2. Configurer Git LFS pour gros fichiers
echo "📦 Configuration Git LFS..."
git lfs install
git lfs track "*.onnx" "*.bin" "*.tar" "*.zip" "*.gguf" "*.safetensors"

# 3. Optimiser la config Git
echo "⚡ Optimisation config Git..."
git config pack.threads 0
git config core.compression 1
git config pack.compression 1
git config repack.writeBitmaps true

# 4. Nettoyage local
echo "🧽 Nettoyage local..."
git gc --aggressive
git repack -Ad --write-bitmap-index

# 5. Commit des changements
echo "💾 Commit optimisations..."
git add .gitattributes 2>/dev/null || true
git commit -m "chore: optimize repo - remove node_modules tracking + LFS setup" 2>/dev/null || echo "Rien à commiter"

# 6. Pre-push LFS objects
echo "🚀 Pre-push objets LFS..."
git lfs push origin main --all 2>/dev/null || echo "Pas d'objets LFS"

echo "================================="
echo "✅ OPTIMISATION TERMINÉE !"
echo "📊 Statistiques:"
git count-objects -vH