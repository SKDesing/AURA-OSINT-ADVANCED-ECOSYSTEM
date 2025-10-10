#!/usr/bin/env bash
set -euo pipefail

MANIFEST="${1:-config/ports.manifest.json}"
echo "🧹 AURA Port Cleanup"
if [[ ! -f "$MANIFEST" ]]; then
  echo "⚠️ Manifest non trouvé: $MANIFEST"
  exit 0
fi

# Extraire tous les ports du manifest (services.ports[] + externals.ports[])
readarray -t PORTS < <(jq -r '.services[].ports[]?, .externals[].ports[]?' "$MANIFEST" 2>/dev/null | sort -nu)
if [[ ${#PORTS[@]} -eq 0 ]]; then
  echo "ℹ️ Aucun port dans manifest, utilisation ports par défaut"
  PORTS=(4010 3000 54111 5432 6379 9200 5601 3001 8080)
fi

echo -n "Ports to check:"
for p in "${PORTS[@]}"; do echo -n " $p"; done
echo

for PORT in "${PORTS[@]}"; do
  if lsof -i ":$PORT" >/dev/null 2>&1; then
    PID=$(lsof -t -i ":$PORT" | head -n1 || true)
    NAME=$(ps -o comm= -p "$PID" 2>/dev/null || echo "unknown")
    echo "⚠️ Port $PORT occupé par $NAME (PID: $PID) → cleanup…"
    kill "$PID" 2>/dev/null || true
    sleep 1
    if lsof -i ":$PORT" >/dev/null 2>&1; then
      echo "  ⛔ kill doux insuffisant, kill -9"
      kill -9 "$PID" 2>/dev/null || true
    fi
  fi
  if lsof -i ":$PORT" >/dev/null 2>&1; then
    echo "❌ Port $PORT toujours occupé"
    exit 1
  else
    echo "✅ Port $PORT libre"
  fi
done

echo "🎯 All AURA ports cleaned"