#!/usr/bin/env bash
set -euo pipefail

echo "🧪 AURA Browser v1.0.0 Dry-Run Validation"

# Check workflow job names for branch protection
echo "📋 Checking workflow job names for branch protection..."

WORKFLOWS=(
  ".github/workflows/benchmarks.yml:bench"
  ".github/workflows/security.yml:gitleaks"
  ".github/workflows/security.yml:dependency-review"
  ".github/workflows/codeql.yml:analyze"
  ".github/workflows/sbom.yml:sbom"
  ".github/workflows/branch-protection.yml:required-checks"
)

echo "Required status checks for branch protection:"
for workflow in "${WORKFLOWS[@]}"; do
  file="${workflow%:*}"
  job="${workflow#*:}"
  if [ -f "$file" ]; then
    echo "  ✅ $job (from $(basename "$file"))"
  else
    echo "  ❌ $job (missing file: $file)"
  fi
done

# Validate secrets requirements
echo ""
echo "🔐 Required GitHub Secrets:"
REQUIRED_SECRETS=(
  "MAC_CSC_LINK"
  "MAC_CSC_KEY_PASSWORD" 
  "APPLE_API_KEY"
  "APPLE_API_KEY_ID"
  "APPLE_API_ISSUER"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
  echo "  - $secret (required for macOS signing + notarization)"
done

echo "  - WIN_CSC_LINK (optional for Windows signing)"
echo "  - WIN_CSC_KEY_PASSWORD (optional for Windows signing)"
echo "  - SENTRY_DSN (optional for error tracking)"

# Check local build capability
echo ""
echo "🔨 Testing local build..."
if [ -d "apps/browser-electron" ]; then
  cd apps/browser-electron
  
  if [ -f "package.json" ]; then
    echo "  ✅ Electron app structure valid"
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
      echo "  ✅ Dependencies installed"
    else
      echo "  ⚠️ Dependencies not installed - run: pnpm install"
    fi
    
    # Check build configuration
    if grep -q '"build"' package.json; then
      echo "  ✅ Build configuration present"
    else
      echo "  ❌ Build configuration missing"
    fi
    
    # Check for security hardening
    if grep -q '"sandbox": true' ../*/main.js 2>/dev/null || grep -q 'sandbox: true' main/main.js 2>/dev/null; then
      echo "  ✅ Electron sandbox enabled"
    else
      echo "  ⚠️ Electron sandbox not detected"
    fi
    
  else
    echo "  ❌ package.json not found"
  fi
  
  cd ../..
else
  echo "  ❌ Electron app directory not found"
fi

# Validate SBOM workflow permissions
echo ""
echo "🔏 Validating SBOM workflow permissions..."
if [ -f ".github/workflows/sbom.yml" ]; then
  if grep -q "id-token: write" .github/workflows/sbom.yml; then
    echo "  ✅ OIDC permissions configured"
  else
    echo "  ❌ Missing id-token: write permission"
  fi
  
  if grep -q "contents: write" .github/workflows/sbom.yml; then
    echo "  ✅ Contents write permission configured"
  else
    echo "  ❌ Missing contents: write permission"
  fi
  
  if grep -q "cosign" .github/workflows/sbom.yml; then
    echo "  ✅ Cosign attestation configured"
  else
    echo "  ❌ Cosign attestation missing"
  fi
else
  echo "  ❌ SBOM workflow not found"
fi

# Check release template
echo ""
echo "📄 Validating release template..."
if [ -f ".github/RELEASE_TEMPLATE.md" ]; then
  echo "  ✅ Release template exists"
  
  # Check for placeholder variables
  PLACEHOLDERS=("{VERSION}" "{THROUGHPUT}" "{P95_LATENCY}" "{P99_LATENCY}")
  for placeholder in "${PLACEHOLDERS[@]}"; do
    if grep -q "$placeholder" .github/RELEASE_TEMPLATE.md; then
      echo "  ✅ Placeholder $placeholder found"
    else
      echo "  ⚠️ Placeholder $placeholder missing"
    fi
  done
else
  echo "  ❌ Release template not found"
fi

# Validate benchmark infrastructure
echo ""
echo "📊 Checking benchmark infrastructure..."
if [ -f "scripts/benchmarks/generate-load.ts" ]; then
  echo "  ✅ Load generator script exists"
else
  echo "  ❌ Load generator script missing"
fi

if [ -f "scripts/benchmarks/ci-benchmark.sh" ] && [ -x "scripts/benchmarks/ci-benchmark.sh" ]; then
  echo "  ✅ CI benchmark script executable"
else
  echo "  ❌ CI benchmark script missing or not executable"
fi

# Check for backend server
echo ""
echo "🖥️ Checking backend server..."
if [ -f "backend/mvp-server-fixed.js" ]; then
  echo "  ✅ Backend server exists"
else
  echo "  ❌ Backend server not found"
fi

# Summary
echo ""
echo "📋 Dry-Run Validation Summary:"
echo "1. Configure GitHub Secrets (macOS signing + notarization)"
echo "2. Enable branch protection with required status checks:"
echo "   - bench, gitleaks, dependency-review, analyze, sbom, required-checks"
echo "3. Test local build: cd apps/browser-electron && pnpm install && pnpm run build"
echo "4. Ready for: ./scripts/release/prepare-release.sh 1.0.0"
echo ""
echo "🎯 Next: Create pre-release tag for end-to-end validation"
echo "   git tag browser-v1.0.0-rc.1 && git push origin browser-v1.0.0-rc.1"