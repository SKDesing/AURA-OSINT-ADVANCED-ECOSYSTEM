// AURA Artifact Builder - Pipeline prétraitement → HTML/CSS/JS
const crypto = require('crypto');
const { performance } = require('perf_hooks');

class ArtifactBuilder {
  constructor() {
    this.version = '1.0.0';
    this.piiPatterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(?:\+33|0)[1-9](?:[0-9]{8})/g,
      siren: /\b\d{3}\s?\d{3}\s?\d{3}\b/g,
      siret: /\b\d{3}\s?\d{3}\s?\d{3}\s?\d{5}\b/g
    };
  }

  // 1. Normalize HTML/text
  normalize(input, type = 'html') {
    const startTime = performance.now();
    
    let text = input;
    if (type === 'html') {
      // Remove scripts, styles, comments
      text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      text = text.replace(/<!--[\s\S]*?-->/g, '');
      
      // Extract headings for structure
      const headings = [];
      text.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
        headings.push({ level: parseInt(level), text: content.replace(/<[^>]*>/g, '') });
        return match;
      });
      
      // Strip HTML tags
      text = text.replace(/<[^>]*>/g, ' ');
    }
    
    // Decode HTML entities and normalize whitespace
    text = text.replace(/&[a-zA-Z0-9#]+;/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
    
    const normalizeTime = performance.now() - startTime;
    
    return {
      text_clean: text,
      sections: this.extractSections(text),
      headings: type === 'html' ? headings : [],
      normalize_ms: normalizeTime
    };
  }

  // 2. Mask PII
  maskPII(text) {
    const startTime = performance.now();
    const entities = [];
    let maskedText = text;
    
    Object.entries(this.piiPatterns).forEach(([type, pattern]) => {
      maskedText = maskedText.replace(pattern, (match) => {
        entities.push({ type, value: match, masked: `[${type.toUpperCase()}]` });
        return `[${type.toUpperCase()}]`;
      });
    });
    
    const maskTime = performance.now() - startTime;
    
    return {
      text_masked: maskedText,
      entities,
      mask_ms: maskTime
    };
  }

  // 3. Segment into chunks
  segment(text, chunkSize = 800, overlap = 100) {
    const startTime = performance.now();
    const words = text.split(/\s+/);
    const chunks = [];
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push({
          id: crypto.randomUUID(),
          text: chunk,
          start_word: i,
          word_count: Math.min(chunkSize, words.length - i)
        });
      }
    }
    
    const segmentTime = performance.now() - startTime;
    
    return {
      chunks,
      segment_ms: segmentTime
    };
  }

  // 4. Score and filter (simplified TF-IDF)
  scoreAndFilter(chunks) {
    const startTime = performance.now();
    
    chunks.forEach(chunk => {
      const sentences = chunk.text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const scores = sentences.map(sentence => ({
        text: sentence.trim(),
        score: this.calculateSentenceScore(sentence)
      }));
      
      chunk.top_sentences = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => s.text);
    });
    
    const scoreTime = performance.now() - startTime;
    return { chunks, score_ms: scoreTime };
  }

  // 5. Deduplicate using simple hash
  deduplicate(chunks) {
    const startTime = performance.now();
    const seen = new Set();
    const deduped = [];
    
    chunks.forEach(chunk => {
      const hash = crypto.createHash('md5').update(chunk.text).digest('hex').substring(0, 8);
      if (!seen.has(hash)) {
        seen.add(hash);
        chunk.simhash = hash;
        deduped.push(chunk);
      }
    });
    
    const dedupTime = performance.now() - startTime;
    const dropRate = (chunks.length - deduped.length) / chunks.length;
    
    return {
      chunks: deduped,
      drop_rate: dropRate,
      dedup_ms: dedupTime
    };
  }

  // 6. Extractive summarization
  summarizeExtractive(chunks) {
    const startTime = performance.now();
    
    chunks.forEach(chunk => {
      chunk.summary = chunk.top_sentences.slice(0, 2).join('. ') + '.';
    });
    
    const summaryTime = performance.now() - startTime;
    return { chunks, summary_ms: summaryTime };
  }

  // 7. Build HTML/CSS/JS artifact
  buildArtifact(data) {
    const startTime = performance.now();
    const { text_clean, sections, entities, chunks } = data;
    
    const sourceHash = crypto.createHash('sha256').update(text_clean).digest('hex').substring(0, 16);
    const contextHash = crypto.createHash('sha256').update(JSON.stringify(chunks)).digest('hex').substring(0, 16);
    
    const html = this.generateHTML(sections, chunks, entities, sourceHash);
    const css = this.generateCSS();
    const js = this.generateJS();
    
    const meta = {
      version: this.version,
      lang: this.detectLanguage(text_clean),
      source_hash: sourceHash,
      context_hash: contextHash,
      entities: entities.length,
      chunks: chunks.length,
      build_ms: performance.now() - startTime,
      created_at: new Date().toISOString()
    };
    
    return { html, css, js, meta };
  }

  // Helper methods
  extractSections(text) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
    return paragraphs.map((p, i) => ({
      id: `section-${i}`,
      text: p.trim()
    }));
  }

  calculateSentenceScore(sentence) {
    // Simple scoring: length + keyword density
    const words = sentence.split(/\s+/);
    const lengthScore = Math.min(words.length / 20, 1);
    const keywordScore = (sentence.match(/\b(important|critical|key|main|primary)\b/gi) || []).length * 0.2;
    return lengthScore + keywordScore;
  }

  detectLanguage(text) {
    // Simple heuristic: French vs English
    const frWords = (text.match(/\b(le|la|les|de|du|des|et|ou|dans|sur|avec|pour|par)\b/gi) || []).length;
    const enWords = (text.match(/\b(the|and|or|in|on|with|for|by|from|to)\b/gi) || []).length;
    return frWords > enWords ? 'fr' : 'en';
  }

  generateHTML(sections, chunks, entities, sourceHash) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA Artifact - ${sourceHash}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="artifact-header">
        <h1>📊 AURA Intelligence Artifact</h1>
        <div class="meta">
            <span class="hash">Hash: ${sourceHash}</span>
            <span class="entities">${entities.length} entités</span>
            <span class="chunks">${chunks.length} segments</span>
        </div>
    </header>
    
    <nav class="artifact-nav">
        ${chunks.map((chunk, i) => `<a href="#chunk-${i}">Segment ${i + 1}</a>`).join('')}
    </nav>
    
    <main class="artifact-content">
        ${chunks.map((chunk, i) => `
        <section id="chunk-${i}" class="chunk-card">
            <header class="chunk-header">
                <h2>Segment ${i + 1}</h2>
                <button class="toggle-btn" onclick="toggleChunk(${i})">Détails</button>
            </header>
            <div class="chunk-summary">
                <p>${chunk.summary}</p>
            </div>
            <div class="chunk-full" id="full-${i}" style="display: none;">
                <p>${chunk.text}</p>
            </div>
        </section>
        `).join('')}
    </main>
    
    <script src="app.js"></script>
