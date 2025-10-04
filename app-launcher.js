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
      
      // 3. Lancer Chromium avec interface web
      await this.launchBrowser('http://localhost:3001');
      
    } catch (error) {
      console.log('⚠️ Problème avec les services, lancement en mode local...');
      
      try {
        // Lancer Chromium avec fichier HTML local
        await this.launchBrowser(`file://${__dirname}/frontend/index.html`);
      } catch (browserError) {
        console.error('❌ Impossible de lancer le navigateur:', browserError);
      }
    }
  }

  async startServices() {
    console.log('📦 Démarrage des services...');
    
    // Nettoyer d'abord
    spawn('docker', ['rm', '-f', 'aura_frontend_manual'], { stdio: 'ignore' });
    
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn('docker-compose', ['up', '-d'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      dockerProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Services Docker démarrés');
          resolve();
        } else {
          reject(new Error(`Docker failed with code ${code}`));
        }
      });
    });
  }

  async waitForServices() {
    console.log('⏳ Attente des services...');
    
    // Attendre le backend
    await this.waitForService('http://localhost:3002/', 'Backend');
    
    // Attendre le frontend (plus de temps car compilation)
    await this.waitForService('http://localhost:3001/', 'Frontend', 60000);
  }

  async waitForService(url, serviceName, timeout = 30000) {
    console.log(`⏳ Attente de ${serviceName}...`);
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`✅ ${serviceName} prêt`);
          return;
        }
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error(`${serviceName} n'a pas démarré dans les ${timeout / 1000} secondes`);
  }

  async launchBrowser(url) {
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
    await page.goto(url);
    
    if (url.startsWith('file://')) {
      console.log('✅ AURA lancé en mode local');
    } else {
      console.log('✅ AURA lancé en mode web');
    }
    console.log('🎯 Interface disponible dans Chromium');
    
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