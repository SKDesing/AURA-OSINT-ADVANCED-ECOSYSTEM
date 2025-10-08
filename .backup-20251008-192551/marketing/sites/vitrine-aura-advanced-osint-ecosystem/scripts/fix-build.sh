#!/bin/bash
set -euo pipefail

echo "🔧 Correction des erreurs de build..."

# 1. Downgrade React Three Fiber vers version stable
echo "⬇️ Downgrade @react-three/fiber vers version stable..."
npm install @react-three/fiber@8.15.0 @react-three/drei@9.88.0 --legacy-peer-deps --silent

# 2. Correction des vulnérabilités npm
echo "🔒 Correction des vulnérabilités..."
npm audit fix --force --silent || echo "⚠️ Certaines vulnérabilités nécessitent une intervention manuelle"

# 3. Test du build
echo "🏗️ Test du build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build réussi!"
  du -sh build/ 2>/dev/null || echo "Build créé avec succès"
else
  echo "❌ Build échoué. Tentative de restauration..."
  npm install @react-three/fiber@latest @react-three/drei@latest --legacy-peer-deps --silent
  exit 1
fi