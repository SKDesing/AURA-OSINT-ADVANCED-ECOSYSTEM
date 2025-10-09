// Unified Harassment Engine Wrapper
const legacy = require('./engine-legacy');
const crypto = require('crypto');
const VERSION = 'heuristic-1.0.0';

function normalizeOutput(raw) {
  return {
    engine: 'harassment',
    engine_version: VERSION,
    is_match: raw.isHarassment,
    score: raw.confidence,
    severity: raw.severity,
    category: raw.category || 'normal',
    evidence: raw.keywords?.map(k => k.word) || [],
    confidence: raw.confidence,
    explanation: raw.explanation,
    meta: {
      processing_ms: raw.processingTime,
      latency_ms: raw.processingTime
    }
  };
}

async function analyze(text, context = {}) {
  const startTime = Date.now();
  
  try {
    const raw = await legacy.analyze(text, context);
    const result = normalizeOutput(raw);
    result.meta.latency_ms = Date.now() - startTime;
    return result;
  } catch (error) {
    return {
      engine: 'harassment',
      engine_version: VERSION,
      is_match: false,
      score: 0,
      severity: 0,
      category: 'error',
      evidence: [],
      confidence: 0,
      explanation: `Error: ${error.message}`,
      meta: {
        processing_ms: Date.now() - startTime,
        latency_ms: Date.now() - startTime,
        error: true
      }
    };
  }
}

module.exports = { analyze, VERSION };