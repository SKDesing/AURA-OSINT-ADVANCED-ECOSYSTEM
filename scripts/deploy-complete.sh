#!/bin/bash

# AURA OSINT - Complete Deployment Script
# Deploys the entire AURA OSINT ecosystem with all components

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_header() {
    echo -e "\n${WHITE}${BLUE}================================================${NC}"
    echo -e "${WHITE}${BLUE} $1${NC}"
    echo -e "${WHITE}${BLUE}================================================${NC}"
}

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_MODE="${1:-development}"  # development, staging, production

# Deployment configuration
case $DEPLOY_MODE in
    "production")
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_FILE=".env.production"
        ;;
    "staging")
        COMPOSE_FILE="docker-compose.staging.yml"
        ENV_FILE=".env.staging"
        ;;
    *)
        COMPOSE_FILE="docker-compose.yml"
        ENV_FILE=".env"
        DEPLOY_MODE="development"
        ;;
esac

log_header "AURA OSINT - COMPLETE DEPLOYMENT"
log_info "Mode: $DEPLOY_MODE"
log_info "Project Root: $PROJECT_ROOT"
log_info "Compose File: $COMPOSE_FILE"

cd "$PROJECT_ROOT"

# Step 1: Prerequisites Check
log_header "STEP 1: PREREQUISITES CHECK"

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed"
    exit 1
fi
log_success "Docker found: $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed"
    exit 1
fi
log_success "Docker Compose found: $(docker-compose --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    log_error "Python 3 is not installed"
    exit 1
fi
log_success "Python found: $(python3 --version)"

# Check Node.js (for NestJS)
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed"
    exit 1
fi
log_success "Node.js found: $(node --version)"

# Step 2: Environment Setup
log_header "STEP 2: ENVIRONMENT SETUP"

# Create environment file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    log_info "Creating environment file: $ENV_FILE"
    cp .env.example "$ENV_FILE"
    log_success "Environment file created"
else
    log_success "Environment file exists: $ENV_FILE"
fi

# Generate secrets if needed
if ! grep -q "JWT_SECRET=" "$ENV_FILE" || grep -q "JWT_SECRET=your_jwt_secret_here" "$ENV_FILE"; then
    log_info "Generating JWT secret..."
    JWT_SECRET=$(openssl rand -hex 32)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
    log_success "JWT secret generated"
fi

if ! grep -q "ENCRYPTION_KEY=" "$ENV_FILE" || grep -q "ENCRYPTION_KEY=your_encryption_key_here" "$ENV_FILE"; then
    log_info "Generating encryption key..."
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" "$ENV_FILE"
    log_success "Encryption key generated"
fi

# Step 3: Dependencies Installation
log_header "STEP 3: DEPENDENCIES INSTALLATION"

# Install Python dependencies
if [ -f "scripts/install-dependencies.sh" ]; then
    log_info "Installing system and Python dependencies..."
    chmod +x scripts/install-dependencies.sh
    ./scripts/install-dependencies.sh
    log_success "Dependencies installed"
else
    log_warning "Dependencies script not found, installing manually..."
    
    # Install Python packages
    if [ -f "backend/requirements-complete.txt" ]; then
        pip3 install -r backend/requirements-complete.txt
        log_success "Python packages installed"
    else
        log_error "requirements-complete.txt not found"
        exit 1
    fi
fi

# Install Node.js dependencies for NestJS
if [ -d "backend-ai" ]; then
    log_info "Installing NestJS dependencies..."
    cd backend-ai
    npm install
    cd "$PROJECT_ROOT"
    log_success "NestJS dependencies installed"
fi

# Step 4: Docker Services
log_header "STEP 4: DOCKER SERVICES DEPLOYMENT"

# Stop existing services
log_info "Stopping existing services..."
docker-compose down --remove-orphans 2>/dev/null || true

# Pull latest images
log_info "Pulling Docker images..."
docker-compose -f "$COMPOSE_FILE" pull

# Start core services first
log_info "Starting core services (PostgreSQL, Redis, Qdrant)..."
docker-compose -f "$COMPOSE_FILE" up -d postgres redis qdrant

# Wait for databases to be ready
log_info "Waiting for databases to be ready..."
sleep 10

# Check PostgreSQL
for i in {1..30}; do
    if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U aura_user -d aura_osint; then
        log_success "PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "PostgreSQL failed to start"
        exit 1
    fi
    sleep 2
done

# Check Redis
for i in {1..30}; do
    if docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping | grep -q PONG; then
        log_success "Redis is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Redis failed to start"
        exit 1
    fi
    sleep 2
done

# Check Qdrant
for i in {1..30}; do
    if curl -s http://localhost:6333/collections >/dev/null 2>&1; then
        log_success "Qdrant is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Qdrant failed to start"
        exit 1
    fi
    sleep 2
done

# Step 5: Database Setup
log_header "STEP 5: DATABASE SETUP"

