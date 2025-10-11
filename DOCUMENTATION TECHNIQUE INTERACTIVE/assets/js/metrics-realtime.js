/**
 * 📊 AURA OSINT - SYSTÈME MÉTRIQUES TEMPS RÉEL FACTICE
 * Données ultra-réalistes simulées pour démonstration
 * Animations fluides et graphiques interactifs
 */

class AURAMetricsRealtime {
  constructor() {
    this.isActive = false;
    this.updateInterval = null;
    this.charts = {};
    this.metrics = this.initializeMetrics();
    this.historicalData = this.generateHistoricalData();
    
    // Configuration golden ratio
    this.phi = 1.618;
    this.updateFrequency = Math.floor(1000 * this.phi); // ~1618ms
    
    console.log('📊 Système métriques temps réel initialisé');
  }

  initializeMetrics() {
    return {
      // Métriques principales
      activeInvestigations: {
        current: 247,
        trend: '+12%',
        critical: 23,
        high: 89,
        medium: 135
      },
      
      profilesAnalyzed: {
        today: 1847,
        thisWeek: 12394,
        thisMonth: 48572,
        total: 2847293
      },
      
      osintSources: {
        active: 156,
        responding: 142,
        offline: 14,
        newToday: 8
      },
      
      threatLevel: {
        current: 'ÉLEVÉ',
        score: 7.3,
        trend: '+0.4',
        lastUpdate: new Date()
      },
      
      // Métriques géographiques
      geographic: {
        topCountries: [
          { country: 'États-Unis', investigations: 89, flag: '🇺🇸' },
          { country: 'Russie', investigations: 67, flag: '🇷🇺' },
          { country: 'Chine', investigations: 54, flag: '🇨🇳' },
          { country: 'Iran', investigations: 43, flag: '🇮🇷' },
          { country: 'Corée du Nord', investigations: 32, flag: '🇰🇵' }
        ],
        hotspots: [
          { city: 'Moscou', alerts: 23, lat: 55.7558, lng: 37.6176 },
          { city: 'Beijing', alerts: 19, lat: 39.9042, lng: 116.4074 },
          { city: 'Téhéran', alerts: 16, lat: 35.6892, lng: 51.3890 },
          { city: 'Pyongyang', alerts: 12, lat: 39.0392, lng: 125.7625 }
        ]
      },
      
      // Métriques techniques
      system: {
        cpuUsage: 23.7,
        memoryUsage: 67.2,
        diskUsage: 45.8,
        networkLatency: 12,
        uptime: '99.97%'
      },
      
      // Métriques de sécurité
      security: {
        threatsBlocked: 1247,
        suspiciousIPs: 89,
        encryptedConnections: 98.7,
        failedLogins: 23,
        activeVPNs: 156
      }
    };
  }

