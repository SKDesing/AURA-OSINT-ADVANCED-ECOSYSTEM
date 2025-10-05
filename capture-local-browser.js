const { chromium } = require('playwright');
const { exec } = require('child_process');

async function captureWithLocalBrowser() {
  console.log('🌐 Ouverture de ton Chromium local...');
  
  // Ouvrir Brave local avec debugging activé
  const braveCommand = '/snap/bin/brave --remote-debugging-port=9222 --user-data-dir=/tmp/brave-debug https://www.tiktok.com/@historia_med/live';
  
  exec(braveCommand, (error) => {
    if (error) {
      console.log('⚠️ Brave non trouvé:', error.message);
    } else {
      console.log('✅ Brave lancé avec succès');
    }
  });
  
  console.log('⏳ Attente que Chromium se lance...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    // Se connecter au Chromium local via CDP
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts[0] || await browser.newContext();
    const pages = context.pages();
    const page = pages[0] || await context.newPage();
    
    console.log('🔗 Connecté à ton Brave local !');
    
    let commentCount = 0;
    
    // Écouter les WebSockets
    page.on('websocket', ws => {
      console.log('📡 WebSocket TikTok détecté');
      
      ws.on('framereceived', event => {
        try {
          const data = JSON.parse(event.payload);
          
          if (data.type === 'msg' && data.data?.content) {
            commentCount++;
            console.log(`💬 [${commentCount}] ${data.data.nickname}: ${data.data.content}`);
            
            // Envoyer au backend
            sendToBackend({
              username: data.data.nickname,
              content: data.data.content,
              is_moderator: data.data.user_badge_list?.some(b => b.type === 'moderator') || false,
              is_owner: data.data.user_badge_list?.some(b => b.type === 'owner') || false,
              is_vip: data.data.user_badge_list?.some(b => b.type === 'vip') || false,
              timestamp: Date.now()
            });
          }
          
          if (data.type === 'gift') {
            console.log(`🎁 Cadeau: ${data.data.gift?.name} de ${data.data.user?.nickname}`);
          }
          
          if (data.type === 'member') {
            console.log(`👥 Spectateurs: ${data.data.total_user || 'N/A'}`);
          }
          
        } catch (e) {
          // Ignore
        }
      });
    });
    
    console.log('✅ Capture active dans ton navigateur !');
    console.log('🎯 Va sur le live TikTok dans ton navigateur');
    console.log('📊 Les données seront capturées automatiquement');
    
    // Maintenir la connexion
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error.message);
    console.log('💡 Assure-toi que Brave est ouvert avec --remote-debugging-port=9222');
  }
}

async function sendToBackend(commentData) {
  try {
    const response = await fetch('http://localhost:3002/api/sessions/17/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    console.log('📤 Commentaire envoyé au backend');
  } catch (error) {
    console.log('❌ Erreur backend:', error.message);
  }
}

captureWithLocalBrowser();