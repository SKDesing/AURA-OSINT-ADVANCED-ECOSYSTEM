#!/bin/bash
# AURA Complete Startup Script

echo "🚀 STARTING AURA ECOSYSTEM"
echo "=========================="

# Start Redis if not running
if ! systemctl is-active --quiet redis-server; then
    echo "🔄 Starting Redis..."
    sudo systemctl start redis-server
fi

# Start Backend Analytics API
echo "🔄 Starting Backend Analytics..."
nohup node backend/api/analytics-api.js > logs/analytics.log 2>&1 &
sleep 2

# Start GUI Launcher
echo "🔄 Starting GUI Launcher..."
nohup node scripts/setup/gui-launcher.js > logs/gui.log 2>&1 &
sleep 2

# Start Health Monitoring
echo "🔄 Starting Health Monitor..."
nohup node monitoring/health-checks.js > logs/health.log 2>&1 &

echo "✅ AURA Services Started"
echo "📊 Check status: bash scripts/check-services.sh"
echo "🔍 Health check: npm run health"