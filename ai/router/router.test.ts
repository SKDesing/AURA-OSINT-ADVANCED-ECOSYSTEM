import { AlgorithmRouter } from './algorithm-router';

describe('AlgorithmRouter', () => {
  let router: AlgorithmRouter;

  beforeEach(() => {
    router = new AlgorithmRouter();
  });

  const testCases = [
    {
      prompt: 'Extraire les informations de Jean Dupont, email: jean@test.com, SIRET: 12345678901234',
      expected: 'ner',
      description: 'Entity extraction with multiple entities'
    },
    {
      prompt: 'Analyser la chronologie des événements et détecter les patterns temporels',
      expected: 'forensic',
      description: 'Forensic timeline analysis'
    },
    {
      prompt: 'Ce message est-il insultant ou haineux?',
      expected: 'nlp',
      description: 'NLP classification for toxicity'
    },
    {
      prompt: 'Que dit le document sur les procédures OSINT?',
      expected: 'rag+llm',
      description: 'RAG retrieval query'
    },
    {
      prompt: 'Explique-moi les principes de la cryptographie moderne',
      expected: 'llm',
      description: 'General knowledge query'
    }
  ];

  testCases.forEach(({ prompt, expected, description }) => {
    it(`should route to ${expected} for ${description}`, () => {
      const decision = router.decide(prompt, 0.3, 'fr');
      expect(decision.matched_algorithm).toBe(expected);
      expect(decision.router_version).toBe('1.0.0');
      expect(decision.confidence).toBeGreaterThan(0);
      expect(decision.preintel_signature).toBeDefined();
    });
  });

  it('should detect harassment with high lexical score', () => {
    const decision = router.decide('Ce message est insultant et haineux', 0.7, 'fr');
    expect(decision.matched_algorithm).toBe('harassment');
    expect(decision.confidence).toBeGreaterThan(0.9);
  });

  it('should extract entities correctly', () => {
    const decision = router.decide('Contact: Marie Martin, email: marie@example.com', 0.2, 'fr');
    expect(decision.matched_algorithm).toBe('ner');
    expect(decision.extraction_entities).toContain('Marie Martin');
    expect(decision.extraction_entities).toContain('marie@example.com');
  });

  it('should estimate token savings', () => {
    const decision = router.decide('Analyser Jean Dupont et Pierre Martin', 0.2, 'fr');
    expect(decision.tokens_saved_estimate).toBeGreaterThan(0);
  });
});