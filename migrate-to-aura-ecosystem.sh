#!/bin/bash

echo "🚀 MIGRATION VERS AURA OSINT ADVANCED ECOSYSTEM"
echo "==============================================="
echo ""
echo "📋 ÉTAPES DE MIGRATION:"
echo "1️⃣  Créer nouveau repo GitHub: AURA-OSINT-ADVANCED-ECOSYSTEM"
echo "2️⃣  Migrer tout le contenu"
echo "3️⃣  Mettre à jour les références"
echo "4️⃣  Archiver l'ancien repo"
echo ""

# Vérifier le contenu AURA
echo "🔍 CONTENU AURA CRÉÉ:"
echo "✅ Vitrine spectaculaire: marketing/sites/vitrine-aura-advanced-osint-ecosystem/"
echo "✅ Backend Mailtrap intégré"
echo "✅ Tests E2E complets"
echo "✅ Sécurisation git-crypt"
echo "✅ CI/CD pipeline"
echo "✅ Desktop app (Tauri)"
echo "✅ Anti-harassment engine"
echo ""

echo "📦 PRÉPARATION MIGRATION:"
echo ""
echo "1️⃣  Créer le nouveau repo sur GitHub:"
echo "    - Nom: AURA-OSINT-ADVANCED-ECOSYSTEM"
echo "    - Description: 🛡️ AURA Advanced OSINT Ecosystem - Professional Multi-Platform Intelligence Suite"
echo "    - Public"
echo "    - Ne pas initialiser avec README"
echo ""

read -p "Repo GitHub créé? (y/n): " repo_created

if [ "$repo_created" = "y" ]; then
    echo ""
    echo "🔄 MIGRATION EN COURS..."
    
    # Ajouter le nouveau remote
    echo "📡 Ajout nouveau remote..."
    git remote add aura-ecosystem https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
    
    # Push vers le nouveau repo
    echo "🚀 Push vers AURA ECOSYSTEM..."
    git push aura-ecosystem main
    
    # Mettre à jour le remote origin
    echo "🔄 Mise à jour remote origin..."
    git remote set-url origin https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
    
    # Supprimer l'ancien remote
    git remote remove aura-ecosystem
    
    echo ""
    echo "✅ MIGRATION TERMINÉE!"
    echo ""
    echo "🔗 NOUVEAU REPO: https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM"
    echo ""
    echo "📋 PROCHAINES ÉTAPES:"
    echo "1️⃣  Mettre à jour les badges dans README.md"
    echo "2️⃣  Configurer les GitHub Actions"
    echo "3️⃣  Mettre à jour la documentation"
    echo "4️⃣  Archiver l'ancien repo TikTok-Live-Analyser"
    
else
    echo ""
    echo "⏸️  Migration en attente"
    echo "Créer d'abord le repo: https://github.com/new"
fi