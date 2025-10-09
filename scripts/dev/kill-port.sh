#!/usr/bin/env bash
# AURA – Kill process listening on a given port (Linux/macOS)
set -euo pipefail
PORT="${1:-}"
if [ -z "$PORT" ]; then
  echo "Usage: $0 <port>"
  exit 1
fi
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti tcp:"$PORT" || true)
elif command -v fuser >/dev/null 2>&1; then
  PIDS=$(fuser -n tcp "$PORT" 2>/dev/null || true)
else
  echo "lsof or fuser required."
  exit 1
fi
if [ -z "$PIDS" ]; then
  echo "No process listening on port $PORT."
  exit 0
fi
echo "Killing PIDs on port $PORT: $PIDS"
kill -9 $PIDS || true
echo "Done."