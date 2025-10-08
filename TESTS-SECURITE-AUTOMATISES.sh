#!/bin/bash
# ============================================
# TESTS-SECURITE-AUTOMATISES.sh
# AURA Security Tests - FIXED
# ============================================

set -e

echo "🛡️ AURA Security Tests Starting..."

# Create results directory
RESULTS_DIR="security-test-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Initialize counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo "🧪 Running: $test_name"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" > "$RESULTS_DIR/${test_name// /_}.log" 2>&1; then
        echo "  ✅ PASSED: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "  ❌ FAILED: $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

skip_test() {
    local test_name="$1"
    local reason="$2"
    
    echo "⏭️ SKIPPED: $test_name ($reason)"
    SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# ============================================
# SECURITY TESTS
# ============================================

echo "📋 Running security tests..."

# Test 1: Configuration Security
run_test "Configuration Security" "
    # Check for hardcoded secrets
    if grep -r 'password.*=' . --include='*.js' --include='*.json' --exclude-dir=node_modules | grep -v 'example\|placeholder\|test'; then
        echo 'Hardcoded passwords found'
        exit 1
    fi
    
    # Check for API keys
    if grep -r 'api.*key.*=' . --include='*.js' --exclude-dir=node_modules | grep -v 'example\|placeholder\|test'; then
        echo 'Hardcoded API keys found'
        exit 1
    fi
    
    echo 'Configuration security: OK'
"

# Test 2: Dependency Security
run_test "Dependency Security" "
    # Check for known vulnerabilities
    npm audit --audit-level=moderate --json > npm-audit-temp.json || true
    
    if [ -f npm-audit-temp.json ]; then
        CRITICAL=\$(jq '.metadata.vulnerabilities.critical // 0' npm-audit-temp.json)
        HIGH=\$(jq '.metadata.vulnerabilities.high // 0' npm-audit-temp.json)
        
        if [ \"\$CRITICAL\" -gt 0 ]; then
            echo \"Critical vulnerabilities found: \$CRITICAL\"
            rm -f npm-audit-temp.json
            exit 1
        fi
        
        if [ \"\$HIGH\" -gt 3 ]; then
            echo \"Too many high vulnerabilities: \$HIGH\"
            rm -f npm-audit-temp.json
            exit 1
        fi
        
        rm -f npm-audit-temp.json
    fi
    
    echo 'Dependency security: OK'
"

# Test 3: File Permissions
run_test "File Permissions" "
    # Check for overly permissive files
    if find . -type f -perm -o+w -not -path './node_modules/*' -not -path './.git/*' | head -1 | grep -q .; then
        echo 'World-writable files found'
        exit 1
    fi
    
    # Check for executable scripts
    find . -name '*.sh' -not -path './node_modules/*' -exec chmod +x {} \;
    
    echo 'File permissions: OK'
"

# Test 4: Input Validation
run_test "Input Validation" "
    # Check for SQL injection patterns
    if grep -r 'query.*+.*req\.' . --include='*.js' --exclude-dir=node_modules; then
        echo 'Potential SQL injection found'
        exit 1
    fi
    
    # Check for XSS patterns
    if grep -r 'innerHTML.*req\.' . --include='*.js' --exclude-dir=node_modules; then
        echo 'Potential XSS vulnerability found'
        exit 1
    fi
    
    echo 'Input validation: OK'
"

# Test 5: Authentication Security
run_test "Authentication Security" "
    # Check for weak JWT secrets
    if grep -r 'jwt.*secret.*=.*\".*\"' . --include='*.js' --exclude-dir=node_modules | grep -E '(secret|password|key).*=.*(123|test|admin|password)'; then
        echo 'Weak JWT secret found'
        exit 1
    fi
    
    echo 'Authentication security: OK'
"

# Test 6: HTTPS Enforcement
run_test "HTTPS Enforcement" "
    # Check for HTTP URLs in production code
    if grep -r 'http://' . --include='*.js' --exclude-dir=node_modules --exclude-dir=tests | grep -v localhost | grep -v '127.0.0.1'; then
        echo 'HTTP URLs found in production code'
        exit 1
    fi
    
    echo 'HTTPS enforcement: OK'
"

# Test 7: Error Handling
run_test "Error Handling" "
    # Check for exposed error details
    if grep -r 'console.error.*stack' . --include='*.js' --exclude-dir=node_modules --exclude-dir=tests; then
        echo 'Stack traces exposed in error handling'
        exit 1
    fi
    
    echo 'Error handling: OK'
"

# Test 8: Rate Limiting
run_test "Rate Limiting" "
    # Check for rate limiting implementation
    if ! grep -r 'rate.*limit' . --include='*.js' --exclude-dir=node_modules; then
        echo 'No rate limiting found'
        exit 1
    fi
    
    echo 'Rate limiting: OK'
"

# ============================================
# GENERATE REPORT
# ============================================

SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))

cat > "$RESULTS_DIR/security-test-report.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "tests": {
    "total": $TOTAL_TESTS,
    "passed": $PASSED_TESTS,
    "failed": $FAILED_TESTS,
    "skipped": $SKIPPED_TESTS,
    "success_rate": $SUCCESS_RATE
  },
  "status": "$([ $FAILED_TESTS -eq 0 ] && echo 'PASSED' || echo 'FAILED')",
  "severity": "$([ $FAILED_TESTS -gt 2 ] && echo 'CRITICAL' || [ $FAILED_TESTS -gt 0 ] && echo 'HIGH' || echo 'LOW')"
}
EOF

# ============================================
# SUMMARY
# ============================================

echo ""
echo "📊 SECURITY TEST SUMMARY"
echo "========================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo "Skipped: $SKIPPED_TESTS"
echo "Success Rate: $SUCCESS_RATE%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ All security tests passed!"
    echo "📁 Results saved to: $RESULTS_DIR/"
    exit 0
else
    echo "❌ $FAILED_TESTS security tests failed!"
    echo "📁 Check logs in: $RESULTS_DIR/"
    
    # Check if we should fail based on environment variables
    MAX_ALLOWED=${AURA_MAX_ALLOWED_FINDINGS:-0}
    if [ $FAILED_TESTS -gt $MAX_ALLOWED ]; then
        echo "🚨 Failed tests ($FAILED_TESTS) exceed maximum allowed ($MAX_ALLOWED)"
        exit 1
    else
        echo "⚠️ Failed tests within acceptable range"
        exit 0
    fi
fi