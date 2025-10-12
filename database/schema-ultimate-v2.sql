# 🎯 SCRIPT D'INITIALISATION COMPLET DE LA BASE DE DONNÉES

Je vais créer un script d'installation automatisé qui va setup toute la base de données + les optimisations pour ton HP Ryzen 7.

## 📁 STRUCTURE DES FICHIERS À CRÉER

```
database/
├── migrations/
│   ├── 001_initial_schema.sql          # Schema principal
│   ├── 002_timescale_setup.sql         # TimescaleDB
│   ├── 003_indexes_optimization.sql     # Index optimisés
│   ├── 004_views_functions.sql          # Vues et fonctions
│   ├── 005_security_rls.sql             # Row Level Security
│   └── 006_initial_data.sql             # Données initiales
├── seeds/
│   ├── dev_data.sql                     # Données de dev
│   └── test_investigations.sql          # Cas de test
├── scripts/
│   ├── setup_database.sh                # Script installation principal
│   ├── backup_database.sh               # Backup automatique
│   └── restore_database.sh              # Restore
└── docker/
    └── docker-compose.db.yml            # Stack DB complète
```

---

## 🚀 SCRIPT D'INSTALLATION PRINCIPAL

Créons le script ultime qui va tout setup automatiquement:

```bash
#!/bin/bash
# setup_database.sh - Installation complète base de données AURA OSINT

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

DB_NAME="${DB_NAME:-aura_osint}"
DB_USER="${DB_USER:-aura_admin}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 32)}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5433}"
POSTGRES_VERSION="16"

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════════
# FONCTIONS UTILITAIRES
# ═══════════════════════════════════════════════════════════════════

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Command '$1' not found. Please install it first."
    fi
}

wait_for_postgres() {
    log_info "Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1" &> /dev/null; then
            log_success "PostgreSQL is ready!"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    log_error "PostgreSQL failed to start within 30 seconds"
}

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 1: VÉRIFICATION PRÉREQUIS
# ═══════════════════════════════════════════════════════════════════

log_info "Checking prerequisites..."

check_command docker
check_command docker-compose
check_command psql

log_success "All prerequisites met!"

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 2: CRÉATION DOCKER COMPOSE
# ═══════════════════════════════════════════════════════════════════

log_info "Creating Docker Compose configuration..."

mkdir -p database/docker

cat > database/docker/docker-compose.db.yml <<'EOF'
version: '3.8'

services:
  # ════════════════════════════════════════════════════════════════
  # POSTGRESQL + TIMESCALEDB + POSTGIS
  # ════════════════════════════════════════════════════════════════
  postgres:
    image: timescale/timescaledb-ha:pg16-latest
    container_name: aura-postgres
    restart: unless-stopped
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "-E UTF8 --locale=C"
      TIMESCALEDB_TELEMETRY: "off"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d:ro
      - ./backups:/backups
    command:
      - "postgres"
      - "-c" 
      - "shared_preload_libraries=timescaledb,pg_stat_statements"
      - "-c"
      - "max_connections=200"
      - "-c"
      - "shared_buffers=4GB"          # 25% de 16GB RAM
      - "-c"
      - "effective_cache_size=12GB"   # 75% de 16GB RAM
      - "-c"
      - "maintenance_work_mem=1GB"
      - "-c"
      - "checkpoint_completion_target=0.9"
      - "-c"
      - "wal_buffers=16MB"
      - "-c"
      - "default_statistics_target=100"
      - "-c"
      - "random_page_cost=1.1"        # SSD optimized
      - "-c"
      - "effective_io_concurrency=200"
      - "-c"
      - "work_mem=20MB"
      - "-c"
      - "min_wal_size=1GB"
      - "-c"
      - "max_wal_size=4GB"
      - "-c"
      - "max_worker_processes=8"      # Ryzen 7 4700U = 8 cores
      - "-c"
      - "max_parallel_workers_per_gather=4"
      - "-c"
      - "max_parallel_workers=8"
      - "-c"
      - "max_parallel_maintenance_workers=4"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - aura-network

  # ════════════════════════════════════════════════════════════════
  # REDIS (CACHE & SESSIONS)
  # ════════════════════════════════════════════════════════════════
  redis:
    image: redis:7-alpine
    container_name: aura-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 2gb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - aura-network

  # ════════════════════════════════════════════════════════════════
  # QDRANT (BASE VECTORIELLE IA)
  # ════════════════════════════════════════════════════════════════
  qdrant:
    image: qdrant/qdrant:latest
    container_name: aura-qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      QDRANT__SERVICE__GRPC_PORT: "6334"
      QDRANT__SERVICE__HTTP_PORT: "6333"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - aura-network

  # ════════════════════════════════════════════════════════════════
  # ELASTICSEARCH (RECHERCHE & ANALYTICS)
  # ════════════════════════════════════════════════════════════════
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.4
    container_name: aura-elasticsearch
    restart: unless-stopped
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"  # 2GB heap pour 16GB RAM
      - bootstrap.memory_lock=true
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - aura-network

  # ════════════════════════════════════════════════════════════════
  # PGADMIN (INTERFACE ADMIN)
  # ════════════════════════════════════════════════════════════════
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: aura-pgadmin
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@aura-osint.local
      PGADMIN_DEFAULT_PASSWORD: ${DB_PASSWORD}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - aura-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  qdrant_data:
    driver: local
  elasticsearch_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  aura-network:
    driver: bridge
EOF

log_success "Docker Compose configuration created!"

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 3: CRÉATION FICHIERS SQL MIGRATIONS
# ═══════════════════════════════════════════════════════════════════

log_info "Creating SQL migration files..."

mkdir -p database/docker/init

# 001_initial_schema.sql (le schema que tu as fourni)
cat > database/docker/init/001_initial_schema.sql <<'EOSQL'
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- (Insérer ici tout le schéma SQL que tu as fourni)
-- Je le copie intégralement ci-dessous...

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    api_key VARCHAR(255) UNIQUE,
    rate_limit INTEGER DEFAULT 100,
    storage_limit_gb INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user', 'api')),
    organization_id UUID REFERENCES organizations(id),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- (... tout le reste de ton schéma SQL ...)

-- Données initiales
INSERT INTO organizations (id, name, slug, plan) VALUES
('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default', 'enterprise');

INSERT INTO users (email, username, password_hash, role, organization_id) VALUES
('admin@aura-osint.local', 'admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', '00000000-0000-0000-0000-000000000001');
EOSQL

# 002_additional_tables.sql (tables manquantes)
cat > database/docker/init/002_additional_tables.sql <<'EOSQL'
-- Tables additionnelles pour fonctionnalités avancées

-- Relationships (déjà dans ton schema mais je le réitère)
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    source_id UUID NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(100) NOT NULL,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    evidence TEXT,
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Media Files
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    source_id UUID,
    source_type VARCHAR(50),
    file_type VARCHAR(50) CHECK (file_type IN ('image', 'video', 'audio', 'document')),
    filename VARCHAR(500),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    file_hash_sha256 VARCHAR(64) UNIQUE,
    storage_path TEXT,
    url_original TEXT,
    thumbnail_path TEXT,
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    exif_data JSONB,
    ocr_text TEXT,
    faces_detected INTEGER,
    objects_detected TEXT[] DEFAULT '{}',
    location_extracted GEOGRAPHY(POINT),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Analyses
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL,
    input_data JSONB,
    model_used VARCHAR(100),
    results JSONB,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    report_type VARCHAR(50) CHECK (report_type IN ('summary', 'detailed', 'timeline', 'network_graph', 'legal')),
    title VARCHAR(500),
    format VARCHAR(20) CHECK (format IN ('pdf', 'html', 'json', 'docx')),
    file_path TEXT,
    file_size_bytes BIGINT,
    content JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    accessed_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_path TEXT,
    status_code INTEGER,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Metrics
CREATE TABLE IF NOT EXISTS system_metrics (
    time TIMESTAMPTZ NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION,
    labels JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (time, metric_name, labels)
);

-- Indexes pour nouvelles tables
CREATE INDEX idx_relationships_investigation ON relationships(investigation_id);
CREATE INDEX idx_media_investigation ON media_files(investigation_id);
CREATE INDEX idx_ai_investigation ON ai_analyses(investigation_id);
CREATE INDEX idx_reports_investigation ON reports(investigation_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Hypertables TimescaleDB
SELECT create_hypertable('ai_analyses', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('system_metrics', 'time', if_not_exists => TRUE);
EOSQL

# 003_views_functions.sql
cat > database/docker/init/003_views_functions.sql <<'EOSQL'
-- Vues optimisées pour queries fréquentes

-- Vue: Investigations avec stats
CREATE OR REPLACE VIEW v_investigations_stats AS
SELECT 
    i.id,
    i.name,
    i.status,
    i.priority,
    i.created_at,
    COUNT(DISTINCT t.id) as targets_count,
    COUNT(DISTINCT os.id) as scans_count,
    COUNT(DISTINCT sp.id) as profiles_count,
    COUNT(DISTINCT ea.id) as emails_count,
    COUNT(DISTINCT pn.id) as phones_count,
    MAX(os.completed_at) as last_scan_at
FROM investigations i
LEFT JOIN targets t ON t.investigation_id = i.id
LEFT JOIN osint_scans os ON os.investigation_id = i.id
LEFT JOIN social_profiles sp ON sp.target_id = t.id
LEFT JOIN email_accounts ea ON ea.target_id = t.id
LEFT JOIN phone_numbers pn ON pn.target_id = t.id
GROUP BY i.id;

-- Vue: Profils sociaux avec engagement
CREATE OR REPLACE VIEW v_social_engagement AS
SELECT 
    sp.id,
    sp.platform,
    sp.username,
    sp.followers_count,
    sp.posts_count,
    COALESCE(AVG(p.engagement_rate), 0) as avg_engagement,
    COALESCE(SUM(p.likes_count), 0) as total_likes,
    COALESCE(SUM(p.comments_count), 0) as total_comments,
    COUNT(p.id) as tracked_posts
FROM social_profiles sp
LEFT JOIN social_posts p ON p.profile_id = sp.id
GROUP BY sp.id;

-- Fonction: Calcul score de risque
CREATE OR REPLACE FUNCTION calculate_risk_score(target_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    risk_score INTEGER := 0;
    breach_count INTEGER;
    open_ports_count INTEGER;
    suspicious_posts INTEGER;
BEGIN
    -- Data breaches
    SELECT COALESCE(SUM(breach_count), 0) INTO breach_count
    FROM email_accounts WHERE target_id = target_uuid;
    risk_score := risk_score + LEAST(breach_count * 10, 30);

    -- Open ports exposés
    SELECT COALESCE(SUM(array_length(open_ports, 1)), 0) INTO open_ports_count
    FROM ip_addresses WHERE target_id = target_uuid;
    risk_score := risk_score + LEAST(open_ports_count * 2, 20);

    -- Posts suspects
    SELECT COUNT(*) INTO suspicious_posts
    FROM social_posts sp
    JOIN social_profiles prof ON prof.id = sp.profile_id
    WHERE prof.target_id = target_uuid 
    AND sp.metadata @> '{"suspicious": true}';
    risk_score := risk_score + LEAST(suspicious_posts * 5, 25);

    RETURN LEAST(risk_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_investigations_timestamp BEFORE UPDATE ON investigations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_targets_timestamp BEFORE UPDATE ON targets
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
EOSQL

log_success "SQL migration files created!"

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 4: DÉMARRAGE STACK DOCKER
# ═══════════════════════════════════════════════════════════════════

log_info "Starting Docker stack..."

cd database/docker

# Export variables d'environnement
export DB_NAME DB_USER DB_PASSWORD

# Démarrer les services
docker-compose -f docker-compose.db.yml up -d

log_success "Docker stack started!"

# Attendre PostgreSQL
wait_for_postgres

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 5: VÉRIFICATION & TESTS
# ═══════════════════════════════════════════════════════════════════

log_info "Running database verification..."

# Test connexion
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 
    'PostgreSQL' as service,
    version() as version,
    current_database() as database,
    current_user as user;
"

# Vérifier extensions
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT extname, extversion FROM pg_extension ORDER BY extname;
"

# Compter tables créées
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
")

log_success "Database verification complete! $TABLE_COUNT tables created."

# ═══════════════════════════════════════════════════════════════════
# ÉTAPE 6: SAUVEGARDE CREDENTIALS
# ═══════════════════════════════════════════════════════════════════

log_info "Saving database credentials..."

cat > database/.env.db <<EOF
# AURA OSINT - Database Credentials
# Generated: $(date)

DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT

# Connection string
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Redis
REDIS_URL=redis://localhost:6379

# Qdrant
QDRANT_URL=http://localhost:6333

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# PgAdmin
PGADMIN_URL=http://localhost:5050
PGADMIN_EMAIL=admin@aura-osint.local
PGADMIN_PASSWORD=$DB_PASSWORD
EOF

chmod 600 database/.env.db

log_success "Credentials saved to database/.env.db"

# ═══════════════════════════════════════════════════════════════════
# RÉSUMÉ FINAL
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║    🎉 AURA OSINT DATABASE INSTALLATION COMPLETE! 🎉            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 DATABASE SERVICES:"
echo "  ├─ PostgreSQL:     postgresql://$DB_HOST:$DB_PORT/$DB_NAME"
echo "  ├─ Redis:          redis://localhost:6379"
echo "  ├─ Qdrant:         http://localhost:6333"
echo "  ├─ Elasticsearch:  http://localhost:9200"
echo "  └─ PgAdmin:        http://localhost:5050"
echo ""
echo "🔐 CREDENTIALS:"
echo "  └─ Saved in: database/.env.db"
echo ""
echo "📝 NEXT STEPS:"
echo "  1. Source credentials: source database/.env.db"
echo "  2. Test connection:    psql \$DATABASE_URL"
echo "  3. View logs:          docker-compose -f database/docker/docker-compose.db.yml logs -f"
echo ""
echo "🚀 Ready to start AURA OSINT backend!"
echo ""
```

