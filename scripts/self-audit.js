#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');

class ForensicAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      version: this.getVersion(),
      tests: [],
      score: 0,
      status: 'UNKNOWN'
    };
  }

  getVersion() {
    try {
      return fs.readFileSync('VERSION', 'utf8').trim();
    } catch {
      return 'unknown';
    }
  }

  test(name, testFn) {
    console.log(`🔍 Testing: ${name}`);
    try {
      const result = testFn();
      const passed = result === true || (result && result.passed);
      
      this.results.tests.push({
        name,
        passed,
        details: result.details || (passed ? 'OK' : 'FAILED'),
        timestamp: new Date().toISOString()
      });
      
      if (passed) this.results.score += 10;
      console.log(passed ? '✅ PASS' : '❌ FAIL');
      
    } catch (error) {
      this.results.tests.push({
        name,
        passed: false,
        details: error.message,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ ERROR: ${error.message}`);
    }
  }

  checkSecrets() {
    try {
      const result = execSync('grep -r "Mohand/06\\|password.*:" . --exclude-dir=.git --exclude-dir=node_modules | grep -v ".env" | grep -v ".example"', { encoding: 'utf8' });
      return { passed: false, details: 'Secrets found in code' };
    } catch {
      return { passed: true, details: 'No secrets in code' };
    }
  }

  checkEnvSecurity() {
    if (!fs.existsSync('.env')) {
      return { passed: false, details: '.env file missing' };
    }
    
    const stats = fs.statSync('.env');
    const perms = (stats.mode & parseInt('777', 8)).toString(8);
    
    if (perms !== '600') {
      return { passed: false, details: `Wrong permissions: ${perms}` };
    }
    
    return { passed: true, details: 'Correct permissions (600)' };
  }

  checkGitignore() {
    if (!fs.existsSync('.gitignore')) {
      return { passed: false, details: '.gitignore missing' };
    }
    
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const hasEnv = gitignore.includes('.env');
    
    return { 
      passed: hasEnv, 
      details: hasEnv ? '.env in .gitignore' : '.env missing from .gitignore' 
    };
  }

  checkDependencies() {
    try {
      execSync('cd live-tracker && npm audit --audit-level high', { stdio: 'pipe' });
      return { passed: true, details: 'No high-risk vulnerabilities' };
    } catch {
      return { passed: false, details: 'High-risk vulnerabilities found' };
    }
  }

  checkDatabase() {
    try {
      const result = execSync('export PGPASSWORD="[REDACTED]" && psql -h localhost -U postgres -d live_tracker -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\'public\';"', { encoding: 'utf8' });
      const tableCount = parseInt(result.match(/\d+/)[0]);
      
      return { 
        passed: tableCount >= 15, 
        details: `${tableCount} tables found` 
      };
    } catch (error) {
      return { passed: false, details: 'Database connection failed' };
    }
  }

  checkBackupIntegrity() {
    const backupDir = '/var/backups/aura';
    if (!fs.existsSync(backupDir)) {
      return { passed: false, details: 'Backup directory missing' };
    }
    
    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.gpg'));
    const recentBackup = backups.length > 0;
    
    return { 
      passed: recentBackup, 
      details: `${backups.length} encrypted backups found` 
    };
  }

  checkForensicIntegrity() {
    const evidenceDir = './evidence';
    if (!fs.existsSync(evidenceDir)) {
      return { passed: false, details: 'Evidence directory missing' };
    }
    
    const files = this.getAllFiles(evidenceDir);
    const hashFiles = files.filter(f => f.endsWith('.sha256'));
    
    let validHashes = 0;
    for (const hashFile of hashFiles) {
      const originalFile = hashFile.replace('.sha256', '');
      if (fs.existsSync(originalFile)) {
        const storedHash = fs.readFileSync(hashFile, 'utf8').split(' ')[0];
        const currentHash = this.calculateHash(originalFile);
        if (storedHash === currentHash) validHashes++;
      }
    }
    
    return { 
      passed: validHashes === hashFiles.length, 
      details: `${validHashes}/${hashFiles.length} hashes valid` 
    };
  }

  getAllFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = `${dir}/${item}`;
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  calculateHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  generateReport() {
    const passedTests = this.results.tests.filter(t => t.passed).length;
    const totalTests = this.results.tests.length;
    const percentage = Math.round((passedTests / totalTests) * 100);
    
    this.results.score = percentage;
    
    if (percentage >= 90) this.results.status = 'EXCELLENT';
    else if (percentage >= 75) this.results.status = 'GOOD';
    else if (percentage >= 50) this.results.status = 'ACCEPTABLE';
    else this.results.status = 'CRITICAL';
    
    return this.results;
  }

  run() {
    console.log('🔒 AURA FORENSIC SELF-AUDIT');
    console.log('============================');
    
    this.test('Secrets in Code', () => this.checkSecrets());
    this.test('Environment Security', () => this.checkEnvSecurity());
    this.test('Git Ignore Configuration', () => this.checkGitignore());
    this.test('Dependencies Security', () => this.checkDependencies());
    this.test('Database Connectivity', () => this.checkDatabase());
    this.test('Backup Integrity', () => this.checkBackupIntegrity());
    this.test('Forensic Evidence Integrity', () => this.checkForensicIntegrity());
    
    const report = this.generateReport();
    
    console.log('\n📊 AUDIT RESULTS');
    console.log('================');
    console.log(`Status: ${report.status}`);
    console.log(`Score: ${report.score}%`);
    console.log(`Tests: ${report.tests.filter(t => t.passed).length}/${report.tests.length} passed`);
    
    // Save report
    fs.writeFileSync(`audit_report_${Date.now()}.json`, JSON.stringify(report, null, 2));
    
    return report.status !== 'CRITICAL';
  }
}

if (require.main === module) {
  const auditor = new ForensicAuditor();
  const success = auditor.run();
  process.exit(success ? 0 : 1);
}

module.exports = ForensicAuditor;