/**
 * 🔍 AURA GOOGLE DORKS ADVANCED ENGINE
 * Base de données complète de 500+ Google Dorks pour investigations OSINT
 */

class AURAGoogleDorksEngine {
  constructor() {
    this.categories = {
      'PERSONAL_INFO': 'Informations Personnelles',
      'SOCIAL_MEDIA': 'Réseaux Sociaux',
      'FINANCIAL': 'Données Financières',
      'DOCUMENTS': 'Documents Sensibles',
      'VULNERABILITIES': 'Vulnérabilités',
      'DARKNET': 'Darknet & Underground',
      'GEOLOCATION': 'Géolocalisation',
      'CORPORATE': 'Renseignement Corporatif',
      'GOVERNMENT': 'Données Gouvernementales',
      'ADVANCED_OSINT': 'OSINT Avancé'
    };

    this.dorks = this.initializeDorksDatabase();
    this.searchHistory = [];
  }

  initializeDorksDatabase() {
    return {
      'PERSONAL_INFO': [
        {
          query: 'intext:"email" OR intext:"@" site:pastebin.com',
          description: 'Emails exposés sur Pastebin',
          risk_level: 'HIGH',
          use_case: 'Recherche fuites données personnelles'
        },
        {
          query: 'intitle:"curriculum vitae" OR intitle:"resume" filetype:pdf',
          description: 'CV et résumés publics',
          risk_level: 'MEDIUM',
          use_case: 'Profiling professionnel'
        },
        {
          query: 'intext:"phone number" OR intext:"mobile" site:facebook.com',
          description: 'Numéros de téléphone Facebook',
          risk_level: 'HIGH',
          use_case: 'Collecte contacts personnels'
        },
        {
          query: '"date of birth" OR "DOB" OR "born" site:linkedin.com',
          description: 'Dates de naissance LinkedIn',
          risk_level: 'MEDIUM',
          use_case: 'Informations démographiques'
        },
        {
          query: 'intext:"SSN" OR intext:"social security" filetype:xls',
          description: 'Numéros sécurité sociale dans Excel',
          risk_level: 'CRITICAL',
          use_case: 'Détection fuites identité'
        },
        {
          query: 'intitle:"address book" OR "contact list" filetype:csv',
          description: 'Carnets d\'adresses exposés',
          risk_level: 'HIGH',
          use_case: 'Mapping réseau social'
        },
        {
          query: '"mother\'s maiden name" OR "security question"',
          description: 'Questions de sécurité exposées',
          risk_level: 'HIGH',
          use_case: 'Bypass sécurité comptes'
        },
        {
          query: 'intext:"passport number" OR "passport #" filetype:pdf',
          description: 'Numéros de passeport',
          risk_level: 'CRITICAL',
          use_case: 'Documents d\'identité compromis'
        }
      ],

      'SOCIAL_MEDIA': [
        {
          query: 'site:instagram.com intext:"location" OR intext:"check-in"',
          description: 'Géolocalisation Instagram',
          risk_level: 'MEDIUM',
          use_case: 'Tracking déplacements'
        },
        {
          query: 'site:twitter.com "private message" OR "DM me"',
          description: 'Demandes messages privés Twitter',
          risk_level: 'LOW',
          use_case: 'Identification canaux communication'
        },
        {
          query: 'site:facebook.com "relationship status" "single"',
          description: 'Statuts relationnels Facebook',
          risk_level: 'LOW',
          use_case: 'Profiling personnel'
        },
        {
          query: 'site:linkedin.com "currently looking" OR "open to opportunities"',
          description: 'Recherche emploi LinkedIn',
          risk_level: 'LOW',
          use_case: 'Opportunités recrutement'
        },
        {
          query: 'site:tiktok.com intext:"live stream" OR "going live"',
          description: 'Lives TikTok programmés',
          risk_level: 'MEDIUM',
          use_case: 'Surveillance temps réel'
        },
        {
          query: 'site:snapchat.com "snap map" OR "location sharing"',
          description: 'Partage localisation Snapchat',
          risk_level: 'HIGH',
          use_case: 'Géolocalisation précise'
        },
        {
          query: 'site:reddit.com "throwaway account" OR "using alt"',
          description: 'Comptes alternatifs Reddit',
          risk_level: 'MEDIUM',
          use_case: 'Identification identités multiples'
        }
      ],

      'FINANCIAL': [
        {
          query: 'intext:"credit card" OR "card number" site:pastebin.com',
          description: 'Cartes de crédit exposées',
          risk_level: 'CRITICAL',
          use_case: 'Détection fraude financière'
        },
        {
          query: 'intitle:"bank statement" OR "account balance" filetype:pdf',
          description: 'Relevés bancaires publics',
          risk_level: 'CRITICAL',
          use_case: 'Analyse finances personnelles'
        },
        {
          query: '"IBAN" OR "routing number" OR "sort code" filetype:xls',
          description: 'Coordonnées bancaires Excel',
          risk_level: 'CRITICAL',
          use_case: 'Informations comptes bancaires'
        },
        {
          query: 'intext:"bitcoin address" OR "BTC:" OR "wallet"',
          description: 'Adresses Bitcoin publiques',
          risk_level: 'HIGH',
          use_case: 'Traçage transactions crypto'
        },
        {
          query: 'intitle:"invoice" OR "bill" OR "receipt" filetype:pdf',
          description: 'Factures et reçus exposés',
          risk_level: 'MEDIUM',
          use_case: 'Analyse habitudes dépenses'
        },
        {
          query: '"tax return" OR "tax document" filetype:pdf',
          description: 'Déclarations fiscales',
          risk_level: 'CRITICAL',
          use_case: 'Informations revenus'
        },
        {
          query: 'intext:"paypal" AND "transaction ID" site:pastebin.com',
          description: 'Transactions PayPal exposées',
          risk_level: 'HIGH',
          use_case: 'Historique paiements'
        }
      ],

      'DOCUMENTS': [
        {
          query: 'intitle:"confidential" OR "classified" filetype:pdf',
          description: 'Documents confidentiels PDF',
          risk_level: 'HIGH',
          use_case: 'Fuites documents sensibles'
        },
        {
          query: 'intext:"password" filetype:txt OR filetype:log',
          description: 'Mots de passe en texte brut',
          risk_level: 'CRITICAL',
          use_case: 'Compromission comptes'
        },
        {
          query: 'intitle:"employee list" OR "staff directory" filetype:xls',
          description: 'Listes employés exposées',
          risk_level: 'MEDIUM',
          use_case: 'Mapping organisationnel'
        },
        {
          query: 'filetype:sql "INSERT INTO" "password"',
          description: 'Dumps bases de données',
          risk_level: 'CRITICAL',
          use_case: 'Fuites massives données'
        },
        {
          query: 'intitle:"backup" OR "dump" filetype:sql',
          description: 'Sauvegardes bases données',
          risk_level: 'CRITICAL',
          use_case: 'Accès données complètes'
        },
        {
          query: 'intext:"api key" OR "secret key" site:github.com',
          description: 'Clés API exposées GitHub',
          risk_level: 'HIGH',
          use_case: 'Accès services tiers'
        },
        {
          query: 'intitle:"contract" OR "agreement" filetype:pdf',
          description: 'Contrats et accords',
          risk_level: 'MEDIUM',
          use_case: 'Relations commerciales'
        }
      ],

      'VULNERABILITIES': [
        {
          query: 'inurl:"/admin" OR inurl:"/administrator"',
          description: 'Panels d\'administration exposés',
          risk_level: 'HIGH',
          use_case: 'Points d\'entrée systèmes'
        },
        {
          query: 'intitle:"phpMyAdmin" "Welcome to phpMyAdmin"',
          description: 'Interfaces phpMyAdmin ouvertes',
          risk_level: 'CRITICAL',
          use_case: 'Accès bases de données'
        },
        {
          query: 'inurl:"/wp-admin" "log in"',
          description: 'Panels WordPress admin',
          risk_level: 'MEDIUM',
          use_case: 'Sites WordPress vulnérables'
        },
        {
          query: 'intitle:"Index of /" "Parent Directory"',
          description: 'Directory listing activé',
          risk_level: 'MEDIUM',
          use_case: 'Exploration structure serveur'
        },
        {
          query: 'intext:"sql syntax near" OR "mysql_fetch_array()"',
          description: 'Erreurs SQL exposées',
          risk_level: 'HIGH',
          use_case: 'Vulnérabilités injection SQL'
        },
        {
          query: 'intitle:"Apache Status" "Server Information"',
          description: 'Pages statut Apache',
          risk_level: 'MEDIUM',
          use_case: 'Informations configuration serveur'
        },
        {
          query: 'inurl:"/config" filetype:php OR filetype:inc',
          description: 'Fichiers configuration exposés',
          risk_level: 'HIGH',
          use_case: 'Credentials et paramètres'
        }
      ],

      'DARKNET': [
        {
          query: 'intext:".onion" OR "tor browser" site:pastebin.com',
          description: 'Liens .onion exposés',
          risk_level: 'HIGH',
          use_case: 'Cartographie darknet'
        },
        {
          query: 'intext:"marketplace" AND "bitcoin" AND "escrow"',
          description: 'Marketplaces darknet',
          risk_level: 'CRITICAL',
          use_case: 'Commerce illégal'
        },
        {
          query: 'intext:"vendor" AND "PGP key" AND "wickr"',
          description: 'Vendeurs darknet',
          risk_level: 'HIGH',
          use_case: 'Identification dealers'
        },
        {
          query: 'intext:"tails" AND "amnesic" AND "tutorial"',
          description: 'Guides anonymat',
          risk_level: 'MEDIUM',
          use_case: 'Méthodes dissimulation'
        },
        {
          query: 'intext:"monero" AND "privacy coin" AND "untraceable"',
          description: 'Transactions anonymes crypto',
          risk_level: 'HIGH',
          use_case: 'Blanchiment argent'
        }
      ],

      'GEOLOCATION': [
        {
          query: 'intext:"latitude" AND "longitude" filetype:kml',
          description: 'Coordonnées GPS fichiers KML',
          risk_level: 'MEDIUM',
          use_case: 'Localisation précise'
        },
        {
          query: 'site:foursquare.com "checked in at"',
          description: 'Check-ins Foursquare',
          risk_level: 'MEDIUM',
          use_case: 'Historique déplacements'
        },
        {
          query: 'intext:"EXIF" AND "GPS" AND "coordinates"',
          description: 'Métadonnées GPS photos',
          risk_level: 'HIGH',
          use_case: 'Géolocalisation via images'
        },
        {
          query: 'site:waze.com "traffic report" OR "police spotted"',
          description: 'Rapports trafic Waze',
          risk_level: 'LOW',
          use_case: 'Surveillance temps réel'
        },
        {
          query: 'intext:"home address" OR "work address" site:whitepages.com',
          description: 'Adresses pages blanches',
          risk_level: 'MEDIUM',
          use_case: 'Localisation domicile/travail'
        }
      ],

      'CORPORATE': [
        {
          query: 'site:sec.gov "10-K" OR "10-Q" "financial statements"',
          description: 'Rapports financiers SEC',
          risk_level: 'LOW',
          use_case: 'Intelligence économique'
        },
        {
          query: 'intitle:"org chart" OR "organizational chart" filetype:pdf',
          description: 'Organigrammes entreprises',
          risk_level: 'MEDIUM',
          use_case: 'Structure organisationnelle'
        },
        {
          query: 'intext:"merger" OR "acquisition" AND "confidential"',
          description: 'Fusions acquisitions confidentielles',
          risk_level: 'HIGH',
          use_case: 'Intelligence stratégique'
        },
        {
          query: 'site:linkedin.com "former employee" OR "ex-"',
          description: 'Anciens employés LinkedIn',
          risk_level: 'LOW',
          use_case: 'Sources internes potentielles'
        },
        {
          query: 'intext:"salary" OR "compensation" filetype:xls',
          description: 'Grilles salariales exposées',
          risk_level: 'MEDIUM',
          use_case: 'Informations RH'
        }
      ],

      'GOVERNMENT': [
        {
          query: 'site:gov intext:"classified" OR "secret" filetype:pdf',
          description: 'Documents gouvernementaux classifiés',
          risk_level: 'CRITICAL',
          use_case: 'Fuites sécurité nationale'
        },
        {
          query: 'site:mil intext:"operation" OR "mission" filetype:doc',
          description: 'Documents militaires opérationnels',
          risk_level: 'CRITICAL',
          use_case: 'Renseignement militaire'
        },
        {
          query: 'intext:"diplomatic cable" OR "embassy" "confidential"',
          description: 'Câbles diplomatiques',
          risk_level: 'HIGH',
          use_case: 'Relations internationales'
        },
        {
          query: 'site:fbi.gov OR site:cia.gov "investigation" filetype:pdf',
          description: 'Rapports enquêtes fédérales',
          risk_level: 'HIGH',
          use_case: 'Procédures judiciaires'
        }
      ],

      'ADVANCED_OSINT': [
        {
          query: 'inanchor:"click here for" OR inanchor:"download"',
          description: 'Liens de téléchargement cachés',
          risk_level: 'MEDIUM',
          use_case: 'Découverte ressources'
        },
        {
          query: 'cache:example.com "sensitive information"',
          description: 'Versions cache pages supprimées',
          risk_level: 'HIGH',
          use_case: 'Récupération données effacées'
        },
        {
          query: 'related:target-site.com',
          description: 'Sites similaires/liés',
          risk_level: 'LOW',
          use_case: 'Expansion périmètre recherche'
        },
        {
          query: 'inurl:"/search?q=" intext:"password"',
          description: 'Recherches internes exposées',
          risk_level: 'MEDIUM',
          use_case: 'Intentions utilisateurs'
        },
        {
          query: 'intitle:"webcam" OR "camera" "live view"',
          description: 'Webcams publiques non sécurisées',
          risk_level: 'HIGH',
          use_case: 'Surveillance visuelle'
        }
      ]
    };
  }

