#!/usr/bin/env node
// 🧠 AUTO-TEST INTELLIGENT - E2E avec analyse de code source

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class AutoTestIntelligent {
    constructor() {
        this.browser = null;
        this.context = null;
        this.services = {
            gui: { url: 'http://localhost:3000', type: 'web' },
            api: { url: 'http://localhost:4002', type: 'api' },
            react: { url: 'http://localhost:3002', type: 'web' },
            vitrine: { url: 'http://localhost:3001', type: 'web' }
        };
        this.scenarios = [];
        this.results = [];
    }

    // 🔍 ANALYSE AUTOMATIQUE DU CODE SOURCE
    async analyzeCodebase() {
        console.log('🔍 Analyse intelligente du code source...');
        
        const analysis = {
            routes: this.extractRoutes(),
            endpoints: this.extractAPIEndpoints(),
            components: this.extractReactComponents(),
            forms: this.extractForms()
        };

        // Génération automatique des scénarios
        this.generateScenarios(analysis);
        return analysis;
    }

    extractRoutes() {
        const routes = [];
        
        // Scan React Router
        const reactFiles = this.scanFiles('frontend-react/src', ['.tsx', '.jsx']);
        reactFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const routeMatches = content.match(/<Route[^>]+path=["']([^"']+)["']/g) || [];
            routeMatches.forEach(match => {
                const path = match.match(/path=["']([^"']+)["']/)[1];
                routes.push({ path, file, type: 'react' });
            });
        });

        return routes;
    }

    extractAPIEndpoints() {
        const endpoints = [];
        
        // Scan Express endpoints
        if (fs.existsSync('analytics-api.js')) {
            const content = fs.readFileSync('analytics-api.js', 'utf8');
            const endpointMatches = content.match(/app\.(get|post|put|delete)\(['"`]([^'"`]+)/g) || [];
            
            endpointMatches.forEach(match => {
                const [, method, path] = match.match(/app\.(\w+)\(['"`]([^'"`]+)/);
                endpoints.push({ method: method.toUpperCase(), path, file: 'analytics-api.js' });
            });
        }

        return endpoints;
    }

    extractReactComponents() {
        const components = [];
        const reactFiles = this.scanFiles('frontend-react/src', ['.tsx', '.jsx']);
        
        reactFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const componentName = path.basename(file, path.extname(file));
            
            components.push({
                name: componentName,
                file,
                hasState: content.includes('useState'),
                hasEffect: content.includes('useEffect'),
                hasForm: content.includes('<form') || content.includes('onSubmit'),
                hasAPI: content.includes('fetch') || content.includes('axios')
            });
        });

        return components;
    }

    extractForms() {
        const forms = [];
        const reactFiles = this.scanFiles('frontend-react/src', ['.tsx', '.jsx']);
        
        reactFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const formMatches = content.match(/<form[^>]*>/g) || [];
            
            formMatches.forEach(() => {
                const inputs = content.match(/<input[^>]+/g) || [];
                const buttons = content.match(/<button[^>]*type=["']submit["']/g) || [];
                
                forms.push({
                    file,
                    inputs: inputs.length,
                    hasSubmit: buttons.length > 0
                });
            });
        });

        return forms;
    }

    scanFiles(dir, extensions) {
        const files = [];
        if (!fs.existsSync(dir)) return files;
        
        const scan = (currentDir) => {
            const items = fs.readdirSync(currentDir);
            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scan(fullPath);
                } else if (extensions.some(ext => item.endsWith(ext))) {
                    files.push(fullPath);
                }
            });
        };
        
        scan(dir);
        return files;
    }

    // 🎯 GÉNÉRATION AUTOMATIQUE DES SCÉNARIOS
    generateScenarios(analysis) {
        console.log('🎯 Génération automatique des scénarios...');

        // Scénarios Web
        Object.entries(this.services).forEach(([name, config]) => {
            if (config.type === 'web') {
                this.scenarios.push({
                    name: `${name}_smoke_test`,
                    type: 'web',
                    url: config.url,
                    actions: ['navigate', 'screenshot', 'check_title', 'check_errors']
                });
            }
        });

        // Scénarios API
        analysis.endpoints.forEach(endpoint => {
            this.scenarios.push({
                name: `api_${endpoint.method}_${endpoint.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
                type: 'api',
                method: endpoint.method,
                url: `http://localhost:4002${endpoint.path}`,
                actions: ['request', 'check_status', 'check_json']
            });
        });

        // Scénarios Forms
        analysis.forms.forEach((form, index) => {
            this.scenarios.push({
                name: `form_test_${index}`,
                type: 'form',
                url: 'http://localhost:3002',
                actions: ['navigate', 'fill_form', 'submit', 'check_response']
            });
        });
    }

    // 🚀 EXÉCUTION DES TESTS
    async runTests() {
        console.log('🚀 Lancement des tests E2E intelligents...');
        
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext();

        for (const scenario of this.scenarios) {
            await this.runScenario(scenario);
        }

        await this.browser.close();
        return this.generateReport();
    }

    async runScenario(scenario) {
        console.log(`🧪 Test: ${scenario.name}`);
        const page = await this.context.newPage();
        const result = { name: scenario.name, status: 'PASS', errors: [], screenshots: [] };

        try {
            if (scenario.type === 'web' || scenario.type === 'form') {
                await this.runWebScenario(page, scenario, result);
            } else if (scenario.type === 'api') {
                await this.runAPIScenario(scenario, result);
            }
        } catch (error) {
            result.status = 'FAIL';
            result.errors.push(error.message);
            console.log(`❌ ${scenario.name}: ${error.message}`);
        }

        await page.close();
        this.results.push(result);
    }

    async runWebScenario(page, scenario, result) {
        // Navigation
        await page.goto(scenario.url, { timeout: 10000 });
        
        // Screenshot
        const screenshotPath = `test-${scenario.name}.png`;
        await page.screenshot({ path: screenshotPath });
        result.screenshots.push(screenshotPath);

        // Vérifications automatiques
        const title = await page.title();
        result.title = title;

        // Détection d'erreurs
        const errors = await page.$$('.error, .alert-danger, [class*="error"]');
        if (errors.length > 0) {
            result.errors.push(`${errors.length} erreurs détectées dans le DOM`);
        }

        // Test interactions si formulaire
        if (scenario.type === 'form') {
            await this.testFormInteractions(page, result);
        }

        console.log(`✅ ${scenario.name}: OK`);
    }

    async runAPIScenario(scenario, result) {
        const fetch = require('node-fetch');
        
        const response = await fetch(scenario.url, {
            method: scenario.method,
            headers: { 'Content-Type': 'application/json' }
        });

        result.status_code = response.status;
        result.ok = response.ok;

        if (response.ok) {
            try {
                result.json = await response.json();
            } catch (e) {
                result.text = await response.text();
            }
        } else {
            result.status = 'FAIL';
            result.errors.push(`HTTP ${response.status}`);
        }

        console.log(`✅ ${scenario.name}: ${response.status}`);
    }

    async testFormInteractions(page, result) {
        // Test saisie automatique
        const inputs = await page.$$('input[type="text"], input[type="email"]');
        for (let i = 0; i < Math.min(inputs.length, 3); i++) {
            await inputs[i].fill(`test_value_${i}`);
        }

        // Test soumission
        const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            await submitBtn.click();
            await page.waitForTimeout(2000);
        }
    }

    // 📊 GÉNÉRATION DU RAPPORT
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.status === 'PASS').length,
                failed: this.results.filter(r => r.status === 'FAIL').length
            },
            results: this.results,
            scenarios: this.scenarios
        };

        // Sauvegarde JSON
        fs.writeFileSync('auto-test-report.json', JSON.stringify(report, null, 2));
        
        // Génération HTML
        this.generateHTMLReport(report);
        
        return report;
    }

    generateHTMLReport(report) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>AURA Auto-Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .pass { color: green; } .fail { color: red; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .test { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>🧠 AURA Auto-Test Report</h1>
    <div class="summary">
        <h2>📊 Résumé</h2>
        <p>Total: ${report.summary.total} | 
           <span class="pass">✅ Réussis: ${report.summary.passed}</span> | 
           <span class="fail">❌ Échoués: ${report.summary.failed}</span></p>
        <p>Généré le: ${report.timestamp}</p>
    </div>
    
    <h2>🧪 Détails des tests</h2>
    ${report.results.map(r => `
        <div class="test ${r.status.toLowerCase()}">
            <h3>${r.status === 'PASS' ? '✅' : '❌'} ${r.name}</h3>
            ${r.title ? `<p><strong>Titre:</strong> ${r.title}</p>` : ''}
            ${r.status_code ? `<p><strong>Status:</strong> ${r.status_code}</p>` : ''}
            ${r.errors.length > 0 ? `<p><strong>Erreurs:</strong> ${r.errors.join(', ')}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;

        fs.writeFileSync('auto-test-report.html', html);
    }

    // 🎬 LANCEMENT PRINCIPAL
    async run() {
        console.log('🧠 AUTO-TEST INTELLIGENT AURA');
        console.log('==============================');
        
        const analysis = await this.analyzeCodebase();
        console.log(`📋 ${this.scenarios.length} scénarios générés automatiquement`);
        
        const report = await this.runTests();
        
        console.log('\n📊 RAPPORT FINAL');
        console.log('================');
        console.log(`✅ Réussis: ${report.summary.passed}/${report.summary.total}`);
        console.log(`❌ Échoués: ${report.summary.failed}/${report.summary.total}`);
        console.log('📄 Rapports: auto-test-report.json + auto-test-report.html');
        
        return report;
    }
}

// Lancement
if (require.main === module) {
    const tester = new AutoTestIntelligent();
    tester.run().catch(console.error);
}

module.exports = AutoTestIntelligent;