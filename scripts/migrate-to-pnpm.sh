#!/bin/bash
# AURA OSINT - Migration PNPM Script
# Author: Sofiane Kaabache
# Priority: DEFCON 1

set -e

echo "🔴 MIGRATION PNPM - AURA OSINT ADVANCED ECOSYSTEM"
echo "=================================================="

# Étape 1: Nettoyage
echo "🧹 Nettoyage des anciens artefacts..."
rm -rf node_modules package-lock.json yarn.lock
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Étape 2: Installation PNPM
echo "📦 Installation PNPM..."
npm install -g pnpm@8.6.0

# Étape 3: Configuration workspace
echo "⚙️ Configuration workspace..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'backend/services/*'
  - 'clients/web-react'
  - 'clients/web/frontend'
  - 'marketing/sites/*'
  - 'live-tracker'
  - 'aura-proxy'
EOF

# Étape 4: Installation dépendances
echo "📥 Installation des dépendances..."
pnpm install --shamefully-hoist

# Étape 5: Mise à jour scripts
echo "🔧 Mise à jour package.json..."
npm pkg set scripts.install="pnpm install"
npm pkg set scripts.dev="pnpm --parallel dev"
npm pkg set scripts.build="pnpm --parallel build"
npm pkg set scripts.test="pnpm --parallel test"

# Étape 6: Fix memory issues
echo "🧠 Configuration memory..."
npm pkg set scripts.dev-safe="node --max-old-space-size=4096 server.js"
npm pkg set scripts.build-safe="pnpm build --max-old-space-size=4096"

echo "✅ Migration PNPM terminée!"
echo "📊 Vérification..."
pnpm ls --depth -1