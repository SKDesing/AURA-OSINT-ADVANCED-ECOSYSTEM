module.exports = {
  analyze: async (message, options = {}) => {
    const lower = String(message || '').toLowerCase();
    const keywords = ['kill', 'haine', 'bombe', 'violence', 'menace', 'suicide', 'tuer', 'stupid'];
    const hits = keywords.filter(k => lower.includes(k));
    const score = Math.min(10, hits.length * 3);
    return {
      isHarassment: hits.length > 0,
      confidence: hits.length > 0 ? 0.9 : 0.1,
      categories: hits.length > 0 ? ['threats'] : [],
      severity: score,
      category: hits.length > 0 ? 'threats' : 'safe',
      explanation: hits.length ? 'Toxic keywords detected' : 'No harassment found',
      details: {
        language: options.language || 'fr',
        matched: hits
      }
    };
  }
};