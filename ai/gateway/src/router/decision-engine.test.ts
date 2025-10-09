import { DecisionEngine } from './decision-engine';
import { FeatureExtractor } from './features';

describe('DecisionEngine', () => {
  let engine: DecisionEngine;
  let featureExtractor: FeatureExtractor;

  beforeEach(() => {
    engine = new DecisionEngine();
    featureExtractor = new FeatureExtractor();
  });

  afterEach(() => {
    engine.shutdown();
  });

  describe('decide', () => {
    it('should route entity-heavy text to NER', async () => {
      const text = 'Identifie Jean Dupont, Marie Martin et Pierre Durand dans ce texte.';
      const decision = await engine.decide(text);

      expect(decision.decision).toBe('ner');
      expect(decision.bypass).toBe(true);
      expect(decision.confidence).toBeGreaterThan(0.8);
      expect(decision.reason).toContain('entity');
    });

    it('should route forensic timeline to forensic module', async () => {
      const text = 'Analyse la timeline: 14h00 incident, 14h15 escalation, 14h30 résolution.';
      const decision = await engine.decide(text);

      expect(decision.decision).toBe('forensic');
      expect(decision.bypass).toBe(true);
      expect(decision.confidence).toBeGreaterThan(0.75);
    });

    it('should route high-risk content to harassment detection', async () => {
      const text = 'Tu es stupide et je vais te faire du mal, espèce d\'idiot.';
      const decision = await engine.decide(text);

      expect(decision.decision).toBe('harassment');
      expect(decision.bypass).toBe(true);
      expect(decision.confidence).toBeGreaterThan(0.8);
    });

    it('should route factual questions to RAG+LLM', async () => {
      const text = 'Selon nos données, quelle est la tendance des incidents de sécurité?';
      const decision = await engine.decide(text);

      expect(decision.decision).toBe('rag+llm');
      expect(decision.bypass).toBe(false);
      expect(decision.confidence).toBeGreaterThan(0.7);
    });

    it('should fallback to LLM for general queries', async () => {
      const text = 'Bonjour, comment allez-vous aujourd\'hui?';
      const decision = await engine.decide(text);

      expect(decision.decision).toBe('llm');
      expect(decision.bypass).toBe(false);
      expect(decision.confidence).toBe(0.50);
    });

    it('should include features hash in decision', async () => {
      const text = 'Test prompt for features hash';
      const decision = await engine.decide(text);

      expect(decision.features_hash).toBeDefined();
      expect(decision.features_hash).toHaveLength(16);
      expect(decision.features).toBeDefined();
    });

    it('should handle simulate mode', async () => {
      const text = 'Identifie les entités dans ce texte.';
      const decision = await engine.decide(text, undefined, true);

      expect(decision).toBeDefined();
      // In simulate mode, metrics should not be incremented
      // This would need proper mocking in a real test environment
    });
  });

  describe('getStats', () => {
    it('should return empty stats initially', () => {
      const stats = engine.getStats();
      
      expect(stats.totalDecisions).toBe(0);
      expect(stats.bypassRate).toBe(0);
      expect(stats.avgConfidence).toBe(0);
    });

    it('should calculate stats after decisions', async () => {
      await engine.decide('Test 1');
      await engine.decide('Test 2');
      
      const stats = engine.getStats();
      
      expect(stats.totalDecisions).toBe(2);
      expect(stats.bypassRate).toBeGreaterThanOrEqual(0);
      expect(stats.avgConfidence).toBeGreaterThan(0);
    });
  });
});

describe('FeatureExtractor', () => {
  let extractor: FeatureExtractor;

  beforeEach(() => {
    extractor = new FeatureExtractor();
  });

  describe('extract', () => {
    it('should extract basic features', () => {
      const text = 'Identifie Jean Dupont dans ce texte français.';
      const features = extractor.extract(text);

      expect(features.lang).toBe('fr');
      expect(features.ent_count).toBeGreaterThan(0);
      expect(features.length_bucket).toBe('short');
      expect(features.has_question).toBe(false);
    });

    it('should detect questions', () => {
      const text = 'Qui est Jean Dupont?';
      const features = extractor.extract(text);

      expect(features.has_question).toBe(true);
    });

    it('should count forensic terms', () => {
      const text = 'Analyse la timeline et les corrélations dans cette séquence.';
      const features = extractor.extract(text);

      expect(features.forensic_terms).toBeGreaterThan(0);
    });

    it('should detect timeline markers', () => {
      const text = 'Événements du 15/01/2025 à 14h30 et 16h45.';
      const features = extractor.extract(text);

      expect(features.timeline_markers).toBeGreaterThan(0);
    });

    it('should calculate risk score', () => {
      const highRiskText = 'Menace directe et attaque violente.';
      const lowRiskText = 'Bonjour, comment allez-vous?';

      const highRiskFeatures = extractor.extract(highRiskText);
      const lowRiskFeatures = extractor.extract(lowRiskText);

      expect(highRiskFeatures.risk_lexical).toBeGreaterThan(lowRiskFeatures.risk_lexical);
    });
  });

  describe('hashFeatures', () => {
    it('should generate consistent hash for same features', () => {
      const features = extractor.extract('Test text');
      const hash1 = extractor.hashFeatures(features);
      const hash2 = extractor.hashFeatures(features);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(16);
    });

    it('should generate different hash for different features', () => {
      const features1 = extractor.extract('Text one');
      const features2 = extractor.extract('Text two different');

      const hash1 = extractor.hashFeatures(features1);
      const hash2 = extractor.hashFeatures(features2);

      expect(hash1).not.toBe(hash2);
    });
  });
});