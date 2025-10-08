#!/bin/bash
# AURA Services Health Check Script

echo "🚦 AURA SERVICES HEALTH CHECK"
echo "============================="

# Check PostgreSQL
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL: RUNNING"
else
    echo "❌ PostgreSQL: STOPPED"
fi

# Check Redis
if systemctl is-active --quiet redis-server; then
    echo "✅ Redis: RUNNING"
else
    echo "❌ Redis: STOPPED"
fi

# Check Backend Ports
if lsof -i:3000 >/dev/null 2>&1; then
    echo "✅ GUI (3000): RUNNING"
else
    echo "❌ GUI (3000): STOPPED"
fi

if lsof -i:4002 >/dev/null 2>&1; then
    echo "✅ Analytics (4002): RUNNING"
else
    echo "❌ Analytics (4002): STOPPED"
fi

# Check Critical Files
if [ -d "database/schemas" ]; then
    echo "✅ Database schemas: OK"
else
    echo "❌ Database schemas: MISSING"
fi

if [ -d "engines/tiktok" ]; then
    echo "✅ TikTok engine: OK"
else
    echo "❌ TikTok engine: MISSING"
fi

if [ -d "shared/database" ]; then
    echo "✅ Shared database: OK"
else
    echo "❌ Shared database: MISSING"
fi

echo "============================="
echo "🔍 Use: npm run health for detailed check"