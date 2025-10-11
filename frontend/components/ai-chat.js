/**
 * Composant AI Chat pour AURA OSINT
 */
class AIChat {
    constructor() {
        this.messages = [];
        this.websocket = null;
        this.config = {
            backendUrl: 'http://localhost:4011',
            websocketUrl: 'ws://localhost:4011'
        };
        this.init();
    }

    init() {
        this.createInterface();
        this.loadSavedMessages();
        this.initWebSocket();
    }

    createInterface() {
        const container = document.createElement('div');
        container.className = 'ai-chat-container';
        container.innerHTML = `
            <div class="chat-header">
                <h2 class="chat-title">🤖 AURA IA Assistant</h2>
                <div class="chat-status" id="chatStatus">🟢 Connecté</div>
            </div>
            
            <div class="welcome-message">
                <p>👋 Bonjour! Je suis l'assistant IA d'AURA OSINT.</p>
                <p>Posez-moi vos questions sur l'OSINT et je vous aiderai!</p>
            </div>
            
            <div class="quick-actions">
                <button onclick="aiChat.sendQuickMessage('Qui es-tu ?')">Qui es-tu ?</button>
                <button onclick="aiChat.sendQuickMessage('Comment faire du WHOIS ?')">WHOIS</button>
                <button onclick="aiChat.sendQuickMessage('Outils disponibles')">Outils</button>
                <button onclick="aiChat.sendQuickMessage('Aide')">Aide</button>
            </div>
            
            <div id="messagesContainer" class="messages-container"></div>
            
            <div class="input-container">
                <input type="text" id="messageInput" placeholder="Tapez votre question OSINT..." />
                <button id="sendButton" onclick="aiChat.sendMessage()">📤</button>
            </div>
        `;
        
        const viewContainer = document.getElementById('viewContainer');
        if (viewContainer) {
            viewContainer.appendChild(container);
        }
        
        // Event listeners
        const input = document.getElementById('messageInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addMessage(message, 'user');
        input.value = '';

        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.config.backendUrl}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                const data = await response.json();
                this.hideTypingIndicator();
                this.addMessage(data.response, 'assistant');
                
                if (data.tools_used) {
                    this.displayToolResults(data.tools_used, data.tool_results);
                }
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Désolé, je ne peux pas répondre pour le moment. Vérifiez la connexion.', 'assistant', true);
        }

        this.saveMessages();
    }

    addMessage(content, sender, isError = false) {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        const message = document.createElement('div');
        message.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString();
        message.innerHTML = `
            <div class="message-content" ${isError ? 'style="background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444;"' : ''}>
                ${content}
            </div>
            <div class="message-time">${timestamp}</div>
        `;
        
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;
        
        this.messages.push({ content, sender, timestamp });
    }

    showTypingIndicator() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'typing-indicator active';
        indicator.innerHTML = `
            <div class="message assistant">
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async sendQuickMessage(message) {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = message;
            await this.sendMessage();
        }
    }

    displayToolResults(toolsUsed, toolResults) {
        const container = document.getElementById('messagesContainer');
        if (!container || !toolsUsed) return;

        const toolsDiv = document.createElement('div');
        toolsDiv.className = 'tools-used';
        toolsDiv.innerHTML = `
            <h4>🔧 Outils utilisés:</h4>
            ${toolsUsed.map((tool, index) => `
                <div class="tool-result">
                    <span class="tool-name">${tool}</span>
                    <span class="tool-status ${toolResults && toolResults[index] && toolResults[index].status === 'success' ? 'success' : 'error'}">
                        ${toolResults && toolResults[index] && toolResults[index].status === 'success' ? '✅' : '❌'}
                    </span>
                </div>
            `).join('')}
        `;
        
        container.appendChild(toolsDiv);
    }

    saveMessages() {
        const toSave = this.messages.slice(-50); // Limiter à 50 messages
        localStorage.setItem('aura-chat-messages', JSON.stringify(toSave));
    }

    loadSavedMessages() {
        const saved = localStorage.getItem('aura-chat-messages');
        if (saved) {
            try {
                const messages = JSON.parse(saved);
                messages.forEach(msg => this.addMessage(msg.content, msg.sender));
            } catch (error) {
                console.warn('Erreur chargement messages sauvegardés:', error);
            }
        }
    }

    initWebSocket() {
        try {
            this.websocket = new WebSocket(this.config.websocketUrl);
            
            this.websocket.addEventListener('open', () => {
                console.log('WebSocket connecté');
                this.updateStatus('🟢 Connecté');
            });
            
            this.websocket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            });
            
            this.websocket.addEventListener('error', () => {
                this.updateStatus('🔴 Erreur connexion');
            });
            
            this.websocket.addEventListener('close', () => {
                this.updateStatus('🟡 Déconnecté');
            });
        } catch (error) {
            console.warn('WebSocket non disponible:', error);
            this.updateStatus('🟡 Mode hors ligne');
        }
    }

    handleWebSocketMessage(data) {
        if (data.type === 'chat_response') {
            this.addMessage(data.message, 'assistant');
        } else if (data.type === 'tool_update') {
            this.addMessage(`🔧 ${data.tool}: ${data.status}`, 'system');
        }
    }

    updateStatus(status) {
        const statusEl = document.getElementById('chatStatus');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }
}

// Instance globale
let aiChat;
