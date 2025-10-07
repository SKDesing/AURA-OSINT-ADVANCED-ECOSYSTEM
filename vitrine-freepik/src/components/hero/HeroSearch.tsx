import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Zap, Eye, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button.js';

interface HeroSearchProps {
  placeholder?: string;
  suggestions?: string[];
  onSearch?: (query: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  placeholder = "Rechercher un live TikTok, une fonctionnalité, un rapport...",
  suggestions = ["Analyse TikTok", "Forensic IA", "Export PDF", "Détection bots", "Corrélation identités"],
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Animation des suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  return (
    <section className="hero-search">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge Premium */}
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="badge-icon" />
            <span>Intelligence Forensique World-Class</span>
          </motion.div>

          {/* Titre Principal */}
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Découvrez la puissance d'
            <span className="gradient-text">AURA OSINT</span>
          </motion.h1>

          {/* Sous-titre avec animation */}
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Plateforme d'investigation numérique et d'analyse OSINT. 
            <br />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSuggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="suggestion-text"
              >
                Essayez: "{suggestions[currentSuggestion]}"
              </motion.span>
            </AnimatePresence>
          </motion.p>

          {/* Barre de recherche principale */}
          <motion.div 
            className={`search-container ${isSearchFocused ? 'focused' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                variant="primary" 
                className="search-button"
                onClick={handleSearch}
              >
                Analyser
                <ArrowRight className="button-icon" />
              </Button>
            </div>

            {/* Suggestions rapides */}
            <div className="quick-suggestions">
              <span className="suggestions-label">Populaire:</span>
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={suggestion}
                  className="suggestion-pill"
                  onClick={() => setQuery(suggestion)}
                >
                  <TrendingUp className="pill-icon" />
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats impressionnantes */}
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat-item">
              <Eye className="stat-icon" />
              <div className="stat-content">
                <div className="stat-number">15M+</div>
                <div className="stat-label">Analyses réalisées</div>
              </div>
            </div>
            <div className="stat-item">
              <Zap className="stat-icon" />
              <div className="stat-content">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime garanti</div>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp className="stat-icon" />
              <div className="stat-content">
                <div className="stat-number">500+</div>
                <div className="stat-label">Professionnels</div>
              </div>
            </div>
          </motion.div>

          {/* Actions secondaires */}
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button variant="outline" size="lg">
              Voir la démo live
            </Button>
            <Button variant="ghost" size="lg">
              Documentation
            </Button>
          </motion.div>
        </motion.div>

        {/* Visuel interactif */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mockup-title">AURA OSINT Dashboard</div>
            </div>
            <div className="mockup-content">
              <div className="mockup-search">
                <Search className="mockup-search-icon" />
                <div className="mockup-search-text">@username_live_analysis</div>
              </div>
              <div className="mockup-results">
                <div className="result-card active">
                  <div className="result-status"></div>
                  <div className="result-info">
                    <div className="result-title">Analyse TikTok Live</div>
                    <div className="result-meta">1,247 viewers • 89 msg/min</div>
                  </div>
                </div>
                <div className="result-card">
                  <div className="result-status"></div>
                  <div className="result-info">
                    <div className="result-title">Rapport Forensique</div>
                    <div className="result-meta">PDF • 127 pages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};