# Apply database schema
if [ -f "database/schema-hybrid-final.sql" ]; then
    log_info "Applying database schema..."
    docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U aura_user -d aura_osint < database/schema-hybrid-final.sql
    log_success "Database schema applied"
else
    log_error "Database schema file not found"
    exit 1
fi

# Setup Qdrant collections
if [ -f "database/qdrant-darknet-collections.py" ]; then
    log_info "Setting up Qdrant collections..."
    python3 database/qdrant-darknet-collections.py --host localhost --port 6333
    log_success "Qdrant collections created"
else
    log_error "Qdrant collections script not found"
    exit 1
fi

# Step 6: Application Services
log_header "STEP 6: APPLICATION SERVICES"

# Start Elasticsearch if needed
if grep -q "elasticsearch:" "$COMPOSE_FILE"; then
    log_info "Starting Elasticsearch..."
    docker-compose -f "$COMPOSE_FILE" up -d elasticsearch
    
    # Wait for Elasticsearch
    for i in {1..60}; do
        if curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green\|yellow"'; then
            log_success "Elasticsearch is ready"
            break
        fi
        if [ $i -eq 60 ]; then
            log_warning "Elasticsearch took too long to start"
        fi
        sleep 3
    done
fi

# Start all remaining services
log_info "Starting all application services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Step 7: Health Checks
log_header "STEP 7: HEALTH CHECKS"

# Wait for services to be ready
sleep 15

# Check NestJS backend
if curl -s http://localhost:3000/health >/dev/null 2>&1; then
    log_success "NestJS backend is healthy"
else
    log_warning "NestJS backend not responding (may still be starting)"
fi

# Check FastAPI orchestrator
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    log_success "FastAPI orchestrator is healthy"
else
    log_warning "FastAPI orchestrator not responding (may still be starting)"
fi

# Step 8: Infrastructure Tests
log_header "STEP 8: INFRASTRUCTURE TESTS"

if [ -f "tests/test_infrastructure_complete.py" ]; then
    log_info "Running infrastructure tests..."
    python3 tests/test_infrastructure_complete.py
    
    if [ $? -eq 0 ]; then
        log_success "Infrastructure tests passed"
    else
        log_warning "Some infrastructure tests failed (check output above)"
    fi
else
    log_warning "Infrastructure test script not found"
fi

# Step 9: Final Status
log_header "DEPLOYMENT COMPLETE"

log_success "🎉 AURA OSINT deployment completed successfully!"

echo -e "\n${WHITE}📊 Service Status:${NC}"
echo -e "  ${GREEN}✅ PostgreSQL:${NC} http://localhost:5433"
echo -e "  ${GREEN}✅ Redis:${NC} http://localhost:6379"
echo -e "  ${GREEN}✅ Qdrant:${NC} http://localhost:6333"
echo -e "  ${GREEN}✅ NestJS API:${NC} http://localhost:3000"
echo -e "  ${GREEN}✅ FastAPI:${NC} http://localhost:8000"

if grep -q "elasticsearch:" "$COMPOSE_FILE"; then
    echo -e "  ${GREEN}✅ Elasticsearch:${NC} http://localhost:9200"
fi

if grep -q "kibana:" "$COMPOSE_FILE"; then
    echo -e "  ${GREEN}✅ Kibana:${NC} http://localhost:5601"
fi

echo -e "\n${WHITE}🔧 Management Commands:${NC}"
echo -e "  View logs: ${CYAN}docker-compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "  Stop services: ${CYAN}docker-compose -f $COMPOSE_FILE down${NC}"
echo -e "  Restart services: ${CYAN}docker-compose -f $COMPOSE_FILE restart${NC}"
echo -e "  Scale services: ${CYAN}docker-compose -f $COMPOSE_FILE up -d --scale backend=3${NC}"

echo -e "\n${WHITE}📚 Documentation:${NC}"
echo -e "  API Docs: ${CYAN}http://localhost:3000/api${NC}"
echo -e "  Swagger UI: ${CYAN}http://localhost:8000/docs${NC}"
echo -e "  Qdrant UI: ${CYAN}http://localhost:6333/dashboard${NC}"

echo -e "\n${WHITE}🚀 Next Steps:${NC}"
echo -e "  1. Access the API at http://localhost:3000"
echo -e "  2. Start your first OSINT investigation"
echo -e "  3. Monitor system performance"
echo -e "  4. Scale as needed"

if [ "$DEPLOY_MODE" = "production" ]; then
    echo -e "\n${YELLOW}⚠️  Production Notes:${NC}"
    echo -e "  - Ensure firewall rules are configured"
    echo -e "  - Set up SSL/TLS certificates"
    echo -e "  - Configure monitoring and alerting"
    echo -e "  - Set up backup procedures"
    echo -e "  - Review security settings"
fi

log_success "Deployment completed in $DEPLOY_MODE mode"