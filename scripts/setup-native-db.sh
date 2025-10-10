#!/usr/bin/env bash
set -euo pipefail

echo "🚀 AURA Native DB Setup (sans Docker)"

# Check if PostgreSQL is installed
if ! command -v psql >/dev/null 2>&1; then
    echo "❌ PostgreSQL not installed. Install with:"
    echo "sudo apt update && sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Check if Redis is installed  
if ! command -v redis-cli >/dev/null 2>&1; then
    echo "❌ Redis not installed. Install with:"
    echo "sudo apt update && sudo apt install redis-server"
    exit 1
fi

echo "✅ PostgreSQL and Redis found"

# Start services if not running
sudo systemctl start postgresql || true
sudo systemctl start redis-server || true

echo "✅ Services started"

# Create databases (using existing postgres user)
sudo -u postgres psql -c "CREATE DATABASE aura_dev_api;" 2>/dev/null || echo "DB aura_dev_api already exists"
sudo -u postgres psql -c "CREATE DATABASE aura_dev_tracker;" 2>/dev/null || echo "DB aura_dev_tracker already exists"
sudo -u postgres psql -c "CREATE DATABASE aura_dev_grafana;" 2>/dev/null || echo "DB aura_dev_grafana already exists"

# Create roles
sudo -u postgres psql -c "CREATE ROLE aura_rw_api LOGIN PASSWORD 'dev_password';" 2>/dev/null || echo "Role aura_rw_api already exists"
sudo -u postgres psql -c "CREATE ROLE aura_ro_api LOGIN PASSWORD 'dev_password';" 2>/dev/null || echo "Role aura_ro_api already exists"

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aura_dev_api TO aura_rw_api;"
sudo -u postgres psql -c "GRANT CONNECT ON DATABASE aura_dev_api TO aura_ro_api;"

echo "✅ Databases and roles created"

# Test connectivity
PGPASSWORD=dev_password psql -h localhost -U aura_rw_api -d aura_dev_api -c "SELECT 1;" >/dev/null
redis-cli ping >/dev/null

echo "✅ Connectivity test passed"
echo "🎉 Native DB setup complete!"
echo ""
echo "Connection strings:"
echo "API_DATABASE_URL=postgresql://aura_rw_api:dev_password@localhost:5432/aura_dev_api"
echo "API_REDIS_URL=redis://localhost:6379/0"