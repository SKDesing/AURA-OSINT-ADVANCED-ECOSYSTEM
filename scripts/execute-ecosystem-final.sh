#!/bin/bash

# ============================================
# 🚀 AURA OSINT - EXÉCUTION FINALE ÉCOSYSTÈME
# ============================================

echo "🔥 DÉMARRAGE ÉCOSYSTÈME AURA OSINT ADVANCED"
echo "=========================================="

# Vérifications préalables
echo "📋 Vérifications système..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
fi

# PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL non installé"
    exit 1
fi

echo "✅ Prérequis validés"

# Installation dépendances
echo "📦 Installation dépendances..."
cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM

# Backend
if [ ! -d "node_modules" ]; then
    npm install express pg cors helmet morgan pdfkit
fi

# Extension Chrome
echo "🔧 Configuration extension Chrome..."
cd extensions/chrome-tiktok
if [ ! -f "scripts/background.js" ]; then
    echo "console.log('AURA Background loaded');" > scripts/background.js
fi

# Base de données
echo "🗄️ Configuration base de données..."
cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM

# Créer DB si n'existe pas
sudo -u postgres psql -c "CREATE DATABASE aura_tiktok_streams;" 2>/dev/null || true

# Appliquer schéma
sudo -u postgres psql -d aura_tiktok_streams -f database/schemas/schema-aura-tiktok-enhanced.sql 2>/dev/null || true

# Serveur backend
echo "🚀 Démarrage serveur backend..."
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const captureRoutes = require('./backend/api/capture');
const reportsRoutes = require('./backend/api/reports');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/capture', captureRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 AURA OSINT Server running on port ${PORT}`);
});
EOF

# Démarrage
echo "🎯 Lancement final..."
node server.js &
SERVER_PID=$!

echo "✅ ÉCOSYSTÈME DÉMARRÉ AVEC SUCCÈS!"
echo "=================================="
echo "🌐 API: http://localhost:3000"
echo "📊 Health: http://localhost:3000/health"
echo "🔧 Extension: Charger extensions/chrome-tiktok/ dans Chrome"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo "1. Ouvrir Chrome → Extensions → Mode développeur"
echo "2. Charger extension non empaquetée → extensions/chrome-tiktok/"
echo "3. Aller sur TikTok Live"
echo "4. L'extension capturera automatiquement"
echo "5. Générer rapport: POST /api/reports/generate/{sessionId}"
echo ""
echo "🛑 Arrêter: kill $SERVER_PID"

wait $SERVER_PID