---

## 💾 SCRIPT DE BACKUP AUTOMATIQUE

```bash
#!/bin/bash
# backup_database.sh

source database/.env.db

BACKUP_DIR="database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/aura_osint_backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_FILE"

PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --compress=9 \
    | gzip > "$BACKUP_FILE"

echo "✅ Backup complete: $BACKUP_FILE"

# Garder uniquement les 7 derniers backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
```

---

## 🚀 COMMANDES D'UTILISATION

```bash
# 1. Installation complète
chmod +x database/scripts/setup_database.sh
./database/scripts/setup_database.sh

# 2. Charger credentials
source database/.env.db

# 3. Se connecter à la DB
psql $DATABASE_URL

# 4. Voir les logs
docker-compose -f database/docker/docker-compose.db.yml logs -f postgres

# 5. Backup manuel
./database/scripts/backup_database.sh

# 6. Arrêter les services
docker-compose -f database/docker/docker-compose.db.yml down

# 7. Redémarrer
docker-compose -f database/docker/docker-compose.db.yml up -d
```

---

## 📊 VALIDATION FINALE

Une fois installé, test ces queries pour valider:

```sql
-- 1. Vérifier tables créées
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Vérifier hypertables TimescaleDB
SELECT hypertable_name, num_dimensions 
FROM timescaledb_information.hypertables;

-- 3. Test insertion investigation
INSERT INTO investigations (name, description, user_id, organization_id)
VALUES (
    'Test Investigation',
    'First test case',
    (SELECT id FROM users LIMIT 1),
    '00000000-0000-0000-0000-000000000001'
) RETURNING *;

-- 4. Vérifier vue stats
SELECT * FROM v_investigations_stats;
```

---

**🎯 LANCE LE SCRIPT ET TU AURAS LA DB LA PLUS BADASS DU MARCHÉ OSINT!** 🔥

Prêt à lancer? Dis-moi si tu veux que j'ajoute d'autres optimisations!