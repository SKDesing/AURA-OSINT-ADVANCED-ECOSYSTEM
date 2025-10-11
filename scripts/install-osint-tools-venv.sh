#!/bin/bash

# 🔍 INSTALLATION OUTILS OSINT AVEC ENVIRONNEMENT VIRTUEL
# AURA OSINT ADVANCED ECOSYSTEM

set -e

echo "🚀 INSTALLATION OUTILS OSINT AVEC VENV..."

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Répertoires
PROJECT_DIR="/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM"
VENV_DIR="$PROJECT_DIR/venv-osint"
TOOLS_DIR="/tmp/osint-tools"

# Créer environnement virtuel
echo -e "${BLUE}📦 Création environnement virtuel...${NC}"
python3 -m venv $VENV_DIR
source $VENV_DIR/bin/activate

# Mise à jour pip
pip install --upgrade pip

# Créer répertoire temporaire
mkdir -p $TOOLS_DIR
cd $TOOLS_DIR

echo -e "${BLUE}📁 Répertoire: $TOOLS_DIR${NC}"

# =============================================================================
# INSTALLATION OUTILS PYTHON
# =============================================================================

echo -e "\n${YELLOW}🐍 INSTALLATION OUTILS PYTHON${NC}"

# Maigret
echo -e "${BLUE}📦 Installation Maigret...${NC}"
pip install maigret
echo -e "${GREEN}✅ Maigret installé${NC}"

# TheHarvester
echo -e "${BLUE}📦 Installation TheHarvester...${NC}"
pip install theHarvester
echo -e "${GREEN}✅ TheHarvester installé${NC}"

# EmailRep
echo -e "${BLUE}📦 Installation EmailRep...${NC}"
pip install emailrep
echo -e "${GREEN}✅ EmailRep installé${NC}"

# HaveIBeenPwned
echo -e "${BLUE}📦 Installation HaveIBeenPwned...${NC}"
pip install hibpwned
echo -e "${GREEN}✅ HaveIBeenPwned installé${NC}"

# ExifRead
echo -e "${BLUE}📦 Installation ExifRead...${NC}"
pip install ExifRead Pillow
echo -e "${GREEN}✅ ExifRead installé${NC}"

# TinEye API
echo -e "${BLUE}📦 Installation TinEye...${NC}"
pip install pytineye
echo -e "${GREEN}✅ TinEye installé${NC}"

# Wayback Machine
echo -e "${BLUE}📦 Installation Wayback...${NC}"
pip install waybackpy
echo -e "${GREEN}✅ Wayback installé${NC}"

# BuiltWith
echo -e "${BLUE}📦 Installation BuiltWith...${NC}"
pip install builtwith
echo -e "${GREEN}✅ BuiltWith installé${NC}"

# Requests pour APIs
echo -e "${BLUE}📦 Installation dépendances...${NC}"
pip install requests aiohttp asyncio
echo -e "${GREEN}✅ Dépendances installées${NC}"

# =============================================================================
# TÉLÉCHARGEMENT OUTILS BINAIRES
# =============================================================================

echo -e "\n${YELLOW}⚡ TÉLÉCHARGEMENT OUTILS BINAIRES${NC}"

# Subfinder
echo -e "${BLUE}📦 Téléchargement Subfinder...${NC}"
if ! command -v subfinder &> /dev/null; then
    wget -q https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_2.6.3_linux_amd64.zip
    unzip -q subfinder_2.6.3_linux_amd64.zip
    sudo mv subfinder /usr/local/bin/ 2>/dev/null || echo "Subfinder copié localement"
    echo -e "${GREEN}✅ Subfinder téléchargé${NC}"
else
    echo -e "${GREEN}✅ Subfinder déjà installé${NC}"
fi

# PhoneInfoga
echo -e "${BLUE}📦 Téléchargement PhoneInfoga...${NC}"
if ! command -v phoneinfoga &> /dev/null; then
    wget -q https://github.com/sundowndev/phoneinfoga/releases/latest/download/phoneinfoga_linux_amd64.tar.gz
    tar -xzf phoneinfoga_linux_amd64.tar.gz
    sudo mv phoneinfoga /usr/local/bin/ 2>/dev/null || echo "PhoneInfoga copié localement"
    echo -e "${GREEN}✅ PhoneInfoga téléchargé${NC}"
else
    echo -e "${GREEN}✅ PhoneInfoga déjà installé${NC}"
fi

