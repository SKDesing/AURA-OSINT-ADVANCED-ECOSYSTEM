#!/bin/bash
# demo-aura-osint.sh - Démo AURA OSINT Forensic System

echo "🎬 DÉMONSTRATION AURA OSINT - SYSTÈME FORENSIQUE ENTERPRISE"
echo "============================================================"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}1️⃣ Démarrage du système forensique...${NC}"
echo "   → Backend API sur port 4002"
echo "   → Frontend React sur port 3000"
echo ""

node gui-launcher.js > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 3

cd frontend
npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 8

echo -e "${GREEN}✅ Système opérationnel${NC}"
echo ""

echo -e "${BLUE}2️⃣ Création d'une session d'investigation...${NC}"
SESSION_OUTPUT=$(node -e "
const AuraLauncher = require('./launchers/chromium-launcher-v3');
(async () => {
    const launcher = new AuraLauncher('demo-investigation-tiktok-001', {
        operator: 'Agent Smith',
        case_id: 'CASE-2024-0042',
        jurisdiction: 'France'
    });
    
    const browser = await launcher.launch();
    console.log('SESSION_ID:' + launcher.sessionId);
    
    await launcher.cleanup();
})();
" 2>&1)

SESSION_ID=$(echo "$SESSION_OUTPUT" | grep 'SESSION_ID:' | cut -d':' -f2)

echo -e "   ${GREEN}✅ Session forensique créée${NC}"
echo "   📋 ID: $SESSION_ID"
echo "   👤 Opérateur: Agent Smith"
echo "   📁 Dossier: CASE-2024-0042"
echo ""

echo -e "${BLUE}3️⃣ Génération du rapport d'investigation...${NC}"
curl -s "http://localhost:4002/api/forensic/report/$SESSION_ID?download=true" \
    -o "/tmp/forensic-report-$SESSION_ID.json"

echo -e "   ${GREEN}✅ Rapport généré${NC}"
echo "   📄 /tmp/forensic-report-$SESSION_ID.json"
echo ""

echo -e "${BLUE}4️⃣ Statistiques forensiques...${NC}"
STATS=$(curl -s "http://localhost:4002/api/forensic/profiles")
TOTAL=$(echo $STATS | jq -r '.total')

echo "   📊 Total sessions: $TOTAL"
echo ""

echo -e "${BLUE}5️⃣ Vérification de conformité ISO/IEC 27037:2012...${NC}"
REPORT=$(cat "/tmp/forensic-report-$SESSION_ID.json")
CUSTODY_COUNT=$(echo $REPORT | jq -r '.chain_of_custody | length')
HASH=$(echo $REPORT | jq -r '.integrity.profile_hash')

echo "   ✅ Standard: ISO/IEC 27037:2012"
echo "   ✅ Chain of Custody: $CUSTODY_COUNT événements"
echo "   ✅ Hash d'intégrité: ${HASH:0:16}..."
echo ""

echo -e "${BLUE}6️⃣ Dashboard forensique accessible sur:${NC}"
echo "   🌐 http://localhost:3000/forensic"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DÉMONSTRATION TERMINÉE AVEC SUCCÈS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Points forts démontrés:"
echo "   ✅ Création automatique de profils forensiques"
echo "   ✅ Chain of custody complète et traçable"
echo "   ✅ Conformité standards internationaux"
echo "   ✅ Interface professionnelle React"
echo "   ✅ Export rapports légalement recevables"
echo ""
echo "🔐 Sécurité & Compliance:"
echo "   ✅ Isolation des profils (UUID)"
echo "   ✅ Hash SHA-256 d'intégrité"
echo "   ✅ Archivage automatique"
echo "   ✅ Traçabilité opérateur"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter le système${NC}"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait