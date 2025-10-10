#!/usr/bin/env bash
set -euo pipefail

# Prépare l'arborescence et vérifie que Docker est prêt.
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

mkdir -p "$ROOT_DIR/var/osint/work" \
         "$ROOT_DIR/var/osint/results" \
         "$ROOT_DIR/var/osint/logs" \
         "$ROOT_DIR/var/osint/spiderfoot" \
         "$ROOT_DIR/var/osint/phoneinfoga" \
         "$ROOT_DIR/config/osint"

echo "✓ Dossiers var/osint/ initialisés"

if ! command -v docker >/dev/null 2>&1; then
  echo "✗ Docker manquant. Installez Docker puis relancez." >&2
  exit 1
fi

echo "→ Pull des images de base (peut prendre du temps)…"
docker pull caffix/amass:latest >/dev/null || true
docker pull projectdiscovery/subfinder:latest >/dev/null || true
docker pull spiderfoot/spiderfoot:latest >/dev/null 2>&1 || true
docker pull sundowndev/phoneinfoga:latest >/dev/null 2>&1 || true

echo "✓ Images principales disponibles (si pull échoue, elles seront tirées à la demande)"
echo "OK"