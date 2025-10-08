// ============================================
// AURA OSINT Login Form Component
// Professional UI/UX with Security & Accessibility
// ============================================

import React, { useState } from 'react';
import './LoginForm.css';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpCode: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.requires2FA) {
        setRequire2FA(true);
        return;
      }

      if (response.ok) {
        window.location.href = result.redirectUrl || '/dashboard';
      } else {
        setErrors({ root: result.error || 'Erreur de connexion' });
      }
      
    } catch (error) {
      setErrors({ root: 'Erreur de connexion. Réessayez.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="login-container">
      {/* Panel gauche - Promo */}
      <aside className="promo-panel">
        <div className="promo-content">
          <div className="logo-container">
            <svg className="logo" viewBox="0 0 200 60" width="200" height="60">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A90E2" />
                  <stop offset="100%" stopColor="#00D9FF" />
                </linearGradient>
              </defs>
              <text x="10" y="35" fontSize="24" fontWeight="bold" fill="url(#logoGradient)">
                🛡️ AURA OSINT
              </text>
            </svg>
          </div>
          
          <h1 className="promo-title">
            Plateforme d'Investigation Numérique
          </h1>
          <p className="promo-subtitle">
            Tracking harcèlement en ligne • Analyse forensique • 
            Génération de preuves légales
          </p>
          
          <div className="promo-animation">
            <svg viewBox="0 0 400 300" className="illustration-svg">
              <defs>
                <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              
              <circle cx="200" cy="150" r="80" fill="url(#cyberGradient)" opacity="0.3" />
              <circle cx="200" cy="150" r="60" fill="none" stroke="#00D9FF" strokeWidth="2" opacity="0.6" />
              <circle cx="200" cy="150" r="40" fill="none" stroke="#4A90E2" strokeWidth="2" opacity="0.8" />
              
              <path d="M200 100 L180 120 L180 180 L200 200 L220 180 L220 120 Z" 
                    fill="#00D9FF" opacity="0.7" />
              <path d="M190 140 L195 145 L210 130" 
                    stroke="white" strokeWidth="3" fill="none" />
            </svg>
          </div>
          
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">12,847</span>
              <span className="stat-label">Incidents détectés</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98.7%</span>
              <span className="stat-label">Précision détection</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Panel droite - Formulaire */}
      <main className="form-panel">
        <div className="form-wrapper">
          <header className="form-header">
            <h2 className="form-title">Connexion</h2>
            <p className="form-subtitle">
              Accédez à votre espace d'investigation
            </p>
          </header>

          {errors.root && (
            <div className="error-banner" role="alert">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.root}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="username" className="label">
                <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="input"
                placeholder="investigator_01"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Mot de passe
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {require2FA && (
              <div className="form-group">
                <label htmlFor="totpCode" className="label">
                  <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  Code de vérification (2FA)
                </label>
                <input
                  id="totpCode"
                  name="totpCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="input"
                  placeholder="123456"
                  value={formData.totpCode}
                  onChange={handleInputChange}
                  autoComplete="one-time-code"
                />
              </div>
            )}

            <div className="form-options">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkbox-text">Se souvenir de moi (7 jours)</span>
              </label>
              
              <a href="/forgot-password" className="link-forgot">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-submit"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 3v2a5 5 0 000 10v2a7 7 0 000-14z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>ou continuer avec</span>
          </div>

          <div className="social-buttons">
            <button className="social-button google">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button className="social-button github">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <footer className="form-footer">
            <p>
              Pas encore de compte ?{' '}
              <a href="/register" className="link-register">
                Demander un accès
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}