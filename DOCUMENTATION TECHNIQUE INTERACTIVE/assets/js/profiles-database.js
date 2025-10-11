/**
 * 👥 AURA PROFILES DATABASE
 * Base de données factice de 200 profils OSINT réalistes
 */

class AURAProfilesDB {
  constructor() {
    this.profiles = [];
    this.categories = {
      'ACTIVIST': 20,
      'CORPORATE': 20,
      'CYBERCRIMINAL': 20,
      'INFLUENCER': 20,
      'POLITICIAN': 20,
      'ACADEMIC': 20,
      'MILITARY': 20,
      'ARTIST': 20,
      'GHOST': 20,
      'AVERAGE_CITIZEN': 20
    };
    
    this.generateAllProfiles();
  }

  /**
   * 🏭 Génère tous les profils
   */
  generateAllProfiles() {
    console.log('🏭 Génération de 200 profils OSINT...');
    
    let profileId = 1;
    
    Object.entries(this.categories).forEach(([category, count]) => {
      for (let i = 0; i < count; i++) {
        const profile = this.generateProfile(profileId, category);
        this.profiles.push(profile);
        profileId++;
      }
    });
    
    console.log(`✅ ${this.profiles.length} profils générés avec succès`);
  }

  /**
   * 🧬 Génère un profil individuel
   */
  generateProfile(id, category) {
    const firstname = this.getRandomFirstName();
    const lastname = this.getRandomLastName();
    const username = `${firstname.toLowerCase()}_${this.randomInt(100, 9999)}`;
    
    return {
      id: `PROF_${String(id).padStart(3, '0')}`,
      category: category,
      realism_score: this.randomInt(75, 100),
      complexity_level: this.randomChoice(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
      
      metadata: {
        firstname: firstname,
        lastname: lastname,
        age: this.randomInt(18, 75),
        country: this.getRandomCountry(),
        occupation: this.getOccupationByCategory(category),
        background: this.generateBackground(category, firstname)
      },
      
      osint_footprint: {
        phone: this.generatePhoneData(),
        emails: this.generateEmails(firstname, lastname),
        usernames: this.generateUsernames(username),
        domains: Math.random() > 0.7 ? [this.generateDomain(username)] : [],
        crypto: Math.random() > 0.8 ? [this.generateCryptoWallet()] : [],
        images: this.generateImages(id),
        associates: this.generateAssociates(),
        timeline: this.generateTimeline(),
        threat_level: this.randomChoice(['LOW', 'MEDIUM', 'HIGH']),
        investigation_notes: this.generateInvestigationNotes(category)
      }
    };
  }

  /**
   * 📱 Génère données téléphone
   */
  generatePhoneData() {
    const countryCode = this.randomChoice(['+1', '+33', '+44', '+49', '+7', '+86', '+91', '+81', '+39', '+34']);
    const carriers = ['Vodafone', 'Orange', 'T-Mobile', 'AT&T', 'Verizon', 'SFR', 'Bouygues', 'Free'];
    
    return {
      number: `${countryCode}-${this.randomInt(100, 999)}-${this.randomInt(100, 999)}-${this.randomInt(1000, 9999)}`,
      carrier: this.randomChoice(carriers) + ' Telecom',
      line_type: this.randomChoice(['Mobile', 'Landline', 'VoIP']),
      last_seen_location: `${this.getRandomCity()}, ${this.getRandomCountry()}`,
      registered_since: this.getRandomPastDate(10),
      linked_accounts: this.randomChoices(['WhatsApp', 'Telegram', 'Signal', 'Viber', 'WeChat'], 1, 3)
    };
  }

  /**
   * 📧 Génère emails
   */
  generateEmails(firstname, lastname) {
    const domains = ['gmail.com', 'yahoo.com', 'protonmail.com', 'outlook.com', 'icloud.com', 'tutanota.com'];
    const breaches = ['LinkedIn (2021)', 'Adobe (2013)', 'Collection #1 (2019)', 'Gravatar (2020)', 'Dropbox (2012)'];
    
    const emailVariations = [
      `${firstname.toLowerCase()}.${lastname.toLowerCase()}`,
      `${firstname.toLowerCase()}${lastname.toLowerCase()}`,
      `${firstname.toLowerCase()}_${lastname.toLowerCase()}`,
      `${firstname.toLowerCase()}${this.randomInt(10, 99)}`
    ];
    
    return [{
      address: `${this.randomChoice(emailVariations)}@${this.randomChoice(domains)}`,
      breaches: Math.random() > 0.6 ? this.randomChoices(breaches, 0, 3) : [],
      first_seen: this.getRandomPastDate(15),
      disposable: Math.random() < 0.1,
      reputation_score: this.randomInt(60, 100)
    }];
  }

  /**
   * 👤 Génère présence réseaux sociaux
   */
  generateUsernames(baseUsername) {
    const platforms = [
      { name: 'Twitter', hasFollowers: true, icon: 'twitter' },
      { name: 'Instagram', hasFollowers: true, icon: 'instagram' },
      { name: 'GitHub', hasFollowers: false, icon: 'github' },
      { name: 'LinkedIn', hasFollowers: true, icon: 'linkedin' },
      { name: 'Reddit', hasFollowers: false, icon: 'reddit' },
      { name: 'TikTok', hasFollowers: true, icon: 'tiktok' },
      { name: 'YouTube', hasFollowers: true, icon: 'youtube' },
      { name: 'Facebook', hasFollowers: true, icon: 'facebook' },
      { name: 'Discord', hasFollowers: false, icon: 'discord' },
      { name: 'Twitch', hasFollowers: true, icon: 'twitch' }
    ];
    
    const selectedPlatforms = this.randomChoices(platforms, 3, 7);
    
    return [{
      username: baseUsername,
      platforms: selectedPlatforms.map(platform => ({
        name: platform.name,
        url: `https://${platform.name.toLowerCase()}.com/${baseUsername}`,
        followers: platform.hasFollowers ? this.randomInt(50, 100000) : null,
        verified: Math.random() > 0.95,
        last_activity: this.getRandomRecentDate(30),
        bio: this.generateSocialBio(),
        profile_photo_url: `/avatars/${baseUsername}_${platform.name.toLowerCase()}.jpg`,
        posts_count: this.randomInt(10, 5000),
        engagement_rate: Math.random() * 10
      }))
    }];
  }

  /**
   * 🌐 Génère données domaine
   */
  generateDomain(username) {
    const tlds = ['com', 'org', 'net', 'io', 'co', 'me', 'info'];
    const registrars = ['GoDaddy', 'Namecheap', 'Njalla', 'Cloudflare', 'OVH'];
    const hostings = ['AWS', 'Cloudflare', 'Heroku', 'DigitalOcean', 'Netlify'];
    
    return {
      domain: `${username}.${this.randomChoice(tlds)}`,
      registered: this.getRandomPastDate(5),
      registrar: this.randomChoice(registrars),
      hosting: this.randomChoice(hostings),
      ssl_issuer: this.randomChoice(['Let\'s Encrypt', 'DigiCert', 'Comodo']),
      risk_score: this.randomChoice(['LOW', 'MEDIUM', 'HIGH']),
      whois_privacy: Math.random() > 0.5,
      dns_records: this.generateDNSRecords()
    };
  }

  /**
   * 💰 Génère wallet crypto
   */
  generateCryptoWallet() {
    const blockchains = ['Bitcoin', 'Ethereum', 'Litecoin', 'Monero', 'Dogecoin'];
    const blockchain = this.randomChoice(blockchains);
    
    let wallet;
    switch (blockchain) {
      case 'Bitcoin':
        wallet = `bc1q${this.randomString(38, 'abcdefghijklmnopqrstuvwxyz0123456789')}`;
        break;
      case 'Ethereum':
        wallet = `0x${this.randomString(40, '0123456789abcdef')}`;
        break;
      default:
        wallet = this.randomString(34, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    }
    
    return {
      wallet: wallet,
      blockchain: blockchain,
      total_received: `${(Math.random() * 10).toFixed(2)} ${blockchain === 'Bitcoin' ? 'BTC' : 'ETH'}`,
      transaction_count: this.randomInt(1, 500),
      first_transaction: this.getRandomPastDate(5),
      last_transaction: this.getRandomRecentDate(30),
      risk_level: this.randomChoice(['LOW', 'MEDIUM', 'HIGH'])
    };
  }

  /**
   * 🖼️ Génère metadata images
   */
  generateImages(profileId) {
    if (Math.random() > 0.7) {
      const cameras = ['iPhone 14 Pro', 'Canon EOS R5', 'Sony A7III', 'Pixel 7', 'Samsung Galaxy S23'];
      
      return [{
        url: `/profiles/prof_${profileId}_photo.jpg`,
        exif: {
          camera: this.randomChoice(cameras),
          gps: `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`,
          timestamp: this.getRandomPastDate(2),
          resolution: this.randomChoice(['1920x1080', '4032x3024', '3840x2160'])
        },
        reverse_search_results: [
          `Found on: ${this.randomChoices(['twitter.com', 'instagram.com', 'facebook.com', 'linkedin.com'], 1, 3).join(', ')}`
        ],
        face_recognition: Math.random() > 0.8 ? {
          confidence: Math.random() * 100,
          matches: this.randomInt(0, 5)
        } : null
      }];
    }
    return [];
  }

  /**
   * 👥 Génère réseau d'associés
   */
  generateAssociates() {
    const count = this.randomInt(0, 5);
    const associates = [];
    const relations = [
      'Co-worker', 'Family member', 'Frequent contact', 
      'Mentioned in emails', 'Tagged in photos', 'Business partner',
      'Friend', 'Colleague', 'Neighbor'
    ];
    
    for (let i = 0; i < count; i++) {
      associates.push({
        name: `${this.getRandomFirstName()} ${this.getRandomLastName()}`,
        relation: this.randomChoice(relations),
        profile_id: `PROF_${String(this.randomInt(1, 200)).padStart(3, '0')}`,
        confidence: Math.random() * 100,
        last_interaction: this.getRandomRecentDate(90)
      });
    }
    
    return associates;
  }

  /**
   * ⏱️ Génère timeline événements
   */
  generateTimeline() {
    const eventTypes = [
      { type: 'account_creation', source: 'Social Media OSINT' },
      { type: 'domain_registration', source: 'WHOIS lookup' },
      { type: 'email_breach', source: 'HaveIBeenPwned' },
      { type: 'social_post', source: 'Social media scraping' },
      { type: 'location_checkin', source: 'Geolocation analysis' },
      { type: 'transaction', source: 'Blockchain analysis' },
      { type: 'news_mention', source: 'News aggregation' },
      { type: 'forum_post', source: 'Forum monitoring' }
    ];
    
    const events = this.randomChoices(eventTypes, 3, 8).map(event => ({
      date: this.getRandomPastDate(10),
      event: this.generateTimelineEvent(event.type),
      source: event.source,
      confidence: Math.random() * 100
    }));
    
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * 📝 Génère notes d'investigation
   */
  generateInvestigationNotes(category) {
    const notes = {
      ACTIVIST: 'Subject demonstrates strong OPSEC practices. Uses encrypted communications and privacy-focused services. No criminal activity detected. Possible surveillance target by authorities.',
      
      CORPORATE: 'Public figure with extensive online presence. Multiple business registrations found. Clean digital footprint with standard corporate activities. Low threat assessment.',
      
      CYBERCRIMINAL: '⚠️ HIGH THREAT - Active on dark web marketplaces. Multiple cryptocurrency addresses detected. Possible connection to ransomware operations. Recommend immediate escalation.',
      
      INFLUENCER: 'High social media presence with significant follower base. Multiple brand partnerships identified. Standard influencer activity patterns. No security concerns detected.',
      
      POLITICIAN: 'Public official with expected digital footprint. Multiple official accounts verified. Standard political communication patterns. Enhanced security protocols recommended.',
      
      ACADEMIC: 'Research-focused digital presence. Multiple academic publications and citations found. University affiliations confirmed. Standard academic activity patterns.',
      
      MILITARY: 'Limited public digital footprint consistent with military background. Security-conscious online behavior. Verified service record. No operational security concerns.',
      
      ARTIST: 'Creative professional with portfolio presence across multiple platforms. Art sales and exhibition history confirmed. Standard creative industry patterns.',
      
      GHOST: 'Minimal digital footprint detected. Exceptional operational security practices. Unable to establish concrete identity verification. Advanced counterintelligence training suspected.',
      
      AVERAGE_CITIZEN: 'Standard civilian digital footprint. Normal social media usage patterns. No particular security concerns or red flags identified. Typical online behavior.'
    };
    
    return notes[category] || 'Standard investigation completed. No particular anomalies detected in subject\'s digital footprint.';
  }

  /**
   * 🔍 Méthodes de recherche
   */
  
  findByPhone(phone) {
    return this.profiles.find(p => p.osint_footprint.phone?.number === phone);
  }
  
  findByEmail(email) {
    return this.profiles.find(p => 
      p.osint_footprint.emails?.some(e => e.address === email)
    );
  }
  
  findByUsername(username) {
    return this.profiles.find(p => 
      p.osint_footprint.usernames?.some(u => u.username === username)
    );
  }
  
  findByDomain(domain) {
    return this.profiles.find(p => 
      p.osint_footprint.domains?.some(d => d.domain === domain)
    );
  }
  
  searchByCategory(category) {
    return this.profiles.filter(p => p.category === category);
  }
  
  searchByThreatLevel(level) {
    return this.profiles.filter(p => p.osint_footprint.threat_level === level);
  }

  /**
   * 🎲 Générateurs de données aléatoires
   */
  
  getRandomFirstName() {
    const names = [
      'Alexander', 'Sophia', 'James', 'Emma', 'Michael', 'Olivia', 'William', 'Ava',
      'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Theodore', 'Amelia',
      'Sebastian', 'Harper', 'Jack', 'Evelyn', 'Owen', 'Abigail', 'Connor', 'Emily',
      'Liam', 'Elizabeth', 'Noah', 'Sofia', 'Oliver', 'Avery', 'Elijah', 'Ella',
      'Dmitri', 'Anastasia', 'Viktor', 'Katarina', 'Alexei', 'Natasha', 'Pavel', 'Irina',
      'Chen', 'Li', 'Wang', 'Zhang', 'Liu', 'Yang', 'Huang', 'Zhao',
      'Mohammed', 'Fatima', 'Ahmed', 'Aisha', 'Omar', 'Zara', 'Hassan', 'Layla'
    ];
    return this.randomChoice(names);
  }
  
  getRandomLastName() {
    const names = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
      'Petrov', 'Volkov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov', 'Lebedev', 'Kozlov',
      'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao',
      'Al-Ahmad', 'Al-Hassan', 'Al-Mohammed', 'Al-Omar', 'Al-Ali', 'Al-Mahmoud',
      'Dubois', 'Martin', 'Bernard', 'Moreau', 'Laurent', 'Lefebvre', 'Roux', 'Fournier'
    ];
    return this.randomChoice(names);
  }
  
  getRandomCountry() {
    const countries = ['US', 'FR', 'DE', 'GB', 'RU', 'CN', 'JP', 'CA', 'AU', 'BR', 'IN', 'IT', 'ES', 'NL', 'SE'];
    return this.randomChoice(countries);
  }
  
  getRandomCity() {
    const cities = [
      'New York', 'London', 'Paris', 'Berlin', 'Moscow', 'Tokyo', 'Sydney', 'Toronto',
      'São Paulo', 'Mumbai', 'Rome', 'Madrid', 'Amsterdam', 'Stockholm', 'Vienna'
    ];
    return this.randomChoice(cities);
  }
  
  getOccupationByCategory(category) {
    const occupations = {
      ACTIVIST: ['Journalist', 'Human rights activist', 'Whistleblower', 'NGO worker', 'Environmental activist'],
      CORPORATE: ['CEO', 'CTO', 'Entrepreneur', 'Consultant', 'Manager', 'Director', 'VP Sales'],
      CYBERCRIMINAL: ['Black hat hacker', 'Scammer', 'Dark web vendor', 'Ransomware operator', 'Identity thief'],
      INFLUENCER: ['YouTuber', 'Streamer', 'Content creator', 'Social media influencer', 'Blogger'],
      POLITICIAN: ['Senator', 'Mayor', 'Diplomat', 'Political advisor', 'Campaign manager'],
      ACADEMIC: ['Professor', 'Researcher', 'PhD student', 'Scientist', 'Lecturer'],
      MILITARY: ['Veteran', 'Private contractor', 'Intelligence analyst', 'Security consultant', 'Former officer'],
      ARTIST: ['Musician', 'Actor', 'Painter', 'Writer', 'Photographer', 'Designer'],
      GHOST: ['Unknown', 'Operative', 'Anonymous figure', 'Shadow identity', 'Classified'],
      AVERAGE_CITIZEN: ['Software engineer', 'Teacher', 'Nurse', 'Retail worker', 'Student', 'Accountant']
    };
    
    return this.randomChoice(occupations[category]);
  }
  
  generateBackground(category, firstname) {
    const templates = {
      ACTIVIST: `${firstname} is an investigative journalist known for exposing government corruption. Former tech industry employee who left to pursue independent journalism.`,
      CORPORATE: `${firstname} founded a successful startup in 2015 and sold it to a tech giant 5 years later. Now works as an angel investor.`,
      CYBERCRIMINAL: `Operating under the alias "${firstname.toLowerCase()}${this.randomInt(10,99)}", this individual is active on several darknet forums specializing in financial fraud.`,
      INFLUENCER: `${firstname} started on YouTube in 2016 with lifestyle vlogs. Now has over 500K subscribers and collaborates with major brands.`,
      GHOST: `Very limited information available on ${firstname}. Consistently uses VPNs, Tor, and encrypted communications. Military-grade OPSEC.`
    };
    
    return templates[category] || `${firstname} maintains a standard online presence with typical social media activity and digital footprint.`;
  }
  
  generateSocialBio() {
    const bios = [
      "Living my best life 🌟",
      "Tech enthusiast | Coffee lover ☕",
      "Entrepreneur | Investor | Mentor",
      "Photographer capturing moments 📸",
      "Traveler exploring the world 🌍",
      "Fitness enthusiast 💪 | Healthy living",
      "Artist | Creative soul 🎨",
      "Music lover | Concert goer 🎵",
      "Foodie | Restaurant explorer 🍕",
      "Book lover | Constant learner 📚"
    ];
    return this.randomChoice(bios);
  }
  
  generateTimelineEvent(type) {
    const templates = {
      account_creation: `Created account on ${this.randomChoice(['Twitter', 'Instagram', 'LinkedIn', 'GitHub'])}`,
      domain_registration: `Registered domain ${this.randomString(8, 'abcdefghijklmnopqrstuvwxyz')}.com`,
      email_breach: `Email appeared in ${this.randomChoice(['LinkedIn', 'Adobe', 'Dropbox'])} data breach`,
      social_post: `Posted about ${this.randomChoice(['technology', 'travel', 'food', 'politics'])} on social media`,
      location_checkin: `Checked in at ${this.getRandomCity()}`,
      transaction: `Received ${(Math.random() * 5).toFixed(2)} BTC transaction`,
      news_mention: `Mentioned in ${this.randomChoice(['TechCrunch', 'Forbes', 'Reuters'])} article`,
      forum_post: `Posted on ${this.randomChoice(['Reddit', 'Stack Overflow', 'Hacker News'])}`
    };
    
    return templates[type] || 'Unknown activity detected';
  }
  
  generateDNSRecords() {
    return {
      A: `${this.randomInt(1,255)}.${this.randomInt(1,255)}.${this.randomInt(1,255)}.${this.randomInt(1,255)}`,
      MX: `mail.${this.randomString(8, 'abcdefghijklmnopqrstuvwxyz')}.com`,
      TXT: 'v=spf1 include:_spf.google.com ~all'
    };
  }
  
  // Utilitaires
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  randomChoices(array, min, max) {
    const count = this.randomInt(min, max);
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  randomString(length, chars = 'abcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  getRandomPastDate(yearsBack) {
    const now = new Date();
    const past = new Date(now.getTime() - (Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
    return past.toISOString().split('T')[0];
  }
  
  getRandomRecentDate(daysBack) {
    const now = new Date();
    const recent = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
    return recent.toISOString();
  }
}

// Initialiser la base de données
const AURAProfiles = new AURAProfilesDB();

// Exposer globalement
window.AURAProfiles = AURAProfiles;

console.log('👥 AURA Profiles Database initialisée avec', AURAProfiles.profiles.length, 'profils');