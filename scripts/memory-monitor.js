// Memory monitoring pour server.js
const memoryMonitor = setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(memoryUsage.rss / 1024 / 1024);

  console.log(`📊 Memory Usage:
    Heap Used: ${heapUsedMB}MB
    Heap Total: ${heapTotalMB}MB  
    RSS: ${rssMB}MB`);

  // Seuil critique
  if (heapUsedMB > 1500) {
    console.error('🚨 MEMORY LEAK DETECTED! Heap:', heapUsedMB, 'MB');
    console.error('Restarting process...');
    process.exit(1); // PM2 va redémarrer automatiquement
  }
}, 30000); // Toutes les 30 secondes

// Gestion warnings Node.js
process.on('warning', (warning) => {
  console.warn('⚠️ Node.js Warning:', warning.name, warning.message);
});

// Nettoyage à l'arrêt
process.on('SIGINT', () => {
  console.log('🛑 Arrêt du monitoring mémoire...');
  clearInterval(memoryMonitor);
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM reçu, nettoyage...');
  clearInterval(memoryMonitor);
  process.exit();
});

module.exports = { memoryMonitor };
