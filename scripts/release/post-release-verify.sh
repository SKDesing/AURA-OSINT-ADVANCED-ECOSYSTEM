#!/usr/bin/env bash
set -euo pipefail

VERSION=${1:-}
if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version> (e.g., 1.0.0)"
    exit 1
fi

echo "🔍 Post-release verification for AURA Browser v$VERSION"

# Check if release exists
REPO_URL=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')
RELEASE_URL="https://api.github.com/repos/$REPO_URL/releases/tags/browser-v$VERSION"

echo "📡 Checking GitHub release..."
if curl -sf "$RELEASE_URL" >/dev/null 2>&1; then
    echo "✅ Release browser-v$VERSION exists"
    
    # Get release info
    RELEASE_INFO=$(curl -s "$RELEASE_URL")
    ASSET_COUNT=$(echo "$RELEASE_INFO" | jq '.assets | length')
    echo "📦 Assets found: $ASSET_COUNT"
    
    # List assets
    echo "$RELEASE_INFO" | jq -r '.assets[].name' | while read -r asset; do
        echo "  - $asset"
    done
else
    echo "❌ Release browser-v$VERSION not found"
    exit 1
fi

# Check SBOM attachment
echo "🔍 Checking SBOM..."
if echo "$RELEASE_INFO" | jq -r '.assets[].name' | grep -q "aura-sbom.spdx.json"; then
    echo "✅ SBOM attached to release"
else
    echo "⚠️ SBOM not found in release assets"
fi

# Verify CI workflows
echo "🔄 Checking CI status..."
WORKFLOWS_URL="https://api.github.com/repos/$REPO_URL/actions/runs?event=push&branch=main"
LATEST_RUN=$(curl -s "$WORKFLOWS_URL" | jq -r '.workflow_runs[0]')

if [ "$LATEST_RUN" != "null" ]; then
    STATUS=$(echo "$LATEST_RUN" | jq -r '.status')
    CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.conclusion')
    echo "📊 Latest CI run: $STATUS ($CONCLUSION)"
    
    if [ "$CONCLUSION" = "success" ]; then
        echo "✅ CI pipeline successful"
    else
        echo "⚠️ CI pipeline issues detected"
    fi
else
    echo "⚠️ No recent CI runs found"
fi

# Check nightly benchmark artifacts
echo "📈 Checking benchmark artifacts..."
NIGHTLY_URL="https://api.github.com/repos/$REPO_URL/actions/workflows/nightly-benchmark.yml/runs"
NIGHTLY_RUNS=$(curl -s "$NIGHTLY_URL" | jq -r '.workflow_runs[0]')

if [ "$NIGHTLY_RUNS" != "null" ]; then
    NIGHTLY_STATUS=$(echo "$NIGHTLY_RUNS" | jq -r '.conclusion')
    NIGHTLY_DATE=$(echo "$NIGHTLY_RUNS" | jq -r '.created_at')
    echo "📊 Latest nightly benchmark: $NIGHTLY_STATUS ($NIGHTLY_DATE)"
    
    if [ "$NIGHTLY_STATUS" = "success" ]; then
        echo "✅ Nightly benchmarks passing"
    else
        echo "⚠️ Nightly benchmark issues"
    fi
else
    echo "⚠️ No nightly benchmark runs found"
fi

# Security checks
echo "🛡️ Security verification..."

# Check for recent security alerts
ALERTS_URL="https://api.github.com/repos/$REPO_URL/dependabot/alerts?state=open"
if command -v gh >/dev/null 2>&1; then
    ALERT_COUNT=$(gh api "$ALERTS_URL" --jq 'length' 2>/dev/null || echo "0")
    if [ "$ALERT_COUNT" -eq 0 ]; then
        echo "✅ No open security alerts"
    else
        echo "⚠️ $ALERT_COUNT open security alerts"
    fi
else
    echo "⚠️ GitHub CLI not available, skipping security alerts check"
fi

# Performance validation
echo "📊 Performance validation..."
if [ -f "reports/benchmarks/ingest-latency.json" ]; then
    P95=$(jq -r '.latency.p95' reports/benchmarks/ingest-latency.json)
    THROUGHPUT=$(jq -r '.actual.ratePerMin' reports/benchmarks/ingest-latency.json)
    
    echo "📈 Latest benchmark results:"
    echo "  - Throughput: $THROUGHPUT/min"
    echo "  - P95 Latency: ${P95}ms"
    
    if (( $(echo "$P95 <= 800" | bc -l) )); then
        echo "✅ Performance SLO met (P95 ≤ 800ms)"
    else
        echo "❌ Performance SLO violation (P95 > 800ms)"
    fi
    
    if (( $(echo "$THROUGHPUT >= 120000" | bc -l) )); then
        echo "✅ Throughput target met (≥120k/min)"
    else
        echo "⚠️ Throughput below target (<120k/min)"
    fi
else
    echo "⚠️ No recent benchmark data found"
fi

echo ""
echo "🎯 Post-release verification complete for v$VERSION"
echo "📊 Summary:"
echo "  - Release: $([ -n "$RELEASE_INFO" ] && echo "✅ Published" || echo "❌ Missing")"
echo "  - SBOM: $(echo "$RELEASE_INFO" | jq -r '.assets[].name' | grep -q "sbom" && echo "✅ Attached" || echo "⚠️ Missing")"
echo "  - CI: $([ "$CONCLUSION" = "success" ] && echo "✅ Passing" || echo "⚠️ Issues")"
echo "  - Security: $([ "$ALERT_COUNT" -eq 0 ] 2>/dev/null && echo "✅ Clean" || echo "⚠️ Alerts")"
echo ""
echo "🔗 Release URL: https://github.com/$REPO_URL/releases/tag/browser-v$VERSION"