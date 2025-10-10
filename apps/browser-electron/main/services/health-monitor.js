const axios = require('axios');

class HealthMonitor {
  constructor() {
    this.services = [
      { name: 'api', url: 'http://localhost:4011/health' },
      { name: 'live-tracker', url: 'http://localhost:4003/health' }
    ];
  }

  async checkServices() {
    const results = await Promise.allSettled(
      this.services.map(service => this.checkService(service))
    );

    return results.map((result, index) => ({
      name: this.services[index].name,
      status: result.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      error: result.status === 'rejected' ? result.reason.message : null,
      timestamp: new Date().toISOString()
    }));
  }

  async checkService(service) {
    try {
      const response = await axios.get(service.url, { 
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      return {
        name: service.name,
        status: 'healthy',
        responseTime: response.headers['x-response-time'] || 'unknown',
        data: response.data
      };
    } catch (error) {
      throw new Error(`${service.name}: ${error.message}`);
    }
  }

  async waitForAllServices(timeout = 30000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      const statuses = await this.checkServices();
      const allHealthy = statuses.every(s => s.status === 'healthy');
      
      if (allHealthy) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Not all services became healthy within timeout');
  }
}

module.exports = { HealthMonitor };