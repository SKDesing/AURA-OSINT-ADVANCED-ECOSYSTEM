const cacheService = require('../services/cache.service');

const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      // Générer clé de cache
      const cacheKey = keyGenerator 
        ? keyGenerator(req)
        : cacheService.generateKey('api', req.method, req.originalUrl, JSON.stringify(req.query));

      // Vérifier cache
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Intercepter la réponse pour la mettre en cache
      const originalJson = res.json;
      res.json = function(data) {
        // Mettre en cache seulement les réponses 200
        if (res.statusCode === 200) {
          cacheService.set(cacheKey, data, ttl);
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;