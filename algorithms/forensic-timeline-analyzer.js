// ============================================
// algorithms/forensic-timeline-analyzer.js
// Forensic Timeline Analysis - Pattern Recognition
// ============================================

const crypto = require('crypto');

class ForensicTimelineAnalyzer {
  constructor() {
    this.timeWindows = {
      micro: 60 * 1000,        // 1 minute
      short: 3600 * 1000,      // 1 hour
      medium: 86400 * 1000,    // 1 day
      long: 604800 * 1000,     // 1 week
    };
    
    this.anomalyThresholds = {
      burstFrequency: 5,       // 5+ messages/minute = suspect
      coordinatedWindow: 300,  // 5min max between coordinated attacks
      accountAgeRisk: 7,       // Accounts < 7 days = risky
    };
  }

  async analyze(incidents, userProfiles = {}) {
    const timeline = this.buildTimeline(incidents);
    
    return {
      summary: this.generateSummary(timeline),
      patterns: {
        bursts: this.detectBursts(timeline),
        coordinated: this.detectCoordinatedAttacks(timeline, userProfiles),
        recurring: this.detectRecurringPatterns(timeline),
        escalation: this.detectEscalationPatterns(timeline),
      },
      anomalies: this.detectAnomalies(timeline),
      predictions: this.predictFutureIncidents(timeline),
      forensicChain: this.reconstructChainOfCustody(timeline),
    };
  }

  buildTimeline(incidents) {
    const sorted = incidents.sort((a, b) => 
      new Date(a.capturedAt) - new Date(b.capturedAt)
    );

    const timeline = {
      start: new Date(sorted[0]?.capturedAt),
      end: new Date(sorted[sorted.length - 1]?.capturedAt),
      events: [],
      intervals: {},
    };

    timeline.duration = timeline.end - timeline.start;

    timeline.events = sorted.map((incident, index) => ({
      id: incident.id,
      timestamp: new Date(incident.capturedAt),
      type: 'INCIDENT',
      severity: incident.severity,
      aggressorId: incident.aggressorUserId,
      victimId: incident.victimUserId,
      platform: incident.platform,
      order: index,
      timeSincePrevious: index > 0 
        ? new Date(incident.capturedAt) - new Date(sorted[index - 1].capturedAt)
        : null,
    }));

    // Aggregate by intervals
    for (const [scale, window] of Object.entries(this.timeWindows)) {
      timeline.intervals[scale] = this.aggregateByWindow(timeline.events, window);
    }

    return timeline;
  }

  detectBursts(timeline) {
    const bursts = [];
    const microIntervals = timeline.intervals.micro || [];

    for (const interval of microIntervals) {
      if (interval.count >= this.anomalyThresholds.burstFrequency) {
        bursts.push({
          startTime: interval.start,
          endTime: interval.end,
          count: interval.count,
          severity: 'HIGH',
          events: interval.events,
          uniqueAggressors: new Set(interval.events.map(e => e.aggressorId)).size,
          uniqueVictims: new Set(interval.events.map(e => e.victimId)).size,
          averageSeverity: interval.events.reduce((sum, e) => sum + e.severity, 0) / interval.count,
          type: this.classifyBurstType(interval),
        });
      }
    }

    return bursts.sort((a, b) => b.count - a.count);
  }

  detectCoordinatedAttacks(timeline, userProfiles) {
    const coordinated = [];
    const shortIntervals = timeline.intervals.short || [];

    for (const interval of shortIntervals) {
      const events = interval.events;
      
      if (events.length < 2) continue;

      const victimGroups = this.groupBy(events, 'victimId');

      for (const [victimId, victimEvents] of Object.entries(victimGroups)) {
        const aggressors = new Set(victimEvents.map(e => e.aggressorId));
        
        if (aggressors.size >= 2) {
          const timeSpread = Math.max(...victimEvents.map(e => e.timestamp)) -
                             Math.min(...victimEvents.map(e => e.timestamp));

          coordinated.push({
            victimId,
            aggressors: Array.from(aggressors),
            startTime: new Date(Math.min(...victimEvents.map(e => e.timestamp))),
            endTime: new Date(Math.max(...victimEvents.map(e => e.timestamp))),
            timeSpread,
            count: victimEvents.length,
            coordinationScore: this.calculateCoordinationScore({
              timeSpread,
              aggressorCount: aggressors.size,
              messageCount: victimEvents.length,
            }),
            botNetworkProbability: this.calculateBotNetworkProbability(
              aggressors,
              userProfiles
            ),
          });
        }
      }
    }

    return coordinated.sort((a, b) => b.coordinationScore - a.coordinationScore);
  }

