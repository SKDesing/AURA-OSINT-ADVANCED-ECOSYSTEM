#!/usr/bin/env bash
set -euo pipefail
# Usage: scripts/osint/run-subfinder.sh exemple.com
domain="${1:-}"
[ -z "$domain" ] && { echo "Usage: $0 <domain>"; exit 1; }

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
WORK_DIR="$(mktemp -d "$ROOT_DIR/var/osint/work/subfinder-XXXX")"
OUT="$WORK_DIR/subfinder.txt"

docker run --rm --network host -v "$WORK_DIR":/data projectdiscovery/subfinder:latest \
  -d "$domain" -o /data/subfinder.txt -silent

echo "Résultat: $OUT"
head -n 20 "$OUT" 2>/dev/null || true