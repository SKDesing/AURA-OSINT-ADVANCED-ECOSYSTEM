// 🚨 AURA Background - Intelligence artificielle
console.log('🔥 AURA Stealth Background activé');

let isCapturing = false;
let liveDetected = false;

// Auto-authentification Google au démarrage
chrome.runtime.onStartup.addListener(async () => {
    await autoAuthGoogle();
});

chrome.runtime.onInstalled.addListener(async () => {
    await autoAuthGoogle();
});

// Authentification Google automatique
async function autoAuthGoogle() {
    try {
        const token = await chrome.identity.getAuthToken({
            interactive: false,
            scopes: ['openid', 'email', 'profile']
        });
        
        if (token) {
            console.log('✅ Google Auth automatique réussie');
            
            // Injection token dans TikTok
            chrome.tabs.query({url: "*://*.tiktok.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'auth_ready',
                        token: token
                    }).catch(() => {});
                });
            });
        }
    } catch (error) {
        console.log('⚠️ Auth Google requise');
    }
}

// Détection intelligente TikTok Live
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.url.includes('live') || details.url.includes('webcast')) {
            if (!liveDetected) {
                liveDetected = true;
                notifyLiveDetected(details.url);
            }
        }
    },
    {urls: ["*://*.tiktok.com/*"]},
    ["requestBody"]
);

// Notification live détecté
function notifyLiveDetected(url) {
    chrome.notifications.create('aura-live-' + Date.now(), {
        type: 'basic',
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        title: '🔴 AURA - Live TikTok Détecté',
        message: 'Nouveau live disponible pour extraction forensique'
    });
    
    // Message vers content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'live_detected',
                url: url
            }).catch(() => {});
        }
    });
}

// Gestion clics notifications
chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId.includes('aura-live')) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'show_capture_prompt'
            }).catch(() => {});
        });
    }
});
