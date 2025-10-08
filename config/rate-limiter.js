const rateLimits = {
  tiktok: { requestsPerMinute: 30, cooldown: 60000 },
  facebook: { requestsPerMinute: 60, cooldown: 30000 },
  instagram: { requestsPerMinute: 40, cooldown: 45000 }
};

class RateLimiter {
  constructor() {
    this.trackers = {};
  }

  checkLimit(platform) {
    const now = Date.now();
    const limit = rateLimits[platform];

    if (!this.trackers[platform]) {
      this.trackers[platform] = { requests: [] };
    }

    const tracker = this.trackers[platform];
    
    // Nettoyer les anciennes requêtes
    tracker.requests = tracker.requests.filter(ts => now - ts < limit.cooldown);

    if (tracker.requests.length >= limit.requestsPerMinute) {
      const oldest = tracker.requests[0];
      const timeToWait = limit.cooldown - (now - oldest);
      throw new Error(`Rate limit exceeded for ${platform}. Wait ${timeToWait}ms.`);
    }

    tracker.requests.push(now);
    return true;
  }

  getStats() {
    const stats = {};
    for (const [platform, tracker] of Object.entries(this.trackers)) {
      stats[platform] = {
        currentRequests: tracker.requests.length,
        limit: rateLimits[platform].requestsPerMinute
      };
    }
    return stats;
  }
}

module.exports = new RateLimiter();
