const { Queue, Worker } = require('bullmq');

class ReportQueueManager {
  constructor(redisConnection) {
    this.reportQueue = new Queue('report-generation', { connection: redisConnection });
    this.jobs = new Map(); // Stockage temporaire des statuts
    
    this.initWorker();
  }

  initWorker() {
    this.worker = new Worker('report-generation', async (job) => {
      const { reportId, type, data } = job.data;
      
      console.log(`📊 Génération rapport ${reportId} (${type})`);
      
      try {
        // Simulation génération PDF
        await this.generateReport(type, data);
        
        // Mise à jour du statut
        this.jobs.set(reportId, {
          status: 'completed',
          downloadUrl: `/reports/download/${reportId}`,
          completedAt: new Date().toISOString()
        });
        
        console.log(`✅ Rapport ${reportId} généré`);
        
      } catch (error) {
        console.error(`❌ Erreur génération rapport ${reportId}:`, error);
        
        this.jobs.set(reportId, {
          status: 'failed',
          error: error.message,
          failedAt: new Date().toISOString()
        });
      }
    }, { connection: redisConnection });
  }

  async addReportJob(reportId, type, data) {
    // Ajouter le job à la file
    await this.reportQueue.add('generate-report', {
      reportId,
      type,
      data
    });

    // Initialiser le statut
    this.jobs.set(reportId, {
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    console.log(`📋 Job rapport ${reportId} ajouté à la file`);
    
    return reportId;
  }

  getJobStatus(reportId) {
    return this.jobs.get(reportId) || { status: 'not_found' };
  }

  async generateReport(type, data) {
    // Simulation temps de génération
    const delay = Math.random() * 3000 + 2000; // 2-5 secondes
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Ici on intégrerait la vraie génération PDF
    switch (type) {
      case 'profile-analysis':
        return this.generateProfileReport(data);
      case 'live-summary':
        return this.generateLiveReport(data);
      case 'forensic-evidence':
        return this.generateForensicReport(data);
      default:
        throw new Error(`Type de rapport non supporté: ${type}`);
    }
  }

  generateProfileReport(data) {
    // Logique génération rapport profil
    console.log('📊 Génération rapport profil');
  }

  generateLiveReport(data) {
    // Logique génération rapport live
    console.log('🎥 Génération rapport live');
  }

  generateForensicReport(data) {
    // Logique génération rapport forensique
    console.log('🔍 Génération rapport forensique');
  }

  async getQueueStats() {
    const waiting = await this.reportQueue.getWaiting();
    const active = await this.reportQueue.getActive();
    const completed = await this.reportQueue.getCompleted();
    const failed = await this.reportQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length
    };
  }

  async close() {
    await this.worker.close();
    await this.reportQueue.close();
  }
}

module.exports = ReportQueueManager;