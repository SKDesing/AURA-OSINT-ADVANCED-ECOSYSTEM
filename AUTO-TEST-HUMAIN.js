#!/usr/bin/env node
// 🤖 AUTO-TEST HUMAIN - Simulation utilisateur intelligent

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AutoTestHumain {
    constructor() {
        this.browser = null;
        this.page = null;
        this.services = {
            gui: 'http://localhost:3000',
            api: 'http://localhost:4002',
            react: 'http://localhost:3002',
            vitrine: 'http://localhost:3001'
        };
        this.results = [];
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // Simulation comportement humain
        await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
        await this.page.setViewport({ width: 1920, height: 1080 });
    }

    async testService(name, url) {
        console.log(`🧪 Test ${name}: ${url}`);
        
        try {
            // 1. Test de connexion
            const response = await this.page.goto(url, { 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
            
            if (!response.ok()) {
                throw new Error(`HTTP ${response.status()}`);
            }

            // 2. Analyse du DOM
            const pageAnalysis = await this.page.evaluate(() => {
                return {
                    title: document.title,
                    hasReact: !!window.React,
                    hasAPI: !!window.fetch,
                    buttons: document.querySelectorAll('button').length,
                    forms: document.querySelectorAll('form').length,
                    inputs: document.querySelectorAll('input').length,
                    errors: document.querySelectorAll('.error, .alert-danger').length,
                    loading: document.querySelectorAll('.loading, .spinner').length
                };
            });

            // 3. Test interactions humaines
            await this.simulateHumanBehavior();

            // 4. Test API si disponible
            let apiTest = null;
            if (name === 'api') {
                apiTest = await this.testAPIEndpoints();
            }

            this.results.push({
                service: name,
                url,
                status: 'SUCCESS',
                analysis: pageAnalysis,
                apiTest,
                timestamp: new Date().toISOString()
            });

            console.log(`✅ ${name} - OK`);

        } catch (error) {
            this.results.push({
                service: name,
                url,
                status: 'FAILED',
                error: error.message,
                timestamp: new Date().toISOString()
            });

            console.log(`❌ ${name} - ERREUR: ${error.message}`);
        }
    }

    async simulateHumanBehavior() {
        // Simulation scroll humain
        await this.page.evaluate(() => {
            window.scrollBy(0, Math.random() * 500);
        });
        
        await this.delay(500 + Math.random() * 1000);

        // Test clics sur boutons visibles
        const buttons = await this.page.$$('button:not([disabled])');
        if (buttons.length > 0) {
            const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
            try {
                await randomButton.click();
                await this.delay(1000);
            } catch (e) {
                // Bouton non cliquable, normal
            }
        }

        // Test saisie dans inputs
        const inputs = await this.page.$$('input[type="text"], input[type="search"]');
        if (inputs.length > 0) {
            const randomInput = inputs[0];
            try {
                await randomInput.type('test_user', { delay: 100 });
                await this.delay(500);
            } catch (e) {
                // Input non accessible, normal
            }
        }
    }

    async testAPIEndpoints() {
        const endpoints = [
            '/api/status',
            '/api/analytics/dashboard',
            '/api/analytics/profiles'
        ];

        const results = {};
        
        for (const endpoint of endpoints) {
            try {
                const response = await this.page.evaluate(async (url) => {
                    const res = await fetch(url);
                    return {
                        status: res.status,
                        ok: res.ok,
                        data: await res.json()
                    };
                }, `http://localhost:4002${endpoint}`);
                
                results[endpoint] = response;
            } catch (error) {
                results[endpoint] = { error: error.message };
            }
        }

        return results;
    }

    async analyzeSourceCode() {
        console.log('🔍 Analyse du code source...');
        
        const analysis = {
            frontend_react: this.analyzeReactApp(),
            gui_launcher: this.analyzeGUILauncher(),
            api_endpoints: this.analyzeAPIEndpoints()
        };

        return analysis;
    }

    analyzeReactApp() {
        const srcPath = path.join(__dirname, 'frontend-react/src');
        if (!fs.existsSync(srcPath)) return { error: 'Dossier src non trouvé' };

        const components = [];
        const files = fs.readdirSync(srcPath, { recursive: true });
        
        files.forEach(file => {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                const content = fs.readFileSync(path.join(srcPath, file), 'utf8');
                components.push({
                    file,
                    hasState: content.includes('useState'),
                    hasEffect: content.includes('useEffect'),
                    hasAPI: content.includes('fetch') || content.includes('axios'),
                    hasRouting: content.includes('Route') || content.includes('useNavigate')
                });
            }
        });

        return { components, total: components.length };
    }

    analyzeGUILauncher() {
        const guiPath = path.join(__dirname, 'gui-launcher.js');
        if (!fs.existsSync(guiPath)) return { error: 'gui-launcher.js non trouvé' };

        const content = fs.readFileSync(guiPath, 'utf8');
        return {
            hasExpress: content.includes('express'),
            hasRoutes: (content.match(/app\.(get|post)/g) || []).length,
            hasStatic: content.includes('express.static'),
            hasProxy: content.includes('proxy')
        };
    }

    analyzeAPIEndpoints() {
        const apiPath = path.join(__dirname, 'analytics-api.js');
        if (!fs.existsSync(apiPath)) return { error: 'analytics-api.js non trouvé' };

        const content = fs.readFileSync(apiPath, 'utf8');
        const endpoints = content.match(/app\.(get|post|put|delete)\(['"`]([^'"`]+)/g) || [];
        
        return {
            endpoints: endpoints.map(e => e.split(/['"`]/)[1]),
            total: endpoints.length,
            hasCORS: content.includes('cors') || content.includes('Access-Control'),
            hasDB: content.includes('Pool') || content.includes('database')
        };
    }

    async runFullTest() {
        console.log('🚀 DÉMARRAGE AUTO-TEST HUMAIN');
        console.log('==============================');

        await this.init();

        // 1. Analyse du code source
        const sourceAnalysis = await this.analyzeSourceCode();
        
        // 2. Test de tous les services
        for (const [name, url] of Object.entries(this.services)) {
            await this.testService(name, url);
            await this.delay(2000); // Pause entre tests
        }

        // 3. Génération du rapport
        const report = {
            timestamp: new Date().toISOString(),
            sourceAnalysis,
            serviceTests: this.results,
            summary: {
                total: this.results.length,
                success: this.results.filter(r => r.status === 'SUCCESS').length,
                failed: this.results.filter(r => r.status === 'FAILED').length
            }
        };

        // 4. Sauvegarde
        fs.writeFileSync('auto-test-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n📊 RAPPORT AUTO-TEST');
        console.log('====================');
        console.log(`✅ Succès: ${report.summary.success}/${report.summary.total}`);
        console.log(`❌ Échecs: ${report.summary.failed}/${report.summary.total}`);
        console.log('📄 Rapport: auto-test-report.json');

        await this.browser.close();
        return report;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Lancement si appelé directement
if (require.main === module) {
    const tester = new AutoTestHumain();
    tester.runFullTest().catch(console.error);
}

module.exports = AutoTestHumain;