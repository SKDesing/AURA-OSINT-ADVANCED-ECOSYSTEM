#!/usr/bin/env node

/**
 * 📊 BENCHMARK PERFORMANCE AURA
 * Script de mesure des métriques avant/après optimisation
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const axios = require('axios').default;

class AuraBenchmark {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            version: this.getVersion(),
            metrics: {},
            services: {}
        };
        this.baseUrl = 'http://localhost';
        this.ports = {
            backend: 3000,
            frontend: 3001,
            analyser: 4002,
            dashboard: 4003,
            database: 4004
        };
    }

    getVersion() {
        try {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            return pkg.version;
        } catch {
            return 'unknown';
        }
    }

    async measureMemoryUsage() {
        const usage = process.memoryUsage();
        return {
            rss: Math.round(usage.rss / 1024 / 1024), // MB
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
            external: Math.round(usage.external / 1024 / 1024)
        };
    }

    async measureResponseTime(url, timeout = 5000) {
        try {
            const start = performance.now();
            await axios.get(url, { timeout });
            const end = performance.now();
            return Math.round(end - start);
        } catch (error) {
            return -1; // Service indisponible
        }
    }

    async measureDatabasePerformance() {
        const queries = [
            '/api/sessions',
            '/api/comments?limit=100',
            '/api/stats',
            '/api/profiles?limit=50'
        ];

        const results = {};
        for (const query of queries) {
            const url = `${this.baseUrl}:${this.ports.backend}${query}`;
            results[query] = await this.measureResponseTime(url);
        }
        return results;
    }

    async measureServiceAvailability() {
        const services = {};
        
        for (const [name, port] of Object.entries(this.ports)) {
            const url = `${this.baseUrl}:${port}/health`;
            const responseTime = await this.measureResponseTime(url, 3000);
            services[name] = {
                port,
                available: responseTime > 0,
                responseTime: responseTime > 0 ? responseTime : null
            };
        }
        
        return services;
    }

    async measureFileSystemPerformance() {
        const testFile = path.join(__dirname, 'benchmark-test.tmp');
        const testData = 'x'.repeat(1024 * 1024); // 1MB
        
        // Test écriture
        const writeStart = performance.now();
        fs.writeFileSync(testFile, testData);
        const writeTime = performance.now() - writeStart;
        
        // Test lecture
        const readStart = performance.now();
        fs.readFileSync(testFile);
        const readTime = performance.now() - readStart;
        
        // Nettoyage
        fs.unlinkSync(testFile);
        
        return {
            writeTime: Math.round(writeTime),
            readTime: Math.round(readTime),
            throughput: Math.round(1024 / (writeTime / 1000)) // MB/s
        };
    }

    async runFullBenchmark() {
        console.log('🚀 Démarrage benchmark AURA...');
        console.log(`📊 Version: ${this.results.version}`);
        console.log(`⏰ Timestamp: ${this.results.timestamp}`);
        console.log('');

        // 1. Mémoire système
        console.log('📈 Mesure utilisation mémoire...');
        this.results.metrics.memory = await this.measureMemoryUsage();
        
        // 2. Performance base de données
        console.log('🗄️ Test performance base de données...');
        this.results.metrics.database = await this.measureDatabasePerformance();
        
        // 3. Disponibilité services
        console.log('🔍 Vérification disponibilité services...');
        this.results.services = await this.measureServiceAvailability();
        
        // 4. Performance système fichiers
        console.log('💾 Test performance système fichiers...');
        this.results.metrics.filesystem = await this.measureFileSystemPerformance();
        
        // 5. Calcul score global
        this.calculateGlobalScore();
        
        return this.results;
    }

    calculateGlobalScore() {
        let score = 100;
        
        // Pénalités performance
        const avgDbTime = Object.values(this.results.metrics.database)
            .filter(t => t > 0)
            .reduce((a, b) => a + b, 0) / 4;
        
        if (avgDbTime > 500) score -= 20;
        else if (avgDbTime > 200) score -= 10;
        
        // Pénalités mémoire
        if (this.results.metrics.memory.heapUsed > 500) score -= 15;
        else if (this.results.metrics.memory.heapUsed > 200) score -= 5;
        
        // Pénalités services indisponibles
        const unavailableServices = Object.values(this.results.services)
            .filter(s => !s.available).length;
        score -= unavailableServices * 15;
        
        this.results.globalScore = Math.max(0, Math.round(score));
    }

    displayResults() {
        console.log('\n🎯 RÉSULTATS BENCHMARK');
        console.log('========================');
        
        // Score global
        const scoreColor = this.results.globalScore >= 80 ? '🟢' : 
                          this.results.globalScore >= 60 ? '🟡' : '🔴';
        console.log(`${scoreColor} Score Global: ${this.results.globalScore}/100`);
        console.log('');
        
        // Mémoire
        console.log('📊 MÉMOIRE:');
        console.log(`  Heap Utilisé: ${this.results.metrics.memory.heapUsed} MB`);
        console.log(`  RSS Total: ${this.results.metrics.memory.rss} MB`);
        console.log('');
        
        // Base de données
        console.log('🗄️ BASE DE DONNÉES:');
        Object.entries(this.results.metrics.database).forEach(([query, time]) => {
            const status = time > 0 ? `${time}ms` : '❌ Échec';
            const perf = time > 0 && time < 200 ? '🟢' : time > 0 && time < 500 ? '🟡' : '🔴';
            console.log(`  ${query}: ${perf} ${status}`);
        });
        console.log('');
        
        // Services
        console.log('🔧 SERVICES:');
        Object.entries(this.results.services).forEach(([name, service]) => {
            const status = service.available ? 
                `🟢 ${service.responseTime}ms` : '🔴 Indisponible';
            console.log(`  ${name} (${service.port}): ${status}`);
        });
        console.log('');
        
        // Système fichiers
        console.log('💾 SYSTÈME FICHIERS:');
        console.log(`  Écriture: ${this.results.metrics.filesystem.writeTime}ms`);
        console.log(`  Lecture: ${this.results.metrics.filesystem.readTime}ms`);
        console.log(`  Débit: ${this.results.metrics.filesystem.throughput} MB/s`);
    }

    saveResults() {
        const filename = `benchmark-${this.results.version}-${Date.now()}.json`;
        const filepath = path.join(__dirname, 'logs', filename);
        
        // Créer dossier logs si nécessaire
        const logsDir = path.dirname(filepath);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
        fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Résultats sauvegardés: ${filename}`);
        
        return filepath;
    }

    static async compare(beforeFile, afterFile) {
        const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
        const after = JSON.parse(fs.readFileSync(afterFile, 'utf8'));
        
        console.log('\n📊 COMPARAISON PERFORMANCE');
        console.log('============================');
        console.log(`Avant: ${before.version} | Après: ${after.version}`);
        console.log('');
        
        // Score global
        const scoreDiff = after.globalScore - before.globalScore;
        const scoreIcon = scoreDiff > 0 ? '📈' : scoreDiff < 0 ? '📉' : '➡️';
        console.log(`${scoreIcon} Score: ${before.globalScore} → ${after.globalScore} (${scoreDiff > 0 ? '+' : ''}${scoreDiff})`);
        
        // Mémoire
        const memDiff = after.metrics.memory.heapUsed - before.metrics.memory.heapUsed;
        const memIcon = memDiff < 0 ? '📈' : memDiff > 0 ? '📉' : '➡️';
        console.log(`${memIcon} Mémoire: ${before.metrics.memory.heapUsed}MB → ${after.metrics.memory.heapUsed}MB`);
        
        // Base de données (moyenne)
        const beforeDbAvg = Object.values(before.metrics.database).filter(t => t > 0).reduce((a, b) => a + b, 0) / 4;
        const afterDbAvg = Object.values(after.metrics.database).filter(t => t > 0).reduce((a, b) => a + b, 0) / 4;
        const dbDiff = afterDbAvg - beforeDbAvg;
        const dbIcon = dbDiff < 0 ? '📈' : dbDiff > 0 ? '📉' : '➡️';
        console.log(`${dbIcon} DB Moyenne: ${Math.round(beforeDbAvg)}ms → ${Math.round(afterDbAvg)}ms`);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    const benchmark = new AuraBenchmark();
    
    benchmark.runFullBenchmark()
        .then(results => {
            benchmark.displayResults();
            const filepath = benchmark.saveResults();
            
            console.log('\n🎯 UTILISATION:');
            console.log('================');
            console.log('# Avant optimisation:');
            console.log('node benchmark-performance.js');
            console.log('');
            console.log('# Après optimisation:');
            console.log('node benchmark-performance.js');
            console.log('');
            console.log('# Comparaison:');
            console.log(`node -e "require('./benchmark-performance.js').AuraBenchmark.compare('logs/before.json', 'logs/after.json')"`);
        })
        .catch(error => {
            console.error('❌ Erreur benchmark:', error.message);
            process.exit(1);
        });
}

module.exports = { AuraBenchmark };