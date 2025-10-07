#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

class ChromiumEnforcerV2 {
    constructor() {
        this.violations = [];
        
        this.dangerousPatterns = [
            {
                name: 'spawn_open',
                regex: /spawn\s*\(\s*['"]open['"]/g,
                severity: 'HIGH',
                description: 'Utilise spawn("open") au lieu de ChromiumLauncher'
            },
            {
                name: 'spawn_start',
                regex: /spawn\s*\(\s*['"]start['"]/g,
                severity: 'HIGH',
                description: 'Utilise spawn("start") au lieu de ChromiumLauncher'
            },
            {
                name: 'spawn_xdg_open',
                regex: /spawn\s*\(\s*['"]xdg-open['"]/g,
                severity: 'HIGH',
                description: 'Utilise spawn("xdg-open") au lieu de ChromiumLauncher'
            },
            {
                name: 'exec_open',
                regex: /exec\s*\(\s*['"]open\s+/g,
                severity: 'HIGH',
                description: 'Utilise exec("open") au lieu de ChromiumLauncher'
            },
            {
                name: 'require_open_package',
                regex: /require\s*\(\s*['"]open['"]\s*\)/g,
                severity: 'MEDIUM',
                description: 'Utilise le package "open" au lieu de ChromiumLauncher'
            },
            {
                name: 'window_open_external',
                regex: /window\.open\s*\(\s*['"]https?:\/\//g,
                severity: 'MEDIUM',
                description: 'window.open() pour URL externe'
            }
        ];

        this.ignorePatterns = [
            /\.min\.js$/,
            /node_modules\//,
            /\.git\//,
            /chromium-only-enforcer/
        ];

        this.ignoreContexts = [
            /const\s+start\s*=/,
            /let\s+start\s*=/,
            /var\s+start\s*=/,
            /grid-template-areas:/,
            /align-items-start/,
            /border-start/,
            /npm\s+start/,
            /systemctl\s+start/,
            /\/\/.*start/,
            /console\.log\(['"].*start/
        ];
    }

    shouldIgnoreFile(filePath) {
        return this.ignorePatterns.some(pattern => pattern.test(filePath));
    }

    shouldIgnoreLine(line) {
        return this.ignoreContexts.some(pattern => pattern.test(line));
    }

    scanFile(filePath) {
        if (this.shouldIgnoreFile(filePath)) return;

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');

            this.dangerousPatterns.forEach(pattern => {
                lines.forEach((line, index) => {
                    if (this.shouldIgnoreLine(line)) return;

                    if (pattern.regex.test(line)) {
                        this.violations.push({
                            file: filePath,
                            line: index + 1,
                            content: line.trim(),
                            pattern: pattern.name,
                            severity: pattern.severity,
                            description: pattern.description
                        });
                    }
                    pattern.regex.lastIndex = 0;
                });
            });
        } catch (error) {
            // Ignore read errors
        }
    }

    scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            } else if (entry.isFile()) {
                this.scanFile(fullPath);
            }
        }
    }

    generateReport() {
        console.log('\n🔍 AURA Chromium Only Enforcer v2');
        console.log('='.repeat(50));

        if (this.violations.length === 0) {
            console.log('✅ AUCUNE VIOLATION DÉTECTÉE\n');
            return 0;
        }

        const high = this.violations.filter(v => v.severity === 'HIGH');
        const medium = this.violations.filter(v => v.severity === 'MEDIUM');

        console.log(`❌ ${this.violations.length} VIOLATIONS DÉTECTÉES\n`);

        if (high.length > 0) {
            console.log(`🔴 HAUTE PRIORITÉ (${high.length}):`);
            high.forEach(v => {
                console.log(`\n📁 ${v.file}:${v.line}`);
                console.log(`   ${v.content}`);
                console.log(`   ⚠️  ${v.description}`);
            });
        }

        if (medium.length > 0) {
            console.log(`\n🟡 PRIORITÉ MOYENNE (${medium.length}):`);
            medium.forEach(v => {
                console.log(`\n📁 ${v.file}:${v.line}`);
                console.log(`   ${v.content}`);
                console.log(`   ℹ️  ${v.description}`);
            });
        }

        console.log('\n');
        return this.violations.length;
    }
}

const enforcer = new ChromiumEnforcerV2();
enforcer.scanDirectory(process.cwd());
const violations = enforcer.generateReport();
process.exit(violations > 0 ? 1 : 0);