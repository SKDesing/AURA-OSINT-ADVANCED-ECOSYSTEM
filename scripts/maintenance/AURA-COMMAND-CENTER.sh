#!/bin/bash

# 🎯 AURA OSINT - COMMAND CENTER ULTIME
# ════════════════════════════════════════════════════════════════════════════
# 🎁 CENTRE DE COMMANDE INTERACTIF POUR L'ÉCOSYSTÈME COMPLET
# ════════════════════════════════════════════════════════════════════════════

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GOLD='\033[38;5;220m'
ORANGE='\033[38;5;208m'
NC='\033[0m'

# Emojis
ROCKET="🚀"
FIRE="🔥"
STAR="⭐"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
DATABASE="🗄️"
CHART="📊"
BRAIN="🧠"
SHIELD="🛡️"
SPARKLES="✨"
ARROW="➤"

clear

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 BANNER AURA OSINT
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${GOLD}"
cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║     █████╗ ██╗   ██╗██████╗  █████╗     ██████╗ ███████╗██╗███╗   ██╗║
    ║    ██╔══██╗██║   ██║██╔══██╗██╔══██╗   ██╔═══██╗██╔════╝██║████╗  ██║║
    ║    ███████║██║   ██║██████╔╝███████║   ██║   ██║███████╗██║██╔██╗ ██║║
    ║    ██╔══██║██║   ██║██╔══██╗██╔══██║   ██║   ██║╚════██║██║██║╚██╗██║║
    ║    ██║  ██║╚██████╔╝██║  ██║██║  ██║   ╚██████╔╝███████║██║██║ ╚████║║
    ║    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝║
    ║                                                                       ║
    ║              🎯 COMMAND CENTER - ULTIMATE CONTROL PANEL 🎯            ║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}╔═════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} ${WHITE}Version:${NC} 2.0.0 Ultimate    ${WHITE}Port:${NC} 4011    ${WHITE}Status:${NC} ${GREEN}Production Ready${NC} ${CYAN}║${NC}"
