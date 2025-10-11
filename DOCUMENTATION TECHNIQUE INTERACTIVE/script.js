// AURA OSINT - JavaScript Interactif

// Configuration des outils OSINT avec données techniques détaillées
const osintTools = {
  operational: [
    { 
      name: 'Sherlock', 
      category: 'Username', 
      description: 'Recherche username sur 400+ sites',
      path: 'backend/tools/username/sherlock.py',
      version: '3.14.0',
      executionTime: '15-45s',
      coverage: '400+ sites'
    },
    { 
      name: 'Maigret', 
      category: 'Username', 
      description: 'Intelligence username avancée (2000+ sites)',
      path: 'backend/tools/username/maigret.py',
      version: '0.5.0',
      executionTime: '30-120s',
      coverage: '2000+ sites'
    },
    { 
      name: 'Subfinder', 
      category: 'Domain', 
      description: 'Énumération passive sous-domaines',
      path: 'backend/tools/domain/subfinder.py',
      version: '2.6.3',
      executionTime: '10-60s',
      coverage: 'Passive enumeration'
    },
    { 
      name: 'WhoisTool', 
      category: 'Domain', 
      description: 'Informations domaine et DNS',
      path: 'backend/tools/domain/whois.py',
      version: '1.0.0',
      executionTime: '1-5s',
      coverage: 'Global WHOIS'
    },
    { 
      name: 'Holehe', 
      category: 'Email', 
      description: 'Vérification email sur 120+ sites',
      path: 'backend/tools/email/holehe.py',
      version: '1.19.9',
      executionTime: '10-30s',
      coverage: '120+ sites'
    },
    { 
      name: 'H8Mail', 
      category: 'Breach', 
      description: 'Recherche dans fuites de données',
      path: 'backend/tools/breach/h8mail.py',
      version: '2.5.6',
      executionTime: '5-20s',
      coverage: 'Multiple breach DBs'
    },
    { 
      name: 'PhoneNumbers', 
      category: 'Phone', 
      description: 'Validation et lookup opérateur',
      path: 'backend/tools/phone/phonenumbers.py',
      version: '8.13.x',
      executionTime: '0.1-0.5s',
      coverage: 'Global validation'
    },
    { 
      name: 'PhoneInfoga', 
      category: 'Phone', 
      description: 'OSINT téléphonique avancé',
      path: 'backend/tools/phone/phoneinfoga.py',
      version: '2.11.0',
      executionTime: '5-15s',
      coverage: 'Advanced phone OSINT'
    },
    { 
      name: 'TwitterTool', 
      category: 'Social', 
      description: 'Analyse profils et réseaux Twitter',
      path: 'backend/tools/social/twitter.py',
      version: '1.0.0',
      executionTime: '10-30s',
      coverage: 'Twitter API v2'
    },
    { 
      name: 'InstagramTool', 
      category: 'Social', 
      description: 'Analyse contenu Instagram',
      path: 'backend/tools/social/instagram.py',
      version: '1.0.0',
      executionTime: '15-45s',
      coverage: 'Public profiles'
    },
    { 
      name: 'ShodanTool', 
      category: 'Network', 
      description: 'Reconnaissance réseau et vulnérabilités',
      path: 'backend/tools/network/shodan.py',
      version: '1.31.0',
      executionTime: '2-10s',
      coverage: 'Global IoT scan'
    },
    { 
      name: 'IPIntelligence', 
      category: 'Network', 
      description: 'Intelligence géolocalisation IP',
      path: 'backend/tools/network/ip_intelligence.py',
      version: '1.0.0',
      executionTime: '1-3s',
      coverage: 'IP geolocation'
    },
    { 
      name: 'PortScanner', 
      category: 'Network', 
      description: 'Scan ports et services',
      path: 'backend/tools/network/port_scanner.py',
      version: '1.0.0',
      executionTime: '5-30s',
      coverage: 'TCP/UDP ports'
    },
    { 
      name: 'SSLAnalyzer', 
      category: 'Network', 
      description: 'Analyse certificats SSL',
      path: 'backend/tools/network/ssl_analyzer.py',
      version: '1.0.0',
      executionTime: '2-8s',
      coverage: 'SSL/TLS analysis'
    },
    { 
      name: 'NetworkMapper', 
      category: 'Network', 
      description: 'Cartographie réseau',
      path: 'backend/tools/network/network_mapper.py',
      version: '1.0.0',
      executionTime: '10-60s',
      coverage: 'Network topology'
    },
    { 
      name: 'OnionScan', 
      category: 'Darknet', 
      description: 'Scanner vulnérabilités services Tor',
      path: 'backend/tools/darknet/onionscan.py',
      version: '0.3.0',
      executionTime: '30-120s',
      coverage: '.onion services'
    },
    { 
      name: 'TorBot', 
      category: 'Darknet', 
      description: 'Crawler intelligence dark web',
      path: 'backend/tools/darknet/torbot.py',
      version: '4.0.0',
      executionTime: '20-90s',
      coverage: 'Tor network crawl'
    },
    { 
      name: 'ExifRead', 
      category: 'Image', 
      description: 'Extraction métadonnées avec GPS',
      path: 'backend/tools/image/exifread.py',
      version: '3.0.0',
      executionTime: '0.5-2s',
      coverage: 'EXIF + GPS data'
    },
    { 
      name: 'BlockchainTool', 
      category: 'Crypto', 
      description: 'Analyse adresses crypto',
      path: 'backend/tools/crypto/blockchain.py',
      version: '1.0.0',
      executionTime: '3-15s',
      coverage: 'BTC/ETH analysis'
    }
  ],
  missing: [
    { name: 'TheHarvester', category: 'Domain', description: 'Intelligence email/domaine', priority: 'HIGH' },
    { name: 'EmailRep', category: 'Email', description: 'Réputation email', priority: 'HIGH' },
    { name: 'TinEye', category: 'Image', description: 'Recherche image inversée', priority: 'MEDIUM' },
    { name: 'Sublist3r', category: 'Domain', description: 'Découverte sous-domaines', priority: 'HIGH' },
    { name: 'WhatsMyName', category: 'Username', description: 'Vérification username rapide', priority: 'MEDIUM' },
    { name: 'Amass', category: 'Network', description: 'Reconnaissance réseau complète', priority: 'HIGH' },
    { name: 'BitcoinAbuse', category: 'Crypto', description: 'Vérification adresses Bitcoin', priority: 'LOW' },
    { name: 'Nmap', category: 'Network', description: 'Scanner réseau avancé', priority: 'MEDIUM' }
  ]
};

// Statistiques en temps réel avec métriques détaillées
const stats = {
  totalTools: 25,
  operational: 17,
  missing: 8,
  coverage: 68,
  categories: 9,
  completedCategories: 2, // Phone et Darknet à 100%
  avgExecutionTime: '15s',
  totalCoverage: '5000+ sites',
  databaseTables: 12,
  apiEndpoints: 25
};

// Cache DOM pour performance
const domCache = new Map();

function getCachedElement(selector) {
  if (!domCache.has(selector)) {
    domCache.set(selector, document.querySelector(selector));
  }
  return domCache.get(selector);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initSmoothScroll();
  initStatsAnimation();
  initToolsDisplay();
  initAOS();
});

// Toggle thème sombre/clair
function initThemeToggle() {
  const themeToggle = getCachedElement('.theme-toggle');
  const html = document.documentElement;
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Charger thème sauvegardé
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
}

// Scroll fluide pour les ancres
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Animation des statistiques
function initStatsAnimation() {
  const statsElements = document.querySelectorAll('.stats-number');
  
  const animateStats = () => {
    statsElements.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        el.textContent = current + (el.dataset.suffix || '');
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    });
  };
  
  // Observer pour déclencher l'animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  });
  
  const statsSection = getCachedElement('#stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Affichage des outils
function initToolsDisplay() {
  displayToolsGrid();
  updateToolsStats();
}

function displayToolsGrid() {
  const toolsContainer = getCachedElement('#tools-grid');
  if (!toolsContainer) return;
  
  const htmlParts = [];
  
  // Outils opérationnels
  osintTools.operational.forEach(tool => {
    htmlParts.push(createToolCard(tool, 'operational'));
  });
  
  // Outils manquants
  osintTools.missing.forEach(tool => {
    htmlParts.push(createToolCard(tool, 'missing'));
  });
  
  toolsContainer.innerHTML = htmlParts.join('');
}

function createToolCard(tool, status) {
  const statusClass = status === 'operational' ? 'status-operational' : 'status-missing';
  const statusText = status === 'operational' ? 'Opérationnel' : 'Manquant';
  const icon = getToolIcon(tool.category);
  
  // Détails techniques pour outils opérationnels
  const technicalDetails = status === 'operational' ? `
    <div class="mt-2 small text-muted">
      <div><i class="bi bi-code-slash me-1"></i> ${tool.path || 'N/A'}</div>
      <div><i class="bi bi-clock me-1"></i> ${tool.executionTime || 'N/A'}</div>
      <div><i class="bi bi-shield-check me-1"></i> ${tool.coverage || 'N/A'}</div>
    </div>
  ` : `
    <div class="mt-2 small text-warning">
      <div><i class="bi bi-exclamation-triangle me-1"></i> Priorité: ${tool.priority || 'MEDIUM'}</div>
    </div>
  `;
  
  return `
    <div class="tool-card" data-aos="fade-up">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="d-flex align-items-center gap-2">
          <i class="bi ${icon} text-primary fs-4"></i>
          <div>
            <h5 class="mb-0">${tool.name}</h5>
            ${tool.version ? `<small class="text-muted">v${tool.version}</small>` : ''}
          </div>
        </div>
        <span class="tool-status ${statusClass}">${statusText}</span>
      </div>
      <p class="text-muted mb-2">${tool.description}</p>
      <div class="d-flex justify-content-between align-items-end">
        <small class="badge badge-soft">${tool.category}</small>
      </div>
      ${technicalDetails}
    </div>
  `;
}

function getToolIcon(category) {
  const icons = {
    'Username': 'bi-person-badge',
    'Domain': 'bi-globe',
    'Email': 'bi-envelope',
    'Breach': 'bi-shield-exclamation',
    'Phone': 'bi-telephone',
    'Social': 'bi-people',
    'Network': 'bi-diagram-3',
    'Darknet': 'bi-eye-slash',
    'Image': 'bi-image',
    'Crypto': 'bi-currency-bitcoin'
  };
  return icons[category] || 'bi-gear';
}

function updateToolsStats() {
  // Mettre à jour les statistiques dans le DOM
  const totalElement = getCachedElement('[data-stat="total"]');
  const operationalElement = getCachedElement('[data-stat="operational"]');
  const coverageElement = getCachedElement('[data-stat="coverage"]');
  
  if (totalElement) totalElement.textContent = stats.totalTools;
  if (operationalElement) operationalElement.textContent = stats.operational;
  if (coverageElement) coverageElement.textContent = stats.coverage + '%';
  
  // Mettre à jour les métriques avancées
  updateAdvancedMetrics();
}

function updateAdvancedMetrics() {
  // Calculer les statistiques par catégorie
  const categoryStats = calculateCategoryStats();
  
  // Afficher dans la console pour debug
  console.log('📊 AURA OSINT Stats:', {
    operational: stats.operational,
    missing: stats.missing,
    coverage: stats.coverage + '%',
    categories: categoryStats
  });
}

function calculateCategoryStats() {
  const categories = {};
  
  // Compter les outils par catégorie
  osintTools.operational.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = { operational: 0, total: 0 };
    }
    categories[tool.category].operational++;
    categories[tool.category].total++;
  });
  
  osintTools.missing.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = { operational: 0, total: 0 };
    }
    categories[tool.category].total++;
  });
  
  // Calculer les pourcentages
  Object.keys(categories).forEach(cat => {
    const stats = categories[cat];
    stats.percentage = Math.round((stats.operational / stats.total) * 100);
  });
  
  return categories;
}

