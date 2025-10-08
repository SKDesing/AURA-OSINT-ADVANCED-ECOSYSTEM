# 🚨 SPRINT 0 D'URGENCE - 48H CRITIQUES

## 🎯 OBJECTIF
Résoudre les 3 risques bloquants avant Sprint 1 officiel

## ⏰ TIMELINE: 48H MAX

### 🔥 **RISQUE #1: MEMORY LEAKS (4H)**

#### Actions immédiates:
```bash
# 1. Augmenter limite mémoire
npm run dev -- --max-old-space-size=8192

# 2. Installer outils diagnostic
npm install -g clinic clinic-doctor clinic-bubbleprof pm2

# 3. Lancer diagnostic
clinic doctor -- node server.js
```

#### Code à ajouter dans server.js:
```javascript
// Memory monitoring (début du fichier)
const memoryMonitor = setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  
  console.log(`📊 Memory: ${heapUsedMB}MB`);
  
  if (heapUsedMB > 1500) {
    console.error('🚨 MEMORY LEAK! Restarting...');
    process.exit(1);
  }
}, 30000);

process.on('SIGINT', () => {
  clearInterval(memoryMonitor);
  process.exit();
});
```

#### Validation:
- ✅ Aucune erreur "heap out of memory" après 24h
- ✅ Mémoire stable <1.5GB
- ✅ PM2 configuré avec auto-restart

---

### 🔥 **RISQUE #2: RATE LIMITING (6H)**

#### Proxy Manager:
```javascript
// config/proxy-manager.js
class ProxyManager {
  constructor() {
    this.proxyList = [
      'http://user:pass@proxy1.example.com:8080',
      'http://user:pass@proxy2.example.com:8080',
      // TODO: Ajouter 50+ proxies
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
    
    this.cooldowns[platform] = Date.now() + (platform === 'tiktok' ? 60000 : 30000);
    
    return proxy;
  }
}

module.exports = new ProxyManager();
```

#### Rate Limiter:
```javascript
// config/rate-limiter.js
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
    tracker.requests = tracker.requests.filter(ts => now - ts < limit.cooldown);

    if (tracker.requests.length >= limit.requestsPerMinute) {
      const oldest = tracker.requests[0];
      const timeToWait = limit.cooldown - (now - oldest);
      throw new Error(`Rate limit exceeded for ${platform}. Wait ${timeToWait}ms.`);
    }

    tracker.requests.push(now);
    return true;
  }
}

module.exports = new RateLimiter();
```

#### Validation:
- ✅ 1000 requêtes TikTok sans ban IP
- ✅ Rotation proxies visible dans logs
- ✅ Délais respectés entre requêtes

---

### 🔥 **RISQUE #3: DATABASE SCALING (8H)**

#### MongoDB Indexes:
```javascript
// scripts/create-indexes.js
const { MongoClient } = require('mongodb');

async function createCriticalIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('aura_osint');

  // Live sessions indexes
  await db.collection('live_sessions').createIndexes([
    { key: { platform: 1, timestamp: -1 } },
    { key: { user_id: 1, status: 1 } },
    { key: { timestamp: 1 }, expireAfterSeconds: 86400 }
  ]);

  // Comments indexes
  await db.collection('comments').createIndexes([
    { key: { session_id: 1, timestamp: -1 } },
    { key: { sentiment: 1 } },
    { key: { author_name: 1 } },
    { key: { platform: 1, timestamp: -1 } }
  ]);

  await client.close();
  console.log('✅ Indexes créés');
}

createCriticalIndexes().catch(console.error);
```

#### Sharding Setup:
```bash
# MongoDB sharding
mongosh --eval "sh.enableSharding('aura_osint')"
mongosh --eval "sh.shardCollection('aura_osint.live_sessions', {'platform': 1, 'timestamp': 1})"
mongosh --eval "sh.shardCollection('aura_osint.comments', {'session_id': 1, 'timestamp': 1})"
```

#### Validation:
- ✅ Requêtes <50ms
- ✅ CPU MongoDB <70%
- ✅ Sharding fonctionnel

---

## 📋 **CHECKLIST SPRINT 0**

### Jour 1 (24h):
- [ ] Memory monitoring implémenté
- [ ] PM2 configuré avec auto-restart
- [ ] Proxy manager créé
- [ ] Rate limiter implémenté
- [ ] Tests proxy rotation (100 requêtes)

### Jour 2 (24h):
- [ ] MongoDB indexes créés
- [ ] Sharding configuré
- [ ] Tests performance DB
- [ ] Cypress setup (3 tests critiques)
- [ ] npm audit fix --force
- [ ] Validation complète

---

## 🚨 **ACTIONS IMMÉDIATES (NEXT 2H)**

```bash
# 1. Memory fix
node --max-old-space-size=8192 server.js

# 2. Install tools
npm install -g clinic pm2

# 3. Security fix
npm audit fix --force

# 4. Start monitoring
pm2 start server.js --name "aura-osint" --max-memory-restart 1500M
```

---

## 🎯 **MÉTRIQUES DE SUCCÈS**

| Métrique | Avant | Objectif | Validation |
|----------|-------|----------|------------|
| Memory usage | >2GB | <1.5GB | ✅ |
| Request success rate | 60% | 95% | ✅ |
| DB query time | >200ms | <50ms | ✅ |
| Uptime | 80% | 99.9% | ✅ |

---

## 🚀 **APRÈS SPRINT 0**

Une fois validé:
1. **Sprint 1 officiel** démarre avec base stable
2. **Équipe confiante** - plus de crashes
3. **Architecture scalable** - prête pour 10k users
4. **Monitoring complet** - visibilité totale

**READY FOR PRODUCTION ! 🔥**