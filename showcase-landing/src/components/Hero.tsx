import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Shield className="icon" />
            <span>Plateforme Certifiée Forensique</span>
          </div>
          
          <h1 className="hero-title">
            AURA OSINT
            <span className="gradient-text">Intelligence Forensique</span>
            <span className="subtitle">World-Class</span>
          </h1>
          
          <p className="hero-description">
            Moteur d'intelligence forensique cross-plateforme pour l'analyse OSINT, 
            la corrélation d'identités et l'investigation numérique professionnelle.
            <strong> Interface zéro CLI, enforcement Chromium, chiffrement automatique.</strong>
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <Zap className="stat-icon" />
              <div>
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="stat">
              <Eye className="stat-icon" />
              <div>
                <div className="stat-number">15+</div>
                <div className="stat-label">Outils OSINT</div>
              </div>
            </div>
            <div className="stat">
              <Shield className="stat-icon" />
              <div>
                <div className="stat-number">256-bit</div>
                <div className="stat-label">Chiffrement</div>
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="btn-primary">
              Démarrer l'Investigation
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-secondary">
              Voir la Démo Live
            </button>
          </div>
          
          <div className="hero-trust">
            <p>Utilisé par les professionnels de la cybersécurité et de l'investigation</p>
            <div className="trust-badges">
              <span className="badge">🇫🇷 Made in France</span>
              <span className="badge">🔒 RGPD Compliant</span>
              <span className="badge">⚡ Open Source</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="dashboard-preview">
            <div className="dashboard-header">
              <div className="dashboard-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="dashboard-title">AURA OSINT Dashboard</div>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-sidebar">
                <div className="sidebar-item active">🎯 TikTok Live</div>
                <div className="sidebar-item">🔍 Dorks OSINT</div>
                <div className="sidebar-item">📊 Analytics</div>
                <div className="sidebar-item">📋 Reports</div>
              </div>
              <div className="dashboard-main">
                <div className="metric-card">
                  <div className="metric-title">Analyses Actives</div>
                  <div className="metric-value">127</div>
                  <div className="metric-trend">+12% ↗</div>
                </div>
                <div className="metric-card">
                  <div className="metric-title">Sessions TikTok</div>
                  <div className="metric-value">1,247</div>
                  <div className="metric-trend">Live</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};