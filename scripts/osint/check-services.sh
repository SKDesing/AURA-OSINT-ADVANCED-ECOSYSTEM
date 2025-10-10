#!/bin/bash
set -e

echo "🔍 Vérification des services OSINT..."

# SpiderFoot
echo -n "SpiderFoot (5001): "
if curl -sS http://127.0.0.1:5001 >/dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ KO"
fi

# PhoneInfoga
echo -n "PhoneInfoga (5005): "
if curl -sS http://127.0.0.1:5005/ >/dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ KO"
fi

echo ""
echo "📊 État des conteneurs:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep -E "(aura_|NAMES)"