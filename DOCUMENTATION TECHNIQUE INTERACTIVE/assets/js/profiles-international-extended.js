/**
 * 🌍 AURA PROFILES DATABASE - EXTENSION INTERNATIONALE ULTRA-RÉALISTE
 * 200+ profils additionnels couvrant tous les continents
 * Cas d'usage complexes et investigations multi-niveaux
 */

class AURAProfilesDBExtended extends AURAProfilesDB {
  constructor() {
    super();
    
    // Nouvelles catégories internationales
    this.internationalCategories = {
      'NARCOTRAFFICKER': 15,
      'HUMAN_TRAFFICKER': 12,
      'FINANCIAL_FRAUDSTER': 15,
      'CHILD_PREDATOR': 10,
      'TERRORIST_SUSPECT': 8,
      'MONEY_LAUNDERER': 12,
      'DARK_WEB_VENDOR': 15,
      'MIGRANT_WORKER_EXPLOITED': 10,
      'UNDERCOVER_OPERATIVE': 8,
      'CORRUPT_OFFICIAL': 12,
      'ORGANIZED_CRIME': 15,
      'SCAM_VICTIM': 10,
      'MISSING_PERSON': 12,
      'WITNESS_PROTECTION': 6,
      'FUGITIVE': 10
    };

    this.generateInternationalProfiles();
  }

