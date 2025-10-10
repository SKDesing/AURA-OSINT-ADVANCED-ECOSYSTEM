#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installation complète des outils OSINT"

# Metapackage Kali OSINT
echo "📦 Installation du metapackage Kali OSINT..."
sudo apt update
sudo apt install -y kali-tools-osint

# Outils essentiels
echo "🛠️ Installation des outils indispensables..."
sudo apt install -y \
  spiderfoot \
  amass \
  sublist3r \
  subfinder \
  sherlock \
  osrframework \
  exiftool \
  whois \
  dnsenum \
  fierce \
  maltego \
  whatweb \
  wafw00f \
  dnsrecon \
  recon-ng \
  instaloader \
  gau \
  tor \
  mat2 \
  pdfid \
  pdf-parser

# Outils Python via pip
echo "🐍 Installation des outils Python..."
python3 -m pip install --user \
  holehe \
  maigret \
  phoneinfoga \
  ghunt \
  sn0int \
  twint

echo "✅ Installation terminée!"
echo "🚀 Lancement de SpiderFoot: spiderfoot -l 127.0.0.1:5001"
echo "📋 Configuration des clés API recommandée pour maximiser les résultats"