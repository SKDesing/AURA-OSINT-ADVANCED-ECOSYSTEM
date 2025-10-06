#!/bin/bash
# AURA Chromium Installation Script

set -euo pipefail

echo "🔧 AURA - Installation Chromium"
echo "==============================="

# Détecter l'OS
OS=$(uname -s)
DISTRO=""

if [[ "$OS" == "Linux" ]]; then
    if command -v lsb_release &> /dev/null; then
        DISTRO=$(lsb_release -si)
    elif [[ -f /etc/os-release ]]; then
        DISTRO=$(grep '^ID=' /etc/os-release | cut -d'=' -f2 | tr -d '"')
    fi
fi

echo "📋 Système détecté: $OS ($DISTRO)"

# Fonction d'installation selon l'OS
install_chromium() {
    case "$OS" in
        "Linux")
            case "$DISTRO" in
                "Ubuntu"|"Debian"|"ubuntu"|"debian")
                    echo "📦 Installation Chromium (Ubuntu/Debian)..."
                    sudo apt update
                    sudo apt install -y chromium-browser
                    ;;
                "CentOS"|"RedHat"|"Fedora"|"centos"|"redhat"|"fedora")
                    echo "📦 Installation Chromium (CentOS/RedHat/Fedora)..."
                    if command -v dnf &> /dev/null; then
                        sudo dnf install -y chromium
                    else
                        sudo yum install -y chromium
                    fi
                    ;;
                "Arch"|"arch")
                    echo "📦 Installation Chromium (Arch Linux)..."
                    sudo pacman -S --noconfirm chromium
                    ;;
                *)
                    echo "⚠️  Distribution non reconnue, tentative d'installation générique..."
                    if command -v apt &> /dev/null; then
                        sudo apt update && sudo apt install -y chromium-browser
                    elif command -v dnf &> /dev/null; then
                        sudo dnf install -y chromium
                    elif command -v yum &> /dev/null; then
                        sudo yum install -y chromium
                    elif command -v pacman &> /dev/null; then
                        sudo pacman -S --noconfirm chromium
                    else
                        echo "❌ Gestionnaire de paquets non supporté"
                        exit 1
                    fi
                    ;;
            esac
            ;;
        "Darwin")
            echo "📦 Installation Chromium (macOS)..."
            if command -v brew &> /dev/null; then
                brew install --cask chromium
            else
                echo "❌ Homebrew requis pour macOS. Installez-le d'abord:"
                echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        *)
            echo "❌ Système d'exploitation non supporté: $OS"
            exit 1
            ;;
    esac
}

# Vérifier si Chromium est déjà installé
check_chromium() {
    local chromium_paths=(
        "/usr/bin/chromium-browser"
        "/usr/bin/chromium"
        "/usr/bin/google-chrome"
        "/usr/bin/google-chrome-stable"
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        "/Applications/Chromium.app/Contents/MacOS/Chromium"
    )
    
    for path in "${chromium_paths[@]}"; do
        if [[ -f "$path" ]]; then
            echo "✅ Chromium trouvé: $path"
            return 0
        fi
    done
    
    return 1
}

# Installation principale
main() {
    echo "🔍 Vérification de Chromium..."
    
    if check_chromium; then
        echo "✅ Chromium déjà installé"
        
        # Demander si on veut réinstaller
        read -p "🔄 Voulez-vous réinstaller Chromium ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "⏭️  Installation ignorée"
            exit 0
        fi
    fi
    
    echo "🚀 Installation de Chromium..."
    install_chromium
    
    echo "✅ Vérification post-installation..."
    if check_chromium; then
        echo "🎉 Chromium installé avec succès !"
        
        # Afficher la version
        if command -v chromium-browser &> /dev/null; then
            VERSION=$(chromium-browser --version 2>/dev/null || echo "Version inconnue")
            echo "📋 Version: $VERSION"
        elif command -v chromium &> /dev/null; then
            VERSION=$(chromium --version 2>/dev/null || echo "Version inconnue")
            echo "📋 Version: $VERSION"
        fi
        
        echo ""
        echo "🎯 AURA est maintenant prêt à utiliser Chromium !"
        echo "🔧 Utilisez 'node chromium-launcher.js' pour tester"
        
    else
        echo "❌ Échec de l'installation de Chromium"
        exit 1
    fi
}

# Gestion des arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Afficher cette aide"
        echo "  --check, -c    Vérifier seulement si Chromium est installé"
        echo "  --force, -f    Forcer la réinstallation"
        echo ""
        echo "Exemple:"
        echo "  $0              # Installation interactive"
        echo "  $0 --check     # Vérification uniquement"
        echo "  $0 --force     # Réinstallation forcée"
        exit 0
        ;;
    "--check"|"-c")
        if check_chromium; then
            echo "✅ Chromium est installé"
            exit 0
        else
            echo "❌ Chromium n'est pas installé"
            exit 1
        fi
        ;;
    "--force"|"-f")
        echo "🔄 Réinstallation forcée de Chromium..."
        install_chromium
        check_chromium
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "❌ Option inconnue: $1"
        echo "Utilisez --help pour voir les options disponibles"
        exit 1
        ;;
esac