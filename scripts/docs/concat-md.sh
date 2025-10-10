#!/usr/bin/env bash
set -euo pipefail
# Concatène des sources Markdown en un fichier cible avec en-tête et provenance.
# Usage: concat-md.sh <target> <src1> <src2> ...
target="${1:-}"; shift || true
[ -z "${target}" ] && { echo "Usage: $0 <target> <src1> <src2> ..."; exit 1; }

outdir="$(dirname "$target")"
mkdir -p "$outdir"

# En-tête avec provenance
{
  echo "# $(basename "$target" .md | tr '-' ' ' | sed 's/.*/\u&/')"
  echo
  echo "> Document consolidé automatiquement. Relecture humaine requise."
  echo
  echo "## Table des matières"
  echo "- [Provenance](#provenance)"
  i=1
  for src in "$@"; do
    title="$(basename "$src")"
    echo "- [$title](#src-$i---$(echo "$title" | tr '[:upper:] ' '[:lower:]-' | tr -cd '[:alnum:]-._'))"
    i=$((i+1))
  done
  echo
  echo "## Provenance"
  for src in "$@"; do
    sha="$(git log -n 1 --pretty=format:%H -- "$src" 2>/dev/null || true)"
    url_base="$(git config --get remote.origin.url | sed -E 's#.*github.com[:/](.+)\.git#\1#')"
    path_url="$(echo "$src" | sed 's#^./##')"
    if [ -n "$sha" ]; then
      echo "- $src — commit $sha — https://github.com/${url_base}/blob/${sha}/${path_url}"
    else
      echo "- $src"
    fi
  done
  echo
} > "$target"

# Concat des sections
i=1
for src in "$@"; do
  echo "## SRC-$i — $(basename "$src")" >> "$target"
  echo >> "$target"
  # Normalise les titres pour éviter H1 multiples
  awk '
    BEGIN{ OFS=FS }
    {
      gsub(/^\#\#\#\#\#\#/, "######");
      gsub(/^\#\#\#\#\#/, "#####");
      gsub(/^\#\#\#\#/, "####");
      gsub(/^\#\#\#/, "###");
      gsub(/^\#\#/, "##");
      gsub(/^\# /, "## "); # évite H1 répétés
      print
    }
  ' "$src" >> "$target"
  echo >> "$target"
  i=$((i+1))
done

echo "Consolidé → $target"