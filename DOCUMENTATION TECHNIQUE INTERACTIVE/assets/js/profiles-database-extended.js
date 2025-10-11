/**
 * 🌍 AURA PROFILES DATABASE - EXTENSION INTERNATIONALE
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

  /**
   * 🏭 Génère profils internationaux complexes
   */
  generateInternationalProfiles() {
    console.log('🌍 Génération de 170 profils internationaux complexes...');

    let profileId = 201; // Continue après les 200 premiers

    Object.entries(this.internationalCategories).forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        const profile = this.generateComplexProfile(profileId, category);
        this.profiles.push(profile);
        profileId++;
      }
    });

    console.log(`✅ ${this.profiles.length} profils totaux (incluant internationaux)`);
  }

  /**
   * 🧬 Génère profil complexe avec contradictions
   */
  generateComplexProfile(id, category) {
    const baseProfile = this.generateProfile(id, category);
    
    // Override avec données spécifiques par catégorie
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

  /**
   * 🎯 Données spécialisées par catégorie
   */
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
            mixing_services_used: true,
            tumbler_addresses: 8
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
        organization_role: 'Regional coordinator',
        violent_history: false,
        armed: 'Possibly',
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
        background: `${firstname} a quitté le Maroc en 2021 en disant à sa famille qu'elle travaillerait comme femme de ménage dans une famille saoudienne aisée. L'investigation OSINT révèle des incohérences majeures.`
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
              'Snapchat: Four Seasons pool party, 11:30 PM',
              'TikTok: Dancing in upscale lounge, 01:15 AM'
            ]
          },
          {
            type: 'FINANCIAL_DISCREPANCY',
            severity: 'HIGH',
            description: 'Remittances too high for domestic worker salary',
            expected_salary: '$400-600/month (standard domestic worker)',
            actual_remittances: '$2,500-4,000/month',
            luxury_purchases: [
              'Louis Vuitton bag ($3,200) - Instagram post',
              'iPhone 14 Pro Max ($1,400) - delivery receipt',
              'Gucci sunglasses ($680) - tagged photo'
            ]
          }
        ],

        risk_assessment: {
          exploitation_likelihood: 'VERY HIGH',
          indicators: [
            'Debt bondage suspected (passport possibly confiscated)',
            'Psychological coercion evident',
            'Economic dependency established',
            'No freedom of movement (always accompanied)',
            'Trapped by visa sponsorship system (Kafala)'
          ],
          trafficking_score: '8.7/10',
          intervention_urgency: 'IMMEDIATE'
        }
      },

      investigation_flags: {
        case_type: 'HUMAN_TRAFFICKING_SUSPECTED',
        victim_status: 'LIKELY',
        urgency: 'CRITICAL',
        legal_complications: 'Kafala system constraints',
        diplomatic_sensitivity: 'HIGH (Morocco-Saudi relations)',
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
        occupation: this.randomChoice(['IT Professional', 'Teacher', 'Youth Coach', 'Photographer', 'Social Worker']),
        background: `${firstname} maintains a respectable public facade but OSINT investigation reveals deeply disturbing patterns of child exploitation material consumption and distribution.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'US'),

        CRITICAL_WARNINGS: {
          content_type: 'CHILD_SEXUAL_ABUSE_MATERIAL (CSAM)',
          threat_level: 'EXTREME',
          immediate_action: 'LAW_ENFORCEMENT_NOTIFICATION_REQUIRED',
          legal_note: 'All evidence secured for federal prosecution'
        },

        dark_web_activity: {
          onion_addresses_visited: [
            this.randomString(16, 'abcdefghijklmnopqrstuvwxyz234567') + '.onion (CSAM forum)',
            this.randomString(16, 'abcdefghijklmnopqrstuvwxyz234567') + '.onion (Trading platform)'
          ],

          cryptocurrency_trail: [
            {
              wallet: 'bc1q' + this.randomString(38, 'abcdefghijklmnopqrstuvwxyz0123456789'),
              purpose: 'Subscription payments to CSAM sites',
              transactions: [
                { date: '2023-11-15', amount: '0.015 BTC (~$520)', recipient: 'Known CSAM platform' },
                { date: '2023-12-03', amount: '0.022 BTC (~$760)', recipient: 'Private collection access' }
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
            estimated_charges: [
              'Possession of CSAM (federal)',
              'Distribution of CSAM (federal)',
              'Using interstate commerce to facilitate (federal)'
            ],
            estimated_sentence: '15-30 years federal prison'
          }
        }
      },

      investigation_flags: {
        case_type: 'CHILD_EXPLOITATION_CSAM',
        priority: 'CRITICAL - CRIMES_AGAINST_CHILDREN',
        threat_to_PUBLIC: 'EXTREME',
        flight_risk: 'HIGH (strong OPSEC suggests awareness)',
        international_coordination: 'REQUIRED (dark web spans multiple jurisdictions)'
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
        background: `${firstname} présente des signes de radicalisation progressive détectés via OSINT. Activité en ligne suggère sympathies extrémistes et potentiel passage à l'acte.`
      },

      osint_footprint: {
        ...this.generateBaseOSINT(firstname, lastname, 'FR'),

        radicalization_timeline: [
          {
            date: '2022-03-15',
            stage: 'Initial Exposure',
            activity: 'Began following extremist preachers on YouTube',
            accounts: ['Abu Waleed Media', 'Anwar al-Awlaki lectures (archived)'],
            notes: 'Content consumption 2-3 hours daily'
          },
          {
            date: '2023-06-05',
            stage: 'Operational Planning',
            activity: 'Research on weapons, explosives, targets',
            searches: [
              'How to make TATP explosive',
              'Crowded places in [city]',
              'Security camera blind spots',
              'Pressure cooker bomb guide'
            ]
          }
        ],

        threat_assessment: {
          attack_probability: 'HIGH (85%)',
          timeline_estimate: 'Imminent (2-4 weeks)',
          target_type: 'Soft target - mass casualty event',
          likely_locations: [
            'Christmas market (surveilled 3x)',
            'Train station during rush hour',
            'Shopping mall weekend'
          ],
          weapon_preference: 'IMPROVISED_EXPLOSIVE (IED)',
          suicide_likelihood: 'VERY HIGH (martyrdom glorification evident)'
        }
      },

      investigation_flags: {
        case_type: 'TERRORISM_RADICALIZATION',
        priority: 'CRITICAL_NATIONAL_SECURITY',
        threat_level: 'IMMINENT',
        public_danger: 'EXTREME',
        international_coordination: 'EU Counter-Terrorism Center, Interpol',
        media_blackout: 'ENFORCED (operational security)'
      }
    };
  }

  /**
   * 🧰 Méthodes auxiliaires pour génération de données complexes
   */

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
        agencies: ['DEA', 'Interpol', 'Local Drug Unit'],
        estimated_value: `$${this.randomInt(1, 100)}M annually`
      },
      CHILD_PREDATOR: {
        priority: 'CRITICAL',
        type: 'CRIMES_AGAINST_CHILDREN',
        agencies: ['FBI', 'NCMEC', 'Local SVU'],
        threat_level: 'EXTREME'
      },
      TERRORIST_SUSPECT: {
        priority: 'CRITICAL',
        type: 'NATIONAL_SECURITY',
        agencies: ['FBI', 'DHS', 'CIA', 'NSA'],
        imminent_threat: true
      }
    };

    return flagTemplates[category] || {
      priority: 'MEDIUM',
      type: 'STANDARD_INVESTIGATION',
      agencies: ['Local PD']
    };
  }

  generateBehavioralAnalysis(category) {
    return {
      risk_level: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      psychological_profile: `Detailed analysis pending forensic psychology evaluation`,
      patterns: this.generateBehavioralPatterns(category),
      predictive_indicators: this.generatePredictiveIndicators(category)
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
        evidence: 'Flight records and Instagram geotagging show 8 countries visited',
        confidence: '100%'
      }
    ];
  }

  generateEvidenceTimeline(category) {
    const events = [];
    for (let i = 0; i < this.randomInt(5, 15); i++) {
      events.push({
        date: this.getRandomPastDate(3),
        event_type: this.randomChoice(['OSINT_DISCOVERY', 'SURVEILLANCE', 'FINANCIAL_TRANSACTION', 'COMMUNICATION_INTERCEPT']),
        description: 'Evidence logged and catalogued',
        source: this.randomChoice(['Social Media', 'Financial Records', 'Communication Metadata', 'Surveillance']),
        chain_of_custody: 'Secured'
      });
    }
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  generateGeographicFootprint(category) {
    return {
      primary_location: this.getRandomCity(),
      frequent_locations: this.randomChoices([
        'Dubai', 'Istanbul', 'Amsterdam', 'Bangkok', 'Mexico City',
        'Casablanca', 'Marbella', 'London', 'Paris', 'Berlin'
      ], 2, 5),
      travel_frequency: this.randomChoice(['Weekly', 'Monthly', 'Quarterly']),
      red_flag_destinations: this.randomChoices(['North Korea', 'Syria', 'Afghanistan', 'Somalia'], 0, 2)
    };
  }

  generateDigitalArtifacts(category) {
    return {
      recovered_files: this.randomInt(50, 5000),
      encrypted_volumes: this.randomInt(0, 5),
      deleted_data_recovery: `${this.randomInt(10, 80)}% successful`,
      forensic_tools_used: ['EnCase', 'FTK', 'Autopsy', 'Volatility'],
      hash_matches: this.randomInt(0, 100)
    };
  }

  generateRiskIndicators(category) {
    return {
      violent_history: Math.random() > 0.7,
      weapon_access: Math.random() > 0.6,
      mental_health_concerns: Math.random() > 0.5,
      flight_risk: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']),
      public_danger: this.randomChoice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      rehabilitation_potential: this.randomChoice(['HIGH', 'MEDIUM', 'LOW', 'NONE'])
    };
  }

  generateBehavioralPatterns(category) {
    return [
      'Pattern 1: Increased online activity during late night hours',
      'Pattern 2: Use of multiple devices and VPNs',
      'Pattern 3: Regular communication with known associates',
      'Pattern 4: Financial transactions incompatible with stated income'
    ];
  }

  generatePredictiveIndicators(category) {
    return [
      'Escalation risk: ' + this.randomChoice(['LOW', 'MEDIUM', 'HIGH']),
      'Recidivism probability: ' + this.randomInt(10, 90) + '%',
      'Intervention urgency: ' + this.randomChoice(['ROUTINE', 'ELEVATED', 'URGENT', 'IMMEDIATE'])
    ];
  }

  // Générateurs pour autres catégories (versions simplifiées)
  generateFinancialFraudsterData() {
    return {
      fraud_type: this.randomChoice(['Investment scam', 'Ponzi scheme', 'Romance scam', 'BEC']),
      estimated_victims: this.randomInt(50, 5000),
      total_fraud_value: `$${this.randomInt(100, 50000)}K`
    };
  }

  generateMoneyLaundererData() {
    return {
      laundering_methods: ['Shell companies', 'Crypto mixers', 'Cash businesses', 'Real estate'],
      volume_processed: `$${this.randomInt(1, 100)}M annually`,
      banking_jurisdictions: this.randomChoices(['Cayman Islands', 'Panama', 'Cyprus', 'Malta'], 2, 4)
    };
  }

  generateDarkWebVendorData() {
    return {
      marketplace_presence: ['AlphaBay', 'White House Market', 'Monopoly Market'],
      products_sold: this.randomChoices(['Drugs', 'Stolen data', 'Counterfeit documents', 'Hacking tools'], 1, 3),
      vendor_rating: (Math.random() * 5).toFixed(2) + '/5',
      transaction_volume: this.randomInt(500, 10000) + ' sales'
    };
  }

  generateUndercoverData() {
    return {
      cover_identity: 'CLASSIFIED',
      operation_name: 'Operation ' + this.randomChoice(['Phoenix', 'Shadow', 'Guardian', 'Sentinel']),
      agency: this.randomChoice(['FBI', 'DEA', 'ATF', 'CIA', 'DHS']),
      target_organization: 'REDACTED'
    };
  }

  generateCorruptOfficialData() {
    return {
      position: this.randomChoice(['Mayor', 'Police Chief', 'Judge', 'Customs Official', 'Procurement Officer']),
      bribery_evidence: `$${this.randomInt(50, 5000)}K in suspicious transactions`,
      offshore_accounts: this.randomInt(1, 5),
      assets_unexplained: 'Properties, vehicles inconsistent with salary'
    };
  }

  generateOrganizedCrimeData() {
    return {
      organization: this.randomChoice(['Cartel', 'Mafia', 'Triad', 'Yakuza', 'Gang']),
      role: this.randomChoice(['Boss', 'Lieutenant', 'Enforcer', 'Money manager', 'Recruiter']),
      criminal_activities: this.randomChoices(['Drug trafficking', 'Human trafficking', 'Extortion', 'Money laundering'], 2, 4),
      estimated_net_worth: `$${this.randomInt(1, 50)}M`
    };
  }

  generateScamVictimData() {
    return {
      scam_type: this.randomChoice(['Romance scam', 'Investment fraud', 'Tech support scam', 'Grandparent scam']),
      amount_lost: `$${this.randomInt(5, 500)}K`,
      psychological_state: 'Vulnerable, requires support services',
      recovery_chances: this.randomChoice(['Low', 'Medium', 'High']) + ' - funds traced to ' + this.randomChoice(['cryptocurrency', 'offshore accounts', 'gift cards'])
    };
  }

  generateMissingPersonData() {
    return {
      missing_since: this.getRandomPastDate(5),
      last_known_location: this.getRandomCity(),
      circumstances: this.randomChoice(['Voluntary disappearance', 'Abduction suspected', 'Accident/amnesia', 'Foul play suspected']),
      case_status: this.randomChoice(['Active investigation', 'Cold case', 'Recent lead']),
      digital_trail: 'Last online activity: ' + this.getRandomPastDate(5)
    };
  }

  generateWitnessProtectionData() {
    return {
      program: 'WITSEC',
      threat_level: 'EXTREME',
      new_identity: 'CLASSIFIED',
      restrictions: ['No contact with former associates', 'No social media', 'Monitored communications'],
      relocation_history: this.randomInt(1, 5) + ' relocations'
    };
  }

  generateFugitiveData() {
    return {
      wanted_for: this.randomChoices(['Murder', 'Armed robbery', 'Drug trafficking', 'Fraud'], 1, 3),
      warrant_status: 'Active',
      bail_jumping: Math.random() > 0.5,
      last_sighting: this.getRandomRecentDate(90),
      believed_location: this.randomChoice(['Mexico', 'Brazil', 'Thailand', 'Philippines', 'Unknown']),
      reward_amount: `$${this.randomInt(10, 500)}K`
    };
  }

  generateHumanTraffickerData() {
    return {
      trafficking_type: this.randomChoice(['Sex trafficking', 'Labor trafficking', 'Child trafficking', 'Organ trafficking']),
      estimated_victims: this.randomInt(10, 200),
      operation_scale: this.randomChoice(['Local', 'Regional', 'International']),
      recruitment_methods: this.randomChoices(['False job offers', 'Romance scams', 'Debt bondage', 'Family coercion'], 1, 3)
    };
  }
}

// Initialiser la base de données étendue
const AURAProfilesExtended = new AURAProfilesDBExtended();

// Exposer globalement
window.AURAProfiles = AURAProfilesExtended;

console.log('🌍 AURA Profiles Database EXTENDED initialisée avec', AURAProfilesExtended.profiles.length, 'profils internationaux');