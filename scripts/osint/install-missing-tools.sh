#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installation des outils OSINT manquants"

# Outils manquants identifiés
echo "📦 Installation sublist3r..."
sudo apt install -y sublist3r || pip3 install --user sublist3r

echo "📦 Installation subfinder..."
if ! command -v subfinder &> /dev/null; then
    wget -q https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_2.6.3_linux_amd64.zip
    unzip -q subfinder_2.6.3_linux_amd64.zip
    sudo mv subfinder /usr/local/bin/
    rm subfinder_2.6.3_linux_amd64.zip
fi

echo "📦 Installation spiderfoot..."
sudo apt install -y spiderfoot || pip3 install --user spiderfoot

echo "📦 Installation recon-ng..."
sudo apt install -y recon-ng || pip3 install --user recon-ng

echo "🐍 Installation outils Python manquants..."
pip3 install --user holehe maigret phoneinfoga ghunt sn0int twint

echo "✅ Installation terminée!"
echo "🔍 Vérification des installations..."

for tool in sublist3r subfinder spiderfoot recon-ng; do
    if command -v $tool &> /dev/null; then
        echo "✅ $tool: INSTALLÉ"
    else
        echo "❌ $tool: ÉCHEC"
    fi
done