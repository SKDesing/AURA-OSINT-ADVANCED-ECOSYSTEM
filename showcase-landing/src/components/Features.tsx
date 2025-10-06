import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  Zap, 
  Search, 
  BarChart3, 
  Lock, 
  Globe,
  Database,
  Eye,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Analyse TikTok Live',
    description: 'Monitoring temps réel des métriques, viewers, messages et détection automatique de spam avec forensique complète.',
    color: 'var(--primary-600)'
  },
  {
    icon: Search,
    title: 'OSINT Avancé',
    description: 'Corrélation d\'identités cross-plateforme avec ML, scoring de confiance et 15+ outils d\'investigation.',
    color: 'var(--accent-teal)'
  },
  {
    icon: Shield,
    title: 'Forensique Sécurisé',
    description: 'Chain of custody, chiffrement automatique git-crypt, export légal et conformité RGPD native.',
    color: 'var(--success)'
  },
  {
    icon: Zap,
    title: 'Interface Zéro CLI',
    description: 'Dashboard web intuitif, wizard onboarding, mode débutant/pro et guidance contextuelle française.',
    color: 'var(--warning)'
  },
  {
    icon: Database,
    title: 'Architecture Fortress',
    description: 'Base de données forensique unifiée, ingestion batch ML et observabilité bout-en-bout.',
    color: 'var(--primary-700)'
  },
  {
    icon: Globe,
    title: 'Chromium Only',
    description: 'Enforcement automatique, 0 navigateur système, comportement prévisible et audit complet.',
    color: 'var(--accent-coral)'
  }
];

export const Features: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="features" ref={ref}>
      <div className="container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Fonctionnalités <span className="gradient-text">World-Class</span>
          </h2>
          <p className="section-description">
            Plateforme complète d'intelligence forensique avec des outils professionnels 
            pour l'investigation numérique et l'analyse OSINT avancée.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                <feature.icon size={32} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="features-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="cta-content">
            <Eye className="cta-icon" />
            <div>
              <h3>Prêt à transformer votre investigation ?</h3>
              <p>Découvrez la puissance d'AURA OSINT avec une démo personnalisée</p>
            </div>
          </div>
          <button className="btn-primary">
            Demander une Démo
          </button>
        </motion.div>
      </div>
    </section>
  );
};