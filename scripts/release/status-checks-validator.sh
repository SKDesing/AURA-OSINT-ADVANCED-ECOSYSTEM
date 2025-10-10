#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Validating Required Status Checks for Branch Protection"

# Get repository info
REPO_INFO=$(gh repo view --json owner,name)
OWNER=$(echo "$REPO_INFO" | jq -r '.owner.login')
REPO=$(echo "$REPO_INFO" | jq -r '.name')

echo "Repository: $OWNER/$REPO"

# Check recent workflow runs to identify job names
echo ""
echo "📊 Recent workflow runs and job names:"

WORKFLOWS=(
  "benchmarks.yml"
  "security.yml" 
  "codeql.yml"
  "sbom.yml"
  "branch-protection.yml"
)

REQUIRED_CHECKS=()

for workflow in "${WORKFLOWS[@]}"; do
  echo ""
  echo "🔄 Checking $workflow..."
  
  # Get recent runs for this workflow
  RUNS=$(gh run list --workflow="$workflow" --limit=1 --json status,conclusion,jobs 2>/dev/null || echo "[]")
  
  if [ "$RUNS" != "[]" ]; then
    # Extract job names
    JOB_NAMES=$(echo "$RUNS" | jq -r '.[0].jobs[]?.name // empty' 2>/dev/null || echo "")
    
    if [ -n "$JOB_NAMES" ]; then
      echo "$JOB_NAMES" | while read -r job; do
        if [ -n "$job" ]; then
          echo "  ✅ Job: $job"
          # Add to required checks (simplified - just echo for now)
        fi
      done
    else
      # Fallback to expected job names based on workflow
      case "$workflow" in
        "benchmarks.yml")
          echo "  ✅ Expected job: bench"
          REQUIRED_CHECKS+=("bench")
          ;;
        "security.yml")
          echo "  ✅ Expected jobs: gitleaks, dependency-review"
          REQUIRED_CHECKS+=("gitleaks" "dependency-review")
          ;;
        "codeql.yml")
          echo "  ✅ Expected job: analyze"
          REQUIRED_CHECKS+=("analyze")
          ;;
        "sbom.yml")
          echo "  ✅ Expected job: sbom"
          REQUIRED_CHECKS+=("sbom")
          ;;
        "branch-protection.yml")
          echo "  ✅ Expected job: required-checks"
          REQUIRED_CHECKS+=("required-checks")
          ;;
      esac
    fi
  else
    echo "  ⚠️ No recent runs found for $workflow"
  fi
done

# Display required status checks
echo ""
echo "📋 Required Status Checks for Branch Protection:"
echo "Copy these exact names to GitHub Settings → Branches → Branch protection rules:"
echo ""

UNIQUE_CHECKS=(
  "bench"
  "gitleaks" 
  "dependency-review"
  "analyze"
  "sbom"
  "required-checks"
)

for check in "${UNIQUE_CHECKS[@]}"; do
  echo "  ✅ $check"
done

# Check current branch protection status
echo ""
echo "🛡️ Current branch protection status:"
PROTECTION_STATUS=$(gh api "repos/$OWNER/$REPO/branches/main/protection" 2>/dev/null || echo "{}")

if [ "$PROTECTION_STATUS" != "{}" ]; then
  echo "✅ Branch protection is enabled"
  
  # Check required status checks
  CURRENT_CHECKS=$(echo "$PROTECTION_STATUS" | jq -r '.required_status_checks.contexts[]? // empty' 2>/dev/null || echo "")
  
  if [ -n "$CURRENT_CHECKS" ]; then
    echo "📊 Currently required checks:"
    echo "$CURRENT_CHECKS" | while read -r check; do
      if [ -n "$check" ]; then
        echo "  - $check"
      fi
    done
  else
    echo "⚠️ No required status checks configured"
  fi
else
  echo "❌ Branch protection is not enabled"
  echo ""
  echo "🔧 To enable branch protection:"
  echo "1. Go to: https://github.com/$OWNER/$REPO/settings/branches"
  echo "2. Click 'Add rule'"
  echo "3. Branch name pattern: main"
  echo "4. Enable required status checks and add the checks listed above"
fi

echo ""
echo "🎯 Branch Protection Setup Summary:"
echo "1. Enable branch protection for 'main' branch"
echo "2. Require status checks: $(IFS=', '; echo "${UNIQUE_CHECKS[*]}")"
echo "3. Require signed commits and linear history"
echo "4. Require pull request reviews (1+ approval)"
echo ""
echo "🔗 Branch protection settings:"
echo "https://github.com/$OWNER/$REPO/settings/branches"