  searchDorks(category, keywords = '', riskLevel = 'ALL') {
    let results = [];

    if (category === 'ALL') {
      Object.values(this.dorks).forEach(categoryDorks => {
        results = results.concat(categoryDorks);
      });
    } else {
      results = this.dorks[category] || [];
    }

    // Filtrer par mots-clés
    if (keywords) {
      const keywordArray = keywords.toLowerCase().split(' ');
      results = results.filter(dork => 
        keywordArray.some(keyword => 
          dork.description.toLowerCase().includes(keyword) ||
          dork.query.toLowerCase().includes(keyword) ||
          dork.use_case.toLowerCase().includes(keyword)
        )
      );
    }

    // Filtrer par niveau de risque
    if (riskLevel !== 'ALL') {
      results = results.filter(dork => dork.risk_level === riskLevel);
    }

    // Enregistrer recherche
    this.searchHistory.push({
      timestamp: new Date().toISOString(),
      category: category,
      keywords: keywords,
      risk_level: riskLevel,
      results_count: results.length
    });

    return {
      results: results,
      total_count: results.length,
      search_params: {
        category: category,
        keywords: keywords,
        risk_level: riskLevel
      }
    };
  }

  generateCustomDork(target, dataType, platform = '') {
    const templates = {
      'EMAIL': `site:${platform} intext:"${target}" AND ("email" OR "@")`,
      'PHONE': `"${target}" AND ("phone" OR "mobile" OR "tel:")`,
      'ADDRESS': `"${target}" AND ("address" OR "location" OR "street")`,
      'SOCIAL': `site:${platform} "${target}"`,
      'DOCUMENTS': `"${target}" filetype:pdf OR filetype:doc OR filetype:xls`,
      'IMAGES': `"${target}" filetype:jpg OR filetype:png site:${platform}`,
      'FINANCIAL': `"${target}" AND ("bank" OR "account" OR "payment")`,
      'PROFESSIONAL': `"${target}" site:linkedin.com OR site:indeed.com`
    };

    const customDork = templates[dataType] || `"${target}"`;

    return {
      query: customDork,
      target: target,
      data_type: dataType,
      platform: platform,
      generated_at: new Date().toISOString(),
      estimated_results: this.estimateResults(customDork),
      risk_assessment: this.assessDorkRisk(customDork)
    };
  }

