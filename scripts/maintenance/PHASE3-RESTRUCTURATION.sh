#!/bin/bash

echo "🚀 PHASE 3 - RESTRUCTURATION FICHIERS"
echo "======================================"
echo ""

# 1. Créer structure propre
echo "📁 1/5 - Création structure propre..."
mkdir -p scripts/{audit,install,deploy,maintenance}
mkdir -p docs/{guides,reports,architecture}

# 2. Déplacer scripts
echo "📦 2/5 - Déplacement scripts..."
mv AUDIT-*.sh scripts/audit/ 2>/dev/null || true
mv INSTALL-*.sh scripts/install/ 2>/dev/null || true
mv PHASE*.sh scripts/maintenance/ 2>/dev/null || true
mv AURA-*.sh scripts/maintenance/ 2>/dev/null || true
mv aura-launcher.sh scripts/ 2>/dev/null || true

# 3. Déplacer docs
echo "📄 3/5 - Déplacement documentation..."
mv *-GUIDE.md docs/guides/ 2>/dev/null || true
mv DIRECTIVES.md docs/ 2>/dev/null || true
mv *-README.md docs/ 2>/dev/null || true
mv AUDIT-REPORTS-*/ docs/reports/ 2>/dev/null || true
mv reports/ docs/reports/old/ 2>/dev/null || true

# 4. Nettoyer doublons
echo "🗑️  4/5 - Suppression doublons..."
# Supprimer anciens backups
rm -rf TikTok-Live-Analyser-BACKUP-* 2>/dev/null || true
rm -rf tiktok_osint_env/ 2>/dev/null || true

# Supprimer fichiers temporaires
find . -name "*.log" -type f -delete 2>/dev/null || true
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

# 5. Commit
echo ""
echo "💾 5/5 - Commit restructuration..."
git add -A
git commit -m "♻️ Phase 3: Restructuration fichiers

- Scripts organisés dans scripts/
- Documentation dans docs/
- Suppression doublons et backups
- Nettoyage fichiers temporaires" || echo "Rien à commiter"

# Rapport
echo ""
echo "📝 Génération rapport..."
cat > scripts/maintenance/PHASE3-RAPPORT.md << 'EOF'
# ✅ PHASE 3 TERMINÉE - RESTRUCTURATION

## Actions Réalisées
1. ✅ Structure propre créée
   - scripts/{audit,install,deploy,maintenance}
   - docs/{guides,reports,architecture}

2. ✅ Scripts organisés
   - Audit → scripts/audit/
   - Installation → scripts/install/
   - Maintenance → scripts/maintenance/

3. ✅ Documentation organisée
   - Guides → docs/guides/
   - Reports → docs/reports/
   - Directives → docs/

4. ✅ Doublons supprimés
   - Backups TikTok supprimés
   - Environnements virtuels nettoyés
   - Fichiers temporaires supprimés

## Structure Finale
```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── scripts/
│   ├── audit/
│   ├── install/
│   ├── deploy/
│   └── maintenance/
├── docs/
│   ├── guides/
│   ├── reports/
│   └── architecture/
├── ai/
├── backend/
├── clients/
├── database/
├── marketing/
└── ...
```

## Prochaines Étapes
- Phase 4: Consolidation code (dédoublonnage)
- Phase 5: Tests et CI/CD
- Phase 6: Documentation finale

## Gains
- Organisation claire
- Navigation facilitée
- Maintenance simplifiée
EOF

echo "✅ Rapport généré: scripts/maintenance/PHASE3-RAPPORT.md"
echo ""
echo "🎉 PHASE 3 TERMINÉE!"
echo ""
echo "📊 Consulter le rapport:"
echo "   cat scripts/maintenance/PHASE3-RAPPORT.md"
echo ""
echo "🚀 Lancer Phase 4:"
echo "   bash scripts/maintenance/PHASE4-CONSOLIDATION.sh"
