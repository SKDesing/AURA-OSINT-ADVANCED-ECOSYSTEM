#!/bin/bash

echo "🚀 LIVE TRACKER PRO"
echo "================================"

# Tuer les processus sur les ports nécessaires
echo "🗑️ Nettoyage des ports..."
echo "Mohand/06" | sudo -S fuser -k 3000/tcp 4000/tcp 2>/dev/null || true
echo "Mohand/06" | sudo -S pkill -f "node.*enhanced-server" 2>/dev/null || true
echo "Mohand/06" | sudo -S pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# PostgreSQL
echo "📊 Configuration PostgreSQL..."
if ! systemctl is-active --quiet postgresql; then
    echo "Mohand/06" | sudo -S systemctl start postgresql
fi

# Base de données
echo "🗄️  Configuration base..."
cd live-tracker
if ! echo "Mohand/06" | sudo -S -u postgres psql -lqt | cut -d \| -f 1 | grep -qw live_tracker_pro; then
    echo "Mohand/06" | sudo -S -u postgres createdb live_tracker_pro
    echo "Mohand/06" | sudo -S -u postgres psql -d live_tracker_pro -f database-enhanced.sql
fi

# Backend
echo "📡 Démarrage backend..."
node enhanced-server.js &
BACKEND_PID=$!

# Attendre backend
echo "⏳ Attente backend..."
sleep 5

# Frontend
echo "🎨 Démarrage frontend..."
cd ../frontend-react
npm start &
FRONTEND_PID=$!
cd ..

# Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 8

# Ouvrir Brave avec tous les onglets localhost
echo "🌍 Ouverture Brave avec tous les onglets..."
brave-browser \
  --new-window \
  --user-data-dir="$HOME/.config/BraveSoftware/Brave-Browser" \
  "http://localhost:3000" \
  "http://localhost:4000/api/health" \
  "https://www.tiktok.com/@historia_med/live" &

echo ""
echo "✅ LIVE TRACKER PRO démarré !"
echo "📱 Frontend: http://localhost:3000"
echo "📡 Backend:  http://localhost:4000"
echo "🌍 TikTok: https://www.tiktok.com/@historia_med/live"
echo "🔒 Mode forensic: ACTIVÉ"
echo ""
echo "Pour arrêter: Ctrl+C"

trap "echo '🛑 Arrêt LIVE TRACKER PRO...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait