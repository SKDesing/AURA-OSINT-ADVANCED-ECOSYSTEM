#!/usr/bin/env bash
set -euo pipefail

echo "🔪 Killing ports 3000 and 4011..."

for port in 3000 4011; do
    if lsof -nPiTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
        echo "Killing process on port $port"
        fuser -k ${port}/tcp || true
    else
        echo "Port $port is free"
    fi
done

echo "✅ Ports cleaned"