/**
 * 🎭 AURA INVESTIGATION SCENARIOS - SCÉNARIOS GUIDÉS ULTRA-RÉALISTES
 * Système de scénarios interactifs pour démonstrations OSINT
 */

class AURAInvestigationScenarios {
  constructor() {
    this.activeScenario = null;
    this.scenarioProgress = {};
    this.discoveryQueue = [];
    
    this.scenarios = {
      'NARCO_MOROCCO': this.createNarcoMoroccoScenario(),
      'TRAFFICKING_SAUDI': this.createTraffickingSaudiScenario(),
      'CSAM_PREDATOR': this.createCSAMPredatorScenario(),
      'TERRORIST_FRANCE': this.createTerroristFranceScenario(),
      'FINANCIAL_FRAUD': this.createFinancialFraudScenario()
    };
  }

  /**
   * 🇲🇦 SCÉNARIO: Narcotrafiquant Marocain
   */
  createNarcoMoroccoScenario() {
    return {
      id: 'NARCO_MOROCCO',
      title: '🇲🇦 Réseau de Narcotrafic Maroc-Europe',
      description: 'Investigation d\'un réseau de trafic de haschich utilisant des façades légales',
      difficulty: 'EXPERT',
      estimated_duration: '45 minutes',
      
      phases: [
        {
          id: 'initial_lead',
          title: 'Piste Initiale',
          description: 'Un numéro de téléphone marocain apparaît dans plusieurs saisies européennes',
          trigger_query: '+212-6-XX-XX-XX-XX',
          discoveries: [
            {
              type: 'PHONE_ANALYSIS',
              delay: 2000,
              content: {
                title: '📱 Analyse Téléphonique',
                data: {
                  number: '+212-661-234-567',
                  operator: 'Maroc Telecom',
                  registration: 'Youssef El Mahdi',
                  location_history: ['Tangier', 'Casablanca', 'Tetouan'],
                  call_patterns: 'Pics d\'activité: 22h-02h (suspect)',
                  international_calls: 'Espagne (47%), Pays-Bas (23%), Belgique (18%)'
                }
              }
            },
            {
              type: 'SOCIAL_MEDIA_HIT',
              delay: 5000,
              content: {
                title: '📸 Découverte Instagram',
                data: {
                  account: '@youssef_business_ma',
                  followers: '12.4K',
                  posts: 'Lifestyle luxueux incompatible avec revenus déclarés',
                  locations: 'Marbella, Dubai, Amsterdam - fréquence suspecte',
                  red_flags: [
                    'Photos avec liasses de billets',
                    'Voitures de luxe (3 différentes)',
                    'Montres Rolex (collection)',
                    'Voyages privés (jet privé)'
                  ]
                }
              }
            }
          ]
        },
        {
          id: 'business_facade',
          title: 'Façade Commerciale',
          description: 'Investigation de l\'entreprise légale utilisée comme couverture',
          discoveries: [
            {
              type: 'BUSINESS_RECORDS',
              delay: 3000,
              content: {
                title: '🏢 Registre du Commerce',
                data: {
                  company: 'Atlas Import Export SARL',
                  activity: 'Import/export tapis et artisanat marocain',
                  revenue_declared: '€180,000/an',
                  employees: '3 (sur papier)',
                  red_flags: [
                    'Chiffre d\'affaires stable malgré crise COVID',
                    'Pas de présence web/e-commerce',
                    'Entrepôt surdimensionné pour l\'activité',
                    'Factures clients européens introuvables'
                  ]
                }
              }
            },
            {
              type: 'FINANCIAL_ANOMALY',
              delay: 6000,
              content: {
                title: '💰 Anomalies Financières',
                data: {
                  bank_deposits: '€50,000-80,000/mois (cash)',
                  currency_exchanges: '12 opérations > €10,000 (6 mois)',
                  crypto_purchases: 'Bitcoin: €340,000 (via Binance)',
                  luxury_purchases: [
                    'Mercedes G-Class: €120,000 (cash)',
                    'Riad Marrakech: €450,000 (cash)',
                    'Appartement Marbella: €380,000 (société écran)'
                  ]
                }
              }
            }
          ]
        },
        {
          id: 'network_mapping',
          title: 'Cartographie du Réseau',
          description: 'Identification des complices et routes de trafic',
          discoveries: [
            {
              type: 'ASSOCIATE_NETWORK',
              delay: 4000,
              content: {
                title: '🕸️ Réseau d\'Associés',
                data: {
                  spanish_connection: {
                    name: 'Miguel Ángel Ramírez',
                    role: 'Distributeur Espagne',
                    location: 'Algeciras',
                    meetings: '47 rencontres documentées',
                    method: 'Cafés, restaurants (contre-surveillance)'
                  },
                  dutch_connection: {
                    name: 'Lars Van der Berg',
                    role: 'Distribution Pays-Bas',
                    location: 'Rotterdam',
                    specialty: 'Containers port',
                    encrypted_comms: 'Signal, Telegram'
                  },
                  logistics: {
                    name: 'Mohammed Aziz',
                    role: 'Coordinateur logistique',
                    location: 'Tangier',
                    assets: 'Flotte de camions, entrepôts'
                  }
                }
              }
            }
          ]
        }
      ],

      evidence_compilation: {
        strength: 'PROSECUTION_READY',
        agencies: ['DGSN Morocco', 'Guardia Civil Spain', 'Europol'],
        estimated_seizure: '€15M assets + 2 tons cannabis',
        charges: [
          'Trafic international de stupéfiants',
          'Blanchiment d\'argent',
          'Association de malfaiteurs',
          'Fraude fiscale'
        ]
      }
    };
  }

