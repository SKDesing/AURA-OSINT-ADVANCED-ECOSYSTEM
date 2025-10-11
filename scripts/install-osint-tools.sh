#!/bin/bash

# 🔧 INSTALLATION OUTILS OSINT MANQUANTS - AURA ECOSYSTEM
# Auteur: AURA OSINT Team
# Version: 1.0

set -e

echo "🚀 Installation des outils OSINT manquants..."

# Créer les répertoires
mkdir -p /opt/osint-tools
cd /opt/osint-tools

# Phase 1: Username Intelligence
echo "📋 Phase 1: Username Intelligence Tools"

# Sherlock
echo "🔍 Installation Sherlock..."
git clone https://github.com/sherlock-project/sherlock.git
cd sherlock
python3 -m pip install -r requirements.txt
cd ..

# Maigret
echo "🔍 Installation Maigret..."
git clone https://github.com/soxoj/maigret.git
cd maigret
python3 -m pip install .
cd ..

# WhatsMyName
echo "🔍 Installation WhatsMyName..."
git clone https://github.com/WebBreacher/WhatsMyName.git

# Phase 2: Domain Intelligence
echo "📋 Phase 2: Domain Intelligence Tools"

# Subfinder
echo "🌐 Installation Subfinder..."
wget https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_2.6.3_linux_amd64.zip
unzip subfinder_2.6.3_linux_amd64.zip
sudo mv subfinder /usr/local/bin/
rm subfinder_2.6.3_linux_amd64.zip

# Sublist3r
echo "🌐 Installation Sublist3r..."
git clone https://github.com/aboul3la/Sublist3r.git
cd Sublist3r
python3 -m pip install -r requirements.txt
cd ..

# TheHarvester
echo "🌐 Installation TheHarvester..."
git clone https://github.com/laramies/theHarvester.git
cd theHarvester
python3 -m pip install -r requirements/base.txt
cd ..

# Amass
echo "🌐 Installation Amass..."
wget https://github.com/owasp-amass/amass/releases/latest/download/amass_linux_amd64.zip
unzip amass_linux_amd64.zip
sudo mv amass_linux_amd64/amass /usr/local/bin/
rm -rf amass_linux_amd64*

# Phase 3: Specialized Tools
echo "📋 Phase 3: Specialized Tools"

# PhoneInfoga
echo "📱 Installation PhoneInfoga..."
wget https://github.com/sundowndev/phoneinfoga/releases/latest/download/phoneinfoga_linux_amd64.tar.gz
tar -xzf phoneinfoga_linux_amd64.tar.gz
sudo mv phoneinfoga /usr/local/bin/
rm phoneinfoga_linux_amd64.tar.gz

# ExifRead
echo "🖼️ Installation ExifRead..."
python3 -m pip install ExifRead

# Autres dépendances Python
echo "📦 Installation dépendances Python..."
python3 -m pip install requests beautifulsoup4 lxml dnspython

echo "✅ Installation terminée!"
echo "📍 Outils installés dans: /opt/osint-tools"
echo "📍 Binaires dans: /usr/local/bin"