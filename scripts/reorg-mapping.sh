#!/usr/bin/env bash
set -euo pipefail

# AURA Monorepo Reorganization Script
echo "🚀 Starting AURA monorepo reorganization..."

# Create new structure
mkdir -p apps/{web,api,desktop,proxy,browser,live-tracker,extensions}
mkdir -p packages/{shared,core,algorithms,ai,middleware,adapters,osint-advanced,assets}
mkdir -p infra/{docker,database,monitoring}
mkdir -p services docs/{audits,architecture,reports,roadmaps,process,security,migration,marketing,archive}
mkdir -p tools/{launchers,config,ci} config scripts

# Move apps
git mv backend apps/api 2>/dev/null || true
git mv clients apps/web 2>/dev/null || true
git mv desktop apps/desktop 2>/dev/null || true
git mv aura-proxy apps/proxy 2>/dev/null || true
git mv AURA_BROWSER apps/browser 2>/dev/null || true
git mv live-tracker apps/live-tracker 2>/dev/null || true
git mv extensions/chrome-tiktok apps/extensions/chrome-tiktok 2>/dev/null || true

# Move packages
git mv shared packages/shared 2>/dev/null || true
git mv core/engine-base packages/core 2>/dev/null || true
git mv algorithms packages/algorithms 2>/dev/null || true
git mv ai packages/ai 2>/dev/null || true
git mv middleware packages/middleware 2>/dev/null || true
git mv platform-adapters/instagram packages/adapters/instagram 2>/dev/null || true
git mv osint-tools-advanced packages/osint-advanced 2>/dev/null || true
git mv assets packages/assets 2>/dev/null || true

# Move infra
git mv docker infra/docker 2>/dev/null || true
git mv database infra/database 2>/dev/null || true
git mv monitoring infra/monitoring 2>/dev/null || true

# Move docs
git mv marketing docs/marketing 2>/dev/null || true
git mv Projet_Kaabache docs/archive/Projet_Kaabache 2>/dev/null || true

# Clean up
git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true
git rm --cached .env* 2>/dev/null || true
git rm --cached package-lock.json 2>/dev/null || true

echo "✅ Reorganization complete. Next: fix imports and update workspace config."