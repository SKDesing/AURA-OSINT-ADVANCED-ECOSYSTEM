#!/bin/bash
set -euo pipefail

echo "🔒 Build sécurisé AURA ADVANCED OSINT ECOSYSTEM..."

# Nettoyage
rm -rf build/

# Build avec obfuscation
GENERATE_SOURCEMAP=false npm run build

# Vérification qu'aucun secret n'est présent
echo "🔍 Scan des secrets dans le build..."
if grep -r "API_KEY\|SECRET\|PASSWORD\|TOKEN" build/ 2>/dev/null; then
  echo "❌ SECRETS DÉTECTÉS DANS LE BUILD!"
  exit 1
fi

# Suppression des commentaires et console.log
echo "🧹 Nettoyage du code..."
find build/static/js/ -name "*.js" -exec sed -i 's/console\.log[^;]*;//g' {} \;

# Génération du hash du build
echo "🔐 Génération du hash d'intégrité..."
find build/ -type f -exec sha256sum {} \; > build/INTEGRITY.sha256

echo "✅ Build sécurisé terminé!"
echo "📂 Dossier: build/"
echo "🔐 Hash d'intégrité: build/INTEGRITY.sha256"