  /**
   * 🇸🇦 SCÉNARIO: Trafic Humain Système Kafala
   */
  createTraffickingSaudiScenario() {
    return {
      id: 'TRAFFICKING_SAUDI',
      title: '🇸🇦 Exploitation Travailleuses Migrantes',
      description: 'Cas de trafic humain déguisé en travail domestique',
      difficulty: 'EXPERT',
      sensitivity: 'DIPLOMATIC_IMPLICATIONS',
      
      phases: [
        {
          id: 'family_concern',
          title: 'Inquiétude Familiale',
          description: 'Une famille marocaine s\'inquiète pour leur fille en Arabie Saoudite',
          discoveries: [
            {
              type: 'FAMILY_TESTIMONY',
              delay: 1000,
              content: {
                title: '👨‍👩‍👧 Témoignage Famille',
                data: {
                  missing_person: 'Fatima Bouzid, 26 ans',
                  departure: 'Octobre 2021 - contrat travail domestique',
                  promised_conditions: 'Famille saoudienne, 6j/semaine, 8h-18h',
                  salary_promised: '$500/mois',
                  last_contact: 'Appels hebdomadaires, de plus en plus brefs',
                  concerns: [
                    'Évite questions sur travail quotidien',
                    'Semble fatiguée, stressée',
                    'Envoie beaucoup d\'argent (suspect)',
                    'Refuse visite famille'
                  ]
                }
              }
            }
          ]
        },
        {
          id: 'digital_investigation',
          title: 'Investigation Numérique',
          description: 'Analyse des traces numériques révèle des contradictions',
          discoveries: [
            {
              type: 'SOCIAL_MEDIA_ANALYSIS',
              delay: 3000,
              content: {
                title: '📱 Analyse Réseaux Sociaux',
                data: {
                  instagram_account: '@fatima_riyadh_26',
                  posting_schedule: '68% activité entre 22h-04h',
                  content_analysis: [
                    'Bars, clubs, hôtels de luxe',
                    'Vêtements coûteux (Gucci, LV)',
                    'Alcool visible (47 photos/vidéos)',
                    'Hommes non-identifiés (groupes)'
                  ],
                  location_data: [
                    'Ritz-Carlton Riyadh (23 visites)',
                    'Four Seasons (18 visites)',
                    'Quartier diplomatique (fréquent)',
                    'Villas privées (15 adresses différentes)'
                  ]
                }
              }
            },
            {
              type: 'FINANCIAL_DISCREPANCY',
              delay: 6000,
              content: {
                title: '💸 Incohérences Financières',
                data: {
                  declared_salary: '$500/mois',
                  actual_remittances: '$2,800/mois (moyenne)',
                  luxury_purchases: [
                    'Sac Louis Vuitton: $3,200',
                    'iPhone 14 Pro Max: $1,400',
                    'Bijoux: $2,800 (estimé)'
                  ],
                  crypto_transactions: '34.7 ETH reçus (18 mois)',
                  source_analysis: 'Portefeuilles multiples, anonymes'
                }
              }
            }
          ]
        },
        {
          id: 'trafficking_evidence',
          title: 'Preuves de Trafic',
          description: 'Éléments confirmant l\'exploitation et le trafic humain',
          discoveries: [
            {
              type: 'HANDLER_NETWORK',
              delay: 4000,
              content: {
                title: '🕷️ Réseau d\'Exploitation',
                data: {
                  coordinator: {
                    name: 'Layla K. (Libanaise)',
                    role: 'Coordinatrice principale',
                    contact_frequency: '3-5 appels/jour',
                    other_victims: '12 profils similaires identifiés'
                  },
                  security: {
                    name: 'Ahmad M. (Syrien)',
                    role: 'Transport/surveillance',
                    pattern: 'Accompagne toujours les déplacements'
                  },
                  clients: {
                    pattern: 'Numéros saoudiens différents',
                    duration: 'Appels courts (2-5 min)',
                    assessment: 'Système de réservations'
                  }
                }
              }
            }
          ]
        }
      ],

      rescue_plan: {
        complexity: 'EXTREME',
        obstacles: [
          'Système Kafala (parrainage obligatoire)',
          'Passeport confisqué (probable)',
          'Surveillance constante',
          'Implications diplomatiques Maroc-Arabie'
        ],
        recommended_approach: [
          'Contact Consulat marocain Riyadh',
          'Coordination ONG anti-trafic',
          'Intervention discrète services sociaux',
          'Préparation psychologique post-rescue'
        ]
      }
    };
  }

