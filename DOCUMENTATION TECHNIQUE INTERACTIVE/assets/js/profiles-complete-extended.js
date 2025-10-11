/**
 * 🌍 AURA PROFILES COMPLETE EXTENDED - 15 CATÉGORIES ADDITIONNELLES
 * Profils ultra-réalistes avec métadonnées forensiques complètes
 */

class AURAProfilesCompleteExtended extends AURAProfilesDBExtended {
  constructor() {
    super();
    
    this.additionalCategories = {
      'CHILD_SOLDIER_REHABILITATED': 8,
      'CULT_MEMBER': 10,
      'DEEPFAKE_CREATOR': 12,
      'ELECTION_MANIPULATOR': 10,
      'ENVIRONMENTAL_ACTIVIST': 12,
      'FAKE_NEWS_SPREADER': 15,
      'GHOST_BROKER': 10,
      'HACKER_FOR_HIRE': 15,
      'IDENTITY_THIEF': 15,
      'JOURNALISTS_UNDER_THREAT': 10,
      'KINGPIN_SUCCESSOR': 8,
      'LOAN_SHARK': 12,
      'MERCENARY': 10,
      'NUCLEAR_SCIENTIST_ROGUE': 6,
      'ORGAN_TRAFFICKER': 8
    };

    this.generateAdditionalProfiles();
  }

