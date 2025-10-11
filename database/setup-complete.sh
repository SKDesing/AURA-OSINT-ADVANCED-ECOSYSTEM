#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# AURA OSINT - INSTALLATION COMPLÈTE BASE DE DONNÉES
# Script d'installation automatisé pour toute l'infrastructure
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# Configuration
DB_NAME="${DB_NAME:-aura_osint}"
DB_USER="${DB_USER:-aura_admin}"
DB_PASSWORD="${DB_PASSWORD:-AuraOsint2024!}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5433}"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 1: VÉRIFICATION PRÉREQUIS
# ═══════════════════════════════════════════════════════════════════

log_info "Vérification des prérequis..."

command -v docker >/dev/null 2>&1 || log_error "Docker non installé"
command -v docker-compose >/dev/null 2>&1 || log_error "Docker Compose non installé"
command -v psql >/dev/null 2>&1 || log_error "PostgreSQL client non installé"
command -v curl >/dev/null 2>&1 || log_error "curl non installé"

log_success "Tous les prérequis sont satisfaits"

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 2: DÉMARRAGE SERVICES DOCKER
# ═══════════════════════════════════════════════════════════════════

log_info "Démarrage des services Docker..."

# Créer le réseau si nécessaire
docker network create aura-network 2>/dev/null || true

# Démarrer PostgreSQL
docker run -d \
  --name aura-postgres \
  --network aura-network \
  -p 5433:5432 \
  -e POSTGRES_DB=$DB_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine || log_warning "PostgreSQL déjà en cours d'exécution"

# Démarrer Redis
docker run -d \
  --name aura-redis \
  --network aura-network \
  -p 6379:6379 \
  redis:7-alpine || log_warning "Redis déjà en cours d'exécution"

# Démarrer Elasticsearch
docker run -d \
  --name aura-elasticsearch \
  --network aura-network \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" \
  docker.elastic.co/elasticsearch/elasticsearch:8.13.4 || log_warning "Elasticsearch déjà en cours d'exécution"

# Démarrer Qdrant
docker run -d \
  --name aura-qdrant \
  --network aura-network \
  -p 6333:6333 \
  qdrant/qdrant:latest || log_warning "Qdrant déjà en cours d'exécution"

log_success "Services Docker démarrés"

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 3: ATTENDRE QUE LES SERVICES SOIENT PRÊTS
# ═══════════════════════════════════════════════════════════════════

log_info "Attente que les services soient prêts..."

# Attendre PostgreSQL
for i in {1..30}; do
  if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1" >/dev/null 2>&1; then
    log_success "PostgreSQL prêt"
    break
  fi
  echo -n "."
  sleep 2
done

# Attendre Elasticsearch
for i in {1..30}; do
  if curl -s http://localhost:9200/_cluster/health >/dev/null 2>&1; then
    log_success "Elasticsearch prêt"
    break
  fi
  echo -n "."
  sleep 2
done

# Attendre Qdrant
for i in {1..30}; do
  if curl -s http://localhost:6333/healthz >/dev/null 2>&1; then
    log_success "Qdrant prêt"
    break
  fi
  echo -n "."
  sleep 2
done

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 4: INSTALLATION SCHÉMA POSTGRESQL
# ═══════════════════════════════════════════════════════════════════

log_info "Installation du schéma PostgreSQL..."

# Choisir le schéma à installer
if [[ "${1:-}" == "minimal" ]]; then
  SCHEMA_FILE="schema-minimal-complete.sql"
  log_info "Installation du schéma minimal"
elif [[ "${1:-}" == "ultimate" ]]; then
  SCHEMA_FILE="schema-ultimate-v2.sql"
  log_info "Installation du schéma ultimate"
else
  SCHEMA_FILE="schema-final-complete.sql"
  log_info "Installation du schéma final complet"
fi

if [[ -f "database/$SCHEMA_FILE" ]]; then
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "database/$SCHEMA_FILE"
  log_success "Schéma PostgreSQL installé"
else
  log_error "Fichier schéma $SCHEMA_FILE non trouvé"
fi

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 5: CONFIGURATION ELASTICSEARCH
# ═══════════════════════════════════════════════════════════════════

log_info "Configuration Elasticsearch..."

if [[ -f "database/elasticsearch-mappings.json" ]]; then
  curl -X PUT "localhost:9200/osint_entities" \
    -H "Content-Type: application/json" \
    -d @database/elasticsearch-mappings.json
  log_success "Index Elasticsearch créé"
else
  log_warning "Fichier elasticsearch-mappings.json non trouvé"
fi

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 6: CONFIGURATION QDRANT
# ═══════════════════════════════════════════════════════════════════

log_info "Configuration Qdrant..."

if [[ -f "database/qdrant-collections.py" ]]; then
  python3 database/qdrant-collections.py
  log_success "Collections Qdrant créées"
else
  log_warning "Fichier qdrant-collections.py non trouvé"
fi

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 7: VÉRIFICATION FINALE
# ═══════════════════════════════════════════════════════════════════

log_info "Vérification finale..."

# Test PostgreSQL
TABLES_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
log_info "Tables PostgreSQL créées: $TABLES_COUNT"

# Test Elasticsearch
ES_HEALTH=$(curl -s http://localhost:9200/_cluster/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
log_info "Statut Elasticsearch: $ES_HEALTH"

# Test Qdrant
QDRANT_COLLECTIONS=$(curl -s http://localhost:6333/collections | grep -o '"name":"[^"]*"' | wc -l)
log_info "Collections Qdrant: $QDRANT_COLLECTIONS"

# ═══════════════════════════════════════════════════════════════════
# RÉSUMÉ FINAL
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${GREEN}🚀 INSTALLATION AURA OSINT TERMINÉE${NC}"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📊 SERVICES ACTIFS:${NC}"
echo "  • PostgreSQL: localhost:5433"
echo "  • Redis: localhost:6379"
echo "  • Elasticsearch: localhost:9200"
echo "  • Qdrant: localhost:6333"
echo ""
echo -e "${BLUE}🔑 CONNEXION DATABASE:${NC}"
echo "  • Host: $DB_HOST"
echo "  • Port: $DB_PORT"
echo "  • Database: $DB_NAME"
echo "  • User: $DB_USER"
echo "  • Password: $DB_PASSWORD"
echo ""
echo -e "${BLUE}🎯 PROCHAINES ÉTAPES:${NC}"
echo "  1. Démarrer le backend: cd backend-ai && npm start"
echo "  2. Démarrer le frontend: cd clients/web-react && npm start"
echo "  3. Accéder à l'interface: http://localhost:3000"
echo ""
echo -e "${GREEN}✅ AURA OSINT PRÊT POUR UTILISATION !${NC}"
echo "═══════════════════════════════════════════════════════════════════"