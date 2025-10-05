import React, { useState } from 'react';

interface TikTokProfile {
  unique_id: string;
  user_id: number;
  nom_affiche?: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
  heart_count?: number;
  video_count?: number;
  type_compte: 'particulier' | 'professionnel' | 'agence';
}

interface RealIdentity {
  nom?: string;
  prenom?: string;
  nom_complet?: string;
  adresse_complete?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  niveau_confiance?: number;
}

interface Company {
  nom_legal: string;
  siret?: string;
  secteur_activite?: string;
  type_liaison: 'salarie' | 'fondateur' | 'partenaire' | 'auto-entrepreneur' | 'ambassadeur';
}

interface Agency {
  nom: string;
  site_web?: string;
  email_contact?: string;
}

interface FormData {
  tiktokProfile: TikTokProfile;
  realIdentity: RealIdentity;
  companies: Company[];
  agency: Agency;
  themes: string[];
}

const ProfileCreationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    tiktokProfile: { 
      unique_id: '', 
      user_id: 0, 
      type_compte: 'particulier' 
    },
    realIdentity: {},
    companies: [],
    agency: { nom: '' },
    themes: []
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleTikTokChange = (field: keyof TikTokProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      tiktokProfile: { ...prev.tiktokProfile, [field]: value }
    }));
  };

  const handleIdentityChange = (field: keyof RealIdentity, value: any) => {
    setFormData(prev => ({
      ...prev,
      realIdentity: { ...prev.realIdentity, [field]: value }
    }));
  };

  const handleCompanyChange = (index: number, field: keyof Company, value: any) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.map((company, i) => 
        i === index ? { ...company, [field]: value } : company
      )
    }));
  };

  const addCompany = () => {
    setFormData(prev => ({
      ...prev,
      companies: [...prev.companies, { nom_legal: '', type_liaison: 'salarie' }]
    }));
  };

  const removeCompany = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index)
    }));
  };

  const handleAgencyChange = (field: keyof Agency, value: any) => {
    setFormData(prev => ({
      ...prev,
      agency: { ...prev.agency, [field]: value }
    }));
  };

  const handleThemeChange = (themes: string[]) => {
    setFormData(prev => ({ ...prev, themes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Nettoyer les données vides
      const payload = {
        tiktokProfile: formData.tiktokProfile,
        realIdentity: Object.keys(formData.realIdentity).length ? formData.realIdentity : undefined,
        companies: formData.companies.length ? formData.companies : undefined,
        agency: formData.agency.nom ? formData.agency : undefined,
        themes: formData.themes.length ? formData.themes : undefined,
      };

      const response = await fetch('http://localhost:4000/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Profil créé avec succès !');
        // Réinitialiser le formulaire
        setStep(1);
        setFormData({
          tiktokProfile: { unique_id: '', user_id: 0, type_compte: 'particulier' },
          realIdentity: {},
          companies: [],
          agency: { nom: '' },
          themes: []
        });
      } else {
        setMessage(`❌ Erreur: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur de connexion: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="card" style={{ padding: '30px' }}>
      <h3 style={{ color: '#25F4EE', marginBottom: '25px' }}>
        📱 Informations du Profil TikTok
      </h3>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Username TikTok (@unique_id) *
          </label>
          <input
            type="text"
            value={formData.tiktokProfile.unique_id}
            onChange={(e) => handleTikTokChange('unique_id', e.target.value)}
            placeholder="titilepirate3"
            className="form-input"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            ID Numérique TikTok *
          </label>
          <input
            type="number"
            value={formData.tiktokProfile.user_id || ''}
            onChange={(e) => handleTikTokChange('user_id', parseInt(e.target.value) || 0)}
            placeholder="6812345678901234567"
            className="form-input"
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Nom d'affichage
          </label>
          <input
            type="text"
            value={formData.tiktokProfile.nom_affiche || ''}
            onChange={(e) => handleTikTokChange('nom_affiche', e.target.value)}
            placeholder="Titi Le Pirate 3"
            className="form-input"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Type de Compte *
          </label>
          <select
            value={formData.tiktokProfile.type_compte}
            onChange={(e) => handleTikTokChange('type_compte', e.target.value)}
            className="form-input"
          >
            <option value="particulier">Particulier</option>
            <option value="professionnel">Professionnel</option>
            <option value="agence">Agence</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Biographie
          </label>
          <textarea
            value={formData.tiktokProfile.bio || ''}
            onChange={(e) => handleTikTokChange('bio', e.target.value)}
            placeholder="Gaming content creator 🎯🔥"
            className="form-input"
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Followers
            </label>
            <input
              type="number"
              value={formData.tiktokProfile.follower_count || ''}
              onChange={(e) => handleTikTokChange('follower_count', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Following
            </label>
            <input
              type="number"
              value={formData.tiktokProfile.following_count || ''}
              onChange={(e) => handleTikTokChange('following_count', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card" style={{ padding: '30px' }}>
      <h3 style={{ color: '#25F4EE', marginBottom: '25px' }}>
        👤 Identité Réelle (Optionnel)
      </h3>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Nom
            </label>
            <input
              type="text"
              value={formData.realIdentity.nom || ''}
              onChange={(e) => handleIdentityChange('nom', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Prénom
            </label>
            <input
              type="text"
              value={formData.realIdentity.prenom || ''}
              onChange={(e) => handleIdentityChange('prenom', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Adresse complète
          </label>
          <textarea
            value={formData.realIdentity.adresse_complete || ''}
            onChange={(e) => handleIdentityChange('adresse_complete', e.target.value)}
            className="form-input"
            rows={2}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Ville
            </label>
            <input
              type="text"
              value={formData.realIdentity.ville || ''}
              onChange={(e) => handleIdentityChange('ville', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Téléphone
            </label>
            <input
              type="text"
              value={formData.realIdentity.telephone || ''}
              onChange={(e) => handleIdentityChange('telephone', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.realIdentity.email || ''}
            onChange={(e) => handleIdentityChange('email', e.target.value)}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card" style={{ padding: '30px' }}>
      <h3 style={{ color: '#25F4EE', marginBottom: '25px' }}>
        🏢 Liens Professionnels
      </h3>
      
      {/* Entreprises */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ color: '#fff' }}>Entreprises</h4>
          <button type="button" onClick={addCompany} className="btn btn-ghost">
            + Ajouter
          </button>
        </div>
        
        {formData.companies.map((company, index) => (
          <div key={index} style={{ 
            background: '#1A1A1A', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '15px' 
          }}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                  Nom légal *
                </label>
                <input
                  type="text"
                  value={company.nom_legal}
                  onChange={(e) => handleCompanyChange(index, 'nom_legal', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                    SIRET
                  </label>
                  <input
                    type="text"
                    value={company.siret || ''}
                    onChange={(e) => handleCompanyChange(index, 'siret', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                    Type de liaison *
                  </label>
                  <select
                    value={company.type_liaison}
                    onChange={(e) => handleCompanyChange(index, 'type_liaison', e.target.value)}
                    className="form-input"
                  >
                    <option value="salarie">Salarié</option>
                    <option value="fondateur">Fondateur</option>
                    <option value="partenaire">Partenaire</option>
                    <option value="auto-entrepreneur">Auto-entrepreneur</option>
                    <option value="ambassadeur">Ambassadeur</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => removeCompany(index)}
                className="btn"
                style={{ background: '#FF0050', alignSelf: 'flex-start' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agence */}
      <div>
        <h4 style={{ color: '#fff', marginBottom: '15px' }}>Agence</h4>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Nom de l'agence
            </label>
            <input
              type="text"
              value={formData.agency.nom}
              onChange={(e) => handleAgencyChange('nom', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                Site web
              </label>
              <input
                type="url"
                value={formData.agency.site_web || ''}
                onChange={(e) => handleAgencyChange('site_web', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                Email contact
              </label>
              <input
                type="email"
                value={formData.agency.email_contact || ''}
                onChange={(e) => handleAgencyChange('email_contact', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const availableThemes = [
      'Gaming', 'Géopolitique', 'Humanitaire', 'Commercial', 'Lifestyle',
      'Tech', 'Cuisine', 'Sport', 'Musique', 'Éducation'
    ];

    return (
      <div className="card" style={{ padding: '30px' }}>
        <h3 style={{ color: '#25F4EE', marginBottom: '25px' }}>
          🏷️ Thématiques
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {availableThemes.map(theme => (
            <label key={theme} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '10px',
              background: formData.themes.includes(theme) ? 'rgba(37, 244, 238, 0.2)' : '#1A1A1A',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.themes.includes(theme)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleThemeChange([...formData.themes, theme]);
                  } else {
                    handleThemeChange(formData.themes.filter(t => t !== theme));
                  }
                }}
              />
              <span style={{ color: '#fff' }}>{theme}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          color: '#25F4EE',
          marginBottom: '10px'
        }}>
          ➕ Création de Profil Forensique
        </h1>
        <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
          Assistant de création pour le système de cartographie d'influence sociale
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        gap: '20px'
      }}>
        {[1, 2, 3, 4].map(stepNum => (
          <div key={stepNum} style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: step >= stepNum ? 'linear-gradient(90deg, #FF0050, #25F4EE)' : '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {stepNum}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '30px' 
        }}>
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn btn-ghost">
              ← Précédent
            </button>
          )}
          
          <div style={{ marginLeft: 'auto' }}>
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Suivant →
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading || !formData.tiktokProfile.unique_id || !formData.tiktokProfile.user_id}
                className="btn btn-primary"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? '🔄 Création...' : '✅ Créer le Profil'}
              </button>
            )}
          </div>
        </div>
      </form>

      {message && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          background: message.includes('✅') ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          borderRadius: '8px',
          color: message.includes('✅') ? '#00ff00' : '#ff0000'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfileCreationWizard;