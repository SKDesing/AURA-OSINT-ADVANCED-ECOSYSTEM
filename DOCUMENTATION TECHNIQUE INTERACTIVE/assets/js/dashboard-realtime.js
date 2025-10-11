/**
 * 📊 DASHBOARD TEMPS RÉEL - EXTENSION POUR MÉTRIQUES AVANCÉES
 * Intégration avec le système de métriques temps réel
 */

class AURADashboardRealtime {
  constructor() {
    this.phi = 1.618;
    this.charts = {};
    this.metricsUpdateInterval = null;
    
    this.initializeRealtimeCharts();
    this.startMetricsUpdates();
  }

  /**
   * 📈 Initialisation des graphiques temps réel
   */
  initializeRealtimeCharts() {
    console.log('📊 Initialisation graphiques temps réel dashboard...');
    
    // Attendre que Chart.js soit disponible
    if (typeof Chart === 'undefined') {
      setTimeout(() => this.initializeRealtimeCharts(), 500);
      return;
    }
    
    this.initInvestigationsChart();
    this.initThreatsChart();
    this.initGeographicChart();
    this.initSystemChart();
    
    // Enregistrer les graphiques avec le système de métriques
    if (window.AURAMetrics) {
      Object.entries(this.charts).forEach(([name, chart]) => {
        window.AURAMetrics.registerChart(name, chart);
      });
    }
  }