  /**
   * 🔞 SCÉNARIO: Prédateur CSAM
   */
  createCSAMPredatorScenario() {
    return {
      id: 'CSAM_PREDATOR',
      title: '🔞 Prédateur Pédophile - Matériel CSAM',
      description: 'Investigation d\'un réseau de distribution de matériel d\'abus d\'enfants',
      difficulty: 'EXPERT',
      sensitivity: 'CRIMES_AGAINST_CHILDREN',
      
      WARNING: {
        content_type: 'CHILD_SEXUAL_ABUSE_MATERIAL',
        legal_requirement: 'IMMEDIATE_LAW_ENFORCEMENT_NOTIFICATION',
        psychological_impact: 'INVESTIGATOR_SUPPORT_RECOMMENDED'
      },

      phases: [
        {
          id: 'initial_detection',
          title: 'Détection Initiale',
          description: 'Signalement NCMEC déclenche investigation',
          discoveries: [
            {
              type: 'NCMEC_REPORT',
              delay: 2000,
              content: {
                title: '🚨 Rapport NCMEC',
                data: {
                  report_id: 'CyberTipline #98234756',
                  source: 'Google (cloud storage scan)',
                  content_detected: '[REDACTED - CSAM Material]',
                  account: 'david.miller.photo@gmail.com',
                  ip_address: '192.168.1.105 (residential)',
                  timestamp: '2024-01-15 03:42:17 UTC',
                  hash_matches: '47 known CSAM files'
                }
              }
            }
          ]
        },
        {
          id: 'digital_forensics',
          title: 'Forensique Numérique',
          description: 'Analyse approfondie des dispositifs et activités',
          discoveries: [
            {
              type: 'DEVICE_ANALYSIS',
              delay: 5000,
              content: {
                title: '💻 Analyse Dispositifs',
                data: {
                  primary_computer: {
                    model: 'Dell Precision 7550',
                    os: 'Windows 10 Pro + Tails (dual boot)',
                    encryption: 'BitLocker + VeraCrypt hidden volumes',
                    findings: [
                      'Partition cachée 500GB (chiffrée)',
                      'Tor Browser (bookmarks .onion)',
                      'Outils stéganographie',
                      'Client P2P (eMule) - hash lists suspects'
                    ]
                  },
                  mobile_device: {
                    model: 'iPhone 12 Pro',
                    findings: [
                      'Signal (messages auto-suppression)',
                      'Telegram (comptes multiples)',
                      'Pas de sauvegarde iCloud',
                      'App Photos désactivée'
                    ]
                  }
                }
              }
            },
            {
              type: 'DARK_WEB_ACTIVITY',
              delay: 8000,
              content: {
                title: '🕸️ Activité Dark Web',
                data: {
                  forums_frequented: [
                    '[REDACTED - Active Investigation]',
                    'Username: ' + this.generateRandomString(12),
                    'Reputation: Trusted Member',
                    'Content uploaded: 347 files',
                    'Role: Moderator candidate'
                  ],
                  cryptocurrency_payments: [
                    'Bitcoin wallet: bc1q...',
                    'Subscriptions CSAM sites: $2,340',
                    'Private collections: $1,890',
                    'Live streaming: $620'
                  ]
                }
              }
            }
          ]
        }
      ],

      law_enforcement_action: {
        agencies_coordinated: [
          'FBI Innocent Images',
          'NCMEC',
          'INTERPOL Crimes Against Children',
          'Local Police SVU'
        ],
        evidence_secured: [
          'Full disk forensic images',
          'Network traffic captures',
          'Financial transaction records',
          'Victim identification (ongoing)'
        ],
        charges_prepared: [
          'Possession CSAM (federal)',
          'Distribution CSAM (federal)',
          'Using interstate commerce (federal)'
        ],
        estimated_sentence: '15-30 years federal prison'
      }
    };
  }

