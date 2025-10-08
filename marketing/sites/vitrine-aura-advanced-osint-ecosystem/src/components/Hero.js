import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaRocket, FaEye } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <FaShieldAlt className="badge-icon" />
            <span>Professional OSINT Platform</span>
          </div>
          
          <h1 className="hero-title">
            🛡️ AURA ADVANCED
            <span className="gradient-text">OSINT ECOSYSTEM</span>
          </h1>
          
          <p className="hero-subtitle">
            Plateforme d'intelligence OSINT de niveau enterprise pour professionnels
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <FaEye className="feature-icon" />
              <span>Monitoring Temps Réel</span>
            </div>
            <div className="feature-item">
              <FaRocket className="feature-icon" />
              <span>50k+ Messages/Stream</span>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <span>Intégrité Forensique</span>
            </div>
          </div>
          
          <div className="hero-buttons">
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('http://localhost:3000', '_blank')}
            >
              Accéder à l'Interface
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://github.com/SKDesing/TikTok-Live-Analyser', '_blank')}
            >
              Voir le Code Source
            </motion.button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Messages/Jour</span>
            </div>
            <div className="stat">
              <span className="stat-number">&lt;100ms</span>
              <span className="stat-label">Latence</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;