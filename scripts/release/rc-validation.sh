#!/usr/bin/env bash
set -euo pipefail

RC_TAG=${1:-"browser-v1.0.0-rc.1"}

echo "🧪 RC End-to-End Validation: $RC_TAG"

# Check if RC release exists
echo "📡 Checking RC release..."
if gh release view "$RC_TAG" >/dev/null 2>&1; then
    echo "✅ RC release exists: $RC_TAG"
    
    # Check if it's marked as pre-release
    IS_PRERELEASE=$(gh release view "$RC_TAG" --json isPrerelease --jq '.isPrerelease')
    if [ "$IS_PRERELEASE" = "true" ]; then
        echo "✅ Marked as pre-release"
    else
        echo "⚠️ Not marked as pre-release"
    fi
    
    # List assets
    echo "📦 RC Assets:"
    gh release view "$RC_TAG" --json assets --jq '.assets[].name' | sed 's/^/  - /'
    
else
    echo "❌ RC release not found: $RC_TAG"
    exit 1
fi

# Validate SBOM + attestation
echo ""
echo "🔐 Validating SBOM + OIDC attestation..."
if command -v cosign >/dev/null 2>&1; then
    ./scripts/release/validate-cosign-attestation.sh "$RC_TAG"
else
    echo "⚠️ cosign not available, skipping attestation validation"
fi

# Check CI status for RC tag
echo ""
echo "🔄 Checking CI status for RC..."
WORKFLOW_RUNS=$(gh run list --event=push --limit=5 --json status,conclusion,workflowName,headSha)
echo "Recent workflow runs:"
echo "$WORKFLOW_RUNS" | jq -r '.[] | "  - \(.workflowName): \(.status) (\(.conclusion // "running"))"'

# Validate release notes injection
echo ""
echo "📄 Checking release notes..."
RELEASE_BODY=$(gh release view "$RC_TAG" --json body --jq '.body')
if echo "$RELEASE_BODY" | grep -q "Performance Validated"; then
    echo "✅ Release notes template injected"
    
    # Check for metrics
    if echo "$RELEASE_BODY" | grep -q "Latency P95"; then
        echo "✅ Performance metrics included"
    else
        echo "⚠️ Performance metrics missing"
    fi
else
    echo "❌ Release notes template not injected"
fi

# Check for SBOM files in release
echo ""
echo "📋 Validating SBOM files..."
ASSETS=$(gh release view "$RC_TAG" --json assets --jq '.assets[].name')
if echo "$ASSETS" | grep -q "aura-sbom.cdx.json"; then
    echo "✅ CycloneDX SBOM attached"
else
    echo "❌ CycloneDX SBOM missing"
fi

if echo "$ASSETS" | grep -q "aura-sbom.spdx.json"; then
    echo "✅ SPDX SBOM attached"
else
    echo "❌ SPDX SBOM missing"
fi

# Summary
echo ""
echo "🎯 RC Validation Summary:"
echo "  - Release: $([ -n "$RELEASE_BODY" ] && echo "✅ Published" || echo "❌ Missing")"
echo "  - Pre-release: $([ "$IS_PRERELEASE" = "true" ] && echo "✅ Marked" || echo "⚠️ Not marked")"
echo "  - SBOM: $(echo "$ASSETS" | grep -q "sbom" && echo "✅ Attached" || echo "❌ Missing")"
echo "  - Release Notes: $(echo "$RELEASE_BODY" | grep -q "Performance" && echo "✅ Injected" || echo "❌ Missing")"
echo ""
echo "🚀 Ready for GA if all checks pass"
echo "   Next: git tag browser-v1.0.0 && git push origin browser-v1.0.0"