  /**
   * 💣 SCÉNARIO: Suspect Terroriste
   */
  createTerroristFranceScenario() {
    return {
      id: 'TERRORIST_FRANCE',
      title: '💣 Radicalisation et Préparation d\'Attentat',
      description: 'Surveillance d\'un individu radicalisé préparant un attentat',
      difficulty: 'CRITICAL',
      sensitivity: 'NATIONAL_SECURITY',
      
      phases: [
        {
          id: 'radicalization_detection',
          title: 'Détection Radicalisation',
          description: 'Signalement algorithmes surveillance préventive',
          discoveries: [
            {
              type: 'ALGORITHM_ALERT',
              delay: 1500,
              content: {
                title: '🤖 Alerte Algorithmique',
                data: {
                  subject: 'Ibrahim Al-Rahman, 24 ans',
                  trigger_keywords: [
                    'Recherches: "TATP explosive"',
                    'Téléchargements: "Al-Qaeda manual"',
                    'Vidéos: "Martyrdom operations"'
                  ],
                  risk_score: '8.7/10 (CRITIQUE)',
                  timeline: 'Escalation sur 18 mois',
                  recommendation: 'SURVEILLANCE_IMMEDIATE'
                }
              }
            }
          ]
        },
        {
          id: 'operational_preparation',
          title: 'Préparation Opérationnelle',
          description: 'Preuves de préparation d\'attentat imminent',
          discoveries: [
            {
              type: 'PURCHASE_ANALYSIS',
              delay: 4000,
              content: {
                title: '🛒 Achats Suspects',
                data: {
                  chemicals: [
                    'Peroxyde d\'hydrogène (3 bouteilles)',
                    'Acétone (2 litres)',
                    'Acide sulfurique (1 litre)'
                  ],
                  equipment: [
                    'Cocotte-minute',
                    'Billes d\'acier (200 unités)',
                    'Réveil électronique',
                    'Batterie externe'
                  ],
                  assessment: 'Composants bombe TATP + shrapnel',
                  urgency: 'INTERVENTION_IMMEDIATE'
                }
              }
            },
            {
              type: 'TARGET_RECONNAISSANCE',
              delay: 7000,
              content: {
                title: '🎯 Reconnaissance Cibles',
                data: {
                  locations_surveilled: [
                    'Marché de Noël (3 visites)',
                    'Gare centrale (heures de pointe)',
                    'Centre commercial (weekend)',
                    'Stade (événement sportif)'
                  ],
                  evidence_collected: [
                    'Photos angles multiples',
                    'Vidéos entrées/sorties',
                    'Chronométrage sécurité',
                    'Points aveugles caméras'
                  ],
                  threat_assessment: 'ATTAQUE_IMMINENTE'
                }
              }
            }
          ]
        }
      ],

      intervention_protocol: {
        status: 'RAID_AUTHORIZED',
        timing: 'PREEMPTIVE_ARREST',
        coordination: [
          'RAID (Recherche Assistance Intervention Dissuasion)',
          'Démineurs',
          'DGSI',
          'Parquet antiterroriste'
        ],
        public_safety: 'EVACUATION_READY',
        media_blackout: 'ENFORCED'
      }
    };
  }

