import fs from 'fs';
import path from 'path';

let cached: string | null = null;

export function getModelHash(): string {
  if (cached) return cached;
  
  try {
    const modelFile = process.env.AI_QWEN_MODEL_FILE || 'ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf';
    const hashFile = modelFile + '.sha256';
    
    if (fs.existsSync(hashFile)) {
      const content = fs.readFileSync(hashFile, 'utf8').trim();
      const hash = content.split(/\s+/)[0];
      cached = `sha256:${hash.substring(0, 16)}`;
      return cached;
    }
  } catch (error) {
    console.warn('[AI] Could not read model hash:', error.message);
  }
  
  cached = 'sha256:unknown';
  return cached;
}