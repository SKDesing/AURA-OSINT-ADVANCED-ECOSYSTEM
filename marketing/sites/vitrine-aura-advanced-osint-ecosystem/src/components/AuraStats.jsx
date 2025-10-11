import React, { useState, useEffect } from 'react';
import './AuraStats.css';

const AuraStats = () => {
  const [stats, setStats] = useState({
    totalInvestigations: 0,
    activeTools: 0,
    successRate: 0,
    avgResponseTime: 0
  });

  const [realTimeData, setRealTimeData] = useState([]);

  // Données factices basées sur les métriques AURA
  const mockMetrics = {
    investigations: {
      total: 15847,
      today: 234,
      thisWeek: 1653,
      thisMonth: 6789
    },
    tools: {
      email: 8,
      phone: 5,
      social: 12,
      network: 15,
      darknet: 6,
      breach: 4
    },
    performance: {
      successRate: 98.7,
      avgResponseTime: 2.3,
      uptime: 99.9,
      accuracy: 96.4
    },
    realTimeActivity: [
      { time: '14:30:15', action: 'Email investigation completed', target: 'user@example.com', status: 'success' },
      { time: '14:29:42', action: 'Phone lookup started', target: '+33612345678', status: 'running' },
      { time: '14:28:33', action: 'Social media scan finished', target: '@username123', status: 'success' },
      { time: '14:27:18', action: 'Domain WHOIS completed', target: 'suspicious-site.com', status: 'success' },
      { time: '14:26:05', action: 'Breach check initiated', target: 'test@company.com', status: 'running' }
    ]
  };

  useEffect(() => {
    // Animation des statistiques
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setStats({
          totalInvestigations: Math.floor(mockMetrics.investigations.total * easeOut),
          activeTools: Math.floor(Object.values(mockMetrics.tools).reduce((a, b) => a + b, 0) * easeOut),
          successRate: Math.floor(mockMetrics.performance.successRate * easeOut * 10) / 10,
          avgResponseTime: Math.floor(mockMetrics.performance.avgResponseTime * easeOut * 10) / 10
        });

        currentStep++;
        if (currentStep > steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };

    animateStats();
    setRealTimeData(mockMetrics.realTimeActivity);

    // Simulation de nouvelles activités
    const activityInterval = setInterval(() => {
      const newActivity = {
        time: new Date().toLocaleTimeString(),
        action: 'New investigation started',
        target: `target-${Math.random().toString(36).substr(2, 9)}`,
        status: Math.random() > 0.5 ? 'success' : 'running'
      };

      setRealTimeData(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(activityInterval);
  }, []);

  return (
    <div className="aura-stats">
      <div className="stats-header">
        <h2>📊 AURA OSINT - Statistiques en Temps Réel</h2>
        <div className="live-indicator">
          <span className="pulse"></span>
          LIVE
        </div>
      </div>

      {/* Métriques principales */}
      <div className="main-metrics">
        <div className="metric-card investigations">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <div className="metric-number">{stats.totalInvestigations.toLocaleString()}</div>
            <div className="metric-label">Investigations Totales</div>
            <div className="metric-change">+{mockMetrics.investigations.today} aujourd'hui</div>
          </div>
        </div>

        <div className="metric-card tools">
          <div className="metric-icon">🛠️</div>
          <div className="metric-content">
            <div className="metric-number">{stats.activeTools}</div>
            <div className="metric-label">Outils Actifs</div>
            <div className="metric-change">100% opérationnels</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-number">{stats.successRate}%</div>
            <div className="metric-label">Taux de Succès</div>
            <div className="metric-change">+0.3% ce mois</div>
          </div>
        </div>

        <div className="metric-card performance">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-number">{stats.avgResponseTime}s</div>
            <div className="metric-label">Temps Moyen</div>
            <div className="metric-change">-0.5s optimisé</div>
          </div>
        </div>
      </div>

      {/* Répartition des outils */}
      <div className="tools-breakdown">
        <h3>🔧 Répartition des Outils par Catégorie</h3>
        <div className="tools-grid">
          {Object.entries(mockMetrics.tools).map(([category, count]) => (
            <div key={category} className="tool-category-stat">
              <div className="category-name">{category.toUpperCase()}</div>
              <div className="category-count">{count}</div>
              <div className="category-bar">
                <div 
                  className="category-fill" 
                  style={{width: `${(count / 15) * 100}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activité en temps réel */}
      <div className="real-time-activity">
        <h3>🔴 Activité en Temps Réel</h3>
        <div className="activity-feed">
          {realTimeData.map((activity, index) => (
            <div key={index} className={`activity-item ${activity.status}`}>
              <div className="activity-time">{activity.time}</div>
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-target">{activity.target}</div>
              </div>
              <div className={`activity-status ${activity.status}`}>
                {activity.status === 'success' ? '✅' : '🔄'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique de performance */}
      <div className="performance-chart">
        <h3>📈 Performance des 7 Derniers Jours</h3>
        <div className="chart-container">
          <div className="chart-bars">
            {[85, 92, 88, 95, 91, 97, 98].map((value, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill" 
                  style={{height: `${value}%`}}
                ></div>
                <div className="bar-label">J-{6-index}</div>
                <div className="bar-value">{value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques système */}
      <div className="system-metrics">
        <h3>⚙️ Métriques Système</h3>
        <div className="system-grid">
          <div className="system-metric">
            <span className="system-label">Uptime</span>
            <span className="system-value">{mockMetrics.performance.uptime}%</span>
          </div>
          <div className="system-metric">
            <span className="system-label">Précision</span>
            <span className="system-value">{mockMetrics.performance.accuracy}%</span>
          </div>
          <div className="system-metric">
            <span className="system-label">Requêtes/min</span>
            <span className="system-value">847</span>
          </div>
          <div className="system-metric">
            <span className="system-label">Latence</span>
            <span className="system-value">12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuraStats;