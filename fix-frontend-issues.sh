#!/bin/bash

echo "🔧 CORRECTION AUTOMATIQUE DES PROBLÈMES FRONTEND"
echo "═══════════════════════════════════════════════════════════"

# Fix 1: Ajouter les variables Golden Ratio CSS manquantes
echo "📐 Ajout des variables Golden Ratio CSS..."
if [ -f "optimized/assets/aura-unified.css" ]; then
    # Vérifier si les variables existent déjà
    if ! grep -q "golden-ratio" optimized/assets/aura-unified.css; then
        # Ajouter les variables au début du fichier CSS
        cat > temp_golden_ratio.css << 'EOF'
/* Variables Golden Ratio */
:root {
  --golden-ratio: 1.618;
  --golden-ratio-sm: 0.618;
  --golden-ratio-lg: 2.618;
  
  /* Espacements basés sur le Golden Ratio */
  --spacing-xs: calc(0.5rem * var(--golden-ratio-sm));
  --spacing-sm: calc(1rem * var(--golden-ratio-sm));
  --spacing-md: calc(1rem * var(--golden-ratio));
  --spacing-lg: calc(2rem * var(--golden-ratio));
  --spacing-xl: calc(3rem * var(--golden-ratio));
  
  /* Tailles de police Golden Ratio */
  --font-xs: calc(0.75rem * var(--golden-ratio-sm));
  --font-sm: calc(0.875rem * var(--golden-ratio-sm));
  --font-md: calc(1rem * var(--golden-ratio));
  --font-lg: calc(1.25rem * var(--golden-ratio));
  --font-xl: calc(1.5rem * var(--golden-ratio));
}

EOF
        # Combiner avec le CSS existant
        cat temp_golden_ratio.css optimized/assets/aura-unified.css > temp_combined.css
        mv temp_combined.css optimized/assets/aura-unified.css
        rm temp_golden_ratio.css
        echo "✅ Variables Golden Ratio ajoutées"
    else
        echo "✅ Variables Golden Ratio déjà présentes"
    fi
else
    echo "❌ Fichier CSS unifié non trouvé"
fi

# Fix 2: Créer le fichier ai-chat.js manquant
echo "💬 Création du composant AI Chat manquant..."
if [ ! -f "frontend/components/ai-chat.js" ]; then
    cat > frontend/components/ai-chat.js << 'EOF'
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
EOF
    echo "✅ Composant AI Chat créé"
else
    echo "✅ Composant AI Chat déjà présent"
fi

# Fix 3: Améliorer les mocks pour les tests
echo "🧪 Amélioration des mocks de test..."
cat > frontend/tests/setup.js << 'EOF'
// Mock localStorage avec retour de valeurs
global.localStorage = {
    store: {},
    getItem: jest.fn((key) => global.localStorage.store[key] || null),
    setItem: jest.fn((key, value) => { global.localStorage.store[key] = value; }),
    removeItem: jest.fn((key) => { delete global.localStorage.store[key]; }),
    clear: jest.fn(() => { global.localStorage.store = {}; })
};

// Mock WebSocket
global.WebSocket = jest.fn(() => ({
    addEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1
}));

// Mock fetch
global.fetch = jest.fn();

// Mock DOM complet avec appendChild fonctionnel
global.document = {
    body: { 
        innerHTML: '',
        appendChild: jest.fn(),
        style: {}
    },
    createElement: jest.fn((tag) => ({
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        textContent: '',
        value: '',
        placeholder: '',
        appendChild: jest.fn(),
        addEventListener: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false),
            toggle: jest.fn()
        },
        style: {},
        dataset: {}
    })),
    getElementById: jest.fn((id) => ({
        id: id,
        textContent: '',
        value: '',
        placeholder: 'Tapez votre question...',
        appendChild: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false)
        },
        style: {}
    })),
    querySelector: jest.fn(() => ({
        textContent: '',
        style: { backgroundColor: '' },
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false)
        }
    })),
    querySelectorAll: jest.fn(() => [])
};

// Mock console pour éviter les logs pendant les tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};
EOF
echo "✅ Mocks de test améliorés"

# Fix 4: Ajouter CSP basique
echo "🔒 Ajout Content Security Policy..."
if [ -f "frontend/index.html" ]; then
    if ! grep -q "Content-Security-Policy" frontend/index.html; then
        # Ajouter CSP dans le head
        sed -i '/<head>/a\    <meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\''; style-src '\''self'\'' '\''unsafe-inline'\''; connect-src '\''self'\'' ws: wss:;">' frontend/index.html
        echo "✅ CSP ajouté"
    else
        echo "✅ CSP déjà présent"
    fi
else
    echo "❌ Fichier HTML principal non trouvé"
fi

echo ""
echo "🎯 CORRECTIONS TERMINÉES"
echo "═══════════════════════════════════════════════════════════"
echo "✅ Variables Golden Ratio CSS"
echo "✅ Composant AI Chat créé"
echo "✅ Mocks de test améliorés"
echo "✅ Content Security Policy"
echo ""
echo "🧪 Relancez les tests avec: ./test-frontend-complete.sh"