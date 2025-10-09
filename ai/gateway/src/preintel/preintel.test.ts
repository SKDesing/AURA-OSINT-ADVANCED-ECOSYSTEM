import { PreIntelPipeline } from './index';

describe('PreIntelPipeline', () => {
  let pipeline: PreIntelPipeline;

  beforeEach(() => {
    pipeline = new PreIntelPipeline();
  });

  afterEach(() => {
    pipeline.clearCache();
  });

  describe('run', () => {
    it('should process text and return metadata', async () => {
      const input = {
        text: 'This is a test prompt with some filler words like basically and actually.',
        options: { enablePruning: true, enableSimhash: true, enableCache: true }
      };

      const result = await pipeline.run(input);

      expect(result).toHaveProperty('processedText');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('hash');
      expect(result.metadata.originalTokens).toBeGreaterThan(0);
      expect(result.metadata.languageDetected).toBe('en');
    });

    it('should detect cache hits on repeated inputs', async () => {
      const input = {
        text: 'Repeated test prompt',
        options: { enableCache: true }
      };

      const result1 = await pipeline.run(input);
      const result2 = await pipeline.run(input);

      expect(result1.metadata.cacheHit).toBe(false);
      expect(result2.metadata.cacheHit).toBe(true);
    });

    it('should handle dry run mode', async () => {
      const input = {
        text: 'Test prompt for dry run',
        options: { enablePruning: true }
      };

      const result = await pipeline.run(input, true);

      expect(result.processedText).toBe(input.text); // No modifications in dry run
      expect(result.metadata.tokensSaved).toBe(0);
    });

    it('should apply pruning when enabled', async () => {
      const input = {
        text: 'This is basically a test with actually some filler words you know.',
        options: { enablePruning: true, maxPruningRatio: 0.5 }
      };

      const result = await pipeline.run(input);

      expect(result.metadata.pruningApplied).toBe(true);
      expect(result.metadata.tokensSaved).toBeGreaterThan(0);
      expect(result.processedText.length).toBeLessThan(input.text.length);
    });

    it('should detect language correctly', async () => {
      const englishInput = {
        text: 'This is an English text with common English words like the and for.',
      };

      const frenchInput = {
        text: 'Ceci est un texte français avec des mots comme le et pour.',
      };

      const englishResult = await pipeline.run(englishInput);
      const frenchResult = await pipeline.run(frenchInput);

      expect(englishResult.metadata.languageDetected).toBe('en');
      expect(frenchResult.metadata.languageDetected).toBe('fr');
    });
  });

  describe('cache management', () => {
    it('should clear cache', async () => {
      const input = { text: 'Test for cache clearing' };
      
      await pipeline.run(input);
      const statsBefore = pipeline.getCacheStats();
      
      pipeline.clearCache();
      const statsAfter = pipeline.getCacheStats();

      expect(statsBefore.size).toBeGreaterThan(0);
      expect(statsAfter.size).toBe(0);
    });

    it('should provide cache statistics', async () => {
      const stats = pipeline.getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('hitRate');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });
  });
});