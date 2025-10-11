/**
 * 🤖 AURA AI CHAT SYSTEM
 * Simulation d'IA conversationnelle pour OSINT avec 200 profils factices
 */

class AURAChat {
  constructor() {
    this.phi = 1.618;
    this.messages = [];
    this.isTyping = false;
    this.currentInvestigation = null;
    this.conversationHistory = [];
    
    // Patterns de détection d'input
    this.patterns = {
      phone: /^(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      username: /^@?[a-zA-Z0-9_]{3,30}$/,
      domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/
    };
    
    // Réponses prédéfinies
    this.responses = {
      greetings: [
        "Bonjour ! Je suis AURA, votre assistant OSINT alimenté par l'IA. Quelle investigation souhaitez-vous mener aujourd'hui ?",
        "Bienvenue dans le laboratoire OSINT AURA. Quel type d'information recherchez-vous ?",
        "Prêt à démarrer une enquête ? Donnez-moi un point de départ : numéro, email, username...",
        "Salut ! AURA IA à votre service. Que puis-je analyser pour vous aujourd'hui ?"
      ],
      
      processing: [
        "🔍 Analyse en cours...",
        "⏳ Interrogation de 15 bases de données...",
        "🌐 Recherche dans les sources OSINT...",
        "🔐 Vérification des fuites de données...",
        "📊 Compilation des résultats...",
        "🧠 Application des algorithmes IA...",
        "🔗 Corrélation des informations..."
      ],
      
      suggestions: [
        "💡 Suggestions d'approfondissement :\n• Rechercher les emails associés\n• Analyser les usernames trouvés\n• Cartographier le réseau social",
        "🔍 Actions recommandées :\n• Cross-référencer avec d'autres sources\n• Vérifier les profils réseaux sociaux\n• Analyser les metadata d'images",
        "📌 Prochaines étapes possibles :\n• Recherche inversée d'images\n• Analyse domaines web\n• Investigation géospatiale"
      ]
    };
    
    this.initializeChat();
  }

  /**
   * 🚀 Initialise l'interface de chat
   */
  initializeChat() {
    this.createChatInterface();
    this.addWelcomeMessage();
    this.setupEventListeners();
  }

  /**
   * 🎨 Crée l'interface de chat
   */
  createChatInterface() {
    const chatContainer = document.getElementById('chat-interface');
    if (!chatContainer) return;

    chatContainer.innerHTML = `
      <div class="chat-header">
        <div class="d-flex align-items-center gap-3">
          <div class="ai-avatar">
            <i class="bi bi-robot"></i>
          </div>
          <div>
            <h5 class="mb-0">AURA Intelligence</h5>
            <small class="text-muted">Assistant OSINT IA • En ligne</small>
          </div>
        </div>
        <div class="chat-controls">
          <button class="btn btn-sm btn-outline-light" id="btn-clear-chat" title="Effacer la conversation">
            <i class="bi bi-trash"></i>
          </button>
          <button class="btn btn-sm btn-outline-light" id="btn-export-chat" title="Exporter la conversation">
            <i class="bi bi-download"></i>
          </button>
        </div>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        <!-- Messages générés dynamiquement -->
      </div>
      
      <div class="typing-indicator" id="typing-indicator" style="display: none;">
        <div class="d-flex align-items-center gap-2 p-3">
          <div class="ai-avatar-small">
            <i class="bi bi-robot"></i>
          </div>
          <div class="typing-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
          <span class="text-muted small">AURA analyse...</span>
        </div>
      </div>
      
      <div class="chat-input-container">
        <div class="input-group">
          <input type="text" 
                 class="form-control chat-input" 
                 id="chat-input" 
                 placeholder="Tapez votre message ou une donnée à analyser..."
                 autocomplete="off">
          <button class="btn btn-send-chat" id="btn-send" type="button">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
        <div class="input-hints mt-2">
          <small class="text-muted">
            💡 Exemples : "+33612345678", "user@domain.com", "@username", "domain.com"
          </small>
        </div>
      </div>
    `;
  }

  /**
   * 👋 Ajoute le message de bienvenue
   */
  addWelcomeMessage() {
    const welcomeMessage = this.getRandomResponse('greetings');
    this.addMessage('ai', welcomeMessage, 'text');
    
    // Ajouter les suggestions après 2 secondes
    setTimeout(() => {
      this.addMessage('ai', '', 'suggestions', {
        suggestions: [
          { text: '📱 Analyser un téléphone', query: '+33612345678' },
          { text: '📧 Tracer un email', query: 'john.doe@protonmail.com' },
          { text: '👤 Rechercher un username', query: '@ghost_operative' },
          { text: '🎯 Lancer un scénario', query: 'scénario débutant' }
        ]
      });
    }, 2000 * this.phi);
  }

  /**
   * 🎯 Configure les event listeners
   */
  setupEventListeners() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('btn-send');
    const clearBtn = document.getElementById('btn-clear-chat');
    const exportBtn = document.getElementById('btn-export-chat');

    // Envoi de message
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });

      // Auto-suggestions pendant la frappe
      chatInput.addEventListener('input', (e) => {
        this.handleInputSuggestions(e.target.value);
      });
    }

    // Boutons de contrôle
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearChat());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportChat());
    }

    // Délégation d'événements pour les suggestions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-btn')) {
        const query = e.target.dataset.query;
        if (query) {
          document.getElementById('chat-input').value = query;
          this.sendMessage();
        }
      }
    });
  }

  /**
   * 📤 Envoie un message
   */
  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Ajouter le message utilisateur
    this.addMessage('user', message, 'text');
    input.value = '';

    // Analyser et répondre
    await this.processUserMessage(message);
  }

  /**
   * 🧠 Traite le message utilisateur
   */
  async processUserMessage(message) {
    this.showTyping();
    
    // Détecter le type de donnée
    const dataType = this.detectDataType(message);
    
    // Simuler délai de traitement
    await this.delay(1000 + Math.random() * 2000);
    
    try {
      if (dataType) {
        await this.handleDataAnalysis(message, dataType);
      } else {
        await this.handleConversation(message);
      }
    } catch (error) {
      console.error('Erreur de traitement:', error);
      this.addMessage('ai', '❌ Désolé, une erreur est survenue lors du traitement. Veuillez réessayer.', 'text');
    } finally {
      this.hideTyping();
    }
  }

  /**
   * 🔍 Analyse des données OSINT
   */
  async handleDataAnalysis(data, type) {
    // Vérifier si c'est un déclencheur de scénario
    const scenarioId = window.AURAScenarios?.detectScenarioTrigger(data);
    if (scenarioId) {
      this.launchGuidedScenario(scenarioId);
      return;
    }

    // Message de traitement
    const processingMsg = this.getRandomResponse('processing');
    this.addMessage('ai', processingMsg, 'text');
    
    await this.delay(1500 * this.phi);
    
    // Rechercher dans la base de données
    let profile = null;
    
    switch (type) {
      case 'phone':
        profile = window.AURAProfiles?.findByPhone(data);
        break;
      case 'email':
        profile = window.AURAProfiles?.findByEmail(data);
        break;
      case 'username':
        const cleanUsername = data.replace('@', '');
        profile = window.AURAProfiles?.findByUsername(cleanUsername);
        break;
      case 'domain':
        profile = window.AURAProfiles?.findByDomain(data);
        break;
    }
    
    if (profile) {
      // Profil trouvé - affichage complexe
      this.addMessage('ai', '✅ Analyse terminée ! Investigation complexe détectée.', 'text');
      this.displayComplexInvestigation(profile);
      
      // Suggestions de suivi
      setTimeout(() => {
        this.addFollowUpSuggestions(profile, type);
      }, 1000 * this.phi);
      
    } else {
      // Générer un profil synthétique
      const syntheticProfile = this.generateSyntheticResult(data, type);
      this.addMessage('ai', '✅ Analyse terminée ! Voici les informations collectées :', 'text');
      this.addMessage('ai', '', 'synthetic_result', { data: syntheticProfile, dataType: type });
    }
    
    // Sauvegarder dans l'historique
    this.saveToHistory(data, type, profile);
  }

  /**
   * 💬 Gestion conversation générale
   */
  async handleConversation(message) {
    const lowerMsg = message.toLowerCase();
    
    // Vérifier déclencheurs de scénarios
    const scenarioId = window.AURAScenarios?.detectScenarioTrigger(message);
    if (scenarioId) {
      this.launchGuidedScenario(scenarioId);
      return;
    }
    
    // Recherche par catégorie
    if (lowerMsg.match(/narcotrafiquant|trafficker|terrorist|prédateur/i)) {
      const category = this.detectCategory(message);
      const profiles = window.AURAProfiles?.searchByCategory(category);
      if (profiles && profiles.length > 0) {
        this.displayCategoryResults(profiles, category);
        return;
      }
    }
    
    if (lowerMsg.includes('aide') || lowerMsg.includes('help')) {
      this.addMessage('ai', this.getHelpMessage(), 'text');
      
    } else if (lowerMsg.includes('scénario')) {
      this.addMessage('ai', '🎭 Voici les scénarios d\'investigation disponibles :', 'text');
      this.addMessage('ai', '', 'scenarios', { scenarios: this.getAvailableScenarios() });
      
    } else if (lowerMsg.includes('histoire') || lowerMsg.includes('history')) {
      this.addMessage('ai', '📚 Chronologie de l\'OSINT :', 'text');
      this.addMessage('ai', '', 'timeline', { timeline: this.getOSINTHistory() });
      
    } else if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut')) {
      const greeting = this.getRandomResponse('greetings');
      this.addMessage('ai', greeting, 'text');
      
    } else {
      // Réponse générique avec suggestions
      this.addMessage('ai', 
        "Je n'ai pas compris votre demande. Essayez :\n" +
        "• Un numéro de téléphone (ex: +212661234567)\n" +
        "• Un email (ex: user@example.com)\n" +
        "• Une catégorie (ex: narcotrafiquant, terroriste)\n" +
        "• Un scénario (ex: maroc, arabie, csam)\n" +
        "• Ou tapez 'aide' pour plus d'options", 'text');
    }
  }

  /**
   * 🔍 Détecte le type de donnée
   */
  detectDataType(input) {
    const cleanInput = input.trim();
    
    if (this.patterns.phone.test(cleanInput)) return 'phone';
    if (this.patterns.email.test(cleanInput)) return 'email';
    if (this.patterns.username.test(cleanInput)) return 'username';
    if (this.patterns.domain.test(cleanInput)) return 'domain';
    if (this.patterns.ip.test(cleanInput)) return 'ip';
    if (this.patterns.bitcoin.test(cleanInput)) return 'bitcoin';
    
    return null;
  }

  /**
   * 📝 Ajoute un message à la conversation
   */
  addMessage(sender, text, type = 'text', data = null) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.id = messageId;

    const timestamp = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let content = '';
    
    switch (type) {
      case 'text':
        content = `
          <div class="message-bubble">
            <div class="message-content">${this.formatMessage(text)}</div>
            <div class="message-time">${timestamp}</div>
          </div>
        `;
        break;
        
      case 'suggestions':
        content = this.createSuggestionsHTML(data.suggestions, timestamp);
        break;
        
      case 'profile_result':
        content = this.createProfileResultHTML(data.profile, data.dataType, timestamp);
        break;
        
      case 'synthetic_result':
        content = this.createSyntheticResultHTML(data.data, data.dataType, timestamp);
        break;
        
      case 'scenarios':
        content = this.createScenariosHTML(data.scenarios, timestamp);
        break;
        
      case 'timeline':
        content = this.createTimelineHTML(data.timeline, timestamp);
        break;
        
      case 'raw':
        content = text; // HTML brut
        break;
    }

    messageDiv.innerHTML = content;
    messagesContainer.appendChild(messageDiv);
    
    // Animation d'apparition
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      messageDiv.style.transition = 'all 0.3s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    });

    // Scroll automatique
    this.scrollToBottom();
    
    // Sauvegarder le message
    this.messages.push({
      id: messageId,
      sender,
      text,
      type,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 🎨 Crée le HTML pour les suggestions
   */
  createSuggestionsHTML(suggestions, timestamp) {
    const suggestionsHTML = suggestions.map(suggestion => 
      `<button class="btn btn-outline-primary btn-sm suggestion-btn me-2 mb-2" data-query="${suggestion.query}">
        ${suggestion.text}
      </button>`
    ).join('');

    return `
      <div class="message-bubble">
        <div class="message-content">
          <h6><i class="bi bi-lightbulb"></i> Suggestions</h6>
          <div class="suggestions-container">
            ${suggestionsHTML}
          </div>
        </div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;
  }

  /**
   * 👤 Crée le HTML pour un résultat de profil
   */
  createProfileResultHTML(profile, dataType, timestamp) {
    const threatColor = {
      'LOW': 'success',
      'MEDIUM': 'warning', 
      'HIGH': 'danger'
    }[profile.osint_footprint.threat_level] || 'secondary';

    return `
      <div class="message-bubble">
        <div class="message-content">
          <div class="profile-card">
            <div class="profile-header">
              <h6><i class="bi bi-person-badge"></i> ${profile.metadata.firstname} ${profile.metadata.lastname}</h6>
              <span class="badge bg-${threatColor}">${profile.osint_footprint.threat_level}</span>
            </div>
            
            <div class="profile-details">
              <div class="row g-2">
                <div class="col-6">
                  <small class="text-muted">Âge</small><br>
                  <strong>${profile.metadata.age} ans</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted">Pays</small><br>
                  <strong>${profile.metadata.country}</strong>
                </div>
                <div class="col-12">
                  <small class="text-muted">Profession</small><br>
                  <strong>${profile.metadata.occupation}</strong>
                </div>
              </div>
            </div>
            
            <div class="profile-stats mt-3">
              <div class="row g-2 text-center">
                <div class="col-3">
                  <div class="stat-value">${profile.osint_footprint.emails?.length || 0}</div>
                  <div class="stat-label">Emails</div>
                </div>
                <div class="col-3">
                  <div class="stat-value">${profile.osint_footprint.usernames?.[0]?.platforms?.length || 0}</div>
                  <div class="stat-label">Profils</div>
                </div>
                <div class="col-3">
                  <div class="stat-value">${profile.osint_footprint.domains?.length || 0}</div>
                  <div class="stat-label">Domaines</div>
                </div>
                <div class="col-3">
                  <div class="stat-value">${profile.realism_score}%</div>
                  <div class="stat-label">Réalisme</div>
                </div>
              </div>
            </div>
            
            <div class="profile-actions mt-3">
              <button class="btn btn-sm btn-outline-primary" onclick="AURAChat.viewFullProfile('${profile.id}')">
                <i class="bi bi-eye"></i> Voir le profil complet
              </button>
            </div>
          </div>
        </div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;
  }

  /**
   * 🔧 Crée le HTML pour un résultat synthétique
   */
  createSyntheticResultHTML(data, dataType, timestamp) {
    return `
      <div class="message-bubble">
        <div class="message-content">
          <div class="synthetic-result">
            <h6><i class="bi bi-search"></i> Résultat de l'analyse ${dataType.toUpperCase()}</h6>
            <div class="result-data">
              ${Object.entries(data).map(([key, value]) => `
                <div class="data-row">
                  <span class="data-key">${key}:</span>
                  <span class="data-value">${value}</span>
                </div>
              `).join('')}
            </div>
            <div class="result-note mt-2">
              <small class="text-muted">
                <i class="bi bi-info-circle"></i>
                Données générées pour démonstration. En production, ces informations proviendraient de sources OSINT réelles.
              </small>
            </div>
          </div>
        </div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;
  }

  /**
   * 📊 Génère un résultat synthétique
   */
  generateSyntheticResult(data, type) {
    const results = {
      phone: {
        'Numéro': data,
        'Opérateur': 'Orange France',
        'Type': 'Mobile',
        'Localisation': 'Paris, France',
        'Statut': 'Actif',
        'Risque': 'Faible'
      },
      email: {
        'Email': data,
        'Domaine': data.split('@')[1],
        'Créé': '2019-03-15',
        'Fuites': 'LinkedIn (2021)',
        'Réputation': '85/100',
        'Jetable': 'Non'
      },
      username: {
        'Username': data,
        'Plateformes trouvées': '5',
        'Dernière activité': '2024-01-15',
        'Followers total': '2,847',
        'Vérifié': 'Non',
        'Score activité': '7.2/10'
      },
      domain: {
        'Domaine': data,
        'Registrar': 'Namecheap',
        'Créé': '2020-06-10',
        'Expire': '2025-06-10',
        'Serveurs DNS': 'Cloudflare',
        'Risque': 'Faible'
      }
    };
    
    return results[type] || { 'Résultat': 'Aucune donnée trouvée' };
  }

  /**
   * 💡 Ajoute des suggestions de suivi
   */
  addFollowUpSuggestions(profile, currentType) {
    const suggestions = [];
    
    if (currentType === 'phone' && profile.osint_footprint.emails?.length > 0) {
      suggestions.push({
        text: '📧 Analyser l\'email trouvé',
        query: profile.osint_footprint.emails[0].address
      });
    }
    
    if (profile.osint_footprint.usernames?.length > 0) {
      suggestions.push({
        text: '👤 Rechercher les usernames',
        query: '@' + profile.osint_footprint.usernames[0].username
      });
    }
    
    if (profile.osint_footprint.domains?.length > 0) {
      suggestions.push({
        text: '🌐 Analyser le domaine',
        query: profile.osint_footprint.domains[0].domain
      });
    }
    
    suggestions.push({
      text: '🔍 Voir le profil complet',
      query: `profil ${profile.id}`
    });
    
    if (suggestions.length > 0) {
      this.addMessage('ai', '', 'suggestions', { suggestions });
    }
  }

  /**
   * 🎭 Récupère les scénarios disponibles
   */
  getScenarios() {
    return [
      {
        title: 'Le Journaliste Disparu',
        difficulty: 'Intermédiaire',
        duration: '15-20 min',
        description: 'Un journaliste d\'investigation a cessé toute communication...'
      },
      {
        title: 'L\'Arnaque au Bitcoin',
        difficulty: 'Avancé',
        duration: '25-30 min',
        description: 'Tracez les fonds volés dans une arnaque cryptocurrency...'
      },
      {
        title: 'La Photo Mystère (1944)',
        difficulty: 'Expert',
        duration: '30-40 min',
        description: 'Géolocalisez cette photo de guerre historique...'
      }
    ];
  }

  /**
   * 🎭 Récupère les scénarios AURA disponibles
   */
  getAvailableScenarios() {
    return window.AURAScenarios?.getAvailableScenarios() || this.getScenarios();
  }

  /**
   * 📚 Récupère l'histoire de l'OSINT
   */
  getOSINTHistory() {
    return [
      { year: '1850', event: 'Fondation de l\'agence Pinkerton (première agence de détective)' },
      { year: '1914-1918', event: 'WWI : Naissance du renseignement moderne (MI6, Deuxième Bureau)' },
      { year: '1940', event: 'Bletchley Park décrpyte Enigma via SIGINT + OSINT' },
      { year: '1947', event: 'Création de la CIA (Cold War OSINT)' },
      { year: '1991', event: 'Internet public : Révolution de l\'accès à l\'information' },
      { year: '2001', event: '9/11 : Boom de la surveillance et du data mining' },
      { year: '2014', event: 'Bellingcat prouve l\'implication russe dans MH17' },
      { year: '2024', event: 'IA générative + OSINT = Nouvelle ère de l\'investigation' }
    ];
  }

  /**
   * ❓ Message d'aide
   */
  getHelpMessage() {
    return `🆘 **Aide OSINT AURA**

**Types de recherches disponibles :**
• 📱 Téléphone : +33612345678
• 📧 Email : user@domain.com  
• 👤 Username : @johndoe123
• 🌐 Domaine : example.com
• 🖼️ Image : (upload ou URL)

**Commandes spéciales :**
• \`scénarios\` : Voir les enquêtes guidées
• \`histoire\` : Chronologie de l'OSINT
• \`aide\` : Afficher cette aide

**Raccourcis :**
• Tapez directement une donnée pour l'analyser
• Cliquez sur les suggestions pour approfondir
• Utilisez les boutons d'action dans les résultats`;
  }

  /**
   * 🎲 Utilitaires
   */
  
  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  
  showTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'block';
      this.scrollToBottom();
    }
    this.isTyping = true;
  }
  
  hideTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
    this.isTyping = false;
  }
  
  scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🧹 Efface la conversation
   */
  clearChat() {
    Swal.fire({
      title: 'Effacer la conversation ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, effacer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
          messagesContainer.innerHTML = '';
        }
        this.messages = [];
        this.addWelcomeMessage();
      }
    });
  }

  /**
   * 📥 Exporte la conversation
   */
  exportChat() {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: this.messages,
      user: window.AURAAuthInstance?.currentUser?.username || 'anonymous'
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 💾 Sauvegarde dans l'historique
   */
  saveToHistory(query, type, result) {
    const historyItem = {
      query,
      type,
      timestamp: new Date().toISOString(),
      found: !!result
    };
    
    // Ajouter à l'historique de la sidebar
    this.updateSidebarHistory(historyItem);
  }

  /**
   * 📋 Met à jour l'historique de la sidebar
   */
  updateSidebarHistory(item) {
    const historyContainer = document.getElementById('search-history');
    if (!historyContainer) return;
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span>${item.query}</span>
        <small class="text-muted">${item.type.toUpperCase()}</small>
      </div>
      <small class="text-muted">${new Date(item.timestamp).toLocaleTimeString('fr-FR')}</small>
    `;
    
    historyItem.addEventListener('click', () => {
      document.getElementById('chat-input').value = item.query;
    });
    
    historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    
    // Limiter à 10 éléments
    while (historyContainer.children.length > 10) {
      historyContainer.removeChild(historyContainer.lastChild);
    }
  }

  // Nouvelles méthodes pour profils complexes
  
  detectCategory(query) {
    const categoryMap = {
      'narcotrafiquant|trafficker|drogue': 'NARCOTRAFFICKER',
      'terrorist|terroriste|attentat': 'TERRORIST_SUSPECT',
      'prédateur|predator|pédophile': 'CHILD_PREDATOR',
      'trafic humain|trafficking': 'HUMAN_TRAFFICKER',
      'fraude|fraud|ponzi': 'FINANCIAL_FRAUDSTER',
      'blanchiment|laundering': 'MONEY_LAUNDERER'
    };

    const queryLower = query.toLowerCase();
    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (new RegExp(pattern, 'i').test(queryLower)) {
        return category;
      }
    }
    return 'UNKNOWN';
  }

  displayComplexInvestigation(profile) {
    const resultHtml = `
      <div class="message-bubble">
        <div class="message-content">
          <div class="complex-investigation">
            <div class="investigation-header">
              <h6>🔍 Investigation OSINT Complexe</h6>
              <div class="threat-indicators">
                <span class="badge bg-${this.getPriorityColor(profile.investigation_flags?.priority)}">
                  ${profile.investigation_flags?.priority || 'MEDIUM'}
                </span>
                <span class="badge bg-secondary">${profile.investigation_flags?.type || 'STANDARD'}</span>
              </div>
            </div>
            
            <div class="subject-profile">
              <h6>👤 Sujet d'Investigation</h6>
              <div class="profile-grid">
                <p><strong>Identité:</strong> ${profile.metadata.firstname} ${profile.metadata.lastname}</p>
                <p><strong>Âge:</strong> ${profile.metadata.age} ans</p>
                <p><strong>Nationalité:</strong> ${profile.metadata.country}</p>
                <p><strong>Occupation déclarée:</strong> ${profile.metadata.occupation}</p>
                ${profile.metadata.real_occupation ? `<p><strong>Activité réelle:</strong> <span class="text-danger">${profile.metadata.real_occupation}</span></p>` : ''}
              </div>
            </div>

            ${this.renderContradictions(profile.contradictions)}
            ${this.renderRiskAssessment(profile.risk_indicators)}
            ${this.renderInvestigationFlags(profile.investigation_flags)}

            <div class="action-recommendations">
              <h6>⚡ Recommandations d'Action</h6>
              <div class="recommendations">
                ${this.generateRecommendations(profile)}
              </div>
            </div>
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;

    this.addMessage('ai', resultHtml, 'raw');
  }

  launchGuidedScenario(scenarioId) {
    const scenario = window.AURAScenarios?.scenarios[scenarioId];
    if (!scenario) return;

    const introHtml = `
      <div class="message-bubble">
        <div class="message-content">
          <div class="scenario-launch">
            <div class="scenario-header">
              <h6>🎭 Scénario d'Investigation Guidé</h6>
              <div class="scenario-meta">
                <span class="badge bg-${this.getDifficultyColor(scenario.difficulty)}">${scenario.difficulty}</span>
                <span class="badge bg-info">${scenario.estimated_duration || '30 min'}</span>
              </div>
            </div>
            
            <div class="scenario-info">
              <h6>${scenario.title}</h6>
              <p>${scenario.description}</p>
              
              ${scenario.sensitivity ? `
                <div class="alert alert-warning">
                  <strong>⚠️ Sensibilité:</strong> ${scenario.sensitivity}
                </div>
              ` : ''}
            </div>

            <div class="scenario-phases">
              <h6>📋 Phases d'Investigation:</h6>
              <ol>
                ${scenario.phases.map(phase => `
                  <li><strong>${phase.title}:</strong> ${phase.description}</li>
                `).join('')}
              </ol>
            </div>

            <div class="scenario-controls">
              <button onclick="window.AURAScenarios.launchScenario('${scenarioId}', window.AURAChatInstance)" class="btn btn-primary btn-sm">
                🚀 Lancer l'Investigation
              </button>
            </div>
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;

    this.addMessage('ai', introHtml, 'raw');
  }

  displayDiscovery(discovery) {
    const discoveryHtml = `
      <div class="message-bubble">
        <div class="message-content">
          <div class="investigation-discovery" data-type="${discovery.type}">
            <div class="discovery-header">
              <h6>${discovery.content.title}</h6>
              <span class="badge bg-primary">${discovery.type}</span>
            </div>
            
            <div class="discovery-content">
              ${this.renderDiscoveryData(discovery.content.data)}
            </div>
            
            <div class="discovery-timestamp">
              <small class="text-muted">
                🕐 Découvert à ${new Date().toLocaleTimeString()}
              </small>
            </div>
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;

    this.addMessage('ai', discoveryHtml, 'raw');
  }

  displayCategoryResults(profiles, category) {
    const categoryNames = {
      'NARCOTRAFFICKER': 'Narcotrafiquants',
      'TERRORIST_SUSPECT': 'Suspects Terroristes',
      'CHILD_PREDATOR': 'Prédateurs',
      'HUMAN_TRAFFICKER': 'Trafiquants Humains',
      'FINANCIAL_FRAUDSTER': 'Fraudeurs Financiers'
    };

    const resultHtml = `
      <div class="message-bubble">
        <div class="message-content">
          <div class="category-results">
            <h6>🎯 Résultats: ${categoryNames[category] || category}</h6>
            <p><strong>${profiles.length}</strong> profils trouvés dans cette catégorie</p>
            
            <div class="profiles-grid">
              ${profiles.slice(0, 5).map(profile => `
                <div class="profile-card mb-2 p-2 border rounded" style="cursor: pointer;" onclick="window.AURAChatInstance.displayComplexInvestigation(${JSON.stringify(profile).replace(/"/g, '&quot;')})">
                  <h6 class="mb-1">${profile.metadata.firstname} ${profile.metadata.lastname}</h6>
                  <p class="mb-1"><strong>Pays:</strong> ${profile.metadata.country}</p>
                  <p class="mb-1"><strong>Priorité:</strong> <span class="badge bg-${this.getPriorityColor(profile.investigation_flags?.priority)}">${profile.investigation_flags?.priority || 'MEDIUM'}</span></p>
                  <p class="mb-0"><strong>Risque:</strong> ${profile.risk_indicators?.public_danger || 'UNKNOWN'}</p>
                </div>
              `).join('')}
            </div>
            
            ${profiles.length > 5 ? `<p class="text-muted"><em>... et ${profiles.length - 5} autres profils</em></p>` : ''}
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;

    this.addMessage('ai', resultHtml, 'raw');
  }

  // Méthodes utilitaires
  getPriorityColor(priority) {
    const colors = {
      'LOW': 'success',
      'MEDIUM': 'warning',
      'HIGH': 'danger',
      'CRITICAL': 'dark'
    };
    return colors[priority] || 'secondary';
  }

  getDifficultyColor(difficulty) {
    const colors = {
      'BEGINNER': 'success',
      'INTERMEDIATE': 'warning',
      'ADVANCED': 'danger',
      'EXPERT': 'dark',
      'CRITICAL': 'dark'
    };
    return colors[difficulty] || 'primary';
  }

  renderContradictions(contradictions) {
    if (!contradictions || contradictions.length === 0) return '';
    
    return `
      <div class="contradictions-section mt-3">
        <h6>⚠️ Contradictions Détectées</h6>
        <div class="contradictions-list">
          ${contradictions.map(contradiction => `
            <div class="contradiction-item border-start border-warning ps-2 mb-2">
              <div class="claimed">📢 <strong>Déclaré:</strong> ${contradiction.claimed}</div>
              <div class="evidence">🔍 <strong>Preuve:</strong> ${contradiction.evidence}</div>
              <div class="confidence">📊 <strong>Confiance:</strong> ${contradiction.confidence}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRiskAssessment(riskIndicators) {
    if (!riskIndicators) return '';
    
    return `
      <div class="risk-assessment mt-3">
        <h6>⚡ Évaluation des Risques</h6>
        <div class="risk-grid row">
          <div class="col-6">
            <span class="risk-label">Risque de fuite:</span>
            <span class="badge bg-${this.getPriorityColor(riskIndicators.flight_risk)}">${riskIndicators.flight_risk}</span>
          </div>
          <div class="col-6">
            <span class="risk-label">Danger public:</span>
            <span class="badge bg-${this.getPriorityColor(riskIndicators.public_danger)}">${riskIndicators.public_danger}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderInvestigationFlags(flags) {
    if (!flags) return '';
    
    return `
      <div class="investigation-flags mt-3">
        <h6>🚩 Statut Investigation</h6>
        <div class="flags-grid">
          <p><strong>Priorité:</strong> <span class="badge bg-${this.getPriorityColor(flags.priority)}">${flags.priority}</span></p>
          <p><strong>Type d'affaire:</strong> ${flags.type}</p>
          ${flags.agencies ? `<p><strong>Agences impliquées:</strong> ${flags.agencies.join(', ')}</p>` : ''}
        </div>
      </div>
    `;
  }

  generateRecommendations(profile) {
    const recommendations = [];
    
    if (profile.investigation_flags?.priority === 'CRITICAL') {
      recommendations.push('🚨 <strong>Action immédiate requise</strong>');
    }
    
    if (profile.risk_indicators?.flight_risk === 'HIGH' || profile.risk_indicators?.flight_risk === 'EXTREME') {
      recommendations.push('✈️ Surveillance renforcée - risque de fuite élevé');
    }
    
    recommendations.push('📋 Compilation des preuves pour procédure judiciaire');
    recommendations.push('🔒 Sécurisation des preuves numériques');
    
    return recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('');
  }

  renderDiscoveryData(data) {
    if (typeof data === 'object') {
      return Object.entries(data).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `
            <div class="data-section">
              <strong>${key}:</strong>
              <ul>
                ${value.map(item => `<li>${typeof item === 'object' ? JSON.stringify(item) : item}</li>`).join('')}
              </ul>
            </div>
          `;
        } else if (typeof value === 'object') {
          return `
            <div class="data-section">
              <strong>${key}:</strong>
              <div class="nested-data">
                ${this.renderDiscoveryData(value)}
              </div>
            </div>
          `;
        } else {
          return `<div class="data-item"><strong>${key}:</strong> ${value}</div>`;
        }
      }).join('');
    }
    return `<div class="data-simple">${data}</div>`;
  }

  /**
   * 👁️ Voir le profil complet (méthode statique)
   */
  static viewFullProfile(profileId) {
    const profile = window.AURAProfiles?.profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    // Créer une modal avec le profil complet
    Swal.fire({
      title: `${profile.metadata.firstname} ${profile.metadata.lastname}`,
      html: `
        <div class="text-start">
          <p><strong>Catégorie:</strong> ${profile.category}</p>
          <p><strong>Profession:</strong> ${profile.metadata.occupation}</p>
          <p><strong>Background:</strong> ${profile.metadata.background}</p>
          <p><strong>Niveau de menace:</strong> <span class="badge bg-${profile.osint_footprint.threat_level === 'LOW' ? 'success' : profile.osint_footprint.threat_level === 'MEDIUM' ? 'warning' : 'danger'}">${profile.osint_footprint.threat_level}</span></p>
          <p><strong>Notes:</strong> ${profile.osint_footprint.investigation_notes}</p>
        </div>
      `,
      width: 600,
      showCloseButton: true,
      confirmButtonText: 'Fermer'
    });
  }
}

// Initialiser le chat
window.AURAChat = AURAChat;

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que le dashboard soit actif
  const checkDashboard = () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer && dashboardContainer.classList.contains('active')) {
      if (!window.AURAChatInstance) {
        window.AURAChatInstance = new AURAChat();
      }
    } else {
      setTimeout(checkDashboard, 500);
    }
  };
  
  checkDashboard();
});