  generateInternationalProfiles() {
    console.log('🌍 Génération de 170 profils internationaux complexes...');

    let profileId = 201;
    Object.entries(this.internationalCategories).forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        const profile = this.generateComplexProfile(profileId, category);
        this.profiles.push(profile);
        profileId++;
      }
    });

    console.log(`✅ ${this.profiles.length} profils totaux (incluant internationaux)`);
  }

  generateComplexProfile(id, category) {
    const baseProfile = this.generateProfile(id, category);
    const specializedData = this.getSpecializedData(category);
    
    return {
      ...baseProfile,
      ...specializedData,
      investigation_flags: this.generateInvestigationFlags(category),
      behavioral_analysis: this.generateBehavioralAnalysis(category),
      contradictions: this.generateContradictions(category),
      evidence_timeline: this.generateEvidenceTimeline(category),
      geographic_footprint: this.generateGeographicFootprint(category),
      digital_artifacts: this.generateDigitalArtifacts(category),
      risk_indicators: this.generateRiskIndicators(category)
    };
  }

  getSpecializedData(category) {
    const dataGenerators = {
      NARCOTRAFFICKER: () => this.generateNarcoTraffickerData(),
      HUMAN_TRAFFICKER: () => this.generateHumanTraffickerData(),
      FINANCIAL_FRAUDSTER: () => this.generateFinancialFraudsterData(),
      CHILD_PREDATOR: () => this.generateChildPredatorData(),
      TERRORIST_SUSPECT: () => this.generateTerroristSuspectData(),
      MONEY_LAUNDERER: () => this.generateMoneyLaundererData(),
      DARK_WEB_VENDOR: () => this.generateDarkWebVendorData(),
      MIGRANT_WORKER_EXPLOITED: () => this.generateMigrantWorkerData(),
      UNDERCOVER_OPERATIVE: () => this.generateUndercoverData(),
      CORRUPT_OFFICIAL: () => this.generateCorruptOfficialData(),
      ORGANIZED_CRIME: () => this.generateOrganizedCrimeData(),
      SCAM_VICTIM: () => this.generateScamVictimData(),
      MISSING_PERSON: () => this.generateMissingPersonData(),
      WITNESS_PROTECTION: () => this.generateWitnessProtectionData(),
      FUGITIVE: () => this.generateFugitiveData()
    };

    return dataGenerators[category]();
  }

  /**
   * 🇲🇦 CAS #1: NARCOTRAFIQUANT MAROCAIN
   */
  generateNarcoTraffickerData() {
    const firstname = this.randomChoice(['Youssef', 'Hassan', 'Karim', 'Mehdi', 'Omar']);
    const lastname = this.randomChoice(['El Mahdi', 'Benali', 'Ziani', 'Amrani', 'Khalil']);

    return {
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(28, 45),
        country: 'MA',
        occupation: 'Import/Export Business Owner',
        real_occupation: 'International Drug Trafficker',
        background: `${firstname} ${lastname} opère un réseau de trafic de haschich entre le Maroc et l'Europe. Façade légale : entreprise d'import-export de tapis et artisanat.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'MA'),
        
        suspicious_activities: [
          {
            type: 'frequent_travel',
            destinations: ['Spain', 'Netherlands', 'Belgium', 'France'],
            frequency: '2-3 times per month',
            red_flags: 'Always travels with large cash amounts, stays less than 48h'
          },
          {
            type: 'financial_anomaly',
            description: 'Deposits exceeding 50,000€/month despite modest business revenues',
            bank_flags: 3,
            currency_exchange_reports: 12
          }
        ],

        known_associates: [
          {
            name: 'Miguel Ángel Ramírez',
            relation: 'Spanish distributor',
            location: 'Algeciras, Spain',
            threat_level: 'HIGH',
            joint_meetings: 47,
            last_contact: this.getRandomRecentDate(7)
          }
        ],

        crypto_wallets: [
          {
            wallet: 'bc1q' + this.randomString(38, 'abcdefghijklmnopqrstuvwxyz0123456789'),
            blockchain: 'Bitcoin',
            total_received: '127.45 BTC (~$3.2M)',
            transaction_count: 243,
            mixing_services_used: true
          }
        ],

        law_enforcement_records: [
          {
            date: '2017-06-12',
            agency: 'Spanish Guardia Civil',
            incident: 'Detained at border with 50kg cannabis',
            outcome: 'Released - insufficient evidence',
            case_number: 'ES-2017-4589'
          }
        ]
      },

      investigation_flags: {
        priority: 'CRITICAL',
        active_warrants: 2,
        interpol_notice: 'Red Notice (pending)',
        agencies_involved: ['DGSN (Morocco)', 'Guardia Civil (Spain)', 'Europol', 'DEA (liaison)'],
        estimated_operation_value: '$50M+ annually',
        flight_risk: 'EXTREME'
      }
    };
  }

  /**
   * 🇸🇦 CAS #2: TRAVAILLEUSE MIGRANTE EXPLOITÉE
   */
  generateMigrantWorkerData() {
    const firstname = this.randomChoice(['Fatima', 'Aisha', 'Khadija', 'Amina', 'Leila']);
    const lastname = this.randomChoice(['Bouzid', 'El Fassi', 'Alaoui', 'Tahiri', 'Benjelloun']);

    return {
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(24, 38),
        country: 'MA',
        current_location: 'Saudi Arabia',
        occupation_declared: 'Domestic worker',
        occupation_suspected: 'Forced entertainment/escort services',
        background: `${firstname} a quitté le Maroc en 2021 pour travailler comme femme de ménage. L'investigation OSINT révèle des incohérences majeures.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'MA'),

        contradictions_detected: [
          {
            type: 'SCHEDULE_MISMATCH',
            severity: 'HIGH',
            description: 'Instagram stories posted at 2-4 AM showing nightclubs, bars',
            family_story: 'Should be sleeping (6am wake-up for work)',
            evidence: [
              'Instagram story: Ritz-Carlton Riyadh bar, 02:47 AM',
              'Snapchat: Four Seasons pool party, 11:30 PM'
            ]
          },
          {
            type: 'FINANCIAL_DISCREPANCY',
            severity: 'HIGH',
            description: 'Remittances too high for domestic worker salary',
            expected_salary: '$400-600/month (standard domestic worker)',
            actual_remittances: '$2,500-4,000/month'
          }
        ],

        digital_footprint_analysis: {
          social_media_behavior: [
            {
              platform: 'Instagram',
              account: `@${firstname.toLowerCase()}_${this.randomInt(10,99)}`,
              followers: this.randomInt(5000, 15000),
              content_type: 'Luxury lifestyle, fashion, nightlife',
              posting_hours: 'Primarily 10 PM - 4 AM',
              red_flags: [
                'Stories deleted within 24h systematically',
                'No family members tagged',
                'Location tags contradict work narrative'
              ]
            }
          ]
        },

        psychological_profile: {
          exploitation_likelihood: 'VERY HIGH',
          trafficking_score: '8.7/10',
          intervention_urgency: 'IMMEDIATE'
        }
      },

      investigation_flags: {
        case_type: 'HUMAN_TRAFFICKING_SUSPECTED',
        victim_status: 'LIKELY',
        urgency: 'CRITICAL',
        legal_complications: 'Kafala system constraints',
        rescue_difficulty: 'EXTREME'
      }
    };
  }

  /**
   * 🔞 CAS #3: PRÉDATEUR PÉDOPHILE
   */
  generateChildPredatorData() {
    const firstname = this.randomChoice(['David', 'Michael', 'Robert', 'James', 'Richard']);
    const lastname = this.randomChoice(['Miller', 'Anderson', 'Thompson', 'Martinez', 'Garcia']);

    return {
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(35, 58),
        country: this.randomChoice(['US', 'GB', 'DE', 'AU', 'CA']),
        occupation: this.randomChoice(['IT Professional', 'Teacher', 'Youth Coach', 'Photographer']),
        background: `${firstname} maintains respectable public facade but OSINT reveals disturbing CSAM patterns.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'US'),

        CRITICAL_WARNINGS: {
          content_type: 'CHILD_SEXUAL_ABUSE_MATERIAL (CSAM)',
          threat_level: 'EXTREME',
          immediate_action: 'LAW_ENFORCEMENT_NOTIFICATION_REQUIRED'
        },

        dark_web_activity: {
          onion_addresses_visited: [
            this.randomString(16, 'abcdefghijklmnopqrstuvwxyz234567') + '.onion (CSAM forum)',
            this.randomString(16, 'abcdefghijklmnopqrstuvwxyz234567') + '.onion (Trading platform)'
          ],

          forums_activity: [
            {
              forum: '[REDACTED - Active Investigation]',
              username: this.randomString(12, 'abcdefghijklmnopqrstuvwxyz0123456789'),
              post_count: this.randomInt(500, 5000),
              reputation: 'Trusted member',
              content_uploaded: `${this.randomInt(100, 500)} files (flagged by NCMEC)`
            }
          ],

          cryptocurrency_trail: [
            {
              wallet: 'bc1q' + this.randomString(38, 'abcdefghijklmnopqrstuvwxyz0123456789'),
              purpose: 'Subscription payments to CSAM sites',
              transactions: [
                { date: '2023-11-15', amount: '0.015 BTC (~$520)', recipient: 'Known CSAM platform' },
                { date: '2024-01-08', amount: '0.018 BTC (~$620)', recipient: 'Live streaming service' }
              ]
            }
          ]
        },

        law_enforcement_coordination: {
          agencies_notified: [
            'FBI - Innocent Images National Initiative',
            'National Center for Missing & Exploited Children (NCMEC)',
            'INTERPOL - Crimes Against Children Unit'
          ],
          case_numbers: [
            'FBI: #2024-CSAM-7841',
            'NCMEC: CyberTipline Report #98234756'
          ],
          prosecution_readiness: {
            status: 'BUILDING CASE',
            estimated_sentence: '15-30 years federal prison'
          }
        }
      },

      investigation_flags: {
        case_type: 'CHILD_EXPLOITATION_CSAM',
        priority: 'CRITICAL - CRIMES_AGAINST_CHILDREN',
        threat_to_PUBLIC: 'EXTREME',
        flight_risk: 'HIGH'
      }
    };
  }

  /**
   * 💣 CAS #4: SUSPECT TERRORISTE
   */
  generateTerroristSuspectData() {
    const firstname = this.randomChoice(['Ibrahim', 'Ali', 'Khaled', 'Mohammed', 'Youssef']);
    const lastname = this.randomChoice(['Al-Rahman', 'Bouazizi', 'El-Masri', 'Khalil', 'Saidi']);

    return {
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(19, 32),
        country: this.randomChoice(['FR', 'BE', 'DE', 'GB', 'SE']),
        occupation: 'Student / Unemployed',
        background: `${firstname} présente signes de radicalisation progressive. Activité suggère sympathies extrémistes et potentiel passage à l'acte.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'FR'),

        radicalization_timeline: [
          {
            date: '2022-03-15',
            stage: 'Initial Exposure',
            activity: 'Began following extremist preachers on YouTube',
            accounts: ['Abu Waleed Media', 'Anwar al-Awlaki lectures (archived)']
          },
          {
            date: '2023-06-05',
            stage: 'Operational Planning',
            activity: 'Research on weapons, explosives, targets',
            searches: [
              'How to make TATP explosive',
              'Crowded places in [city]',
              'Pressure cooker bomb guide'
            ]
          }
        ],

        purchases: [
          {
            date: '2024-01-05',
            items: [
              'Hydrogen peroxide (3 bottles)',
              'Pressure cooker',
              'Ball bearings (200 units)',
              'Alarm clock'
            ],
            assessment: 'Components for TATP explosive + shrapnel device'
          }
        ],

        threat_assessment: {
          attack_probability: 'HIGH (85%)',
          timeline_estimate: 'Imminent (2-4 weeks)',
          target_type: 'Soft target - mass casualty event',
          suicide_likelihood: 'VERY HIGH'
        }
      },

      investigation_flags: {
        case_type: 'TERRORISM_RADICALIZATION',
        priority: 'CRITICAL_NATIONAL_SECURITY',
        threat_level: 'IMMINENT',
        public_danger: 'EXTREME'
      }
    };
  }

  // Méthodes auxiliaires
  generateBaseOSINT(firstname, lastname, country) {
    return {
      phone: this.generatePhoneData(),
      emails: this.generateEmails(firstname, lastname),
      usernames: this.generateUsernames(`${firstname.toLowerCase()}_${this.randomInt(100,999)}`),
      domains: [],
      crypto: [],
      images: [],
      associates: [],
      timeline: []
    };
  }

  generateInvestigationFlags(category) {
    const flagTemplates = {
      NARCOTRAFFICKER: {
        priority: 'HIGH',
        type: 'ORGANIZED_CRIME',
        agencies: ['DEA', 'Interpol', 'Local Drug Unit']
      },
      CHILD_PREDATOR: {
        priority: 'CRITICAL',
        type: 'CRIMES_AGAINST_CHILDREN',
        agencies: ['FBI', 'NCMEC', 'Local SVU']
      },
      TERRORIST_SUSPECT: {
        priority: 'CRITICAL',
        type: 'NATIONAL_SECURITY',
        agencies: ['FBI', 'DHS', 'CIA', 'NSA']
      }
    };

    return flagTemplates[category] || {
      priority: 'MEDIUM',
      type: 'STANDARD_INVESTIGATION'
    };
  }

  generateBehavioralAnalysis(category) {
    return {
      risk_level: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      psychological_profile: 'Detailed analysis pending forensic psychology evaluation',
      patterns: [
        'Increased online activity during late night hours',
        'Use of multiple devices and VPNs',
        'Financial transactions incompatible with stated income'
      ]
    };
  }

  generateContradictions(category) {
    return [
      {
        claimed: 'Works regular office hours',
        evidence: 'Social media activity shows presence at nightclubs 2-4 AM',
        confidence: '92%'
      },
      {
        claimed: 'No international travel',
        evidence: 'Flight records show 8 countries visited',
        confidence: '100%'
      }
    ];
  }

  generateEvidenceTimeline(category) {
    const events = [];
    for (let i = 0; i < this.randomInt(5, 15); i++) {
      events.push({
        date: this.getRandomPastDate(3),
        event_type: this.randomChoice(['OSINT_DISCOVERY', 'SURVEILLANCE', 'FINANCIAL_TRANSACTION']),
        description: 'Evidence logged and catalogued',
        source: this.randomChoice(['Social Media', 'Financial Records', 'Surveillance'])
      });
    }
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  generateGeographicFootprint(category) {
    return {
      primary_location: this.getRandomCity(),
      frequent_locations: this.randomChoices([
        'Dubai', 'Istanbul', 'Amsterdam', 'Bangkok', 'Mexico City'
      ], 2, 5),
      travel_frequency: this.randomChoice(['Weekly', 'Monthly', 'Quarterly'])
    };
  }

  generateDigitalArtifacts(category) {
    return {
      recovered_files: this.randomInt(50, 5000),
      encrypted_volumes: this.randomInt(0, 5),
      deleted_data_recovery: `${this.randomInt(10, 80)}% successful`,
      forensic_tools_used: ['EnCase', 'FTK', 'Autopsy', 'Volatility']
    };
  }

  generateRiskIndicators(category) {
    return {
      violent_history: Math.random() > 0.7,
      weapon_access: Math.random() > 0.6,
      flight_risk: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']),
      public_danger: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    };
  }

  // Générateurs pour autres catégories (versions simplifiées)
  generateFinancialFraudsterData() {
    return {
      fraud_type: this.randomChoice(['Investment scam', 'Ponzi scheme', 'Romance scam']),
      estimated_victims: this.randomInt(50, 5000),
      total_fraud_value: `$${this.randomInt(100, 50000)}K`
    };
  }

  generateMoneyLaundererData() {
    return {
      laundering_methods: ['Shell companies', 'Crypto mixers', 'Cash businesses'],
      volume_processed: `$${this.randomInt(1, 100)}M annually`
    };
  }

  generateDarkWebVendorData() {
    return {
      marketplace_presence: ['AlphaBay', 'White House Market'],
      products_sold: this.randomChoices(['Drugs', 'Stolen data', 'Counterfeit documents'], 1, 3),
      vendor_rating: (Math.random() * 5).toFixed(2) + '/5'
    };
  }

  generateUndercoverData() {
    return {
      cover_identity: 'CLASSIFIED',
      operation_name: 'Operation ' + this.randomChoice(['Phoenix', 'Shadow', 'Guardian']),
      agency: this.randomChoice(['FBI', 'DEA', 'ATF', 'CIA'])
    };
  }

  generateCorruptOfficialData() {
    return {
      position: this.randomChoice(['Mayor', 'Police Chief', 'Judge', 'Customs Official']),
      bribery_evidence: `$${this.randomInt(50, 5000)}K in suspicious transactions`,
      offshore_accounts: this.randomInt(1, 5)
    };
  }

  generateOrganizedCrimeData() {
    return {
      organization: this.randomChoice(['Cartel', 'Mafia', 'Triad', 'Yakuza']),
      role: this.randomChoice(['Boss', 'Lieutenant', 'Enforcer', 'Money manager']),
      criminal_activities: this.randomChoices(['Drug trafficking', 'Human trafficking', 'Extortion'], 2, 4)
    };
  }

  generateScamVictimData() {
    return {
      scam_type: this.randomChoice(['Romance scam', 'Investment fraud', 'Tech support scam']),
      amount_lost: `$${this.randomInt(5, 500)}K`,
      psychological_state: 'Vulnerable, requires support services'
    };
  }

  generateMissingPersonData() {
    return {
      missing_since: this.getRandomPastDate(5),
      last_known_location: this.getRandomCity(),
      circumstances: this.randomChoice(['Voluntary disappearance', 'Abduction suspected', 'Foul play suspected']),
      case_status: this.randomChoice(['Active investigation', 'Cold case', 'Recent lead'])
    };
  }

  generateWitnessProtectionData() {
    return {
      program: 'WITSEC',
      threat_level: 'EXTREME',
      new_identity: 'CLASSIFIED',
      restrictions: ['No contact with former associates', 'No social media']
    };
  }

  generateFugitiveData() {
    return {
      wanted_for: this.randomChoices(['Murder', 'Armed robbery', 'Drug trafficking'], 1, 3),
      warrant_status: 'Active',
      last_sighting: this.getRandomRecentDate(90),
      reward_amount: `$${this.randomInt(10, 500)}K`
    };
  }

  generateHumanTraffickerData() {
    return {
      trafficking_type: this.randomChoice(['Sex trafficking', 'Labor trafficking', 'Organ trafficking']),
      estimated_victims: this.randomInt(10, 200),
      operation_scale: this.randomChoice(['Local', 'Regional', 'International']),
      recruitment_methods: ['False job offers', 'Romance manipulation', 'Debt bondage']
    };
  }

  // Méthodes de recherche avancées
  searchByCategory(category) {
    return this.profiles.filter(p => p.category === category);
  }

  findByPhone(phone) {
    return this.profiles.find(p => 
      p.osint_footprint?.phone?.numbers?.some(n => n.includes(phone))
    );
  }

  searchByThreatLevel(level) {
    return this.profiles.filter(p => 
      p.investigation_flags?.priority === level ||
      p.risk_indicators?.public_danger === level
    );
  }

  getHighRiskProfiles() {
    return this.profiles.filter(p => 
      ['CRITICAL', 'HIGH', 'EXTREME'].includes(p.investigation_flags?.priority) ||
      ['CRITICAL', 'HIGH', 'EXTREME'].includes(p.risk_indicators?.public_danger)
    );
  }
}

// Initialiser la base de données étendue
const AURAProfilesExtended = new AURAProfilesDBExtended();

// Exposer globalement
window.AURAProfiles = AURAProfilesExtended;

console.log('🌍 AURA Profiles Database EXTENDED initialisée avec', AURAProfilesExtended.profiles.length, 'profils internationaux');