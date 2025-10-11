import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import Hero3D from './components/Hero3D';
import LiveDemo from './components/LiveDemo';
import Services from './components/Services';
import Contact from './components/Contact';
import ThemeToggle from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';
import AuraDemo from './components/AuraDemo';
import AuraStats from './components/AuraStats';
import AuraNotifications from './components/AuraNotifications';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const navigation = [
    { id: 'home', label: 'Accueil' },
    { id: 'demo', label: 'Démo Live' },
    { id: 'stats', label: 'Statistiques' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Réalisations' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>🛡️ AURA ADVANCED OSINT ECOSYSTEM</h2>
        </div>
        <div className="nav-links">
          {navigation.map(item => (
            <button 
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle />
        </div>
      </nav>

      <main>
        <ErrorBoundary>
          {activeSection === 'home' && (
            <>
              <Hero3D />
              <LiveDemo />
            </>
          )}
          {activeSection === 'demo' && (
            <>
              <AuraDemo />
              <AuraNotifications />
            </>
          )}
          {activeSection === 'stats' && (
            <>
              <AuraStats />
              <AuraNotifications />
            </>
          )}
          {activeSection === 'services' && <Services />}
          {activeSection === 'contact' && <Contact />}
        
        {activeSection === 'portfolio' && (
          <section className="portfolio">
            <div className="container">
              <h2>🏆 Réalisations</h2>
              <div className="portfolio-grid">
                <div className="portfolio-item">
                  <h3>TikTok Intelligence Engine</h3>
                  <p>Monitoring en temps réel de 50k+ messages/stream</p>
                  <span className="tech-stack">React • Node.js • Chromium</span>
                </div>
                <div className="portfolio-item">
                  <h3>Cross-Platform Correlation</h3>
                  <p>IA de corrélation d'identités multi-plateformes</p>
                  <span className="tech-stack">Python • ML • PostgreSQL</span>
                </div>
                <div className="portfolio-item">
                  <h3>Forensic Data Pipeline</h3>
                  <p>Pipeline de données forensiques avec intégrité cryptographique</p>
                  <span className="tech-stack">Docker • Kubernetes • Redis</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="about">
            <div className="container">
              <h2>🎯 À propos d'AURA</h2>
              <div className="about-content">
                <div className="about-text">
                  <h3>Vision</h3>
                  <p>Démocratiser l'intelligence OSINT avec des outils de niveau enterprise accessibles aux professionnels.</p>
                  
                  <h3>Mission</h3>
                  <p>Fournir la plateforme OSINT la plus avancée pour les enquêteurs, analystes et chercheurs.</p>
                  
                  <h3>Valeurs</h3>
                  <ul>
                    <li>🔒 Sécurité et confidentialité by design</li>
                    <li>🎯 Précision et fiabilité des données</li>
                    <li>⚡ Performance et scalabilité</li>
                    <li>🤝 Éthique et responsabilité</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
        </ErrorBoundary>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AURA ADVANCED OSINT ECOSYSTEM</h4>
              <p>Professional OSINT Made Simple</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>OSINT Investigation</li>
                <li>Forensic Analysis</li>
                <li>Custom Development</li>
                <li>Consulting</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>contact@aura-osint.com</p>
              <p>security@aura-osint.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AURA ADVANCED OSINT ECOSYSTEM. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Toast Notifications Globales */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(26, 31, 58, 0.95)',
            color: '#ffffff',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)',
            fontFamily: 'Inter, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff'
            }
          },
          loading: {
            iconTheme: {
              primary: '#FFD700',
              secondary: '#0a0e27'
            }
          }
        }}
      />
    </div>
  );
}

export default App;