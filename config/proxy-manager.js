const { HttpsProxyAgent } = require('https-proxy-agent');

class ProxyManager {
  constructor() {
    this.proxyList = [
      // TODO: Ajouter vos proxies ici
      'http://user:pass@proxy1.example.com:8080',
      'http://user:pass@proxy2.example.com:8080',
    ];
    this.currentIndex = 0;
    this.cooldowns = {};
  }

  getProxyForPlatform(platform) {
    if (this.cooldowns[platform] && this.cooldowns[platform] > Date.now()) {
      throw new Error(`Rate limit cooldown for ${platform}`);
    }

    const proxy = this.proxyList[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxyList.length;
    
    // Cooldown par plateforme
    const cooldownTime = platform === 'tiktok' ? 60000 : 30000;
    this.cooldowns[platform] = Date.now() + cooldownTime;
    
    return new HttpsProxyAgent(proxy);
  }

  getStats() {
    return {
      totalProxies: this.proxyList.length,
      currentIndex: this.currentIndex,
      cooldowns: this.cooldowns
    };
  }
}

module.exports = new ProxyManager();
