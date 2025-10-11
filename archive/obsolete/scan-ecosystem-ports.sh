#!/bin/bash

echo "🔍 RAPPORT DE PORTS - ÉCOSYSTÈME AURA OSINT"
echo "══════════════════════════════════════════════════════════════════"
echo "Généré le: $(date)"
echo ""

# Fonction pour vérifier si un port est en cours d'utilisation
check_port_status() {
    local port="$1"
    if lsof -i :$port >/dev/null 2>&1; then
        echo "🟢 ACTIF"
    else
        echo "🔴 INACTIF"
    fi
}

echo "📊 MODULES PRINCIPAUX"
echo "────────────────────────────────────────────────────────────────────"

# 1. Backend Principal
echo ""
echo "🔹 Backend Principal (NestJS/Express)"
echo "   Fichier: backend/mvp-server.js"
backend_port=$(grep -o "PORT.*[0-9]\+" backend/mvp-server.js 2>/dev/null | head -1 | grep -o "[0-9]\+" || echo "4011")
echo "   Port par défaut: ${backend_port}"
echo "   Status: $(check_port_status ${backend_port})"

# 2. AURA Browser (Electron)
echo ""
echo "🔹 AURA Browser (Electron)"
echo "   Fichier: aura-browser/package.json"
echo "   Pas de port fixe (lancé via npm start)"
echo "   Status: Application Electron"

# 3. Base de données PostgreSQL
echo ""
echo "🔹 Base de données PostgreSQL"
echo "   Port par défaut: 5432"
echo "   Status: $(check_port_status 5432)"

# 4. Elasticsearch
echo ""
echo "🔹 Elasticsearch (Moteur de recherche)"
echo "   Port par défaut: 9200 (HTTP), 9300 (TCP)"
echo "   Status HTTP: $(check_port_status 9200)"
echo "   Status TCP: $(check_port_status 9300)"

# 5. Qdrant (Vector Database)
echo ""
echo "🔹 Qdrant (Base de données vectorielle)"
echo "   Port par défaut: 6333 (HTTP), 6334 (gRPC)"
echo "   Status HTTP: $(check_port_status 6333)"
echo "   Status gRPC: $(check_port_status 6334)"

# 6. Redis (Cache)
echo ""
echo "🔹 Redis (Cache & Sessions)"
echo "   Port par défaut: 6379"
echo "   Status: $(check_port_status 6379)"

echo ""
echo "🌐 SERVICES WEB ET INTERFACES"
echo "────────────────────────────────────────────────────────────────────"

# 7. Frontend React (si existant)
if [[ -d "clients/web-react" ]]; then
    echo ""
    echo "🔹 Frontend React"
    echo "   Port par défaut: 3000"
    echo "   Status: $(check_port_status 3000)"
fi

# 8. Documentation Interactive
if [[ -d "DOCUMENTATION TECHNIQUE INTERACTIVE" ]]; then
    echo ""
    echo "🔹 Documentation Interactive"
    echo "   Port par défaut: 8080 ou 8000"
    echo "   Status 8080: $(check_port_status 8080)"
    echo "   Status 8000: $(check_port_status 8000)"
fi

echo ""
echo "📋 RÉSUMÉ DES PORTS UTILISÉS"
echo "────────────────────────────────────────────────────────────────────"
echo "Port  | Service                    | Status"
echo "──────|───────────────────────────|──────────"
printf "%-6s| %-26s| %s\n" "4011" "Backend Principal" "$(check_port_status 4011)"
printf "%-6s| %-26s| %s\n" "3000" "Frontend React" "$(check_port_status 3000)"
printf "%-6s| %-26s| %s\n" "5432" "PostgreSQL" "$(check_port_status 5432)"
printf "%-6s| %-26s| %s\n" "6379" "Redis" "$(check_port_status 6379)"
printf "%-6s| %-26s| %s\n" "6333" "Qdrant HTTP" "$(check_port_status 6333)"
printf "%-6s| %-26s| %s\n" "6334" "Qdrant gRPC" "$(check_port_status 6334)"
printf "%-6s| %-26s| %s\n" "9200" "Elasticsearch HTTP" "$(check_port_status 9200)"
printf "%-6s| %-26s| %s\n" "9300" "Elasticsearch TCP" "$(check_port_status 9300)"
printf "%-6s| %-26s| %s\n" "8080" "Documentation" "$(check_port_status 8080)"

echo ""
echo "✅ Analyse terminée"