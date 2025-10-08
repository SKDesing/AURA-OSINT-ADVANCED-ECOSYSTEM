/**
 * 🕵️ BROWSER INTERCEPTOR
 * Capture des données TikTok Live via injection de scripts
 */

class BrowserInterceptor {
    constructor() {
        this.capturedData = {
            comments: [],
            gifts: [],
            viewers: 0,
            likes: 0,
            shares: 0,
            userProfiles: new Map()
        };
        this.securityToken = this.generateSecurityToken();
        this.unknownMessages = [];
    }

    generateSecurityToken() {
        return 'AURA_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    // Script d'injection pour capturer les données TikTok
    getInjectionScript() {
        return `
        (function() {
            console.log('🔍 AURA Interceptor activé');
            
            // Intercepter les requêtes WebSocket TikTok
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                const ws = new originalWebSocket(url, protocols);
                
                if (url.includes('tiktok') || url.includes('live')) {
                    console.log('📡 WebSocket TikTok détecté:', url);
                    
                    ws.addEventListener('message', function(event) {
                        try {
                            const data = JSON.parse(event.data);
                            
                            // Capturer les commentaires (multi-format)
                            if (data.type === 'chat' || data.method === 'WebcastChatMessage' || 
                                data.msgType === 1 || data.common?.method === 'WebcastChatMessage') {
                                window.postMessage({
                                    type: 'AURA_COMMENT',
                                    token: '${this.securityToken}',
                                    data: {
                                        user: data.user?.nickname || data.user?.uniqueId || data.user?.displayId,
                                        message: data.content || data.comment || data.payload?.content,
                                        timestamp: Date.now(),
                                        userId: data.user?.id || data.user?.userId,
                                        rawData: JSON.stringify(data)
                                    }
                                }, '*');
                            }
                            
                            // Capturer les cadeaux (multi-format)
                            if (data.type === 'gift' || data.method === 'WebcastGiftMessage' || 
                                data.msgType === 2 || data.common?.method === 'WebcastGiftMessage') {
                                window.postMessage({
                                    type: 'AURA_GIFT',
                                    token: '${this.securityToken}',
                                    data: {
                                        user: data.user?.nickname || data.user?.displayId,
                                        gift: data.gift?.name || data.giftName,
                                        count: data.repeatCount || data.count || 1,
                                        timestamp: Date.now(),
                                        rawData: JSON.stringify(data)
                                    }
                                }, '*');
                            }
                            
                            // Capturer les stats du live
                            if (data.type === 'member' || data.viewerCount !== undefined || 
                                data.memberCount !== undefined || data.likeCount !== undefined) {
                                window.postMessage({
                                    type: 'AURA_STATS',
                                    token: '${this.securityToken}',
                                    data: {
                                        viewers: data.viewerCount || data.memberCount,
                                        likes: data.likeCount,
                                        timestamp: Date.now(),
                                        rawData: JSON.stringify(data)
                                    }
                                }, '*');
                            }
                            
                            // Logger les messages inconnus pour analyse
                            else {
                                window.postMessage({
                                    type: 'AURA_UNKNOWN',
                                    token: '${this.securityToken}',
                                    data: {
                                        timestamp: Date.now(),
                                        url: url,
                                        rawData: JSON.stringify(data)
                                    }
                                }, '*');
                            }
                            
                        } catch (e) {
                            // Données non JSON, ignorer
                        }
                    });
                }
                
                return ws;
            };
            
            // Intercepter les requêtes fetch pour les API TikTok
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                if (typeof url === 'string' && url.includes('tiktok')) {
                    console.log('🌐 API TikTok interceptée:', url);
                }
                return originalFetch.apply(this, arguments);
            };
            
            // Observer les changements DOM pour capturer les éléments de chat
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Chercher les messages de chat (sélecteurs robustes)
                            const chatSelectors = [
                                '[data-e2e="chat-item"]', '[data-e2e="chat-message"]',
                                '.chat-message', '.webcast-chatroom__item', '.live-comment-item',
                                '[class*="chat"][class*="item"]', '[class*="comment"][class*="item"]'
                            ];
                            
                            const userSelectors = [
                                '.username', '.user-name', '[data-e2e="chat-username"]',
                                '[class*="username"]', '[class*="user-name"]'
                            ];
                            
                            const messageSelectors = [
                                '.message', '.chat-content', '[data-e2e="chat-content"]',
                                '[class*="message"]', '[class*="content"]'
                            ];
                            
                            chatSelectors.forEach(selector => {
                                const chatMessages = node.querySelectorAll(selector);
                                chatMessages.forEach(function(msg) {
                                    let user, text;
                                    
                                    // Essayer tous les sélecteurs d'utilisateur
                                    for (const userSel of userSelectors) {
                                        const userEl = msg.querySelector(userSel);
                                        if (userEl?.textContent?.trim()) {
                                            user = userEl.textContent.trim();
                                            break;
                                        }
                                    }
                                    
                                    // Essayer tous les sélecteurs de message
                                    for (const msgSel of messageSelectors) {
                                        const msgEl = msg.querySelector(msgSel);
                                        if (msgEl?.textContent?.trim()) {
                                            text = msgEl.textContent.trim();
                                            break;
                                        }
                                    }
                                    
                                    if (user && text) {
                                        window.postMessage({
                                            type: 'AURA_COMMENT_DOM',
                                            token: '${this.securityToken}',
                                            data: {
                                                user: user,
                                                message: text,
                                                timestamp: Date.now(),
                                                selector: selector
                                            }
                                        }, '*');
                                    }
                                });
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('✅ AURA Interceptor prêt');
        })();
        `;
    }

    // Écouter les messages du navigateur
    setupMessageListener(page) {
        page.on('console', msg => {
            if (msg.text().includes('AURA')) {
                console.log('🔍 Browser:', msg.text());
            }
        });

        page.evaluateOnNewDocument((securityToken) => {
            window.addEventListener('message', function(event) {
                // Vérifier le token de sécurité
                if (event.data.type?.startsWith('AURA_') && event.data.token === securityToken) {
                    // Envoyer au backend via fetch
                    fetch('http://localhost:XXXX/api/capture', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(event.data)
                    }).catch(console.error);
                } else if (event.data.type?.startsWith('AURA_') && event.data.token !== securityToken) {
                    console.warn('🚨 Token de sécurité invalide détecté');
                }
            });
        }, this.securityToken);
    }

    // Injecter le script dans la page
    async injectIntoPage(page) {
        await page.addInitScript(this.getInjectionScript());
        this.setupMessageListener(page);
        console.log('✅ Script d\'interception injecté');
    }
}

module.exports = BrowserInterceptor;