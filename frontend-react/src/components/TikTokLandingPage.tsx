import React from 'react';

interface TikTokLandingPageProps {
  onEnterApp: () => void;
}

const TikTokLandingPage: React.FC<TikTokLandingPageProps> = ({ onEnterApp }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
      color: 'white',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: '15px 50px',
        background: 'rgba(15, 15, 15, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FF0050',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fab fa-tiktok" style={{ fontSize: '28px', color: '#25F4EE' }}></i>
            <span>TikTok Live Analyser</span>
          </div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Fonctionnalités</a>
            <a href="#demo" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Démo</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contact</a>
            <button
              onClick={onEnterApp}
              style={{
                padding: '12px 24px',
                background: '#FF0050',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e6004d';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 80, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#FF0050';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🚀 Accéder à l'Application
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        background: `linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(15, 15, 15, 0.7)), url('https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ 
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '800px',
          padding: '0 20px'
        }}>
          <h1 style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #FF0050, #25F4EE)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            Solution Forensique TikTok Live
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '40px',
            color: '#B0B0B0',
            lineHeight: '1.6'
          }}>
            Analysez, surveillez et extrayez des données des lives TikTok en temps réel
            <br />
            Plateforme professionnelle pour journalistes d'investigation et instances étatiques
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button
              onClick={onEnterApp}
              style={{
                padding: '15px 30px',
                background: '#FF0050',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Démarrer le Suivi
            </button>
            <button
              style={{
                padding: '15px 30px',
                background: '#FF2D55',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Voir la Démo
            </button>
          </div>
          
          {/* Feature Cards */}
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ 
              background: '#1A1A1A',
              padding: '30px',
              borderRadius: '15px',
              width: '300px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '3rem', marginBottom: '20px', color: '#25F4EE' }}></i>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Sécurité Locale</h3>
              <p style={{ color: '#B0B0B0', lineHeight: '1.6' }}>
                Toutes les données restent sur votre infrastructure. 
                Aucune transmission vers des serveurs tiers.
              </p>
            </div>
            
            <div style={{ 
              background: '#1A1A1A',
              padding: '30px',
              borderRadius: '15px',
              width: '300px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <i className="fas fa-fingerprint" style={{ fontSize: '3rem', marginBottom: '20px', color: '#25F4EE' }}></i>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Intégrité Forensique</h3>
              <p style={{ color: '#B0B0B0', lineHeight: '1.6' }}>
                Hash cryptographique de chaque preuve.
                Traçabilité complète pour usage judiciaire.
              </p>
            </div>
            
            <div style={{ 
              background: '#1A1A1A',
              padding: '30px',
              borderRadius: '15px',
              width: '300px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '20px', color: '#25F4EE' }}></i>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Analyse Temps Réel</h3>
              <p style={{ color: '#B0B0B0', lineHeight: '1.6' }}>
                Capture instantanée des commentaires, cadeaux,
                et métadonnées des utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        background: '#1f1f1f',
        padding: '80px 50px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5em', 
            marginBottom: '50px',
            color: '#25F4EE'
          }}>
            Fonctionnalités Professionnelles
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>🎯 Capture Multi-Sessions</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Surveillance simultanée de plusieurs lives TikTok avec isolation des données par session.
              </p>
            </div>
            
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>👥 Profils LIVER</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Base de données enrichie des créateurs de contenu avec historique complet.
              </p>
            </div>
            
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>🔍 Exploration SQL</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Interface de requêtes avancées pour analyses forensiques approfondies.
              </p>
            </div>
            
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>📈 Analytics Avancés</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Tableaux de bord avec métriques, tendances et détection d'anomalies.
              </p>
            </div>
            
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>📋 Rapports d'Enquête</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Génération automatique de rapports avec preuves horodatées.
              </p>
            </div>
            
            <div style={{ background: '#1A1A1A', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#25F4EE', marginBottom: '15px' }}>🛡️ Conformité RGPD</h4>
              <p style={{ color: '#B0B0B0', lineHeight: '1.5' }}>
                Respect des réglementations européennes sur la protection des données.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 50px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255, 0, 80, 0.1), rgba(37, 244, 238, 0.1))'
      }}>
        <h2 style={{ fontSize: '2.5em', marginBottom: '20px', color: '#25F4EE' }}>
          Prêt pour vos Investigations ?
        </h2>
        <p style={{ fontSize: '1.2em', color: '#B0B0B0', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Rejoignez les professionnels qui font confiance à TikTok Live Analyser pour leurs enquêtes forensiques
        </p>
        <button
          onClick={onEnterApp}
          style={{
            padding: '20px 40px',
            background: 'linear-gradient(90deg, #FF0050, #25F4EE)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(255, 0, 80, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          🚀 Démarrer Maintenant
        </button>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#1A1A1A',
        padding: '50px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FF0050',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fab fa-tiktok" style={{ color: '#25F4EE' }}></i>
            TikTok Live Analyser
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Accueil</a>
            <a href="#" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Fonctionnalités</a>
            <a href="#" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Documentation</a>
            <a href="#" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Mentions Légales</a>
          </div>
          
          <div style={{ 
            color: '#B0B0B0',
            fontSize: '0.9rem',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            © 2024 TikTok Live Analyser - Solution Forensique Professionnelle
            <br />
            🔒 Sécurisé • 🏛️ Conforme • 🎯 Professionnel
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TikTokLandingPage;