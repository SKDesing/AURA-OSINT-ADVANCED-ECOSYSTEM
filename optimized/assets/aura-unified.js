// AURA OSINT - JavaScript Unifié
window.AURA = {
  config: {
    apiBaseUrl: 'http://localhost:4011',
    wsUrl: 'ws://localhost:4011'
  },
  
  ws: null,
  
  init() {
    this.initWebSocket();
  },
  
  initWebSocket() {
    this.ws = new WebSocket(this.config.wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connecté à AURA OSINT');
      this.showNotification('Connecté à AURA OSINT', 'success');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket déconnecté');
      setTimeout(() => this.initWebSocket(), 3000);
    };
  },
  
  handleMessage(data) {
    switch (data.type) {
      case 'notification':
        this.showNotification(data.message, data.level);
        break;
      case 'investigation_update':
        this.updateInvestigation(data.investigation);
        break;
    }
  },
  
  async apiCall(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`${this.config.apiBaseUrl}${endpoint}`, options);
    return await response.json();
  },
  
  async startInvestigation(target, targetType) {
    const investigation = await this.apiCall('/api/osint/investigate', 'POST', {
      target, target_type: targetType
    });
    
    this.showNotification('Investigation démarrée', 'success');
    return investigation;
  },
  
  showNotification(message, level = 'info') {
    if (window.Swal) {
      window.Swal.fire({
        icon: level,
        title: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => window.AURA.init());
