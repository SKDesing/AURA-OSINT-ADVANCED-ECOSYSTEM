#!/usr/bin/env node
/**
 * AI Models Manifest Validator - Sans Pitié
 * Validates models against manifest SLO thresholds
 */

const fs = require('fs');
const path = require('path');

class ManifestValidator {
  constructor() {
    this.manifestPath = path.join(process.cwd(), 'config/models.manifest.json');
    this.reportsDir = path.join(process.cwd(), 'reports/audit/AI');
  }

  async validate() {
    console.log('🔍 Validating AI models against manifest...');
    
    // Load manifest
    if (!fs.existsSync(this.manifestPath)) {
      throw new Error('❌ Models manifest not found: config/models.manifest.json');
    }
    
    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    
    // Load audit reports
    const embeddingsReport = this.loadReport('embeddings-cache-report.json');
    const routerReport = this.loadReport('router-bench.json');
    const modelsReport = this.loadReport('models-inventory.json');
    
    const violations = [];
    
    // Validate embeddings SLO
    if (embeddingsReport?.performance?.p50_latency_ms) {
      const p50 = embeddingsReport.performance.p50_latency_ms;
      const threshold = manifest.models.embeddings.slo.p50_ms_max;
      
      if (p50 > threshold) {
        violations.push(`Embeddings P50 latency: ${p50}ms > ${threshold}ms threshold`);
      }
    }
    
    // Validate router SLO
    if (routerReport?.accuracy) {
      const accuracy = routerReport.accuracy;
      const threshold = 0.75; // From manifest or default
      
      if (accuracy < threshold) {
        violations.push(`Router accuracy: ${accuracy} < ${threshold} threshold`);
      }
    }
    
    if (routerReport?.bypass_detection_rate) {
      const bypass = routerReport.bypass_detection_rate;
      const threshold = 0.65; // From manifest or default
      
      if (bypass < threshold) {
        violations.push(`Bypass detection: ${bypass} < ${threshold} threshold`);
      }
    }
    
    // Validate global SLO
    if (modelsReport?.summary) {
      const totalSize = modelsReport.summary.total_size_gb;
      const maxSize = manifest.global_slo.total_size_gb_max;
      
      if (totalSize > maxSize) {
        violations.push(`Total models size: ${totalSize}GB > ${maxSize}GB threshold`);
      }
      
      const avgLatency = modelsReport.summary.avg_latency_ms;
      const maxLatency = manifest.global_slo.avg_latency_ms_max;
      
      if (avgLatency > maxLatency) {
        violations.push(`Average latency: ${avgLatency}ms > ${maxLatency}ms threshold`);
      }
    }
    
    // Validate compliance
    if (modelsReport?.local_models) {
      for (const model of modelsReport.local_models) {
        if (model.size_gb > manifest.compliance.max_model_size_gb) {
          violations.push(`Model ${model.name}: ${model.size_gb}GB > ${manifest.compliance.max_model_size_gb}GB limit`);
        }
        
        if (!manifest.compliance.allowed_licenses.includes(model.license)) {
          violations.push(`Model ${model.name}: license '${model.license}' not in allowed list`);
        }
      }
    }
    
    // Report results
    if (violations.length === 0) {
      console.log('✅ All models comply with manifest SLO thresholds');
      return { valid: true, violations: [] };
    } else {
      console.log('❌ SLO violations detected:');
      violations.forEach(violation => console.log(`  - ${violation}`));
      return { valid: false, violations };
    }
  }
  
  loadReport(filename) {
    const reportPath = path.join(this.reportsDir, filename);
    
    if (!fs.existsSync(reportPath)) {
      console.warn(`⚠️ Report not found: ${filename}`);
      return null;
    }
    
    try {
      return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch (error) {
      console.warn(`⚠️ Failed to parse report ${filename}:`, error.message);
      return null;
    }
  }
}

async function main() {
  try {
    const validator = new ManifestValidator();
    const result = await validator.validate();
    
    if (!result.valid) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Manifest validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ManifestValidator };