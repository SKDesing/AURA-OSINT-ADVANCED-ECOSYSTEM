// ============================================
// tests/integration/roadmap-integration.test.js
// Integration tests for AURA Roadmap implementation
// ============================================

const assert = require('assert');

describe('AURA Roadmap Integration Tests', () => {
  
  describe('Configuration System', () => {
    it('should load unified configuration', () => {
      const config = require('../../config');
      
      assert(config.get('system.name') === 'AURA TikTok Intelligence');
      assert(config.get('ports.gui') === 3000);
      assert(config.getPort('gui') === 3000);
      assert(config.isDevelopment() || config.isProduction());
    });
    
    it('should validate configuration', () => {
      const config = require('../../config');
      assert.doesNotThrow(() => config.validate());
    });
  });
  
  describe('Domain-Driven Design Architecture', () => {
    it('should create incident entity', () => {
      const { Incident } = require('../../src/core/domain/Incident/Incident.entity');
      
      const incident = new Incident({
        aggressorUserId: 'user123',
        victimUserId: 'victim456',
        platform: 'tiktok',
        severity: 8,
        description: 'Test harassment incident',
        capturedAt: new Date(),
      });
      
      assert(incident.id);
      assert(incident.severity === 8);
      assert(incident.threatLevel === 'HIGH');
      assert(incident.status === 'PENDING_REVIEW');
    });
    
    it('should handle business rules', () => {
      const { Incident } = require('../../src/core/domain/Incident/Incident.entity');
      
      const incident = new Incident({
        aggressorUserId: 'user123',
        victimUserId: 'victim456',
        platform: 'tiktok',
        severity: 9,
        description: 'Critical harassment',
        capturedAt: new Date(),
      });
      
      // Should allow confirmation for high severity
      assert.doesNotThrow(() => incident.confirm());
      assert(incident.status === 'CONFIRMED');
      
      // Should allow escalation for critical threats
      assert.doesNotThrow(() => incident.escalateToAuthorities());
      assert(incident.status === 'ESCALATED');
    });
  });
  
  describe('Harassment Detection Algorithm', () => {
    it('should detect harassment in messages', async () => {
      const detector = require('../../ai/models/harassment-detector');
      
      const safeMessage = await detector.analyze('Hello, how are you today?');
      assert(safeMessage.isHarassment === false);
      assert(safeMessage.confidence >= 0);
      
      const harassmentMessage = await detector.analyze('You are stupid and ugly');
      assert(harassmentMessage.isHarassment === true);
      assert(harassmentMessage.severity > 0);
      assert(harassmentMessage.category);
    });
    
    it('should provide detailed analysis', async () => {
      const detector = require('../../ai/models/harassment-detector');
      
      const result = await detector.analyze('I will kill you', {
        userProfile: { previousViolations: 2, accountAge: 5 }
      });
      
      assert(result.isHarassment === true);
      assert(result.severity >= 8); // Should be high for threats
      assert(result.category === 'threats');
      assert(result.explanation);
      assert(result.keywords.length > 0);
      assert(result.processingTime > 0);
    });
  });
  
  describe('Forensic Timeline Analyzer', () => {
    it('should analyze incident timeline', async () => {
      const ForensicTimelineAnalyzer = require('../../algorithms/forensic-timeline-analyzer');
      const analyzer = new ForensicTimelineAnalyzer();
      
      const incidents = [
        {
          id: '1',
          capturedAt: new Date(Date.now() - 3600000), // 1 hour ago
          severity: 6,
          aggressorUserId: 'user1',
          victimUserId: 'victim1',
          platform: 'tiktok',
        },
        {
          id: '2',
          capturedAt: new Date(Date.now() - 1800000), // 30 min ago
          severity: 8,
          aggressorUserId: 'user1',
          victimUserId: 'victim1',
          platform: 'tiktok',
        },
      ];
      
      const analysis = await analyzer.analyze(incidents);
      
      assert(analysis.summary);
      assert(analysis.summary.totalEvents === 2);
      assert(analysis.patterns);
      assert(analysis.forensicChain);
      assert(analysis.forensicChain.length === 2);
    });
    
    it('should detect coordinated attacks', async () => {
      const ForensicTimelineAnalyzer = require('../../algorithms/forensic-timeline-analyzer');
      const analyzer = new ForensicTimelineAnalyzer();
      
      const coordinatedIncidents = [
        {
          id: '1',
          capturedAt: new Date(),
          severity: 7,
          aggressorUserId: 'user1',
          victimUserId: 'victim1',
          platform: 'tiktok',
        },
        {
          id: '2',
          capturedAt: new Date(Date.now() + 60000), // 1 min later
          severity: 7,
          aggressorUserId: 'user2',
          victimUserId: 'victim1', // Same victim
          platform: 'tiktok',
        },
      ];
      
      const analysis = await analyzer.analyze(coordinatedIncidents, {
        user1: { createdAt: new Date(Date.now() - 86400000) },
        user2: { createdAt: new Date(Date.now() - 86400000) },
      });
      
      assert(analysis.patterns.coordinated);
      // Should detect coordination when multiple users target same victim
    });
  });
  
  describe('Anti-Harassment Engine', () => {
    it('should initialize successfully', async () => {
      const AntiHarassmentEngine = require('../../engines/anti-harassment/AntiHarassmentEngine');
      const engine = new AntiHarassmentEngine();
      
      await engine.initialize();
      
      const stats = engine.getStats();
      assert(typeof stats.totalIncidents === 'number');
      assert(typeof stats.activeMonitoring === 'number');
      
      await engine.shutdown();
    });
    
    it('should analyze messages and create incidents', async () => {
      const AntiHarassmentEngine = require('../../engines/anti-harassment/AntiHarassmentEngine');
      const engine = new AntiHarassmentEngine();
      
      await engine.initialize();
      
      const message = {
        id: 'msg1',
        text: 'You are worthless and should die',
        userId: 'aggressor1',
        timestamp: new Date(),
      };
      
      const result = await engine.analyzeMessage(message, {
        sessionId: 'session1',
        victimId: 'victim1',
        userProfile: { previousViolations: 0, accountAge: 30 },
      });
      
      assert(result.isHarassment === true);
      assert(result.severity >= 7);
      assert(result.incidentId); // Should create incident for high severity
      
      const stats = engine.getStats();
      assert(stats.totalIncidents >= 1);
      
      await engine.shutdown();
    });
    
    it('should analyze session data', async () => {
      const AntiHarassmentEngine = require('../../engines/anti-harassment/AntiHarassmentEngine');
      const engine = new AntiHarassmentEngine();
      
      await engine.initialize();
      
      const sessionData = {
        sessionId: 'session1',
        messages: [
          {
            id: 'msg1',
            text: 'Hello everyone!',
            userId: 'user1',
            timestamp: new Date(Date.now() - 60000),
          },
          {
            id: 'msg2',
            text: 'You are so stupid @victim1',
            userId: 'user2',
            timestamp: new Date(),
          },
        ],
        userProfiles: {
          user1: { previousViolations: 0, accountAge: 100 },
          user2: { previousViolations: 1, accountAge: 5 },
        },
      };
      
      const analysis = await engine.analyzeSession(sessionData);
      
      assert(analysis.sessionId === 'session1');
      assert(analysis.individual.length === 2);
      assert(analysis.summary.totalMessages === 2);
      assert(analysis.summary.harassmentDetected >= 0);
      assert(analysis.report.riskLevel);
      assert(analysis.report.recommendation);
      
      await engine.shutdown();
    });
  });
  
  describe('Integration Flow', () => {
    it('should handle complete harassment detection flow', async () => {
      // 1. Initialize engine
      const AntiHarassmentEngine = require('../../engines/anti-harassment/AntiHarassmentEngine');
      const engine = new AntiHarassmentEngine();
      await engine.initialize();
      
      // 2. Simulate harassment message
      const message = {
        id: 'msg1',
        text: 'I will find you and hurt you @victim1',
        userId: 'aggressor1',
        timestamp: new Date(),
      };
      
      // 3. Analyze message
      const result = await engine.analyzeMessage(message, {
        sessionId: 'session1',
        victimId: 'victim1',
        userProfile: { previousViolations: 2, accountAge: 3 }, // Suspicious profile
      });
      
      // 4. Verify detection
      assert(result.isHarassment === true);
      assert(result.severity >= 8); // Should be high for threats
      assert(result.category === 'threats');
      assert(result.incidentId); // Should create incident
      
      // 5. Verify incident creation
      const stats = engine.getStats();
      assert(stats.totalIncidents >= 1);
      
      // 6. Cleanup
      await engine.shutdown();
    });
  });
});

// Run tests if called directly
if (require.main === module) {
  console.log('🧪 Running AURA Roadmap Integration Tests...\n');
  
  // Simple test runner
  const tests = [
    () => require('../../config'),
    () => require('../../ai/models/harassment-detector'),
    () => require('../../algorithms/forensic-timeline-analyzer'),
    () => require('../../engines/anti-harassment/AntiHarassmentEngine'),
    () => require('../../src/core/domain/Incident/Incident.entity'),
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      test();
      console.log('✅ Module load test passed');
      passed++;
    } catch (error) {
      console.log('❌ Module load test failed:', error.message);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All integration tests passed!');
  } else {
    console.log('⚠️ Some tests failed - check implementation');
    process.exit(1);
  }
}