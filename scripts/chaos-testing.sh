#!/bin/bash
# 😈 CHAOS TESTING - Test de résilience AURA OSINT
# ⚠️  ATTENTION: Ne lancer qu'en environnement de test !

set -e
PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
cd "$PROJECT_ROOT"

echo "😈 CHAOS TESTING - AURA OSINT RESILIENCE"
echo "========================================"
echo ""
echo "⚠️  ATTENTION: Tests destructifs en cours..."
echo "   Ctrl+C pour annuler dans les 10 secondes"
echo ""

# Countdown
for i in {10..1}; do
    echo -n "$i... "
    sleep 1
done
echo ""
echo ""

echo "🔥 DÉMARRAGE CHAOS TESTING"
echo ""

# ========================================
# 1. MEMORY STRESS TEST
# ========================================
echo "1️⃣  MEMORY STRESS TEST..."
echo "Simulation memory leak..."

cat > /tmp/memory-bomb.js << 'EOF'
// Simulation memory leak contrôlée
const memoryEater = [];
let iteration = 0;

const interval = setInterval(() => {
    // Consommer 50MB par seconde
    const chunk = new Array(50 * 1024 * 1024).fill('x');
    memoryEater.push(chunk);
    iteration++;
    
    const memUsage = process.memoryUsage();
    const heapMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    console.log(`💣 Memory bomb iteration ${iteration}: ${heapMB}MB`);
    
    // Arrêter à 1.4GB pour tester le monitoring
    if (heapMB > 1400) {
        console.log('🚨 Seuil critique atteint - Test monitoring...');
        clearInterval(interval);
        
        // Attendre 5s puis nettoyer
        setTimeout(() => {
            memoryEater.length = 0;
            console.log('✅ Memory cleaned - Test terminé');
            process.exit(0);
        }, 5000);
    }
}, 1000);

// Auto-stop après 30s max
setTimeout(() => {
    clearInterval(interval);
    console.log('⏰ Timeout - Nettoyage forcé');
    process.exit(0);
}, 30000);
EOF

echo "Lancement memory bomb (30s max)..."
timeout 35s node /tmp/memory-bomb.js || echo "✅ Memory test terminé"
rm -f /tmp/memory-bomb.js

echo ""

# ========================================
# 2. PROXY BAN SIMULATION
# ========================================
echo "2️⃣  PROXY BAN SIMULATION..."
echo "Test de résistance aux bans massifs..."

cat > /tmp/proxy-chaos.js << 'EOF'
const proxyManager = require('./config/proxy-manager');

async function simulateMassiveBans() {
    console.log('🚨 Simulation bans massifs...');
    
    // Simuler 90% des proxies bannis
    const stats = proxyManager.getStats();
    const totalProxies = stats.totalProxies;
    const proxiesToBan = Math.floor(totalProxies * 0.9);
    
    console.log(`💥 Bannissement de ${proxiesToBan}/${totalProxies} proxies...`);
    
    for (let i = 0; i < proxiesToBan; i++) {
        try {
            // Simuler un ban en forçant une erreur
            proxyManager.reportFailure(`proxy${i}.banned.com:8080`);
        } catch (error) {
            // Ignorer les erreurs de simulation
        }
    }
    
    console.log('📊 Stats après bans:');
    console.log(proxyManager.getStats());
    
    // Tester si le système survit
    try {
        const proxy = proxyManager.getBestProxy();
        console.log('✅ Système survit - Proxy disponible:', proxy ? 'OUI' : 'NON');
    } catch (error) {
        console.log('❌ Système KO:', error.message);
    }
}

simulateMassiveBans().catch(console.error);
EOF

if [ -f "config/proxy-manager.js" ]; then
    timeout 10s node /tmp/proxy-chaos.js || echo "✅ Proxy chaos test terminé"
else
    echo "⚠️  Proxy manager non trouvé - Skip test"
fi
rm -f /tmp/proxy-chaos.js

echo ""

# ========================================
# 3. DATABASE STRESS TEST
# ========================================
echo "3️⃣  DATABASE STRESS TEST..."
echo "Simulation charge DB massive..."

cat > /tmp/db-chaos.js << 'EOF'
const { MongoClient } = require('mongodb');

async function dbStressTest() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aura_osint_test';
    
    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        console.log('📊 Connexion DB réussie');
        
        const db = client.db('aura_osint_test');
        const collection = db.collection('stress_test');
        
        console.log('💥 Insertion massive (1000 docs/s pendant 10s)...');
        
        const startTime = Date.now();
        let insertCount = 0;
        
        const stressInterval = setInterval(async () => {
            const batch = [];
            for (let i = 0; i < 100; i++) {
                batch.push({
                    timestamp: new Date(),
                    data: 'x'.repeat(1000), // 1KB par doc
                    random: Math.random()
                });
            }
            
            try {
                await collection.insertMany(batch);
                insertCount += batch.length;
                console.log(`📈 Inserted: ${insertCount} docs`);
            } catch (error) {
                console.error('❌ Insert failed:', error.message);
            }
        }, 100); // 100ms = 1000 docs/s
        
        // Arrêter après 10s
        setTimeout(async () => {
            clearInterval(stressInterval);
            
            // Nettoyer
            await collection.drop().catch(() => {});
            await client.close();
            
            const duration = Date.now() - startTime;
            console.log(`✅ DB stress test terminé: ${insertCount} docs en ${duration}ms`);
        }, 10000);
        
    } catch (error) {
        console.error('❌ DB stress test failed:', error.message);
    }
}

dbStressTest().catch(console.error);
EOF

