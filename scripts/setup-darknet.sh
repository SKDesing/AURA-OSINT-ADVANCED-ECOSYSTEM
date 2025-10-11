#!/bin/bash
# AURA OSINT Darknet Infrastructure Setup Script

set -e

echo "🚀 AURA OSINT Darknet Infrastructure Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose found${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p data/{darknet-monitor,tor,qdrant,minio}
mkdir -p logs/{darknet-monitor,tor}
mkdir -p backup/darknet

# Set proper permissions
chmod 700 data/tor
chmod 755 data/{darknet-monitor,qdrant,minio}
chmod 755 logs/{darknet-monitor,tor}

echo -e "${GREEN}✅ Directories created${NC}"

# Generate secure passwords if .env.darknet doesn't exist
if [ ! -f .env.darknet ]; then
    echo -e "${BLUE}🔐 Generating secure passwords...${NC}"
    
    # Generate random passwords
    DB_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    REDIS_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    MINIO_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    TOR_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    ENCRYPT_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    
    # Create .env.darknet with generated passwords
    cat > .env.darknet << EOF
# AURA OSINT Darknet Environment Variables - Generated $(date)
DARKNET_DB_PASSWORD=${DB_PASS}
DARKNET_REDIS_PASSWORD=${REDIS_PASS}
MINIO_ROOT_USER=darknet_admin
MINIO_ROOT_PASSWORD=${MINIO_PASS}
TOR_CONTROL_PASSWORD=${TOR_PASS}
ENCRYPTION_KEY=${ENCRYPT_KEY}
JWT_SECRET=${JWT_SECRET}

# API Keys (add your own)
HIBP_API_KEY=your_hibp_api_key_here
DEHASHED_API_KEY=your_dehashed_api_key_here
SNUSBASE_API_KEY=your_snusbase_api_key_here
BLOCKCHAIN_INFO_API=your_blockchain_info_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Security Settings
RATE_LIMIT_REQUESTS_PER_MINUTE=60
LOG_LEVEL=INFO
LOG_RETENTION_DAYS=30
BACKUP_ENABLED=true
EOF
    
    chmod 600 .env.darknet
    echo -e "${GREEN}✅ Secure passwords generated and saved to .env.darknet${NC}"
else
    echo -e "${YELLOW}⚠️  .env.darknet already exists, skipping password generation${NC}"
fi

# Generate Tor hashed password
echo -e "${BLUE}🔐 Generating Tor hashed password...${NC}"
TOR_PASS=$(grep TOR_CONTROL_PASSWORD .env.darknet | cut -d'=' -f2)
TOR_HASH=$(echo -n "$TOR_PASS" | tor --hash-password | grep "16:")

# Update torrc with generated hash
sed -i "s/HashedControlPassword.*/HashedControlPassword $TOR_HASH/" tor-config/torrc

echo -e "${GREEN}✅ Tor configuration updated${NC}"

# Check if main database is running
if docker ps | grep -q "aura-postgres"; then
    echo -e "${GREEN}✅ Main PostgreSQL database is running${NC}"
else
    echo -e "${YELLOW}⚠️  Main PostgreSQL database not running. Starting it first...${NC}"
    docker-compose up -d postgres
    sleep 10
fi

# Setup Qdrant collections
echo -e "${BLUE}🔍 Setting up Qdrant collections...${NC}"
if [ -f database/qdrant-darknet-collections.py ]; then
    python3 database/qdrant-darknet-collections.py
    echo -e "${GREEN}✅ Qdrant collections configured${NC}"
else
    echo -e "${YELLOW}⚠️  Qdrant collections script not found${NC}"
fi

# Start darknet infrastructure
echo -e "${BLUE}🐳 Starting darknet infrastructure...${NC}"
docker-compose -f docker-compose.darknet-secure.yml --env-file .env.darknet up -d

# Wait for services to start
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 30

# Health checks
echo -e "${BLUE}🏥 Performing health checks...${NC}"

# Check Tor proxy
if curl --socks5 127.0.0.1:9050 --max-time 10 -s https://check.torproject.org/api/ip | grep -q "true"; then
    echo -e "${GREEN}✅ Tor proxy is working${NC}"
else
    echo -e "${RED}❌ Tor proxy health check failed${NC}"
fi

# Check PostgreSQL
if docker exec aura-darknet-db-secure pg_isready -U darknet_analyst -d darknet_intel > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
else
    echo -e "${RED}❌ PostgreSQL health check failed${NC}"
fi

# Check Redis
if docker exec aura-darknet-redis-secure redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is ready${NC}"
else
    echo -e "${RED}❌ Redis health check failed${NC}"
fi

# Check Qdrant
if curl -s http://127.0.0.1:6334/collections > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Qdrant is ready${NC}"
else
    echo -e "${RED}❌ Qdrant health check failed${NC}"
fi

# Setup database schema
echo -e "${BLUE}🗄️  Setting up database schema...${NC}"
if [ -f database/darknet-schema.sql ]; then
    docker exec -i aura-darknet-db-secure psql -U darknet_analyst -d darknet_intel < database/darknet-schema.sql
    echo -e "${GREEN}✅ Database schema applied${NC}"
else
    echo -e "${YELLOW}⚠️  Database schema file not found${NC}"
fi

# Display connection information
echo -e "\n${GREEN}🎉 Darknet infrastructure setup completed!${NC}"
echo -e "\n${BLUE}📊 Service Endpoints:${NC}"
echo "  Tor SOCKS5 Proxy: 127.0.0.1:9050"
echo "  Tor Control Port: 127.0.0.1:9051"
echo "  PostgreSQL: 127.0.0.1:5434"
echo "  Redis: 127.0.0.1:6380"
echo "  Qdrant: http://127.0.0.1:6334"
echo "  MinIO Console: http://127.0.0.1:9001"

echo -e "\n${BLUE}🔐 Security Notes:${NC}"
echo "  - All passwords are in .env.darknet (keep secure!)"
echo "  - Services are bound to localhost only"
echo "  - Tor circuits exclude high-risk countries"
echo "  - All containers run as non-root users"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo "  1. Add your API keys to .env.darknet"
echo "  2. Test Tor connection: curl --socks5 127.0.0.1:9050 https://check.torproject.org/api/ip"
echo "  3. Access Qdrant dashboard: http://127.0.0.1:6334/dashboard"
echo "  4. Start OSINT investigations!"

echo -e "\n${GREEN}✅ Setup completed successfully!${NC}"