const { chromium } = require('playwright');

async function testWithData() {
  console.log('🧪 Test capture avec données réelles...');
  
  try {
    const browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    let commentCount = 0;
    let giftCount = 0;
    let viewerUpdates = 0;

    page.on('websocket', ws => {
      console.log('🔗 WebSocket TikTok connecté');
      
      ws.on('framereceived', event => {
        try {
          const data = JSON.parse(event.payload);
          
          if (data.type === 'msg' && data.data?.content) {
            commentCount++;
            console.log(`💬 [${commentCount}] ${data.data.nickname}: ${data.data.content}`);
            
            // Envoyer au backend
            sendToBackend('comment', {
              username: data.data.nickname,
              content: data.data.content,
              is_moderator: data.data.user_badge_list?.some(b => b.type === 'moderator') || false,
              is_owner: data.data.user_badge_list?.some(b => b.type === 'owner') || false,
              is_vip: data.data.user_badge_list?.some(b => b.type === 'vip') || false,
              timestamp: Date.now()
            });
          }
          
          if (data.type === 'gift') {
            giftCount++;
            console.log(`🎁 [${giftCount}] Cadeau: ${data.data.gift?.name} de ${data.data.user?.nickname}`);
          }
          
          if (data.type === 'member' || data.type === 'room_user_seq') {
            viewerUpdates++;
            console.log(`👥 [${viewerUpdates}] Spectateurs: ${data.data.total_user || data.data.total || 'N/A'}`);
          }
          
        } catch (e) {
          // Ignore
        }
      });
    });

    await page.goto('https://www.tiktok.com/@historia_med/live');
    console.log('🎯 Page chargée, capture en cours...');
    
    // Attendre 60 secondes pour capturer des données
    await page.waitForTimeout(60000);
    
    console.log(`📊 Résultats: ${commentCount} commentaires, ${giftCount} cadeaux, ${viewerUpdates} mises à jour spectateurs`);
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

async function sendToBackend(type, data) {
  try {
    const response = await fetch('http://localhost:3002/api/sessions/17/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: type, data })
    });
    console.log(`📤 Envoyé au backend: ${type}`);
  } catch (error) {
    console.log(`❌ Erreur envoi: ${error.message}`);
  }
}

testWithData();