#!/bin/bash
# AURA OSINT Security Scan Script
set -e

echo "🔍 Running AURA OSINT Security Scan..."

# Check for gitleaks
if command -v gitleaks &> /dev/null; then
    echo "📋 Running gitleaks scan..."
    gitleaks detect --config gitleaks.toml --verbose
else
    echo "⚠️  gitleaks not installed, skipping secrets scan"
    echo "   Install: https://github.com/gitleaks/gitleaks#installation"
fi

# Check for osv-scanner (if available)
if command -v osv-scanner &> /dev/null; then
    echo "📋 Running OSV vulnerability scan..."
    osv-scanner --lockfile package-lock.json
else
    echo "⚠️  osv-scanner not installed, skipping vulnerability scan"
    echo "   Install: https://github.com/google/osv-scanner#installation"
fi

# Basic file permission checks
echo "📋 Checking file permissions..."
find . -name "*.sh" -not -perm -u+x -exec echo "⚠️  Script not executable: {}" \;

# Check for sensitive files
echo "📋 Checking for sensitive files..."
SENSITIVE_FILES=(".env" "*.key" "*.pem" "*.p12" "*.pfx")
for pattern in "${SENSITIVE_FILES[@]}"; do
    if find . -name "$pattern" -not -path "./node_modules/*" | grep -q .; then
        echo "⚠️  Found sensitive files matching: $pattern"
        find . -name "$pattern" -not -path "./node_modules/*"
    fi
done

echo "✅ Security scan completed"