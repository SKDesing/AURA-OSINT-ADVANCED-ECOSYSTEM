#!/usr/bin/env node
/**
 * AURA – Script d'audit complet
 * Exécute tous les audits automatisables et génère les rapports
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, 'reports', 'audit');

function runCommand(cmd, args = [], cwd = ROOT) {
  console.log(`🔍 Running: ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { 
    cwd, 
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe']
  });
  
  return {
    success: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status
  };
}

function writeReport(category, filename, data) {
  const dir = path.join(AUDIT_DIR, category);
  fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  
  if (typeof data === 'object') {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync(filepath, data);
  }
  
  console.log(`✅ Report saved: ${path.relative(ROOT, filepath)}`);
}

async function auditPorts() {
  console.log('\n📋 === AUDIT PORTS ===');
  const result = runCommand('node', ['scripts/dev/port-inventory.js']);
  
  writeReport('DEVOPS', 'ports-state.json', {
    timestamp: new Date().toISOString(),
    success: result.success,
    output: result.stdout,
    errors: result.stderr
  });
}

async function auditSecurity() {
  console.log('\n🛡️ === AUDIT SECURITY ===');
  
  // NPM Audit
  const npmAudit = runCommand('npm', ['audit', '--json']);
  
  const securityReport = {
    timestamp: new Date().toISOString(),
    npmAudit: {
      success: npmAudit.success,
      data: npmAudit.success ? JSON.parse(npmAudit.stdout || '{}') : null,
      errors: npmAudit.stderr
    }
  };
  
  writeReport('SEC', 'security-audit.json', securityReport);
}

async function auditFrontend() {
  console.log('\n🖥️ === AUDIT FRONTEND ===');
  
  const frontendDir = path.join(ROOT, 'clients', 'web-react');
  if (!fs.existsSync(frontendDir)) {
    console.log('❌ Frontend directory not found');
    return;
  }
  
  // Package.json analysis
  const packagePath = path.join(frontendDir, 'package.json');
  let packageData = {};
  if (fs.existsSync(packagePath)) {
    packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  }
  
  const frontendReport = {
    timestamp: new Date().toISOString(),
    package: packageData,
    dependencies: Object.keys(packageData.dependencies || {}),
    devDependencies: Object.keys(packageData.devDependencies || {})
  };
  
  writeReport('FRONT', 'ui-inventory.json', frontendReport);
}

async function generateSummary() {
  console.log('\n📊 === GENERATING SUMMARY ===');
  
  const summary = {
    timestamp: new Date().toISOString(),
    auditVersion: '1.0.0',
    categories: {
      DEVOPS: 'Ports and runtime configuration',
      SEC: 'Security, secrets, and compliance', 
      FRONT: 'Frontend dependencies and build'
    },
    nextSteps: [
      'Review all generated reports in reports/audit/',
      'Complete manual audits for each category',
      'Schedule convergence meeting at T+72h'
    ]
  };
  
  writeReport('', 'AUDIT-SUMMARY.json', summary);
}

async function main() {
  console.log('🚀 AURA Full Audit Starting...');
  console.log('=====================================');
  
  try {
    await auditPorts();
    await auditSecurity();
    await auditFrontend();
    await generateSummary();
    
    console.log('\n✅ Full audit completed!');
    console.log(`📁 Reports available in: ${path.relative(ROOT, AUDIT_DIR)}`);
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

main();