  /**
   * 🔍 Graphique investigations temps réel
   */
  initInvestigationsChart() {
    const ctx = document.getElementById('investigationsChart');
    if (!ctx) return;
    
    this.charts.investigations = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateTimeLabels(20),
        datasets: [{
          label: 'Investigations Actives',
          data: this.generateRealtimeData(20, 200, 300),
          borderColor: 'rgb(255, 215, 0)',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 4
        }, {
          label: 'Critiques',
          data: this.generateRealtimeData(20, 15, 35),
          borderColor: 'rgb(255, 69, 58)',
          backgroundColor: 'rgba(255, 69, 58, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 1,
          pointHoverRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              usePointStyle: true
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff',
              callback: function(value) {
                return value.toLocaleString();
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#ffffff',
              maxTicksLimit: 10
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  /**
   * ⚠️ Graphique niveau de menace (Gauge)
   */
  initThreatsChart() {
    const ctx = document.getElementById('threatsChart');
    if (!ctx) return;
    
    this.charts.threats = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Niveau Actuel', 'Capacité Restante'],
        datasets: [{
          data: [7.3, 2.7],
          backgroundColor: [
            'rgb(255, 165, 0)',
            'rgba(255, 255, 255, 0.1)'
          ],
          borderWidth: 0,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (context.dataIndex === 0) {
                  return `Niveau: ${context.parsed}/10`;
                }
                return null;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration: 2000
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: function(chart) {
          const ctx = chart.ctx;
          const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
          const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
          
          ctx.save();
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('7.3', centerX, centerY - 10);
          
          ctx.font = '12px Arial';
          ctx.fillStyle = '#ffa500';
          ctx.fillText('ÉLEVÉ', centerX, centerY + 15);
          ctx.restore();
        }
      }]
    });
  }

  /**
   * 🌍 Graphique géographique
   */
  initGeographicChart() {
    const ctx = document.getElementById('geographicChart');
    if (!ctx) return;
    
    this.charts.geographic = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['🇺🇸 États-Unis', '🇷🇺 Russie', '🇨🇳 Chine', '🇮🇷 Iran', '🇰🇵 Corée du Nord'],
        datasets: [{
          label: 'Investigations Actives',
          data: [89, 67, 54, 43, 32],
          backgroundColor: [
            'rgba(255, 69, 58, 0.8)',
            'rgba(255, 165, 0, 0.8)',
            'rgba(255, 215, 0, 0.8)',
            'rgba(0, 255, 127, 0.8)',
            'rgba(0, 122, 255, 0.8)'
          ],
          borderColor: [
            'rgb(255, 69, 58)',
            'rgb(255, 165, 0)',
            'rgb(255, 215, 0)',
            'rgb(0, 255, 127)',
            'rgb(0, 122, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label.split(' ').slice(1).join(' ');
              },
              label: function(context) {
                return `Investigations: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#ffffff',
              maxRotation: 45
            },
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutBounce'
        }
      }
    });
  }

  /**
   * ⚡ Graphique système
   */
  initSystemChart() {
    const ctx = document.getElementById('systemChart');
    if (!ctx) return;
    
    this.charts.system = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CPU', 'Mémoire', 'Disque'],
        datasets: [{
          label: 'Utilisation (%)',
          data: [23.7, 67.2, 45.8],
          backgroundColor: [
            'rgba(0, 255, 127, 0.8)',
            'rgba(255, 165, 0, 0.8)',
            'rgba(255, 215, 0, 0.8)'
          ],
          borderColor: [
            'rgb(0, 255, 127)',
            'rgb(255, 165, 0)',
            'rgb(255, 215, 0)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed.x.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#ffffff',
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  /**
   * 🔄 Démarrage des mises à jour métriques
   */
  startMetricsUpdates() {
    // Mise à jour toutes les 3 secondes (golden ratio)
    this.metricsUpdateInterval = setInterval(() => {
      this.updateDashboardMetrics();
    }, 3000 * this.phi);
  }

  /**
   * 📊 Mise à jour des métriques dashboard
   */
  updateDashboardMetrics() {
    // Mise à jour des cartes métriques
    this.updateMetricCards();
    
    // Mise à jour des graphiques
    this.updateCharts();
  }

  /**
   * 🎯 Mise à jour des cartes métriques
   */
  updateMetricCards() {
    // Investigations actives
    const invValue = document.querySelector('[data-metric="investigations"] .metric-value');
    if (invValue) {
      const newValue = this.randomInt(220, 280);
      this.animateCounter(invValue, parseInt(invValue.textContent) || 0, newValue, 1000);
    }

    // Profils analysés aujourd'hui
    const profilesValue = document.querySelector('[data-metric="profiles"] .metric-today');
    if (profilesValue) {
      const currentValue = parseInt(profilesValue.textContent.replace(/,/g, '')) || 0;
      const newValue = currentValue + this.randomInt(5, 25);
      this.animateCounter(profilesValue, currentValue, newValue, 1000);
    }

    // Sources OSINT actives
    const sourcesValue = document.querySelector('[data-metric="sources"] .metric-active');
    if (sourcesValue) {
      const newValue = this.randomInt(145, 165);
      this.animateCounter(sourcesValue, parseInt(sourcesValue.textContent) || 0, newValue, 1000);
    }

    // Niveau de menace
    const threatValue = document.querySelector('[data-metric="threat"] .metric-score');
    if (threatValue) {
      const currentValue = parseFloat(threatValue.textContent) || 0;
      const variation = (Math.random() - 0.5) * 0.4;
      const newValue = Math.max(1, Math.min(10, currentValue + variation));
      this.animateCounter(threatValue, currentValue, newValue, 1000, '', 1);
    }

    // Mise à jour des barres de progression système
    this.updateSystemBars();
  }

  /**
   * 📊 Mise à jour des barres système
   */
  updateSystemBars() {
    const cpuBar = document.querySelector('.cpu-progress');
    const memoryBar = document.querySelector('.memory-progress');
    
    if (cpuBar) {
      const newCpu = this.randomInt(15, 45);
      cpuBar.style.width = `${newCpu}%`;
      const cpuText = cpuBar.parentElement.querySelector('.progress-text');
      if (cpuText) cpuText.textContent = `${newCpu.toFixed(1)}%`;
    }
    
    if (memoryBar) {
      const newMemory = this.randomInt(55, 75);
      memoryBar.style.width = `${newMemory}%`;
      const memoryText = memoryBar.parentElement.querySelector('.progress-text');
      if (memoryText) memoryText.textContent = `${newMemory.toFixed(1)}%`;
    }
  }

  /**
   * 📈 Mise à jour des graphiques
   */
  updateCharts() {
    // Mise à jour graphique investigations
    if (this.charts.investigations) {
      const chart = this.charts.investigations;
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Ajouter nouveau point
      chart.data.labels.push(timeLabel);
      chart.data.datasets[0].data.push(this.randomInt(220, 280));
      chart.data.datasets[1].data.push(this.randomInt(18, 28));
      
      // Garder seulement les 20 derniers points
      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(dataset => dataset.data.shift());
      }
      
      chart.update('none');
    }

    // Mise à jour gauge menace
    if (this.charts.threats) {
      const chart = this.charts.threats;
      const currentLevel = chart.data.datasets[0].data[0];
      const variation = (Math.random() - 0.5) * 0.3;
      const newLevel = Math.max(1, Math.min(10, currentLevel + variation));
      
      chart.data.datasets[0].data = [newLevel, 10 - newLevel];
      chart.update('none');
    }

    // Mise à jour graphique géographique
    if (this.charts.geographic) {
      const chart = this.charts.geographic;
      chart.data.datasets[0].data = chart.data.datasets[0].data.map(value => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(10, Math.floor(value + variation));
      });
      chart.update('none');
    }

    // Mise à jour graphique système
    if (this.charts.system) {
      const chart = this.charts.system;
      chart.data.datasets[0].data = [
        this.randomInt(15, 45),
        this.randomInt(55, 75),
        this.randomInt(40, 60)
      ];
      chart.update('none');
    }
  }

  /**
   * 🎬 Animation de compteur
   */
  animateCounter(element, start, end, duration, suffix = '', decimals = 0) {
    const startTime = performance.now();
    const range = end - start;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (range * easeOutQuart);
      
      if (decimals > 0) {
        element.textContent = current.toFixed(decimals) + suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * 🕒 Génération labels temporels
   */
  generateTimeLabels(count) {
    const labels = [];
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      date.setMinutes(date.getMinutes() - i * 5);
      labels.push(date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }
    return labels;
  }

  /**
   * 📊 Génération données temps réel
   */
  generateRealtimeData(count, min, max) {
    const data = [];
    let current = min + (max - min) / 2;
    
    for (let i = 0; i < count; i++) {
      const variation = (Math.random() - 0.5) * (max - min) * 0.1;
      current = Math.max(min, Math.min(max, current + variation));
      data.push(Math.floor(current));
    }
    
    return data;
  }

  /**
   * 🎲 Utilitaire nombre aléatoire
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 🧹 Nettoyage
   */
  destroy() {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
    }
    
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que le dashboard soit actif
  const initRealtime = () => {
    const analyticsView = document.getElementById('view-analytics');
    if (analyticsView && window.Chart) {
      if (!window.AURADashboardRealtimeInstance) {
        window.AURADashboardRealtimeInstance = new AURADashboardRealtime();
        console.log('📊 Dashboard temps réel initialisé');
      }
    } else {
      setTimeout(initRealtime, 1000);
    }
  };
  
  setTimeout(initRealtime, 2000);
});

// Exposer globalement
window.AURADashboardRealtime = AURADashboardRealtime;