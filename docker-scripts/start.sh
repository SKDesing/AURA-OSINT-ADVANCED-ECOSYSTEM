#!/bin/bash

echo "🚀 Démarrage du système SCIS avec Docker..."

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker-compose.scis.yml down

# Démarrer les services
echo "🐳 Démarrage des services..."
docker-compose -f docker-compose.scis.yml up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le statut
echo "📊 Statut des services:"
docker-compose -f docker-compose.scis.yml ps

# Afficher les logs
echo "📋 Logs récents:"
docker-compose -f docker-compose.scis.yml logs --tail=20

echo ""
echo "✅ Système SCIS démarré!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:4000"
echo "🗄️ PostgreSQL: localhost:5432"
echo ""
echo "📋 Commandes utiles:"
echo "  docker-compose -f docker-compose.scis.yml logs -f    # Voir les logs"
echo "  docker-compose -f docker-compose.scis.yml down       # Arrêter"
echo "  docker-compose -f docker-compose.scis.yml restart    # Redémarrer"