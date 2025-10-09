#!/usr/bin/env node
/**
 * Precompute and persist centroid embeddings for router prototypes.
 * Optional: run to bake a JSON index and avoid recompute at runtime.
 */
const fs = require('fs');
const path = require('path');

async function buildEmbeddingsIndex() {
  console.log('🔧 Building embeddings index for router prototypes...');
  
  try {
    // Dynamic import for ES modules
    const { EmbeddingService } = await import('../../../ai/gateway/src/rag/embedding.service.js');
    const prototypes = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'ai/gateway/src/router/prototypes.json'),
        'utf8'
      )
    );
    
    const svc = EmbeddingService.get();
    const index = [];
    
    console.log('📊 Processing prototypes...');
    
    for (const [klass, samples] of Object.entries(prototypes)) {
      console.log(`   Processing class: ${klass} (${samples.length} samples)`);
      
      const vecs = [];
      for (const sample of samples) {
        const vec = await svc.embedText(sample);
        vecs.push(vec);
      }
      
      // Calculate centroid
      const dim = vecs[0].length;
      const centroid = new Array(dim).fill(0);
      
      for (const v of vecs) {
        for (let i = 0; i < dim; i++) {
          centroid[i] += v[i];
        }
      }
      
      for (let i = 0; i < dim; i++) {
        centroid[i] /= vecs.length;
      }
      
      index.push({ 
        class: klass, 
        centroid, 
        size: vecs.length,
        dimensions: dim
      });
    }
    
    // Save index
    const outputPath = path.join(process.cwd(), 'ai/gateway/src/router/prototypes.index.json');
    fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
    
    console.log('✅ Router prototypes index written:', outputPath);
    console.log(`📈 Index stats:`);
    console.log(`   - Classes: ${index.length}`);
    console.log(`   - Dimensions: ${index[0]?.dimensions || 'N/A'}`);
    console.log(`   - Total samples: ${index.reduce((sum, item) => sum + item.size, 0)}`);
    
    // Test the index
    console.log('\n🧪 Testing index with sample queries...');
    const testQueries = [
      'Extract phone numbers from this text',
      'Analyze the timeline of events',
      'This message contains threats',
      'According to our data, what is the trend?'
    ];
    
    for (const query of testQueries) {
      const queryVec = await svc.embedText(query);
      const similarities = index.map(item => {
        // Simple dot product for testing
        let sim = 0;
        for (let i = 0; i < queryVec.length; i++) {
          sim += queryVec[i] * item.centroid[i];
        }
        return { class: item.class, similarity: sim };
      }).sort((a, b) => b.similarity - a.similarity);
      
      console.log(`   "${query.substring(0, 30)}..." → ${similarities[0].class} (${similarities[0].similarity.toFixed(3)})`);
    }
    
  } catch (error) {
    console.error('❌ Failed to build embeddings index:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  buildEmbeddingsIndex();
}