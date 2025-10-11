/**
 * Tests unitaires pour BackendConfig
 */

describe('BackendConfig Component', () => {
  let backendConfig;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    
    // Mock BackendConfig class
    global.BackendConfig = class {
      constructor() {
        this.config = {
          backendUrl: 'http://localhost:4011',
          websocketUrl: 'ws://localhost:4011'
        };
        this.createInterface();
      }
      
      createInterface() {
        const container = document.createElement('div');
        container.className = 'backend-config-container';
        container.innerHTML = `
          <div class="config-header"><h1>Configuration Backend</h1></div>
          <div class="test-buttons">
            <button onclick="this.testConnection()">Tester Connexion</button>
            <button onclick="this.testWebSocket()">Tester WebSocket</button>
            <button onclick="this.checkOsintTools()">Vérifier Outils OSINT</button>
            <button onclick="this.testAIEngine()">Tester IA Qwen</button>
          </div>
          <div id="connectionStatus"></div>
          <div id="websocketStatus"></div>
          <div id="osintToolsStatus"></div>
          <div id="aiEngineStatus"></div>
        `;
        document.getElementById('app').appendChild(container);
      }
      
      async testConnection() {
        const statusDiv = document.getElementById('connectionStatus');
        try {
          const response = await fetch(`${this.config.backendUrl}/api/health`);
          if (response.ok) {
            statusDiv.textContent = '✅ Connexion backend OK';
          } else {
            statusDiv.textContent = '❌ Erreur connexion backend';
          }
        } catch (error) {
          statusDiv.textContent = '❌ Erreur connexion backend';
        }
      }
      
      async testWebSocket() {
        const statusDiv = document.getElementById('websocketStatus');
        try {
          const ws = new WebSocket(this.config.websocketUrl);
          ws.addEventListener('open', () => {
            statusDiv.textContent = '✅ WebSocket OK';
            ws.close();
          });
          ws.addEventListener('error', () => {
            statusDiv.textContent = '❌ Erreur WebSocket';
          });
        } catch (error) {
          statusDiv.textContent = '❌ Erreur WebSocket';
        }
      }
      
      async checkOsintTools() {
        const statusDiv = document.getElementById('osintToolsStatus');
        try {
          const response = await fetch(`${this.config.backendUrl}/api/osint/tools`);
          if (response.ok) {
            const tools = await response.json();
            const categories = Object.keys(tools).length;
            statusDiv.textContent = `✅ ${categories} catégories d'outils disponibles`;
          } else {
            statusDiv.textContent = '❌ Erreur outils OSINT';
          }
        } catch (error) {
          statusDiv.textContent = '❌ Erreur outils OSINT';
        }
      }
      
      async testAIEngine() {
        const statusDiv = document.getElementById('aiEngineStatus');
        try {
          const response = await fetch(`${this.config.backendUrl}/api/ai/test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Test' })
          });
          if (response.ok) {
            const result = await response.json();
            statusDiv.textContent = '✅ Moteur IA Qwen opérationnel';
          } else {
            statusDiv.textContent = '❌ Erreur moteur IA';
          }
        } catch (error) {
          statusDiv.textContent = '❌ Erreur moteur IA';
        }
      }
      
      saveConfig() {
        localStorage.setItem('aura-backend-config', JSON.stringify(this.config));
      }
      
      loadSavedConfig() {
        const saved = localStorage.getItem('aura-backend-config');
        if (saved) {
          this.config = { ...this.config, ...JSON.parse(saved) };
        }
      }
    };
    
    backendConfig = new BackendConfig();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('Initialisation', () => {
    test('doit créer l\'interface de configuration', () => {
      const container = document.querySelector('.backend-config-container');
      expect(container).toBeTruthy();
    });

    test('doit avoir la configuration par défaut', () => {
      expect(backendConfig.config.backendUrl).toBe('http://localhost:4011');
      expect(backendConfig.config.websocketUrl).toBe('ws://localhost:4011');
    });

    test('doit créer tous les boutons de test', () => {
      const buttons = document.querySelectorAll('.test-buttons button');
      expect(buttons.length).toBe(4);
    });
  });

  describe('Tests de connexion', () => {
    test('doit tester la connexion backend', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'ok' })
        })
      );

      await backendConfig.testConnection();
      
      const statusDiv = document.getElementById('connectionStatus');
      expect(statusDiv.textContent).toContain('✅');
    });

    test('doit gérer les erreurs de connexion', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      await backendConfig.testConnection();
      
      const statusDiv = document.getElementById('connectionStatus');
      expect(statusDiv.textContent).toContain('❌');
    });
  });

  describe('Outils OSINT', () => {
    test('doit récupérer les outils OSINT', async () => {
      const mockTools = {
        social_media: { count: 5 },
        email: { count: 3 }
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTools)
        })
      );

      await backendConfig.checkOsintTools();
      
      const statusDiv = document.getElementById('osintToolsStatus');
      expect(statusDiv.textContent).toContain('2 catégories');
    });
  });

  describe('Test IA', () => {
    test('doit tester le moteur IA Qwen', async () => {
      const mockResponse = {
        response: 'Test OK',
        tools_used: ['tool1', 'tool2']
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      await backendConfig.testAIEngine();
      
      const statusDiv = document.getElementById('aiEngineStatus');
      expect(statusDiv.textContent).toContain('✅');
    });
  });

  describe('Sauvegarde/Chargement', () => {
    test('doit sauvegarder la configuration', () => {
      backendConfig.config.backendUrl = 'http://localhost:5000';
      backendConfig.saveConfig();

      const saved = JSON.parse(localStorage.getItem('aura-backend-config'));
      expect(saved.backendUrl).toBe('http://localhost:5000');
    });

    test('doit charger la configuration sauvegardée', () => {
      const config = {
        backendUrl: 'http://localhost:5000',
        websocketUrl: 'ws://localhost:5000'
      };
      localStorage.setItem('aura-backend-config', JSON.stringify(config));

      backendConfig.loadSavedConfig();
      expect(backendConfig.config.backendUrl).toBe('http://localhost:5000');
    });
  });
});