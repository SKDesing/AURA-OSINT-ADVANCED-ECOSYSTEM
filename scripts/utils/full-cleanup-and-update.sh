#!/bin/bash

echo "🚀 NETTOYAGE COMPLET ET MISE À JOUR - AURA OSINT"
echo "════════════════════════════════════════════════════════════"

# 1. Nettoyer les fichiers obsolètes
echo "1️⃣ Nettoyage des fichiers obsolètes..."
chmod +x cleanup-obsolete.sh
./cleanup-obsolete.sh

# 2. Mettre à jour DIRECTIVES.md
echo "2️⃣ Mise à jour de DIRECTIVES.md..."
chmod +x update-directives.sh
./update-directives.sh

# 3. Créer un rapport de nettoyage
echo "3️⃣ Création du rapport de nettoyage..."
cat > cleanup-report.md << 'EOF'
# Rapport de Nettoyage - AURA OSINT

## Date
$(date)

## Fichiers Obsolètes Archivés
- launch-aura-complete.js → archive/obsolete/
- launch-aura-fixed.js → archive/obsolete/
- launch-aura-configured.js → archive/obsolete/
- launch-full-ecosystem.js → archive/obsolete/
- start-ecosystem.sh → archive/obsolete/
- chromium-engine.js → archive/obsolete/aura-browser/
- chromium-engine-v2.js → archive/obsolete/aura-browser/
- chromium-engine-simple.js → archive/obsolete/aura-browser/
- quick-fix.sh → archive/obsolete/
- STOP-ALL.sh → archive/obsolete/
- scan-ecosystem-ports.sh → archive/obsolete/

## Fichiers Actifs Principaux
- RUN-AURA-COMPLETE.sh (script de lancement principal)
- aura-browser/chromium-engine-branded.js (moteur AURA Browser)
- config/ports.json (configuration des ports)
- docker-compose.yml (services Docker)

## Documentation Mise à Jour
- DIRECTIVES.md (enrichi avec section bugs et solutions)
- DIRECTIVES.md.backup (sauvegarde de la version précédente)

## Prochaines Étapes Recommandées
1. Tester le lancement avec ./RUN-AURA-COMPLETE.sh
2. Vérifier que AURA Browser s'ouvre correctement
3. Documenter tout nouveau bug dans DIRECTIVES.md section 16
EOF

echo "✅ Rapport de nettoyage créé: cleanup-report.md"

echo ""
echo "🎉 Nettoyage et mise à jour terminés avec succès !"
echo ""
echo "📋 Résumé:"
echo "   📁 Fichiers obsolètes archivés dans archive/obsolete/"
echo "   📝 DIRECTIVES.md enrichi avec section bugs et solutions"
echo "   📄 Rapport de nettoyage disponible: cleanup-report.md"
echo ""
echo "🚀 Vous pouvez maintenant lancer l'écosystème avec:"
echo "   ./RUN-AURA-COMPLETE.sh"