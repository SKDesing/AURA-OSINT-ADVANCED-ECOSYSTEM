#!/bin/bash
# AURA OSINT - Mise à jour toutes références nom projet

set -e

echo "🔄 MISE À JOUR RÉFÉRENCES AURA OSINT ADVANCED ECOSYSTEM"

# Mise à jour dans tous les fichiers
find . -type f \( -name "*.md" -o -name "*.json" -o -name "*.js" -o -name "*.yml" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' {} \;

find . -type f \( -name "*.md" -o -name "*.json" -o -name "*.js" -o -name "*.yml" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i 's/tiktok-live-analyser/aura-osint-advanced-ecosystem/g' {} \;

# Mise à jour titre principal
sed -i '1s/.*/# 🚀 AURA OSINT ADVANCED ECOSYSTEM/' README.md 2>/dev/null || true

echo "✅ Toutes les références mises à jour vers AURA OSINT ADVANCED ECOSYSTEM"