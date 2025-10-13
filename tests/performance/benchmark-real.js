const { performance } = require('perf_hooks');

const axios = require('axios');

const BASE_URL = 'http://localhost:4002';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 100;

async function measureEndpoint(url, method = 'GET', data = null) {
  const start = performance.now();
  try {
    const response = await axios({ method, url, data });
    const end = performance.now();
    return {
      success: true,
      duration: end - start,
      status: response.status,
      size: JSON.stringify(response.data).length
    };
  } catch (error) {
    const end = performance.now();
    return {
      success: false,
      duration: end - start,
      error: error.message
    };
  }
}

async function runBenchmark() {
  console.log('🚀 AURA OSINT - Benchmark Réel\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'OSINT Search',
      url: `${BASE_URL}/api/v1/osint/search`,
      method: 'POST',
      data: { query: 'test', platforms: ['all'] }
    },
    {
      name: 'OSINT Analyze',
      url: `${BASE_URL}/api/v1/osint/analyze/123`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    console.log(`📊 Testing: ${test.name}`);
    
    const results = [];
    const promises = [];
    
    // Lancer les requêtes concurrentes
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      promises.push(measureEndpoint(test.url, test.method, test.data));
    }
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Calculer les métriques
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
      const durations = successful.map(r => r.duration);
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      
      console.log(`  ✅ Succès: ${successful.length}/${results.length}`);
      console.log(`  ⏱️  Latence moyenne: ${avgDuration.toFixed(2)}ms`);
      console.log(`  📈 Min/Max: ${minDuration.toFixed(2)}ms / ${maxDuration.toFixed(2)}ms`);
      console.log(`  ❌ Échecs: ${failed.length}`);
    } else {
      console.log(`  ❌ Tous les tests ont échoué`);
    }
    console.log('');
  }
}

if (require.main === module) {
  runBenchmark().catch(console.error);
}

module.exports = { runBenchmark };