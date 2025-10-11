import React, { useState, useEffect } from 'react';
import './AuraDemo.css';
import { mockOsintTools, mockMetrics, generateLiveData, mockAIResponses, MockDataGenerator } from '../data/mockData';

const AuraDemo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [investigations, setInvestigations] = useState([]);
  const [tools, setTools] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // 🎯 ALGORITHMES AVANCÉS - Génération d'investigations réalistes
  const generateMockInvestigations = () => {
    const investigations = [];
    const types = ['email', 'phone', 'username', 'domain', 'ip'];
    const statuses = ['completed', 'running', 'pending', 'failed'];
    
    for (let i = 0; i < 8; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let target;
      switch (type) {
        case 'email':
          target = MockDataGenerator.generateRealisticEmail();
          break;
        case 'phone':
          target = MockDataGenerator.generatePhoneNumber();
          break;
        case 'username':
          target = MockDataGenerator.generateUsername();
          break;
        case 'domain':
          target = MockDataGenerator.generateDomain();
          break;
        case 'ip':
          target = MockDataGenerator.generateIP();
          break;
        default:
          target = 'unknown';
      }
      
      investigations.push({
        id: `INV-2024-${String(i + 1).padStart(3, '0')}`,
        target,
        type,
        status,
        progress: status === 'completed' ? 100 : Math.floor(Math.random() * 90) + 10,
        created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        risk_score: Math.floor(Math.random() * 100),
        duration: Math.floor(Math.random() * 300) + 30,
        tools_used: Object.keys(mockOsintTools[Object.keys(mockOsintTools)[Math.floor(Math.random() * Object.keys(mockOsintTools).length)]]).slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }
    
    return investigations;
  };

  useEffect(() => {
    // 🎯 Initialisation avec algorithmes avancés
    setInvestigations(generateMockInvestigations());
    setTools(mockOsintTools);
    setIsConnected(true);
    
    // 🤖 Messages IA dynamiques
    const generateChatMessages = () => {
      const messages = [
        { id: 1, sender: 'assistant', content: mockAIResponses.greetings[Math.floor(Math.random() * mockAIResponses.greetings.length)] },
        { id: 2, sender: 'user', content: 'Peux-tu analyser cette adresse email: ' + MockDataGenerator.generateRealisticEmail() + '?' },
        { id: 3, sender: 'assistant', content: mockAIResponses.tool_suggestions.email },
        { id: 4, sender: 'user', content: 'Et ce numéro de téléphone: ' + MockDataGenerator.generatePhoneNumber() + '?' },
        { id: 5, sender: 'assistant', content: mockAIResponses.tool_suggestions.phone }
      ];
      return messages;
    };
    
    setChatMessages(generateChatMessages());
    
    // 🔄 Mise à jour temps réel des données
    const interval = setInterval(() => {
      const liveData = generateLiveData();
      // Simuler des mises à jour en temps réel
      if (Math.random() > 0.7) {
        setInvestigations(prev => {
          const updated = [...prev];
          const randomIndex = Math.floor(Math.random() * updated.length);
          if (updated[randomIndex] && updated[randomIndex].status === 'running') {
            updated[randomIndex].progress = Math.min(100, updated[randomIndex].progress + Math.floor(Math.random() * 10) + 1);
            if (updated[randomIndex].progress === 100) {
              updated[randomIndex].status = 'completed';
            }
          }
          return updated;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="dashboard-view">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Investigations</h3>
          <div className="stat-number">{investigations.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <h3>Outils Actifs</h3>
          <div className="stat-number">{Object.values(tools).reduce((acc, cat) => acc + Object.keys(cat).length, 0)}</div>
          <div className="stat-label">Disponibles</div>
        </div>
        <div className="stat-card">
          <h3>Succès</h3>
          <div className="stat-number">98%</div>
          <div className="stat-label">Taux de réussite</div>
        </div>
        <div className="stat-card">
          <h3>Temps Moyen</h3>
          <div className="stat-number">2.3s</div>
          <div className="stat-label">Par requête</div>
        </div>
      </div>

      <div className="recent-investigations">
        <h3>🔍 Investigations Récentes</h3>
        {investigations.map(inv => (
          <div key={inv.id} className="investigation-card">
            <div className="inv-header">
              <span className="inv-id">{inv.id}</span>
              <span className={`inv-status ${inv.status}`}>{inv.status}</span>
            </div>
            <div className="inv-target">{inv.target}</div>
            <div className="inv-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${inv.progress}%`}}></div>
              </div>
              <span>{inv.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="tools-view">
      <h3>🛠️ Outils OSINT Disponibles</h3>
      {Object.entries(tools).map(([category, categoryTools]) => (
        <div key={category} className="tool-category">
          <h4>{category.toUpperCase()}</h4>
          <div className="tools-grid">
            {Object.entries(categoryTools).map(([toolKey, tool]) => (
              <div key={toolKey} className="tool-card">
                <div className="tool-header">
                  <span className="tool-name">{tool.name}</span>
                  <span className={`tool-status ${tool.status}`}>●</span>
                </div>
                <p className="tool-description">{tool.description}</p>
                <button className="tool-action">Utiliser</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="chat-view">
      <div className="chat-header">
        <h3>🤖 AURA IA Assistant</h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
        </div>
      </div>
      
      <div className="chat-messages">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input type="text" placeholder="Posez votre question OSINT..." />
        <button>📤</button>
      </div>
    </div>
  );

  const renderInvestigations = () => (
    <div className="investigations-view">
      <div className="investigations-header">
        <h3>🔍 Mes Investigations</h3>
        <button className="new-investigation">+ Nouvelle Investigation</button>
      </div>
      
      {investigations.map(inv => (
        <div key={inv.id} className="detailed-investigation">
          <div className="inv-main-info">
            <h4>{inv.id}</h4>
            <div className="inv-meta">
              <span>Cible: {inv.target}</span>
              <span>Type: {inv.type}</span>
              <span>Statut: {inv.status}</span>
            </div>
          </div>
          
          <div className="inv-results">
            <h5>Résultats:</h5>
            {Object.entries(inv.results).map(([key, result]) => (
              <div key={key} className="result-item">
                <strong>{key}:</strong> {JSON.stringify(result)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="aura-demo">
      <div className="demo-header">
        <h2>🎯 AURA OSINT - Démo Interactive</h2>
        <p>Découvrez l'interface complète de notre plateforme OSINT</p>
      </div>

      <div className="demo-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'tools' ? 'active' : ''} 
          onClick={() => setActiveTab('tools')}
        >
          🛠️ Outils
        </button>
        <button 
          className={activeTab === 'chat' ? 'active' : ''} 
          onClick={() => setActiveTab('chat')}
        >
          💬 IA Chat
        </button>
        <button 
          className={activeTab === 'investigations' ? 'active' : ''} 
          onClick={() => setActiveTab('investigations')}
        >
          🔍 Investigations
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'tools' && renderTools()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'investigations' && renderInvestigations()}
      </div>
    </div>
  );
};

export default AuraDemo;