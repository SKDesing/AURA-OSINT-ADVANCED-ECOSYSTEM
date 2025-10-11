import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QwenService {
  private readonly logger = new Logger(QwenService.name);
  private readonly apiUrl = process.env.QWEN_API_URL || 'http://localhost:8090';
  private readonly modelName = 'qwen2.5:latest';

  async generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      this.logger.log('Generating AI completion with mock Qwen...');
      
      // Utiliser le mock intelligent directement
      if (systemPrompt?.includes('JSON')) {
        return this.generateMockJsonResponse(prompt, systemPrompt);
      }
      
      return this.generateMockTextResponse(prompt);
    } catch (error) {
      this.logger.error('Qwen service error:', error.message);
      throw new Error('AI service unavailable');
    }
  }

  private generateMockJsonResponse(prompt: string, systemPrompt: string): string {
    // Intent parsing simulation
    if (systemPrompt.includes('intent')) {
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('tiktok') || lowerPrompt.includes('@')) {
        return JSON.stringify({
          type: 'profile',
          target: this.extractUsername(prompt),
          platforms: ['tiktok'],
          depth: 'standard'
        });
      }
      
      if (lowerPrompt.includes('.com') || lowerPrompt.includes('domain')) {
        return JSON.stringify({
          type: 'domain',
          target: this.extractDomain(prompt),
          platforms: [],
          depth: 'standard'
        });
      }
      
      return JSON.stringify({
        type: 'person',
        target: this.extractName(prompt),
        platforms: ['all'],
        depth: 'standard'
      });
    }
    
    // Investigation plan simulation
    if (systemPrompt.includes('plan')) {
      const intent = JSON.parse(prompt).intent;
      
      if (intent.type === 'profile') {
        return JSON.stringify({
          tools: [
            { name: 'tiktok-profile-analyzer', input: { username: intent.target }, priority: 1 },
            { name: 'sherlock', input: { username: intent.target }, priority: 1 },
            { name: 'instagram-profile-analyzer', input: { username: intent.target }, priority: 2 }
          ],
          estimatedTime: 180,
          strategy: 'Multi-platform profile correlation analysis'
        });
      }
      
      if (intent.type === 'domain') {
        return JSON.stringify({
          tools: [
            { name: 'sublist3r', input: { domain: intent.target }, priority: 1 },
            { name: 'theharvester', input: { domain: intent.target }, priority: 1 }
          ],
          estimatedTime: 120,
          strategy: 'Comprehensive domain reconnaissance'
        });
      }
    }
    
    return '{}';
  }

  private generateMockTextResponse(prompt: string): string {
    return `# 📊 Rapport d'Investigation OSINT

## 🎯 Synthèse Exécutive

L'investigation a révélé une **empreinte numérique significative** pour la cible analysée. Les données collectées montrent une activité régulière sur plusieurs plateformes sociales avec des patterns de comportement cohérents.

## 🔍 Découvertes Clés

### Comptes Sociaux Identifiés
- 🎵 **TikTok:** Profil actif avec engagement élevé
- 📸 **Instagram:** Compte vérifié avec contenu régulier
- 🐦 **Twitter:** Présence modérée, interactions professionnelles

### Informations Techniques
- 📧 **Email:** Partiellement exposé dans les métadonnées
- 🌐 **Domaines:** Plusieurs sous-domaines identifiés
- 📱 **Applications:** Présence sur 5+ plateformes

## ⚠️ Évaluation des Risques

**Score global:** 7/10 (Élevé)

### Risques Identifiés
1. 🔓 **Exposition des données personnelles**
2. 📸 **Métadonnées géolocalisées**
3. 🎯 **Surface d'attaque étendue**

## 💡 Recommandations

### Actions Immédiates
1. ✅ Audit des paramètres de confidentialité
2. ✅ Suppression des métadonnées sensibles
3. ✅ Activation de l'authentification 2FA

---

*Rapport généré par AURA AI Orchestrator*`;
  }

  private extractUsername(text: string): string {
    const match = text.match(/@(\w+)/);
    return match ? match[1] : 'unknown_user';
  }

  private extractDomain(text: string): string {
    const match = text.match(/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/);
    return match ? match[0] : 'example.com';
  }

  private extractName(text: string): string {
    const words = text.split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).join(' ') || 'John Doe';
  }
}