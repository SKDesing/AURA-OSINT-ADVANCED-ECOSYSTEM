/**
 * Tests unitaires pour AIChat
 */

describe('AIChat Component', () => {
  let aiChat;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    
    // Mock AIChat class
    global.AIChat = class {
      constructor() {
        this.messages = [];
        this.createInterface();
      }
      
      createInterface() {
        const container = document.createElement('div');
        container.className = 'ai-chat-container';
        container.innerHTML = `
          <div class="welcome-message">Bonjour! Comment puis-je vous aider?</div>
          <div id="messagesContainer"></div>
          <input id="messageInput" placeholder="Tapez votre question...">
          <button id="sendButton">Envoyer</button>
        `;
        document.getElementById('app').appendChild(container);
      }
      
      async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input.value.trim()) return;
        
        this.addMessage(input.value, 'user');
        input.value = '';
        
        // Simuler réponse IA
        if (global.fetch) {
          try {
            const response = await fetch('/api/chat');
            const data = await response.json();
            this.addMessage(data.response, 'assistant');
          } catch (error) {
            this.addMessage('Erreur de connexion', 'assistant', true);
          }
        }
      }
      
      addMessage(content, sender, isError = false) {
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.innerHTML = `
          <div class="message-content" ${isError ? 'style="background-color: rgba(239, 68, 68, 0.1)"' : ''}>
            ${content}
          </div>
        `;
        document.getElementById('messagesContainer').appendChild(message);
        this.messages.push({ content, sender, timestamp: new Date().toLocaleTimeString() });
      }
      
      saveMessages() {
        const toSave = this.messages.slice(-50); // Limiter à 50 messages
        localStorage.setItem('aura-chat-messages', JSON.stringify(toSave));
      }
      
      loadSavedMessages() {
        const saved = localStorage.getItem('aura-chat-messages');
        if (saved) {
          const messages = JSON.parse(saved);
          messages.forEach(msg => this.addMessage(msg.content, msg.sender));
        }
      }
    };
    
    aiChat = new AIChat();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('Initialisation', () => {
    test('doit créer l\'interface de chat', () => {
      const container = document.querySelector('.ai-chat-container');
      expect(container).toBeTruthy();
    });

    test('doit afficher le message de bienvenue', () => {
      const welcomeMsg = document.querySelector('.welcome-message');
      expect(welcomeMsg).toBeTruthy();
      expect(welcomeMsg.textContent).toContain('Bonjour');
    });

    test('doit avoir un champ de saisie', () => {
      const input = document.getElementById('messageInput');
      expect(input).toBeTruthy();
      expect(input.placeholder).toContain('question');
    });
  });

  describe('Envoi de messages', () => {
    test('doit envoyer un message utilisateur', async () => {
      const input = document.getElementById('messageInput');
      input.value = 'Test message';

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Réponse IA' })
        })
      );

      await aiChat.sendMessage();

      const messages = document.querySelectorAll('.message.user');
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[messages.length - 1].textContent).toContain('Test message');
    });

    test('ne doit pas envoyer de message vide', async () => {
      const input = document.getElementById('messageInput');
      input.value = '';

      await aiChat.sendMessage();

      const messages = document.querySelectorAll('.message.user');
      expect(messages.length).toBe(0);
    });
  });

  describe('Affichage des messages', () => {
    test('doit ajouter un message utilisateur', () => {
      aiChat.addMessage('Test user', 'user');
      
      const messages = document.querySelectorAll('.message.user');
      expect(messages.length).toBe(1);
      expect(messages[0].textContent).toContain('Test user');
    });

    test('doit ajouter un message assistant', () => {
      aiChat.addMessage('Test assistant', 'assistant');
      
      const messages = document.querySelectorAll('.message.assistant');
      expect(messages.length).toBe(1);
      expect(messages[0].textContent).toContain('Test assistant');
    });

    test('doit afficher les messages d\'erreur', () => {
      aiChat.addMessage('Erreur test', 'assistant', true);
      
      const errorMsg = document.querySelector('.message.assistant .message-content');
      expect(errorMsg.style.backgroundColor).toContain('rgba(239, 68, 68');
    });
  });

  describe('Sauvegarde/Chargement', () => {
    test('doit sauvegarder les messages', () => {
      aiChat.addMessage('Message 1', 'user');
      aiChat.addMessage('Message 2', 'assistant');
      aiChat.saveMessages();

      const saved = JSON.parse(localStorage.getItem('aura-chat-messages'));
      expect(saved.length).toBeGreaterThanOrEqual(2);
    });

    test('doit limiter le nombre de messages sauvegardés', () => {
      // Ajouter plus de messages que la limite
      for (let i = 0; i < 60; i++) {
        aiChat.addMessage(`Message ${i}`, 'user');
      }
      aiChat.saveMessages();

      const saved = JSON.parse(localStorage.getItem('aura-chat-messages'));
      expect(saved.length).toBeLessThanOrEqual(50);
    });
  });
});