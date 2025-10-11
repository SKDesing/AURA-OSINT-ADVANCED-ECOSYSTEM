/**
 * 🔧 COMPOSANT CONFIGURATION BACKEND
 * Interface unifiée pour configuration et tests système
 */

class BackendConfig {
  constructor() {
    this.config = {
      backendUrl: 'http://localhost:4011',
      websocketUrl: 'ws://localhost:4011',
      status: {
        connection: false,
        websocket: false,
        tools: false,
        ai: false
      }
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
    this.runInitialTests();
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'config-container';
    container.innerHTML = `
      <div class="header">
        <h1>🔧 Configuration Backend AURA OSINT</h1>
        <div class="subtitle">Système Intégré avec IA Qwen</div>
      </div>
      
      <div class="integration-status">
        🌟 NOUVEAU : Port unifié 4011 avec IA Qwen intégrée !
      </div>
      
      <div class="form-group">
        <label>URL Backend AURA (Port Unifié)</label>
        <input type="url" id="backendUrl" value="${this.config.backendUrl}">
      </div>
      
      <div class="form-group">
        <label>WebSocket URL</label>
        <input type="url" id="websocketUrl" value="${this.config.websocketUrl}">
      </div>
      
      <div class="form-group">
        <button class="btn" onclick="backendConfig.testConnection()">🔍 Tester Connexion</button>
        <button class="btn btn-warning" onclick="backendConfig.testWebSocket()">⚡ Tester WebSocket</button>
        <button class="btn btn-success" onclick="backendConfig.checkOsintTools()">🛠️ Vérifier Outils OSINT</button>
        <button class="btn btn-gold" onclick="backendConfig.testAIEngine()">🤖 Tester IA Qwen</button>
      </div>
      
      <div id="testResults" class="test-results">
        <h3>Résultats des Tests</h3>
        <div id="connectionStatus" class="status-item"></div>
        <div id="websocketStatus" class="status-item"></div>
        <div id="osintToolsStatus" class="status-item"></div>
        <div id="aiEngineStatus" class="status-item"></div>
      </div>
      
      <div class="integration-summary">
        <h3>✅ Intégration Complète Réalisée</h3>
        <ul>
          <li>🎯 <strong>Port unifié 4011</strong> pour tout l'écosystème</li>
          <li>🤖 <strong>IA Qwen intégrée</strong> avec 17 outils OSINT</li>
          <li>🎨 <strong>Design Golden Ratio</strong> harmonieux</li>
          <li>💬 <strong>Chat temps réel</strong> via WebSocket</li>
          <li>📊 <strong>Documentation interactive</strong> complète</li>
        </ul>
      </div>
    `;
    
    document.getElementById('viewContainer').appendChild(container);
  }
  
  async testConnection() {
    const url = this.config.backendUrl;
    const statusDiv = document.getElementById('connectionStatus');
    
    this.updateStatus(statusDiv, 'warning', 'Test connexion...');
    
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) {
        const data = await response.json();
        this.config.status.connection = true;
        this.updateStatus(statusDiv, 'success', `✅ Connexion réussie - ${data.status}`);
      } else {
        this.updateStatus(statusDiv, 'error', `❌ Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      this.updateStatus(statusDiv, 'error', `❌ Connexion échouée: ${error.message}`);
    }
  }
  
  async testAIEngine() {
    const url = this.config.backendUrl;
    const statusDiv = document.getElementById('aiEngineStatus');
    
    this.updateStatus(statusDiv, 'warning', 'Test IA Qwen...');
    
    try {
      const response = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test système' })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.config.status.ai = true;
        this.updateStatus(statusDiv, 'success', `✅ IA Qwen opérationnelle`);
      } else {
        this.updateStatus(statusDiv, 'error', '❌ IA Qwen indisponible');
      }
    } catch (error) {
      this.updateStatus(statusDiv, 'error', `❌ Erreur IA: ${error.message}`);
    }
  }
  
  updateStatus(element, type, message) {
    element.innerHTML = `<span class="status-indicator status-${type}"></span>${message}`;
  }
  
  async runInitialTests() {
    setTimeout(() => {
      this.testConnection();
      setTimeout(() => this.testAIEngine(), 1000);
    }, 1000);
  }
}

// Instance globale
let backendConfig;