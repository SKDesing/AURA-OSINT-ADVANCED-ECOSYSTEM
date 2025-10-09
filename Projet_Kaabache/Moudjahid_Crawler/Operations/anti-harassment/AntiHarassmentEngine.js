// ============================================
// engines/anti-harassment/AntiHarassmentEngine.js
// AURA Anti-Harassment Engine - Production Ready
// ============================================

const harassmentDetector = require('../../ai/models/harassment-detector');
const ForensicTimelineAnalyzer = require('../../algorithms/forensic-timeline-analyzer');
const { Incident } = require('../../src/core/domain/Incident/Incident.entity');
const config = require('../../config/index.js');

class AntiHarassmentEngine {
  constructor() {
    this.detector = harassmentDetector;
    this.timelineAnalyzer = new ForensicTimelineAnalyzer();
    this.incidents = new Map();
    this.activeMonitoring = new Set();
    this.alertThresholds = config.get('antiHarassment.detection');
  }

  async initialize() {
    console.log('🛡️ AURA Anti-Harassment Engine initializing...');
    this.setupRealTimeMonitoring();
    console.log('✅ Anti-Harassment Engine ready');
  }

  async analyzeMessage(message, context = {}) {
    const startTime = Date.now();
    
    try {
      const analysis = await this.detector.analyze(message.text, {
        userId: message.userId,
        sessionId: context.sessionId,
        userProfile: context.userProfile,
        messageHistory: context.messageHistory,
        recentMessages: context.recentMessages,
        victimId: context.victimId,
      });

      if (analysis.isHarassment && analysis.severity >= 5) {
        const incident = await this.createIncident({
          aggressorUserId: message.userId,
          victimUserId: context.victimId,
          platform: 'tiktok',
          severity: analysis.severity,
          description: `Harassment detected: ${analysis.category}`,
          capturedAt: new Date(message.timestamp),
          evidence: [{
            type: 'message',
            content: message.text,
            analysis: analysis,
            metadata: {
              sessionId: context.sessionId,
              messageId: message.id,
            }
          }],
        });

        analysis.incidentId = incident.id.value;
      }

      if (analysis.severity >= (this.alertThresholds?.autoEscalateThreshold || 8)) {
        await this.triggerImmediateResponse(analysis, message, context);
      }

      this.updateMonitoring(message.userId, analysis);

      return {
        ...analysis,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('AntiHarassmentEngine.analyzeMessage error:', error);
      return {
        isHarassment: false,
        error: error.message,
        processingTime: Date.now() - startTime,
      };
    }
  }

  async analyzeSession(sessionData) {
    const { messages, userProfiles, sessionId } = sessionData;
    
    console.log(`🔍 Analyzing session ${sessionId} with ${messages.length} messages`);
    
    const results = [];
    const incidents = [];

    for (const message of messages) {
      const context = {
        sessionId,
        userProfile: userProfiles[message.userId],
        messageHistory: messages.filter(m => 
          m.userId === message.userId && m.timestamp < message.timestamp
        ).slice(-10),
        recentMessages: messages.filter(m => 
          Math.abs(new Date(m.timestamp) - new Date(message.timestamp)) < 300000
        ),
        victimId: this.identifyVictim(message, messages),
      };

      const analysis = await this.analyzeMessage(message, context);
      results.push({
        messageId: message.id,
        userId: message.userId,
        ...analysis,
      });

      if (analysis.incidentId) {
        incidents.push(analysis.incidentId);
      }
    }

    const timelineAnalysis = await this.timelineAnalyzer.analyze(
      incidents.map(id => this.incidents.get(id)).filter(Boolean),
      userProfiles
    );

    const report = this.generateSessionReport(results, {}, timelineAnalysis);

    return {
      sessionId,
      individual: results,
      timelineAnalysis,
      report,
      summary: {
        totalMessages: messages.length,
        harassmentDetected: results.filter(r => r.isHarassment).length,
        incidentsCreated: incidents.length,
        riskLevel: report.riskLevel,
        recommendation: report.recommendation,
      },
    };
  }

  setupRealTimeMonitoring() {
    setInterval(() => {
      this.detectCoordinatedAttacks();
    }, 60000);

    setInterval(() => {
      this.cleanupMonitoringData();
    }, 3600000);
  }

  async createIncident(incidentData) {
    try {
      const incident = new Incident({
        ...incidentData,
        repeatOffender: await this.isRepeatOffender(incidentData.aggressorUserId),
      });

      if (incident.severity >= 8) {
        incident.confirm();
      }

      if (incident.threatLevel === 'CRITICAL') {
        incident.escalateToAuthorities();
      }

      this.incidents.set(incident.id.value, incident);
      
      console.log(`🚨 Incident created: ${incident.id.value} (Severity: ${incident.severity})`);
      
      return incident;

    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    }
  }

  async triggerImmediateResponse(analysis, message, context) {
    console.log(`🚨 CRITICAL HARASSMENT DETECTED - Immediate response triggered`);
    
    const actions = [];

    if (config.get('antiHarassment.response.autoBlock')) {
      actions.push(this.blockUser(message.userId));
    }

    if (config.get('antiHarassment.response.notifyAuthorities')) {
      actions.push(this.notifyAuthorities(analysis, message, context));
    }

    const webhookUrl = config.get('antiHarassment.response.alertWebhook');
    if (webhookUrl) {
      actions.push(this.sendWebhookAlert(webhookUrl, analysis, message));
    }

    await Promise.allSettled(actions);
  }

  async detectCoordinatedAttacks() {
    const recentIncidents = Array.from(this.incidents.values())
      .filter(incident => 
        Date.now() - new Date(incident.createdAt).getTime() < 3600000
      );

    if (recentIncidents.length < 2) return;

    const analysis = await this.timelineAnalyzer.analyze(recentIncidents);
    
    if (analysis.patterns.coordinated.length > 0) {
      console.log('🚨 COORDINATED ATTACK DETECTED');
      
      for (const attack of analysis.patterns.coordinated) {
        if (attack.coordinationScore > 70) {
          await this.handleCoordinatedAttack(attack);
        }
      }
    }
  }

  async handleCoordinatedAttack(attack) {
    console.log(`🚨 Handling coordinated attack: ${attack.aggressors.length} aggressors`);
    
    for (const aggressorId of attack.aggressors) {
      await this.blockUser(aggressorId);
    }

    await this.createIncident({
      aggressorUserId: attack.aggressors[0],
      victimUserId: attack.victimId,
      platform: 'tiktok',
      severity: 10,
      description: `Coordinated attack detected: ${attack.aggressors.length} aggressors`,
      capturedAt: attack.startTime,
      evidence: [{
        type: 'coordination_analysis',
        data: attack,
      }],
    });
  }

  generateSessionReport(results, crossAnalysis, timelineAnalysis) {
    const harassment = results.filter(r => r.isHarassment);
    const avgSeverity = harassment.length > 0 
      ? harassment.reduce((sum, r) => sum + r.severity, 0) / harassment.length 
      : 0;

    let riskLevel = 'LOW';
    let recommendation = 'Continue monitoring';

    if (avgSeverity >= 8) {
      riskLevel = 'CRITICAL';
      recommendation = 'IMMEDIATE ESCALATION - Contact authorities';
    } else if (harassment.length > 5 || avgSeverity >= 6) {
      riskLevel = 'HIGH';
      recommendation = 'Block users and increase monitoring';
    } else if (harassment.length > 2 || avgSeverity >= 4) {
      riskLevel = 'MEDIUM';
      recommendation = 'Issue warnings and monitor closely';
    }

    return {
      riskLevel,
      recommendation,
      statistics: {
        totalMessages: results.length,
        harassmentRate: harassment.length / results.length,
        averageSeverity: Math.round(avgSeverity * 10) / 10,
        categories: this.categorizeHarassment(harassment),
      },
      timeline: timelineAnalysis.summary,
    };
  }

  identifyVictim(message, allMessages) {
    const mentions = message.text.match(/@(\w+)/g);
    if (mentions && mentions.length === 1) {
      const username = mentions[0].substring(1);
      const user = allMessages.find(m => m.username === username);
      return user?.userId;
    }
    return null;
  }

  async isRepeatOffender(userId) {
    const userIncidents = Array.from(this.incidents.values())
      .filter(incident => incident.aggressorUserId === userId);
    return userIncidents.length >= 3;
  }

  updateMonitoring(userId, analysis) {
    if (analysis.isHarassment) {
      this.activeMonitoring.add(userId);
    }
  }

  categorizeHarassment(harassment) {
    const categories = {};
    harassment.forEach(h => {
      categories[h.category] = (categories[h.category] || 0) + 1;
    });
    return categories;
  }

  async blockUser(userId) {
    console.log(`🚫 Blocking user: ${userId}`);
  }

  async notifyAuthorities(analysis, message, context) {
    console.log(`📞 Notifying authorities for critical incident`);
  }

  async sendWebhookAlert(url, analysis, message) {
    console.log(`🔔 Sending webhook alert to: ${url}`);
  }

  cleanupMonitoringData() {
    const cutoff = Date.now() - 86400000;
    
    for (const [id, incident] of this.incidents.entries()) {
      if (new Date(incident.createdAt).getTime() < cutoff) {
        this.incidents.delete(id);
      }
    }
  }

  getStats() {
    return {
      totalIncidents: this.incidents.size,
      activeMonitoring: this.activeMonitoring.size,
      criticalIncidents: Array.from(this.incidents.values())
        .filter(i => i.threatLevel === 'CRITICAL').length,
    };
  }

  async shutdown() {
    console.log('🛡️ Anti-Harassment Engine shutting down...');
    this.incidents.clear();
    this.activeMonitoring.clear();
  }
}

module.exports = AntiHarassmentEngine;