#!/usr/bin/env bash
set -euo pipefail
# Usage: scripts/osint/run-amass.sh exemple.com [--passive]
domain="${1:-}"
[ -z "$domain" ] && { echo "Usage: $0 <domain> [--passive]"; exit 1; }
passive=""; [ "${2:-}" = "--passive" ] && passive="-passive"

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
WORK_DIR="$(mktemp -d "$ROOT_DIR/var/osint/work/amass-XXXX")"
OUT="$WORK_DIR/amass.json"

docker run --rm --network host -v "$WORK_DIR":/data caffix/amass \
  enum -d "$domain" -json /data/amass.json $passive

echo "Résultat: $OUT"
jq -r 'try .name' "$OUT" 2>/dev/null | sed '/^null$/d' | sort -u | head -n 20