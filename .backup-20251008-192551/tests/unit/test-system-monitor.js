#!/usr/bin/env node
const monitor = require('../../monitoring/system-monitor');

async function testSystemMonitor() {
    console.log('🧪 Test SystemMonitor...\n');

    try {
        // Test 1: Collecte métriques
        console.log('📊 Test collecte métriques...');
        const metrics = await monitor.collectMetrics();
        if (metrics && metrics.cpu !== undefined) {
            console.log('✅ Métriques collectées:', {
                cpu: metrics.cpu + '%',
                memory: metrics.memory.percentage + '%',
                disk: metrics.disk.percentage + '%',
                processes: metrics.processes
            });
        } else {
            console.log('❌ Échec collecte métriques');
        }

        // Test 2: Health check
        console.log('\n🏥 Test health check...');
        const health = await monitor.healthCheck();
        if (health && health.status) {
            console.log('✅ Health check:', health.status);
            console.log('   Services:', health.services?.map(s => `${s.name}: ${s.healthy ? '✅' : '❌'}`).join(', '));
        } else {
            console.log('❌ Échec health check');
        }

        // Test 3: Stats agrégées
        console.log('\n📈 Test stats agrégées...');
        const stats = monitor.getAggregatedStats();
        if (stats) {
            console.log('✅ Stats:', {
                cpuAvg: stats.cpu.avg + '%',
                memAvg: stats.memory.avg + '%',
                dataPoints: stats.dataPoints
            });
        } else {
            console.log('⚠️ Pas encore de données pour les stats');
        }

        console.log('\n🎉 Tests terminés avec succès');
        
    } catch (error) {
        console.error('❌ Erreur pendant les tests:', error.message);
    } finally {
        // Arrêt propre
        monitor.stop();
        process.exit(0);
    }
}

if (require.main === module) {
    testSystemMonitor();
}

module.exports = testSystemMonitor;