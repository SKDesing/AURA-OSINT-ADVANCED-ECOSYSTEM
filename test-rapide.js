// Test rapide sans Playwright
const fetch = require('node-fetch');

const services = [
  { name: "GUI", url: "http://localhost:3000" },
  { name: "API Analytics", url: "http://localhost:4002/api/status" },
  { name: "Frontend React", url: "http://localhost:3002" }
];

async function testService(service) {
  try {
    const response = await fetch(service.url, { timeout: 5000 });
    const status = response.status;
    
    if (response.ok) {
      console.log(`✅ ${service.name}: OK (${status})`);
      
      if (service.name === "API Analytics") {
        const json = await response.json();
        console.log(`   Status: ${json.status || 'unknown'}`);
      }
    } else {
      console.log(`⚠️  ${service.name}: HTTP ${status}`);
    }
  } catch (error) {
    console.log(`❌ ${service.name}: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 TEST RAPIDE ÉCOSYSTÈME AURA');
  console.log('==============================');
  
  for (const service of services) {
    await testService(service);
  }
  
  console.log('\n🎯 Test terminé');
}

runTests();