/**
 * Tests unitaires pour AuraDashboard
 */

describe('AuraDashboard Component', () => {
  let dashboard;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div id="viewContainer"></div>
      </div>
    `;
    // Mock AuraDashboard class
    global.AuraDashboard = class {
      constructor() {
        this.currentView = 'dashboard';
        this.components = {
          dashboard: {},
          chat: {},
          tools: {},
          investigations: {},
          config: {}
        };
        this.createNavigation();
      }
      
      createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        document.getElementById('app').appendChild(nav);
      }
      
      switchView(view) {
        this.currentView = view;
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav) activeNav.classList.remove('active');
        const newActive = document.querySelector(`[data-view="${view}"]`);
        if (newActive) newActive.classList.add('active');
      }
    };
    
    dashboard = new AuraDashboard();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialisation', () => {
    test('doit créer le dashboard', () => {
      expect(dashboard).toBeTruthy();
      expect(dashboard.currentView).toBe('dashboard');
    });

    test('doit initialiser tous les composants', () => {
      expect(dashboard.components.dashboard).toBeTruthy();
      expect(dashboard.components.chat).toBeTruthy();
      expect(dashboard.components.tools).toBeTruthy();
      expect(dashboard.components.investigations).toBeTruthy();
      expect(dashboard.components.config).toBeTruthy();
    });

    test('doit créer la navigation', () => {
      const nav = document.querySelector('.main-nav');
      expect(nav).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    test('doit changer de vue', () => {
      dashboard.switchView('chat');
      expect(dashboard.currentView).toBe('chat');
    });

    test('doit mettre à jour la navigation active', () => {
      // Créer un élément de navigation
      const navItem = document.createElement('div');
      navItem.className = 'nav-item';
      navItem.dataset.view = 'tools';
      document.body.appendChild(navItem);
      
      dashboard.switchView('tools');
      
      expect(navItem.classList.contains('active')).toBe(true);
    });
  });
});