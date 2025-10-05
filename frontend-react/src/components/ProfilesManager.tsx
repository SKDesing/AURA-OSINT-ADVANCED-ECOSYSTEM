import React, { useState, useEffect } from 'react';

interface LiverProfile {
  id: number;
  username: string;
  display_name: string;
  follower_count: number;
  following_count: number;
  video_count: number;
  bio: string;
  profile_pic_url: string;
  verified: boolean;
  live_status: 'online' | 'offline' | 'unknown';
  last_live_date: string;
  total_sessions_tracked: number;
  risk_level: 'low' | 'medium' | 'high';
  tags: string[];
  created_at: string;
  updated_at: string;
}

const ProfilesManager: React.FC = () => {
  const [profiles, setProfiles] = useState<LiverProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<LiverProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Profils prédéfinis à enrichir
  const predefinedProfiles = [
    'https://www.tiktok.com/@titilepirate3',
    'https://www.tiktok.com/@titi.le.pirate', 
    'https://www.tiktok.com/@saadallahnordine',
    'https://www.tiktok.com/@sedsky777'
  ];

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/profiles');
      const data = await response.json();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement profils:', error);
      setProfiles([]);
    }
  };

  const enrichProfile = async (tiktokUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/profiles/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tiktokUrl })
      });
      const result = await response.json();
      if (result.success) {
        loadProfiles();
        setNewProfileUrl('');
      } else {
        alert('Erreur enrichissement: ' + result.error);
      }
    } catch (error) {
      alert('Erreur enrichissement profil');
    }
    setLoading(false);
  };

  const enrichPredefinedProfiles = async () => {
    setLoading(true);
    for (const url of predefinedProfiles) {
      await enrichProfile(url);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Délai entre requêtes
    }
    setLoading(false);
  };

  const filteredProfiles = (profiles || []).filter(profile =>
    profile.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#666';
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>👥 Gestion des Profils LIVER</h2>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newProfileUrl}
            onChange={(e) => setNewProfileUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username"
            style={{
              flex: 1,
              minWidth: '300px',
              padding: '10px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '5px',
              color: 'white'
            }}
          />
          <button
            onClick={() => enrichProfile(newProfileUrl)}
            disabled={loading || !newProfileUrl}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ff88',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Enrichissement...' : '🔍 Enrichir Profil'}
          </button>
          <button
            onClick={enrichPredefinedProfiles}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            📋 Enrichir Profils Prédéfinis
          </button>
        </div>

        {/* Recherche */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Rechercher un profil..."
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#333',
            border: '1px solid #555',
            borderRadius: '8px',
            color: 'white',
            marginBottom: '20px'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Liste des profils */}
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '10px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>📋 Profils ({filteredProfiles.length})</h3>
          
          {filteredProfiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>👥</div>
              <p>Aucun profil trouvé</p>
              <p style={{ fontSize: '12px' }}>Enrichissez des profils TikTok pour commencer</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredProfiles.map((profile) => (
                <div 
                  key={profile.id} 
                  onClick={() => setSelectedProfile(profile)}
                  style={{ 
                    backgroundColor: selectedProfile?.id === profile.id ? '#1a4a3a' : '#333',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedProfile?.id === profile.id ? '2px solid #00ff88' : '1px solid #555',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={profile.profile_pic_url || '/default-avatar.png'} 
                      alt={profile.username}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        backgroundColor: '#555'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM1NTUiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDIwIDQgMTYuNjcgNCAxNEM0IDEzLjQ1IDQuNDUgMTMgNSAxM0gxOUMxOS41NSAxMyAyMCAxMy40NSAyMCAxNEMyMCAxNi42NyAxNC42NyAyMCAxMiAyMFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>@{profile.username}</span>
                        {profile.verified && <span style={{ color: '#00ccff' }}>✓</span>}
                        <div 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%',
                            backgroundColor: getRiskColor(profile.risk_level)
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        👥 {profile.follower_count?.toLocaleString() || 'N/A'} • 
                        📹 {profile.total_sessions_tracked} sessions
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px',
                      backgroundColor: profile.live_status === 'online' ? '#00ff88' : '#666',
                      borderRadius: '12px',
                      fontSize: '10px',
                      color: profile.live_status === 'online' ? 'black' : 'white'
                    }}>
                      {profile.live_status === 'online' ? '🔴 LIVE' : '⚫ OFFLINE'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails du profil sélectionné */}
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '10px'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>📊 Détails du Profil</h3>
          
          {selectedProfile ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <img 
                  src={selectedProfile.profile_pic_url || '/default-avatar.png'} 
                  alt={selectedProfile.username}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: '#555'
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, color: '#00ff88' }}>
                    @{selectedProfile.username}
                    {selectedProfile.verified && <span style={{ color: '#00ccff', marginLeft: '8px' }}>✓</span>}
                  </h4>
                  <p style={{ margin: '5px 0', color: '#ccc' }}>{selectedProfile.display_name}</p>
                  <div style={{ 
                    padding: '4px 12px',
                    backgroundColor: getRiskColor(selectedProfile.risk_level),
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'white',
                    display: 'inline-block'
                  }}>
                    🚨 Risque: {selectedProfile.risk_level.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ color: '#00ff88', marginBottom: '10px' }}>📈 Statistiques</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {selectedProfile.follower_count?.toLocaleString() || 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Abonnés</div>
                  </div>
                  <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {selectedProfile.video_count?.toLocaleString() || 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Vidéos</div>
                  </div>
                  <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {selectedProfile.total_sessions_tracked}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Sessions Trackées</div>
                  </div>
                  <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {selectedProfile.live_status === 'online' ? '🔴' : '⚫'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Statut Live</div>
                  </div>
                </div>
              </div>

              {selectedProfile.bio && (
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ color: '#00ff88', marginBottom: '10px' }}>📝 Biographie</h5>
                  <p style={{ 
                    backgroundColor: '#333', 
                    padding: '10px', 
                    borderRadius: '5px',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {selectedProfile.bio}
                  </p>
                </div>
              )}

              {selectedProfile.tags && selectedProfile.tags.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ color: '#00ff88', marginBottom: '10px' }}>🏷️ Tags</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedProfile.tags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{ 
                          backgroundColor: '#444', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#666' }}>
                <p>Créé: {new Date(selectedProfile.created_at).toLocaleString()}</p>
                <p>Mis à jour: {new Date(selectedProfile.updated_at).toLocaleString()}</p>
                {selectedProfile.last_live_date && (
                  <p>Dernier live: {new Date(selectedProfile.last_live_date).toLocaleString()}</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>👤</div>
              <p>Sélectionnez un profil pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilesManager;