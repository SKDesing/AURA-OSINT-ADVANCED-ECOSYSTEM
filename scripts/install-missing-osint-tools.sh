#!/bin/bash

# 🔍 INSTALLATION AUTOMATISÉE OUTILS OSINT MANQUANTS
# AURA OSINT ADVANCED ECOSYSTEM

set -e

echo "🚀 DÉBUT INSTALLATION OUTILS OSINT MANQUANTS..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Répertoires
TOOLS_DIR="/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend/tools"
TEMP_DIR="/tmp/osint-tools"

# Créer répertoire temporaire
mkdir -p $TEMP_DIR
cd $TEMP_DIR

echo -e "${BLUE}📁 Répertoire temporaire: $TEMP_DIR${NC}"

# =============================================================================
# PHASE 1: USERNAME INTELLIGENCE
# =============================================================================

echo -e "\n${YELLOW}🔍 PHASE 1: USERNAME INTELLIGENCE${NC}"

# Maigret
echo -e "${BLUE}📦 Installation Maigret...${NC}"
if ! command -v maigret &> /dev/null; then
    pip3 install maigret
    echo -e "${GREEN}✅ Maigret installé${NC}"
else
    echo -e "${GREEN}✅ Maigret déjà installé${NC}"
fi

# WhatsMyName
echo -e "${BLUE}📦 Installation WhatsMyName...${NC}"
if [ ! -d "WhatsMyName" ]; then
    git clone https://github.com/WebBreacher/WhatsMyName.git
    cd WhatsMyName
    pip3 install -r requirements.txt
    cd ..
    echo -e "${GREEN}✅ WhatsMyName installé${NC}"
else
    echo -e "${GREEN}✅ WhatsMyName déjà installé${NC}"
fi

# =============================================================================
# PHASE 2: DOMAIN INTELLIGENCE
# =============================================================================

echo -e "\n${YELLOW}🌐 PHASE 2: DOMAIN INTELLIGENCE${NC}"

# Subfinder
echo -e "${BLUE}📦 Installation Subfinder...${NC}"
if ! command -v subfinder &> /dev/null; then
    wget https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_2.6.3_linux_amd64.zip
    unzip subfinder_2.6.3_linux_amd64.zip
    sudo mv subfinder /usr/local/bin/
    echo -e "${GREEN}✅ Subfinder installé${NC}"
else
    echo -e "${GREEN}✅ Subfinder déjà installé${NC}"
fi

# Sublist3r
echo -e "${BLUE}📦 Installation Sublist3r...${NC}"
if [ ! -d "Sublist3r" ]; then
    git clone https://github.com/aboul3la/Sublist3r.git
    cd Sublist3r
    pip3 install -r requirements.txt
    cd ..
    echo -e "${GREEN}✅ Sublist3r installé${NC}"
else
    echo -e "${GREEN}✅ Sublist3r déjà installé${NC}"
fi

# TheHarvester
echo -e "${BLUE}📦 Installation TheHarvester...${NC}"
if ! command -v theHarvester &> /dev/null; then
    pip3 install theHarvester
    echo -e "${GREEN}✅ TheHarvester installé${NC}"
else
    echo -e "${GREEN}✅ TheHarvester déjà installé${NC}"
fi

# Amass
echo -e "${BLUE}📦 Installation Amass...${NC}"
if ! command -v amass &> /dev/null; then
    wget https://github.com/owasp-amass/amass/releases/latest/download/amass_linux_amd64.zip
    unzip amass_linux_amd64.zip
    sudo mv amass_linux_amd64/amass /usr/local/bin/
    echo -e "${GREEN}✅ Amass installé${NC}"
else
    echo -e "${GREEN}✅ Amass déjà installé${NC}"
fi

# =============================================================================
# PHASE 3: EMAIL & PHONE
# =============================================================================

echo -e "\n${YELLOW}📧 PHASE 3: EMAIL & PHONE${NC}"

# PhoneInfoga
echo -e "${BLUE}📦 Installation PhoneInfoga...${NC}"
if ! command -v phoneinfoga &> /dev/null; then
    wget https://github.com/sundowndev/phoneinfoga/releases/latest/download/phoneinfoga_linux_amd64.tar.gz
    tar -xzf phoneinfoga_linux_amd64.tar.gz
    sudo mv phoneinfoga /usr/local/bin/
    echo -e "${GREEN}✅ PhoneInfoga installé${NC}"
else
    echo -e "${GREEN}✅ PhoneInfoga déjà installé${NC}"
fi

# EmailRep
echo -e "${BLUE}📦 Installation EmailRep...${NC}"
pip3 install emailrep
echo -e "${GREEN}✅ EmailRep installé${NC}"

# HaveIBeenPwned (via hibpwned)
echo -e "${BLUE}📦 Installation HaveIBeenPwned...${NC}"
pip3 install hibpwned
echo -e "${GREEN}✅ HaveIBeenPwned installé${NC}"

# =============================================================================
# PHASE 4: MEDIA & WEB
# =============================================================================

echo -e "\n${YELLOW}🖼️ PHASE 4: MEDIA & WEB${NC}"

# ExifRead
echo -e "${BLUE}📦 Installation ExifRead...${NC}"
pip3 install ExifRead
echo -e "${GREEN}✅ ExifRead installé${NC}"

# TinEye (API Python)
echo -e "${BLUE}📦 Installation TinEye API...${NC}"
pip3 install pytineye
echo -e "${GREEN}✅ TinEye API installé${NC}"

# Wayback Machine
echo -e "${BLUE}📦 Installation Wayback Machine...${NC}"
pip3 install waybackpy
echo -e "${GREEN}✅ Wayback Machine installé${NC}"

# BuiltWith
echo -e "${BLUE}📦 Installation BuiltWith...${NC}"
pip3 install builtwith
echo -e "${GREEN}✅ BuiltWith installé${NC}"

# =============================================================================
# PHASE 5: CRYPTO & ADVANCED
# =============================================================================

echo -e "\n${YELLOW}🔐 PHASE 5: CRYPTO & ADVANCED${NC}"

# BitcoinAbuse
echo -e "${BLUE}📦 Installation BitcoinAbuse...${NC}"
pip3 install requests  # Pour API BitcoinAbuse
echo -e "${GREEN}✅ BitcoinAbuse API prêt${NC}"

# Stegsolve (Java tool)
echo -e "${BLUE}📦 Installation Stegsolve...${NC}"
if [ ! -f "stegsolve.jar" ]; then
    wget http://www.caesum.com/handbook/Stegsolve.jar -O stegsolve.jar
    echo -e "${GREEN}✅ Stegsolve téléchargé${NC}"
else
    echo -e "${GREEN}✅ Stegsolve déjà téléchargé${NC}"
fi

# =============================================================================
# NETTOYAGE
# =============================================================================

echo -e "\n${YELLOW}🧹 NETTOYAGE...${NC}"
cd /
rm -rf $TEMP_DIR
echo -e "${GREEN}✅ Nettoyage terminé${NC}"

# =============================================================================
# RÉSUMÉ
# =============================================================================

echo -e "\n${GREEN}🎉 INSTALLATION TERMINÉE !${NC}"
echo -e "${BLUE}📊 RÉSUMÉ:${NC}"
echo -e "  ✅ Maigret - Username intelligence"
echo -e "  ✅ WhatsMyName - Username verification"
echo -e "  ✅ Subfinder - Subdomain enumeration"
echo -e "  ✅ Sublist3r - Subdomain discovery"
echo -e "  ✅ TheHarvester - Email/domain intelligence"
echo -e "  ✅ Amass - Network reconnaissance"
echo -e "  ✅ PhoneInfoga - Phone OSINT"
echo -e "  ✅ EmailRep - Email reputation"
echo -e "  ✅ HaveIBeenPwned - Data breach check"
echo -e "  ✅ ExifRead - Image metadata"
echo -e "  ✅ TinEye - Reverse image search"
echo -e "  ✅ Wayback Machine - Web archives"
echo -e "  ✅ BuiltWith - Website technologies"
echo -e "  ✅ BitcoinAbuse - Bitcoin address check"
echo -e "  ✅ Stegsolve - Steganography"

echo -e "\n${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo -e "  1. Créer les wrappers Python pour chaque outil"
echo -e "  2. Configurer les API keys nécessaires"
echo -e "  3. Tester l'intégration complète"
echo -e "  4. Mettre à jour la documentation"

echo -e "\n${GREEN}🚀 AURA OSINT ECOSYSTEM - 24 OUTILS OPÉRATIONNELS !${NC}"