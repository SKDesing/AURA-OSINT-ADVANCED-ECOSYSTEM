#!/usr/bin/env node

/**
 * AURA Update Guardian - Metrics Collector
 * Expose des métriques Prometheus pour le suivi des mises à jour
 */

const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.METRICS_PORT || 9091;

// Métriques en format Prometheus
let metrics = {
  updates_pending_total: 0,
  cert_expiry_days: 365,
  dependency_age_days: 0,
  cve_open_total: 0
};

// Collecte des métriques npm
function collectNpmMetrics() {
  try {
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    const packages = JSON.parse(outdated || '{}');
    
    let pendingUpdates = 0;
    let maxAge = 0;
    
    Object.entries(packages).forEach(([pkg, info]) => {
      pendingUpdates++;
      // Estimation âge basée sur versions
      const currentMajor = parseInt(info.current.split('.')[0]);
      const latestMajor = parseInt(info.latest.split('.')[0]);
      const age = (latestMajor - currentMajor) * 30; // ~30 jours par version majeure
      maxAge = Math.max(maxAge, age);
    });
    
    metrics.updates_pending_total = pendingUpdates;
    metrics.dependency_age_days = maxAge;
  } catch (error) {
    console.error('Erreur collecte npm:', error.message);
  }
}

// Collecte des métriques certificats
function collectCertMetrics() {
  try {
    if (fs.existsSync('certs/server.crt')) {
      const certInfo = execSync('openssl x509 -in certs/server.crt -noout -enddate', { encoding: 'utf8' });
      const endDate = certInfo.match(/notAfter=(.+)/)?.[1];
      
      if (endDate) {
        const expiryDate = new Date(endDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        metrics.cert_expiry_days = Math.max(0, daysUntilExpiry);
      }
    }
  } catch (error) {
    console.error('Erreur collecte certificats:', error.message);
  }
}

// Collecte des métriques CVE
function collectCveMetrics() {
  try {
    // Audit npm pour CVE
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult || '{"vulnerabilities":{}}');
    
    const critical = audit.metadata?.vulnerabilities?.critical || 0;
    const high = audit.metadata?.vulnerabilities?.high || 0;
    
    metrics.cve_open_total = critical + high;
  } catch (error) {
    // npm audit retourne exit code != 0 si vulnérabilités trouvées
    try {
      const auditResult = execSync('npm audit --json 2>/dev/null || echo "{}"', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      const critical = audit.metadata?.vulnerabilities?.critical || 0;
      const high = audit.metadata?.vulnerabilities?.high || 0;
      metrics.cve_open_total = critical + high;
    } catch (e) {
      console.error('Erreur collecte CVE:', e.message);
    }
  }
}

// Collecte toutes les métriques
function collectAllMetrics() {
  console.log('Collecte des métriques Update Guardian...');
  collectNpmMetrics();
  collectCertMetrics();
  collectCveMetrics();
  console.log('Métriques collectées:', metrics);
}

// Endpoint métriques Prometheus
app.get('/metrics', (req, res) => {
  collectAllMetrics();
  
  const prometheusMetrics = `
# HELP aura_updates_pending_total Nombre de mises à jour en attente
# TYPE aura_updates_pending_total gauge
aura_updates_pending_total ${metrics.updates_pending_total}

# HELP aura_cert_expiry_days Jours avant expiration certificat
# TYPE aura_cert_expiry_days gauge
aura_cert_expiry_days ${metrics.cert_expiry_days}

# HELP aura_dependency_age_days Âge maximum des dépendances en jours
# TYPE aura_dependency_age_days gauge
aura_dependency_age_days ${metrics.dependency_age_days}

# HELP aura_cve_open_total Nombre de CVE critiques/hautes ouvertes
# TYPE aura_cve_open_total gauge
aura_cve_open_total ${metrics.cve_open_total}

# HELP aura_update_guardian_info Informations Update Guardian
# TYPE aura_update_guardian_info gauge
aura_update_guardian_info{version="1.0.0",status="active"} 1
`.trim();

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics);
});

// Endpoint status JSON
app.get('/status', (req, res) => {
  collectAllMetrics();
  
  const status = {
    timestamp: new Date().toISOString(),
    update_guardian: {
      status: 'active',
      version: '1.0.0'
    },
    metrics: {
      updates_pending: metrics.updates_pending_total,
      cert_expiry_days: metrics.cert_expiry_days,
      dependency_age_days: metrics.dependency_age_days,
      cve_open: metrics.cve_open_total
    },
    health: {
      updates: metrics.updates_pending_total < 10 ? 'healthy' : 'warning',
      certificates: metrics.cert_expiry_days > 30 ? 'healthy' : 'critical',
      dependencies: metrics.dependency_age_days < 90 ? 'healthy' : 'warning',
      security: metrics.cve_open_total === 0 ? 'healthy' : 'critical'
    }
  };
  
  res.json(status);
});

// Endpoint health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Collecte initiale
collectAllMetrics();

// Collecte périodique (toutes les 5 minutes)
setInterval(collectAllMetrics, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🛡️ AURA Update Guardian Metrics Server running on port ${PORT}`);
  console.log(`📊 Metrics: http://localhost:XXXX${PORT}/metrics`);
  console.log(`📋 Status: http://localhost:XXXX${PORT}/status`);
  console.log(`❤️ Health: http://localhost:XXXX${PORT}/health`);
});

// Gestion arrêt propre
process.on('SIGTERM', () => {
  console.log('Arrêt Update Guardian Metrics...');
  process.exit(0);
});

module.exports = app;