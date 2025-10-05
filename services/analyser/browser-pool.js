const puppeteer = require('puppeteer-core');

class BrowserPool {
  constructor(poolSize = 3) {
    this.poolSize = poolSize;
    this.browsers = [];
    this.available = [];
    this.busy = [];
  }

  async initialize() {
    console.log(`🚀 Initialisation du pool de ${this.poolSize} navigateurs...`);
    
    for (let i = 0; i < this.poolSize; i++) {
      const browser = await puppeteer.launch({
        executablePath: process.env.BRAVE_PATH || '/usr/bin/brave-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
      
      this.browsers.push(browser);
      this.available.push(browser);
    }
    
    console.log(`✅ Pool de navigateurs initialisé (${this.poolSize} instances)`);
  }

  async getBrowser() {
    if (this.available.length === 0) {
      throw new Error('Aucun navigateur disponible dans le pool');
    }
    
    const browser = this.available.pop();
    this.busy.push(browser);
    
    // Créer un contexte incognito pour isolation
    const context = await browser.createIncognitoBrowserContext();
    return { browser, context };
  }

  async releaseBrowser(browser, context) {
    // Fermer le contexte incognito
    await context.close();
    
    // Remettre le navigateur dans le pool
    const index = this.busy.indexOf(browser);
    if (index > -1) {
      this.busy.splice(index, 1);
      this.available.push(browser);
    }
  }

  async destroy() {
    console.log('🔄 Fermeture du pool de navigateurs...');
    
    for (const browser of this.browsers) {
      await browser.close();
    }
    
    this.browsers = [];
    this.available = [];
    this.busy = [];
    
    console.log('✅ Pool de navigateurs fermé');
  }

  getStats() {
    return {
      total: this.browsers.length,
      available: this.available.length,
      busy: this.busy.length
    };
  }
}

module.exports = BrowserPool;