#!/bin/bash
# Script : fusion_ecosystem.sh
# Objectif : Réorganiser le repo en 3 blocs critiques (Browser / Crawler / OSINT)
# Temps estimé : <1h

set -e

# 1. Créer la nouvelle structure
mkdir -p Projet_Kaabache/{Seffar_Browser/Noyau,Seffar_Browser/Modules,Moudjahid_Crawler/Core,Moudjahid_Crawler/Operations,OSINT_ElDjazair/Analyse}

# 2. Déplacer les fichiers
mv scripts/build_aura.sh.enc Projet_Kaabache/Seffar_Browser/Noyau/ 2>/dev/null || true
mv config/aura-config.json.enc Projet_Kaabache/Seffar_Browser/Modules/ 2>/dev/null || true
mv backend/services/* Projet_Kaabache/Moudjahid_Crawler/Core/ 2>/dev/null || true
mv engines/* Projet_Kaabache/Moudjahid_Crawler/Operations/ 2>/dev/null || true
mv shared/database/* Projet_Kaabache/OSINT_ElDjazair/Analyse/ 2>/dev/null || true

# 3. Nettoyer les anciens dossiers
rm -rf backend/services engines shared/database 2>/dev/null || true

# 4. Générer un rapport de fusion
tree Projet_Kaabache/ > rapport_fusion.txt 2>/dev/null || find Projet_Kaabache/ -type f > rapport_fusion.txt
echo "✅ Fusion terminée. Vérifiez 'rapport_fusion.txt'." || echo "❌ Erreur : vérifiez les permissions."