</body>
</html>`;
  }

  generateCSS() {
    return `/* AURA Artifact Styles */
:root {
  --color-bg: #0f0f23;
  --color-surface: #1a1a2e;
  --color-primary: #00d4aa;
  --color-text: #e5e5e5;
  --color-text-dim: #a0a0a0;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
}

* { box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  margin: 0;
  padding: var(--spacing-md);
  line-height: 1.6;
}

.artifact-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.artifact-header h1 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
}

.meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--color-text-dim);
}

.artifact-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
}

.artifact-nav a {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  color: var(--color-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.chunk-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.chunk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.chunk-header h2 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--color-primary);
}

.toggle-btn {
  background: var(--color-primary);
  color: var(--color-bg);
  border: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
}

.chunk-summary p, .chunk-full p {
  margin: 0;
  color: var(--color-text);
}`;
  }

  generateJS() {
    return `// AURA Artifact Interactions
function toggleChunk(index) {
  const fullDiv = document.getElementById('full-' + index);
  const btn = document.querySelector('#chunk-' + index + ' .toggle-btn');
  
  if (fullDiv.style.display === 'none') {
    fullDiv.style.display = 'block';
    btn.textContent = 'Masquer';
  } else {
    fullDiv.style.display = 'none';
    btn.textContent = 'Détails';
  }
}

// Search in page
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    const query = prompt('Rechercher dans la page:');
    if (query) {
      window.find(query);
    }
  }
});`;
  }

  // Main pipeline method
  async process(input, type = 'html') {
    const totalStart = performance.now();
    
    try {
      // Pipeline steps
      const normalized = this.normalize(input, type);
      const masked = this.maskPII(normalized.text_clean);
      const segmented = this.segment(masked.text_masked);
      const scored = this.scoreAndFilter(segmented.chunks);
      const deduped = this.deduplicate(scored.chunks);
      const summarized = this.summarizeExtractive(deduped.chunks);
      
      // Build artifact
      const artifact = this.buildArtifact({
        text_clean: normalized.text_clean,
        sections: normalized.sections,
        entities: masked.entities,
        chunks: summarized.chunks
      });
      
      // Add pipeline metrics
      artifact.meta.pipeline_ms = performance.now() - totalStart;
      artifact.meta.steps = {
        normalize: normalized.normalize_ms,
        mask: masked.mask_ms,
        segment: segmented.segment_ms,
        score: scored.score_ms,
        dedup: deduped.dedup_ms,
        summary: summarized.summary_ms
      };
      
      return artifact;
      
    } catch (error) {
      throw new Error(`Artifact build failed: ${error.message}`);
    }
  }
}

module.exports = ArtifactBuilder;