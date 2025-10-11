// 🎯 ALGORITHMES AVANCÉS - DONNÉES FACTICES RÉALISTES AURA OSINT
// Simulation complète du backend avec 17 outils OSINT opérationnels

// Générateur de données réalistes
class MockDataGenerator {
  static generateRealisticEmail() {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'protonmail.com', 'tutanota.com'];
    const names = ['john.doe', 'jane.smith', 'alex.martin', 'sarah.wilson', 'mike.johnson'];
    return `${names[Math.floor(Math.random() * names.length)]}@${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  static generatePhoneNumber() {
    const countries = ['+33', '+1', '+44', '+49', '+39'];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${country}${number}`;
  }

  static generateUsername() {
    const prefixes = ['cyber', 'dark', 'shadow', 'ghost', 'phantom', 'neo', 'matrix'];
    const suffixes = ['hunter', 'wolf', 'eagle', 'storm', 'blade', 'fire', 'ice'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}${numbers}`;
  }

  static generateDomain() {
    const tlds = ['.com', '.org', '.net', '.io', '.tech', '.ai', '.dev'];
    const names = ['techcorp', 'innovate', 'nexus', 'quantum', 'cyber', 'digital', 'future'];
    return `${names[Math.floor(Math.random() * names.length)]}${tlds[Math.floor(Math.random() * tlds.length)]}`;
  }

  static generateIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
}

// 17 OUTILS OSINT COMPLETS avec données réalistes
export const mockOsintTools = {
  // 📧 EMAIL TOOLS (5 outils)
  email: {
    holehe: {
      name: 'Holehe',
      description: 'Vérification de comptes sur 120+ plateformes via email',
      status: 'active',
      usage: Math.floor(Math.random() * 2000) + 1000,
      successRate: 94.2 + Math.random() * 4,
      lastUsed: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      platforms: ['Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'GitHub', 'Discord']
    },
    h8mail: {
      name: 'H8mail',
      description: 'Recherche dans les bases de données de fuites',
      status: 'active', 
      usage: Math.floor(Math.random() * 1500) + 800,
      successRate: 98.7 + Math.random() * 1,
      breachDatabases: 847,
      lastUpdate: new Date().toISOString()
    },
    theHarvester: {
      name: 'TheHarvester',
      description: 'Collecte d\'emails, sous-domaines et IPs',
      status: 'active',
      usage: Math.floor(Math.random() * 1200) + 600,
      successRate: 91.5 + Math.random() * 5,
      sources: ['Google', 'Bing', 'Shodan', 'LinkedIn']
    },
    hunter_io: {
      name: 'Hunter.io',
      description: 'API professionnelle de recherche d\'emails',
      status: 'active',
      usage: Math.floor(Math.random() * 800) + 400,
      successRate: 96.8 + Math.random() * 2,
      apiCalls: Math.floor(Math.random() * 10000) + 5000
    },
    clearbit: {
      name: 'Clearbit',
      description: 'Enrichissement de données d\'entreprise',
      status: 'active',
      usage: Math.floor(Math.random() * 600) + 300,
      successRate: 89.3 + Math.random() * 6,
      companies: Math.floor(Math.random() * 50000) + 25000
    }
  },

  // 📱 PHONE TOOLS (3 outils)
  phone: {
    phoneinfoga: {
      name: 'PhoneInfoga',
      description: 'Framework OSINT pour numéros de téléphone',
      status: 'active',
      usage: Math.floor(Math.random() * 1000) + 500,
      successRate: 89.3 + Math.random() * 7,
      countries: 195,
      carriers: Math.floor(Math.random() * 500) + 200
    },
    phonenumbers: {
      name: 'PhoneNumbers',
      description: 'Parsing et validation de numéros internationaux',
      status: 'active',
      usage: Math.floor(Math.random() * 800) + 400,
      successRate: 97.2 + Math.random() * 2,
      formats: ['E164', 'International', 'National']
    },
    numverify: {
      name: 'NumVerify',
      description: 'API de validation de numéros de téléphone',
      status: 'active',
      usage: Math.floor(Math.random() * 600) + 300,
      successRate: 94.7 + Math.random() * 3,
      validations: Math.floor(Math.random() * 100000) + 50000
    }
  },

  // 👤 SOCIAL MEDIA TOOLS (4 outils)
  social: {
    sherlock: {
      name: 'Sherlock',
      description: 'Recherche de usernames sur 400+ sites',
      status: 'active',
      usage: Math.floor(Math.random() * 3000) + 2000,
      successRate: 96.8 + Math.random() * 2,
      sites: 418,
      lastScan: new Date(Date.now() - Math.random() * 3600000).toISOString()
    },
    social_analyzer: {
      name: 'Social Analyzer',
      description: 'Analyse de profils sur réseaux sociaux',
      status: 'active',
      usage: Math.floor(Math.random() * 1500) + 800,
      successRate: 92.4 + Math.random() * 5,
      platforms: ['Twitter', 'Instagram', 'Facebook', 'TikTok', 'LinkedIn']
    },
    instaloader: {
      name: 'Instaloader',
      description: 'Téléchargement et analyse Instagram',
      status: 'active',
      usage: Math.floor(Math.random() * 1200) + 600,
      successRate: 88.9 + Math.random() * 8,
      profiles: Math.floor(Math.random() * 10000) + 5000
    },
    twint: {
      name: 'Twint',
      description: 'Scraping Twitter sans API',
      status: 'active',
      usage: Math.floor(Math.random() * 2000) + 1000,
      successRate: 85.6 + Math.random() * 10,
      tweets: Math.floor(Math.random() * 1000000) + 500000
    }
  },

  // 🌐 NETWORK TOOLS (5 outils)
  network: {
    whois: {
      name: 'WHOIS Lookup',
      description: 'Informations de registration de domaine',
      status: 'active',
      usage: Math.floor(Math.random() * 4000) + 3000,
      successRate: 99.1 + Math.random() * 0.8,
      domains: Math.floor(Math.random() * 100000) + 50000,
      registrars: 2847
    },
    nmap: {
      name: 'Nmap Scanner',
      description: 'Découverte réseau et scan de ports',
      status: 'active',
      usage: Math.floor(Math.random() * 2500) + 1500,
      successRate: 95.7 + Math.random() * 3,
      portsScanned: Math.floor(Math.random() * 1000000) + 500000,
      techniques: ['TCP SYN', 'UDP', 'TCP Connect', 'Stealth']
    },
    subfinder: {
      name: 'Subfinder',
      description: 'Découverte de sous-domaines',
      status: 'active',
      usage: Math.floor(Math.random() * 2000) + 1200,
      successRate: 93.4 + Math.random() * 4,
      subdomains: Math.floor(Math.random() * 50000) + 25000,
      sources: ['Certificate Transparency', 'DNS', 'Search Engines']
    },
    amass: {
      name: 'Amass',
      description: 'Cartographie de surface d\'attaque',
      status: 'active',
      usage: Math.floor(Math.random() * 1800) + 1000,
      successRate: 91.8 + Math.random() * 5,
      techniques: ['Active', 'Passive', 'Certificate'],
      dataSources: 55
    },
    shodan: {
      name: 'Shodan',
      description: 'Moteur de recherche pour appareils connectés',
      status: 'active',
      usage: Math.floor(Math.random() * 1500) + 800,
      successRate: 97.3 + Math.random() * 2,
      devices: Math.floor(Math.random() * 10000000) + 5000000,
      countries: 195
    }
  }
};

export const mockInvestigations = [
  {
    id: 'INV-2024-001',
    target: 'john.doe@suspicious-domain.com',
    type: 'email',
    status: 'completed',
    progress: 100,
    created_at: '2024-01-15T10:30:00Z',
    tools_used: ['holehe', 'breach_check'],
    results: {
      holehe: { accounts_found: 12, platforms: ['Twitter', 'LinkedIn'] },
      breach_check: { breaches_found: 3, breaches: ['Collection #1'] }
    },
    risk_score: 8.7
  },
  
  {
    id: 'INV-2024-002',
    target: '+33612345678',
    type: 'phone',
    status: 'running',
    progress: 65,
    created_at: '2024-01-15T14:20:00Z',
    tools_used: ['phoneinfoga'],
    results: {
      phoneinfoga: { carrier: 'Orange France', country: 'France' }
    },
    risk_score: 4.2
  }
];

// 📊 MÉTRIQUES TEMPS RÉEL avec algorithmes de simulation
export const mockMetrics = {
  realtime: {
    investigations_active: Math.floor(Math.random() * 50) + 10,
    tools_running: Math.floor(Math.random() * 15) + 5,
    api_calls_per_minute: Math.floor(Math.random() * 500) + 200,
    success_rate_live: 94.2 + Math.random() * 4
  },
  daily: { 
    investigations: Math.floor(Math.random() * 100) + 200,
    success_rate: 94.2 + Math.random() * 4,
    avg_duration: Math.floor(Math.random() * 60) + 120,
    tools_used: Math.floor(Math.random() * 17) + 10
  },
  weekly: { 
    investigations: Math.floor(Math.random() * 500) + 1500,
    success_rate: 95.7 + Math.random() * 3,
    peak_hour: Math.floor(Math.random() * 24),
    most_used_tool: 'sherlock'
  },
  monthly: { 
    investigations: Math.floor(Math.random() * 2000) + 6000,
    success_rate: 96.1 + Math.random() * 2,
    growth_rate: Math.floor(Math.random() * 20) + 5,
    new_users: Math.floor(Math.random() * 500) + 200
  },
  performance: { 
    uptime: 99.94 + Math.random() * 0.05,
    response_time: 1.2 + Math.random() * 0.8,
    cpu_usage: Math.floor(Math.random() * 30) + 20,
    memory_usage: Math.floor(Math.random() * 40) + 30,
    disk_usage: Math.floor(Math.random() * 20) + 10
  },
  ai_engine: {
    qwen_status: 'active',
    model_accuracy: 96.8 + Math.random() * 2,
    queries_processed: Math.floor(Math.random() * 10000) + 50000,
    avg_response_time: Math.floor(Math.random() * 500) + 200
  }
};

// 🎯 GÉNÉRATEUR DE DONNÉES EN TEMPS RÉEL
export const generateLiveData = () => {
  return {
    timestamp: new Date().toISOString(),
    active_investigations: Math.floor(Math.random() * 20) + 5,
    tools_status: Object.keys(mockOsintTools).reduce((acc, category) => {
      acc[category] = Object.keys(mockOsintTools[category]).reduce((toolAcc, tool) => {
        toolAcc[tool] = Math.random() > 0.1 ? 'active' : 'maintenance';
        return toolAcc;
      }, {});
      return acc;
    }, {}),
    system_load: {
      cpu: Math.floor(Math.random() * 50) + 20,
      memory: Math.floor(Math.random() * 60) + 30,
      network: Math.floor(Math.random() * 100) + 50
    }
  };
};

// 🤖 SIMULATION IA QWEN - Réponses intelligentes
export const mockAIResponses = {
  greetings: [
    '👋 Bonjour! Je suis AURA IA, votre assistant OSINT avancé.',
    '🎯 Salut! Prêt pour une investigation OSINT? J\'ai accès à 17 outils spécialisés.',
    '🔍 Hello! AURA IA à votre service. Quel type d\'analyse souhaitez-vous effectuer?'
  ],
  
  tool_suggestions: {
    email: 'Pour cette adresse email, je recommande Holehe pour vérifier les comptes sociaux, H8mail pour les fuites de données.',
    phone: 'Pour ce numéro, PhoneInfoga sera parfait pour l\'analyse géographique et l\'identification du carrier.',
    username: 'Sherlock est idéal pour rechercher ce nom d\'utilisateur sur 400+ plateformes.',
    domain: 'Pour ce domaine, je vais lancer WHOIS et Subfinder pour une analyse complète.',
    ip: 'Cette IP sera analysée avec Nmap pour les ports ouverts et Shodan pour la géolocalisation.'
  }
};

// Export par défaut
export default {
  mockOsintTools,
  mockInvestigations, 
  mockMetrics,
  generateLiveData,
  mockAIResponses,
  MockDataGenerator
};