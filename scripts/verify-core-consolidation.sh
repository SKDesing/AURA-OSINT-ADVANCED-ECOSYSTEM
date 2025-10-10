#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Vérification consolidation @aura/core..."

# Vérifier que @aura/core existe
if [ ! -f "packages/core/package.json" ]; then
  echo "❌ packages/core/package.json manquant"
  exit 1
fi

# Vérifier exports barrel
if [ ! -f "packages/core/src/index.ts" ]; then
  echo "❌ packages/core/src/index.ts manquant"
  exit 1
fi

# Vérifier pas d'imports legacy
legacy_imports=$(find . -name "*.ts" -o -name "*.js" | xargs grep -l "from.*shared\|from.*algorithms\|from.*middleware" 2>/dev/null || true)
if [ -n "$legacy_imports" ]; then
  echo "❌ Imports legacy détectés:"
  echo "$legacy_imports"
  exit 1
fi

echo "✅ Consolidation @aura/core OK"