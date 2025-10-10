#!/usr/bin/env node
// 📊 COMPARATEUR DE RAPPORTS E2E AURA

const fs = require('fs');
const path = require('path');

class ReportDiff {
    constructor() {
        this.currentReport = null;
        this.previousReport = null;
        this.diff = {
            timestamp: new Date().toISOString(),
            changes: [],
            regressions: [],
            improvements: [],
            summary: {
                total_changes: 0,
                regressions: 0,
                improvements: 0,
                status_change: 'stable'
            }
        };
    }

    loadReports() {
        // Charger le rapport actuel
        if (fs.existsSync('test-e2e-report.json')) {
            this.currentReport = JSON.parse(fs.readFileSync('test-e2e-report.json', 'utf8'));
            console.log('✅ Rapport actuel chargé');
        } else {
            console.log('❌ Rapport actuel non trouvé');
            return false;
        }

        // Trouver le rapport précédent
        const reportFiles = fs.readdirSync('.')
            .filter(file => file.match(/^test-e2e-report-\d{8}-\d{6}\.json$/))
            .sort()
            .reverse();

        if (reportFiles.length > 0) {
            const previousFile = reportFiles[0];
            this.previousReport = JSON.parse(fs.readFileSync(previousFile, 'utf8'));
            console.log(`✅ Rapport précédent chargé: ${previousFile}`);
        } else {
            console.log('⚠️  Aucun rapport précédent trouvé');
            return false;
        }

        return true;
    }

    compareServices() {
        if (!this.currentReport.results || !this.previousReport.results) {
            console.log('⚠️  Structure de rapport invalide');
            return;
        }

        const currentServices = this.currentReport.results;
        const previousServices = this.previousReport.results;

        // Comparer chaque service
        const allServices = new Set([
            ...Object.keys(currentServices),
            ...Object.keys(previousServices)
        ]);

        for (const serviceName of allServices) {
            const current = currentServices[serviceName];
            const previous = previousServices[serviceName];

            if (!previous) {
                // Nouveau service
                this.diff.changes.push({
                    type: 'new_service',
                    service: serviceName,
                    status: current?.status || 'unknown',
                    message: `Nouveau service détecté: ${serviceName}`
                });
            } else if (!current) {
                // Service supprimé
                this.diff.changes.push({
                    type: 'removed_service',
                    service: serviceName,
                    previous_status: previous.status,
                    message: `Service supprimé: ${serviceName}`
                });
                this.diff.regressions.push(serviceName);
            } else if (current.status !== previous.status) {
                // Changement de statut
                const changeType = this.getChangeType(previous.status, current.status);
                
                this.diff.changes.push({
                    type: 'status_change',
                    service: serviceName,
                    previous_status: previous.status,
                    current_status: current.status,
                    change_type: changeType,
                    message: `${serviceName}: ${previous.status} → ${current.status}`
                });

                if (changeType === 'regression') {
                    this.diff.regressions.push(serviceName);
                } else if (changeType === 'improvement') {
                    this.diff.improvements.push(serviceName);
                }
            }
        }
    }

    getChangeType(previousStatus, currentStatus) {
        const statusPriority = {
            'SUCCESS': 3,
            'WARNING': 2,
            'FAILED': 1
        };

        const prevPriority = statusPriority[previousStatus] || 0;
        const currPriority = statusPriority[currentStatus] || 0;

        if (currPriority > prevPriority) {
            return 'improvement';
        } else if (currPriority < prevPriority) {
            return 'regression';
        }
        return 'stable';
    }

    compareMetrics() {
        const currentSummary = this.currentReport.summary;
        const previousSummary = this.previousReport.summary;

        if (currentSummary && previousSummary) {
            // Comparer les métriques globales
            const metrics = ['total', 'success', 'failed'];
            
            for (const metric of metrics) {
                const current = currentSummary[metric] || 0;
                const previous = previousSummary[metric] || 0;
                const diff = current - previous;

                if (diff !== 0) {
                    this.diff.changes.push({
                        type: 'metric_change',
                        metric,
                        previous_value: previous,
                        current_value: current,
                        difference: diff,
                        message: `${metric}: ${previous} → ${current} (${diff > 0 ? '+' : ''}${diff})`
                    });
                }
            }

            // Calculer le taux de réussite
            const currentSuccessRate = currentSummary.total > 0 ? 
                Math.round((currentSummary.success / currentSummary.total) * 100) : 0;
            const previousSuccessRate = previousSummary.total > 0 ? 
                Math.round((previousSummary.success / previousSummary.total) * 100) : 0;

            if (currentSuccessRate !== previousSuccessRate) {
                this.diff.changes.push({
                    type: 'success_rate_change',
                    previous_rate: previousSuccessRate,
                    current_rate: currentSuccessRate,
                    difference: currentSuccessRate - previousSuccessRate,
                    message: `Taux de réussite: ${previousSuccessRate}% → ${currentSuccessRate}%`
                });
            }
        }
    }

