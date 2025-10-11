/**
 * 🎯 DASHBOARD PRINCIPAL AURA OSINT
 * Interface unifiée pour toutes les fonctionnalités
 */

class AuraDashboard {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
    this.loadDashboard();
  }
  
  render() {
    document.body.innerHTML = `
      <div class="dashboard-container">
        <nav class="sidebar">
          <div class="logo">
            <h2>🔍 AURA OSINT</h2>
            <p>Advanced Investigation Platform</p>
          </div>
          
          <ul class="nav-menu">
            <li><a href="#" onclick="dashboard.switchView('dashboard')" class="nav-item active">
              📊 Dashboard
            </a></li>
            <li><a href="#" onclick="dashboard.switchView('chat')" class="nav-item">
              💬 Chat IA
            </a></li>
            <li><a href="#" onclick="dashboard.switchView('tools')" class="nav-item">
              🛠️ Outils OSINT
            </a></li>
            <li><a href="#" onclick="dashboard.switchView('investigations')" class="nav-item">
              🔍 Investigations
            </a></li>
            <li><a href="#" onclick="dashboard.switchView('config')" class="nav-item">
              ⚙️ Configuration
            </a></li>
            <li><a href="#" onclick="dashboard.switchView('docs')" class="nav-item">
              📚 Documentation
            </a></li>
          </ul>
        </nav>
        
        <main class="main-content">
          <div id="viewContainer" class="view-container">
            <!-- Le contenu sera chargé dynamiquement -->
          </div>
        </main>
      </div>
    `;
  }
  
  bindEvents() {
    // Gestion des raccourcis clavier
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        switch(e.key) {
          case '1': this.switchView('dashboard'); break;
          case '2': this.switchView('chat'); break;
          case '3': this.switchView('tools'); break;
          case '4': this.switchView('investigations'); break;
          case '5': this.switchView('config'); break;
        }
      }
    });
  }
  
  switchView(view) {
    this.currentView = view;
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Charger la vue
    switch(view) {
      case 'dashboard': this.loadDashboard(); break;
      case 'chat': this.loadChat(); break;
      case 'tools': this.loadTools(); break;
      case 'investigations': this.loadInvestigations(); break;
      case 'config': this.loadConfig(); break;
      case 'docs': this.loadDocs(); break;
    }
  }
  
  loadDashboard() {
    const container = document.createElement('div');
    container.className = 'dashboard-view';
    container.innerHTML = `
      <div class="dashboard-header">
        <h1>🎯 Dashboard AURA OSINT</h1>
        <p>Plateforme d'investigation avancée avec IA</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>🛠️ Outils OSINT</h3>
          <div class="stat-number">17</div>
          <p>Catégories disponibles</p>
        </div>
        
        <div class="stat-card">
          <h3>🤖 IA Qwen</h3>
          <div class="stat-number" id="aiStatus">⏳</div>
          <p>Statut du moteur IA</p>
        </div>
        
        <div class="stat-card">
          <h3>🔍 Investigations</h3>
          <div class="stat-number" id="investigationCount">0</div>
          <p>Investigations actives</p>
        </div>
        
        <div class="stat-card">
          <h3>📊 Performance</h3>
          <div class="stat-number">+40%</div>
          <p>Optimisation appliquée</p>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>🚀 Actions Rapides</h2>
        <div class="action-buttons">
          <button class="btn btn-primary" onclick="dashboard.switchView('chat')">
            💬 Nouvelle Investigation IA
          </button>
          <button class="btn btn-secondary" onclick="dashboard.switchView('tools')">
            🛠️ Exécuter Outil OSINT
          </button>
          <button class="btn btn-success" onclick="dashboard.switchView('config')">
            ⚙️ Tester Configuration
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('viewContainer').innerHTML = '';
    document.getElementById('viewContainer').appendChild(container);
    
    // Charger les statistiques
    this.loadStats();
  }
  
  loadChat() {
    const container = document.createElement('div');
    container.className = 'chat-view';
    container.innerHTML = `
      <div class="chat-header">
        <h1>💬 Chat IA AURA OSINT</h1>
        <p>Interaction en langage naturel avec les outils OSINT</p>
      </div>
      
      <div class="chat-container">
        <div id="chatMessages" class="chat-messages">
          <div class="message assistant">
            <div class="message-content">
              Bonjour ! Je suis l'IA AURA OSINT. Je peux vous aider à analyser des emails, rechercher des pseudonymes, scanner des réseaux et bien plus. Que souhaitez-vous investiguer ?
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <input type="text" id="chatInput" placeholder="Tapez votre requête d'investigation..." class="chat-input">
          <button onclick="dashboard.sendMessage()" class="btn btn-primary">Envoyer</button>
        </div>
      </div>
    `;
    
    document.getElementById('viewContainer').innerHTML = '';
    document.getElementById('viewContainer').appendChild(container);
    
    // Focus sur l'input
    document.getElementById('chatInput').focus();
    
    // Gérer l'envoi avec Entrée
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
  
  loadTools() {
    const container = document.createElement('div');
    container.className = 'tools-view';
    container.innerHTML = `
      <div class="tools-header">
        <h1>🛠️ Outils OSINT</h1>
        <p>17 outils d'investigation répartis en 8 catégories</p>
      </div>
      
      <div class="tools-grid">
        <div class="tool-category">
          <h3>📱 Phone Intelligence (2)</h3>
          <div class="tool-list">
            <button class="tool-btn" onclick="executeTool('phoneinfoga')">📞 PhoneInfoga</button>
            <button class="tool-btn" onclick="executeTool('phonenumbers')">📱 PhoneNumbers</button>
          </div>
        </div>
        
        <div class="tool-category">
          <h3>👤 Username Intelligence (2)</h3>
          <div class="tool-list">
            <button class="tool-btn" onclick="executeTool('sherlock')">🕵️ Sherlock</button>
            <button class="tool-btn" onclick="executeTool('maigret')">🔍 Maigret</button>
          </div>
        </div>
        
        <div class="tool-category">
          <h3>🌐 Network Intelligence (5)</h3>
          <div class="tool-list">
            <button class="tool-btn" onclick="executeTool('shodan')">🌍 Shodan</button>
            <button class="tool-btn" onclick="executeTool('port_scanner')">🔌 Port Scanner</button>
            <button class="tool-btn" onclick="executeTool('ssl_analyzer')">🔒 SSL Analyzer</button>
          </div>
        </div>
        
        <div class="tool-category">
          <h3>📧 Email Intelligence (1)</h3>
          <div class="tool-list">
            <button class="tool-btn" onclick="executeTool('holehe')">📬 Holehe</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('viewContainer').innerHTML = '';
    document.getElementById('viewContainer').appendChild(container);
  }
  
  loadConfig() {
    document.getElementById('viewContainer').innerHTML = '';
    backendConfig = new BackendConfig();
  }
  
  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Ajouter le message utilisateur
    this.addMessage(message, 'user');
    input.value = '';
    
    // Envoyer à l'IA
    try {
      const response = await fetch('http://localhost:4011/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.addMessage(data.response || 'Réponse reçue', 'assistant');
      } else {
        this.addMessage('Erreur de communication avec l\'IA', 'assistant');
      }
    } catch (error) {
      this.addMessage(`Erreur: ${error.message}`, 'assistant');
    }
  }
  
  addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
      <div class="message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  async loadStats() {
    try {
      // Tester l'IA
      const aiResponse = await fetch('http://localhost:4011/api/health');
      const aiStatus = document.getElementById('aiStatus');
      if (aiResponse.ok) {
        aiStatus.textContent = '✅';
        aiStatus.style.color = 'var(--success)';
      } else {
        aiStatus.textContent = '❌';
        aiStatus.style.color = 'var(--error)';
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  }
}

// Fonctions globales
function executeTool(toolName) {
  alert(`Exécution de l'outil ${toolName} - À implémenter`);
}

// Instance globale
let dashboard;