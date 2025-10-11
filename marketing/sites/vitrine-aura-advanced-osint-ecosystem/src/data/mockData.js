// Données factices basées sur le backend AURA OSINT
export const mockOsintTools = {
  email: {
    holehe: {
      name: 'Holehe',
      description: 'Vérification de comptes sur les réseaux sociaux via email',
      status: 'active',
      usage: 1247,
      successRate: 94.2
    },
    breach_check: {
      name: 'Breach Check', 
      description: 'Vérification des fuites de données',
      status: 'active',
      usage: 892,
      successRate: 98.7
    }
  },
  
  phone: {
    phoneinfoga: {
      name: 'PhoneInfoga',
      description: 'Analyse avancée des numéros de téléphone',
      status: 'active',
      usage: 756,
      successRate: 89.3
    }
  },

  social: {
    sherlock: {
      name: 'Sherlock',
      description: 'Recherche de nom d\'utilisateur sur 400+ sites',
      status: 'active',
      usage: 2134,
      successRate: 96.8
    }
  },

  network: {
    whois: {
      name: 'WHOIS Lookup',
      description: 'Informations de registration de domaine',
      status: 'active',
      usage: 3421,
      successRate: 99.1
    },
    nmap: {
      name: 'Nmap Scanner',
      description: 'Scan de ports et découverte réseau',
      status: 'active',
      usage: 1876,
      successRate: 95.7
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

export const mockMetrics = {
  daily: { investigations: 234, success_rate: 94.2 },
  weekly: { investigations: 1653, success_rate: 95.7 },
  monthly: { investigations: 6789, success_rate: 96.1 },
  performance: { uptime: 99.94, response_time: 1.2 }
};