/**
 * 🎯 AURA CREDIBILITY & CONFIDENCE SCORING SYSTEM
 * Système multi-facteurs d'évaluation de crédibilité des données OSINT
 */

class AURACredibilityScoring {
  constructor() {
    this.scoringFactors = {
      SOURCE_RELIABILITY: 0.25,
      DATA_CORROBORATION: 0.30,
      TEMPORAL_CONSISTENCY: 0.15,
      TECHNICAL_VERIFICATION: 0.20,
      CONTEXTUAL_PLAUSIBILITY: 0.10
    };

    this.thresholds = {
      VERIFIED: 90,
      HIGH_CONFIDENCE: 75,
      MEDIUM_CONFIDENCE: 60,
      LOW_CONFIDENCE: 40,
      UNVERIFIED: 0
    };

    this.sourceReliabilityRatings = {
      'OFFICIAL_RECORDS': 95,
      'GOVERNMENT_DATABASE': 90,
      'VERIFIED_SOCIAL_MEDIA': 75,
      'NEWS_OUTLET_CREDIBLE': 70,
      'UNVERIFIED_SOCIAL_MEDIA': 40,
      'ANONYMOUS_TIP': 30,
      'DARK_WEB': 20
    };
  }

  calculateCredibilityScore(dataPoint) {
    const scores = {
      source_reliability: this.evaluateSourceReliability(dataPoint),
      data_corroboration: this.evaluateDataCorroboration(dataPoint),
      temporal_consistency: this.evaluateTemporalConsistency(dataPoint),
      technical_verification: this.evaluateTechnicalVerification(dataPoint),
      contextual_plausibility: this.evaluateContextualPlausibility(dataPoint)
    };

    const weightedScore = 
      (scores.source_reliability * this.scoringFactors.SOURCE_RELIABILITY) +
      (scores.data_corroboration * this.scoringFactors.DATA_CORROBORATION) +
      (scores.temporal_consistency * this.scoringFactors.TEMPORAL_CONSISTENCY) +
      (scores.technical_verification * this.scoringFactors.TECHNICAL_VERIFICATION) +
      (scores.contextual_plausibility * this.scoringFactors.CONTEXTUAL_PLAUSIBILITY);

    return {
      overall_score: Math.round(weightedScore),
      confidence_level: this.getConfidenceLevel(weightedScore),
      breakdown: scores,
      recommendations: this.generateRecommendations(scores, weightedScore)
    };
  }

  evaluateSourceReliability(dataPoint) {
    const sourceType = dataPoint.source_type || 'UNKNOWN';
    const baseScore = this.sourceReliabilityRatings[sourceType] || 50;

    let adjustments = 0;

    if (dataPoint.is_primary_source) adjustments += 10;
    
    if (dataPoint.source_history) {
      const accuracy = dataPoint.source_history.accuracy_rate || 0;
      adjustments += (accuracy - 70) * 0.3;
    }

    if (dataPoint.source_reputation === 'ESTABLISHED') adjustments += 5;
    if (dataPoint.source_reputation === 'QUESTIONABLE') adjustments -= 15;

    return Math.max(0, Math.min(100, baseScore + adjustments));
  }

  evaluateDataCorroboration(dataPoint) {
    let score = 0;

    const sources = dataPoint.corroborating_sources || [];
    
    if (sources.length === 0) {
      score = 30;
    } else if (sources.length === 1) {
      score = 50;
    } else if (sources.length === 2) {
      score = 70;
    } else if (sources.length >= 3) {
      score = 90;
    }

    if (this.hasSourceDiversity(sources)) {
      score += 10;
    }

    if (dataPoint.sources_potentially_linked) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  evaluateTemporalConsistency(dataPoint) {
    let score = 70;

    const dataAge = this.calculateDataAge(dataPoint.timestamp);
    
    if (dataAge < 7) {
      score += 15;
    } else if (dataAge < 30) {
      score += 10;
    } else if (dataAge > 365) {
      score -= 20;
    }

    if (dataPoint.timeline_events) {
      const hasAnomalies = this.detectTimelineAnomalies(dataPoint.timeline_events);
      if (hasAnomalies) {
        score -= 25;
      }
    }

    if (dataPoint.metadata_timestamp_verified) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  evaluateTechnicalVerification(dataPoint) {
    let score = 50;

    if (dataPoint.cryptographic_signature) {
      score += 20;
      
      if (dataPoint.signature_validated) {
        score += 10;
      }
    }

    if (dataPoint.metadata_analysis) {
      const analysis = dataPoint.metadata_analysis;
      
      if (analysis.no_tampering_detected) {
        score += 15;
      }
      
      if (analysis.geolocation_verified) {
        score += 10;
      }
      
      if (analysis.device_fingerprint_matched) {
        score += 5;
      }
    }

    if (dataPoint.hash_verification?.matches_known_authentic) {
      score += 20;
    }

    if (dataPoint.blockchain_verified) {
      score += 15;
    }

    if (dataPoint.media_forensics?.deepfake_probability > 0.7) {
      score -= 40;
    }

    return Math.max(0, Math.min(100, score));
  }

  evaluateContextualPlausibility(dataPoint) {
    let score = 60;

    if (dataPoint.geolocation) {
      if (this.isGeographicallyPlausible(dataPoint)) {
        score += 15;
      } else {
        score -= 20;
      }
    }

    if (dataPoint.behavioral_pattern) {
      if (this.isBehaviorallyConsistent(dataPoint)) {
        score += 10;
      } else {
        score -= 15;
      }
    }

    if (dataPoint.statistical_analysis) {
      const anomalyScore = dataPoint.statistical_analysis.anomaly_score || 0;
      score -= (anomalyScore * 0.3);
    }

    if (dataPoint.profile_consistency_check?.contradictions > 3) {
      score -= 25;
    }

    return Math.max(0, Math.min(100, score));
  }

  getConfidenceLevel(score) {
    if (score >= this.thresholds.VERIFIED) {
      return {
        level: 'VERIFIED',
        label: 'Vérifié',
        color: '#2ECC71',
        icon: '✅',
        description: 'Information hautement fiable et vérifiée par multiples sources indépendantes'
      };
    } else if (score >= this.thresholds.HIGH_CONFIDENCE) {
      return {
        level: 'HIGH_CONFIDENCE',
        label: 'Haute Confiance',
        color: '#3498DB',
        icon: '🔹',
        description: 'Information probable, corroborée par sources crédibles'
      };
    } else if (score >= this.thresholds.MEDIUM_CONFIDENCE) {
      return {
        level: 'MEDIUM_CONFIDENCE',
        label: 'Confiance Moyenne',
        color: '#F39C12',
        icon: '⚠️',
        description: 'Information nécessitant vérification additionnelle'
      };
    } else if (score >= this.thresholds.LOW_CONFIDENCE) {
      return {
        level: 'LOW_CONFIDENCE',
        label: 'Faible Confiance',
        color: '#E67E22',
        icon: '⚡',
        description: 'Information suspecte ou peu fiable'
      };
    } else {
      return {
        level: 'UNVERIFIED',
        label: 'Non Vérifié',
        color: '#E74C3C',
        icon: '❌',
        description: 'Information non confirmée - À traiter avec extrême prudence'
      };
    }
  }

  generateRecommendations(scores, overallScore) {
    const recommendations = [];

    if (scores.source_reliability < 60) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Rechercher sources additionnelles plus fiables',
        details: 'La fiabilité de la source actuelle est questionnable'
      });
    }

    if (scores.data_corroboration < 50) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'Corroborer avec sources indépendantes',
        details: 'Information basée sur source unique - Risque élevé'
      });
    }

    if (scores.temporal_consistency < 50) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Vérifier chronologie et cohérence temporelle',
        details: 'Incohérences temporelles détectées'
      });
    }

    if (scores.technical_verification < 50) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Effectuer analyse forensique approfondie',
        details: 'Vérifications techniques insuffisantes'
      });
    }

    if (scores.contextual_plausibility < 50) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Analyser cohérence contextuelle',
        details: 'Éléments contextuels suspects ou incohérents'
      });
    }

    if (overallScore < 60) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'NE PAS UTILISER comme preuve principale',
        details: 'Score global insuffisant pour utilisation judiciaire'
      });
    }

    if (overallScore >= 75 && recommendations.length === 0) {
      recommendations.push({
        priority: 'INFO',
        action: 'Information exploitable',
        details: 'Niveau de confiance suffisant pour investigation'
      });
    }

    return recommendations;
  }

  hasSourceDiversity(sources) {
    const sourceTypes = new Set(sources.map(s => s.type));
    return sourceTypes.size >= 3;
  }

  calculateDataAge(timestamp) {
    if (!timestamp) return 999;
    
    const now = new Date();
    const dataDate = new Date(timestamp);
    const diffTime = Math.abs(now - dataDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  detectTimelineAnomalies(events) {
    if (!events || events.length < 2) return false;

    for (let i = 1; i < events.length; i++) {
      const prev = new Date(events[i - 1].date);
      const curr = new Date(events[i].date);
      
      if (curr < prev) {
        return true;
      }
    }

    for (let i = 1; i < events.length; i++) {
      const timeDiff = Math.abs(new Date(events[i].date) - new Date(events[i - 1].date));
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 12 && events[i].location && events[i - 1].location) {
        const distance = this.calculateDistance(
          events[i - 1].location,
          events[i].location
        );

        if (distance > 5000 && !events[i].flight_documented) {
          return true;
        }
      }
    }

    return false;
  }

  isGeographicallyPlausible(dataPoint) {
    if (!dataPoint.geolocation || !dataPoint.expected_location) {
      return true;
    }

    const distance = this.calculateDistance(
      dataPoint.geolocation,
      dataPoint.expected_location
    );

    return distance < 500 || dataPoint.travel_justified;
  }

  isBehaviorallyConsistent(dataPoint) {
    if (!dataPoint.behavioral_pattern || !dataPoint.historical_behavior) {
      return true;
    }

    const currentActivity = dataPoint.behavioral_pattern.activity_type;
    const historicalActivities = dataPoint.historical_behavior.typical_activities || [];

    return historicalActivities.includes(currentActivity);
  }

  calculateDistance(loc1, loc2) {
    if (!loc1.lat || !loc1.lon || !loc2.lat || !loc2.lon) {
      return 0;
    }

    const R = 6371;
    const dLat = this.toRad(loc2.lat - loc1.lat);
    const dLon = this.toRad(loc2.lon - loc1.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(loc1.lat)) *
        Math.cos(this.toRad(loc2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  toRad(value) {
    return (value * Math.PI) / 180;
  }

  generateCredibilityReport(profile) {
    const dataPoints = [
      ...(profile.osint_footprint?.emails || []).map(e => ({ ...e, source_type: 'VERIFIED_SOCIAL_MEDIA' })),
      ...(profile.osint_footprint?.phone ? [{ ...profile.osint_footprint.phone, source_type: 'OFFICIAL_RECORDS' }] : []),
      ...(profile.osint_footprint?.images || []).map(i => ({ ...i, source_type: 'UNVERIFIED_SOCIAL_MEDIA' }))
    ];

    const scores = dataPoints.map(dp => this.calculateCredibilityScore(dp));

    const report = {
      profile_id: profile.id,
      generated_at: new Date().toISOString(),
      overall_credibility: this.calculateOverallCredibility(scores),
      data_quality_distribution: this.analyzeDataQualityDistribution(scores),
      red_flags: this.identifyRedFlags(scores, profile),
      verification_gaps: this.identifyVerificationGaps(scores),
      actionable_insights: this.generateActionableInsights(scores, profile)
    };

    return report;
  }

  calculateOverallCredibility(scores) {
    if (scores.length === 0) {
      return {
        score: 0,
        level: 'NO_DATA',
        reliability: 'Cannot assess'
      };
    }

    const avgScore = scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length;

    return {
      score: Math.round(avgScore),
      level: this.getConfidenceLevel(avgScore).level,
      reliability: this.getConfidenceLevel(avgScore).description,
      data_points_analyzed: scores.length
    };
  }

  analyzeDataQualityDistribution(scores) {
    const distribution = {
      VERIFIED: 0,
      HIGH_CONFIDENCE: 0,
      MEDIUM_CONFIDENCE: 0,
      LOW_CONFIDENCE: 0,
      UNVERIFIED: 0
    };

    scores.forEach(s => {
      distribution[s.confidence_level.level]++;
    });

    return {
      counts: distribution,
      percentages: Object.fromEntries(
        Object.entries(distribution).map(([k, v]) => [k, ((v / scores.length) * 100).toFixed(1) + '%'])
      )
    };
  }

  identifyRedFlags(scores, profile) {
    const redFlags = [];

    const avgScore = scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length;
    if (avgScore < 50) {
      redFlags.push({
        severity: 'CRITICAL',
        flag: 'LOW_OVERALL_CREDIBILITY',
        description: `Score moyen de ${Math.round(avgScore)}/100 - Enquête nécessite refonte méthodologique`
      });
    }

    const unverifiedCount = scores.filter(s => s.overall_score < 40).length;
    if (unverifiedCount / scores.length > 0.5) {
      redFlags.push({
        severity: 'HIGH',
        flag: 'MAJORITY_UNVERIFIED_DATA',
        description: `${((unverifiedCount / scores.length) * 100).toFixed(0)}% des données non vérifiées`
      });
    }

    return redFlags;
  }

  identifyVerificationGaps(scores) {
    const gaps = [];

    scores.forEach((s, idx) => {
      Object.entries(s.breakdown).forEach(([factor, score]) => {
        if (score < 50) {
          gaps.push({
            data_point_index: idx,
            factor: factor,
            current_score: score,
            improvement_needed: 60 - score,
            priority: score < 30 ? 'HIGH' : 'MEDIUM'
          });
        }
      });
    });

    gaps.sort((a, b) => {
      if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
      if (a.priority !== 'HIGH' && b.priority === 'HIGH') return 1;
      return b.improvement_needed - a.improvement_needed;
    });

    return gaps.slice(0, 10);
  }

  generateActionableInsights(scores, profile) {
    const insights = [];

    const avgScore = scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length;

    if (avgScore >= 75) {
      insights.push({
        type: 'POSITIVE',
        insight: 'Données exploitables pour poursuite investigation',
        action: 'Continuer collecte et approfondir analyses techniques'
      });
    } else if (avgScore >= 60) {
      insights.push({
        type: 'CAUTION',
        insight: 'Données nécessitent renforcement avant exploitation légale',
        action: 'Prioriser corroboration par sources indépendantes'
      });
    } else {
      insights.push({
        type: 'WARNING',
        insight: 'Fiabilité globale insuffisante - Risque d\'erreur élevé',
        action: 'Revoir méthodologie et sources primaires'
      });
    }

    return insights;
  }
}

// Initialiser système de scoring
const AURACredibility = new AURACredibilityScoring();
window.AURACredibility = AURACredibility;

console.log('🎯 AURA Credibility Scoring System initialisé');