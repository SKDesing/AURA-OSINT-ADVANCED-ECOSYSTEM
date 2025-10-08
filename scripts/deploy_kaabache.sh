#!/bin/bash
# Commandes de déploiement (TERMINAL)

set -e

echo "🚀 DÉPLOIEMENT PROJET KAABACHE"

# 1. Builder le navigateur Seffar
cd Projet_Kaabache/Seffar_Browser/Noyau/
mkdir -p build && cd build
cmake .. && make -j$(nproc)

# 2. Lancer le crawler Moudjahid
cd ../../Moudjahid_Crawler/Core/
python3 main.py --target "https://site-cible.com" --threads 8 &

# 3. Monitorer les logs (en temps réel)
tail -f ../../OSINT_ElDjazair/Analyse/logs/scraper.log | grep -i "success\|error" &

echo "✅ Déploiement terminé"