const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AuraAppLauncher {
  constructor() {
    this.browser = null;
    this.backendProcess = null;
    this.services = [];
  }

  async launch() {
    console.log('🚀 Lancement de AURA - TikTok Live Analyser');
    
    try {
      // 1. Démarrer les services Docker
      await this.startServices();
      
      // 2. Attendre que les services soient prêts
      await this.waitForServices();
      
      // 3. Lancer Chromium avec l'interface
      await this.launchBrowser();
      
    } catch (error) {
      console.error('❌ Erreur lors du lancement:', error);
      await this.cleanup();
    }
  }

  async startServices() {
    console.log('📦 Démarrage des services Docker...');
    
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn('docker-compose', ['up', '-d'], {
        stdio: 'pipe',
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
    
    // Attendre que le backend soit prêt
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
  }

  async launchBrowser() {
    console.log('🌐 Lancement de Chromium...');
    
    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const context = await this.browser.newContext({
      viewport: null // Utilise la taille de la fenêtre
    });

    const page = await context.newPage();
    
    // Charger l'interface AURA
    await page.goto('http://localhost:3001');
    
    console.log('✅ AURA lancé dans Chromium');
    console.log('🎯 Interface disponible dans le navigateur');
    
    // Gérer la fermeture
    this.browser.on('disconnected', () => {
      console.log('🔴 Navigateur fermé');
      this.cleanup();
    });

    // Maintenir l'application en vie
    process.on('SIGINT', () => {
      console.log('\\n🛑 Arrêt de AURA...');
      this.cleanup();
    });
  }

  async cleanup() {
    console.log('🧹 Nettoyage...');
    
    if (this.browser) {
      await this.browser.close();
    }

    // Arrêter les services Docker
    spawn('docker-compose', ['down'], {
      stdio: 'inherit',
      cwd: __dirname
    });

    process.exit(0);
  }
}

// Lancement de l'application
const launcher = new AuraAppLauncher();
launcher.launch().catch(console.error);