#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Rewriting imports to @aura/core"

# Packages à remplacer
targets=(
  "packages/shared"
  "packages/algorithms"
  "packages/middleware"
  "packages/adapters/instagram"
  "packages/osint-advanced"
  "packages/orchestrator"
  "core/engine-base"
)

for t in "${targets[@]}"; do
  echo "Rewriting imports from ${t} → @aura/core"
  
  # ES6 imports
  find . -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" | \
    grep -v node_modules | \
    xargs -r sed -i.bak "s|from ['\"]${t}['\"]|from '@aura/core'|g"
  
  # CommonJS requires
  find . -name "*.ts" -o -name "*.js" | \
    grep -v node_modules | \
    xargs -r sed -i.bak "s|require(['\"]${t}['\"])|require('@aura/core')|g"
done

# Cas service-orchestrator.js direct
find . -name "*.ts" -o -name "*.js" | \
  grep -v node_modules | \
  xargs -r sed -i.bak "s|from ['\"][^'\"]*service-orchestrator\\(.js\\)?['\"]|from '@aura/core'|g"

# Nettoyer les fichiers .bak
find . -name "*.bak" -delete

echo "✅ Codemod terminé."