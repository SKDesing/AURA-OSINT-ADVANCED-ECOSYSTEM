#!/usr/bin/env bash
set -euo pipefail

REPO="SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM"
BRANCH="main"

echo "🛡️ AURA Branch Protection Setup"
echo "==============================="

echo "📋 Required Status Checks:"
echo "  • bench (benchmarks.yml)"
echo "  • gitleaks (security.yml)" 
echo "  • dependency-review (security.yml)"
echo "  • analyze (codeql.yml)"
echo "  • sbom (sbom.yml)"
echo "  • smoke (smoke-run.yml)"

echo ""
echo "⚙️ Branch Protection Rules:"
echo "  • Require pull request reviews: 1 minimum"
echo "  • Dismiss stale reviews: enabled"
echo "  • Require up-to-date branches: enabled"
echo "  • Require status checks: enabled"
echo "  • Enforce for administrators: enabled"
echo "  • Allow force pushes: disabled"
echo "  • Allow deletions: disabled"

echo ""
echo "🔧 GitHub CLI Command:"
echo "gh api repos/$REPO/branches/$BRANCH/protection \\"
echo "  --method PUT \\"
echo "  --field required_status_checks='{\"strict\":true,\"contexts\":[\"bench\",\"gitleaks\",\"dependency-review\",\"analyze\",\"sbom\",\"smoke\"]}' \\"
echo "  --field enforce_admins=true \\"
echo "  --field required_pull_request_reviews='{\"required_approving_review_count\":1,\"dismiss_stale_reviews\":true}' \\"
echo "  --field restrictions=null"

echo ""
echo "✅ Manual Setup Required:"
echo "1. Go to: https://github.com/$REPO/settings/branches"
echo "2. Add rule for '$BRANCH' branch"
echo "3. Enable all required status checks listed above"
echo "4. Configure pull request review requirements"
echo "5. Enable 'Restrict pushes that create files larger than 100 MB'"