#!/usr/bin/env node
/**
 * AI Full Audit - Sans Pitié
 * Orchestrates all AI audits and generates synthesis
 */

const fs = require('fs');
const path = require('path');
const { EmbeddingsHealthChecker } = require('./embeddings-health');
const { RouterBenchmark } = require('./router-bench');
const { ModelsInventory } = require('./models-inventory');

class AIFullAudit {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'reports/audit/AI');
    this.synthesisPath = path.join(this.reportsDir, 'AI-AUDIT-SYNTHESIS.md');
  }

  async runFullAudit() {
    console.log('🔥 Starting AI Full Audit - Sans Pitié');
    console.log('=====================================');
    
    const auditResults = {
      timestamp: new Date().toISOString(),
      embeddings: null,
      router: null,
      models: null,
      overall_status: 'unknown',
      critical_issues: [],
      recommendations: []
    };

    try {
      // Run all audits
      console.log('\n1️⃣ Running Models Inventory...');
      const modelsInventory = new ModelsInventory();
      auditResults.models = await modelsInventory.generateInventory();

      console.log('\n2️⃣ Running Embeddings Health Check...');
      const embeddingsChecker = new EmbeddingsHealthChecker();
      auditResults.embeddings = await embeddingsChecker.checkHealth();

      console.log('\n3️⃣ Running Router Benchmark...');
      const routerBenchmark = new RouterBenchmark();
      auditResults.router = await routerBenchmark.runBenchmark();

      // Analyze results and determine overall status
      auditResults.overall_status = this.determineOverallStatus(auditResults);
      auditResults.critical_issues = this.identifyCriticalIssues(auditResults);
      auditResults.recommendations = this.generateRecommendations(auditResults);

      // Generate synthesis report
      await this.generateSynthesis(auditResults);

      console.log('\n🎯 AI Full Audit Complete');
      console.log(`📊 Overall Status: ${auditResults.overall_status.toUpperCase()}`);
      console.log(`⚠️ Critical Issues: ${auditResults.critical_issues.length}`);
      console.log(`💡 Recommendations: ${auditResults.recommendations.length}`);
      console.log(`📄 Synthesis: ${this.synthesisPath}`);

      return auditResults;

    } catch (error) {
      console.error('❌ AI Full Audit failed:', error);
      auditResults.overall_status = 'failed';
      auditResults.critical_issues.push(`Audit execution failed: ${error.message}`);
      
      // Still generate synthesis with partial results
      await this.generateSynthesis(auditResults);
      throw error;
    }
  }

  determineOverallStatus(results) {
    const issues = [];

    // Check embeddings
    if (results.embeddings?.performance?.p50_latency_ms > 30) {
      issues.push('embeddings_latency');
    }
    if (results.embeddings?.cache?.hit_ratio < 0.8) {
      issues.push('embeddings_cache');
    }

    // Check router
    if (results.router?.accuracy < 0.75) {
      issues.push('router_accuracy');
    }
    if (results.router?.bypass_detection_rate < 0.65) {
      issues.push('router_bypass');
    }

    // Check models
    if (results.models?.summary?.total_size_gb > 20) {
      issues.push('models_storage');
    }

    if (issues.length === 0) return 'excellent';
    if (issues.length <= 2) return 'good';
    if (issues.length <= 4) return 'warning';
    return 'critical';
  }

  identifyCriticalIssues(results) {
    const critical = [];

    // Critical performance issues
    if (results.embeddings?.performance?.p50_latency_ms > 50) {
      critical.push('Embeddings P50 latency > 50ms - severely impacts user experience');
    }

    if (results.router?.accuracy < 0.6) {
      critical.push('Router accuracy < 60% - unreliable decision making');
    }

    if (results.router?.bypass_detection_rate < 0.5) {
      critical.push('Bypass detection < 50% - security risk');
    }

    // Critical resource issues
    if (results.models?.summary?.total_size_gb > 50) {
      critical.push('Model storage > 50GB - unsustainable resource usage');
    }

    return critical;
  }

  generateRecommendations(results) {
    const recommendations = [];

    // Collect recommendations from individual audits
    if (results.embeddings?.recommendations) {
      recommendations.push(...results.embeddings.recommendations);
    }
    if (results.router?.recommendations) {
      recommendations.push(...results.router.recommendations);
    }
    if (results.models?.recommendations) {
      recommendations.push(...results.models.recommendations);
    }

    // Add strategic recommendations
    if (results.overall_status === 'critical') {
      recommendations.push('URGENT: Address critical issues before v1.0.0 release');
    }

    if (results.models?.summary?.total_models > 10) {
      recommendations.push('Consider model consolidation to reduce complexity');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  async generateSynthesis(results) {
    const synthesis = this.buildSynthesisMarkdown(results);
    
    fs.mkdirSync(path.dirname(this.synthesisPath), { recursive: true });
    fs.writeFileSync(this.synthesisPath, synthesis);
  }

  buildSynthesisMarkdown(results) {
    const timestamp = new Date().toLocaleString();
    
    return `# 🤖 AI Audit Synthesis - Sans Pitié

**Generated**: ${timestamp}  
**Overall Status**: ${results.overall_status.toUpperCase()}  
**Critical Issues**: ${results.critical_issues.length}

## 📊 Executive Summary

### Models Inventory
- **Total Models**: ${results.models?.summary?.total_models || 'N/A'}
- **Storage**: ${results.models?.summary?.total_size_gb || 'N/A'}GB
- **Avg Latency**: ${results.models?.summary?.avg_latency_ms || 'N/A'}ms

### Embeddings Performance
- **P50 Latency**: ${results.embeddings?.performance?.p50_latency_ms || 'N/A'}ms (Target: ≤30ms)
- **Cache Hit Ratio**: ${results.embeddings?.cache?.hit_ratio ? (results.embeddings.cache.hit_ratio * 100).toFixed(1) : 'N/A'}%
- **Vector Count**: ${results.embeddings?.cache?.vector_count || 'N/A'}

### Router Benchmark
- **Accuracy**: ${results.router?.accuracy ? (results.router.accuracy * 100).toFixed(1) : 'N/A'}% (Target: ≥75%)
- **Bypass Detection**: ${results.router?.bypass_detection_rate ? (results.router.bypass_detection_rate * 100).toFixed(1) : 'N/A'}% (Target: ≥65%)
- **P50 Latency**: ${results.router?.latency?.p50_ms || 'N/A'}ms

## 🚨 Critical Issues

${results.critical_issues.length > 0 ? 
  results.critical_issues.map(issue => `- ❌ ${issue}`).join('\n') : 
  '✅ No critical issues identified'}

## 💡 Recommendations

${results.recommendations.length > 0 ? 
  results.recommendations.map(rec => `- 🔧 ${rec}`).join('\n') : 
  '✅ No specific recommendations'}

## 📈 Benchmark Results

### SLO Compliance
- **Embeddings P50**: ${results.embeddings?.performance?.p50_latency_ms <= 30 ? '✅ PASS' : '❌ FAIL'}
- **Router Accuracy**: ${results.router?.accuracy >= 0.75 ? '✅ PASS' : '❌ FAIL'}
- **Bypass Detection**: ${results.router?.bypass_detection_rate >= 0.65 ? '✅ PASS' : '❌ FAIL'}

### Performance Trends
- Models loading time: ${results.models?.summary?.avg_latency_ms || 'N/A'}ms
- Cache efficiency: ${results.embeddings?.cache?.hit_ratio ? (results.embeddings.cache.hit_ratio * 100).toFixed(1) : 'N/A'}%
- Router response time: ${results.router?.latency?.avg_ms || 'N/A'}ms

## 🎯 v1.0.0 Readiness

**Status**: ${results.overall_status === 'excellent' || results.overall_status === 'good' ? 
  '✅ READY' : '❌ BLOCKED'}

${results.overall_status === 'critical' ? 
  '**CRITICAL**: Address all critical issues before release' : 
  results.overall_status === 'warning' ? 
  '**WARNING**: Review and address issues for optimal performance' : 
  '**READY**: AI components meet v1.0.0 requirements'}

## 📁 Detailed Reports

- **Models**: \`reports/audit/AI/models-inventory.json\`
- **Embeddings**: \`reports/audit/AI/embeddings-cache-report.json\`
- **Router**: \`reports/audit/AI/router-bench.json\`

---

**🔥 AURA AI Audit - Sans Pitié Completed**
`;
  }
}

async function main() {
  try {
    const audit = new AIFullAudit();
    await audit.runFullAudit();
  } catch (error) {
    console.error('❌ AI Full Audit failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { AIFullAudit };