  generateAdditionalProfiles() {
    console.log('🔥 Génération des 15 catégories restantes...');

    let profileId = this.profiles.length + 1;

    Object.entries(this.additionalCategories).forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        const profile = this.generateSpecializedProfile(profileId, category);
        this.profiles.push(profile);
        profileId++;
      }
    });

    console.log(`✅ ${this.profiles.length} profils totaux générés`);
  }

  generateSpecializedProfile(id, category) {
    const generators = {
      'CHILD_SOLDIER_REHABILITATED': () => this.genChildSoldier(),
      'CULT_MEMBER': () => this.genCultMember(),
      'DEEPFAKE_CREATOR': () => this.genDeepfakeCreator(),
      'ELECTION_MANIPULATOR': () => this.genElectionManipulator(),
      'ENVIRONMENTAL_ACTIVIST': () => this.genEnvironmentalActivist(),
      'FAKE_NEWS_SPREADER': () => this.genFakeNewsSpreader(),
      'GHOST_BROKER': () => this.genGhostBroker(),
      'HACKER_FOR_HIRE': () => this.genHackerForHire(),
      'IDENTITY_THIEF': () => this.genIdentityThief(),
      'JOURNALISTS_UNDER_THREAT': () => this.genJournalistThreat(),
      'KINGPIN_SUCCESSOR': () => this.genKingpinSuccessor(),
      'LOAN_SHARK': () => this.genLoanShark(),
      'MERCENARY': () => this.genMercenary(),
      'NUCLEAR_SCIENTIST_ROGUE': () => this.genNuclearScientist(),
      'ORGAN_TRAFFICKER': () => this.genOrganTrafficker()
    };

    const baseProfile = this.generateProfile(id, category);
    const specializedData = generators[category]();

    return {
      ...baseProfile,
      ...specializedData,
      category: category,
      complexity_score: this.calculateComplexity(specializedData),
      investigation_timeline: this.generateInvestigationTimeline(category),
      evidence_chain: this.generateEvidenceChain(category),
      cross_references: this.generateCrossReferences()
    };
  }

  genChildSoldier() {
    const firstname = this.randomChoice(['Emmanuel', 'Ismail', 'Kofi', 'Abdi', 'Joseph']);
    const lastname = this.randomChoice(['Kamara', 'Osman', 'Mensah', 'Hassan', 'Lubanga']);
    
    return {
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(18, 28),
        country: this.randomChoice(['SL', 'UG', 'CD', 'SS', 'CF']),
        current_location: this.randomChoice(['Refugee camp', 'Rehabilitation center', 'Urban slum']),
        former_affiliation: this.randomChoice(['LRA', 'RUF', 'M23 rebels', 'Boko Haram']),
        background: `Former child soldier, abducted at age ${this.randomInt(8, 14)}, currently in rehabilitation program`
      },
      trauma_profile: {
        ptsd_severity: this.randomChoice(['Moderate', 'Severe', 'Extreme']),
        therapy_sessions: this.randomInt(20, 200),
        triggers: ['Loud noises', 'Authority figures', 'Night time'],
        rehabilitation_progress: this.randomChoice(['Poor', 'Fair', 'Good'])
      },
      risk_assessment: {
        recidivism_risk: this.randomChoice(['Low', 'Medium', 'High']),
        re_recruitment_vulnerability: this.randomChoice(['Medium', 'High', 'Critical'])
      }
    };
  }

  genCultMember() {
    const firstname = this.randomChoice(['Sarah', 'David', 'Rebecca', 'Joshua', 'Rachel']);
    
    return {
      metadata: {
        firstname: firstname,
        lastname: this.randomChoice(['Miller', 'Schmidt', 'Thompson', 'Anderson']),
        age: this.randomInt(22, 55),
        cult_name: this.randomChoice(['Eternal Light Fellowship', 'Ascension Divine Order', 'New Eden Covenant']),
        years_involved: this.randomInt(1, 15)
      },
      cult_profile: {
        organization_type: this.randomChoice(['Apocalyptic', 'UFO-based', 'Pseudo-Christian']),
        control_level: this.randomChoice(['High', 'Extreme', 'Total']),
        assets_surrendered: '$' + this.randomInt(10, 500) + 'K',
        family_contact: this.randomChoice(['None', 'Supervised', 'Severed'])
      },
      exit_barriers: {
        psychological: ['Phobia indoctrination', 'Identity erosion', 'Fear of damnation'],
        practical: ['No money', 'No job skills', 'Nowhere to go'],
        deprogramming_difficulty: this.randomChoice(['Moderate', 'High', 'Extreme'])
      }
    };
  }

  genDeepfakeCreator() {
    const username = this.randomString(8) + this.randomInt(100, 999);
    
    return {
      metadata: {
        firstname: this.randomChoice(['Alex', 'Jordan', 'Casey', 'Morgan']),
        lastname: this.randomChoice(['Chen', 'Patel', 'Kim', 'Rodriguez']),
        age: this.randomInt(22, 38),
        technical_skills: 'Advanced - ML/AI, Video editing, Python, GANs'
      },
      deepfake_operation: {
        specialization: this.randomChoice(['Celebrity pornography', 'Political disinformation', 'Financial fraud']),
        total_created: this.randomInt(50, 500) + ' deepfakes',
        quality_level: '95%+ realism',
        revenue: '$' + this.randomInt(50, 500) + 'K annual'
      },
      victims: {
        celebrity_count: this.randomInt(20, 100),
        private_individuals: this.randomInt(50, 300),
        legal_actions: this.randomInt(5, 20) + ' DMCA notices'
      },
      legal_status: {
        fbi_investigation: 'Active',
        charges_pending: ['Wire fraud', 'Computer fraud', 'Identity theft'],
        potential_sentence: '20-50 years'
      }
    };
  }

  genElectionManipulator() {
    return {
      metadata: {
        firstname: this.randomChoice(['Marcus', 'Elena', 'Viktor', 'Sophia']),
        lastname: this.randomChoice(['Volkov', 'Martinez', 'Petrov', 'Singh']),
        age: this.randomInt(28, 45)
      },
      operation_type: this.randomChoice(['Bot farm', 'Micro-targeting', 'Voter suppression']),
      scale: this.randomInt(100, 10000) + 'K voters reached',
      clients: this.randomChoice(['Political party', 'Foreign government', 'PAC']),
      techniques: ['Fake news sites', 'Social media bots', 'Data mining'],
      evidence_trail: 'Digital footprint extensive, attribution difficult'
    };
  }

  genEnvironmentalActivist() {
    return {
      metadata: {
        firstname: this.randomChoice(['Luna', 'River', 'Forest', 'Sage']),
        lastname: this.randomChoice(['Green', 'Wild', 'Stone', 'Earth']),
        age: this.randomInt(20, 40)
      },
      organization: this.randomChoice(['Extinction Rebellion', 'Earth First!', 'Sea Shepherd']),
      tactics: this.randomChoice(['Civil disobedience', 'Property destruction', 'Legal protests']),
      targets: ['Logging companies', 'Oil pipelines', 'Factory farms'],
      legal_status: this.randomChoice(['Clean record', 'Multiple arrests', 'Wanted fugitive']),
      risk_level: this.randomChoice(['LOW', 'MEDIUM', 'HIGH'])
    };
  }

  genFakeNewsSpreader() {
    return {
      metadata: {
        firstname: this.randomChoice(['Brad', 'Tiffany', 'Kyle', 'Madison']),
        lastname: this.randomChoice(['Jones', 'Smith', 'Brown', 'Wilson']),
        age: this.randomInt(25, 50)
      },
      motivation: this.randomChoice(['Political', 'Financial', 'Ideological', 'Chaos']),
      reach: this.randomInt(100, 10000) + 'K followers',
      content_types: ['Fabricated news', 'Doctored images', 'Misleading videos'],
      platforms: ['Facebook', 'Twitter/X', 'YouTube', 'Telegram'],
      fact_check_violations: this.randomInt(10, 500) + ' articles debunked'
    };
  }

  genGhostBroker() {
    return {
      metadata: {
        firstname: this.randomChoice(['Mike', 'Tony', 'Frank', 'Eddie']),
        lastname: this.randomChoice(['Romano', 'Castellano', 'Gotti', 'Luciano']),
        age: this.randomInt(30, 50)
      },
      specialty: 'Fraudulent freight brokering',
      modus_operandi: ['Creates fake companies', 'Diverts shipments', 'Disappears with goods'],
      stolen_goods_value: '$' + this.randomInt(500, 5000) + 'K',
      victims: this.randomInt(20, 200) + ' companies',
      fake_identities: this.randomInt(5, 30) + ' company names'
    };
  }

  genHackerForHire() {
    return {
      metadata: {
        firstname: this.randomChoice(['Neo', 'Trinity', 'Morpheus', 'Cipher']),
        lastname: this.randomChoice(['Matrix', 'Code', 'Binary', 'Hack']),
        age: this.randomInt(18, 35)
      },
      services_offered: ['Corporate espionage', 'Account hacking', 'DDoS attacks', 'Ransomware'],
      skill_level: this.randomChoice(['Script kiddie', 'Intermediate', 'Advanced', 'Elite']),
      pricing: {
        'Email hack': '$' + this.randomInt(100, 500),
        'Corporate breach': '$' + this.randomInt(5, 50) + 'K'
      },
      attribution_difficulty: this.randomChoice(['Easy', 'Moderate', 'Difficult', 'Nearly impossible'])
    };
  }

  genIdentityThief() {
    return {
      metadata: {
        firstname: this.randomChoice(['John', 'Jane', 'Bob', 'Alice']),
        lastname: this.randomChoice(['Doe', 'Smith', 'Anonymous', 'Unknown']),
        age: this.randomInt(25, 45)
      },
      victim_count: this.randomInt(50, 5000) + ' identities stolen',
      data_sources: ['Phishing campaigns', 'Dark web purchases', 'Database breaches'],
      uses: ['Credit card fraud', 'Tax refund theft', 'Loan applications'],
      sophistication: this.randomChoice(['Low', 'Medium', 'High', 'Professional']),
      detection_rate: this.randomInt(10, 50) + '% discovered'
    };
  }

  genJournalistThreat() {
    return {
      metadata: {
        firstname: this.randomChoice(['Maria', 'Ahmed', 'Anna', 'Carlos']),
        lastname: this.randomChoice(['Gonzalez', 'Hassan', 'Petrov', 'Silva']),
        age: this.randomInt(28, 50)
      },
      specialization: this.randomChoice(['Investigative journalism', 'War correspondence', 'Corruption exposés']),
      threats_received: this.randomInt(10, 500) + ' credible threats',
      threat_sources: ['Government officials', 'Criminal organizations', 'Corporations'],
      security_measures: ['Encrypted communications', 'Bodyguards', 'Safe houses'],
      risk_assessment: this.randomChoice(['MEDIUM', 'HIGH', 'CRITICAL'])
    };
  }

  genKingpinSuccessor() {
    return {
      metadata: {
        firstname: this.randomChoice(['Carlos', 'Miguel', 'Eduardo', 'Rafael']),
        lastname: this.randomChoice(['Escobar', 'Guzman', 'Ochoa', 'Rodriguez']),
        age: this.randomInt(25, 40)
      },
      cartel: this.randomChoice(['Sinaloa', 'CJNG', 'Gulf Cartel', 'Zetas']),
      predecessor: 'Father/Uncle - Killed/Arrested',
      territory: this.randomChoice(['Northern Mexico', 'Colombia', 'Central America']),
      product: this.randomChoice(['Cocaine', 'Methamphetamine', 'Heroin', 'Fentanyl']),
      wealth_estimate: '$' + this.randomInt(100, 5000) + 'M',
      threat_level: 'CRITICAL - International priority target'
    };
  }

  genLoanShark() {
    return {
      metadata: {
        firstname: this.randomChoice(['Vinny', 'Sal', 'Tony', 'Rocco']),
        lastname: this.randomChoice(['Torrino', 'Marconi', 'Benedetto', 'Ricci']),
        age: this.randomInt(35, 60)
      },
      operation_area: this.getRandomCity(),
      loan_portfolio: '$' + this.randomInt(100, 5000) + 'K outstanding',
      interest_rates: this.randomInt(20, 300) + '% annually',
      client_base: this.randomChoice(['Gambling addicts', 'Small businesses', 'Desperate individuals']),
      collection_methods: ['Verbal threats', 'Property seizure', 'Physical violence'],
      organized_crime_ties: this.randomChoice(['Mafia', 'Gang', 'Independent'])
    };
  }

  genMercenary() {
    return {
      metadata: {
        firstname: this.randomChoice(['Jack', 'Wolf', 'Viper', 'Hawk']),
        lastname: this.randomChoice(['Steel', 'Iron', 'Stone', 'Sharp']),
        age: this.randomInt(28, 50)
      },
      company: this.randomChoice(['Wagner Group', 'Blackwater', 'G4S', 'Independent']),
      specialty: this.randomChoice(['Close protection', 'Combat operations', 'Training']),
      conflict_zones: ['Syria', 'Yemen', 'Libya', 'Ukraine'],
      kill_count: this.randomInt(5, 50) + ' confirmed',
      legal_status: this.randomChoice(['Legal contractor', 'War crimes allegations']),
      psych_profile: 'PTSD, emotional numbing, hypervigilance'
    };
  }

  genNuclearScientist() {
    return {
      metadata: {
        firstname: this.randomChoice(['Dr. Ivan', 'Dr. Yuki', 'Dr. Hassan', 'Dr. Klaus']),
        lastname: this.randomChoice(['Petrov', 'Tanaka', 'Al-Rashid', 'Mueller']),
        age: this.randomInt(40, 65)
      },
      expertise: this.randomChoice(['Enrichment technology', 'Warhead design', 'Reactor physics']),
      former_employer: this.randomChoice(['Government nuclear program', 'National lab', 'University']),
      proliferation_risk: 'EXTREME',
      interested_parties: ['North Korea', 'Iran', 'Terrorist organizations'],
      monitoring: 'NSA/CIA/IAEA joint surveillance - 24/7',
      intervention_status: this.randomChoice(['Asset recruitment', 'Travel ban', 'Pending arrest'])
    };
  }

  genOrganTrafficker() {
    return {
      metadata: {
        firstname: this.randomChoice(['Viktor', 'Dmitri', 'Aleksandr', 'Sergei']),
        lastname: this.randomChoice(['Kozlov', 'Volkov', 'Petrov', 'Smirnov']),
        age: this.randomInt(35, 55)
      },
      operation: {
        type: this.randomChoice(['Harvesting from vulnerable', 'Black market transplants', 'Medical tourism fraud']),
        regions: ['India', 'China', 'Philippines', 'Egypt'],
        organs_traded: ['Kidneys', 'Livers', 'Corneas']
      },
      victim_profile: ['Refugees', 'Homeless', 'Debt-trapped individuals'],
      pricing: {
        'Kidney': '$' + this.randomInt(50, 200) + 'K',
        'Liver': '$' + this.randomInt(100, 500) + 'K'
      },
      victim_count: this.randomInt(20, 500) + ' estimated',
      legal_status: 'International warrant - Interpol Red Notice'
    };
  }

  calculateComplexity(profileData) {
    let score = 0;
    if (profileData.digital_footprint) score += 20;
    if (profileData.international_operations) score += 15;
    if (profileData.legal_challenges) score += 10;
    if (profileData.technical_sophistication) score += 20;
    return Math.min(score + Math.random() * 50, 100);
  }

  generateInvestigationTimeline(category) {
    const events = [];
    for (let i = 0; i < this.randomInt(5, 15); i++) {
      events.push({
        date: this.getRandomPastDate(this.randomInt(1, 5)),
        milestone: this.randomChoice(['Intelligence gathered', 'Surveillance initiated', 'Warrant executed']),
        agency: this.randomChoice(['FBI', 'DEA', 'ICE', 'Interpol'])
      });
    }
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  generateEvidenceChain(category) {
    const evidence = [];
    for (let i = 0; i < this.randomInt(5, 20); i++) {
      evidence.push({
        id: 'EVID-' + String(i + 1).padStart(4, '0'),
        type: this.randomChoice(['DIGITAL', 'PHYSICAL', 'TESTIMONIAL', 'FINANCIAL']),
        date_collected: this.getRandomPastDate(3),
        admissibility: this.randomChoice(['Admissible', 'Pending', 'Challenged'])
      });
    }
    return evidence;
  }

  generateCrossReferences() {
    const refs = [];
    for (let i = 0; i < this.randomInt(3, 10); i++) {
      refs.push({
        profile_id: 'PROF_' + String(this.randomInt(1, 500)).padStart(3, '0'),
        relationship: this.randomChoice(['Associate', 'Family member', 'Co-conspirator']),
        confidence: this.randomInt(50, 100) + '%'
      });
    }
    return refs;
  }
}

// Initialisation
const AURACompleteExtended = new AURAProfilesCompleteExtended();
window.AURAProfilesComplete = AURACompleteExtended;

console.log('✅ AURA Profiles Complete Extended:', AURACompleteExtended.profiles.length, 'profils');