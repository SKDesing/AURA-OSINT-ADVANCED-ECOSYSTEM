#!/usr/bin/env bash
set -euo pipefail

TAG=${1:-}
if [ -z "$TAG" ]; then
    echo "Usage: $0 <tag> (e.g., browser-v1.0.0)"
    exit 1
fi

echo "🔐 Validating SBOM + OIDC Attestation for $TAG"

# Repository info
OWNER="SKDesing"
REPO="AURA-OSINT-ADVANCED-ECOSYSTEM"
REPO_URL="git+https://github.com/$OWNER/$REPO@$TAG"
WORKFLOW_IDENTITY="https://github.com/$OWNER/$REPO/.github/workflows/sbom.yml@refs/tags/$TAG"

# Check if cosign is installed
if ! command -v cosign >/dev/null 2>&1; then
    echo "❌ cosign not found. Install with:"
    echo "   brew install cosign"
    echo "   # or"
    echo "   go install github.com/sigstore/cosign/v2/cmd/cosign@latest"
    exit 1
fi

echo "✅ cosign found: $(cosign version --short 2>/dev/null || cosign version)"

# Verify CycloneDX attestation
echo ""
echo "🔍 Verifying CycloneDX SBOM attestation..."
if cosign verify-attestation \
    --type cyclonedx \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    --certificate-identity "$WORKFLOW_IDENTITY" \
    "$REPO_URL" 2>/dev/null; then
    echo "✅ CycloneDX attestation verified"
else
    echo "❌ CycloneDX attestation verification failed"
    echo "   Check that:"
    echo "   - Tag $TAG exists and triggered SBOM workflow"
    echo "   - SBOM workflow completed successfully"
    echo "   - OIDC permissions (id-token: write) are configured"
fi

# Verify SPDX attestation
echo ""
echo "🔍 Verifying SPDX SBOM attestation..."
if cosign verify-attestation \
    --type spdx \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    --certificate-identity "$WORKFLOW_IDENTITY" \
    "$REPO_URL" 2>/dev/null; then
    echo "✅ SPDX attestation verified"
else
    echo "❌ SPDX attestation verification failed"
    echo "   Check that:"
    echo "   - Tag $TAG exists and triggered SBOM workflow"
    echo "   - SBOM workflow completed successfully"
    echo "   - OIDC permissions (id-token: write) are configured"
fi

# Check GitHub release assets
echo ""
echo "📦 Checking GitHub release assets..."
if command -v gh >/dev/null 2>&1; then
    RELEASE_ASSETS=$(gh release view "$TAG" --json assets --jq '.assets[].name' 2>/dev/null || echo "")
    
    if echo "$RELEASE_ASSETS" | grep -q "aura-sbom.cdx.json"; then
        echo "✅ CycloneDX SBOM attached to release"
    else
        echo "❌ CycloneDX SBOM not found in release assets"
    fi
    
    if echo "$RELEASE_ASSETS" | grep -q "aura-sbom.spdx.json"; then
        echo "✅ SPDX SBOM attached to release"
    else
        echo "❌ SPDX SBOM not found in release assets"
    fi
    
    echo ""
    echo "📋 All release assets:"
    echo "$RELEASE_ASSETS" | sed 's/^/  - /'
else
    echo "⚠️ GitHub CLI not available, skipping release assets check"
fi

# Verify transparency log entry
echo ""
echo "🔍 Checking transparency log entries..."
if cosign tree "$REPO_URL" 2>/dev/null; then
    echo "✅ Transparency log entries found"
else
    echo "⚠️ No transparency log entries found (may take time to propagate)"
fi

echo ""
echo "🎯 Validation Summary for $TAG:"
echo "  - Repository: $OWNER/$REPO"
echo "  - Tag: $TAG"
echo "  - Workflow: sbom.yml"
echo "  - OIDC Issuer: GitHub Actions"
echo ""
echo "🔗 Useful commands:"
echo "  # View attestations"
echo "  cosign tree $REPO_URL"
echo ""
echo "  # Download SBOM"
echo "  gh release download $TAG --pattern '*.json'"