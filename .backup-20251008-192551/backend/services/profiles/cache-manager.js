class CacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.TTL = 3600; // 1 heure
  }

  // Pattern Cache-Aside pour les profils
  async getProfile(profileId) {
    const cacheKey = `profile:${profileId}`;
    
    try {
      // 1. Vérifier le cache
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        console.log(`📋 Cache HIT pour profil ${profileId}`);
        return JSON.parse(cached);
      }
      
      console.log(`💾 Cache MISS pour profil ${profileId}`);
      return null;
    } catch (error) {
      console.error('Erreur cache Redis:', error);
      return null;
    }
  }

  async setProfile(profileId, profileData) {
    const cacheKey = `profile:${profileId}`;
    
    try {
      await this.redis.setEx(cacheKey, this.TTL, JSON.stringify(profileData));
      console.log(`✅ Profil ${profileId} mis en cache`);
    } catch (error) {
      console.error('Erreur mise en cache:', error);
    }
  }

  async invalidateProfile(profileId) {
    const cacheKey = `profile:${profileId}`;
    
    try {
      await this.redis.del(cacheKey);
      console.log(`🗑️ Cache invalidé pour profil ${profileId}`);
    } catch (error) {
      console.error('Erreur invalidation cache:', error);
    }
  }

  // Cache pour les listes de profils
  async getProfilesList(filters = {}) {
    const cacheKey = `profiles:list:${JSON.stringify(filters)}`;
    
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Erreur cache liste:', error);
      return null;
    }
  }

  async setProfilesList(filters, profilesList) {
    const cacheKey = `profiles:list:${JSON.stringify(filters)}`;
    
    try {
      await this.redis.setEx(cacheKey, 300, JSON.stringify(profilesList)); // 5 min pour les listes
    } catch (error) {
      console.error('Erreur cache liste:', error);
    }
  }

  async invalidateAllProfiles() {
    try {
      const keys = await this.redis.keys('profile:*');
      const listKeys = await this.redis.keys('profiles:list:*');
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      if (listKeys.length > 0) {
        await this.redis.del(...listKeys);
      }
      
      console.log(`🗑️ ${keys.length + listKeys.length} clés de cache invalidées`);
    } catch (error) {
      console.error('Erreur invalidation globale:', error);
    }
  }
}

module.exports = CacheManager;