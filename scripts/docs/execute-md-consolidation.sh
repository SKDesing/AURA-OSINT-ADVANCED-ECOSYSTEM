#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
MAP="$ROOT/docs/_meta/md-consolidation-map.yml"
BUILD="$ROOT/docs/_build"
ARCHIVE="$ROOT/docs/archive"

dry_run=true
if [ "${1:-}" = "--apply" ]; then dry_run=false; fi

reqs=(yq awk git)
for r in "${reqs[@]}"; do
  command -v "$r" >/dev/null 2>&1 || { echo "Manque dépendance: $r"; exit 1; }
done

mkdir -p "$BUILD" "$ARCHIVE"

echo "Lecture mapping: $MAP"
targets=$(yq -r '.targets | keys[]' "$MAP")

for tgt in $targets; do
  echo "== Cible: $tgt"
  sources=$(yq -r ".targets.\"$tgt\"[]" "$MAP")
  abssrc=()
  for s in $sources; do
    [ -f "$ROOT/$s" ] || { echo "  ! Source manquante: $s"; continue; }
    abssrc+=("$ROOT/$s")
  done
  out="$BUILD/$(basename "$tgt")"
  bash "$ROOT/scripts/docs/concat-md.sh" "$out" "${abssrc[@]}"
done

if [ "$dry_run" = false ]; then
  echo "APPLICATION: déplacement des consolidés et archivage des sources…"
  # Déplacer consolidés vers les cibles
  for tgt in $targets; do
    dest="$ROOT/$tgt"
    mkdir -p "$(dirname "$dest")"
    mv -f "$BUILD/$(basename "$tgt")" "$dest"
  done
  # Archiver les sources
  for tgt in $targets; do
    yq -r ".targets.\"$tgt\"[]" "$MAP" | while read -r s; do
      if [ -f "$ROOT/$s" ]; then
        mkdir -p "$ARCHIVE/$(dirname "$s")"
        git mv -k "$s" "$ARCHIVE/$s" 2>/dev/null || mv -f "$ROOT/$s" "$ARCHIVE/$s"
      fi
    done
  done
  echo "Fait. Vérifiez les consolidés puis ouvrez une PR."
else
  echo "Dry-run terminé. Consolidés générés sous $BUILD/. Lancez avec --apply pour appliquer."
fi