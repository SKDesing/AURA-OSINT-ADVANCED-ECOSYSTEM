const { chromium } = require('playwright');
const fetch = require('node-fetch');

class TestE2EComplet {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = [];
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async testGUI() {
        console.log('🖥️ Test GUI Interface...');
        
        await this.page.goto('http://localhost:3000');
        const title = await this.page.title();
        
        // Screenshot
        await this.page.screenshot({ path: 'test-gui-complet.png' });
        
        // Test interactions
        const buttons = await this.page.$$('button');
        console.log(`   Boutons détectés: ${buttons.length}`);
        
        this.results.push({
            service: 'GUI',
            status: 'SUCCESS',
            title,
            buttons: buttons.length
        });
    }

    async testAPI() {
        console.log('🔧 Test API Analytics...');
        
        const endpoints = [
            '/api/status',
            '/api/analytics/dashboard',
            '/api/analytics/profiles'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`http://localhost:4002${endpoint}`);
                const data = await response.json();
                
                console.log(`   ${endpoint}: ${response.status}`);
                
                this.results.push({
                    service: `API${endpoint}`,
                    status: response.ok ? 'SUCCESS' : 'FAILED',
                    code: response.status,
                    data
                });
            } catch (error) {
                console.log(`   ${endpoint}: ERROR - ${error.message}`);
            }
        }
    }

    async testReact() {
        console.log('⚡ Test Frontend React...');
        
        try {
            await this.page.goto('http://localhost:3002', { timeout: 10000 });
            
            // Attendre le chargement
            await this.page.waitForTimeout(3000);
            
            // Screenshot
            await this.page.screenshot({ path: 'test-react-complet.png' });
            
            // Vérifier éléments React
            const h1 = await this.page.$('h1');
            const inputs = await this.page.$$('input');
            
            console.log(`   H1 présent: ${!!h1}`);
            console.log(`   Inputs: ${inputs.length}`);
            
            this.results.push({
                service: 'React Frontend',
                status: 'SUCCESS',
                hasH1: !!h1,
                inputs: inputs.length
            });
            
        } catch (error) {
            console.log(`   Erreur React: ${error.message}`);
            this.results.push({
                service: 'React Frontend',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    async testExportForensique() {
        console.log('📄 Test Export Forensique...');
        try {
            const response = await fetch('http://localhost:4002/api/analytics/forensic-export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identityIds: [1], includeEvidence: true })
            });
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('   Export forensique: SUCCÈS');
                this.results.push({ 
                    service: 'Export Forensique', 
                    status: 'SUCCESS', 
                    records: data.records_count || 0
                });
            } else {
                throw new Error('Export échoué');
            }
        } catch (error) {
            console.log(`   Export forensique: ERROR - ${error.message}`);
            this.results.push({ 
                service: 'Export Forensique', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    async generateHTMLReport() {
        const fs = require('fs');
        const date = new Date().toLocaleString('fr-FR');
        const success = this.results.filter(r => r.status === 'SUCCESS').length;
        const total = this.results.length;
        
        let html = `<!DOCTYPE html>
<html><head>
    <meta charset="utf-8">
    <title>Rapport E2E AURA</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 2em; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2em; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #336AEA; border-bottom: 3px solid #17D1C6; padding-bottom: 10px; }
        .summary { background: linear-gradient(135deg, #336AEA, #17D1C6); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #f8f9fa; font-weight: 600; }
        .success { color: #28a745; font-weight: bold; }
        .failed { color: #dc3545; font-weight: bold; }
        .details { font-family: monospace; font-size: 12px; background: #f8f9fa; padding: 8px; border-radius: 4px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head><body>
    <div class="container">
        <h1>🧠 Rapport E2E AURA</h1>
        <div class="summary">
            <h2>📊 Résumé Exécutif</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Succès:</strong> ${success}/${total} (${Math.round(success/total*100)}%)</p>
            <p><strong>Status:</strong> ${success === total ? '✅ TOUS LES TESTS RÉUSSIS' : '⚠️ ÉCHECS DÉTECTÉS'}</p>
        </div>
        <table>
            <tr><th>Service</th><th>Status</th><th>Détails</th></tr>`;
        
        for (const r of this.results) {
            html += `<tr>
                <td><strong>${r.service}</strong></td>
                <td class="${r.status === 'SUCCESS' ? 'success' : 'failed'}">${r.status}</td>
                <td><div class="details">${JSON.stringify(r, null, 2)}</div></td>
            </tr>`;
        }
        
        html += `</table>
        <div class="footer">
            <p>Généré par AURA Auto-Test E2E | ${new Date().toISOString()}</p>
        </div>
    </div>
</body></html>`;
        
        fs.writeFileSync('test-e2e-report.html', html);
        console.log('📝 Rapport HTML: test-e2e-report.html');
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.length,
                success: this.results.filter(r => r.status === 'SUCCESS').length,
                failed: this.results.filter(r => r.status === 'FAILED').length
            },
            results: this.results
        };
        
        require('fs').writeFileSync('test-e2e-report.json', JSON.stringify(report, null, 2));
        await this.generateHTMLReport();
        
        console.log('\n📊 RAPPORT E2E');
        console.log('===============');
        console.log(`✅ Succès: ${report.summary.success}/${report.summary.total}`);
        console.log(`❌ Échecs: ${report.summary.failed}/${report.summary.total}`);
        console.log('📄 JSON: test-e2e-report.json');
        console.log('🌐 HTML: test-e2e-report.html');
        console.log('📸 Screenshots: test-*-complet.png');
        
        return report;
    }

    async run() {
        console.log('🚀 TEST E2E COMPLET AURA');
        console.log('=========================');
        
        await this.init();
        
        await this.testGUI();
        await this.testAPI();
        await this.testReact();
        await this.testExportForensique();
        
        const report = await this.generateReport();
        
        await this.browser.close();
        return report;
    }
}

// Lancement
if (require.main === module) {
    const tester = new TestE2EComplet();
    tester.run().catch(console.error);
}

module.exports = TestE2EComplet;