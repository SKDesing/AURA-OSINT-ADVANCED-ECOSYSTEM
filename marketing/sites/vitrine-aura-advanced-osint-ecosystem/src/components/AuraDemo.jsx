import React, { useState, useEffect } from 'react';
import './AuraDemo.css';

const AuraDemo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [investigations, setInvestigations] = useState([]);
  const [tools, setTools] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Données factices basées sur le backend AURA
  const mockInvestigations = [
    {
      id: 'INV-2024-001',
      target: 'john.doe@example.com',
      type: 'email',
      status: 'completed',
      progress: 100,
      results: {
        breach_check: { found: true, breaches: 3 },
        social_media: { platforms: ['Twitter', 'LinkedIn'] },
        whois: { domain: 'example.com', registrar: 'GoDaddy' }
      },
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'INV-2024-002', 
      target: '+33612345678',
      type: 'phone',
      status: 'running',
      progress: 65,
      results: {
        carrier: 'Orange France',
        location: 'Paris, France',
        social_links: []
      },
      created_at: '2024-01-15T14:20:00Z'
    }
  ];

  const mockTools = {
    email: {
      holehe: { name: 'Holehe', status: 'active', description: 'Vérification comptes sociaux' },
      breach_check: { name: 'Breach Check', status: 'active', description: 'Vérification fuites de données' }
    },
    phone: {
      phoneinfoga: { name: 'PhoneInfoga', status: 'active', description: 'Analyse numéros téléphone' },
      truecaller: { name: 'TrueCaller API', status: 'active', description: 'Identification appelant' }
    },
    social: {
      sherlock: { name: 'Sherlock', status: 'active', description: 'Recherche username' },
      social_analyzer: { name: 'Social Analyzer', status: 'active', description: 'Analyse profils sociaux' }
    },
    network: {
      whois: { name: 'WHOIS', status: 'active', description: 'Informations domaine' },
      nmap: { name: 'Nmap', status: 'active', description: 'Scan réseau' },
      subfinder: { name: 'Subfinder', status: 'active', description: 'Découverte sous-domaines' }
    }
  };

  useEffect(() => {
    setInvestigations(mockInvestigations);
    setTools(mockTools);
    setIsConnected(true);
    
    // Messages de chat factices
    setChatMessages([
      { id: 1, sender: 'assistant', content: '👋 Bonjour! Je suis AURA IA, votre assistant OSINT.' },
      { id: 2, sender: 'user', content: 'Peux-tu analyser cette adresse email?' },
      { id: 3, sender: 'assistant', content: '🔍 Bien sûr! Je vais utiliser Holehe et Breach Check pour analyser cette adresse email.' }
    ]);
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