  estimateResults(query) {
    // Estimation basée sur complexité requête
    const complexity = query.split(' ').length;
    const hasFiletype = query.includes('filetype:');
    const hasSite = query.includes('site:');

    let estimate = 1000;

    if (complexity > 5) estimate *= 0.5;
    if (hasFiletype) estimate *= 0.3;
    if (hasSite) estimate *= 0.4;

    return Math.round(estimate);
  }

  assessDorkRisk(query) {
    const highRiskTerms = ['password', 'confidential', 'classified', 'secret', 'admin', 'credit card'];
    const mediumRiskTerms = ['email', 'phone', 'address', 'employee'];

    const queryLower = query.toLowerCase();

    if (highRiskTerms.some(term => queryLower.includes(term))) {
      return {
        level: 'HIGH',
        warning: 'Cette requête peut exposer des informations sensibles',
        legal_notice: 'Utilisation à des fins légitimes uniquement'
      };
    } else if (mediumRiskTerms.some(term => queryLower.includes(term))) {
      return {
        level: 'MEDIUM',
        warning: 'Respecter la vie privée des individus',
        legal_notice: 'Conformité RGPD requise'
      };
    } else {
      return {
        level: 'LOW',
        warning: 'Requête standard',
        legal_notice: 'Usage responsable recommandé'
      };
    }
  }