  generateHistoricalData() {
    const data = {
      investigations: [],
      threats: [],
      sources: [],
      geographic: []
    };
    
    // Génère 30 jours de données historiques
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.investigations.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(200 + Math.random() * 100 + Math.sin(i * 0.2) * 50),
        critical: Math.floor(15 + Math.random() * 20),
        resolved: Math.floor(180 + Math.random() * 80)
      });
      
      data.threats.push({
        date: date.toISOString().split('T')[0],
        level: 5 + Math.random() * 4 + Math.sin(i * 0.15) * 2,
        incidents: Math.floor(10 + Math.random() * 30),
        blocked: Math.floor(800 + Math.random() * 400)
      });
      
      data.sources.push({
        date: date.toISOString().split('T')[0],
        active: Math.floor(140 + Math.random() * 30),
        newSources: Math.floor(2 + Math.random() * 8),
        dataVolume: Math.floor(500 + Math.random() * 200) // GB
      });
    }
    
    return data;
  }

  startRealTimeUpdates() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🔄 Démarrage des mises à jour temps réel');
    
    // Mise à jour principale
    this.updateInterval = setInterval(() => {
      this.updateMetrics();
      this.updateCharts();
      this.updateUI();
    }, this.updateFrequency);
    
    // Mise à jour rapide pour certaines métriques
    setInterval(() => {
      this.updateFastMetrics();
    }, 500);
    
    // Simulation d'événements aléatoires
    setInterval(() => {
      this.simulateRandomEvent();
    }, 5000);
  }

  stopRealTimeUpdates() {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('⏹️ Arrêt des mises à jour temps réel');
  }

  updateMetrics() {
    // Investigations actives (fluctuation réaliste)
    const invChange = (Math.random() - 0.5) * 10;
    this.metrics.activeInvestigations.current = Math.max(200, 
      Math.floor(this.metrics.activeInvestigations.current + invChange));
    
    // Profils analysés (croissance continue)
    this.metrics.profilesAnalyzed.today += Math.floor(Math.random() * 5 + 1);
    this.metrics.profilesAnalyzed.total += Math.floor(Math.random() * 3 + 1);
    
    // Sources OSINT (variations mineures)
    const sourceChange = Math.floor((Math.random() - 0.5) * 4);
    this.metrics.osintSources.active = Math.max(120, Math.min(180,
      this.metrics.osintSources.active + sourceChange));
    this.metrics.osintSources.responding = Math.max(100,
      this.metrics.osintSources.active - Math.floor(Math.random() * 20));
    this.metrics.osintSources.offline = this.metrics.osintSources.active - 
      this.metrics.osintSources.responding;
    
    // Niveau de menace (oscillation réaliste)
    const threatChange = (Math.random() - 0.5) * 0.3;
    this.metrics.threatLevel.score = Math.max(1, Math.min(10,
      this.metrics.threatLevel.score + threatChange));
    
    // Métriques système (simulation réaliste)
    this.metrics.system.cpuUsage = Math.max(10, Math.min(90,
      this.metrics.system.cpuUsage + (Math.random() - 0.5) * 5));
    this.metrics.system.memoryUsage = Math.max(40, Math.min(85,
      this.metrics.system.memoryUsage + (Math.random() - 0.5) * 3));
    this.metrics.system.networkLatency = Math.max(5, Math.min(50,
      this.metrics.system.networkLatency + (Math.random() - 0.5) * 4));
    
    // Métriques de sécurité
    this.metrics.security.threatsBlocked += Math.floor(Math.random() * 8);
    this.metrics.security.suspiciousIPs += Math.floor((Math.random() - 0.7) * 5);
    this.metrics.security.suspiciousIPs = Math.max(0, this.metrics.security.suspiciousIPs);
    
    // Mise à jour timestamp
    this.metrics.threatLevel.lastUpdate = new Date();
  }

  updateFastMetrics() {
    // Métriques qui changent rapidement
    this.metrics.system.networkLatency = Math.max(5, Math.min(50,
      this.metrics.system.networkLatency + (Math.random() - 0.5) * 2));
    
    // Mise à jour des indicateurs visuels
    this.updateNetworkIndicator();
    this.updateThreatPulse();
  }

  simulateRandomEvent() {
    const events = [
      () => this.simulateNewThreat(),
      () => this.simulateSourceOffline(),
      () => this.simulateInvestigationClosed(),
      () => this.simulateGeographicAlert(),
      () => this.simulateSystemAlert()
    ];
    
    if (Math.random() < 0.3) { // 30% chance d'événement
      const event = events[Math.floor(Math.random() * events.length)];
      event();
    }
  }

  simulateNewThreat() {
    this.metrics.activeInvestigations.critical += 1;
    this.metrics.threatLevel.score = Math.min(10, this.metrics.threatLevel.score + 0.2);
    
    this.showAlert('🚨 NOUVELLE MENACE DÉTECTÉE', 'Niveau critique - Investigation lancée', 'danger');
    console.log('🚨 Simulation: Nouvelle menace détectée');
  }

  simulateSourceOffline() {
    if (this.metrics.osintSources.responding > 100) {
      this.metrics.osintSources.responding -= 1;
      this.metrics.osintSources.offline += 1;
      
      this.showAlert('⚠️ SOURCE HORS LIGNE', 'Perte de connectivité détectée', 'warning');
      console.log('⚠️ Simulation: Source OSINT hors ligne');
    }
  }

  simulateInvestigationClosed() {
    if (this.metrics.activeInvestigations.current > 200) {
      this.metrics.activeInvestigations.current -= 1;
      this.metrics.activeInvestigations.critical = Math.max(0, 
        this.metrics.activeInvestigations.critical - (Math.random() < 0.3 ? 1 : 0));
      
      this.showAlert('✅ ENQUÊTE RÉSOLUE', 'Investigation fermée avec succès', 'success');
      console.log('✅ Simulation: Investigation résolue');
    }
  }

  simulateGeographicAlert() {
    const hotspot = this.metrics.geographic.hotspots[
      Math.floor(Math.random() * this.metrics.geographic.hotspots.length)
    ];
    hotspot.alerts += Math.floor(Math.random() * 3 + 1);
    
    this.showAlert('🌍 ALERTE GÉOGRAPHIQUE', 
      `Activité suspecte détectée à ${hotspot.city}`, 'info');
    console.log(`🌍 Simulation: Alerte géographique - ${hotspot.city}`);
  }

  simulateSystemAlert() {
    if (Math.random() < 0.1) { // 10% chance d'alerte système
      this.metrics.system.cpuUsage = Math.min(90, this.metrics.system.cpuUsage + 20);
      this.showAlert('⚡ CHARGE SYSTÈME ÉLEVÉE', 
        `CPU: ${this.metrics.system.cpuUsage.toFixed(1)}%`, 'warning');
      console.log('⚡ Simulation: Charge système élevée');
    }
  }

  showAlert(title, message, type = 'info') {
    // Création d'une alerte temporaire
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-realtime`;
    alertDiv.innerHTML = `
      <div class="alert-content">
        <strong>${title}</strong><br>
        <span>${message}</span>
        <small class="alert-time">${new Date().toLocaleTimeString()}</small>
      </div>
    `;
    
    // Ajout au conteneur d'alertes
    const container = document.getElementById('realtime-alerts') || this.createAlertsContainer();
    container.appendChild(alertDiv);
    
    // Animation d'entrée
    setTimeout(() => alertDiv.classList.add('show'), 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }

  createAlertsContainer() {
    const container = document.createElement('div');
    container.id = 'realtime-alerts';
    container.className = 'realtime-alerts-container';
    document.body.appendChild(container);
    return container;
  }

  updateCharts() {
    // Mise à jour des graphiques Chart.js
    if (this.charts.investigations) {
      this.updateInvestigationsChart();
    }
    if (this.charts.threats) {
      this.updateThreatsChart();
    }
    if (this.charts.geographic) {
      this.updateGeographicChart();
    }
    if (this.charts.system) {
      this.updateSystemChart();
    }
  }

  updateInvestigationsChart() {
    const chart = this.charts.investigations;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    // Ajouter nouveau point de données
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(this.metrics.activeInvestigations.current);
    chart.data.datasets[1].data.push(this.metrics.activeInvestigations.critical);
    
    // Garder seulement les 20 derniers points
    if (chart.data.labels.length > 20) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    
    chart.update('none'); // Animation fluide
  }

  updateThreatsChart() {
    const chart = this.charts.threats;
    
    // Mise à jour du niveau de menace
    chart.data.datasets[0].data = [this.metrics.threatLevel.score];
    chart.update('none');
  }

  updateGeographicChart() {
    const chart = this.charts.geographic;
    
    // Mise à jour des données géographiques
    chart.data.datasets[0].data = this.metrics.geographic.topCountries.map(c => c.investigations);
    chart.update('none');
  }

  updateSystemChart() {
    const chart = this.charts.system;
    
    // Mise à jour des métriques système
    chart.data.datasets[0].data = [
      this.metrics.system.cpuUsage,
      this.metrics.system.memoryUsage,
      this.metrics.system.diskUsage
    ];
    chart.update('none');
  }

  updateUI() {
    // Mise à jour des éléments UI avec les nouvelles métriques
    this.updateMetricCards();
    this.updateStatusIndicators();
    this.updateProgressBars();
  }

  updateMetricCards() {
    // Investigations actives
    const invCard = document.querySelector('[data-metric="investigations"]');
    if (invCard) {
      invCard.querySelector('.metric-value').textContent = 
        this.metrics.activeInvestigations.current.toLocaleString();
      invCard.querySelector('.metric-critical').textContent = 
        this.metrics.activeInvestigations.critical;
    }
    
    // Profils analysés
    const profilesCard = document.querySelector('[data-metric="profiles"]');
    if (profilesCard) {
      profilesCard.querySelector('.metric-today').textContent = 
        this.metrics.profilesAnalyzed.today.toLocaleString();
      profilesCard.querySelector('.metric-total').textContent = 
        this.metrics.profilesAnalyzed.total.toLocaleString();
    }
    
    // Sources OSINT
    const sourcesCard = document.querySelector('[data-metric="sources"]');
    if (sourcesCard) {
      sourcesCard.querySelector('.metric-active').textContent = 
        this.metrics.osintSources.active;
      sourcesCard.querySelector('.metric-offline').textContent = 
        this.metrics.osintSources.offline;
    }
    
    // Niveau de menace
    const threatCard = document.querySelector('[data-metric="threat"]');
    if (threatCard) {
      threatCard.querySelector('.metric-score').textContent = 
        this.metrics.threatLevel.score.toFixed(1);
      threatCard.querySelector('.metric-level').textContent = 
        this.getThreatLevelText(this.metrics.threatLevel.score);
    }
  }

  updateStatusIndicators() {
    // Indicateur de connectivité réseau
    const networkIndicator = document.querySelector('.network-status');
    if (networkIndicator) {
      const latency = this.metrics.system.networkLatency;
      networkIndicator.className = `network-status ${this.getNetworkStatusClass(latency)}`;
      networkIndicator.textContent = `${latency}ms`;
    }
    
    // Indicateur de niveau de menace
    const threatIndicator = document.querySelector('.threat-indicator');
    if (threatIndicator) {
      const score = this.metrics.threatLevel.score;
      threatIndicator.className = `threat-indicator ${this.getThreatClass(score)}`;
    }
  }

  updateProgressBars() {
    // Barres de progression système
    const cpuBar = document.querySelector('.cpu-progress');
    if (cpuBar) {
      cpuBar.style.width = `${this.metrics.system.cpuUsage}%`;
      cpuBar.parentElement.querySelector('.progress-text').textContent = 
        `CPU: ${this.metrics.system.cpuUsage.toFixed(1)}%`;
    }
    
    const memoryBar = document.querySelector('.memory-progress');
    if (memoryBar) {
      memoryBar.style.width = `${this.metrics.system.memoryUsage}%`;
      memoryBar.parentElement.querySelector('.progress-text').textContent = 
        `RAM: ${this.metrics.system.memoryUsage.toFixed(1)}%`;
    }
  }

  updateNetworkIndicator() {
    const indicator = document.querySelector('.network-pulse');
    if (indicator) {
      const latency = this.metrics.system.networkLatency;
      indicator.style.animationDuration = `${Math.max(0.5, latency / 20)}s`;
    }
  }

  updateThreatPulse() {
    const pulse = document.querySelector('.threat-pulse');
    if (pulse) {
      const score = this.metrics.threatLevel.score;
      pulse.style.animationDuration = `${Math.max(0.5, 3 - score / 5)}s`;
    }
  }

  // Méthodes utilitaires
  getThreatLevelText(score) {
    if (score >= 8) return 'CRITIQUE';
    if (score >= 6) return 'ÉLEVÉ';
    if (score >= 4) return 'MODÉRÉ';
    if (score >= 2) return 'FAIBLE';
    return 'MINIMAL';
  }

  getThreatClass(score) {
    if (score >= 8) return 'threat-critical';
    if (score >= 6) return 'threat-high';
    if (score >= 4) return 'threat-medium';
    return 'threat-low';
  }

  getNetworkStatusClass(latency) {
    if (latency <= 15) return 'network-excellent';
    if (latency <= 30) return 'network-good';
    if (latency <= 50) return 'network-fair';
    return 'network-poor';
  }

  // API publique
  getMetrics() {
    return { ...this.metrics };
  }

  getHistoricalData() {
    return { ...this.historicalData };
  }

  registerChart(name, chartInstance) {
    this.charts[name] = chartInstance;
    console.log(`📊 Graphique '${name}' enregistré`);
  }

  // Simulation de données pour tests
  generateTestData(days = 7) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        investigations: Math.floor(200 + Math.random() * 100),
        threats: Math.floor(5 + Math.random() * 5),
        sources: Math.floor(140 + Math.random() * 30),
        resolved: Math.floor(180 + Math.random() * 80)
      });
    }
    return data;
  }
}

// Initialisation globale
window.AURAMetrics = new AURAMetricsRealtime();

// Auto-démarrage si dashboard actif
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.dashboard-container')) {
    setTimeout(() => {
      window.AURAMetrics.startRealTimeUpdates();
    }, 2000); // Délai pour laisser les graphiques s'initialiser
  }
});

console.log('📊 Système de métriques temps réel AURA OSINT chargé');