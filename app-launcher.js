const { chromium } = require('playwright');
const { spawn } = require('child_process');

class AuraAppLauncher {
  constructor() {
    this.browser = null;
  }

  async launch() {
    console.log('🚀 Lancement de AURA - TikTok Live Analyser');
    
    try {
      // 1. Démarrer les services Docker
      await this.startServices();
      
      // 2. Attendre que les services soient prêts
      await this.waitForServices();
      
      // 3. Lancer Chromium
      await this.launchBrowser();
      
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }

  async startServices() {
    console.log('📦 Démarrage des services...');
    
    // Nettoyer d'abord
    spawn('docker', ['rm', '-f', 'aura_frontend_manual'], { stdio: 'ignore' });
    
    return new Promise((resolve) => {
      const dockerProcess = spawn('docker-compose', ['up', '-d'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      dockerProcess.on('close', (code) => {
        console.log('✅ Services démarrés');
        resolve();
      });
    });
  }

  async waitForServices() {
    console.log('⏳ Attente des services...');
    
    // Attendre le backend
    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch('http://localhost:3002/');
        if (response.ok) {
          console.log('✅ Backend prêt');
          break;
        }
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Attendre le frontend
    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch('http://localhost:3001/');
        if (response.ok) {
          console.log('✅ Frontend prêt');
          break;
        }
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async launchBrowser() {
    console.log('🌐 Lancement de Chromium...');
    
    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--no-sandbox'
      ]
    });

    const context = await this.browser.newContext({
      viewport: null
    });

    const page = await context.newPage();
    
    // Charger l'interface AURA
    await page.goto('http://localhost:3001');
    
    console.log('✅ AURA lancé dans Chromium');
    console.log('🎯 Interface disponible');
    
    // Gérer la fermeture
    this.browser.on('disconnected', () => {
      console.log('🔴 Navigateur fermé');
      this.cleanup();
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt...');
      this.cleanup();
    });
    
    // Maintenir en vie
    await new Promise(() => {});
  }

  cleanup() {
    if (this.browser) {
      this.browser.close();
    }
    
    // Arrêter Docker
    spawn('docker-compose', ['down'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    setTimeout(() => process.exit(0), 2000);
  }
}

const launcher = new AuraAppLauncher();
launcher.launch().catch(console.error);