const { chromium } = require('playwright');

async function testDirectCapture() {
  console.log('🧪 Test direct de capture TikTok...');
  
  try {
    console.log('🌐 Lancement de Chromium...');
    const browser = await chromium.launch({
      headless: false, // Mode visible pour debug
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('📡 Configuration des listeners WebSocket...');
    page.on('websocket', ws => {
      console.log('🔗 WebSocket connecté:', ws.url());
      
      ws.on('framereceived', event => {
        try {
          const data = JSON.parse(event.payload);
          if (data.type === 'msg' && data.data?.content) {
            console.log('💬 Commentaire capturé:', {
              user: data.data.nickname,
              message: data.data.content,
              badges: data.data.user_badge_list
            });
          } else if (data.type === 'gift') {
            console.log('🎁 Cadeau capturé:', data.data);
          } else if (data.type === 'member') {
            console.log('👥 Spectateurs:', data.data);
          }
        } catch (e) {
          // Ignore non-JSON messages
        }
      });
    });

    console.log('🎯 Navigation vers TikTok Live...');
    await page.goto('https://www.tiktok.com/@historia_med/live');
    
    console.log('⏳ Attente du chargement...');
    await page.waitForTimeout(10000);
    
    console.log('✅ Capture active - Appuyez sur Ctrl+C pour arrêter');
    
    // Maintenir la capture active
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testDirectCapture();