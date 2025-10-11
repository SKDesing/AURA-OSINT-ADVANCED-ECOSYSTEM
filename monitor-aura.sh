#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   📊 MONITORING TEMPS RÉEL AURA OSINT                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

while true; do
    clear
    echo "🕐 $(date '+%Y-%m-%d %H:%M:%S')"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    
    # Processus
    echo "🔄 PROCESSUS ACTIFS:"
    BACKEND_PID=$(pgrep -f "node.*server" || echo "❌")
    AI_PID=$(pgrep -f "node.*qwen" || echo "❌")
    FRONTEND_PID=$(pgrep -f "python.*http.server" || echo "❌")
    
    if [ "$BACKEND_PID" != "❌" ]; then
        echo "   ✅ Backend (PID: $BACKEND_PID)"
    else
        echo "   ❌ Backend non actif"
    fi
    
    if [ "$AI_PID" != "❌" ]; then
        echo "   ✅ AI Engine (PID: $AI_PID)"
    else
        echo "   ❌ AI Engine non actif"
    fi
    
    if [ "$FRONTEND_PID" != "❌" ]; then
        echo "   ✅ Frontend (PID: $FRONTEND_PID)"
    else
        echo "   ❌ Frontend non actif"
    fi
    
    echo ""
    echo "🔌 PORTS:"
    for port in 4011 3000 5432 6379; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "   ✅ Port $port actif"
        else
            echo "   ❌ Port $port libre"
        fi
    done
    
    echo ""
    echo "💾 MÉMOIRE:"
    free -h | grep Mem | awk '{print "   Utilisée: " $3 " / " $2}'
    
    echo ""
    echo "🐳 DOCKER:"
    DOCKER_CONTAINERS=$(docker ps -q 2>/dev/null | wc -l)
    echo "   Conteneurs actifs: $DOCKER_CONTAINERS"
    
    echo ""
    echo "🌐 TESTS CONNECTIVITÉ:"
    
    # Test Backend API
    if curl -s http://localhost:4011/api/health >/dev/null 2>&1; then
        echo "   ✅ Backend API répond"
    else
        echo "   ❌ Backend API ne répond pas"
    fi
    
    # Test Frontend
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "   ✅ Frontend accessible"
    else
        echo "   ❌ Frontend inaccessible"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "⚡ Rafraîchissement dans 3s... (Ctrl+C pour arrêter)"
    
    sleep 3
done