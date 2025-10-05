import React from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 50px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '2em' }}>🎯</div>
          <h1 style={{ margin: 0, color: '#00ff88', fontSize: '1.8em' }}>LIVE TRACKER PRO</h1>
        </div>
        <button
          onClick={onEnterApp}
          style={{
            padding: '12px 24px',
            backgroundColor: '#00ff88',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          🚀 Accéder à l'Application
        </button>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '80px 50px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '3.5em', 
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #00ff88, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Solution Forensique TikTok Live
        </h1>
        <p style={{ 
          fontSize: '1.3em', 
          color: '#ccc', 
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Plateforme professionnelle de capture et d'analyse en temps réel des diffusions TikTok Live.
          <br />
          Conçue pour les journalistes d'investigation et les instances étatiques.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ 
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '250px',
            border: '1px solid #444'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🔒</div>
            <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>Sécurité Locale</h3>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              Toutes les données restent sur votre infrastructure. 
              Aucune transmission vers des serveurs tiers.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '250px',
            border: '1px solid #444'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>⚖️</div>
            <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>Intégrité Forensique</h3>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              Hash cryptographique de chaque preuve.
              Traçabilité complète pour usage judiciaire.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '15px',
            minWidth: '250px',
            border: '1px solid #444'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
            <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>Analyse Temps Réel</h3>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              Capture instantanée des commentaires, cadeaux,
              et métadonnées des utilisateurs.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        backgroundColor: '#1f1f1f',
        padding: '60px 50px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5em', 
            marginBottom: '50px',
            color: '#00ff88'
          }}>
            Fonctionnalités Professionnelles
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>🎯 Capture Multi-Sessions</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Surveillance simultanée de plusieurs lives TikTok avec isolation des données par session.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>👥 Profils LIVER</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Base de données enrichie des créateurs de contenu avec historique complet.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>🔍 Exploration SQL</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Interface de requêtes avancées pour analyses forensiques approfondies.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>📈 Analytics Avancés</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Tableaux de bord avec métriques, tendances et détection d'anomalies.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>📋 Rapports d'Enquête</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Génération automatique de rapports avec preuves horodatées.
              </p>
            </div>
            
            <div style={{ backgroundColor: '#2a2a2a', padding: '25px', borderRadius: '10px' }}>
              <h4 style={{ color: '#00ff88', marginBottom: '15px' }}>🛡️ Conformité RGPD</h4>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>
                Respect des réglementations européennes sur la protection des données.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '60px 50px',
        textAlign: 'center',
        backgroundColor: '#0a0a0a'
      }}>
        <h2 style={{ fontSize: '2.2em', marginBottom: '20px', color: '#00ff88' }}>
          Prêt pour vos Investigations ?
        </h2>
        <p style={{ fontSize: '1.1em', color: '#ccc', marginBottom: '30px' }}>
          Rejoignez les professionnels qui font confiance à LIVE TRACKER PRO
        </p>
        <button
          onClick={onEnterApp}
          style={{
            padding: '15px 40px',
            backgroundColor: '#00ff88',
            color: 'black',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
          }}
        >
          🚀 Démarrer Maintenant
        </button>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '30px 50px',
        borderTop: '1px solid #333',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>© 2024 LIVE TRACKER PRO - Solution Forensique Professionnelle</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          🔒 Sécurisé • 🏛️ Conforme • 🎯 Professionnel
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;