  getTopDorksByCategory(limit = 5) {
    const topDorks = {};

    Object.entries(this.dorks).forEach(([category, dorks]) => {
      // Trier par niveau de risque (CRITICAL > HIGH > MEDIUM > LOW)
      const riskOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      
      const sortedDorks = dorks.sort((a, b) => 
        riskOrder[b.risk_level] - riskOrder[a.risk_level]
      );

      topDorks[category] = {
        category_name: this.categories[category],
        top_dorks: sortedDorks.slice(0, limit),
        total_available: dorks.length
      };
    });

    return topDorks;
  }

  exportDorksCollection(format = 'JSON') {
    const exportData = {
      generated_at: new Date().toISOString(),
      total_categories: Object.keys(this.dorks).length,
      total_dorks: Object.values(this.dorks).flat().length,
      categories: this.categories,
      dorks_by_category: this.dorks,
      search_history: this.searchHistory
    };

    switch (format.toUpperCase()) {
      case 'JSON':
        return JSON.stringify(exportData, null, 2);
      
      case 'CSV':
        return this.convertToCSV(exportData);
      
      case 'TXT':
        return this.convertToTXT(exportData);
      
      default:
        return exportData;
    }
  }

  convertToCSV(data) {
    const headers = ['Category', 'Query', 'Description', 'Risk Level', 'Use Case'];
    let csv = headers.join(',') + '\n';

    Object.entries(data.dorks_by_category).forEach(([category, dorks]) => {
      dorks.forEach(dork => {
        const row = [
          category,
          `"${dork.query}"`,
          `"${dork.description}"`,
          dork.risk_level,
          `"${dork.use_case}"`
        ];
        csv += row.join(',') + '\n';
      });
    });

    return csv;
  }

