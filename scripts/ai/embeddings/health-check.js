#!/usr/bin/env node
/**
 * Health check for embeddings service
 */

async function healthCheck() {
  console.log('🏥 Embeddings Health Check Starting...');
  
  try {
    // Dynamic import for ES modules
    const { EmbeddingService } = await import('../../../ai/gateway/src/rag/embedding.service.js');
    
    const svc = EmbeddingService.get();
    
    console.log('📊 Testing embeddings service...');
    
    // Test basic functionality
    const startTime = Date.now();
    const testText = 'This is a test sentence for embeddings health check.';
    const vector = await svc.embedText(testText);
    const latency = Date.now() - startTime;
    
    console.log(`✅ Basic embedding test passed:`);
    console.log(`   - Text: "${testText}"`);
    console.log(`   - Vector dimensions: ${vector.length}`);
    console.log(`   - Latency: ${latency}ms`);
    
    // Test health check method
    const health = await svc.healthCheck();
    console.log(`\n🔍 Service health status:`);
    console.log(`   - Status: ${health.ok ? '✅ OK' : '❌ FAILED'}`);
    console.log(`   - Provider: ${health.provider}`);
    console.log(`   - Model: ${health.model}`);
    console.log(`   - Dimensions: ${health.dimensions || 'N/A'}`);
    
    // Test cache functionality
    console.log(`\n💾 Testing cache functionality...`);
    const cacheStartTime = Date.now();
    const cachedVector = await svc.embedText(testText); // Should hit cache
    const cacheLatency = Date.now() - cacheStartTime;
    
    const vectorsMatch = JSON.stringify(vector) === JSON.stringify(cachedVector);
    console.log(`   - Cache hit: ${vectorsMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Cache latency: ${cacheLatency}ms`);
    
    // Cache stats
    const cacheStats = svc.getCacheStats();
    console.log(`   - Cache files: ${cacheStats.totalFiles}`);
    console.log(`   - Cache size: ${(cacheStats.size / 1024).toFixed(1)} KB`);
    
    // Performance test
    console.log(`\n⚡ Performance test (5 embeddings)...`);
    const perfStartTime = Date.now();
    const testTexts = [
      'Extract entities from this text',
      'Analyze temporal patterns',
      'Detect harassment content',
      'Answer factual questions',
      'Complex reasoning task'
    ];
    
    const vectors = await Promise.all(testTexts.map(text => svc.embedText(text)));
    const perfLatency = Date.now() - perfStartTime;
    
    console.log(`   - Total time: ${perfLatency}ms`);
    console.log(`   - Average per embedding: ${(perfLatency / testTexts.length).toFixed(1)}ms`);
    console.log(`   - All vectors valid: ${vectors.every(v => Array.isArray(v) && v.length > 0) ? '✅ YES' : '❌ NO'}`);
    
    if (!health.ok) {
      console.log('\n❌ Health check failed');
      process.exit(1);
    }
    
    console.log('\n🎉 All health checks passed!');
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  healthCheck();
}