#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

class ArchitectureValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    validate() {
        console.log('🔍 AURA Architecture Validator');
        console.log('='.repeat(50));

        this.checkDirectoryStructure();
        this.checkCriticalFiles();
        this.checkConfiguration();
        this.checkSecurity();
        this.checkMonitoring();
        this.checkBackups();
        this.checkMiddleware();
        this.checkHealthChecks();

        this.generateReport();
    }

    checkDirectoryStructure() {
        const requiredDirs = [
            'backend/api',
            'backend/services',
            'backend/config',
            'middleware',
            'monitoring',
            'logs',
            'backups',
            'security',
            'config',
            'shared',
            'tests'
        ];

        requiredDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                this.passed.push(`✅ Directory: ${dir}`);
            } else {
                this.errors.push(`❌ Missing directory: ${dir}`);
            }
        });
    }

    checkCriticalFiles() {
        const criticalFiles = [
            'logs/forensic-logger.js',
            'monitoring/system-monitor.js',
            'monitoring/health-checks.js',
            'backups/backup-scheduler.js',
            'middleware/error-handler.js',
            'middleware/authentication.js',
            'middleware/rate-limiter.js',
            'config/unified-config.js',
            'chromium-launcher.js'
        ];

        criticalFiles.forEach(file => {
            if (fs.existsSync(file)) {
                this.passed.push(`✅ Critical file: ${file}`);
            } else {
                this.errors.push(`❌ Missing critical file: ${file}`);
            }
        });
    }

    checkConfiguration() {
        const configFiles = ['.env.example', '.env.template', 'config.js'];
        let configFound = false;

        configFiles.forEach(file => {
            if (fs.existsSync(file)) {
                configFound = true;
                this.passed.push(`✅ Config file: ${file}`);
            }
        });

        if (!configFound) {
            this.errors.push('❌ No configuration files found');
        }

        // Check package.json main entry
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (packageJson.main === 'scripts/setup/aura-master-launcher.js') {
            this.passed.push('✅ Package.json main entry correct');
        } else {
            this.warnings.push(`⚠️ Package.json main should be 'scripts/setup/aura-master-launcher.js'`);
        }
    }

    checkSecurity() {
        const securityDirs = [
            'security/certificates',
            'security/keys',
            'security/policies',
            'security/audit-logs'
        ];

        securityDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                this.passed.push(`✅ Security dir: ${dir}`);
            } else {
                this.warnings.push(`⚠️ Security directory missing: ${dir}`);
            }
        });

        // Check .gitignore for security patterns
        if (fs.existsSync('.gitignore')) {
            const gitignore = fs.readFileSync('.gitignore', 'utf8');
            const securityPatterns = ['*.key', '*.pem', 'security/keys/', '.env'];
            
            securityPatterns.forEach(pattern => {
                if (gitignore.includes(pattern)) {
                    this.passed.push(`✅ Gitignore protects: ${pattern}`);
                } else {
                    this.warnings.push(`⚠️ Gitignore should include: ${pattern}`);
                }
            });
        }
    }

    checkMonitoring() {
        const monitoringFiles = [
            'monitoring/system-monitor.js',
            'monitoring/health-checks.js',
            'monitoring/docker-compose.monitoring.yml'
        ];

        monitoringFiles.forEach(file => {
            if (fs.existsSync(file)) {
                this.passed.push(`✅ Monitoring: ${file}`);
            } else {
                this.errors.push(`❌ Missing monitoring: ${file}`);
            }
        });

        // Check if monitoring directories exist
        const monitoringDirs = ['monitoring/metrics', 'monitoring/alerts', 'monitoring/dashboards'];
        monitoringDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                this.passed.push(`✅ Monitoring dir: ${dir}`);
            } else {
                this.warnings.push(`⚠️ Monitoring directory: ${dir}`);
            }
        });
    }

    checkBackups() {
        if (fs.existsSync('backups/backup-scheduler.js')) {
            this.passed.push('✅ Backup system implemented');
        } else {
            this.errors.push('❌ Backup system missing');
        }

        if (fs.existsSync('backups')) {
            this.passed.push('✅ Backups directory exists');
        } else {
            this.errors.push('❌ Backups directory missing');
        }
    }

    checkMiddleware() {
        const middlewareFiles = [
            'middleware/error-handler.js',
            'middleware/authentication.js',
            'middleware/rate-limiter.js'
        ];

        middlewareFiles.forEach(file => {
            if (fs.existsSync(file)) {
                this.passed.push(`✅ Middleware: ${file}`);
            } else {
                this.errors.push(`❌ Missing middleware: ${file}`);
            }
        });
    }

    checkHealthChecks() {
        if (fs.existsSync('monitoring/health-checks.js')) {
            this.passed.push('✅ Health checks implemented');
        } else {
            this.errors.push('❌ Health checks missing');
        }

        // Check if health endpoint exists in APIs
        const apiFiles = fs.readdirSync('backend/api').filter(f => f.endsWith('.js'));
        let healthEndpointFound = false;

        apiFiles.forEach(file => {
            const content = fs.readFileSync(`backend/api/${file}`, 'utf8');
            if (content.includes('/health') || content.includes('health')) {
                healthEndpointFound = true;
            }
        });

        if (healthEndpointFound) {
            this.passed.push('✅ Health endpoints found in APIs');
        } else {
            this.warnings.push('⚠️ No health endpoints found in APIs');
        }
    }

    generateReport() {
        console.log('\n📊 VALIDATION RESULTS');
        console.log('='.repeat(50));

        if (this.errors.length > 0) {
            console.log('\n🔴 CRITICAL ERRORS:');
            this.errors.forEach(error => console.log(error));
        }

        if (this.warnings.length > 0) {
            console.log('\n🟡 WARNINGS:');
            this.warnings.forEach(warning => console.log(warning));
        }

        console.log('\n✅ PASSED CHECKS:');
        this.passed.forEach(pass => console.log(pass));

        console.log('\n📈 SUMMARY:');
        console.log(`✅ Passed: ${this.passed.length}`);
        console.log(`⚠️ Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        const score = Math.round((this.passed.length / (this.passed.length + this.warnings.length + this.errors.length)) * 100);
        console.log(`\n🎯 ARCHITECTURE SCORE: ${score}%`);

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('\n🎉 ARCHITECTURE IRRÉPROCHABLE - PARFAIT !');
            process.exit(0);
        } else if (this.errors.length === 0) {
            console.log('\n✅ ARCHITECTURE SOLIDE - Quelques améliorations possibles');
            process.exit(0);
        } else {
            console.log('\n❌ ARCHITECTURE INCOMPLÈTE - Corrections requises');
            process.exit(1);
        }
    }
}

if (require.main === module) {
    const validator = new ArchitectureValidator();
    validator.validate();
}

module.exports = ArchitectureValidator;