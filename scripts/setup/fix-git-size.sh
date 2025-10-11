#!/usr/bin/env bash
set -euo pipefail

echo "🧹 NETTOYAGE REPOSITORY - RÉDUCTION TAILLE"

# 1. Supprimer les builds Electron
echo "🗑️ Suppression des builds Electron..."
rm -rf apps/browser-electron/dist/
rm -rf apps/aura-browser/dist/

# 2. Supprimer node_modules des sites marketing
echo "🗑️ Suppression node_modules marketing..."
rm -rf marketing/sites/*/node_modules/

# 3. Nettoyer les caches
echo "🗑️ Nettoyage des caches..."
rm -rf .cache/
rm -rf node_modules/@xenova/transformers/.cache/

# 4. Supprimer les gros binaires temporaires
echo "🗑️ Suppression binaires temporaires..."
find . -name "*.so" -size +10M -delete 2>/dev/null || true
find . -name "*.dylib" -size +10M -delete 2>/dev/null || true

# 5. Vérifier la nouvelle taille
echo "📊 Nouvelle taille du repository:"
du -sh .

echo "✅ Nettoyage terminé! Repository prêt pour push."