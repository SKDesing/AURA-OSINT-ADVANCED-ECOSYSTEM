#!/bin/bash
# Script de création des 3 bases de données AURA
# Usage: ./setup-databases.sh

set -e

echo "🗄️ AURA Database Setup - Création des 3 bases"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification que PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    log_error "PostgreSQL n'est pas installé"
    exit 1
fi

# Vérification que PostgreSQL est démarré
if ! pg_isready &> /dev/null; then
    log_error "PostgreSQL n'est pas démarré"
    exit 1
fi

log_info "PostgreSQL détecté et démarré"

# Création des bases de données
echo ""
echo "📋 Création des bases de données..."

# 1. Base aura_users
echo "1️⃣ Création de aura_users..."
if psql -lqt | cut -d \| -f 1 | grep -qw aura_users; then
    log_warn "Base aura_users existe déjà"
else
    createdb aura_users
    log_info "Base aura_users créée"
fi

# 2. Base aura_forensic
echo "2️⃣ Création de aura_forensic..."
if psql -lqt | cut -d \| -f 1 | grep -qw aura_forensic; then
    log_warn "Base aura_forensic existe déjà"
else
    createdb aura_forensic
    log_info "Base aura_forensic créée"
fi

# 3. Base aura_system
echo "3️⃣ Création de aura_system..."
if psql -lqt | cut -d \| -f 1 | grep -qw aura_system; then
    log_warn "Base aura_system existe déjà"
else
    createdb aura_system
    log_info "Base aura_system créée"
fi

# Application des schémas
echo ""
echo "📊 Application des schémas..."

# Schema aura_users
echo "1️⃣ Application du schéma aura_users..."
if [ -f "schema-aura-users.sql" ]; then
    psql aura_users < schema-aura-users.sql
    log_info "Schéma aura_users appliqué"
else
    log_error "Fichier schema-aura-users.sql introuvable"
fi

# Schema aura_forensic
echo "2️⃣ Application du schéma aura_forensic..."
if [ -f "schema-aura-forensic-complet.sql" ]; then
    psql aura_forensic < schema-aura-forensic-complet.sql
    log_info "Schéma aura_forensic appliqué"
else
    log_error "Fichier schema-aura-forensic-complet.sql introuvable"
fi

# Schema aura_system
echo "3️⃣ Application du schéma aura_system..."
if [ -f "schema-aura-system.sql" ]; then
    psql aura_system < schema-aura-system.sql
    log_info "Schéma aura_system appliqué"
else
    log_error "Fichier schema-aura-system.sql introuvable"
fi

# Vérification des installations
echo ""
echo "🔍 Vérification des installations..."

# Compter les tables dans chaque base
users_tables=$(psql -d aura_users -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
forensic_tables=$(psql -d aura_forensic -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
system_tables=$(psql -d aura_system -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

echo "📊 Résumé des installations:"
echo "   • aura_users: $users_tables tables"
echo "   • aura_forensic: $forensic_tables tables"
echo "   • aura_system: $system_tables tables"

# Création d'un utilisateur admin par défaut
echo ""
echo "👤 Création de l'utilisateur admin par défaut..."
psql aura_users -c "
INSERT INTO utilisateurs_app (nom_utilisateur, email, mot_de_passe_hash, nom_complet, role) 
VALUES ('admin', 'admin@aura.local', '\$2b\$10\$rQZ8kJQXQXQXQXQXQXQXQu', 'Administrateur AURA', 'admin')
ON CONFLICT (nom_utilisateur) DO NOTHING;
" > /dev/null

if [ $? -eq 0 ]; then
    log_info "Utilisateur admin créé (mot de passe: admin123)"
else
    log_warn "Utilisateur admin existe déjà"
fi

echo ""
echo "🎉 Installation terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Modifier le mot de passe admin"
echo "   2. Configurer les connexions dans analytics-api.js"
echo "   3. Tester les connexions: npm run test-db"
echo ""
echo "🔗 Connexions:"
echo "   • aura_users: Authentification et permissions"
echo "   • aura_forensic: Données OSINT et investigations"
echo "   • aura_system: Logs et configuration"