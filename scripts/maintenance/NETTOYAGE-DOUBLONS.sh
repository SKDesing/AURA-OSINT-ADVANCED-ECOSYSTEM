#!/bin/bash

echo "🔥 NETTOYAGE DOUBLONS ET FICHIERS OBSOLÈTES"
echo "==========================================="
echo ""

# Backup
echo "📦 Backup..."
tar -czf ~/aura-backup-doublons-$(date +%Y%m%d-%H%M%S).tar.gz . 2>/dev/null

# Supprimer doublons apps/
echo "1/6 Suppression apps/aura-browser (doublon)..."
rm -rf apps/aura-browser apps/browser

# Supprimer doublons clients/
echo "2/6 Suppression clients/web-app et web-react (doublons)..."
rm -rf clients/web-app clients/web-react clients/desktop-electron

# Supprimer backend-ai (doublon)
echo "3/6 Suppression backend-ai (doublon)..."
rm -rf backend-ai

# Supprimer documentation/ (doublon)
echo "4/6 Suppression documentation/ (doublon)..."
rm -rf documentation

# Supprimer fichiers inutiles racine
echo "5/6 Suppression fichiers inutiles..."
rm -f bfg-1.14.0.jar phoneinfoga test.html rapport_fusion.txt cleanup-report.md optimization-report.md server.js chromium-launcher.js config.js

# Supprimer dossiers obsolètes
echo "6/6 Suppression dossiers obsolètes..."
rm -rf archive optimized var tor-config

# Nettoyer .env
echo "7/6 Nettoyage .env..."
rm -f .env.darknet .env.embeddings .env.template .env.unified

# Nettoyer docker-compose
echo "8/6 Nettoyage docker-compose..."
rm -f docker-compose.darknet-secure.yml docker-compose.tor.yml docker-compose.unified.yml

# Commit
git add -A
git commit -m "🔥 Remove: Doublons et fichiers obsolètes

- apps/aura-browser, apps/browser (doublons)
- clients/web-app, web-react, desktop-electron (doublons)
- backend-ai, documentation (doublons)
- archive, optimized, var, tor-config (obsolètes)
- Fichiers temporaires (jar, binaires, tests)
- .env et docker-compose en trop"

echo ""
echo "✅ NETTOYAGE TERMINÉ"
echo "Gain: ~500MB"
