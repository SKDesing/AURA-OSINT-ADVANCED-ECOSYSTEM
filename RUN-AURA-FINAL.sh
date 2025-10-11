#!/bin/bash

echo "🚀 AURA OSINT - LANCEMENT FINAL COMPLET"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

# Démarrer les bases de données avec Docker
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# Attendre que les bases de données démarrent
echo "⏳ Initialisation des services (15s)..."
sleep 15

# Démarrer le moteur IA avec tous les outils OSINT
echo "🤖 Démarrage du moteur IA avec tous les outils OSINT..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

# Attendre que le moteur IA démarre
sleep 5

# Ouvrir les interfaces
echo "🌐 Ouverture des interfaces AURA..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:4011 &
    sleep 2
    xdg-open http://localhost:4011/chat &
elif command -v open > /dev/null; then
    open http://localhost:4011 &
    sleep 2
    open http://localhost:4011/chat &
fi

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT FINAL OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🤖 Moteur IA: http://localhost:4011"
echo "💬 Chat IA: http://localhost:4011/chat"
echo "🏠 Documentation: http://localhost:4011"
echo "⚙️ Configuration: http://localhost:4011/config"
echo "🛠️ Outils OSINT: http://localhost:4011/api/osint/tools"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🧠 Qdrant: http://localhost:6333"
echo ""
echo "🎯 Outils OSINT disponibles (17):"
echo "   📱 Phone: phoneinfoga, phonenumbers"
echo "   🧅 Darknet: onionscan, torbot"
echo "   👤 Username: sherlock, maigret"
echo "   🌐 Network: shodan, ip_intelligence, port_scanner, ssl_analyzer, network_mapper"
echo "   📧 Email: holehe"
echo "   💥 Breach: h8mail"
echo "   🌍 Domain: subfinder, whois"
echo "   📱 Social: twitter, instagram"
echo ""
echo "💡 Utilisez l'interface de chat pour interagir avec l'IA Qwen!"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l'\''écosystème AURA OSINT..."; kill $AI_PID 2>/dev/null; docker-compose down; exit 0' INT

# Attendre indéfiniment
wait