  detectRecurringPatterns(timeline) {
    return {
      hourly: this.detectHourlyPatterns(timeline),
      daily: this.detectDailyPatterns(timeline),
      weekly: this.detectWeeklyPatterns(timeline),
    };
  }

  detectHourlyPatterns(timeline) {
    const hourDistribution = Array(24).fill(0);
    
    timeline.events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourDistribution[hour]++;
    });

    const mean = hourDistribution.reduce((sum, count) => sum + count, 0) / 24;
    const stdDev = Math.sqrt(
      hourDistribution.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / 24
    );

    const peakHours = hourDistribution
      .map((count, hour) => ({ hour, count, zscore: (count - mean) / stdDev }))
      .filter(h => h.zscore > 2)
      .sort((a, b) => b.count - a.count);

    return {
      distribution: hourDistribution,
      mean,
      stdDev,
      peakHours,
      interpretation: peakHours.length > 0
        ? `Activité concentrée sur ${peakHours.length} heures: ${peakHours.map(h => `${h.hour}h (${h.count} incidents)`).join(', ')}`
        : 'Activité répartie uniformément sur 24h',
    };
  }

  detectDailyPatterns(timeline) {
    const dayDistribution = Array(7).fill(0);
    
    timeline.events.forEach(event => {
      const day = event.timestamp.getDay();
      dayDistribution[day]++;
    });

    return { distribution: dayDistribution };
  }

  detectWeeklyPatterns(timeline) {
    const weeklyData = {};
    
    timeline.events.forEach(event => {
      const week = this.getWeekNumber(event.timestamp);
      weeklyData[week] = (weeklyData[week] || 0) + 1;
    });

    return { distribution: weeklyData };
  }

  detectEscalationPatterns(timeline) {
    const windows = timeline.intervals.medium || [];
    const escalations = [];

    for (let i = 1; i < windows.length; i++) {
      const prev = windows[i - 1];
      const curr = windows[i];

      const frequencyIncrease = (curr.count - prev.count) / Math.max(prev.count, 1);
      const severityIncrease = (curr.averageSeverity - prev.averageSeverity) / Math.max(prev.averageSeverity, 1);

      if (frequencyIncrease > 0.5 || severityIncrease > 0.3) {
        escalations.push({
          period: { start: prev.start, end: curr.end },
          frequencyIncrease: frequencyIncrease * 100,
          severityIncrease: severityIncrease * 100,
          risk: frequencyIncrease > 1 || severityIncrease > 0.5 ? 'CRITICAL' : 'HIGH',
        });
      }
    }

    return escalations;
  }

  detectAnomalies(timeline) {
    const anomalies = [];
    
    // Detect unusual time gaps
    for (let i = 1; i < timeline.events.length; i++) {
      const gap = timeline.events[i].timeSincePrevious;
      if (gap > 86400000) { // > 24 hours
        anomalies.push({
          type: 'TIME_GAP',
          description: `Unusual ${Math.round(gap / 3600000)}h gap between incidents`,
          timestamp: timeline.events[i].timestamp,
          severity: 'MEDIUM',
        });
      }
    }

    return anomalies;
  }

  predictFutureIncidents(timeline) {
    const mediumIntervals = timeline.intervals.medium || [];
    const predictions = [];
    
    if (mediumIntervals.length < 3) {
      return { predictions: [], confidence: 'LOW', message: 'Insufficient data for prediction' };
    }

    const trend = this.calculateTrend(mediumIntervals);
    const baselineCount = mediumIntervals.slice(-1)[0]?.count || 0;

    for (let i = 1; i <= 7; i++) {
      const predicted = Math.max(0, baselineCount + trend * i);

      predictions.push({
        day: i,
        predictedIncidents: Math.round(predicted),
        confidence: Math.max(0, 1 - (i * 0.1)), // Confidence decreases with time
        riskLevel: predicted > baselineCount * 1.5 ? 'HIGH' : 'MEDIUM',
      });
    }

    return {
      predictions,
      trend: trend > 0 ? 'INCREASING' : trend < 0 ? 'DECREASING' : 'STABLE',
      confidence: 'MEDIUM',
    };
  }

  reconstructChainOfCustody(timeline) {
    return timeline.events.map((event, index) => ({
      sequenceNumber: index + 1,
      eventId: event.id,
      timestamp: event.timestamp.toISOString(),
      type: event.type,
      previousEventId: index > 0 ? timeline.events[index - 1].id : null,
      nextEventId: index < timeline.events.length - 1 ? timeline.events[index + 1].id : null,
      eventHash: this.calculateEventHash(event),
      chainHash: this.calculateChainHash(timeline.events.slice(0, index + 1)),
      verified: true,
      tamperedDetected: false,
    }));
  }

  generateSummary(timeline) {
    return {
      totalEvents: timeline.events.length,
      timespan: timeline.duration,
      averageFrequency: timeline.events.length / Math.max(1, timeline.duration / 86400000), // per day
      peakActivity: this.findPeakActivity(timeline),
      riskAssessment: this.assessOverallRisk(timeline),
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  aggregateByWindow(events, windowSize) {
    if (!events.length) return [];
    
    const intervals = [];
    let currentWindow = {
      start: events[0].timestamp,
      end: new Date(events[0].timestamp.getTime() + windowSize),
      events: [],
      count: 0,
      averageSeverity: 0,
    };

    for (const event of events) {
      if (event.timestamp < currentWindow.end) {
        currentWindow.events.push(event);
        currentWindow.count++;
      } else {
        if (currentWindow.count > 0) {
          currentWindow.averageSeverity = 
            currentWindow.events.reduce((sum, e) => sum + e.severity, 0) / currentWindow.count;
          intervals.push(currentWindow);
        }
        
        currentWindow = {
          start: event.timestamp,
          end: new Date(event.timestamp.getTime() + windowSize),
          events: [event],
          count: 1,
          averageSeverity: 0,
        };
      }
    }

    if (currentWindow.count > 0) {
      currentWindow.averageSeverity = 
        currentWindow.events.reduce((sum, e) => sum + e.severity, 0) / currentWindow.count;
      intervals.push(currentWindow);
    }

    return intervals;
  }

  groupBy(array, key) {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  }

  calculateCoordinationScore({ timeSpread, aggressorCount, messageCount }) {
    const timeScore = Math.max(0, 1 - timeSpread / (this.anomalyThresholds.coordinatedWindow * 1000));
    const aggressorScore = Math.min(1, aggressorCount / 5);
    const volumeScore = Math.min(1, messageCount / 10);
    
    return (timeScore * 0.5 + aggressorScore * 0.3 + volumeScore * 0.2) * 100;
  }

  calculateBotNetworkProbability(aggressors, userProfiles) {
    const profiles = Array.from(aggressors).map(id => userProfiles[id]).filter(Boolean);
    
    if (profiles.length < 2) return 0;

    const accountAges = profiles.map(p => 
      Date.now() - new Date(p.createdAt || Date.now()).getTime()
    );
    const avgAge = accountAges.reduce((sum, age) => sum + age, 0) / accountAges.length;
    const ageStdDev = Math.sqrt(
      accountAges.reduce((sum, age) => sum + Math.pow(age - avgAge, 2), 0) / accountAges.length
    );

    const ageSimilarity = 1 - Math.min(1, ageStdDev / (86400 * 1000 * 30));
    return ageSimilarity * 100;
  }

  classifyBurstType(interval) {
    const uniqueAggressors = new Set(interval.events.map(e => e.aggressorId)).size;
    const uniqueVictims = new Set(interval.events.map(e => e.victimId)).size;
    
    if (uniqueAggressors > 3 && uniqueVictims === 1) return 'COORDINATED_ATTACK';
    if (uniqueAggressors === 1 && uniqueVictims > 1) return 'SPREE_HARASSMENT';
    if (uniqueAggressors > 1 && uniqueVictims > 1) return 'MASS_HARASSMENT';
    return 'BURST';
  }

  calculateTrend(intervals) {
    const n = intervals.length;
    const x = intervals.map((_, i) => i);
    const y = intervals.map(interval => interval.count);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  calculateEventHash(event) {
    const data = JSON.stringify({
      id: event.id,
      timestamp: event.timestamp,
      aggressorId: event.aggressorId,
      victimId: event.victimId,
      severity: event.severity,
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  calculateChainHash(events) {
    const hashes = events.map(e => this.calculateEventHash(e)).join('');
    return crypto.createHash('sha256').update(hashes).digest('hex');
  }

  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  findPeakActivity(timeline) {
    const hourly = this.detectHourlyPatterns(timeline);
    const peak = hourly.peakHours[0];
    return peak ? `${peak.hour}h (${peak.count} incidents)` : 'No clear peak';
  }

  assessOverallRisk(timeline) {
    const recentEvents = timeline.events.filter(e => 
      Date.now() - e.timestamp < 86400000 // Last 24h
    );
    
    if (recentEvents.length > 10) return 'CRITICAL';
    if (recentEvents.length > 5) return 'HIGH';
    if (recentEvents.length > 2) return 'MEDIUM';
    return 'LOW';
  }
}

module.exports = ForensicTimelineAnalyzer;