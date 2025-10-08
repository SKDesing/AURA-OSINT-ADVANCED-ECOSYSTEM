import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBrain, FaShieldAlt, FaCode, FaUsers, FaChartLine } from 'react-icons/fa';
import EnhancedIcon from './icons/EnhancedIcon';

const Services = () => {
  const services = [
    {
      icon: <EnhancedIcon icon={FaSearch} color="#00ff88" size="48px" background pulse />,
      title: "OSINT Investigation",
      description: "Enquêtes OSINT complètes avec outils avancés",
      features: ["Multi-platform monitoring", "Real-time data collection", "Automated correlation"],
      price: "À partir de 500€/mois"
    },
    {
      icon: <EnhancedIcon icon={FaBrain} color="#00d4ff" size="48px" background rotate />,
      title: "Intelligence Forensique",
      description: "Analyse forensique avec IA et ML",
      features: ["Pattern recognition", "Behavioral analysis", "Threat detection"],
      price: "À partir de 2000€/mois"
    },
    {
      icon: <EnhancedIcon icon={FaCode} color="#ff00ff" size="48px" background />,
      title: "Développement Custom",
      description: "Solutions OSINT sur mesure",
      features: ["Custom integrations", "API development", "White-label solutions"],
      price: "Sur devis"
    },
    {
      icon: <EnhancedIcon icon={FaUsers} color="#ffff00" size="48px" background pulse />,
      title: "Consulting & Formation",
      description: "Expertise et formation OSINT",
      features: ["Professional training", "Best practices", "Compliance guidance"],
      price: "À partir de 1500€/jour"
    },
    {
      icon: <EnhancedIcon icon={FaShieldAlt} color="#ff4444" size="48px" background />,
      title: "Sécurité & Compliance",
      description: "Audit sécurité et conformité",
      features: ["Security audits", "GDPR compliance", "SOC2 certification"],
      price: "À partir de 3000€"
    },
    {
      icon: <EnhancedIcon icon={FaChartLine} color="#00ff88" size="48px" background pulse />,
      title: "Analytics & Reporting",
      description: "Tableaux de bord et rapports",
      features: ["Real-time dashboards", "Custom reports", "Data visualization"],
      price: "À partir de 800€/mois"
    }
  ];

  return (
    <section className="services">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>🎯 Nos Services</h2>
          <p>Solutions OSINT professionnelles pour tous vos besoins</p>
        </motion.div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <div className="service-price">{service.price}</div>
              <button className="btn-service">En savoir plus</button>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="services-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3>Besoin d'une solution personnalisée ?</h3>
          <p>Contactez-nous pour discuter de vos besoins spécifiques</p>
          <button className="btn-primary">Demander un devis</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;