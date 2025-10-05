#!/bin/bash

echo "🐳 Construction des images Docker pour SCIS..."

# Construire l'image principale
echo "📦 Construction de l'image principale..."
docker build -t scis-app:latest .

# Vérifier si la construction a réussi
if [ $? -eq 0 ]; then
    echo "✅ Image construite avec succès!"
    echo "📊 Taille de l'image:"
    docker images scis-app:latest
else
    echo "❌ Erreur lors de la construction de l'image"
    exit 1
fi

echo "🎯 Construction terminée!"