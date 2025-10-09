#!/usr/bin/env bash
set -euo pipefail
echo "🔍 AURA Post-push Verify"

# SBOM & licenses (requires syft and licensee or node alternatives)
if command -v syft >/dev/null 2>&1; then
  syft packages dir:. -o json > reports/SBOM.json || true
fi

# Secret scan (gitleaks if available)
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect -v --redact --no-git -c gitleaks.toml || true
fi

# Node audits (npm/pnpm)
if [ -f package.json ]; then
  (npm audit --omit=dev || true)
fi

# Existing quality checks (best-effort)
[ -f scripts/analysis/obsolete-scanner.js ] && node scripts/analysis/obsolete-scanner.js --json --markdown || true
[ -f scripts/analysis/front-inventory.js ] && node scripts/analysis/front-inventory.js --markdown --json || true
[ -f scripts/ai/registry-diff.js ] && node scripts/ai/registry-diff.js || true
[ -f scripts/ai/validate-preintel.js ] && node scripts/ai/validate-preintel.js || true
npm run -s ai:router:validate || true
npm run -s ai:router:bench || true
[ -f scripts/docs/validate-links.js ] && node scripts/docs/validate-links.js || true

echo "✅ Post-push checks complete. See reports/"