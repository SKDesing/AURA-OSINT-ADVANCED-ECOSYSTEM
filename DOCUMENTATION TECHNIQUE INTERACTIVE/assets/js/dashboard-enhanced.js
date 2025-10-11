/**
 * 🎛️ AURA DASHBOARD ENHANCED - UNIFIED OSINT SYSTEM
 * Tableau de bord unifié intégrant tous les systèmes OSINT
 */

class AURADashboardEnhanced {
  constructor() {
    this.activeModule = 'overview';
    this.realTimeUpdates = true;
    this.updateInterval = null;
    
    this.modules = {
      'overview': 'Vue d\'ensemble',
      'profiles': 'Profils OSINT',
      'visualization': 'Visualisations',
      'credibility': 'Scoring Crédibilité',
      'dorks': 'Google Dorks',
      'scenarios': 'Scénarios Guidés',
      'investigation': 'Investigation Complexe',
      'realtime': 'Métriques Temps Réel'
    };

    this.statistics = {
      total_profiles: 0,
      active_investigations: 0,
      credibility_score_avg: 0,
      dorks_executed: 0,
      last_update: new Date().toISOString()
    };

    this.initializeDashboard();
  }

  initializeDashboard() {
    this.createDashboardStructure();
    this.setupNavigation();
    this.loadOverviewModule();
    this.startRealTimeUpdates();
    
    console.log('🎛️ AURA Dashboard Enhanced initialisé');
  }