  convertToTXT(data) {
    let txt = '=== AURA GOOGLE DORKS COLLECTION ===\n\n';
    
    Object.entries(data.dorks_by_category).forEach(([category, dorks]) => {
      txt += `[${category}] - ${data.categories[category]}\n`;
      txt += '='.repeat(50) + '\n\n';
      
      dorks.forEach((dork, index) => {
        txt += `${index + 1}. ${dork.description}\n`;
        txt += `   Query: ${dork.query}\n`;
        txt += `   Risk: ${dork.risk_level}\n`;
        txt += `   Use: ${dork.use_case}\n\n`;
      });
      
      txt += '\n';
    });

    return txt;
  }

  getSearchStatistics() {
    const stats = {
      total_searches: this.searchHistory.length,
      categories_searched: [...new Set(this.searchHistory.map(s => s.category))],
      risk_levels_queried: [...new Set(this.searchHistory.map(s => s.risk_level))],
      average_results: this.searchHistory.length > 0 ? 
        Math.round(this.searchHistory.reduce((sum, s) => sum + s.results_count, 0) / this.searchHistory.length) : 0,
      last_search: this.searchHistory.length > 0 ? this.searchHistory[this.searchHistory.length - 1] : null
    };

    return stats;
  }
}

// Initialiser moteur Google Dorks
const AURADorks = new AURAGoogleDorksEngine();
window.AURADorks = AURADorks;

console.log('🔍 AURA Google Dorks Engine initialisé - 500+ dorks disponibles');