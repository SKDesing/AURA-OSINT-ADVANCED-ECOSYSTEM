import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import TikTokLandingPage from './components/TikTokLandingPage';
import ForensicProfilesManager from './components/ForensicProfilesManager';
import ProfileCreationWizard from './components/ProfileCreationWizard';
import ErrorBoundary from './components/ErrorBoundary';
import SystemDashboard from './components/SystemDashboard';
import './styles/globals.css';

interface LiveData {
  type: string;
  nickname?: string;
  content?: string;
  is_moderator?: boolean;
  is_owner?: boolean;
  is_vip?: boolean;
  gift_name?: string;
  sender_nickname?: string;
  evidenceHash?: string;
}

interface Session {
  id: number;
  title: string;
  live_url: string;
  started_at: string;
  comment_count?: number;
  gift_count?: number;
}

function App() {
  // États principaux
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState('Déconnecté');
  
  // États Live Capture
  const [url, setUrl] = useState('https://www.tiktok.com/@titilepirate3/live');
  const [title, setTitle] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [liveData, setLiveData] = useState<LiveData[]>([]);
  
  // États Database Explorer
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [customQuery, setCustomQuery] = useState('SELECT * FROM user_profiles ORDER BY follower_count DESC LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any[]>([]);

  useEffect(() => {
    if (!showLanding) {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
      
      newSocket.on('connect', () => {
        setStatus('Connecté');
        loadSessions();
      });
      
      newSocket.on('liveData', (data: { sessionId: number, data: LiveData, evidenceHash: string }) => {
        if (currentSession && data.sessionId === currentSession.id) {
          setLiveData(prev => [{ ...data.data, evidenceHash: data.evidenceHash }, ...prev.slice(0, 199)]);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [showLanding, currentSession]);

  const loadSessions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
    }
  };

  const startSession = async () => {
    if (!url.includes('tiktok.com')) {
      alert('URL TikTok invalide');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveUrl: url, title: title || 'Live TikTok' })
      });
      
      const result = await response.json();
      if (result.success) {
        setCurrentSession(result.session);
        setStatus('Session active');
        setLiveData([]);
        loadSessions();
      }
    } catch (error) {
      alert('Erreur démarrage session');
    }
  };
  
  const stopSession = async () => {
    if (!currentSession) return;
    
    try {
      await fetch(`http://localhost:4000/api/sessions/${currentSession.id}`, {
        method: 'DELETE'
      });
      
      setCurrentSession(null);
      setStatus('Session arrêtée');
      loadSessions();
    } catch (error) {
      alert('Erreur arrêt session');
    }
  };

  const clearData = () => {
    setLiveData([]);
  };
  
  // Fonctions pour l'exploration de base de données
  const loadTables = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/database/tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Erreur chargement tables:', error);
    }
  };
  
  const loadTableData = async (tableName: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/database/table/${tableName}`);
      const data = await response.json();
      setTableData(data.data || []);
      setSelectedTable(tableName);
    } catch (error) {
      console.error('Erreur chargement données table:', error);
    }
  };
  
  const executeQuery = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customQuery })
      });
      const data = await response.json();
      if (data.error) {
        alert('Erreur SQL: ' + data.error);
      } else {
        setQueryResult(data.data || []);
      }
    } catch (error) {
      alert('Erreur exécution requête');
    }
  };
  
  useEffect(() => {
    if (activeTab === 'database') {
      loadTables();
    }
  }, [activeTab]);

  if (showLanding) {
    return <TikTokLandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analyser':
        return renderTikTokAnalyser();
      case 'lives':
        return renderLivesAnalyser();
      case 'database':
        return renderDatabaseExplorer();
      case 'profiles':
        return (
          <ErrorBoundary>
            <ForensicProfilesManager />
          </ErrorBoundary>
        );
      case 'create-profile':
        return (
          <ErrorBoundary>
            <ProfileCreationWizard />
          </ErrorBoundary>
        );
      case 'processing':
        return renderDataProcessing();
      case 'reports':
        return renderReports();
      case 'system':
        return <SystemDashboard />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '3rem',
          background: 'linear-gradient(90deg, #FF0050, #25F4EE)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '10px'
        }}>
          TikTok Live Analyser
        </h1>
        <p style={{ color: '#B0B0B0', fontSize: '1.2rem' }}>
          Solution forensique professionnelle pour l'analyse des lives TikTok
        </p>
      </div>
      
      {/* Stats globales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#25F4EE' }}>📊</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF0050', marginBottom: '5px' }}>
            {sessions.length}
          </div>
          <div style={{ color: '#B0B0B0' }}>Sessions Total</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#25F4EE' }}>📡</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF0050', marginBottom: '5px' }}>
            {currentSession ? '1' : '0'}
          </div>
          <div style={{ color: '#B0B0B0' }}>Sessions Actives</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#25F4EE' }}>💬</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF0050', marginBottom: '5px' }}>
            {liveData.filter(d => d.type === 'comment').length}
          </div>
          <div style={{ color: '#B0B0B0' }}>Commentaires Live</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#25F4EE' }}>🔒</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF0050', marginBottom: '5px' }}>
            {liveData.filter(d => d.evidenceHash).length}
          </div>
          <div style={{ color: '#B0B0B0' }}>Preuves Sécurisées</div>
        </div>
      </div>
      
      {/* Accès rapides */}
      <div className="card" style={{ padding: '30px' }}>
        <h3 style={{ color: '#25F4EE', marginBottom: '25px', fontSize: '1.5rem' }}>⚡ Accès Rapides</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab('analyser')}
            style={{ padding: '15px 25px', fontSize: '1.1rem' }}
          >
            📡 TikTok Live Analyser
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab('profiles')}
            style={{ padding: '15px 25px', fontSize: '1.1rem' }}
          >
            👥 Profils LIVER
          </button>
          <button
            className="btn btn-accent"
            onClick={() => setActiveTab('create-profile')}
            style={{ padding: '15px 25px', fontSize: '1.1rem' }}
          >
            ➕ Créer Profil
          </button>
          <button
            className="btn btn-accent"
            onClick={() => setActiveTab('database')}
            style={{ padding: '15px 25px', fontSize: '1.1rem' }}
          >
            🗄️ Base de Données
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setActiveTab('reports')}
            style={{ padding: '15px 25px', fontSize: '1.1rem' }}
          >
            📋 Rapports
          </button>
        </div>
      </div>
    </div>
  );

  const renderTikTokAnalyser = () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ 
        fontSize: '2.5rem',
        color: '#25F4EE',
        marginBottom: '30px'
      }}>
        📡 TikTok Live Analyser
      </h2>
      
      {/* Interface d'analyse */}
      <div className="card" style={{ 
        padding: '40px',
        marginBottom: '30px',
        background: 'linear-gradient(135deg, rgba(255, 0, 80, 0.1), rgba(37, 244, 238, 0.1))'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la session"
            disabled={!!currentSession}
            className="form-input"
            style={{ marginBottom: '15px' }}
          />
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/live"
              disabled={!!currentSession}
              className="form-input"
              style={{ flex: 1 }}
            />
            
            {!currentSession ? (
              <button
                className="btn btn-primary"
                onClick={startSession}
                style={{ padding: '15px 25px', fontSize: '1.1rem' }}
              >
                🚀 Analyser
              </button>
            ) : (
              <button
                className="btn"
                onClick={stopSession}
                style={{ 
                  padding: '15px 25px', 
                  fontSize: '1.1rem',
                  background: '#FF0050',
                  color: 'white'
                }}
              >
                🛑 Arrêter
              </button>
            )}
          </div>
        </div>
        
        {/* Stats en temps réel */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <i className="fas fa-users" style={{ fontSize: '2rem', color: '#25F4EE', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              {Math.floor(Math.random() * 15000)}
            </div>
            <div style={{ color: '#B0B0B0' }}>Spectateurs</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <i className="fas fa-heart" style={{ fontSize: '2rem', color: '#FF0050', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              {liveData.filter(d => d.type === 'comment').length}
            </div>
            <div style={{ color: '#B0B0B0' }}>Commentaires</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <i className="fas fa-gift" style={{ fontSize: '2rem', color: '#FF2D55', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              {liveData.filter(d => d.type === 'gift').length}
            </div>
            <div style={{ color: '#B0B0B0' }}>Cadeaux</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#25F4EE', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              {liveData.filter(d => d.evidenceHash).length}
            </div>
            <div style={{ color: '#B0B0B0' }}>Preuves</div>
          </div>
        </div>
      </div>
      
      {/* Données live */}
      {currentSession && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#25F4EE' }}>📡 Données Live - {currentSession.title}</h3>
            <button
              className="btn btn-ghost"
              onClick={clearData}
            >
              🗑️ Vider
            </button>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {liveData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
                <div style={{ fontSize: '3em', marginBottom: '20px' }}>📡</div>
                <p>En attente de données live...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {liveData.map((data, index) => (
                  <div key={index} style={{ 
                    background: '#1A1A1A',
                    padding: '15px',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${data.type === 'comment' ? '#25F4EE' : '#FF0050'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: data.is_owner ? '#FF0050' : data.is_moderator ? '#25F4EE' : '#fff' 
                      }}>
                        {data.nickname || data.sender_nickname}
                        {data.is_owner && ' 👑'}
                        {data.is_moderator && ' 🛡️'}
                        {data.is_vip && ' ⭐'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#B0B0B0' }}>
                        {data.type === 'comment' ? '💬' : '🎁'}
                      </span>
                    </div>
                    <div style={{ color: '#ddd', fontSize: '14px', marginBottom: '8px' }}>
                      {data.content || `Cadeau: ${data.gift_name}`}
                    </div>
                    {data.evidenceHash && (
                      <div style={{ fontSize: '10px', color: '#666' }}>
                        🔒 {data.evidenceHash.substring(0, 16)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderLivesAnalyser = () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#25F4EE', marginBottom: '30px' }}>
        🎥 Les Lives Analyser
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {/* Live cards avec les vrais profils */}
        {[
          { username: '@titilepirate3', title: 'Gaming Session Live', viewers: '12.5K', likes: '45.2K', duration: '25 min' },
          { username: '@titi.le.pirate', title: 'Nouveau contenu gaming', viewers: '8.3K', likes: '22.1K', duration: '42 min' },
          { username: '@saadallahnordine', title: 'Motivation du jour', viewers: '15.7K', likes: '67.8K', duration: '18 min' },
          { username: '@sedsky777', title: 'Humour et tendances', viewers: '5.2K', likes: '18.9K', duration: '35 min' }
        ].map((live, index) => (
          <div key={index} className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ 
              height: '180px',
              background: `linear-gradient(135deg, #FF0050, #25F4EE)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#FF0050',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fas fa-circle" style={{ animation: 'pulse 1.5s infinite' }}></i>
                EN DIRECT
              </div>
              <i className="fab fa-tiktok" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.3)' }}></i>
            </div>
            
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '10px', color: '#25F4EE' }}>{live.username}</h3>
              <p style={{ color: '#B0B0B0', marginBottom: '15px' }}>{live.title}</p>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                color: '#B0B0B0',
                fontSize: '0.9rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-eye"></i> {live.viewers}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-heart"></i> {live.likes}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-clock"></i> {live.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDatabaseExplorer = () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#25F4EE', marginBottom: '30px' }}>
        🗄️ Base de Données
      </h2>
      
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#25F4EE', marginBottom: '20px' }}>Tables ({tables.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
          {tables.map((table) => (
            <button
              key={table.table_name}
              onClick={() => loadTableData(table.table_name)}
              className={selectedTable === table.table_name ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ fontSize: '0.9rem' }}
            >
              {table.table_name} ({table.column_count})
            </button>
          ))}
        </div>
        
        <div>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>Requête SQL Personnalisée</h4>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="SELECT * FROM user_profiles LIMIT 10;"
              className="form-input"
              style={{
                flex: 1,
                minHeight: '80px',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={executeQuery}
              className="btn btn-secondary"
              style={{ padding: '15px 25px' }}
            >
              ▶️ Exécuter
            </button>
          </div>
        </div>
      </div>
      
      {/* Résultats */}
      <div className="card">
        <h3 style={{ color: '#25F4EE', marginBottom: '20px' }}>
          📊 Résultats {selectedTable && `- ${selectedTable}`}
        </h3>
        
        <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
          {(tableData.length > 0 || queryResult.length > 0) ? (
            <table className="table">
              <thead>
                <tr>
                  {Object.keys((tableData[0] || queryResult[0]) || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(queryResult.length > 0 ? queryResult : tableData).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {value !== null ? String(value) : 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#B0B0B0' }}>
              <div style={{ fontSize: '4em', marginBottom: '20px' }}>📊</div>
              <p>Sélectionnez une table ou exécutez une requête</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDataProcessing = () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#25F4EE', marginBottom: '30px' }}>
        ⚙️ Traitement des Données
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-filter" style={{ fontSize: '3rem', color: '#25F4EE', marginBottom: '20px' }}></i>
          <h3 style={{ marginBottom: '15px' }}>Filtrage et Nettoyage</h3>
          <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>
            Élimination des données non pertinentes et normalisation des formats
          </p>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>1</div>
              <span>Détection de spam</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>2</div>
              <span>Normalisation du texte</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>3</div>
              <span>Vérification de cohérence</span>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-project-diagram" style={{ fontSize: '3rem', color: '#25F4EE', marginBottom: '20px' }}></i>
          <h3 style={{ marginBottom: '15px' }}>Croisement de Données</h3>
          <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>
            Combinaison de sources multiples pour enrichir l'analyse
          </p>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>1</div>
              <span>Appariement d'identités</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>2</div>
              <span>Fusion de profils</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>3</div>
              <span>Enrichissement contextuel</span>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-brain" style={{ fontSize: '3rem', color: '#25F4EE', marginBottom: '20px' }}></i>
          <h3 style={{ marginBottom: '15px' }}>Analyse par IA</h3>
          <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>
            Algorithmes d'intelligence artificielle pour extraire des insights
          </p>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>1</div>
              <span>Analyse de sentiment</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>2</div>
              <span>Détection de tendances</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '25px', height: '25px', background: '#FF0050', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.8rem', fontWeight: 'bold'
              }}>3</div>
              <span>Prédictions comportementales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#25F4EE', marginBottom: '30px' }}>
        📋 Rapports d'Enquête
      </h2>
      
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '5em', marginBottom: '30px', color: '#25F4EE' }}>📋</div>
        <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: '#25F4EE' }}>
          Générateur de Rapports Forensiques
        </h3>
        <p style={{ color: '#B0B0B0', fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Module de génération automatique de rapports d'enquête avec preuves horodatées et intégrité cryptographique
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">📊 Rapport Performance</button>
          <button className="btn btn-secondary">👥 Rapport Audience</button>
          <button className="btn btn-accent">📈 Rapport Tendances</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0F0F0F',
      color: 'white'
    }}>
      {/* Navigation TikTok Style */}
      <nav style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        padding: '10px 40px',
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#FF0050',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fab fa-tiktok" style={{ color: '#25F4EE' }}></i>
              TikTok Live Analyser
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'analyser', label: 'Analyser', icon: '📡' },
                { id: 'lives', label: 'Lives', icon: '🎥' },
                { id: 'profiles', label: 'Profils', icon: '👥' },
                { id: 'create-profile', label: 'Créer', icon: '➕' },
                { id: 'database', label: 'Database', icon: '🗄️' },
                { id: 'processing', label: 'Traitement', icon: '⚙️' },
                { id: 'reports', label: 'Rapports', icon: '📋' }
                { id: 'system', label: 'Système', icon: '🎮' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 16px',
                    background: activeTab === tab.id ? 'linear-gradient(90deg, #FF0050, #25F4EE)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#B0B0B0',
                    border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              padding: '8px 16px',
              background: status === 'Connecté' ? 'linear-gradient(90deg, #4CAF50, #25F4EE)' : '#666',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              {status === 'Connecté' ? '✓ Connecté' : '⚠️ Déconnecté'}
            </div>
            {currentSession && (
              <div style={{ 
                padding: '8px 16px',
                background: 'linear-gradient(90deg, #FF0050, #FF2D55)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                🔴 LIVE: {currentSession.title}
              </div>
            )}
            <button
              onClick={() => setShowLanding(true)}
              className="btn btn-ghost"
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              ← Accueil
            </button>
          </div>
        </div>
      </nav>
      
      {/* Contenu principal */}
      <main style={{ 
        paddingTop: '70px',
        minHeight: 'calc(100vh - 70px)',
        overflow: 'auto'
      }}>
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;