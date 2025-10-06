const StealthProxy = require('./stealth-proxy');

console.log('🧪 Testing Stealth Proxy...');

const proxy = new StealthProxy(8888);

try {
  const server = proxy.start();
  console.log('✅ Proxy started successfully');
  
  setTimeout(() => {
    server.close();
    console.log('✅ Proxy stopped');
    process.exit(0);
  }, 2000);
  
} catch (error) {
  console.error('❌ Proxy failed:', error.message);
  process.exit(1);
}