  /**
   * 💰 SCÉNARIO: Fraude Financière
   */
  createFinancialFraudScenario() {
    return {
      id: 'FINANCIAL_FRAUD',
      title: '💰 Fraude Financière Multi-Millions',
      description: 'Schéma Ponzi international avec cryptomonnaies',
      difficulty: 'ADVANCED',
      
      phases: [
        {
          id: 'investor_complaints',
          title: 'Plaintes Investisseurs',
          description: 'Accumulation de plaintes pour investissements perdus',
          discoveries: [
            {
              type: 'COMPLAINT_ANALYSIS',
              delay: 2000,
              content: {
                title: '📋 Analyse Plaintes',
                data: {
                  total_complaints: 247,
                  estimated_losses: '$12.4M',
                  common_pattern: 'Promesses rendements 25%/mois',
                  recruitment_method: 'Réseaux sociaux + bouche-à-oreille',
                  payment_stops: 'Novembre 2023 (arrêt brutal)'
                }
              }
            }
          ]
        }
      ]
    };
  }

  // Méthodes de gestion des scénarios
  launchScenario(scenarioId, chatInterface) {
    this.activeScenario = this.scenarios[scenarioId];
    this.scenarioProgress[scenarioId] = {
      currentPhase: 0,
      discoveryIndex: 0,
      startTime: Date.now(),
      discoveries: []
    };

    chatInterface.displayScenarioIntro(this.activeScenario);
    this.processNextDiscovery(chatInterface);
  }

  processNextDiscovery(chatInterface) {
    if (!this.activeScenario) return;

    const progress = this.scenarioProgress[this.activeScenario.id];
    const currentPhase = this.activeScenario.phases[progress.currentPhase];
    
    if (!currentPhase || progress.discoveryIndex >= currentPhase.discoveries.length) {
      this.advanceToNextPhase(chatInterface);
      return;
    }

    const discovery = currentPhase.discoveries[progress.discoveryIndex];
    
    setTimeout(() => {
      chatInterface.displayDiscovery(discovery);
      progress.discoveries.push(discovery);
      progress.discoveryIndex++;
      
      // Auto-continue ou attendre interaction utilisateur
      if (discovery.auto_continue !== false) {
        setTimeout(() => this.processNextDiscovery(chatInterface), discovery.delay || 3000);
      }
    }, discovery.delay || 1000);
  }

  advanceToNextPhase(chatInterface) {
    const progress = this.scenarioProgress[this.activeScenario.id];
    progress.currentPhase++;
    progress.discoveryIndex = 0;

    if (progress.currentPhase >= this.activeScenario.phases.length) {
      this.completeScenario(chatInterface);
      return;
    }

    const nextPhase = this.activeScenario.phases[progress.currentPhase];
    chatInterface.displayPhaseTransition(nextPhase);
    
    setTimeout(() => this.processNextDiscovery(chatInterface), 2000);
  }

  completeScenario(chatInterface) {
    const progress = this.scenarioProgress[this.activeScenario.id];
    progress.completedAt = Date.now();
    progress.duration = progress.completedAt - progress.startTime;

    chatInterface.displayScenarioCompletion(this.activeScenario, progress);
    this.activeScenario = null;
  }

  // Utilitaires
  generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Méthodes de recherche et déclenchement
  detectScenarioTrigger(query) {
    const triggers = {
      'NARCO_MOROCCO': ['+212', 'maroc', 'morocco', 'haschich', 'cannabis'],
      'TRAFFICKING_SAUDI': ['arabie', 'saudi', 'kafala', 'domestique', 'exploitation'],
      'CSAM_PREDATOR': ['csam', 'child', 'enfant', 'predator', 'pédophile'],
      'TERRORIST_FRANCE': ['terroriste', 'terrorist', 'attentat', 'radicalisation'],
      'FINANCIAL_FRAUD': ['ponzi', 'fraude', 'fraud', 'investissement', 'crypto']
    };

    const queryLower = query.toLowerCase();
    
    for (const [scenarioId, keywords] of Object.entries(triggers)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return scenarioId;
      }
    }
    
    return null;
  }

  getAvailableScenarios() {
    return Object.values(this.scenarios).map(scenario => ({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      difficulty: scenario.difficulty,
      duration: scenario.estimated_duration
    }));
  }
}

// Initialiser le système de scénarios
const AURAScenarios = new AURAInvestigationScenarios();

// Exposer globalement
window.AURAScenarios = AURAScenarios;

console.log('🎭 AURA Investigation Scenarios initialisé avec', Object.keys(AURAScenarios.scenarios).length, 'scénarios');