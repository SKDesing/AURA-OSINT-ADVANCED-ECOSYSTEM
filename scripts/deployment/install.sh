#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🎯 TIKTOK LIVE ANALYSER                   ║"
echo "║                   Installation Automatique                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
print_status "Vérification des prérequis..."

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js trouvé: $NODE_VERSION"
else
    print_error "Node.js non trouvé. Installation requise."
    print_status "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm trouvé: $NPM_VERSION"
else
    print_error "npm non trouvé"
    exit 1
fi

# PostgreSQL
if command -v psql &> /dev/null; then
    print_success "PostgreSQL trouvé"
else
    print_warning "PostgreSQL non trouvé. Installation..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Brave Browser
if command -v brave-browser &> /dev/null; then
    print_success "Brave Browser trouvé"
elif [ -f "/snap/bin/brave" ]; then
    print_success "Brave Browser trouvé (snap)"
else
    print_warning "Brave Browser non trouvé. Installation recommandée."
    print_status "Installation de Brave Browser..."
    sudo apt install -y curl
    sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main"|sudo tee /etc/apt/sources.list.d/brave-browser-release.list
    sudo apt update
    sudo apt install -y brave-browser
fi

# Installation des dépendances
print_status "Installation des dépendances du projet principal..."
npm install

print_status "Installation des dépendances du backend..."
cd live-tracker
npm install
cd ..

print_status "Installation des dépendances du frontend..."
cd frontend-react
npm install
cd ..

# Configuration de la base de données
print_status "Configuration de la base de données..."

# Créer l'utilisateur et la base de données PostgreSQL
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'Mohand/06';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE live_tracker OWNER postgres;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE live_tracker TO postgres;" 2>/dev/null || true

# Importer le schéma de base de données
if [ -f "live-tracker/database-forensic-complete.sql" ]; then
    print_status "Import du schéma de base de données..."
    sudo -u postgres psql -d live_tracker -f live-tracker/database-forensic-complete.sql
    print_success "Schéma de base de données importé"
else
    print_warning "Fichier de schéma non trouvé"
fi

# Création des dossiers nécessaires
print_status "Création des dossiers de travail..."
mkdir -p evidence/{profiles,screenshots,raw,reports}
mkdir -p logs

# Permissions
chmod +x start-live-tracker.sh 2>/dev/null || true
chmod +x install.sh

# Test de connectivité
print_status "Test de connectivité à la base de données..."
if sudo -u postgres psql -d live_tracker -c "SELECT 1;" &> /dev/null; then
    print_success "Connexion à la base de données OK"
else
    print_error "Problème de connexion à la base de données"
fi

# Installation terminée
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ INSTALLATION TERMINÉE                  ║"
echo "║                                                              ║"
echo "║  Pour démarrer l'application:                                ║"
echo "║  npm start                                                   ║"
echo "║                                                              ║"
echo "║  Ou utilisez le script:                                      ║"
echo "║  ./start-live-tracker.sh                                     ║"
echo "║                                                              ║"
echo "║  🌐 Interface: http://localhost:3000                         ║"
echo "║  🔧 API: http://localhost:4000                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

print_success "Installation complète!"
print_status "Vous pouvez maintenant démarrer l'application avec: npm start"