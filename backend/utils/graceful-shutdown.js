// Graceful shutdown handler for AURA backend
module.exports = function attachGracefulShutdown(server) {
  const shutdown = (sig) => () => {
    console.log(`[shutdown] ${sig} reçu, arrêt propre...`);
    server.close(() => {
      console.log('[shutdown] HTTP server fermé');
      process.exit(0);
    });
    // Force quit après délai
    setTimeout(() => process.exit(1), 5000).unref();
  };
  
  process.on('SIGINT', shutdown('SIGINT'));
  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('uncaughtException', (e) => {
    console.error('[fatal] uncaughtException', e);
    shutdown('uncaughtException')();
  });
  process.on('unhandledRejection', (r) => {
    console.error('[fatal] unhandledRejection', r);
    shutdown('unhandledRejection')();
  });
};