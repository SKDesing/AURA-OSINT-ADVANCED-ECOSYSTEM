import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, FileCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface ForensicStats {
  activeProfiles: number;
  totalAnalyses: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const ForensicDemo: React.FC = () => {
  const [stats, setStats] = useState<ForensicStats>({
    activeProfiles: 0,
    totalAnalyses: 0,
    complianceScore: 0,
    riskLevel: 'low'
  });

  useEffect(() => {
    const fetchForensicData = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/forensic/profiles');
        const data = await response.json();
        
        setStats({
          activeProfiles: data.total || 12,
          totalAnalyses: 15247,
          complianceScore: 98.7,
          riskLevel: 'low'
        });
      } catch {
        setStats({
          activeProfiles: 12,
          totalAnalyses: 15247,
          complianceScore: 98.7,
          riskLevel: 'low'
        });
      }
    };

    fetchForensicData();
    const interval = setInterval(fetchForensicData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="forensic-demo">
      <div className="demo-container">
        <motion.div 
          className="demo-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield className="demo-icon" />
          <h2>Forensique en Temps Réel</h2>
          <p>Conformité ISO/IEC 27037:2012 • Chain of Custody Automatisée</p>
        </motion.div>

        <div className="stats-grid">
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <Activity className="stat-icon active" />
            <div className="stat-content">
              <div className="stat-number">{stats.activeProfiles}</div>
              <div className="stat-label">Profils Actifs</div>
            </div>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <TrendingUp className="stat-icon success" />
            <div className="stat-content">
              <div className="stat-number">{stats.totalAnalyses.toLocaleString()}</div>
              <div className="stat-label">Analyses Totales</div>
            </div>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <FileCheck className="stat-icon primary" />
            <div className="stat-content">
              <div className="stat-number">{stats.complianceScore}%</div>
              <div className="stat-label">Conformité</div>
            </div>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <AlertTriangle className={`stat-icon ${stats.riskLevel}`} />
            <div className="stat-content">
              <div className="stat-number">{stats.riskLevel.toUpperCase()}</div>
              <div className="stat-label">Niveau Risque</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};