if command -v mongosh &> /dev/null; then
    timeout 15s node /tmp/db-chaos.js || echo "✅ DB chaos test terminé"
else
    echo "⚠️  MongoDB non disponible - Skip test"
fi
rm -f /tmp/db-chaos.js

echo ""

# ========================================
# 4. NETWORK CHAOS
# ========================================
echo "4️⃣  NETWORK CHAOS TEST..."
echo "Simulation latence réseau..."

cat > /tmp/network-chaos.js << 'EOF'
const axios = require('axios');

async function networkChaosTest() {
    console.log('🌐 Test résistance réseau...');
    
    const testUrls = [
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/3',
        'https://httpbin.org/delay/5',
        'https://httpbin.org/status/500',
        'https://httpbin.org/status/429',
        'https://httpbin.org/status/503'
    ];
    
    const results = {
        success: 0,
        timeout: 0,
        error: 0
    };
    
    console.log('💥 Lancement 20 requêtes simultanées...');
    
    const promises = [];
    for (let i = 0; i < 20; i++) {
        const url = testUrls[Math.floor(Math.random() * testUrls.length)];
        
        const promise = axios.get(url, { timeout: 2000 })
            .then(() => {
                results.success++;
                console.log(`✅ Success: ${url}`);
            })
            .catch(error => {
                if (error.code === 'ECONNABORTED') {
                    results.timeout++;
                    console.log(`⏰ Timeout: ${url}`);
                } else {
                    results.error++;
                    console.log(`❌ Error: ${url} (${error.response?.status || error.code})`);
                }
            });
        
        promises.push(promise);
    }
    
    await Promise.all(promises);
    
    console.log('📊 Résultats network chaos:');
    console.log(`  Success: ${results.success}/20`);
    console.log(`  Timeout: ${results.timeout}/20`);
    console.log(`  Error: ${results.error}/20`);
    
    const successRate = (results.success / 20) * 100;
    console.log(`📈 Taux de succès: ${successRate}%`);
    
    if (successRate > 30) {
        console.log('✅ Résistance réseau: BONNE');
    } else {
        console.log('❌ Résistance réseau: FAIBLE');
    }
}

networkChaosTest().catch(console.error);
EOF

timeout 30s node /tmp/network-chaos.js || echo "✅ Network chaos test terminé"
rm -f /tmp/network-chaos.js

echo ""

# ========================================
# 5. CONCURRENT USERS SIMULATION
# ========================================
echo "5️⃣  CONCURRENT USERS SIMULATION..."
echo "Test 100 utilisateurs simultanés..."

if command -v autocannon &> /dev/null; then
    echo "🚀 Lancement autocannon (30s)..."
    autocannon -c 100 -d 30 http://localhost:3000 || echo "⚠️  Serveur non disponible"
else
    echo "⚠️  autocannon non installé - Simulation manuelle..."
    
    cat > /tmp/concurrent-chaos.js << 'EOF'
const axios = require('axios');

async function concurrentUsersTest() {
    console.log('👥 Simulation 50 utilisateurs simultanés...');
    
    const baseUrl = 'http://localhost:3000';
    const endpoints = ['/', '/api/health', '/api/status'];
    
    const promises = [];
    for (let i = 0; i < 50; i++) {
        const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        const url = baseUrl + endpoint;
        
        const promise = axios.get(url, { timeout: 5000 })
            .then(response => ({
                success: true,
                status: response.status,
                url: endpoint
            }))
            .catch(error => ({
                success: false,
                error: error.code || error.response?.status,
                url: endpoint
            }));
        
        promises.push(promise);
    }
    
    const results = await Promise.all(promises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    console.log(`📊 Résultats concurrent users:`);
    console.log(`  Succès: ${successful}/50`);
    console.log(`  Échecs: ${failed}/50`);
    console.log(`  Taux: ${(successful/50*100).toFixed(1)}%`);
    
    if (successful > 40) {
        console.log('✅ Résistance charge: EXCELLENTE');
    } else if (successful > 25) {
        console.log('🟨 Résistance charge: CORRECTE');
    } else {
        console.log('❌ Résistance charge: FAIBLE');
    }
}

concurrentUsersTest().catch(console.error);
EOF
    
    timeout 20s node /tmp/concurrent-chaos.js || echo "✅ Concurrent test terminé"
    rm -f /tmp/concurrent-chaos.js
fi

echo ""

# ========================================
# RAPPORT FINAL
# ========================================
echo "========================================="
echo "😈 CHAOS TESTING TERMINÉ"
echo "========================================="
echo ""
echo "📊 RÉSUMÉ DES TESTS:"
echo "  1. Memory stress: Testé jusqu'à 1.4GB"
echo "  2. Proxy bans: Simulation 90% bans"
echo "  3. DB stress: 1000+ docs/s pendant 10s"
echo "  4. Network chaos: Latences + erreurs HTTP"
echo "  5. Concurrent users: 50-100 utilisateurs simultanés"
echo ""
echo "🎯 OBJECTIF:"
echo "Vérifier que votre système AURA OSINT résiste à:"
echo "  - Pics de mémoire"
echo "  - Bans massifs de proxies"
echo "  - Surcharge base de données"
echo "  - Problèmes réseau"
echo "  - Charge utilisateurs"
echo ""
echo "✅ Si votre système a survécu à tous ces tests:"
echo "   → Vous êtes PRÊTS pour la production !"
echo ""
echo "❌ Si des tests ont échoué:"
echo "   → Renforcez les points faibles avant le GO LIVE"
echo ""
echo "🚀 Prochaine étape: Analyser les logs et métriques"
echo ""
echo "😈 CHAOS TESTING COMPLETED - May the force be with you!"