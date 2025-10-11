/**
 * 📊 AURA DASHBOARD SYSTEM
 * Gestion des vues, métriques temps réel et visualisations
 */

class AURADashboard {
  constructor() {
    this.phi = 1.618;
    this.currentView = 'chat';
    this.metricsInterval = null;
    this.charts = {};
    this.realTimeData = {
      investigations: 0,
      profiles_analyzed: 0,
      threats_detected: 0,
      success_rate: 0
    };
    
    this.initializeDashboard();
  }

  /**
   * 🚀 Initialise le dashboard
   */
  static initialize() {
    const dashboard = new AURADashboard();
    window.AURADashboardInstance = dashboard;
    return dashboard;
  }

  /**
   * 🎯 Configuration initiale
   */
  initializeDashboard() {
    this.setupNavigation();
    this.setupViews();
    this.startRealTimeMetrics();
    this.generateToolsGrid();
    this.generateScenariosGrid();
    this.setupAnalytics();
    
    // Démarrage des métriques temps réel
    if (window.AURAMetrics) {
      setTimeout(() => {
        window.AURAMetrics.startRealTimeUpdates();
        console.log('🔄 Métriques temps réel démarrées');
      }, 2000);
    }
  }

  /**
   * 🧭 Configuration navigation
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[data-view]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.switchView(view);
        
        // Mise à jour état actif
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /**
   * 🔄 Changement de vue
   */
  switchView(viewName) {
    // Masquer toutes les vues
    const views = document.querySelectorAll('.dashboard-view');
    views.forEach(view => view.classList.remove('active'));
    
    // Afficher la vue demandée
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewName;
      
      // Actions spécifiques par vue
      this.handleViewSwitch(viewName);
    }
  }

  /**
   * 🎬 Actions spécifiques par vue
   */
  handleViewSwitch(viewName) {
    switch(viewName) {
      case 'chat':
        // Réinitialiser le chat si nécessaire
        if (window.AURAChatInstance) {
          window.AURAChatInstance.scrollToBottom();
        }
        break;
        
      case 'tools':
        this.refreshToolsGrid();
        break;
        
      case 'scenarios':
        this.refreshScenariosGrid();
        break;
        
      case 'analytics':
        this.refreshAnalytics();
        break;
    }
  }

  /**
   * 🛠️ Génération grille d'outils
   */
  generateToolsGrid() {
    const toolsContainer = document.getElementById('tools-grid');
    if (!toolsContainer) return;

    const tools = [
      {
        name: 'Phone Intelligence',
        icon: 'bi-phone-fill',
        description: 'Analyse complète des numéros de téléphone avec géolocalisation et opérateur',
        status: 'operational',
        profiles_count: this.randomInt(50, 200),
        success_rate: this.randomInt(85, 98),
        category: 'telecom'
      },
      {
        name: 'Email OSINT',
        icon: 'bi-envelope-fill',
        description: 'Investigation emails : fuites, réputation, profils associés',
        status: 'operational',
        profiles_count: this.randomInt(100, 300),
        success_rate: this.randomInt(80, 95),
        category: 'communication'
      },
      {
        name: 'Username Hunter',
        icon: 'bi-person-badge-fill',
        description: 'Recherche sur 400+ plateformes sociales simultanément',
        status: 'operational',
        profiles_count: this.randomInt(200, 500),
        success_rate: this.randomInt(75, 90),
        category: 'social'
      },
      {
        name: 'Domain Intelligence',
        icon: 'bi-globe2',
        description: 'WHOIS, DNS, SSL, sous-domaines et analyse de risque',
        status: 'operational',
        profiles_count: this.randomInt(80, 250),
        success_rate: this.randomInt(88, 96),
        category: 'infrastructure'
      },
      {
        name: 'Crypto Tracker',
        icon: 'bi-currency-bitcoin',
        description: 'Analyse blockchain, mixers et traçage de transactions',
        status: 'operational',
        profiles_count: this.randomInt(30, 120),
        success_rate: this.randomInt(70, 85),
        category: 'financial'
      },
      {
        name: 'Image Forensics',
        icon: 'bi-camera-fill',
        description: 'EXIF, reverse search, géolocalisation et détection deepfake',
        status: 'operational',
        profiles_count: this.randomInt(40, 150),
        success_rate: this.randomInt(82, 94),
        category: 'media'
      },
      {
        name: 'Dark Web Scanner',
        icon: 'bi-shield-exclamation',
        description: 'Surveillance .onion, marketplaces et forums cachés',
        status: 'operational',
        profiles_count: this.randomInt(20, 80),
        success_rate: this.randomInt(65, 80),
        category: 'darknet'
      },
      {
        name: 'Social Graph',
        icon: 'bi-diagram-3-fill',
        description: 'Cartographie des relations et analyse de réseau',
        status: 'operational',
        profiles_count: this.randomInt(100, 400),
        success_rate: this.randomInt(78, 92),
        category: 'analysis'
      },
      {
        name: 'Threat Intel',
        icon: 'bi-exclamation-triangle-fill',
        description: 'Détection de menaces et scoring de risque automatisé',
        status: 'operational',
        profiles_count: this.randomInt(60, 180),
        success_rate: this.randomInt(85, 97),
        category: 'security'
      }
    ];

    toolsContainer.innerHTML = tools.map(tool => `
      <div class="tool-card" data-tool="${tool.name.toLowerCase().replace(/\s+/g, '-')}">
        <div class="tool-icon">
          <i class="${tool.icon}"></i>
        </div>
        <div class="tool-content">
          <h5 class="tool-title">${tool.name}</h5>
          <p class="tool-description">${tool.description}</p>
          
          <div class="tool-stats">
            <div class="stat">
              <span class="stat-value">${tool.profiles_count.toLocaleString()}</span>
              <span class="stat-label">Profils</span>
            </div>
            <div class="stat">
              <span class="stat-value">${tool.success_rate}%</span>
              <span class="stat-label">Succès</span>
            </div>
          </div>
          
          <div class="tool-footer">
            <span class="tool-status ${tool.status}">
              <i class="bi bi-circle-fill"></i>
              ${tool.status === 'operational' ? 'Opérationnel' : 'Maintenance'}
            </span>
            <button class="btn btn-sm btn-outline-primary tool-launch-btn">
              <i class="bi bi-play-fill"></i> Lancer
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Event listeners pour les outils
    this.setupToolsEvents();
  }

  /**
   * 🎭 Génération grille de scénarios
   */
  generateScenariosGrid() {
    const scenariosContainer = document.getElementById('scenarios-grid');
    if (!scenariosContainer) return;

    const scenarios = [
      {
        title: 'Le Journaliste Disparu',
        difficulty: 'intermediate',
        duration: '15-20 min',
        description: 'Un journaliste d\'investigation a cessé toute communication il y a 3 jours. Sa famille vous contacte.',
        category: 'humanitarian',
        tools_used: ['Phone Intelligence', 'Social Graph', 'Threat Intel'],
        completion_rate: 78,
        participants: 1247
      },
      {
        title: 'L\'Arnaque au Bitcoin',
        difficulty: 'advanced',
        duration: '25-30 min',
        description: 'Une victime a perdu 50 BTC dans une arnaque. Tracez l\'argent et identifiez les scammers.',
        category: 'cybercrime',
        tools_used: ['Crypto Tracker', 'Email OSINT', 'Domain Intelligence'],
        completion_rate: 65,
        participants: 892
      },
      {
        title: 'La Photo Mystère (1944)',
        difficulty: 'expert',
        duration: '30-40 min',
        description: 'Géolocalisez cette photo de guerre historique et identifiez les soldats.',
        category: 'historical',
        tools_used: ['Image Forensics', 'Social Graph'],
        completion_rate: 45,
        participants: 634
      },
      {
        title: 'Réseau de Trafiquants',
        difficulty: 'expert',
        duration: '45-60 min',
        description: 'Démanteler un réseau international de narcotrafiquants via OSINT.',
        category: 'organized_crime',
        tools_used: ['Phone Intelligence', 'Dark Web Scanner', 'Crypto Tracker', 'Social Graph'],
        completion_rate: 38,
        participants: 423
      },
      {
        title: 'Travailleuse Exploitée',
        difficulty: 'advanced',
        duration: '20-30 min',
        description: 'Une femme migrante semble exploitée. Analysez les contradictions dans son histoire.',
        category: 'human_trafficking',
        tools_used: ['Social Graph', 'Image Forensics', 'Phone Intelligence'],
        completion_rate: 72,
        participants: 756
      },
      {
        title: 'Prédateur en Ligne',
        difficulty: 'expert',
        duration: '35-45 min',
        description: 'Identifier et localiser un prédateur utilisant le dark web.',
        category: 'child_protection',
        tools_used: ['Dark Web Scanner', 'Crypto Tracker', 'Email OSINT'],
        completion_rate: 52,
        participants: 289
      }
    ];

    scenariosContainer.innerHTML = scenarios.map(scenario => `
      <div class="scenario-card" data-scenario="${scenario.title.toLowerCase().replace(/\s+/g, '-')}">
        <div class="scenario-header">
          <span class="scenario-difficulty ${scenario.difficulty}">
            ${this.getDifficultyLabel(scenario.difficulty)}
          </span>
          <span class="scenario-duration">
            <i class="bi bi-clock"></i> ${scenario.duration}
          </span>
        </div>
        
        <h5 class="scenario-title">${scenario.title}</h5>
        <p class="scenario-description">${scenario.description}</p>
        
        <div class="scenario-tools">
          <small class="text-muted">Outils utilisés :</small>
          <div class="tools-tags">
            ${scenario.tools_used.map(tool => `
              <span class="tool-tag">${tool}</span>
            `).join('')}
          </div>
        </div>
        
        <div class="scenario-stats">
          <div class="stat">
            <span class="stat-value">${scenario.completion_rate}%</span>
            <span class="stat-label">Taux de réussite</span>
          </div>
          <div class="stat">
            <span class="stat-value">${scenario.participants.toLocaleString()}</span>
            <span class="stat-label">Participants</span>
          </div>
        </div>
        
        <button class="btn btn-primary w-100 scenario-start-btn">
          <i class="bi bi-play-circle"></i> Démarrer le scénario
        </button>
      </div>
    `).join('');

    // Event listeners pour les scénarios
    this.setupScenariosEvents();
  }

  /**
   * 📊 Configuration analytics
   */
  setupAnalytics() {
    const analyticsContainer = document.getElementById('analytics-charts');
    if (!analyticsContainer) return;

    analyticsContainer.innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="metric-card">
            <div class="metric-icon">
              <i class="bi bi-search"></i>
            </div>
            <div class="metric-content">
              <h3 class="metric-value" id="metric-investigations">0</h3>
              <p class="metric-label">Investigations actives</p>
              <small class="metric-change positive">+12% cette semaine</small>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="metric-card">
            <div class="metric-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="metric-content">
              <h3 class="metric-value" id="metric-profiles">0</h3>
              <p class="metric-label">Profils analysés</p>
              <small class="metric-change positive">+8% cette semaine</small>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="metric-card">
            <div class="metric-icon">
              <i class="bi bi-shield-exclamation"></i>
            </div>
            <div class="metric-content">
              <h3 class="metric-value" id="metric-threats">0</h3>
              <p class="metric-label">Menaces détectées</p>
              <small class="metric-change negative">-3% cette semaine</small>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="metric-card">
            <div class="metric-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="metric-content">
              <h3 class="metric-value" id="metric-success">0%</h3>
              <p class="metric-label">Taux de succès</p>
              <small class="metric-change positive">+5% cette semaine</small>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="chart-card">
            <h5>Activité OSINT (7 derniers jours)</h5>
            <canvas id="activity-chart"></canvas>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="chart-card">
            <h5>Répartition par catégorie</h5>
            <canvas id="category-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="row g-4 mt-1">
        <div class="col-lg-6">
          <div class="chart-card">
            <h5>Performance des outils</h5>
            <canvas id="tools-performance-chart"></canvas>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="chart-card">
            <h5>Géolocalisation des investigations</h5>
            <div id="world-map" style="height: 300px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <p class="text-muted">Carte mondiale interactive (à implémenter)</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initializeCharts();
  }

  /**
   * 📈 Initialisation des graphiques
   */
  initializeCharts() {
    // Graphique d'activité
    const activityCtx = document.getElementById('activity-chart');
    if (activityCtx) {
      this.charts.activity = new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Investigations',
            data: [12, 19, 15, 25, 22, 18, 24],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4
          }, {
            label: 'Menaces détectées',
            data: [3, 7, 4, 8, 6, 5, 9],
            borderColor: '#f093fb',
            backgroundColor: 'rgba(240, 147, 251, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e8eaf6' }
            }
          },
          scales: {
            x: { 
              ticks: { color: '#9fa8da' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: { 
              ticks: { color: '#9fa8da' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    }

    // Graphique catégories
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx) {
      this.charts.category = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: ['Cybercrime', 'Terrorisme', 'Trafic', 'Fraude', 'Autres'],
          datasets: [{
            data: [35, 20, 15, 20, 10],
            backgroundColor: [
              '#667eea',
              '#f093fb',
              '#4ecdc4',
              '#45b7d1',
              '#96ceb4'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#e8eaf6' }
            }
          }
        }
      });
    }

    // Graphique performance outils
    const toolsCtx = document.getElementById('tools-performance-chart');
    if (toolsCtx) {
      this.charts.tools = new Chart(toolsCtx, {
        type: 'bar',
        data: {
          labels: ['Phone', 'Email', 'Username', 'Domain', 'Crypto', 'Image'],
          datasets: [{
            label: 'Taux de succès (%)',
            data: [92, 87, 83, 95, 78, 89],
            backgroundColor: '#667eea'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e8eaf6' }
            }
          },
          scales: {
            x: { 
              ticks: { color: '#9fa8da' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: { 
              ticks: { color: '#9fa8da' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              min: 0,
              max: 100
            }
          }
        }
      });
    }
  }

  /**
   * ⏱️ Métriques temps réel
   */
  startRealTimeMetrics() {
    // Mise à jour initiale
    this.updateMetrics();
    
    // Mise à jour toutes les 3 secondes (basé sur Φ)
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, 3000 * this.phi);
  }

  /**
   * 📊 Mise à jour des métriques
   */
  updateMetrics() {
    // Simulation de données temps réel
    this.realTimeData.investigations = this.randomInt(15, 45);
    this.realTimeData.profiles_analyzed = this.randomInt(150, 500);
    this.realTimeData.threats_detected = this.randomInt(2, 12);
    this.realTimeData.success_rate = this.randomInt(85, 98);

    // Mise à jour de l'affichage
    this.animateMetric('metric-investigations', this.realTimeData.investigations);
    this.animateMetric('metric-profiles', this.realTimeData.profiles_analyzed);
    this.animateMetric('metric-threats', this.realTimeData.threats_detected);
    this.animateMetric('metric-success', this.realTimeData.success_rate, '%');

    // Mise à jour des graphiques
    this.updateCharts();
  }

  /**
   * 🎬 Animation des métriques
   */
  animateMetric(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const currentValue = parseInt(element.textContent) || 0;
    const increment = (targetValue - currentValue) / 10;
    let current = currentValue;

    const animate = () => {
      current += increment;
      if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
        element.textContent = targetValue.toLocaleString() + suffix;
        return;
      }
      element.textContent = Math.floor(current).toLocaleString() + suffix;
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 📈 Mise à jour des graphiques
   */
  updateCharts() {
    // Mise à jour du graphique d'activité
    if (this.charts.activity) {
      const newData = [
        this.randomInt(10, 30),
        this.randomInt(15, 35),
        this.randomInt(12, 28),
        this.randomInt(20, 40),
        this.randomInt(18, 32),
        this.randomInt(15, 25),
        this.randomInt(20, 35)
      ];
      
      this.charts.activity.data.datasets[0].data = newData;
      this.charts.activity.update('none');
    }
  }

  /**
   * 🛠️ Event listeners outils
   */
  setupToolsEvents() {
    const toolCards = document.querySelectorAll('.tool-card');
    const launchButtons = document.querySelectorAll('.tool-launch-btn');

    toolCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tool-launch-btn')) {
          this.showToolDetails(card.dataset.tool);
        }
      });
    });

    launchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const toolCard = btn.closest('.tool-card');
        this.launchTool(toolCard.dataset.tool);
      });
    });
  }

  /**
   * 🎭 Event listeners scénarios
   */
  setupScenariosEvents() {
    const startButtons = document.querySelectorAll('.scenario-start-btn');

    startButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioCard = btn.closest('.scenario-card');
        this.startScenario(scenarioCard.dataset.scenario);
      });
    });
  }

  /**
   * 🔧 Affichage détails outil
   */
  showToolDetails(toolName) {
    Swal.fire({
      title: toolName.replace(/-/g, ' ').toUpperCase(),
      html: `
        <div class="text-start">
          <h6>Fonctionnalités :</h6>
          <ul>
            <li>Analyse automatisée</li>
            <li>Corrélation multi-sources</li>
            <li>Rapport détaillé</li>
            <li>Export des résultats</li>
          </ul>
          <h6>Bases de données :</h6>
          <p>Accès à ${this.randomInt(5, 50)} sources OSINT</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Lancer l\'outil',
      cancelButtonText: 'Fermer',
      confirmButtonColor: '#667eea'
    }).then((result) => {
      if (result.isConfirmed) {
        this.launchTool(toolName);
      }
    });
  }

  /**
   * 🚀 Lancement d'outil
   */
  launchTool(toolName) {
    // Basculer vers le chat et simuler une requête
    this.switchView('chat');
    
    // Simuler l'utilisation de l'outil dans le chat
    setTimeout(() => {
      const chatInput = document.getElementById('chat-input');
      if (chatInput && window.AURAChatInstance) {
        const sampleQueries = {
          'phone-intelligence': '+33612345678',
          'email-osint': 'john.doe@protonmail.com',
          'username-hunter': '@ghost_operative',
          'domain-intelligence': 'suspicious-domain.com',
          'crypto-tracker': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        };
        
        const query = sampleQueries[toolName] || 'Démonstration outil OSINT';
        chatInput.value = query;
        window.AURAChatInstance.sendMessage();
      }
    }, 500);
  }

  /**
   * 🎬 Démarrage de scénario
   */
  startScenario(scenarioName) {
    Swal.fire({
      title: 'Démarrer le scénario ?',
      text: 'Vous allez être guidé étape par étape dans cette investigation.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Commencer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#667eea'
    }).then((result) => {
      if (result.isConfirmed) {
        this.launchScenario(scenarioName);
      }
    });
  }

  /**
   * 🎯 Lancement de scénario
   */
  launchScenario(scenarioName) {
    // Basculer vers le chat
    this.switchView('chat');
    
    // Simuler le démarrage du scénario
    setTimeout(() => {
      if (window.AURAChatInstance) {
        const scenarioQueries = {
          'le-journaliste-disparu': 'Lancer scénario : Le Journaliste Disparu',
          'l-arnaque-au-bitcoin': 'Lancer scénario : L\'Arnaque au Bitcoin',
          'la-photo-mystère-1944': 'Lancer scénario : La Photo Mystère (1944)'
        };
        
        const query = scenarioQueries[scenarioName] || `Lancer scénario : ${scenarioName}`;
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.value = query;
          window.AURAChatInstance.sendMessage();
        }
      }
    }, 500);
  }

  /**
   * 🔄 Actualisation des vues
   */
  refreshToolsGrid() {
    // Mise à jour des statistiques des outils
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
      const statsValues = card.querySelectorAll('.stat-value');
      statsValues.forEach(stat => {
        if (stat.textContent.includes('%')) {
          stat.textContent = this.randomInt(75, 98) + '%';
        } else {
          stat.textContent = this.randomInt(50, 500).toLocaleString();
        }
      });
    });
  }

  refreshScenariosGrid() {
    // Mise à jour des statistiques des scénarios
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
      const statsValues = card.querySelectorAll('.stat-value');
      statsValues.forEach(stat => {
        if (stat.textContent.includes('%')) {
          stat.textContent = this.randomInt(40, 85) + '%';
        } else {
          const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
          stat.textContent = (currentValue + this.randomInt(1, 10)).toLocaleString();
        }
      });
    });
  }

  refreshAnalytics() {
    this.updateMetrics();
  }

  /**
   * 🎲 Utilitaires
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getDifficultyLabel(difficulty) {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'expert': 'Expert'
    };
    return labels[difficulty] || difficulty;
  }

  /**
   * 🧹 Nettoyage
   */
  destroy() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
  }
}

// Exposer la classe globalement
window.AURADashboard = AURADashboard;

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que le dashboard soit actif
  const checkDashboard = () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer && dashboardContainer.classList.contains('active')) {
      if (!window.AURADashboardInstance) {
        window.AURADashboardInstance = AURADashboard.initialize();
      }
    } else {
      setTimeout(checkDashboard, 500);
    }
  };
  
  checkDashboard();
});