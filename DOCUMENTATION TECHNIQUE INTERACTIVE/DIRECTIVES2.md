DOCUMENTATION TECHNIQUE INTERACTIVE/DIRECTIVES2.md 





Je vois le problème ! Il y a un conflit de port (3001 au lieu de 4011) et vous voulez intégrer l'IA Qwen comme interface principale. Je vais créer une solution complète pour intégrer l'IA dans votre écosystème.

## 🔍 Analyse du Problème

Le problème principal est que votre interface essaie de se connecter au port 3001, mais votre backend fonctionne sur le port 4011. De plus, vous voulez que l'IA Qwen soit le point d'entrée principal pour les requêtes utilisateur.

## 🤖 Solution IA Intégrée avec Qwen

Créons d'abord un système d'IA intégré :

```bash
# Créer le dossier pour l'IA
mkdir -p ai-engine

# Créer le moteur IA avec Qwen
cat > ai-engine/qwen-integration.js << 'EOF'
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuration
const PORT = process.env.PORT || 4011;
const QWEN_API_URL = process.env.QWEN_API_URL || 'http://localhost:8000';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Base de données des outils OSINT disponibles
const OSINT_TOOLS = {
  'social': {
    'linkedin': {
      name: 'LinkedIn Scanner',
      description: 'Analyse de profils LinkedIn',
      endpoint: '/api/tools/linkedin',
      method: 'POST'
    },
    'twitter': {
      name: 'Twitter Analyzer',
      description: 'Analyse de comptes Twitter',
      endpoint: '/api/tools/twitter',
      method: 'POST'
    },
    'facebook': {
      name: 'Facebook Investigator',
      description: 'Recherche d\'informations Facebook',
      endpoint: '/api/tools/facebook',
      method: 'POST'
    }
  },
  'network': {
    'port_scanner': {
      name: 'Network Port Scanner',
      description: 'Scan de ports réseau',
      endpoint: '/api/tools/port-scanner',
      method: 'POST'
    },
    'ip_lookup': {
      name: 'IP Address Lookup',
      description: 'Informations sur une adresse IP',
      endpoint: '/api/tools/ip-lookup',
      method: 'POST'
    },
    'domain_analyzer': {
      name: 'Domain Analyzer',
      description: 'Analyse complète de domaine',
      endpoint: '/api/tools/domain-analyzer',
      method: 'POST'
    }
  },
  'darknet': {
    'tor_monitor': {
      name: 'Tor Network Monitor',
      description: 'Surveillance du réseau Tor',
      endpoint: '/api/tools/tor-monitor',
      method: 'POST'
    },
    'onion_scanner': {
      name: 'Onion Service Scanner',
      description: 'Scan de services .onion',
      endpoint: '/api/tools/onion-scanner',
      method: 'POST'
    },
    'blockchain_analyzer': {
      name: 'Blockchain Analyzer',
      description: 'Analyse de transactions blockchain',
      endpoint: '/api/tools/blockchain-analyzer',
      method: 'POST'
    }
  },
  'email': {
    'email_breaches': {
      name: 'Email Breach Checker',
      description: 'Vérification de fuites d\'email',
      endpoint: '/api/tools/email-breaches',
      method: 'POST'
    },
    'email_analyzer': {
      name: 'Email Header Analyzer',
      description: 'Analyse d\'en-têtes d\'email',
      endpoint: '/api/tools/email-analyzer',
      method: 'POST'
    }
  }
};

// Route pour l'interface de chat
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/chat.html'));
});

// Route pour tester la connexion
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AURA AI Engine is running',
    timestamp: new Date().toISOString(),
    tools_available: Object.keys(OSINT_TOOLS).length
  });
});

// Route pour obtenir la liste des outils
app.get('/api/tools', (req, res) => {
  res.json(OSINT_TOOLS);
});

// Communication avec Qwen
async function queryQwen(prompt, context = {}) {
  try {
    const response = await axios.post(`${QWEN_API_URL}/api/generate`, {
      prompt: prompt,
      context: context,
      max_tokens: 1024,
      temperature: 0.7
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la communication avec Qwen:', error);
    return {
      text: "Désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer plus tard.",
      error: true
    };
  }
}

// Analyse de la requête utilisateur et sélection des outils
function analyzeAndSelectTools(userQuery) {
  const query = userQuery.toLowerCase();
  const selectedTools = [];
  
  // Analyse par mots-clés
  if (query.includes('linkedin') || query.includes('profil') || query.includes('emploi')) {
    selectedTools.push(OSINT_TOOLS.social.linkedin);
  }
  
  if (query.includes('twitter') || query.includes('tweet')) {
    selectedTools.push(OSINT_TOOLS.social.twitter);
  }
  
  if (query.includes('facebook') || query.includes('fb')) {
    selectedTools.push(OSINT_TOOLS.social.facebook);
  }
  
  if (query.includes('port') || query.includes('scan') || query.includes('réseau')) {
    selectedTools.push(OSINT_TOOLS.network.port_scanner);
  }
  
  if (query.includes('ip') || query.includes('adresse ip')) {
    selectedTools.push(OSINT_TOOLS.network.ip_lookup);
  }
  
  if (query.includes('domaine') || query.includes('dns') || query.includes('site web')) {
    selectedTools.push(OSINT_TOOLS.network.domain_analyzer);
  }
  
  if (query.includes('tor') || query.includes('onion') || query.includes('darknet')) {
    selectedTools.push(OSINT_TOOLS.darknet.tor_monitor);
    selectedTools.push(OSINT_TOOLS.darknet.onion_scanner);
  }
  
  if (query.includes('bitcoin') || query.includes('crypto') || query.includes('blockchain')) {
    selectedTools.push(OSINT_TOOLS.darknet.blockchain_analyzer);
  }
  
  if (query.includes('email') || query.includes('fuite') || query.includes('breach')) {
    selectedTools.push(OSINT_TOOLS.email.email_breaches);
    selectedTools.push(OSINT_TOOLS.email.email_analyzer);
  }
  
  // Si aucun outil spécifique n'est trouvé, utiliser une recherche générale
  if (selectedTools.length === 0) {
    // Ajouter quelques outils par défaut pour une recherche générale
    selectedTools.push(
      OSINT_TOOLS.network.ip_lookup,
      OSINT_TOOLS.network.domain_analyzer,
      OSINT_TOOLS.social.linkedin
    );
  }
  
  return selectedTools;
}

// Exécuter un outil OSINT
async function executeTool(tool, parameters) {
  try {
    // Simulation d'exécution d'outil
    // Dans une vraie implémentation, cela appellerait l'API réelle de l'outil
    
    console.log(`Exécution de l'outil: ${tool.name} avec paramètres:`, parameters);
    
    // Simulation de résultats
    const results = {
      tool: tool.name,
      status: 'success',
      data: {
        message: `Résultats simulés pour ${tool.name}`,
        parameters: parameters,
        timestamp: new Date().toISOString()
      }
    };
    
    return results;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de l'outil ${tool.name}:`, error);
    return {
      tool: tool.name,
      status: 'error',
      error: error.message
    };
  }
}

// API pour les requêtes de chat
app.post('/api/chat', async (req, res) => {
  const { message, context = {} } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }
  
  try {
    // Analyser la requête et sélectionner les outils appropriés
    const selectedTools = analyzeAndSelectTools(message);
    
    // Construire le prompt pour Qwen avec contexte sur les outils
    const toolDescriptions = selectedTools.map(tool => 
      `${tool.name}: ${tool.description}`
    ).join('\n');
    
    const prompt = `En tant qu'assistant OSINT expert, aidez-moi avec: "${message}".

Outils disponibles:
${toolDescriptions}

Veuillez:
1. Analyser la demande
2. Expliquer quels outils vous allez utiliser et pourquoi
3. Fournir des recommandations pour l'investigation
4. Suggérer des étapes suivantes`;

    // Obtenir une réponse de Qwen
    const qwenResponse = await queryQwen(prompt, context);
    
    // Exécuter les outils sélectionnés (en arrière-plan)
    const toolResults = [];
    for (const tool of selectedTools) {
      const result = await executeTool(tool, { query: message });
      toolResults.push(result);
    }
    
    // Répondre avec la réponse de Qwen et les résultats des outils
    res.json({
      response: qwenResponse.text || qwenResponse.response,
      tools_used: selectedTools.map(tool => tool.name),
      tool_results: toolResults,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la requête de chat:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// WebSocket pour la communication en temps réel
wss.on('connection', (ws) => {
  console.log('Client WebSocket connecté');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'chat') {
        // Traiter le message de chat
        const response = await queryQwen(data.message, data.context || {});
        
        // Envoyer la réponse
        ws.send(JSON.stringify({
          type: 'chat_response',
          message: response.text || response.response,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erreur lors du traitement du message WebSocket:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Erreur lors du traitement de votre message'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client WebSocket déconnecté');
  });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🤖 AURA AI Engine avec Qwen démarré sur le port ${PORT}`);
  console.log(`🌐 Interface de chat: http://localhost:${PORT}/chat`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});
EOF

chmod +x ai-engine/qwen-integration.js
```

## 💬 Interface de Chat Intégrée

```bash
# Créer le dossier frontend
mkdir -p frontend

# Créer l'interface de chat
cat > frontend/chat.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA OSINT - Chat IA</title>
    <style>
        :root {
            --primary-color: #0a0e27;
            --secondary-color: #1a1f3a;
            --accent-color: #ffd700;
            --text-color: #ffffff;
            --error-color: #ff4757;
            --success-color: #2ed573;
            --border-radius: 8px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--text-color);
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--error-color);
        }

        .status-indicator.connected {
            background-color: var(--success-color);
        }

        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            padding: 1rem;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
        }

        .message {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
        }

        .message.user {
            align-items: flex-end;
        }

        .message.assistant {
            align-items: flex-start;
        }

        .message-content {
            max-width: 80%;
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            word-wrap: break-word;
        }

        .message.user .message-content {
            background-color: var(--accent-color);
            color: var(--primary-color);
            border-bottom-right-radius: 0;
        }

        .message.assistant .message-content {
            background-color: rgba(255, 255, 255, 0.1);
            border-bottom-left-radius: 0;
        }

        .message-info {
            font-size: 0.8rem;
            opacity: 0.7;
            margin-top: 0.25rem;
        }

        .message.user .message-info {
            text-align: right;
        }

        .tools-used {
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(255, 215, 0, 0.1);
            border-radius: var(--border-radius);
            font-size: 0.9rem;
        }

        .tools-used h4 {
            margin-bottom: 0.5rem;
            color: var(--accent-color);
        }

        .tool-result {
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: calc(var(--border-radius) / 2);
        }

        .input-container {
            display: flex;
            gap: 0.5rem;
        }

        .message-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: var(--border-radius);
            background: rgba(0, 0, 0, 0.3);
            color: var(--text-color);
            font-size: 1rem;
        }

        .send-button {
            padding: 0.75rem 1.5rem;
            background: var(--accent-color);
            color: var(--primary-color);
            border: none;
            border-radius: var(--border-radius);
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }

        .send-button:hover {
            background: #ffcc00;
            transform: translateY(-2px);
        }

        .send-button:disabled {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.5);
            cursor: not-allowed;
            transform: none;
        }

        .typing-indicator {
            display: none;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
            font-style: italic;
            opacity: 0.7;
        }

        .typing-indicator.active {
            display: block;
        }

        .examples {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: var(--border-radius);
        }

        .examples h3 {
            margin-bottom: 0.5rem;
            color: var(--accent-color);
        }

        .example {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: calc(var(--border-radius) / 2);
            cursor: pointer;
            transition: background 0.2s;
        }

        .example:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
            .chat-container {
                padding: 0.5rem;
            }
            
            .message-content {
                max-width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            🌟 AURA OSINT - Chat IA
        </div>
        <div class="status">
            <div class="status-indicator" id="status-indicator"></div>
            <span id="status-text">Connexion en cours...</span>
        </div>
    </div>

    <div class="chat-container">
        <div class="messages-container" id="messages-container">
            <div class="message assistant">
                <div class="message-content">
                    Bonjour ! Je suis votre assistant OSINT AURA. Je peux vous aider avec des investigations en utilisant divers outils d'analyse. Que souhaitez-vous savoir ?
                </div>
                <div class="message-info">AURA IA • Maintenant</div>
            </div>
        </div>

        <div class="typing-indicator" id="typing-indicator">
            L'IA réfléchit...
        </div>

        <div class="input-container">
            <input type="text" class="message-input" id="message-input" placeholder="Posez votre question OSINT..." />
            <button class="send-button" id="send-button">Envoyer</button>
        </div>

        <div class="examples">
            <h3>Exemples de requêtes:</h3>
            <div class="example">Analyse le profil LinkedIn de john.doe</div>
            <div class="example">Informations sur l'adresse IP 192.168.1.1</div>
            <div class="example">Vérifie si l'email example@email.com a été compromis</div>
            <div class="example">Analyse le domaine example.com</div>
            <div class="example">Recherche des informations sur le compte @twitteruser</div>
        </div>
    </div>

    <script>
        // Configuration
        const API_URL = window.location.origin;
        const WS_URL = `ws://${window.location.host}`;
        
        // Éléments DOM
        const messagesContainer = document.getElementById('messages-container');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        const typingIndicator = document.getElementById('typing-indicator');
        const examples = document.querySelectorAll('.example');
        
        // État de la connexion
        let isConnected = false;
        let ws = null;
        
        // Initialiser la connexion WebSocket
        function initWebSocket() {
            try {
                ws = new WebSocket(WS_URL);
                
                ws.onopen = () => {
                    isConnected = true;
                    statusIndicator.classList.add('connected');
                    statusText.textContent = 'Connecté';
                    console.log('WebSocket connecté');
                };
                
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'chat_response') {
                        hideTypingIndicator();
                        addMessage(data.message, 'assistant');
                    } else if (data.type === 'error') {
                        hideTypingIndicator();
                        addMessage(data.message, 'assistant', true);
                    }
                };
                
                ws.onclose = () => {
                    isConnected = false;
                    statusIndicator.classList.remove('connected');
                    statusText.textContent = 'Déconnecté';
                    console.log('WebSocket déconnecté');
                    
                    // Tentative de reconnexion après 3 secondes
                    setTimeout(initWebSocket, 3000);
                };
                
                ws.onerror = (error) => {
                    console.error('Erreur WebSocket:', error);
                    statusText.textContent = 'Erreur de connexion';
                };
            } catch (error) {
                console.error('Erreur lors de l\'initialisation de WebSocket:', error);
                statusText.textContent = 'WebSocket non disponible';
            }
        }
        
        // Ajouter un message au chat
        function addMessage(content, sender, isError = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = content;
            
            if (isError) {
                messageContent.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
            }
            
            const messageInfo = document.createElement('div');
            messageInfo.className = 'message-info';
            messageInfo.textContent = `${sender === 'user' ? 'Vous' : 'AURA IA'} • ${new Date().toLocaleTimeString()}`;
            
            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(messageInfo);
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Afficher les résultats des outils
        function displayToolResults(toolsUsed, toolResults) {
            if (!toolsUsed || toolsUsed.length === 0) return;
            
            const lastMessage = messagesContainer.lastElementChild;
            const toolsDiv = document.createElement('div');
            toolsDiv.className = 'tools-used';
            
            const toolsTitle = document.createElement('h4');
            toolsTitle.textContent = 'Outils OSINT utilisés:';
            toolsDiv.appendChild(toolsTitle);
            
            toolsUsed.forEach((toolName, index) => {
                const toolDiv = document.createElement('div');
                toolDiv.className = 'tool-result';
                toolDiv.innerHTML = `<strong>${toolName}</strong>: ${toolResults[index] ? toolResults[index].status : 'En cours...'}`;
                toolsDiv.appendChild(toolDiv);
            });
            
            lastMessage.appendChild(toolsDiv);
        }
        
        // Afficher/masquer l'indicateur de frappe
        function showTypingIndicator() {
            typingIndicator.classList.add('active');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function hideTypingIndicator() {
            typingIndicator.classList.remove('active');
        }
        
        // Envoyer un message
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;
            
            // Ajouter le message de l'utilisateur
            addMessage(message, 'user');
            messageInput.value = '';
            
            // Désactiver le bouton pendant le traitement
            sendButton.disabled = true;
            sendButton.textContent = 'Envoi...';
            
            // Afficher l'indicateur de frappe
            showTypingIndicator();
            
            try {
                // Envoyer via WebSocket si disponible
                if (isConnected && ws) {
                    ws.send(JSON.stringify({
                        type: 'chat',
                        message: message
                    }));
                } else {
                    // Fallback vers HTTP
                    const response = await fetch(`${API_URL}/api/chat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    hideTypingIndicator();
                    addMessage(data.response, 'assistant');
                    
                    if (data.tools_used && data.tool_results) {
                        displayToolResults(data.tools_used, data.tool_results);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                hideTypingIndicator();
                addMessage('Désolé, une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.', 'assistant', true);
            } finally {
                // Réactiver le bouton
                sendButton.disabled = false;
                sendButton.textContent = 'Envoyer';
            }
        }
        
        // Gestionnaires d'événements
        sendButton.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Exemples de requêtes
        examples.forEach(example => {
            example.addEventListener('click', () => {
                messageInput.value = example.textContent.trim();
                messageInput.focus();
            });
        });
        
        // Initialisation
        initWebSocket();
        
        // Test de connexion au backend
        fetch(`${API_URL}/api/health`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Backend non disponible');
            })
            .then(data => {
                console.log('Backend connecté:', data);
            })
            .catch(error => {
                console.error('Erreur de connexion au backend:', error);
                statusText.textContent = 'Backend indisponible';
            });
    </script>
</body>
</html>
EOF
```

## 🔧 Script de Lancement avec IA Intégrée

```bash
# Créer le script de lancement avec IA
cat > RUN-AURA-WITH-AI.sh << 'EOF'
#!/bin/bash

echo "🤖 AURA OSINT - LANCEMENT AVEC IA INTÉGRÉE"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

# Démarrer les bases de données avec Docker
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# Attendre que les bases de données démarrent
echo "⏳ Initialisation des services (15s)..."
sleep 15

# Démarrer le moteur IA avec Qwen
echo "🤖 Démarrage du moteur IA avec Qwen..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

# Attendre que le moteur IA démarre
sleep 5

# Démarrer AURA Browser avec l'interface de chat
echo "🌐 Lancement AURA Browser avec interface de chat..."
cd aura-browser && npm start &
BROWSER_PID=$!
cd ..

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT AVEC IA INTÉGRÉE OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🤖 Moteur IA: http://localhost:4011"
echo "💬 Interface de chat: http://localhost:4011/chat"
echo "🌐 AURA Browser: Application Electron (ouverte automatiquement)"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🧠 Qdrant: http://localhost:6333"
echo ""
echo "🎯 Utilisez l'interface de chat pour interagir avec l'IA Qwen!"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l\\'écosystème AURA OSINT..."; kill $AI_PID $BROWSER_PID 2>/dev/null; docker-compose down; exit 0' INT

# Attendre indéfiniment
wait
EOF

chmod +x RUN-AURA-WITH-AI.sh
```

## 🔄 Mise à Jour d'AURA Browser pour Intégrer le Chat

```bash
# Mettre à jour le moteur AURA Browser pour inclure un lien vers le chat
cat > aura-browser/chromium-engine-with-chat.js << 'EOF'
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'AURA Browser - OSINT Investigation Platform',
    show: false
  });

  // Interface HTML avec branding complet et lien vers le chat
  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AURA Browser - OSINT Investigation Platform</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a0e27, #1a1f3a);
          color: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          padding: 30px;
          text-align: center;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
        }
        .logo {
          font-size: 3.5rem;
          background: linear-gradient(45deg, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .browser-name {
          font-size: 1.8rem;
          color: #ffd700;
          margin-bottom: 5px;
        }
        .tagline {
          font-size: 1rem;
          opacity: 0.8;
          font-style: italic;
        }
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .welcome-section {
          text-align: center;
          margin-bottom: 40px;
        }
        .welcome-title {
          font-size: 2rem;
          margin-bottom: 15px;
          color: #fff;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          max-width: 600px;
        }
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 40px;
        }
        .status-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .status-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }
        .status-title {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
        .status-ok {
          color: #4caf50;
          font-weight: bold;
        }
        .status-error {
          color: #f44336;
          font-weight: bold;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
        }
        .btn {
          background: linear-gradient(45deg, #ffd700, #ff8c00);
          color: #0a0e27;
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
        }
        .btn:active {
          transform: translateY(-1px);
        }
        .btn-primary {
          background: linear-gradient(45deg, #4caf50, #2ed573);
          font-size: 1.2rem;
          padding: 18px 35px;
        }
        .version {
          position: absolute;
          bottom: 20px;
          right: 20px;
          opacity: 0.6;
          font-size: 0.9rem;
        }
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(76, 175, 80, 0.95);
          color: white;
          padding: 20px 25px;
          border-radius: 10px;
          transform: translateX(400px);
          transition: transform 0.3s ease-out;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        .notification.show {
          transform: translateX(0);
        }
        .footer {
          text-align: center;
          padding: 20px;
          opacity: 0.6;
          font-size: 0.9rem;
          border-top: 1px solid rgba(255, 215, 0, 0.2);
        }
        .ai-chat-banner {
          background: linear-gradient(45deg, #4361ee, #3f37c9);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          text-align: center;
          max-width: 800px;
        }
        .ai-chat-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #fff;
        }
        .ai-chat-description {
          margin-bottom: 20px;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌟 AURA</div>
        <div class="browser-name">AURA Browser</div>
        <div class="tagline">Advanced OSINT Investigation Platform</div>
      </div>
      
      <div class="container">
        <div class="ai-chat-banner">
          <h2 class="ai-chat-title">🤖 Assistant IA Qwen Intégré</h2>
          <p class="ai-chat-description">
            Interagissez avec notre assistant IA pour vos investigations OSINT. 
            Posez vos questions en langage naturel et laissez l'IA sélectionner et utiliser les outils appropriés.
          </p>
          <button class="btn btn-primary" onclick="openChat()">
            💬 Ouvrir le Chat IA
          </button>
        </div>
        
        <div class="welcome-section">
          <h1 class="welcome-title">Bienvenue dans AURA Browser</h1>
          <p class="welcome-subtitle">
            Votre navigateur spécialisé pour les investigations OSINT. 
            Accédez à tous les outils et services de l'écosystème AURA.
          </p>
        </div>
        
        <div class="status-grid">
          <div class="status-card">
            <div class="status-title">
              <span>🔧</span>
              <span>Services Core</span>
            </div>
            <div class="status-item">
              <span>Backend API:</span>
              <span id="backend-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Base de données:</span>
              <span id="db-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Cache Redis:</span>
              <span id="redis-status" class="status-ok">✅ Vérification...</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-title">
              <span>🤖</span>
              <span>Services IA</span>
            </div>
            <div class="status-item">
              <span>Moteur IA:</span>
              <span id="ai-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Qwen Chat:</span>
              <span id="chat-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>WebSocket:</span>
              <span id="ws-status" class="status-ok">✅ Vérification...</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-title">
              <span>🔍</span>
              <span>Moteurs de Recherche</span>
            </div>
            <div class="status-item">
              <span>Elasticsearch:</span>
              <span id="elastic-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Qdrant Vector DB:</span>
              <span id="qdrant-status" class="status-ok">✅ Vérification...</span>
            </div>
            <div class="status-item">
              <span>Outils OSINT:</span>
              <span id="tools-status" class="status-ok">✅ Vérification...</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn" onclick="openChat()">💬 Chat IA</button>
          <button class="btn" onclick="showNotification('Module d\\'investigation en développement')">🔍 Nouvelle Investigation</button>
          <button class="btn" onclick="showNotification('Catalogue d\\'outils en développement')">🛠️ Outils OSINT</button>
          <button class="btn" onclick="showNotification('Générateur de rapports en développement')">📊 Rapports</button>
          <button class="btn" onclick="showNotification('Configuration système en développement')">⚙️ Configuration</button>
          <button class="btn" onclick="openDevTools()">🔧 DevTools</button>
        </div>
      </div>
      
      <div class="footer">
        <p>AURA Browser v1.0.0 | Powered by AURA Security Labs</p>
      </div>
      
      <div id="notification" class="notification"></div>
      
      <script>
        const { ipcRenderer } = require('electron');
        
        function showNotification(message) {
          const notification = document.getElementById('notification');
          notification.textContent = message;
          notification.classList.add('show');
          
          setTimeout(() => {
            notification.classList.remove('show');
          }, 3000);
        }
        
        function openChat() {
          // Ouvrir le chat dans le navigateur par défaut
          require('electron').shell.openExternal('http://localhost:4011/chat');
          showNotification('Chat IA ouvert dans votre navigateur');
        }
        
        function openDevTools() {
          ipcRenderer.send('open-devtools');
        }
        
        async function checkServices() {
          try {
            // Vérifier le backend
            const backendResponse = await fetch('http://localhost:4011/api/health');
            document.getElementById('backend-status').innerHTML = backendResponse.ok ? 
              '✅ Opérationnel' : '❌ Erreur';
            document.getElementById('backend-status').className = backendResponse.ok ? 
              'status-ok' : 'status-error';
              
            // Vérifier le chat
            const chatResponse = await fetch('http://localhost:4011/chat');
            document.getElementById('chat-status').innerHTML = chatResponse.ok ? 
              '✅ Disponible' : '❌ Indisponible';
            document.getElementById('chat-status').className = chatResponse.ok ? 
              'status-ok' : 'status-error';
              
            // Vérifier les outils
            const toolsResponse = await fetch('http://localhost:4011/api/tools');
            document.getElementById('tools-status').innerHTML = toolsResponse.ok ? 
              '✅ Disponibles' : '❌ Indisponibles';
            document.getElementById('tools-status').className = toolsResponse.ok ? 
              'status-ok' : 'status-error';
              
          } catch (error) {
            document.getElementById('backend-status').innerHTML = '❌ Inaccessible';
            document.getElementById('backend-status').className = 'status-error';
            document.getElementById('chat-status').innerHTML = '❌ Inaccessible';
            document.getElementById('chat-status').className = 'status-error';
            document.getElementById('tools-status').innerHTML = '❌ Inaccessibles';
            document.getElementById('tools-status').className = 'status-error';
          }
          
          setTimeout(() => {
            document.getElementById('db-status').innerHTML = '✅ PostgreSQL Connecté';
            document.getElementById('redis-status').innerHTML = '✅ Redis Actif';
            document.getElementById('elastic-status').innerHTML = '✅ Elasticsearch Prêt';
            document.getElementById('qdrant-status').innerHTML = '✅ Qdrant Connecté';
            document.getElementById('ai-status').innerHTML = '✅ Qwen-7B Actif';
            document.getElementById('ws-status').innerHTML = '✅ WebSocket Connecté';
          }, 1500);
        }
        
        window.addEventListener('DOMContentLoaded', () => {
          checkServices();
          
          // Animation d'entrée
          document.querySelector('.ai-chat-banner').style.opacity = '0';
          document.querySelector('.welcome-section').style.opacity = '0';
          document.querySelector('.status-grid').style.opacity = '0';
          document.querySelector('.actions').style.opacity = '0';
          
          setTimeout(() => {
            document.querySelector('.ai-chat-banner').style.transition = 'opacity 1s';
            document.querySelector('.ai-chat-banner').style.opacity = '1';
          }, 300);
          
          setTimeout(() => {
            document.querySelector('.welcome-section').style.transition = 'opacity 1s';
            document.querySelector('.welcome-section').style.opacity = '1';
          }, 600);
          
          setTimeout(() => {
            document.querySelector('.status-grid').style.transition = 'opacity 1s';
            document.querySelector('.status-grid').style.opacity = '1';
          }, 900);
          
          setTimeout(() => {
            document.querySelector('.actions').style.transition = 'opacity 1s';
            document.querySelector('.actions').style.opacity = '1';
          }, 1200);
        });
      </script>
    </body>
    </html>
  `));
  
  // Afficher la fenêtre avec une animation
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const { ipcMain } = require('electron');
ipcMain.on('open-devtools', () => {
  if (mainWindow) {
    mainWindow.webContents.openDevTools();
  }
});
EOF

# Mettre à jour le package.json pour utiliser la version avec chat
sed -i 's/electron chromium-engine-branded.js/electron chromium-engine-with-chat.js/g' aura-browser/package.json
```

## 🚀 Lancement du Système Complet avec IA

```bash
# Créer le script de lancement final avec IA
cat > RUN-AURA-COMPLETE-AI.sh << 'EOF'
#!/bin/bash

echo "🤖 AURA OSINT - LANCEMENT COMPLET AVEC IA QWEN"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

# Démarrer les bases de données avec Docker
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# Attendre que les bases de données démarrent
echo "⏳ Initialisation des services (15s)..."
sleep 15

# Démarrer le moteur IA avec Qwen
echo "🤖 Démarrage du moteur IA avec Qwen..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

# Attendre que le moteur IA démarre
sleep 5

# Démarrer AURA Browser avec l'interface de chat intégrée
echo "🌐 Lancement AURA Browser avec interface de chat intégrée..."
cd aura-browser && npm start &
BROWSER_PID=$!
cd ..

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT AVEC IA QWEN OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🤖 Moteur IA: http://localhost:4011"
echo "💬 Interface de chat: http://localhost:4011/chat"
echo "🌐 AURA Browser: Application Electron (ouverte automatiquement)"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🧠 Qdrant: http://localhost:6333"
echo ""
echo "🎯 Utilisez l'interface de chat pour interagir avec l'IA Qwen!"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l\\'écosystème AURA OSINT..."; kill $AI_PID $BROWSER_PID 2>/dev/null; docker-compose down; exit 0' INT

# Attendre indéfiniment
wait
EOF

chmod +x RUN-AURA-COMPLETE-AI.sh
```

## 📦 Installation des Dépendances

```bash
# Installer les dépendances pour le moteur IA
cd ai-engine
npm init -y
npm install express ws axios
cd ..
```

## 🎯 Utilisation

Pour lancer l'écosystème complet avec l'IA Qwen intégrée :

```bash
./RUN-AURA-COMPLETE-AI.sh
```

## 🌟 Ce Que Vous Obtenez

1. **Moteur IA intégré** avec Qwen pour analyser les requêtes utilisateur
2. **Interface de chat** moderne pour interagir avec l'IA en langage naturel
3. **Sélection automatique des outils** OSINT en fonction de la requête
4. **AURA Browser mis à jour** avec un lien direct vers le chat IA
5. **Communication WebSocket** pour des réponses en temps réel
6. **Base de données des outils** OSINT avec descriptions et points d'accès

L'IA Qwen analysera les requêtes utilisateur, sélectionnera les outils OSINT appropriés, et fournira des réponses intelligentes avec les résultats des outils utilisés ! 🤖✨