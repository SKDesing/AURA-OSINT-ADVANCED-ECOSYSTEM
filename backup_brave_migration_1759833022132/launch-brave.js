const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎯 TIKTOK LIVE ANALYSER                   ║
║                   Lanceur Brave Intégré                     ║
╚══════════════════════════════════════════════════════════════╝
`);

class BraveLauncher {
  constructor() {
    this.processes = [];
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
    try {
      const { getBraveExecutablePath } = require('./src/utils/getBravePath');
      const bravePath = getBraveExecutablePath();
      console.log(`✅ Brave Browser: ${bravePath}`);
    } catch (error) {
      console.log('⚠️ Brave Browser non trouvé, utilisation du navigateur par défaut');
    }

    console.log('✅ Vérification terminée\n');
  }

  async startProcessManager() {
    console.log('🎮 Démarrage du gestionnaire de processus...');
    
    const processManager = spawn('node', ['process-manager.js'], {
      cwd: __dirname,
      stdio: 'pipe'
    });

    processManager.stdout.on('data', (data) => {
      console.log(`[ProcessManager] ${data.toString().trim()}`);
    });

    processManager.stderr.on('data', (data) => {
      console.error(`[ProcessManager] ERROR: ${data.toString().trim()}`);
    });

    this.processes.push(processManager);
    
    // Attendre que le gestionnaire soit prêt
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Gestionnaire de processus démarré\n');
  }

  async startFrontend() {
    console.log('🎨 Démarrage du frontend React...');
    
    const frontend = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'frontend-react'),
      stdio: 'pipe'
    });

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('webpack compiled') || output.includes('Local:')) {
        console.log(`[Frontend] ${output.trim()}`);
      }
    });

    this.processes.push(frontend);
    
    // Attendre que le frontend soit prêt
    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log('✅ Frontend React démarré\n');
  }

  async openBrave() {
    console.log('🌐 Ouverture de Brave avec profil dédié...');
    
    try {
      const { getBraveExecutablePath } = require('./src/utils/getBravePath');
      const bravePath = getBraveExecutablePath();
      
      // Créer un profil dédié pour l'application
      const profileDir = path.join(__dirname, '.brave-profile');
      if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true });
      }

      // Ouvrir Brave avec profil dédié et onglet système
      const braveProcess = spawn(bravePath, [
        `--user-data-dir=${profileDir}`,
        '--new-window',
        'http://localhost:3000/system',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ], {
        detached: true,
        stdio: 'ignore'
      });

      braveProcess.unref();
      console.log('✅ Brave ouvert sur le dashboard système\n');
      
    } catch (error) {
      console.log('⚠️ Erreur ouverture Brave, tentative navigateur par défaut...');
      try {
        const { default: open } = await import('open');
        await open('http://localhost:3000/system');
        console.log('✅ Navigateur par défaut ouvert\n');
      } catch (fallbackError) {
        console.log('⚠️ Ouverture manuelle requise: http://localhost:3000/system\n');
      }
    }
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      console.log('\n🛑 Arrêt en cours...');
      
      this.processes.forEach((process, index) => {
        try {
          process.kill('SIGTERM');
          console.log(`✅ Processus ${index + 1} arrêté`);
        } catch (error) {
          console.log(`⚠️ Erreur arrêt processus ${index + 1}`);
        }
      });
      
      setTimeout(() => {
        console.log('👋 TikTok Live Analyser arrêté');
        process.exit(0);
      }, 2000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

  async start() {
    try {
      await this.checkDependencies();
      this.setupShutdownHandlers();
      
      await this.startProcessManager();
      await this.startFrontend();
      await this.openBrave();
      
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    ✅ SYSTÈME INTÉGRÉ DÉMARRÉ                ║
║                                                              ║
║  🎮 Process Manager: http://localhost:9999                   ║
║  🎯 Frontend:        http://localhost:3000                  ║
║  🌐 Dashboard:       http://localhost:3000/system           ║
║                                                              ║
║  📱 Tout contrôlable depuis Brave                           ║
║  🔒 Aucun terminal requis                                    ║
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
const launcher = new BraveLauncher();
launcher.start();