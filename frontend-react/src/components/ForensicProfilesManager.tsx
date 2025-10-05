import React, { useState, useEffect } from 'react';

interface Profile {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  verified: boolean;
  follower_count: number;
  following_count: number;
  video_count: number;
  heart_count: number;
  profile_pic_url: string;
  evidence_hash: string;
  scraped_at: string;
  session_count: number;
  last_session: string;
}

const ForensicProfilesManager: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrapingUsername, setScrapingUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/profiles?limit=50');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setProfiles(result.data);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error('Erreur chargement profils:', error);
      setProfiles([]);
    }
  };

  const scrapeProfile = async (username: string) => {
    if (!username.trim()) return;
    
    setScrapingUsername(username);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/profiles/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '') })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadProfiles();
        setNewUsername('');
        alert(`✅ Profil @${username} analysé avec succès`);
      } else {
        alert(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'analyse du profil');
    } finally {
      setLoading(false);
      setScrapingUsername('');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          color: '#25F4EE',
          marginBottom: '10px'
        }}>
          👥 Profils LIVER - Analyse Forensique
        </h1>
        <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
          Gestion et analyse forensique des profils TikTok avec intégrité cryptographique
        </p>
      </div>

      {/* Interface d'ajout */}
      <div className="card" style={{ 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, rgba(255, 0, 80, 0.1), rgba(37, 244, 238, 0.1))'
      }}>
        <h3 style={{ color: '#25F4EE', marginBottom: '20px' }}>
          🔍 Analyser un nouveau profil
        </h3>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="@username ou username"
            disabled={loading}
            className="form-input"
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && scrapeProfile(newUsername)}
          />
          
          <button
            onClick={() => scrapeProfile(newUsername)}
            disabled={loading || !newUsername.trim()}
            className="btn btn-primary"
            style={{ 
              padding: '15px 25px',
              fontSize: '1.1rem',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '🔄 Analyse...' : '🚀 Analyser'}
          </button>
        </div>
        
        {scrapingUsername && (
          <div style={{ 
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(37, 244, 238, 0.1)',
            borderRadius: '8px',
            color: '#25F4EE'
          }}>
            🔄 Analyse en cours de @{scrapingUsername}... (peut prendre 1-2 minutes)
          </div>
        )}
      </div>

      {/* Profils prédéfinis */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#25F4EE', marginBottom: '20px' }}>
          ⚡ Profils Prédéfinis
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            'titilepirate3', 'titi.le.pirate', 'saadallahnordine', 
            'sedsky777', 'historia_med', 'titilepirate2'
          ].map(username => (
            <button
              key={username}
              onClick={() => scrapeProfile(username)}
              disabled={loading}
              className="btn btn-ghost"
              style={{ 
                opacity: loading && scrapingUsername === username ? 0.6 : 1,
                background: scrapingUsername === username ? 'rgba(37, 244, 238, 0.2)' : undefined
              }}
            >
              {scrapingUsername === username ? '🔄' : '📡'} @{username}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des profils */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ color: '#25F4EE' }}>
            📊 Profils Analysés ({(profiles || []).length})
          </h3>
          <button
            onClick={loadProfiles}
            className="btn btn-ghost"
            style={{ fontSize: '0.9rem' }}
          >
            🔄 Actualiser
          </button>
        </div>

        {(!profiles || profiles.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#B0B0B0' }}>
            <div style={{ fontSize: '4em', marginBottom: '20px' }}>👥</div>
            <p>Aucun profil analysé pour le moment</p>
            <p style={{ fontSize: '0.9rem' }}>Utilisez le formulaire ci-dessus pour analyser des profils</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {(profiles || []).map((profile) => (
              <div
                key={profile.id}
                style={{
                  background: '#1A1A1A',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#25F4EE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Header du profil */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: profile.profile_pic_url 
                      ? `url(${profile.profile_pic_url})` 
                      : 'linear-gradient(135deg, #FF0050, #25F4EE)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {!profile.profile_pic_url && profile.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, color: '#fff' }}>@{profile.username}</h4>
                      {profile.verified && <span style={{ color: '#25F4EE' }}>✓</span>}
                    </div>
                    <p style={{ margin: '5px 0 0 0', color: '#B0B0B0', fontSize: '0.9rem' }}>
                      {profile.display_name}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p style={{ 
                    color: '#ddd', 
                    fontSize: '0.9rem', 
                    marginBottom: '20px',
                    lineHeight: '1.4',
                    maxHeight: '60px',
                    overflow: 'hidden'
                  }}>
                    {profile.bio}
                  </p>
                )}

                {/* Statistiques */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#25F4EE' }}>
                      {formatNumber(profile.follower_count)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B0B0B0' }}>Followers</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF0050' }}>
                      {formatNumber(profile.heart_count)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B0B0B0' }}>Likes</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                      {profile.video_count}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B0B0B0' }}>Vidéos</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                      {profile.session_count || 0}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B0B0B0' }}>Sessions</div>
                  </div>
                </div>

                {/* Métadonnées forensiques */}
                <div style={{ 
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '15px',
                  fontSize: '0.8rem',
                  color: '#B0B0B0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>🔒 Hash:</span>
                    <span style={{ fontFamily: 'monospace' }}>
                      {profile.evidence_hash?.substring(0, 12)}...
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>📅 Analysé:</span>
                    <span>{formatDate(profile.scraped_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  marginTop: '15px',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => scrapeProfile(profile.username)}
                    disabled={loading}
                    className="btn btn-ghost"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    🔄 Re-analyser
                  </button>
                  <button
                    onClick={() => window.open(`https://tiktok.com/@${profile.username}`, '_blank')}
                    className="btn btn-ghost"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    🔗 Voir profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForensicProfilesManager;