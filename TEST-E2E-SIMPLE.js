const fetch = require('node-fetch');

class TestE2ESimple {
    constructor() {
        this.results = [];
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
                this.results.push({
                    service: `API${endpoint}`,
                    status: 'FAILED',
                    error: error.message
                });
            }
        }
    }

    async testServices() {
        console.log('🌐 Test Services Web...');
        
        const services = [
            { name: 'GUI', url: 'http://localhost:3000' },
            { name: 'React Frontend', url: 'http://localhost:3002' },
            { name: 'Vitrine', url: 'http://localhost:3001' }
        ];
        
        for (const service of services) {
            try {
                const response = await fetch(service.url);
                console.log(`   ${service.name}: ${response.status}`);
                
                this.results.push({
                    service: service.name,
                    status: response.ok ? 'SUCCESS' : 'FAILED',
                    code: response.status
                });
            } catch (error) {
                console.log(`   ${service.name}: ERROR - ${error.message}`);
                this.results.push({
                    service: service.name,
                    status: 'FAILED',
                    error: error.message
                });
            }
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
        
        return report;
    }

    async run() {
        console.log('🚀 TEST E2E SIMPLE AURA');
        console.log('========================');
        
        await this.testServices();
        await this.testAPI();
        
        const report = await this.generateReport();
        return report;
    }
}

// Lancement
if (require.main === module) {
    const tester = new TestE2ESimple();
    tester.run().catch(console.error);
}

module.exports = TestE2ESimple;