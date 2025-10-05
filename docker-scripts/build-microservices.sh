#!/bin/bash

echo "🐳 Construction des microservices SCIS..."

# Services à construire
services=("dashboard" "analyser" "profiles" "lives" "create" "database" "reports")

# Construire chaque service
for service in "${services[@]}"; do
    echo "📦 Construction du service $service..."
    docker build -t scis-$service:latest ./services/$service/
    
    if [ $? -eq 0 ]; then
        echo "✅ Service $service construit avec succès"
    else
        echo "❌ Erreur lors de la construction du service $service"
        exit 1
    fi
done

echo ""
echo "📊 Images construites:"
docker images | grep scis-

echo ""
echo "🎯 Construction des microservices terminée!"
echo "🚀 Utilisez: docker-compose -f docker-compose.microservices.yml up -d"