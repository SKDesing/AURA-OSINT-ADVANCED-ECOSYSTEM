#!/bin/bash

# 🚀 AURA OSINT - LAUNCHER SIMPLE
clear

echo "🎯 AURA OSINT LAUNCHER"
echo "======================"
echo ""
echo "1) 🚀 Démarrer tout"
echo "2) ❌ Arrêter tout" 
echo "3) 📊 Statut"
echo "4) 🌐 Ouvrir sites"
echo "0) Quitter"
echo ""
read -p "Choix: " choice

case $choice in
    1)
        echo "🚀 Démarrage AURA..."
        
        # Backend
        echo "📡 Backend..."
        (cd backend && npm start > /dev/null 2>&1 &)
        
        # Frontend (serve static files)
        echo "🖥️ Frontend..."
        (cd frontend && python3 -m http.server 3000 > /dev/null 2>&1 &)
        
        # Vitrine
        echo "✨ Site vitrine..."
        (cd marketing/sites/vitrine-aura-advanced-osint-ecosystem && npm run dev > /dev/null 2>&1 &)
        
        echo "✅ Tous les services démarrés!"
        echo "Backend: http://localhost:4011"
        echo "Frontend: http://localhost:3000" 
        echo "Vitrine: http://localhost:5173"
        ;;
    2)
        echo "❌ Arrêt des services..."
        pkill -f "npm.*start"
        pkill -f "node.*server"
        pkill -f "react-scripts"
        echo "✅ Services arrêtés"
        ;;
    3)
        echo "📊 Statut des services:"
        curl -s http://localhost:4011/health >/dev/null && echo "✅ Backend" || echo "❌ Backend"
        curl -s http://localhost:3000 >/dev/null && echo "✅ Frontend" || echo "❌ Frontend"  
        curl -s http://localhost:5173 >/dev/null && echo "✅ Vitrine" || echo "❌ Vitrine"
        ;;
    4)
        echo "🌐 Ouverture des sites..."
        xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null
        xdg-open http://localhost:5173 2>/dev/null || open http://localhost:5173 2>/dev/null
        ;;
    0)
        echo "👋 Au revoir!"
        exit 0
        ;;
esac