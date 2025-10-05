#!/bin/bash

echo "🛑 Arrêt du système SCIS..."

# Arrêter et supprimer les conteneurs
docker-compose -f docker-compose.scis.yml down

# Optionnel: supprimer les volumes (décommenter si nécessaire)
# echo "🗑️ Suppression des volumes..."
# docker-compose -f docker-compose.scis.yml down -v

echo "✅ Système SCIS arrêté!"