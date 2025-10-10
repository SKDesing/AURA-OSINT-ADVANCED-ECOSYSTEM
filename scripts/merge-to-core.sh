#!/usr/bin/env bash
set -euo pipefail

echo "🚀 AURA Core Consolidation - Merge to packages/core"

# Créer structure core
mkdir -p packages/core/src/{config,logging,telemetry,security,db/{postgres,vector},cache/{redis,memory},queue,http/{server,client},browser/chromium,orchestrator,osint/{adapters,tools-advanced},ai/{embeddings,llm},algorithms,middleware,shared/{types,utils,constants}}

# Mappings principaux (garder historique via git mv)
echo "📦 Moving packages to core..."
git mv core/engine-base packages/core/src/runtime 2>/dev/null || true
git mv packages/shared/* packages/core/src/shared/ 2>/dev/null || true
git mv packages/algorithms/* packages/core/src/algorithms/ 2>/dev/null || true
git mv packages/middleware/* packages/core/src/middleware/ 2>/dev/null || true
git mv packages/adapters/instagram packages/core/src/osint/adapters/instagram 2>/dev/null || true
git mv packages/osint-advanced/* packages/core/src/osint/tools-advanced/ 2>/dev/null || true
git mv packages/orchestrator/* packages/core/src/orchestrator/ 2>/dev/null || true

# Fichiers racine utiles → core
echo "📄 Moving root files to core..."
[ -f service-orchestrator.js ] && git mv service-orchestrator.js packages/core/src/orchestrator/service-orchestrator.js || true
[ -f chromium-launcher.js ] && git mv chromium-launcher.js packages/core/src/browser/chromium/chromium-launcher.js || true

# AI: déplacer interfaces/embeddings
if [ -d "packages/ai" ] || [ -d "ai" ]; then
  SRC_AI="packages/ai"
  [ -d "ai" ] && SRC_AI="ai"
  git mv ${SRC_AI}/embeddings packages/core/src/ai/embeddings 2>/dev/null || true
  git mv ${SRC_AI}/vector packages/core/src/db/vector 2>/dev/null || true
  git mv ${SRC_AI}/llm packages/core/src/ai/llm 2>/dev/null || true
fi

# Supprimer dossiers vides
find packages -type d -empty -delete 2>/dev/null || true
find core -type d -empty -delete 2>/dev/null || true

echo "✅ Move terminé. Prochaine étape: exports du core + codemods des imports."