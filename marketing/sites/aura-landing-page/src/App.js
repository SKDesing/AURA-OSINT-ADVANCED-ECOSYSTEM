import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="hero-section">
          <h1 className="hero-title">
            🛡️ AURA
          </h1>
          <p className="hero-subtitle">
            Advanced Universal Recognition & Analysis
          </p>
          <p className="hero-description">
            Moteur d'intelligence forensique cross-plateforme world-class
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => window.location.href = 'http://localhost:3000'}>
              Accéder à l'Interface
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = 'https://github.com/SKDesing/TikTok-Live-Analyser'}>
              Voir le Code
            </button>
          </div>
        </div>
      </header>
      
      <section className="features">
        <div className="container">
          <h2>Fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔍 Analyse OSINT</h3>
              <p>Extraction automatisée cross-platform</p>
            </div>
            <div className="feature-card">
              <h3>🧠 Corrélation IA</h3>
              <p>Matching identités avec ML</p>
            </div>
            <div className="feature-card">
              <h3>🔐 Sécurité</h3>
              <p>Chiffrement et audit trail</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;