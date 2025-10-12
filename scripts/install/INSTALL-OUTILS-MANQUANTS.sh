#!/bin/bash

# 🚀 INSTALLATION OUTILS OSINT MANQUANTS - SOLUTION VENV
echo "🚀 Installation des outils OSINT manquants..."

# Utiliser le venv existant
source venv-osint/bin/activate

# Email Tools
echo "📧 Installation outils Email..."
pip install h8mail emailrep ghunt

# Phone Tools
echo "📱 Installation outils Phone..."
pip install phonenumbers

# Social Media
echo "👤 Installation outils Social Media..."
pip install socialscan

# Breach/Leak
echo "💥 Installation outils Breach/Leak..."
pip install bbot

# Crypto
echo "₿ Installation outils Crypto..."
pip install btcrecover

# Outils système (avec sudo)
echo "🔧 Installation outils système..."
sudo apt update
sudo apt install -y masscan binwalk

# PhoneInfoga (version alternative)
echo "📱 Installation PhoneInfoga..."
wget https://github.com/sundowndev/phoneinfoga/releases/download/v2.11.0/phoneinfoga_Linux_x86_64.tar.gz
tar -xzf phoneinfoga_Linux_x86_64.tar.gz
sudo mv phoneinfoga /usr/local/bin/
rm phoneinfoga_Linux_x86_64.tar.gz

echo "✅ Installation terminée!"
echo "🔍 Relancer l'audit: ./AUDIT-OUTILS-MANQUANTS.sh"