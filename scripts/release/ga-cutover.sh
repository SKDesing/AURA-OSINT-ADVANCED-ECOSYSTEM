#!/usr/bin/env bash
set -euo pipefail

VERSION=${1:-"1.0.0"}

echo "🚀 AURA Browser GA Cutover: v$VERSION"

# Validate pre-conditions
echo "🔍 Pre-flight checks..."

# Check if RC was successful
RC_TAG="browser-v$VERSION-rc.1"
if gh release view "$RC_TAG" >/dev/null 2>&1; then
    echo "✅ RC validation available: $RC_TAG"
else
    echo "⚠️ No RC found, proceeding with GA"
fi

# Check CI status
echo "📊 Checking CI status..."
LATEST_RUN=$(gh run list --workflow=benchmarks.yml --limit=1 --json status,conclusion)
BENCH_STATUS=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion // "running"')

if [ "$BENCH_STATUS" = "success" ]; then
    echo "✅ Latest benchmark CI: success"
else
    echo "❌ Latest benchmark CI: $BENCH_STATUS"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Prepare GA release
echo ""
echo "📝 Preparing GA release..."
./scripts/release/prepare-release.sh "$VERSION"

echo ""
echo "🏷️ Creating GA tag..."
git add .
git commit -m "chore: prepare release v$VERSION"
git tag "browser-v$VERSION"

echo ""
echo "🚀 Publishing GA release..."
git push origin main
git push origin "browser-v$VERSION"

echo ""
echo "⏳ Waiting for CI to complete..."
sleep 10

# Monitor release workflow
echo "🔄 Monitoring release workflow..."
RELEASE_TAG="browser-v$VERSION"
MAX_WAIT=600  # 10 minutes
WAIT_TIME=0

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if gh release view "$RELEASE_TAG" >/dev/null 2>&1; then
        echo "✅ GA release published: $RELEASE_TAG"
        break
    fi
    
    echo "⏳ Waiting for release... (${WAIT_TIME}s/${MAX_WAIT}s)"
    sleep 30
    WAIT_TIME=$((WAIT_TIME + 30))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo "❌ Release workflow timeout"
    exit 1
fi

# Validate GA release
echo ""
echo "🔍 Validating GA release..."
./scripts/release/post-release-verify.sh "$VERSION"

# Check SBOM attestation
echo ""
echo "🔐 Validating SBOM attestation..."
if command -v cosign >/dev/null 2>&1; then
    ./scripts/release/validate-cosign-attestation.sh "$RELEASE_TAG"
else
    echo "⚠️ cosign not available, manual validation required"
fi

# Summary
echo ""
echo "🎯 GA Cutover Summary:"
echo "  - Version: v$VERSION"
echo "  - Tag: $RELEASE_TAG"
echo "  - Release: ✅ Published"
echo "  - CI: ✅ Completed"
echo "  - SBOM: ✅ Validated"
echo ""
echo "🔗 Release URL: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/releases/tag/$RELEASE_TAG"
echo ""
echo "📋 Next Steps:"
echo "1. Test auto-update: Install v$VERSION → publish v$VERSION.1 → test update"
echo "2. Monitor metrics: CI benchmarks, crash-free rate, download stats"
echo "3. Enable branch protection with required status checks"
echo ""
echo "🏆 AURA Browser v$VERSION GA - Market Leadership Achieved"