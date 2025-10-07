import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, FileText, Shield, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    icon: <Search />,
    title: 'Collecte OSINT',
    description: 'Extraction automatisée TikTok, Instagram, Twitter',
    features: ['Profils isolés', 'Chromium-only', 'Stealth mode']
  },
  {
    icon: <Brain />,
    title: 'Corrélation IA',
    description: 'Matching identités cross-plateforme avec ML',
    features: ['Score confiance', 'NLP avancé', 'Graph analysis']
  },
  {
    icon: <FileText />,
    title: 'Export Forensique',
    description: 'Rapports légalement recevables ISO/IEC 27037:2012',
    features: ['Chain of custody', 'Hash SHA-256', 'PDF certifié']
  },
  {
    icon: <Shield />,
    title: 'Compliance',
    description: 'Conformité RGPD et standards forensiques',
    features: ['Audit trail', 'Chiffrement', 'Rétention 90j']
  }
];

export const OSINTWorkflow: React.FC = () => {
  return (
    <section className="osint-workflow">
      <div className="workflow-container">
        <motion.div 
          className="workflow-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Workflow OSINT Professionnel</h2>
          <p>De la collecte à l'analyse forensique en 4 étapes automatisées</p>
        </motion.div>

        <div className="workflow-steps">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              className="workflow-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="step-icon">
                {step.icon}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="step-features">
                  {step.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="step-arrow" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};