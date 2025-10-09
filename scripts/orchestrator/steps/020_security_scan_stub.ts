import { Step } from '../types';
import fs from 'fs';

export const securityScanStep: Step = {
  id: '020_security_scan_stub',
  title: 'Security Pre-Scan',
  description: 'Basic security checks before structure changes',
  order: 20,
  
  verify: async () => {
    // Check if gitleaks config exists
    if (!fs.existsSync('gitleaks.toml')) {
      return { success: false, message: 'gitleaks.toml missing' };
    }
    
    // Check if security script exists
    if (!fs.existsSync('scripts/ci/security-run.sh')) {
      return { success: false, message: 'Security scan script missing' };
    }
    
    return { success: true, message: 'Security configuration present' };
  },
  
  run: async () => {
    console.log('🔍 Running basic security checks...');
    
    // Create gitleaks config if missing
    if (!fs.existsSync('gitleaks.toml')) {
      const gitleaksConfig = `# AURA OSINT Gitleaks Configuration
title = "AURA OSINT Security Scan"

[extend]
useDefault = true

[[rules]]
id = "aura-api-key"
description = "AURA API Key"
regex = '''(?i)(aura[_-]?api[_-]?key|aura[_-]?token)['"\s]*[:=]\s*['"]?[a-zA-Z0-9]{20,}'''
tags = ["key", "aura"]

[[rules]]
id = "database-password"
description = "Database Password"
regex = '''(?i)(db[_-]?pass|database[_-]?password)['"\s]*[:=]\s*['"]?[^\s'"]{8,}'''
tags = ["password", "database"]

[allowlist]
description = "Allowlist for test files"
paths = [
  '''.*test.*''',
  '''.*example.*''',
  '''.*\.md$''',
]`;
      
      fs.writeFileSync('gitleaks.toml', gitleaksConfig);
      console.log('✅ Created gitleaks.toml');
    }
    
    // Create security script if missing
    const securityScriptDir = 'scripts/ci';
    if (!fs.existsSync(securityScriptDir)) {
      fs.mkdirSync(securityScriptDir, { recursive: true });
    }
    
    if (!fs.existsSync('scripts/ci/security-run.sh')) {
      const securityScript = `#!/bin/bash
# AURA OSINT Security Scan Script
set -e

echo "🔍 Running AURA OSINT Security Scan..."

# Check for gitleaks
if command -v gitleaks &> /dev/null; then
    echo "📋 Running gitleaks scan..."
    gitleaks detect --config gitleaks.toml --verbose
else
    echo "⚠️  gitleaks not installed, skipping secrets scan"
fi

# Check for osv-scanner (if available)
if command -v osv-scanner &> /dev/null; then
    echo "📋 Running OSV vulnerability scan..."
    osv-scanner --lockfile package-lock.json
else
    echo "⚠️  osv-scanner not installed, skipping vulnerability scan"
fi

echo "✅ Security scan completed"`;
      
      fs.writeFileSync('scripts/ci/security-run.sh', securityScript);
      fs.chmodSync('scripts/ci/security-run.sh', 0o755);
      console.log('✅ Created security-run.sh');
    }
    
    return { success: true, message: 'Security configuration initialized' };
  }
};