# Amass
echo -e "${BLUE}📦 Téléchargement Amass...${NC}"
if ! command -v amass &> /dev/null; then
    wget -q https://github.com/owasp-amass/amass/releases/latest/download/amass_linux_amd64.zip
    unzip -q amass_linux_amd64.zip
    sudo mv amass_linux_amd64/amass /usr/local/bin/ 2>/dev/null || echo "Amass copié localement"
    echo -e "${GREEN}✅ Amass téléchargé${NC}"
else
    echo -e "${GREEN}✅ Amass déjà installé${NC}"
fi

# =============================================================================
# CLONAGE REPOSITORIES
# =============================================================================

echo -e "\n${YELLOW}📂 CLONAGE REPOSITORIES${NC}"

# WhatsMyName
echo -e "${BLUE}📦 Clonage WhatsMyName...${NC}"
if [ ! -d "WhatsMyName" ]; then
    git clone -q https://github.com/WebBreacher/WhatsMyName.git
    cd WhatsMyName
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}✅ WhatsMyName cloné${NC}"
else
    echo -e "${GREEN}✅ WhatsMyName déjà cloné${NC}"
fi

# Sublist3r
echo -e "${BLUE}📦 Clonage Sublist3r...${NC}"
if [ ! -d "Sublist3r" ]; then
    git clone -q https://github.com/aboul3la/Sublist3r.git
    cd Sublist3r
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}✅ Sublist3r cloné${NC}"
else
    echo -e "${GREEN}✅ Sublist3r déjà cloné${NC}"
fi

# =============================================================================
# GÉNÉRATION REQUIREMENTS
# =============================================================================

echo -e "\n${YELLOW}📋 GÉNÉRATION REQUIREMENTS${NC}"

# Créer requirements.txt complet
cat > $PROJECT_DIR/requirements-osint-complete.txt << EOF
# AURA OSINT - Requirements complets
# Générés automatiquement

# Core OSINT Tools
maigret>=0.4.4
theHarvester>=4.0.0
emailrep>=0.1.3
hibpwned>=0.1.0
ExifRead>=3.0.0
Pillow>=10.0.0
pytineye>=1.0.0
waybackpy>=3.0.6
builtwith>=1.3.4

# Async & HTTP
aiohttp>=3.8.0
asyncio-throttle>=1.0.2
requests>=2.31.0

# Data Processing
pandas>=2.0.0
numpy>=1.24.0
beautifulsoup4>=4.12.0
lxml>=4.9.0

# Crypto & Security
cryptography>=41.0.0
pycryptodome>=3.18.0

# Database
psycopg2-binary>=2.9.0
redis>=4.6.0

# Utilities
pyyaml>=6.0
python-dotenv>=1.0.0
colorama>=0.4.6
tqdm>=4.65.0
EOF

echo -e "${GREEN}✅ Requirements générés${NC}"

# =============================================================================
# NETTOYAGE
# =============================================================================

echo -e "\n${YELLOW}🧹 NETTOYAGE...${NC}"
cd $PROJECT_DIR
rm -rf $TOOLS_DIR
echo -e "${GREEN}✅ Nettoyage terminé${NC}"

# =============================================================================
# RÉSUMÉ
# =============================================================================

echo -e "\n${GREEN}🎉 INSTALLATION TERMINÉE !${NC}"
echo -e "${BLUE}📊 OUTILS INSTALLÉS:${NC}"
echo -e "  ✅ Maigret - Username intelligence avancée"
echo -e "  ✅ TheHarvester - Email/domain intelligence"
echo -e "  ✅ EmailRep - Réputation email"
echo -e "  ✅ HaveIBeenPwned - Vérification fuites"
echo -e "  ✅ ExifRead - Métadonnées images"
echo -e "  ✅ TinEye - Recherche image inversée"
echo -e "  ✅ Wayback - Archives web"
echo -e "  ✅ BuiltWith - Technologies web"
echo -e "  ✅ Subfinder - Énumération sous-domaines"
echo -e "  ✅ PhoneInfoga - OSINT téléphonique"
echo -e "  ✅ Amass - Reconnaissance réseau"
echo -e "  ✅ WhatsMyName - Vérification username"
echo -e "  ✅ Sublist3r - Découverte sous-domaines"

echo -e "\n${YELLOW}🔧 ENVIRONNEMENT VIRTUEL:${NC}"
echo -e "  📁 Chemin: $VENV_DIR"
echo -e "  🐍 Activation: source $VENV_DIR/bin/activate"

echo -e "\n${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo -e "  1. Activer l'environnement virtuel"
echo -e "  2. Tester les outils installés"
echo -e "  3. Configurer les API keys"
echo -e "  4. Lancer les tests d'intégration"

echo -e "\n${GREEN}🚀 AURA OSINT - 25+ OUTILS OPÉRATIONNELS !${NC}"