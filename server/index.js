const express = require('express');
const path = require('path');
const config = require('./config/ports.json');

class AuraUnifiedServer {
  constructor() {
    this.servers = {};
  }

  createBackend() {
    const app = express();
    app.use(express.json());
    
    // Routes API
    app.get('/health', (req, res) => res.json({ status: 'ok', service: 'backend' }));
    
    const port = config.backend;
    this.servers.backend = app.listen(port, () => {
      console.log(`✅ Backend API: http://localhost:${port}`);
    });
  }

  createFrontend() {
    const app = express();
    app.use(express.static(path.join(__dirname, '../clients/web/frontend/dist')));
    
    const port = config.frontend;
    this.servers.frontend = app.listen(port, () => {
      console.log(`✅ Frontend: http://localhost:${port}`);
    });
  }

  createMarketing() {
    const app = express();
    app.use(express.static(path.join(__dirname, '../marketing/sites/vitrine-aura-advanced-osint-ecosystem/dist')));
    
    const port = config.vitrine;
    this.servers.marketing = app.listen(port, () => {
      console.log(`✅ Marketing: http://localhost:${port}`);
    });
  }

  async startAll() {
    console.log('🚀 Démarrage serveurs AURA OSINT...\n');
    
    try {
      this.createBackend();
      this.createFrontend();
      this.createMarketing();
      
      console.log('\n✅ Tous les serveurs démarrés!');
      console.log('\n📋 Accès:');
      console.log(`   Backend:   http://localhost:${config.backend}`);
      console.log(`   Frontend:  http://localhost:${config.frontend}`);
      console.log(`   Marketing: http://localhost:${config.vitrine}`);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      this.stopAll();
      process.exit(1);
    }
  }

  stopAll() {
    Object.keys(this.servers).forEach(name => {
      if (this.servers[name]) {
        this.servers[name].close();
        console.log(`🛑 ${name} arrêté`);
      }
    });
  }
}

module.exports = AuraUnifiedServer;

if (require.main === module) {
  const server = new AuraUnifiedServer();
  server.startAll();
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt serveurs...');
    server.stopAll();
    process.exit(0);
  });
}
