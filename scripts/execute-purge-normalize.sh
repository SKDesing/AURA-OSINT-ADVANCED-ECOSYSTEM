#!/usr/bin/env bash
set -euo pipefail

echo "🚨 EXÉCUTION PURGE + NORMALISATION MONOREPO"
echo "Phase 1: Purge secrets/artefacts + moves git mv"

# PHASE 1: PURGE IMMÉDIATE
echo "🔥 1. Purge secrets et artefacts..."

# Supprimer secrets du suivi Git
git rm --cached .aura-key .env .env.production .env.embeddings 2>/dev/null || true
git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true

# Supprimer fichiers temporaires
rm -f .ci-hotfix-applied fix-reorganization.log rapport_fusion.txt
git rm --cached .ci-hotfix-applied fix-reorganization.log rapport_fusion.txt 2>/dev/null || true

# Supprimer doublons
rm -f pnpm-workspace-new.yaml
git rm --cached pnpm-workspace-new.yaml 2>/dev/null || true

echo "✅ Purge terminée"

# PHASE 2: NORMALISATION STRUCTURE
echo "🏗️ 2. Normalisation structure monorepo..."

# Créer dossiers cibles
mkdir -p apps/{web,api,desktop,proxy,browser,live-tracker}
mkdir -p infra/{docker,database,monitoring}
mkdir -p docs/{audits,architecture,reports,roadmaps,process,security,migration,marketing,archive,sensitive}
mkdir -p tools/{config,ci,launchers}

# Moves apps
echo "📱 Apps migration..."
[ -d "backend" ] && git mv backend apps/api || true
[ -d "clients" ] && git mv clients apps/web || true
[ -d "desktop" ] && git mv desktop apps/desktop || true
[ -d "aura-proxy" ] && git mv aura-proxy apps/proxy || true
[ -d "AURA_BROWSER" ] && git mv AURA_BROWSER apps/browser || true
[ -d "live-tracker" ] && git mv live-tracker apps/live-tracker || true

# Moves infra
echo "🏗️ Infra migration..."
[ -d "database" ] && git mv database infra/database || true
[ -d "docker" ] && git mv docker infra/docker || true
[ -d "monitoring" ] && git mv monitoring infra/monitoring || true
[ -d "infrastructure" ] && git mv infrastructure/* infra/ && rmdir infrastructure || true

# Moves docs
echo "📚 Docs migration..."
git mv AUDIT-*.md docs/audits/ 2>/dev/null || true
git mv AURA-*.md docs/architecture/ 2>/dev/null || true
git mv ROADMAP-*.md EXPANSION-ROADMAP.md docs/roadmaps/ 2>/dev/null || true
git mv REORGANISATION-*.md RENAME-*.md MIGRATION-*.md NETTOYAGE-*.md docs/migration/ 2>/dev/null || true
git mv POST-REORGANIZATION-*.md ENCRYPTION-*.md CI-CD-*.md docs/reports/ 2>/dev/null || true
git mv PRESENTATION-*.md docs/marketing/ 2>/dev/null || true
git mv SECURITY.md docs/security/ 2>/dev/null || true
git mv CONTRIBUTING.md docs/process/ 2>/dev/null || true
[ -d "Projet_Kaabache" ] && git mv Projet_Kaabache docs/archive/ || true
[ -d "marketing" ] && git mv marketing docs/marketing/ || true

# Moves scripts
echo "🔧 Scripts migration..."
git mv *.sh scripts/ 2>/dev/null || true
git mv *.bat scripts/windows/ 2>/dev/null || true
mkdir -p scripts/windows

# Moves tools/config
echo "🛠️ Tools migration..."
git mv chromium-launcher.js tools/launchers/ 2>/dev/null || true
git mv gitleaks.toml .obsolete-patterns.json .inventoryignore tools/config/ 2>/dev/null || true

# Moves public/src si à la racine
[ -d "public" ] && git mv public apps/web/ || true
[ -d "src" ] && git mv src apps/web/ || true

echo "✅ Structure normalisée"

# PHASE 3: GITIGNORE UPDATE
echo "🚫 3. Mise à jour .gitignore..."
cat >> .gitignore << 'EOF'

# Secrets (never commit)
.env
.env.*
!.env.template
!.env.example
.aura-key
*.pem
*.key
*.p12
*.pfx

# Build artifacts
node_modules/
dist/
build/
out/
.cache/
coverage/
*.log

# Temporary files
tmp/
.DS_Store
.ci-hotfix-applied
*.log
rapport_*.txt
EOF

echo "✅ .gitignore mis à jour"

# PHASE 4: WORKSPACE UPDATE
echo "📦 4. Mise à jour pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  # Applications
  - 'apps/*'
  
  # Shared packages
  - 'packages/*'
  
  # Tools
  - 'tools/*'
EOF

echo "✅ Workspace mis à jour"

echo ""
echo "🎯 PHASE 1 TERMINÉE"
echo "✅ Secrets purgés"
echo "✅ Structure normalisée (apps/, infra/, docs/, tools/)"
echo "✅ .gitignore et workspace mis à jour"
echo ""
echo "🔄 PROCHAINES ÉTAPES:"
echo "1. Vérifier les moves: git status"
echo "2. Fixer les imports cassés"
echo "3. Tester le build: pnpm install && pnpm build"
echo "4. Commit: git commit -m 'chore: phase 1 purge + normalisation monorepo'"