// ============================================
// 🎯 AURA OSINT - CONTENT SCRIPT OPTIMISÉ
// ============================================
console.log('🚀 [AURA] Content Script loaded');

const CONFIG = {
    API_URL: 'http://localhost:3000/api/capture',
    BATCH_SIZE: 25,
    BATCH_INTERVAL: 1500,
    MAX_BUFFER_SIZE: 5000
};

let state = {
    isCapturing: false,
    liveId: null,
    buffer: { comments: [], gifts: [] },
    stats: { totalComments: 0, totalGifts: 0 }
};

// ============================================
// 1️⃣ DÉTECTION LIVE AUTO
// ============================================
function detectLive() {
    const url = window.location.href;
    const match = url.match(/@([^/]+)\/live/);
    
    if (!match) return null;

    const username = match[1];
    const liveId = document.querySelector('[data-e2e="live-room"]')?.getAttribute('data-room-id') || 
                   extractFromScript('roomId');
    
    if (!liveId) {
        setTimeout(detectLive, 2000);
        return null;
    }

    return {
        tiktok_live_id: liveId,
        creator_username: username,
        creator_display_name: document.querySelector('[data-e2e="live-author-name"]')?.textContent?.trim(),
        title: document.querySelector('[data-e2e="live-title"]')?.textContent?.trim() || '',
        started_at: new Date().toISOString(),
        url: url
    };
}

function extractFromScript(key) {
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
        if (script.textContent.includes(`"${key}"`)) {
            const match = script.textContent.match(new RegExp(`"${key}":"([^"]+)"`));
            if (match) return match[1];
        }
    }
    return null;
}

// ============================================
// 2️⃣ CAPTURE MESSAGES OPTIMISÉE
// ============================================
let chatObserver = null;

function startChatCapture() {
    const chatContainer = document.querySelector('[data-e2e="live-chat-list"]') ||
                         document.querySelector('.chat-list-container');
    
    if (!chatContainer) {
        setTimeout(startChatCapture, 2000);
        return;
    }

    chatObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && isMessageNode(node)) {
                    const msg = extractMessage(node);
                    if (msg) {
                        state.buffer.comments.push(msg);
                        state.stats.totalComments++;
                        
                        if (state.buffer.comments.length >= CONFIG.MAX_BUFFER_SIZE) {
                            sendBatch();
                        }
                    }
                }
            }
        }
    });

    chatObserver.observe(chatContainer, { childList: true, subtree: true });
}

function isMessageNode(node) {
    return node.matches?.('[data-e2e="comment-item"]') ||
           node.classList?.contains('chat-message');
}

function extractMessage(node) {
    try {
        const username = node.querySelector('[data-e2e="comment-username"]')?.textContent?.trim();
        const text = node.querySelector('[data-e2e="comment-text"]')?.textContent?.trim();
        
        if (!username || !text) return null;

        return {
            live_id: state.liveId,
            user_tiktok_id: node.getAttribute('data-user-id') || `temp_${Date.now()}`,
            user_username: username,
            user_display_name: username,
            text: text,
            timestamp: new Date().toISOString(),
            sequence: state.stats.totalComments
        };
    } catch (err) {
        console.error('[AURA] Erreur extraction:', err);
        return null;
    }
}

// ============================================
// 3️⃣ ENVOI BATCH OPTIMISÉ
// ============================================
let batchTimer = null;

function startBatchSender() {
    batchTimer = setInterval(sendBatch, CONFIG.BATCH_INTERVAL);
}

async function sendBatch() {
    if (state.buffer.comments.length === 0) return;

    const batch = {
        live_id: state.liveId,
        comments: state.buffer.comments.splice(0, CONFIG.BATCH_SIZE),
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`${CONFIG.API_URL}/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batch)
        });

        if (response.ok) {
            console.log(`✅ [AURA] Batch envoyé: ${batch.comments.length} messages`);
        }
    } catch (err) {
        console.error('❌ [AURA] Erreur batch:', err);
        state.buffer.comments.unshift(...batch.comments);
    }
}

// ============================================
// 4️⃣ CONTRÔLE CAPTURE
// ============================================
async function startCapture(liveData) {
    if (state.isCapturing) return;

    state.isCapturing = true;
    state.liveId = liveData.tiktok_live_id;

    // Envoyer metadata
    await fetch(`${CONFIG.API_URL}/live/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveData)
    });

    startChatCapture();
    startBatchSender();

    console.log('🚀 [AURA] Capture démarrée');
}

function stopCapture() {
    if (!state.isCapturing) return;

    state.isCapturing = false;
    if (chatObserver) chatObserver.disconnect();
    if (batchTimer) clearInterval(batchTimer);
    sendBatch(); // Batch final

    console.log('🛑 [AURA] Capture arrêtée');
}

// ============================================
// 🚀 INITIALISATION
// ============================================
setTimeout(() => {
    const liveData = detectLive();
    if (liveData) {
        startCapture(liveData);
    }
}, 3000);

window.addEventListener('beforeunload', stopCapture);