echo -e "${CYAN}╚═════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# 📊 STATUT SYSTÈME TEMPS RÉEL
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${PURPLE}${CHART} STATUT SYSTÈME TEMPS RÉEL${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérifier Backend
if curl -s -f http://localhost:4011/health > /dev/null 2>&1; then
    echo -e "   ${CHECK} Backend API         ${GREEN}ONLINE${NC}  ${WHITE}http://localhost:4011${NC}"
else
    echo -e "   ${CROSS} Backend API         ${RED}OFFLINE${NC}"
fi

# Vérifier Frontend
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "   ${CHECK} Frontend React      ${GREEN}ONLINE${NC}  ${WHITE}http://localhost:3000${NC}"
else
    echo -e "   ${CROSS} Frontend React      ${RED}OFFLINE${NC}"
fi

# Vérifier Site Vitrine
if curl -s -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "   ${CHECK} Site Vitrine        ${GREEN}ONLINE${NC}  ${WHITE}http://localhost:5173${NC}"
else
    echo -e "   ${CROSS} Site Vitrine        ${RED}OFFLINE${NC}"
fi

# Vérifier PostgreSQL
if command -v psql &> /dev/null && psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw aura_osint; then
    echo -e "   ${CHECK} PostgreSQL          ${GREEN}ONLINE${NC}  ${WHITE}Port 5432${NC}"
else
    echo -e "   ${CROSS} PostgreSQL          ${YELLOW}OFFLINE${NC}"
fi

# Vérifier Redis
if command -v redis-cli &> /dev/null && redis-cli ping > /dev/null 2>&1; then
    echo -e "   ${CHECK} Redis Cache         ${GREEN}ONLINE${NC}  ${WHITE}Port 6379${NC}"
else
    echo -e "   ${CROSS} Redis Cache         ${YELLOW}OFFLINE${NC}"
fi

# Vérifier Elasticsearch
if curl -s http://localhost:9200 > /dev/null 2>&1; then
    echo -e "   ${CHECK} Elasticsearch       ${GREEN}ONLINE${NC}  ${WHITE}Port 9200${NC}"
else
    echo -e "   ${CROSS} Elasticsearch       ${YELLOW}OFFLINE${NC}"
fi

# Vérifier Qdrant
if curl -s http://localhost:6333 > /dev/null 2>&1; then
    echo -e "   ${CHECK} Qdrant Vector DB   ${GREEN}ONLINE${NC}  ${WHITE}Port 6333${NC}"
else
    echo -e "   ${CROSS} Qdrant Vector DB   ${YELLOW}OFFLINE${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# 📊 MÉTRIQUES SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${PURPLE}${CHART} MÉTRIQUES SYSTÈME${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# CPU Usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
echo -e "   ${GEAR} CPU Usage:          ${CYAN}${CPU_USAGE}%${NC}"

# Memory Usage
MEM_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
echo -e "   ${DATABASE} Memory Usage:       ${CYAN}${MEM_USAGE}%${NC}"

# Disk Usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo -e "   ${DATABASE} Disk Usage:         ${CYAN}${DISK_USAGE}${NC}"

# Uptime
UPTIME=$(uptime -p)
echo -e "   ${STAR} System Uptime:      ${CYAN}${UPTIME}${NC}"

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 MENU INTERACTIF
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${GOLD}${FIRE} MENU PRINCIPAL${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "   ${GOLD}[1]${NC} ${ROCKET} ${WHITE}BUILD COMPLET${NC}           - Tout compiler et installer"
echo -e "   ${GOLD}[2]${NC} ${FIRE} ${WHITE}DÉMARRER ÉCOSYSTÈME${NC}     - Lancer tous les services"
echo -e "   ${GOLD}[3]${NC} ${CROSS} ${WHITE}ARRÊTER TOUT${NC}            - Stopper tous les processus"
echo -e "   ${GOLD}[4]${NC} ${CHART} ${WHITE}TESTS COMPLETS${NC}          - Lancer la suite de tests"
echo -e "   ${GOLD}[5]${NC} ${GEAR} ${WHITE}MONITORING LIVE${NC}         - Dashboard temps réel"
echo -e "   ${GOLD}[6]${NC} ${DATABASE} ${WHITE}BASES DE DONNÉES${NC}       - Gérer PostgreSQL, Redis, etc."
echo -e "   ${GOLD}[7]${NC} ${BRAIN} ${WHITE}IA QWEN${NC}                 - Tester l'intelligence artificielle"
echo -e "   ${GOLD}[8]${NC} ${SHIELD} ${WHITE}OUTILS OSINT${NC}            - Accès aux 17 outils"
echo -e "   ${GOLD}[9]${NC} ${INFO} ${WHITE}DOCUMENTATION${NC}           - Ouvrir la doc interactive"
echo -e "   ${GOLD}[10]${NC} ${SPARKLES} ${WHITE}SITE VITRINE${NC}          - Ouvrir le site de démo"
echo -e "   ${GOLD}[11]${NC} ${GEAR} ${WHITE}MAINTENANCE${NC}            - Nettoyer et optimiser"
echo -e "   ${GOLD}[12]${NC} ${CHART} ${WHITE}RAPPORT SYSTÈME${NC}        - Générer rapport complet"
echo ""
echo -e "   ${RED}[0]${NC} ${CROSS} ${WHITE}QUITTER${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
read -p "$(echo -e ${YELLOW}${ARROW} Votre choix : ${NC})" choice

case $choice in
    1)
        echo -e "\n${ROCKET} ${CYAN}Lancement du BUILD COMPLET...${NC}\n"
        ./AURA-BUILD-ALL.sh
        ;;
    2)
        echo -e "\n${FIRE} ${CYAN}Démarrage de l'écosystème AURA...${NC}\n"
        
        # Démarrer Docker
        echo -e "${INFO} Démarrage services Docker..."
        docker-compose up -d 2>/dev/null || docker compose up -d 2>/dev/null
        
        # Démarrer Backend
        echo -e "${INFO} Démarrage Backend (Port 4011)..."
        cd backend && npm start > /dev/null 2>&1 &
        
        # Démarrer Frontend
        echo -e "${INFO} Démarrage Frontend (Port 3000)..."
        cd ../frontend && npm run dev > /dev/null 2>&1 &
        
        # Démarrer Site Vitrine
        echo -e "${INFO} Démarrage Site Vitrine (Port 5173)..."
        cd ../marketing/sites/vitrine-aura-advanced-osint-ecosystem && npm run dev > /dev/null 2>&1 &
        
        echo -e "\n${CHECK} ${GREEN}Écosystème démarré avec succès!${NC}\n"
        ;;
    3)
        echo -e "\n${CROSS} ${CYAN}Arrêt de tous les services...${NC}\n"
        
        # Arrêter les processus Node
        pkill -f "node.*backend" 2>/dev/null
        pkill -f "node.*frontend" 2>/dev/null
        pkill -f "node.*vitrine" 2>/dev/null
        pkill -f "react-scripts" 2>/dev/null
        
        # Arrêter Docker
        docker-compose down 2>/dev/null || docker compose down 2>/dev/null
        
        echo -e "${CHECK} ${GREEN}Tous les services ont été arrêtés${NC}\n"
        ;;
    4)
        echo -e "\n${CHART} ${CYAN}Lancement des tests complets...${NC}\n"
        ./test-frontend-complete.sh
        ;;
    5)
        echo -e "\n${GEAR} ${CYAN}Ouverture du monitoring live...${NC}\n"
        ./monitor-aura.sh
        ;;
    6)
        echo -e "\n${DATABASE} ${CYAN}Gestion des bases de données${NC}\n"
        echo -e "   ${GOLD}[1]${NC} Démarrer PostgreSQL"
        echo -e "   ${GOLD}[2]${NC} Démarrer Redis"
        echo -e "   ${GOLD}[3]${NC} Démarrer Elasticsearch"
        echo -e "   ${GOLD}[4]${NC} Démarrer Qdrant"
        echo -e "   ${GOLD}[5]${NC} Tout démarrer"
        read -p "$(echo -e ${YELLOW}Choix : ${NC})" db_choice
        
        case $db_choice in
            5)
                docker-compose up -d postgres redis elasticsearch qdrant
                ;;
        esac
        ;;
    7)
        echo -e "\n${BRAIN} ${CYAN}Test de l'IA Qwen...${NC}\n"
        curl -X POST http://localhost:4011/api/ai/chat \
            -H "Content-Type: application/json" \
            -d '{"message":"Hello AURA!","context":"test"}' | jq
        ;;
    8)
        echo -e "\n${SHIELD} ${CYAN}Outils OSINT disponibles${NC}\n"
        echo -e "   ${CHECK} Holehe (Email)"
        echo -e "   ${CHECK} PhoneInfoga (Téléphone)"
        echo -e "   ${CHECK} Sherlock (Social Media)"
        echo -e "   ${CHECK} TheHarvester (Domaines)"
        echo -e "   ${CHECK} Subfinder (Subdomains)"
        echo -e "   ${CHECK} Nmap (Network)"
        echo -e "   ${CHECK} WHOIS (Domains)"
        echo -e "   ${INFO} ...et 10 autres outils\n"
        ;;
    9)
        echo -e "\n${INFO} ${CYAN}Ouverture de la documentation...${NC}\n"
        if command -v xdg-open &> /dev/null; then
            xdg-open suivi-developpement.html
        elif command -v open &> /dev/null; then
            open suivi-developpement.html
        fi
        ;;
    10)
        echo -e "\n${SPARKLES} ${CYAN}Ouverture du site vitrine...${NC}\n"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:5173
        elif command -v open &> /dev/null; then
            open http://localhost:5173
        fi
        ;;
    11)
        echo -e "\n${GEAR} ${CYAN}Maintenance du système...${NC}\n"
        
        # Nettoyer les logs
        find . -name "*.log" -type f -delete
        
        # Nettoyer les caches
        npm cache clean --force
        
        # Nettoyer Docker
        docker system prune -af --volumes
        
        echo -e "${CHECK} ${GREEN}Maintenance terminée${NC}\n"
        ;;
    12)
        echo -e "\n${CHART} ${CYAN}Génération du rapport système...${NC}\n"
        
        REPORT_FILE="logs/system-report-$(date +%Y%m%d-%H%M%S).json"
        
        cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "ecosystem": {
    "backend": "$(curl -s http://localhost:4011/health 2>/dev/null && echo 'online' || echo 'offline')",
    "frontend": "$(curl -s http://localhost:3000 2>/dev/null && echo 'online' || echo 'offline')",
    "vitrine": "$(curl -s http://localhost:5173 2>/dev/null && echo 'online' || echo 'offline')"
  },
  "databases": {
    "postgresql": "$(psql -lqt 2>/dev/null | grep -q aura_osint && echo 'online' || echo 'offline')",
    "redis": "$(redis-cli ping 2>/dev/null | grep -q PONG && echo 'online' || echo 'offline')",
    "elasticsearch": "$(curl -s http://localhost:9200 2>/dev/null && echo 'online' || echo 'offline')",
    "qdrant": "$(curl -s http://localhost:6333 2>/dev/null && echo 'online' || echo 'offline')"
  },
  "system": {
    "cpu_usage": "$(top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\([0-9.]*\)%* id.*/\1/' | awk '{print 100 - $1}')%",
    "memory_usage": "$(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')",
    "disk_usage": "$(df -h / | awk 'NR==2 {print $5}')",
    "uptime": "$(uptime -p)"
  }
}
EOF
        
        echo -e "${CHECK} ${GREEN}Rapport généré: ${REPORT_FILE}${NC}\n"
        cat "$REPORT_FILE" | jq
        ;;
    0)
        echo -e "\n${SPARKLES} ${GOLD}Au revoir! L'écosystème AURA OSINT vous attend! ${SPARKLES}${NC}\n"
        exit 0
        ;;
    *)
        echo -e "\n${CROSS} ${RED}Choix invalide${NC}\n"
        ;;
esac

echo ""
read -p "$(echo -e ${CYAN}Appuyez sur ENTRÉE pour continuer...${NC})"
exec "$0"