  createDashboardStructure() {
    const dashboardHTML = `
      <div id="aura-dashboard-enhanced" class="dashboard-container">
        <!-- Header avec navigation -->
        <header class="dashboard-header">
          <div class="header-brand">
            <h1>🔍 AURA OSINT</h1>
            <span class="version">v2.0 Enhanced</span>
          </div>
          
          <nav class="dashboard-nav">
            ${Object.entries(this.modules).map(([key, label]) => 
              `<button class="nav-btn ${key === 'overview' ? 'active' : ''}" data-module="${key}">
                ${this.getModuleIcon(key)} ${label}
              </button>`
            ).join('')}
          </nav>

          <div class="header-controls">
            <div class="realtime-indicator ${this.realTimeUpdates ? 'active' : ''}">
              <span class="pulse-dot"></span>
              <span>Temps Réel</span>
            </div>
            <button id="export-data-btn" class="control-btn">📊 Export</button>
            <button id="settings-btn" class="control-btn">⚙️</button>
          </div>
        </header>

        <!-- Sidebar avec statistiques -->
        <aside class="dashboard-sidebar">
          <div class="stats-panel">
            <h3>📈 Statistiques</h3>
            <div class="stat-item">
              <span class="stat-label">Profils Totaux</span>
              <span class="stat-value" id="stat-profiles">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Investigations</span>
              <span class="stat-value" id="stat-investigations">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Score Crédibilité</span>
              <span class="stat-value" id="stat-credibility">0%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Dorks Exécutés</span>
              <span class="stat-value" id="stat-dorks">0</span>
            </div>
          </div>

          <div class="quick-actions">
            <h3>⚡ Actions Rapides</h3>
            <button class="quick-btn" onclick="AURADashboard.quickSearch()">
              🔍 Recherche Rapide
            </button>
            <button class="quick-btn" onclick="AURADashboard.newInvestigation()">
              📋 Nouvelle Enquête
            </button>
            <button class="quick-btn" onclick="AURADashboard.generateReport()">
              📄 Rapport
            </button>
            <button class="quick-btn" onclick="AURADashboard.exportAll()">
              💾 Export Complet
            </button>
          </div>

          <div class="system-status">
            <h3>🔧 État Système</h3>
            <div class="status-item">
              <span class="status-dot green"></span>
              <span>Profils DB</span>
            </div>
            <div class="status-item">
              <span class="status-dot green"></span>
              <span>Visualisations</span>
            </div>
            <div class="status-item">
              <span class="status-dot green"></span>
              <span>Scoring</span>
            </div>
            <div class="status-item">
              <span class="status-dot green"></span>
              <span>Google Dorks</span>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <main class="dashboard-main">
          <div id="module-content" class="module-content">
            <!-- Le contenu des modules sera injecté ici -->
          </div>
        </main>

        <!-- Footer avec informations -->
        <footer class="dashboard-footer">
          <div class="footer-info">
            <span>Dernière mise à jour: <span id="last-update">--</span></span>
            <span>|</span>
            <span>Système: Opérationnel</span>
            <span>|</span>
            <span>Version: 2.0.0</span>
          </div>
        </footer>
      </div>
    `;

    // Injecter dans le conteneur principal
    const container = document.getElementById('dashboard-container') || document.body;
    container.innerHTML = dashboardHTML;
  }

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const module = e.target.dataset.module;
        this.switchModule(module);
      });
    });

    // Contrôles header
    document.getElementById('export-data-btn')?.addEventListener('click', () => this.exportData());
    document.getElementById('settings-btn')?.addEventListener('click', () => this.openSettings());
  }

  switchModule(moduleName) {
    // Mettre à jour navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-module="${moduleName}"]`)?.classList.add('active');

    this.activeModule = moduleName;

    // Charger contenu module
    switch (moduleName) {
      case 'overview':
        this.loadOverviewModule();
        break;
      case 'profiles':
        this.loadProfilesModule();
        break;
      case 'visualization':
        this.loadVisualizationModule();
        break;
      case 'credibility':
        this.loadCredibilityModule();
        break;
      case 'dorks':
        this.loadDorksModule();
        break;
      case 'scenarios':
        this.loadScenariosModule();
        break;
      case 'investigation':
        this.loadInvestigationModule();
        break;
      case 'realtime':
        this.loadRealtimeModule();
        break;
    }
  }

  loadOverviewModule() {
    const content = `
      <div class="overview-module">
        <div class="module-header">
          <h2>🎯 Vue d'ensemble AURA OSINT</h2>
          <p>Système intégré d'investigation et d'analyse OSINT</p>
        </div>

        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">👥</div>
            <h3>Profils OSINT</h3>
            <p class="card-stat">${window.AURAProfilesComplete?.profiles?.length || 0} profils</p>
            <p>Base de données complète avec 15 catégories spécialisées</p>
            <button onclick="AURADashboard.switchModule('profiles')" class="card-btn">
              Accéder →
            </button>
          </div>

          <div class="overview-card">
            <div class="card-icon">📊</div>
            <h3>Visualisations D3.js</h3>
            <p class="card-stat">5 types</p>
            <p>Graphiques réseau, timelines, heatmaps, spirales dorées</p>
            <button onclick="AURADashboard.switchModule('visualization')" class="card-btn">
              Visualiser →
            </button>
          </div>

          <div class="overview-card">
            <div class="card-icon">🎯</div>
            <h3>Scoring Crédibilité</h3>
            <p class="card-stat">5 facteurs</p>
            <p>Évaluation multi-critères de fiabilité des données</p>
            <button onclick="AURADashboard.switchModule('credibility')" class="card-btn">
              Analyser →
            </button>
          </div>

          <div class="overview-card">
            <div class="card-icon">🔍</div>
            <h3>Google Dorks</h3>
            <p class="card-stat">500+ requêtes</p>
            <p>Base complète organisée en 10 catégories</p>
            <button onclick="AURADashboard.switchModule('dorks')" class="card-btn">
              Rechercher →
            </button>
          </div>

          <div class="overview-card">
            <div class="card-icon">🎭</div>
            <h3>Scénarios Guidés</h3>
            <p class="card-stat">Interactif</p>
            <p>Démonstrations pas-à-pas des capacités OSINT</p>
            <button onclick="AURADashboard.switchModule('scenarios')" class="card-btn">
              Démarrer →
            </button>
          </div>

          <div class="overview-card">
            <div class="card-icon">📈</div>
            <h3>Métriques Temps Réel</h3>
            <p class="card-stat">Live</p>
            <p>Surveillance continue des activités système</p>
            <button onclick="AURADashboard.switchModule('realtime')" class="card-btn">
              Monitorer →
            </button>
          </div>
        </div>

        <div class="recent-activity">
          <h3>📋 Activité Récente</h3>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-time">Il y a 2 min</span>
              <span class="activity-desc">Nouveau profil DEEPFAKE_CREATOR analysé</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">Il y a 5 min</span>
              <span class="activity-desc">Visualisation réseau générée</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">Il y a 8 min</span>
              <span class="activity-desc">Score crédibilité calculé: 87%</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('module-content').innerHTML = content;
  }

  loadProfilesModule() {
    const profiles = window.AURAProfilesComplete?.profiles || [];
    
    const content = `
      <div class="profiles-module">
        <div class="module-header">
          <h2>👥 Profils OSINT</h2>
          <div class="module-controls">
            <input type="text" id="profile-search" placeholder="Rechercher profil..." class="search-input">
            <select id="category-filter" class="filter-select">
              <option value="">Toutes catégories</option>
              <option value="CHILD_SOLDIER_REHABILITATED">Enfant Soldat</option>
              <option value="CULT_MEMBER">Membre Secte</option>
              <option value="DEEPFAKE_CREATOR">Créateur Deepfake</option>
              <option value="ELECTION_MANIPULATOR">Manipulateur Élections</option>
              <option value="ENVIRONMENTAL_ACTIVIST">Activiste Environnemental</option>
              <option value="FAKE_NEWS_SPREADER">Propagateur Fake News</option>
              <option value="GHOST_BROKER">Courtier Fantôme</option>
              <option value="HACKER_FOR_HIRE">Hacker à Louer</option>
              <option value="IDENTITY_THIEF">Voleur Identité</option>
              <option value="JOURNALISTS_UNDER_THREAT">Journaliste Menacé</option>
              <option value="KINGPIN_SUCCESSOR">Successeur Baron</option>
              <option value="LOAN_SHARK">Usurier</option>
              <option value="MERCENARY">Mercenaire</option>
              <option value="NUCLEAR_SCIENTIST_ROGUE">Scientifique Nucléaire</option>
              <option value="ORGAN_TRAFFICKER">Trafiquant Organes</option>
            </select>
            <button id="add-profile-btn" class="action-btn">➕ Nouveau</button>
          </div>
        </div>

        <div class="profiles-stats">
          <div class="stat-card">
            <h4>Total Profils</h4>
            <span class="big-number">${profiles.length}</span>
          </div>
          <div class="stat-card">
            <h4>Catégories</h4>
            <span class="big-number">15</span>
          </div>
          <div class="stat-card">
            <h4>Complexité Moyenne</h4>
            <span class="big-number">${this.calculateAverageComplexity(profiles)}%</span>
          </div>
        </div>

        <div class="profiles-grid" id="profiles-grid">
          ${this.renderProfileCards(profiles.slice(0, 20))}
        </div>

        <div class="pagination">
          <button class="page-btn" onclick="AURADashboard.loadMoreProfiles()">
            Charger plus...
          </button>
        </div>
      </div>
    `;

    document.getElementById('module-content').innerHTML = content;
    this.setupProfilesEvents();
  }

  renderProfileCards(profiles) {
    return profiles.map(profile => `
      <div class="profile-card" data-category="${profile.category}">
        <div class="profile-header">
          <h4>${profile.metadata.firstname} ${profile.metadata.lastname}</h4>
          <span class="profile-category">${profile.category}</span>
        </div>
        <div class="profile-info">
          <p><strong>Âge:</strong> ${profile.metadata.age}</p>
          <p><strong>Pays:</strong> ${profile.metadata.country}</p>
          <p><strong>Complexité:</strong> ${profile.complexity_score || 'N/A'}%</p>
        </div>
        <div class="profile-actions">
          <button onclick="AURADashboard.viewProfile('${profile.id}')" class="view-btn">
            👁️ Voir
          </button>
          <button onclick="AURADashboard.analyzeProfile('${profile.id}')" class="analyze-btn">
            📊 Analyser
          </button>
          <button onclick="AURADashboard.visualizeProfile('${profile.id}')" class="viz-btn">
            🎨 Visualiser
          </button>
        </div>
      </div>
    `).join('');
  }

  loadVisualizationModule() {
    const content = `
      <div class="visualization-module">
        <div class="module-header">
          <h2>📊 Visualisations D3.js</h2>
          <div class="viz-controls">
            <select id="viz-type" class="viz-select">
              <option value="network">Graphique Réseau</option>
              <option value="timeline">Timeline Interactive</option>
              <option value="heatmap">Heatmap Risques</option>
              <option value="spiral">Spirale Dorée</option>
              <option value="sankey">Flux de Données</option>
            </select>
            <select id="viz-profile" class="viz-select">
              <option value="">Sélectionner profil...</option>
            </select>
            <button id="generate-viz-btn" class="action-btn">🎨 Générer</button>
          </div>
        </div>

        <div class="visualization-container">
          <div id="visualization-canvas" class="viz-canvas">
            <div class="viz-placeholder">
              <div class="placeholder-icon">📊</div>
              <h3>Sélectionnez un type de visualisation</h3>
              <p>Choisissez un profil et un type de graphique pour commencer</p>
            </div>
          </div>
        </div>

        <div class="viz-legend" id="viz-legend">
          <!-- Légende générée dynamiquement -->
        </div>
      </div>
    `;

    document.getElementById('module-content').innerHTML = content;
    this.setupVisualizationEvents();
  }

  loadCredibilityModule() {
    const content = `
      <div class="credibility-module">
        <div class="module-header">
          <h2>🎯 Scoring Crédibilité</h2>
          <p>Évaluation multi-facteurs de la fiabilité des données OSINT</p>
        </div>

        <div class="credibility-factors">
          <div class="factor-card">
            <h4>📊 Fiabilité Source (25%)</h4>
            <p>Évaluation de la crédibilité de la source d'information</p>
          </div>
          <div class="factor-card">
            <h4>🔗 Corroboration Données (30%)</h4>
            <p>Vérification par sources indépendantes multiples</p>
          </div>
          <div class="factor-card">
            <h4>⏰ Cohérence Temporelle (15%)</h4>
            <p>Analyse de la chronologie et fraîcheur des données</p>
          </div>
          <div class="factor-card">
            <h4>🔐 Vérification Technique (20%)</h4>
            <p>Validation cryptographique et forensique</p>
          </div>
          <div class="factor-card">
            <h4>🧠 Plausibilité Contextuelle (10%)</h4>
            <p>Cohérence géographique et comportementale</p>
          </div>
        </div>

        <div class="credibility-test">
          <h3>🧪 Test de Crédibilité</h3>
          <div class="test-form">
            <textarea id="data-input" placeholder="Entrez les données à analyser..." class="data-textarea"></textarea>
            <div class="test-options">
              <label>
                <input type="checkbox" id="source-verified"> Source vérifiée
              </label>
              <label>
                <input type="checkbox" id="multiple-sources"> Sources multiples
              </label>
              <label>
                <input type="checkbox" id="recent-data"> Données récentes
              </label>
            </div>
            <button id="analyze-credibility-btn" class="action-btn">🎯 Analyser</button>
          </div>
          
          <div id="credibility-results" class="results-panel" style="display: none;">
            <!-- Résultats d'analyse -->
          </div>
        </div>
      </div>
    `;

    document.getElementById('module-content').innerHTML = content;
    this.setupCredibilityEvents();
  }

  loadDorksModule() {
    const content = `
      <div class="dorks-module">
        <div class="module-header">
          <h2>🔍 Google Dorks Engine</h2>
          <div class="dorks-controls">
            <select id="dorks-category" class="dorks-select">
              <option value="ALL">Toutes catégories</option>
              <option value="PERSONAL_INFO">Informations Personnelles</option>
              <option value="SOCIAL_MEDIA">Réseaux Sociaux</option>
              <option value="FINANCIAL">Données Financières</option>
              <option value="DOCUMENTS">Documents Sensibles</option>
              <option value="VULNERABILITIES">Vulnérabilités</option>
              <option value="DARKNET">Darknet</option>
              <option value="GEOLOCATION">Géolocalisation</option>
              <option value="CORPORATE">Corporate</option>
              <option value="GOVERNMENT">Gouvernemental</option>
              <option value="ADVANCED_OSINT">OSINT Avancé</option>
            </select>
            <input type="text" id="dorks-search" placeholder="Rechercher dorks..." class="search-input">
            <select id="risk-filter" class="risk-select">
              <option value="ALL">Tous niveaux</option>
              <option value="LOW">Faible</option>
              <option value="MEDIUM">Moyen</option>
              <option value="HIGH">Élevé</option>
              <option value="CRITICAL">Critique</option>
            </select>
            <button id="search-dorks-btn" class="action-btn">🔍 Rechercher</button>
          </div>
        </div>

        <div class="dorks-stats">
          <div class="stat-card">
            <h4>Total Dorks</h4>
            <span class="big-number">500+</span>
          </div>
          <div class="stat-card">
            <h4>Catégories</h4>
            <span class="big-number">10</span>
          </div>
          <div class="stat-card">
            <h4>Recherches</h4>
            <span class="big-number" id="searches-count">0</span>
          </div>
        </div>

        <div class="dorks-results" id="dorks-results">
          <div class="results-placeholder">
            <div class="placeholder-icon">🔍</div>
            <h3>Sélectionnez une catégorie pour voir les dorks</h3>
            <p>Plus de 500 requêtes Google Dorks organisées par catégorie</p>
          </div>
        </div>

        <div class="custom-dork">
          <h3>🛠️ Générateur Dork Personnalisé</h3>
          <div class="custom-form">
            <input type="text" id="target-input" placeholder="Cible (nom, email, domaine...)" class="form-input">
            <select id="data-type" class="form-select">
              <option value="EMAIL">Email</option>
              <option value="PHONE">Téléphone</option>
              <option value="ADDRESS">Adresse</option>
              <option value="SOCIAL">Réseaux Sociaux</option>
              <option value="DOCUMENTS">Documents</option>
              <option value="FINANCIAL">Financier</option>
            </select>
            <input type="text" id="platform-input" placeholder="Plateforme (optionnel)" class="form-input">
            <button id="generate-dork-btn" class="action-btn">⚡ Générer</button>
          </div>
          <div id="custom-result" class="custom-result"></div>
        </div>
      </div>
    `;

    document.getElementById('module-content').innerHTML = content;
    this.setupDorksEvents();
  }

  // Méthodes utilitaires
  getModuleIcon(module) {
    const icons = {
      'overview': '🎯',
      'profiles': '👥',
      'visualization': '📊',
      'credibility': '🎯',
      'dorks': '🔍',
      'scenarios': '🎭',
      'investigation': '🕵️',
      'realtime': '📈'
    };
    return icons[module] || '📋';
  }

  calculateAverageComplexity(profiles) {
    if (!profiles.length) return 0;
    const total = profiles.reduce((sum, p) => sum + (p.complexity_score || 0), 0);
    return Math.round(total / profiles.length);
  }

  setupProfilesEvents() {
    document.getElementById('profile-search')?.addEventListener('input', (e) => {
      this.filterProfiles(e.target.value);
    });

    document.getElementById('category-filter')?.addEventListener('change', (e) => {
      this.filterProfilesByCategory(e.target.value);
    });
  }

  setupVisualizationEvents() {
    document.getElementById('generate-viz-btn')?.addEventListener('click', () => {
      this.generateVisualization();
    });
  }

  setupCredibilityEvents() {
    document.getElementById('analyze-credibility-btn')?.addEventListener('click', () => {
      this.analyzeCredibility();
    });
  }

  setupDorksEvents() {
    document.getElementById('search-dorks-btn')?.addEventListener('click', () => {
      this.searchDorks();
    });

    document.getElementById('generate-dork-btn')?.addEventListener('click', () => {
      this.generateCustomDork();
    });
  }

  startRealTimeUpdates() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    
    this.updateInterval = setInterval(() => {
      this.updateStatistics();
      this.updateLastUpdateTime();
    }, 5000); // Mise à jour toutes les 5 secondes
  }

  updateStatistics() {
    const profiles = window.AURAProfilesComplete?.profiles || [];
    
    this.statistics = {
      total_profiles: profiles.length,
      active_investigations: Math.floor(Math.random() * 10) + 1,
      credibility_score_avg: Math.floor(Math.random() * 30) + 70,
      dorks_executed: window.AURADorks?.getSearchStatistics()?.total_searches || 0,
      last_update: new Date().toISOString()
    };

    // Mettre à jour l'affichage
    document.getElementById('stat-profiles').textContent = this.statistics.total_profiles;
    document.getElementById('stat-investigations').textContent = this.statistics.active_investigations;
    document.getElementById('stat-credibility').textContent = this.statistics.credibility_score_avg + '%';
    document.getElementById('stat-dorks').textContent = this.statistics.dorks_executed;
  }

  updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR');
    document.getElementById('last-update').textContent = timeString;
  }

  // Actions rapides
  quickSearch() {
    const query = prompt('Recherche rapide:');
    if (query) {
      console.log('Recherche:', query);
      // Implémenter logique recherche
    }
  }

  newInvestigation() {
    this.switchModule('investigation');
  }

  generateReport() {
    console.log('Génération rapport...');
    // Implémenter génération rapport
  }

  exportAll() {
    const data = {
      profiles: window.AURAProfilesComplete?.profiles || [],
      dorks: window.AURADorks?.exportDorksCollection() || {},
      statistics: this.statistics,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-osint-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Méthodes d'interaction avec les modules
  viewProfile(profileId) {
    console.log('Voir profil:', profileId);
    // Implémenter vue détaillée profil
  }

  analyzeProfile(profileId) {
    console.log('Analyser profil:', profileId);
    this.switchModule('credibility');
  }

  visualizeProfile(profileId) {
    console.log('Visualiser profil:', profileId);
    this.switchModule('visualization');
  }

  generateVisualization() {
    const vizType = document.getElementById('viz-type')?.value;
    const profileId = document.getElementById('viz-profile')?.value;
    
    console.log('Générer visualisation:', vizType, profileId);
    // Implémenter génération visualisation
  }

  analyzeCredibility() {
    const data = document.getElementById('data-input')?.value;
    if (!data) return;

    const mockResult = {
      overall_score: Math.floor(Math.random() * 40) + 60,
      confidence_level: { level: 'HIGH_CONFIDENCE', label: 'Haute Confiance', color: '#3498DB' },
      breakdown: {
        source_reliability: Math.floor(Math.random() * 30) + 70,
        data_corroboration: Math.floor(Math.random() * 30) + 60,
        temporal_consistency: Math.floor(Math.random() * 30) + 65,
        technical_verification: Math.floor(Math.random() * 30) + 55,
        contextual_plausibility: Math.floor(Math.random() * 30) + 75
      }
    };

    this.displayCredibilityResults(mockResult);
  }

  displayCredibilityResults(result) {
    const resultsDiv = document.getElementById('credibility-results');
    resultsDiv.innerHTML = `
      <h4>📊 Résultats d'Analyse</h4>
      <div class="score-display">
        <div class="overall-score" style="color: ${result.confidence_level.color}">
          ${result.overall_score}/100
        </div>
        <div class="confidence-label">${result.confidence_level.label}</div>
      </div>
      <div class="breakdown">
        ${Object.entries(result.breakdown).map(([factor, score]) => `
          <div class="factor-score">
            <span class="factor-name">${factor}</span>
            <div class="score-bar">
              <div class="score-fill" style="width: ${score}%"></div>
            </div>
            <span class="score-value">${score}%</span>
          </div>
        `).join('')}
      </div>
    `;
    resultsDiv.style.display = 'block';
  }

  searchDorks() {
    const category = document.getElementById('dorks-category')?.value;
    const keywords = document.getElementById('dorks-search')?.value;
    const riskLevel = document.getElementById('risk-filter')?.value;

    if (window.AURADorks) {
      const results = window.AURADorks.searchDorks(category, keywords, riskLevel);
      this.displayDorksResults(results);
    }
  }

  displayDorksResults(results) {
    const resultsDiv = document.getElementById('dorks-results');
    
    if (results.results.length === 0) {
      resultsDiv.innerHTML = '<p>Aucun résultat trouvé.</p>';
      return;
    }

    resultsDiv.innerHTML = `
      <h4>📋 ${results.total_count} Dorks trouvés</h4>
      <div class="dorks-list">
        ${results.results.slice(0, 20).map(dork => `
          <div class="dork-item">
            <div class="dork-header">
              <h5>${dork.description}</h5>
              <span class="risk-badge risk-${dork.risk_level.toLowerCase()}">${dork.risk_level}</span>
            </div>
            <div class="dork-query">
              <code>${dork.query}</code>
              <button onclick="navigator.clipboard.writeText('${dork.query}')" class="copy-btn">📋</button>
            </div>
            <p class="dork-use-case">${dork.use_case}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  generateCustomDork() {
    const target = document.getElementById('target-input')?.value;
    const dataType = document.getElementById('data-type')?.value;
    const platform = document.getElementById('platform-input')?.value;

    if (!target || !dataType) return;

    if (window.AURADorks) {
      const customDork = window.AURADorks.generateCustomDork(target, dataType, platform);
      this.displayCustomDorkResult(customDork);
    }
  }

  displayCustomDorkResult(dork) {
    const resultDiv = document.getElementById('custom-result');
    resultDiv.innerHTML = `
      <div class="custom-dork-result">
        <h5>🛠️ Dork Généré</h5>
        <div class="generated-query">
          <code>${dork.query}</code>
          <button onclick="navigator.clipboard.writeText('${dork.query}')" class="copy-btn">📋 Copier</button>
        </div>
        <div class="dork-info">
          <p><strong>Cible:</strong> ${dork.target}</p>
          <p><strong>Type:</strong> ${dork.data_type}</p>
          <p><strong>Résultats estimés:</strong> ~${dork.estimated_results}</p>
          <p><strong>Risque:</strong> <span class="risk-${dork.risk_assessment.level.toLowerCase()}">${dork.risk_assessment.level}</span></p>
        </div>
      </div>
    `;
  }
}

// Initialiser dashboard
const AURADashboard = new AURADashboardEnhanced();
window.AURADashboard = AURADashboard;

console.log('🎛️ AURA Dashboard Enhanced initialisé');