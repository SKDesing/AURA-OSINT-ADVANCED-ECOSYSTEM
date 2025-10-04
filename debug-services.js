// Script de debug pour vérifier l'état des services
const { spawn } = require('child_process');

async function checkServices() {
  console.log('🔍 Vérification des services...');
  
  // Vérifier l'état des containers
  const psProcess = spawn('docker-compose', ['ps'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  psProcess.on('close', async () => {
    console.log('\n📋 Logs du frontend:');
    const logsProcess = spawn('docker-compose', ['logs', 'aura_frontend'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    logsProcess.on('close', async () => {
      console.log('\n🌐 Test de connexion:');
      
      // Tester les URLs
      const urls = [
        'http://localhost:3001',
        'http://localhost:3002'
      ];
      
      for (const url of urls) {
        try {
          const response = await fetch(url);
          console.log(`✅ ${url} - Status: ${response.status}`);
        } catch (error) {
          console.log(`❌ ${url} - Error: ${error.message}`);
        }
      }
    });
  });
}

checkServices();