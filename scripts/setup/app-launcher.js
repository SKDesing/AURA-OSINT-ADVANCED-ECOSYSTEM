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
    console.log('🔍 Vérification des dépendances et services...');
    
    // Vérifier Node.js
    try {
      const nodeVersion = process.version;
      console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      console.error('❌ Node.js non trouvé');
      process.exit(1);
    }

    // Vérifier chromium Browser
    if (fs.existsSync(config.browser.executablePath)) {
      console.log('✅ chromium Browser trouvé');
    } else {
      console.log('⚠️  chromium Browser non trouvé, utilisation de Chrome par défaut');
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

  async startAllServices() {
    console.log('🚀 Démarrage de tous les services dans des fenêtres séparées...');
    
    const services = [
      { name: 'Backend Principal', cmd: 'node', args: ['enhanced-server.js'], cwd: 'live-tracker', port: 4000 },
      { name: 'Service Analyser', cmd: 'node', args: ['server.js'], cwd: 'services/analyser', port: 3002 },
      { name: 'Service Profiles', cmd: 'node', args: ['server.js'], cwd: 'services/profiles', port: 3003 },
      { name: 'Service Lives', cmd: 'node', args: ['server.js'], cwd: 'services/lives', port: 3004 },
      { name: 'Service Create', cmd: 'node', args: ['server.js'], cwd: 'services/create', port: 3005 },
      { name: 'Service Database', cmd: 'node', args: ['server.js'], cwd: 'services/database', port: 3006 },
      { name: 'Service Reports', cmd: 'node', args: ['server.js'], cwd: 'services/reports', port: 3007 },
      { name: 'Service Forensic', cmd: 'node', args: ['server.js'], cwd: 'services/forensic-integration', port: 3008 }
    ];

    for (const service of services) {
      try {
        console.log(`🔄 Ouverture ${service.name} dans une nouvelle fenêtre...`);
        
        const servicePath = path.join(__dirname, service.cwd);
        const command = `cd "${servicePath}" && ${service.cmd} ${service.args.join(' ')}`;
        
        // Ouvrir dans une nouvelle fenêtre de terminal
        const process = spawn('gnome-terminal', [
          '--title', `${service.name} - Port ${service.port}`,
          '--', 'bash', '-c', 
          `echo "🚀 Démarrage ${service.name} sur le port ${service.port}"; ${command}; echo "\n❌ Service arrêté - Appuyez sur Entrée pour fermer"; read`
        ], {
          detached: true,
          stdio: 'ignore'
        });

        process.unref();
        console.log(`✅ ${service.name} ouvert dans une nouvelle fenêtre (port ${service.port})`);
        
        // Pause entre les ouvertures
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Impossible d'ouvrir ${service.name}:`, error.message);
      }
    }
    
    console.log('\n✅ Tous les services sont ouverts dans des fenêtres séparées\n');
  }

  async startFrontend() {
    console.log('🎨 Ouverture du frontend dans une nouvelle fenêtre...');
    
    try {
      const frontendPath = path.join(__dirname, 'frontend-react');
      
      // Ouvrir le frontend dans une nouvelle fenêtre
      const process = spawn('gnome-terminal', [
        '--title', 'Frontend React - Port 3000',
        '--', 'bash', '-c',
        `cd "${frontendPath}" && echo "🎨 Démarrage Frontend React sur le port 3000" && npm start; echo "\n❌ Frontend arrêté - Appuyez sur Entrée pour fermer"; read`
      ], {
        detached: true,
        stdio: 'ignore'
      });

      process.unref();
      console.log('✅ Frontend ouvert dans une nouvelle fenêtre (port 3000)\n');
      
      // Attendre que le frontend soit prêt
      await new Promise(resolve => setTimeout(resolve, 8000));
      
    } catch (error) {
      console.error('❌ Impossible d\'ouvrir le frontend:', error.message);
    }
  }

  async openBrowser() {
    console.log('🌐 Ouverture du navigateur chromium...');
    
    try {
      const { getchromiumExecutablePath } = require('./src/utils/getchromiumPath');
      const { spawn } = require('child_process');
      
      const chromiumPath = getchromiumExecutablePath();
      spawn(chromiumPath, ['http://localhost:3000'], { detached: true, stdio: 'ignore' });
      console.log('✅ chromium Browser ouvert\n');
    } catch (error) {
      console.log('⚠️  Erreur ouverture chromium, tentative navigateur par défaut...');
      try {
        const { default: open } = await import('open');
        await open('http://localhost:3000');
        console.log('✅ Navigateur par défaut ouvert\n');
      } catch (fallbackError) {
        console.log('⚠️  Ouverture manuelle requise: http://localhost:3000\n');
      }
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
      
      await this.startAllServices();
      await this.startFrontend();
      await this.openBrowser();
      
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    ✅ ARCHITECTURE COMPLÈTE DÉMARRÉE                ║
║                                                              ║
║  🎯 Frontend:        http://localhost:3000                  ║
║  🔧 Backend:         http://localhost:4000                  ║
║  📊 Service Analyser: http://localhost:3002                  ║
║  👥 Service Profiles: http://localhost:3003                  ║
║  🎥 Service Lives:    http://localhost:3004                  ║
║  ➕ Service Create:    http://localhost:3005                  ║
║  🗄️ Service Database: http://localhost:3006                  ║
║  📋 Service Reports:  http://localhost:3007                  ║
║  🔍 Service Forensic: http://localhost:3008                  ║
║                                                              ║
║  📱 Interface utilisateur centralisée                        ║
║  🔒 Architecture microservices active                        ║
║                                                              ║
║  Appuyez sur Ctrl+C pour arrêter                            ║
╚══════════════════════════════════════════════════════════════╝
      `);
      
      // Garder le processus principal vivant
      console.log('\n🎮 Contrôleur principal actif - Tous les services tournent dans des fenêtres séparées');
      console.log('📋 Utilisez Ctrl+C pour arrêter le contrôleur (les services continueront)');
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