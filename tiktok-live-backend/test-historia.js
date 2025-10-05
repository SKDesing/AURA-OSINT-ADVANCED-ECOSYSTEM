// Test direct avec Historia Med
const puppeteer = require('puppeteer');

async function testHistoriaMed() {
    console.log('🧪 Test Historia Med avec Brave...');
    
    try {
        const browser = await puppeteer.launch({
            executablePath: '/snap/bin/brave',
            headless: false,
            userDataDir: '/tmp/brave-test',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Injection du script de capture
        await page.evaluateOnNewDocument(() => {
            console.log('🎯 Script injecté');
            
            const OriginalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                const ws = new OriginalWebSocket(url, protocols);
                
                ws.addEventListener('message', function(event) {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'msg' && data.data?.content) {
                            console.log('💬 Commentaire:', data.data.nickname, ':', data.data.content);
                        }
                    } catch (e) {}
                });
                
                return ws;
            };
        });
        
        console.log('🎯 Navigation vers Historia Med...');
        await page.goto('https://www.tiktok.com/@historia_med/live');
        
        console.log('✅ Test en cours - Regardez la console du navigateur');
        console.log('⏳ Attente 60 secondes...');
        
        await page.waitForTimeout(60000);
        
        await browser.close();
        console.log('🏁 Test terminé');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

testHistoriaMed();