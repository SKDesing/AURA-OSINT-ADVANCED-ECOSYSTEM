#!/bin/bash

# 📊 AURA-DIAGNOSTIC-COMPLET.sh
# ════════════════════════════════════════════════════════════════════════════
# 🔍 DIAGNOSTIC TECHNIQUE EXHAUSTIF - ÉCOSYSTÈME AURA OSINT
# ════════════════════════════════════════════════════════════════════════════

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GOLD='\033[38;5;220m'
NC='\033[0m'

# Emojis
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"
DATABASE="🗄️"
CHART="📊"
MAGNIFY="🔍"
DOCUMENT="📄"

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_DIR="$SCRIPT_DIR/diagnostics"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/diagnostic-complet-$TIMESTAMP.md"
JSON_REPORT="$REPORT_DIR/diagnostic-complet-$TIMESTAMP.json"

# Créer le dossier de rapports
mkdir -p "$REPORT_DIR"

# Initialiser les compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# ═══════════════════════════════════════════════════════════════════════════
# 📝 FONCTIONS UTILITAIRES
# ═══════════════════════════════════════════════════════════════════════════

log_section() {
    echo -e "\n${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GOLD}$1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}\n"
}

log_check() {
    local status=$1
    local message=$2
    local details=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "PASS")
            echo -e "${CHECK} ${GREEN}[PASS]${NC} $message"
            [ -n "$details" ] && echo -e "   ${CYAN}└─ $details${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            ;;
        "FAIL")
            echo -e "${CROSS} ${RED}[FAIL]${NC} $message"
            [ -n "$details" ] && echo -e "   ${RED}└─ $details${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            ;;
        "WARN")
            echo -e "${WARNING} ${YELLOW}[WARN]${NC} $message"
            [ -n "$details" ] && echo -e "   ${YELLOW}└─ $details${NC}"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            ;;
        "INFO")
            echo -e "${INFO} ${CYAN}[INFO]${NC} $message"
            [ -n "$details" ] && echo -e "   ${CYAN}└─ $details${NC}"
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 BANNER
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${GOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║          🔍 DIAGNOSTIC TECHNIQUE COMPLET - AURA OSINT 🔍                  ║
║                                                                           ║
║                    Audit Exhaustif de l'Écosystème                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Démarrer le rapport Markdown
cat > "$REPORT_FILE" << EOF
# 🔍 DIAGNOSTIC TECHNIQUE COMPLET - ÉCOSYSTÈME AURA OSINT

**Date:** $(date '+%Y-%m-%d %H:%M:%S')  
**Opérateur:** $USER  
**Hostname:** $(hostname)  
**Système:** $(uname -s) $(uname -r)

---

EOF

# Démarrer le rapport JSON
echo "{" > "$JSON_REPORT"
echo "  \"timestamp\": \"$(date -Iseconds)\"," >> "$JSON_REPORT"
echo "  \"hostname\": \"$(hostname)\"," >> "$JSON_REPORT"
echo "  \"system\": \"$(uname -s) $(uname -r)\"," >> "$JSON_REPORT"
echo "  \"diagnostics\": {" >> "$JSON_REPORT"

# ═══════════════════════════════════════════════════════════════════════════
# 1️⃣ ENVIRONNEMENT SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════

log_section "1️⃣  ENVIRONNEMENT SYSTÈME"
echo "## 1. 🖥️  ENVIRONNEMENT SYSTÈME" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "    \"system_environment\": {" >> "$JSON_REPORT"

# OS
OS_INFO=$(uname -a)
log_check "INFO" "Système d'exploitation" "$OS_INFO"
echo "- **OS:** $OS_INFO" >> "$REPORT_FILE"

# CPU
CPU_INFO=$(cat /proc/cpuinfo | grep "model name" | head -1 | cut -d':' -f2 | xargs 2>/dev/null || echo "N/A")
CPU_CORES=$(cat /proc/cpuinfo | grep processor | wc -l 2>/dev/null || echo "N/A")
log_check "INFO" "Processeur" "$CPU_INFO ($CPU_CORES cores)"
echo "- **CPU:** $CPU_INFO" >> "$REPORT_FILE"
echo "- **Cores:** $CPU_CORES" >> "$REPORT_FILE"
echo "      \"cpu\": \"$CPU_INFO\"," >> "$JSON_REPORT"
echo "      \"cpu_cores\": $CPU_CORES," >> "$JSON_REPORT"

# RAM
TOTAL_RAM=$(free -h | awk '/^Mem:/ {print $2}')
USED_RAM=$(free -h | awk '/^Mem:/ {print $3}')
RAM_PERCENT=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
log_check "INFO" "Mémoire RAM" "Total: $TOTAL_RAM, Utilisé: $USED_RAM ($RAM_PERCENT%)"
echo "- **RAM:** $TOTAL_RAM (Utilisé: $USED_RAM - $RAM_PERCENT%)" >> "$REPORT_FILE"
echo "      \"ram_total\": \"$TOTAL_RAM\"," >> "$JSON_REPORT"
echo "      \"ram_used\": \"$USED_RAM\"," >> "$JSON_REPORT"
echo "      \"ram_percent\": $RAM_PERCENT," >> "$JSON_REPORT"

# Disk
TOTAL_DISK=$(df -h / | awk 'NR==2 {print $2}')
USED_DISK=$(df -h / | awk 'NR==2 {print $3}')
DISK_PERCENT=$(df -h / | awk 'NR==2 {print $5}')
log_check "INFO" "Espace disque" "Total: $TOTAL_DISK, Utilisé: $USED_DISK ($DISK_PERCENT)"
echo "- **Disque:** $TOTAL_DISK (Utilisé: $USED_DISK - $DISK_PERCENT)" >> "$REPORT_FILE"
echo "      \"disk_total\": \"$TOTAL_DISK\"," >> "$JSON_REPORT"
echo "      \"disk_used\": \"$USED_DISK\"," >> "$JSON_REPORT"
echo "      \"disk_percent\": \"$DISK_PERCENT\"" >> "$JSON_REPORT"

echo "    }," >> "$JSON_REPORT"
echo "" >> "$REPORT_FILE"

# ═══════════════════════════════════════════════════════════════════════════
# 2️⃣ DÉPENDANCES SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════

log_section "2️⃣  DÉPENDANCES SYSTÈME"
echo "## 2. 🔧 DÉPENDANCES SYSTÈME" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "    \"dependencies\": {" >> "$JSON_REPORT"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_check "PASS" "Node.js installé" "$NODE_VERSION"
    echo "- ✅ **Node.js:** $NODE_VERSION" >> "$REPORT_FILE"
    echo "      \"nodejs\": {\"installed\": true, \"version\": \"$NODE_VERSION\"}," >> "$JSON_REPORT"
else
    log_check "FAIL" "Node.js NON installé" "Requis: v18+"
    echo "- ❌ **Node.js:** NON INSTALLÉ" >> "$REPORT_FILE"
    echo "      \"nodejs\": {\"installed\": false, \"version\": null}," >> "$JSON_REPORT"
fi

# NPM
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_check "PASS" "NPM installé" "$NPM_VERSION"
    echo "- ✅ **NPM:** $NPM_VERSION" >> "$REPORT_FILE"
    echo "      \"npm\": {\"installed\": true, \"version\": \"$NPM_VERSION\"}," >> "$JSON_REPORT"
else
    log_check "FAIL" "NPM NON installé"
    echo "- ❌ **NPM:** NON INSTALLÉ" >> "$REPORT_FILE"
    echo "      \"npm\": {\"installed\": false, \"version\": null}," >> "$JSON_REPORT"
fi

# Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    log_check "PASS" "Python3 installé" "$PYTHON_VERSION"
    echo "- ✅ **Python3:** $PYTHON_VERSION" >> "$REPORT_FILE"
    echo "      \"python\": {\"installed\": true, \"version\": \"$PYTHON_VERSION\"}," >> "$JSON_REPORT"
else
    log_check "FAIL" "Python3 NON installé"
    echo "- ❌ **Python3:** NON INSTALLÉ" >> "$REPORT_FILE"
    echo "      \"python\": {\"installed\": false, \"version\": null}," >> "$JSON_REPORT"
fi

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    log_check "PASS" "Docker installé" "$DOCKER_VERSION"
    echo "- ✅ **Docker:** $DOCKER_VERSION" >> "$REPORT_FILE"
    echo "      \"docker\": {\"installed\": true, \"version\": \"$DOCKER_VERSION\"}," >> "$JSON_REPORT"
else
    log_check "WARN" "Docker NON installé" "Optionnel mais recommandé"
    echo "- ⚠️  **Docker:** NON INSTALLÉ" >> "$REPORT_FILE"
    echo "      \"docker\": {\"installed\": false, \"version\": null}," >> "$JSON_REPORT"
fi

# Curl
if command -v curl &> /dev/null; then
    CURL_VERSION=$(curl --version | head -n1 | cut -d' ' -f2)
    log_check "PASS" "Curl installé" "$CURL_VERSION"
    echo "- ✅ **Curl:** $CURL_VERSION" >> "$REPORT_FILE"
    echo "      \"curl\": {\"installed\": true, \"version\": \"$CURL_VERSION\"}" >> "$JSON_REPORT"
else
    log_check "FAIL" "Curl NON installé"
    echo "- ❌ **Curl:** NON INSTALLÉ" >> "$REPORT_FILE"
    echo "      \"curl\": {\"installed\": false, \"version\": null}" >> "$JSON_REPORT"
fi

echo "    }," >> "$JSON_REPORT"
echo "" >> "$REPORT_FILE"

# ═══════════════════════════════════════════════════════════════════════════
# 3️⃣ STRUCTURE DU PROJET
# ═══════════════════════════════════════════════════════════════════════════

log_section "3️⃣  STRUCTURE DU PROJET"
echo "## 3. 📁 STRUCTURE DU PROJET" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "    \"project_structure\": {" >> "$JSON_REPORT"

# Dossiers principaux
REQUIRED_DIRS=("backend" "frontend" "marketing/sites/vitrine-aura-advanced-osint-ecosystem" "logs" "scripts")

echo "      \"directories\": [" >> "$JSON_REPORT"
FIRST_DIR=true

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$SCRIPT_DIR/$dir" ]; then
        log_check "PASS" "Dossier '$dir' existe"
        echo "- ✅ **$dir/** existe" >> "$REPORT_FILE"
        [ "$FIRST_DIR" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "        {\"path\": \"$dir\", \"exists\": true}" >> "$JSON_REPORT"
        FIRST_DIR=false
    else
        log_check "FAIL" "Dossier '$dir' MANQUANT"
        echo "- ❌ **$dir/** MANQUANT" >> "$REPORT_FILE"
        [ "$FIRST_DIR" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "        {\"path\": \"$dir\", \"exists\": false}" >> "$JSON_REPORT"
        FIRST_DIR=false
    fi
done

echo "" >> "$JSON_REPORT"
echo "      ]" >> "$JSON_REPORT"
echo "    }," >> "$JSON_REPORT"
echo "" >> "$REPORT_FILE"

# ═══════════════════════════════════════════════════════════════════════════
# 4️⃣ SERVICES & PORTS
# ═══════════════════════════════════════════════════════════════════════════

log_section "4️⃣  SERVICES & PORTS"
echo "## 4. 🌐 SERVICES & PORTS" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "    \"services\": {" >> "$JSON_REPORT"

# Ports à vérifier
declare -A PORTS=(
    [3000]="Frontend React"
    [4011]="Backend API Unifié"
    [5173]="Site Vitrine"
    [5432]="PostgreSQL"
    [6379]="Redis"
    [9200]="Elasticsearch"
    [6333]="Qdrant"
)

FIRST_PORT=true
for port in "${!PORTS[@]}"; do
    service="${PORTS[$port]}"
    
    if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port"; then
        log_check "PASS" "$service (Port $port)" "Service actif"
        echo "- ✅ **$service:** Port $port ACTIF" >> "$REPORT_FILE"
        [ "$FIRST_PORT" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "      \"port_$port\": {\"service\": \"$service\", \"status\": \"active\"}" >> "$JSON_REPORT"
        FIRST_PORT=false
    else
        log_check "WARN" "$service (Port $port)" "Service inactif"
        echo "- ⚠️  **$service:** Port $port INACTIF" >> "$REPORT_FILE"
        [ "$FIRST_PORT" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "      \"port_$port\": {\"service\": \"$service\", \"status\": \"inactive\"}" >> "$JSON_REPORT"
        FIRST_PORT=false
    fi
done

echo "" >> "$JSON_REPORT"
echo "    }," >> "$JSON_REPORT"
echo "" >> "$REPORT_FILE"

# ═══════════════════════════════════════════════════════════════════════════
# 5️⃣ OUTILS OSINT
# ═══════════════════════════════════════════════════════════════════════════

log_section "5️⃣  OUTILS OSINT"
echo "## 5. 🔍 OUTILS OSINT" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "    \"osint_tools\": {" >> "$JSON_REPORT"

# Liste des outils OSINT à vérifier
OSINT_TOOLS=(
    "holehe:Holehe (Email)"
    "phoneinfoga:PhoneInfoga"
    "sherlock:Sherlock"
    "maigret:Maigret"
    "theHarvester:TheHarvester"
    "subfinder:Subfinder"
    "amass:Amass"
    "nmap:Nmap"
    "whois:WHOIS"
    "dnsenum:DNSenum"
)

FIRST_TOOL=true
for tool_entry in "${OSINT_TOOLS[@]}"; do
    IFS=':' read -r cmd name <<< "$tool_entry"
    
    if command -v "$cmd" &> /dev/null; then
        log_check "PASS" "$name installé"
        echo "- ✅ **$name:** Installé" >> "$REPORT_FILE"
        [ "$FIRST_TOOL" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "      \"$cmd\": {\"name\": \"$name\", \"installed\": true}" >> "$JSON_REPORT"
        FIRST_TOOL=false
    else
        log_check "WARN" "$name NON installé"
        echo "- ⚠️  **$name:** NON installé" >> "$REPORT_FILE"
        [ "$FIRST_TOOL" = false ] && echo "," >> "$JSON_REPORT"
        echo -n "      \"$cmd\": {\"name\": \"$name\", \"installed\": false}" >> "$JSON_REPORT"
        FIRST_TOOL=false
    fi
done

echo "" >> "$JSON_REPORT"
echo "    }" >> "$JSON_REPORT"

# ═══════════════════════════════════════════════════════════════════════════
# FERMETURE JSON
# ═══════════════════════════════════════════════════════════════════════════

echo "  }," >> "$JSON_REPORT"
echo "  \"summary\": {" >> "$JSON_REPORT"
echo "    \"total_checks\": $TOTAL_CHECKS," >> "$JSON_REPORT"
echo "    \"passed\": $PASSED_CHECKS," >> "$JSON_REPORT"
echo "    \"failed\": $FAILED_CHECKS," >> "$JSON_REPORT"
echo "    \"warnings\": $WARNING_CHECKS" >> "$JSON_REPORT"
echo "  }" >> "$JSON_REPORT"
echo "}" >> "$JSON_REPORT"

# ═══════════════════════════════════════════════════════════════════════════
# 📊 RÉSUMÉ FINAL
# ═══════════════════════════════════════════════════════════════════════════

log_section "📊 RÉSUMÉ FINAL"

echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## 📊 RÉSUMÉ DU DIAGNOSTIC" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Catégorie | Valeur |" >> "$REPORT_FILE"
echo "|-----------|--------|" >> "$REPORT_FILE"
echo "| **Total de vérifications** | $TOTAL_CHECKS |" >> "$REPORT_FILE"
echo "| **✅ Tests réussis** | $PASSED_CHECKS |" >> "$REPORT_FILE"
echo "| **❌ Tests échoués** | $FAILED_CHECKS |" >> "$REPORT_FILE"
echo "| **⚠️  Avertissements** | $WARNING_CHECKS |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_CHECKS/$TOTAL_CHECKS)*100}")

echo -e "${WHITE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${WHITE}║                          📊 RÉSUMÉ DU DIAGNOSTIC                          ║${NC}"
echo -e "${WHITE}╠═══════════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${WHITE}║${NC}  ${CYAN}Total de vérifications:${NC}  ${WHITE}$TOTAL_CHECKS${NC}"
echo -e "${WHITE}║${NC}  ${GREEN}Tests réussis:${NC}           ${GREEN}$PASSED_CHECKS${NC}"
echo -e "${WHITE}║${NC}  ${RED}Tests échoués:${NC}           ${RED}$FAILED_CHECKS${NC}"
echo -e "${WHITE}║${NC}  ${YELLOW}Avertissements:${NC}          ${YELLOW}$WARNING_CHECKS${NC}"
echo -e "${WHITE}║${NC}  ${GOLD}Taux de réussite:${NC}        ${GOLD}${SUCCESS_RATE}%${NC}"
echo -e "${WHITE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GOLD}${DOCUMENT} RAPPORTS GÉNÉRÉS:${NC}"
echo -e "   ${CYAN}├─ Markdown:${NC} $REPORT_FILE"
echo -e "   ${CYAN}└─ JSON:${NC}     $JSON_REPORT"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}${CHECK} DIAGNOSTIC TERMINÉ AVEC SUCCÈS!${NC}"
    echo "## ✅ DIAGNOSTIC TERMINÉ AVEC SUCCÈS!" >> "$REPORT_FILE"
else
    echo -e "${YELLOW}${WARNING} DIAGNOSTIC TERMINÉ AVEC $FAILED_CHECKS PROBLÈME(S)${NC}"
    echo "## ⚠️  DIAGNOSTIC TERMINÉ AVEC $FAILED_CHECKS PROBLÈME(S)" >> "$REPORT_FILE"
fi

echo ""
echo -e "${CYAN}Pour consulter le rapport complet:${NC}"
echo -e "   ${WHITE}cat $REPORT_FILE${NC}"
echo -e "   ${WHITE}cat $JSON_REPORT | jq${NC}"
echo ""

exit 0