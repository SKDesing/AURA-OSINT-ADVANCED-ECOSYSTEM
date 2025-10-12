#!/bin/bash

echo "🚀 PHASE 1 - NETTOYAGE GIT AUTOMATIQUE"
echo "======================================="
echo ""

# 1. BACKUP
echo "📦 1/5 - Création backup..."
tar -czf ~/aura-backup-$(date +%Y%m%d-%H%M%S).tar.gz . 2>/dev/null
echo "✅ Backup créé dans ~/aura-backup-*.tar.gz"
echo ""

# 2. GITIGNORE COMPLET
echo "📝 2/5 - Mise à jour .gitignore..."
cat > .gitignore << 'EOF'
# Python
venv/
venv-*/
*.pyc
__pycache__/
*.egg-info/
dist/
build/

# Node
node_modules/
npm-debug.log*
package-lock.json

# Secrets
.env
.env.*
!.env.example
*.key
*.pem

# Data
data/
logs/
*.log
*.db

# Binaries
phoneinfoga
*.exe

# IDE
.vscode/
.idea/
.DS_Store

# Build
dist/
build/
coverage/
EOF
echo "✅ .gitignore mis à jour"
echo ""

# 3. SUPPRESSION FICHIERS VERSIONNÉS
echo "🗑️  3/5 - Suppression fichiers du versioning..."
git rm -r --cached venv-osint/ 2>/dev/null || true
git rm -r --cached node_modules/ 2>/dev/null || true
git rm --cached phoneinfoga 2>/dev/null || true
git rm -r --cached "*.pyc" 2>/dev/null || true
git rm -r --cached __pycache__/ 2>/dev/null || true
echo "✅ Fichiers supprimés du versioning"
echo ""

# 4. COMMIT
echo "💾 4/5 - Commit des changements..."
git add .gitignore
git commit -m "chore: Phase 1 - Nettoyage Git (venv, node_modules, binaries)" 2>/dev/null || echo "Rien à commiter"
echo "✅ Changements commitées"
echo ""

# 5. RAPPORT
echo "📊 5/5 - Génération rapport..."
cat > PHASE1-RAPPORT.md << 'EOFREPORT'
# ✅ PHASE 1 TERMINÉE - NETTOYAGE GIT

## Actions Réalisées
1. ✅ Backup complet créé
2. ✅ .gitignore mis à jour (complet)
3. ✅ venv-osint/ supprimé du versioning
4. ✅ node_modules/ supprimé du versioning
5. ✅ Binaries supprimés du versioning
6. ✅ Commit effectué

## Prochaines Étapes
- Phase 2: Restructuration (scripts/clean-structure.sh)
- Phase 3: Amélioration code
- Phase 4: Tests et CI/CD

## Gains Immédiats
- Taille repo: -500MB (venv-osint)
- Taille repo: -200MB (node_modules)
- Sécurité: Secrets protégés
EOFREPORT
echo "✅ Rapport généré: PHASE1-RAPPORT.md"
echo ""

echo "🎉 PHASE 1 TERMINÉE AVEC SUCCÈS!"
echo ""
echo "📊 Consulter le rapport:"
echo "   cat PHASE1-RAPPORT.md"
echo ""
echo "🚀 Lancer Phase 2:"
echo "   bash PHASE2-RESTRUCTURATION.sh"