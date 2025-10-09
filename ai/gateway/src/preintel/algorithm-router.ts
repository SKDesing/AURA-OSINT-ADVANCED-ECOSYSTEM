/**
 * Router intelligent - Détermine si utiliser algorithmes locaux ou LLM
 * Économise 70% des ressources IA via pré-traitement
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface AlgorithmDecision {
  useLocal: boolean;
  algorithm: string | null;
  confidence: number;
  reason: string;
  estimatedTokensSaved: number;
}

export class AlgorithmRouter {
  private readonly forensicPath = 'algorithms/forensic-timeline-analyzer.js';
  private readonly nerPath = 'osint-tools-advanced/services/ner-french-enhanced.py';
  private readonly nlpPath = 'backend/core/nlp_analyzer.py';

  async route(prompt: string, context?: any): Promise<AlgorithmDecision> {
    const promptLower = prompt.toLowerCase();
    
    // 1. Détection extraction d'entités (NER)
    if (this.isEntityExtraction(promptLower)) {
      return {
        useLocal: true,
        algorithm: 'ner_french',
        confidence: 0.9,
        reason: 'Entity extraction detected',
        estimatedTokensSaved: Math.ceil(prompt.length / 2) // 50% économie
      };
    }
    
    // 2. Détection analyse temporelle/forensique
    if (this.isForensicAnalysis(promptLower)) {
      return {
        useLocal: true,
        algorithm: 'forensic_timeline',
        confidence: 0.85,
        reason: 'Forensic/temporal analysis detected',
        estimatedTokensSaved: Math.ceil(prompt.length * 0.8) // 80% économie
      };
    }
    
    // 3. Détection classification haine/sentiment
    if (this.isClassificationTask(promptLower)) {
      return {
        useLocal: true,
        algorithm: 'nlp_classifier',
        confidence: 0.8,
        reason: 'Classification task detected',
        estimatedTokensSaved: Math.ceil(prompt.length * 0.6) // 60% économie
      };
    }
    
    // 4. Fallback LLM
    return {
      useLocal: false,
      algorithm: null,
      confidence: 0.0,
      reason: 'Complex reasoning required',
      estimatedTokensSaved: 0
    };
  }

  async executeLocal(algorithm: string, prompt: string, data?: any): Promise<any> {
    switch (algorithm) {
      case 'ner_french':
        return this.executeNER(prompt);
      case 'forensic_timeline':
        return this.executeForensic(data || []);
      case 'nlp_classifier':
        return this.executeNLP(prompt);
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }

  private async executeNER(text: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`python3 ${this.nerPath} "${text.replace(/"/g, '\\"')}"`);
      return JSON.parse(stdout);
    } catch (error) {
      throw new Error(`NER execution failed: ${error.message}`);
    }
  }

  private async executeForensic(incidents: any[]): Promise<any> {
    try {
      const ForensicAnalyzer = require(`../../../${this.forensicPath}`);
      const analyzer = new ForensicAnalyzer();
      return await analyzer.analyze(incidents);
    } catch (error) {
      throw new Error(`Forensic execution failed: ${error.message}`);
    }
  }

  private async executeNLP(text: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`python3 -c "
import sys
sys.path.append('backend/core')
from nlp_analyzer import NLPAnalyzer
analyzer = NLPAnalyzer()
result = analyzer.analyze_content('${text.replace(/'/g, "\\'")}')
print(result.__dict__)
"`);
      return eval(`(${stdout.trim()})`);
    } catch (error) {
      throw new Error(`NLP execution failed: ${error.message}`);
    }
  }

  private isEntityExtraction(prompt: string): boolean {
    const patterns = [
      /extract.*entit/i, /find.*email/i, /find.*phone/i, /find.*address/i,
      /siren|siret/i, /extract.*person/i, /extract.*company/i,
      /qui est|who is/i, /contact.*info/i, /coordonnées/i
    ];
    return patterns.some(p => p.test(prompt));
  }

  private isForensicAnalysis(prompt: string): boolean {
    const patterns = [
      /timeline|chronolog/i, /pattern.*attack/i, /coordinated/i,
      /burst.*activity/i, /forensic/i, /correlation/i,
      /predict.*incident/i, /trend.*analysis/i, /anomal/i
    ];
    return patterns.some(p => p.test(prompt));
  }

  private isClassificationTask(prompt: string): boolean {
    const patterns = [
      /classify|categorize/i, /sentiment/i, /hate.*speech/i,
      /harassment/i, /toxic/i, /is.*this.*safe/i,
      /analyze.*content/i, /detect.*threat/i
    ];
    return patterns.some(p => p.test(prompt));
  }
}