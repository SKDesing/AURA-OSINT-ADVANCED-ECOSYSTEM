import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Swal from 'sweetalert2';
import { mockMetrics, generateLiveData } from '../data/mockData';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AuraStats = () => {
  const [liveData, setLiveData] = useState(generateLiveData());
  const [selectedMetric, setSelectedMetric] = useState('investigations');

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(generateLiveData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Configuration des graphiques avec thème AURA
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFD700',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        color: '#FFD700',
        font: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#B8C1EC' },
        grid: { color: 'rgba(255, 215, 0, 0.1)' }
      },
      x: {
        ticks: { color: '#B8C1EC' },
        grid: { color: 'rgba(255, 215, 0, 0.1)' }
      }
    }
  };

  // Données pour graphique des investigations
  const investigationsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Investigations',
        data: [65, 89, 123, 156, 178, 134, 167],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'Succès',
        data: [62, 85, 118, 149, 171, 128, 159],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Données pour graphique des outils
  const toolsUsageData = {
    labels: ['Sherlock', 'Holehe', 'WHOIS', 'Nmap', 'PhoneInfoga'],
    datasets: [
      {
        label: 'Utilisations',
        data: [2134, 1247, 3421, 1876, 756],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 140, 0, 0.8)',
          'rgba(67, 97, 238, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          '#FFD700',
          '#FF8C00',
          '#4361EE',
          '#10B981',
          '#EF4444'
        ],
        borderWidth: 2
      }
    ]
  };

  // Données pour graphique de performance système
  const systemPerformanceData = {
    labels: ['CPU', 'Mémoire', 'Réseau', 'Stockage'],
    datasets: [
      {
        data: [
          liveData.system_load.cpu,
          liveData.system_load.memory,
          liveData.system_load.network,
          Math.floor(Math.random() * 30) + 10
        ],
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 140, 0, 0.8)',
          'rgba(67, 97, 238, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          '#FFD700',
          '#FF8C00',
          '#4361EE',
          '#10B981'
        ],
        borderWidth: 2
      }
    ]
  };

  const showDetailedStats = async () => {
    const result = await Swal.fire({
      title: '📊 Statistiques Détaillées AURA OSINT',
      html: `
        <div style="text-align: left; color: #333;">
          <h4>🎯 Performance Globale</h4>
          <p><strong>Uptime:</strong> ${mockMetrics.performance.uptime.toFixed(2)}%</p>
          <p><strong>Temps de réponse:</strong> ${mockMetrics.performance.response_time.toFixed(1)}s</p>
          <p><strong>Investigations actives:</strong> ${liveData.active_investigations}</p>
          
          <h4>🤖 IA Qwen Engine</h4>
          <p><strong>Statut:</strong> ${mockMetrics.ai_engine.qwen_status}</p>
          <p><strong>Précision:</strong> ${mockMetrics.ai_engine.model_accuracy.toFixed(1)}%</p>
          <p><strong>Requêtes traitées:</strong> ${mockMetrics.ai_engine.queries_processed.toLocaleString()}</p>
          
          <h4>📈 Tendances</h4>
          <p><strong>Croissance mensuelle:</strong> +${mockMetrics.monthly.growth_rate}%</p>
          <p><strong>Nouveaux utilisateurs:</strong> ${mockMetrics.monthly.new_users}</p>
          <p><strong>Outil le plus utilisé:</strong> ${mockMetrics.weekly.most_used_tool}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#FFD700',
      background: '#1a1f3a',
      color: '#ffffff',
      width: 600
    });
  };

  const exportStats = async () => {
    const { value: format } = await Swal.fire({
      title: '📤 Exporter les Statistiques',
      input: 'select',
      inputOptions: {
        'json': 'Format JSON',
        'csv': 'Format CSV',
        'pdf': 'Format PDF'
      },
      inputPlaceholder: 'Choisir le format',
      showCancelButton: true,
      confirmButtonText: 'Exporter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#FFD700',
      background: '#1a1f3a',
      color: '#ffffff'
    });

    if (format) {
      Swal.fire({
        title: '✅ Export Réussi!',
        text: `Statistiques exportées en format ${format.toUpperCase()}`,
        icon: 'success',
        confirmButtonColor: '#FFD700',
        background: '#1a1f3a',
        color: '#ffffff'
      });
    }
  };

  return (
    <div className="aura-stats">
      <div className="stats-header">
        <h2>📊 Statistiques Temps Réel AURA OSINT</h2>
        <div className="stats-actions">
          <button onClick={showDetailedStats} className="stats-btn">
            📋 Détails
          </button>
          <button onClick={exportStats} className="stats-btn">
            📤 Exporter
          </button>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="live-metrics">
        <div className="metric-card live">
          <div className="metric-icon">🔄</div>
          <div className="metric-info">
            <h3>Investigations Actives</h3>
            <div className="metric-value">{liveData.active_investigations}</div>
            <div className="metric-trend">En temps réel</div>
          </div>
        </div>

        <div className="metric-card live">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <h3>Charge CPU</h3>
            <div className="metric-value">{liveData.system_load.cpu}%</div>
            <div className="metric-trend">Système</div>
          </div>
        </div>

        <div className="metric-card live">
          <div className="metric-icon">🧠</div>
          <div className="metric-info">
            <h3>Mémoire</h3>
            <div className="metric-value">{liveData.system_load.memory}%</div>
            <div className="metric-trend">Utilisée</div>
          </div>
        </div>

        <div className="metric-card live">
          <div className="metric-icon">🌐</div>
          <div className="metric-info">
            <h3>Réseau</h3>
            <div className="metric-value">{liveData.system_load.network} MB/s</div>
            <div className="metric-trend">Débit</div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>📈 Investigations par Jour</h3>
          <Line data={investigationsData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: { ...chartOptions.plugins.title, text: 'Évolution des Investigations' }
            }
          }} />
        </div>

        <div className="chart-container">
          <h3>🛠️ Utilisation des Outils OSINT</h3>
          <Bar data={toolsUsageData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: { ...chartOptions.plugins.title, text: 'Top 5 Outils les Plus Utilisés' }
            }
          }} />
        </div>

        <div className="chart-container">
          <h3>⚙️ Performance Système</h3>
          <Doughnut data={systemPerformanceData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: { ...chartOptions.plugins.title, text: 'Utilisation des Ressources' }
            }
          }} />
        </div>
      </div>

      {/* Alertes système */}
      <div className="system-alerts">
        <h3>🚨 Alertes Système</h3>
        <div className="alerts-list">
          <div className="alert success">
            <span className="alert-icon">✅</span>
            <span className="alert-message">Tous les services OSINT opérationnels</span>
            <span className="alert-time">Il y a 2 min</span>
          </div>
          <div className="alert warning">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">Charge CPU élevée détectée sur Sherlock</span>
            <span className="alert-time">Il y a 15 min</span>
          </div>
          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <span className="alert-message">Mise à jour IA Qwen disponible</span>
            <span className="alert-time">Il y a 1h</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .aura-stats {
          padding: 2rem;
          background: linear-gradient(135deg, #0a0e27, #1a1f3a);
          color: #ffffff;
          min-height: 100vh;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 215, 0, 0.3);
        }

        .stats-header h2 {
          color: #FFD700;
          margin: 0;
        }

        .stats-actions {
          display: flex;
          gap: 1rem;
        }

        .stats-btn {
          background: linear-gradient(45deg, #FFD700, #FF8C00);
          color: #0a0e27;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }

        .stats-btn:hover {
          transform: translateY(-2px);
        }

        .live-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s;
        }

        .metric-card.live {
          animation: pulse 2s infinite;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        .metric-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FFD700, #FF8C00);
          border-radius: 50%;
        }

        .metric-info h3 {
          margin: 0 0 0.5rem 0;
          color: #B8C1EC;
          font-size: 0.9rem;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #FFD700;
          font-family: 'JetBrains Mono', monospace;
        }

        .metric-trend {
          font-size: 0.8rem;
          color: #8892B0;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .chart-container h3 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .system-alerts {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .system-alerts h3 {
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 4px solid;
        }

        .alert.success {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10B981;
        }

        .alert.warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: #F59E0B;
        }

        .alert.info {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
        }

        .alert-message {
          flex: 1;
        }

        .alert-time {
          font-size: 0.8rem;
          color: #8892B0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .aura-stats {
            padding: 1rem;
          }

          .stats-header {
            flex-direction: column;
            gap: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AuraStats;