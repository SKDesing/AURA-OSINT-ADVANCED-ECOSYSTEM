import React from 'react';
import '../shared/tiktok-theme.css';

const App: React.FC = () => {
  return (
    <div className="tiktok-container">
      <header className="tiktok-header">
        <div className="tiktok-logo">
          <div className="tiktok-logo-icon">🔥</div>
          <div>
            <h1 className="tiktok-title">AURA FORENSIC</h1>
            <span className="tiktok-subtitle">React Dashboard</span>
          </div>
        </div>
        <div className="tiktok-status">
          <span className="tiktok-status-dot online"></span>
          <span>Système actif</span>
        </div>
      </header>

      <div className="tiktok-grid-3">
        <div className="tiktok-card tiktok-fade-in">
          <h3 style={{ color: 'var(--tiktok-red)', marginBottom: '15px' }}>
            📊 Analytics
          </h3>
          <p style={{ color: 'var(--tiktok-light-gray)' }}>
            Analyse des données TikTok Live en temps réel
          </p>
          <button className="tiktok-btn tiktok-btn-primary" style={{ marginTop: '15px' }}>
            Voir Analytics
          </button>
        </div>

        <div className="tiktok-card tiktok-fade-in">
          <h3 style={{ color: 'var(--tiktok-red)', marginBottom: '15px' }}>
            🎥 Lives
          </h3>
          <p style={{ color: 'var(--tiktok-light-gray)' }}>
            Surveillance des lives TikTok actifs
          </p>
          <button className="tiktok-btn tiktok-btn-secondary" style={{ marginTop: '15px' }}>
            Gérer Lives
          </button>
        </div>

        <div className="tiktok-card tiktok-fade-in">
          <h3 style={{ color: 'var(--tiktok-red)', marginBottom: '15px' }}>
            📋 Rapports
          </h3>
          <p style={{ color: 'var(--tiktok-light-gray)' }}>
            Génération de rapports forensiques
          </p>
          <button className="tiktok-btn tiktok-btn-primary" style={{ marginTop: '15px' }}>
            Créer Rapport
          </button>
        </div>
      </div>

      <div className="tiktok-card">
        <h3 style={{ color: 'var(--tiktok-red)', marginBottom: '15px' }}>
          🚀 Actions rapides
        </h3>
        <div className="tiktok-grid-4">
          <button className="tiktok-btn tiktok-btn-primary">
            Nouvelle capture
          </button>
          <button className="tiktok-btn tiktok-btn-secondary">
            Voir profils
          </button>
          <button className="tiktok-btn tiktok-btn-secondary">
            Base de données
          </button>
          <button className="tiktok-btn tiktok-btn-danger">
            Arrêter tout
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;