// Initialisation AOS (Animate On Scroll)
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }
}

// Fonction utilitaire pour formater les nombres
function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// Gestion des erreurs globales avec logging avancé
window.addEventListener('error', function(e) {
  console.error('🚨 Erreur JavaScript AURA OSINT:', {
    message: e.error?.message,
    stack: e.error?.stack,
    filename: e.filename,
    lineno: e.lineno,
    timestamp: new Date().toISOString()
  });
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('⚡ AURA OSINT Performance:', {
        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
        domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
        timestamp: new Date().toISOString()
      });
    }, 0);
  });
}

// Export pour utilisation externe avec API étendue
window.AuraOSINT = {
  tools: osintTools,
  stats: stats,
  updateStats: updateToolsStats,
  displayTools: displayToolsGrid,
  calculateCategoryStats: calculateCategoryStats,
  
  // API pour accéder aux données techniques
  getToolByName: (name) => {
    return osintTools.operational.find(tool => tool.name === name) || 
           osintTools.missing.find(tool => tool.name === name);
  },
  
  getToolsByCategory: (category) => {
    const operational = osintTools.operational.filter(tool => tool.category === category);
    const missing = osintTools.missing.filter(tool => tool.category === category);
    return { operational, missing };
  },
  
  // Métriques en temps réel
  getRealTimeMetrics: () => {
    return {
      ...stats,
      timestamp: new Date().toISOString(),
      categoryBreakdown: calculateCategoryStats()
    };
  }
};