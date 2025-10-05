#!/bin/bash

echo "🎯 TikTok Live Analyser - Démarrage Système Intégré"
echo "=================================================="

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "process-manager.js" 2>/dev/null || true
pkill -f "launch-brave.js" 2>/dev/null || true
lsof -ti:9999 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Attendre un peu
sleep 2

# Démarrer le système
echo "🚀 Démarrage du système intégré..."
cd "$(dirname "$0")"
node launch-brave.js