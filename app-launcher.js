const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('./config');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎯 TIKTOK LIVE ANALYSER                   ║
║                   Solution Forensique Pro                    ║
╚══════════════════════════════════════════════════════════════╝
`);

class AppLauncher {
  constructor() {
    this.processes = [];
    this.isShuttingDown = false;
  }

  async checkDependencies() {
    console.log('🔍 Vérification des dépendances...');
    
    // Vérifier Node.js
    try {
      const nodeVersion = process.version;
      console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      console.error('❌ Node.js non trouvé');
      process.exit(1);
    }

    // Vérifier Brave Browser
    if (fs.existsSync(config.browser.executablePath)) {
      console.log('✅ Brave Browser trouvé');
    } else {
      console.log('⚠️  Brave Browser non trouvé, utilisation de Chrome par défaut');
    }

    // Vérifier les dossiers
    const dirs = ['./evidence', './evidence/profiles', './evidence/screenshots', './evidence/raw'];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Dossier créé: ${dir}`);
      }
    }

    console.log('✅ Vérification terminée\n');
  }

  async startBackend() {
    console.log('🚀 Démarrage du backend...');
    
    const backend = spawn('node', ['enhanced-server.js'], {
      cwd: path.join(__dirname, 'live-tracker'),
      stdio: 'inherit'
    });

    backend.on('error', (error) => {
      console.error('❌ Erreur backend:', error.message);
    });

    backend.on('exit', (code) => {
      if (!this.isShuttingDown) {
        console.log(`⚠️  Backend arrêté avec le code: ${code}`);
      }
    });

    this.processes.push(backend);
    
    // Attendre que le backend soit prêt
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Backend démarré sur le port 4000\n');
  }

  async startFrontend() {
    console.log('🎨 Démarrage du frontend...');
    
    const frontend = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'frontend-react'),
      stdio: 'inherit'
    });

    frontend.on('error', (error) => {
      console.error('❌ Erreur frontend:', error.message);
    });

    frontend.on('exit', (code) => {
      if (!this.isShuttingDown) {
        console.log(`⚠️  Frontend arrêté avec le code: ${code}`);
      }
    });

    this.processes.push(frontend);
    
    // Attendre que le frontend soit prêt
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✅ Frontend démarré sur le port 3000\n');
  }

  async openBrowser() {
    console.log('🌐 Ouverture du navigateur...');
    
    try {
      const { default: open } = await import('open');
      await open('http://localhost:3000');
      console.log('✅ Navigateur ouvert\n');
    } catch (error) {
      console.log('⚠️  Ouverture manuelle requise: http://localhost:3000\n');
    }
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      
      console.log('\n🛑 Arrêt en cours...');
      
      this.processes.forEach((process, index) => {
        try {
          process.kill('SIGTERM');
          console.log(`✅ Processus ${index + 1} arrêté`);
        } catch (error) {
          console.log(`⚠️  Erreur arrêt processus ${index + 1}`);
        }
      });
      
      setTimeout(() => {
        console.log('👋 TikTok Live Analyser arrêté');
        process.exit(0);
      }, 2000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('exit', shutdown);
  }

  async start() {
    try {
      await this.checkDependencies();
      this.setupShutdownHandlers();
      
      await this.startBackend();
      await this.startFrontend();
      await this.openBrowser();
      
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    ✅ SYSTÈME DÉMARRÉ                        ║
║                                                              ║
║  🎯 Frontend: http://localhost:3000                          ║
║  🔧 Backend:  http://localhost:4000                          ║
║                                                              ║
║  📱 Interface utilisateur prête                              ║
║  🔒 Système forensique activé                                ║
║                                                              ║
║  Appuyez sur Ctrl+C pour arrêter                            ║
╚══════════════════════════════════════════════════════════════╝
      `);
      
      // Garder le processus vivant
      setInterval(() => {}, 1000);
      
    } catch (error) {
      console.error('❌ Erreur de démarrage:', error.message);
      process.exit(1);
    }
  }
}

// Démarrer l'application
const launcher = new AppLauncher();
launcher.start();