    generateSummary() {
        this.diff.summary.total_changes = this.diff.changes.length;
        this.diff.summary.regressions = this.diff.regressions.length;
        this.diff.summary.improvements = this.diff.improvements.length;

        // Déterminer le statut global
        if (this.diff.regressions.length > 0) {
            this.diff.summary.status_change = 'regression';
        } else if (this.diff.improvements.length > 0) {
            this.diff.summary.status_change = 'improvement';
        } else {
            this.diff.summary.status_change = 'stable';
        }
    }

    generateHTMLReport() {
        const html = `<!DOCTYPE html>
<html><head>
    <meta charset="utf-8">
    <title>Rapport de Différences E2E AURA</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 2em; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2em; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #336AEA; border-bottom: 3px solid #17D1C6; padding-bottom: 10px; }
        .summary { padding: 20px; border-radius: 8px; margin: 20px 0; }
        .regression { background: linear-gradient(135deg, #dc3545, #ff6b6b); color: white; }
        .improvement { background: linear-gradient(135deg, #28a745, #40c057); color: white; }
        .stable { background: linear-gradient(135deg, #6c757d, #adb5bd); color: white; }
        .change { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .change.regression { border-left-color: #dc3545; }
        .change.improvement { border-left-color: #28a745; }
        .change.new { border-left-color: #007bff; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head><body>
    <div class="container">
        <h1>📊 Rapport de Différences E2E AURA</h1>
        <div class="summary ${this.diff.summary.status_change}">
            <h2>📈 Résumé des Changements</h2>
            <p><strong>Date:</strong> ${new Date(this.diff.timestamp).toLocaleString('fr-FR')}</p>
            <p><strong>Changements totaux:</strong> ${this.diff.summary.total_changes}</p>
            <p><strong>Régressions:</strong> ${this.diff.summary.regressions}</p>
            <p><strong>Améliorations:</strong> ${this.diff.summary.improvements}</p>
            <p><strong>Statut:</strong> ${this.getStatusEmoji(this.diff.summary.status_change)} ${this.diff.summary.status_change.toUpperCase()}</p>
        </div>
        
        <h2>🔍 Détail des Changements</h2>
        ${this.diff.changes.length > 0 ? 
            this.diff.changes.map(change => `
                <div class="change ${change.change_type || change.type}">
                    <strong>${change.type.replace('_', ' ').toUpperCase()}:</strong> ${change.message}
                </div>
            `).join('') : 
            '<p>Aucun changement détecté.</p>'
        }
        
        <div class="footer">
            <p>Généré par AURA Report Diff | ${this.diff.timestamp}</p>
        </div>
    </div>
</body></html>`;

        fs.writeFileSync('test-e2e-diff-report.html', html);
        console.log('📝 Rapport HTML de différences: test-e2e-diff-report.html');
    }

    getStatusEmoji(status) {
        switch (status) {
            case 'regression': return '📉';
            case 'improvement': return '📈';
            case 'stable': return '➡️';
            default: return '❓';
        }
    }

    saveReport() {
        const filename = `test-e2e-diff-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.json`;
        fs.writeFileSync(filename, JSON.stringify(this.diff, null, 2));
        console.log(`📄 Rapport de différences sauvegardé: ${filename}`);
    }

    archiveCurrentReport() {
        if (fs.existsSync('test-e2e-report.json')) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const archiveName = `test-e2e-report-${timestamp}.json`;
            fs.copyFileSync('test-e2e-report.json', archiveName);
            console.log(`📦 Rapport actuel archivé: ${archiveName}`);
        }
    }

    run() {
        console.log('📊 COMPARAISON DES RAPPORTS E2E');
        console.log('===============================');

        if (!this.loadReports()) {
            console.log('❌ Impossible de charger les rapports');
            return;
        }

        this.compareServices();
        this.compareMetrics();
        this.generateSummary();

        console.log('\n📈 RÉSULTATS DE LA COMPARAISON');
        console.log('==============================');
        console.log(`Changements totaux: ${this.diff.summary.total_changes}`);
        console.log(`Régressions: ${this.diff.summary.regressions}`);
        console.log(`Améliorations: ${this.diff.summary.improvements}`);
        console.log(`Statut: ${this.diff.summary.status_change.toUpperCase()}`);

        if (this.diff.changes.length > 0) {
            console.log('\n🔍 Détail des changements:');
            this.diff.changes.forEach(change => {
                const emoji = change.change_type === 'regression' ? '📉' : 
                             change.change_type === 'improvement' ? '📈' : '🔄';
                console.log(`   ${emoji} ${change.message}`);
            });
        }

        this.generateHTMLReport();
        this.saveReport();
        this.archiveCurrentReport();

        // Alertes si nécessaire
        if (this.diff.summary.regressions > 0 && fs.existsSync('ALERT-SYSTEM.sh')) {
            const { spawn } = require('child_process');
            spawn('./ALERT-SYSTEM.sh', [
                'WARNING', 
                `E2E Tests: ${this.diff.summary.regressions} regressions detected`
            ], { stdio: 'inherit' });
        }

        console.log('\n✅ Comparaison terminée');
    }
}

// Lancement si appelé directement
if (require.main === module) {
    const differ = new ReportDiff();
    differ.run();
}

module.exports = ReportDiff;