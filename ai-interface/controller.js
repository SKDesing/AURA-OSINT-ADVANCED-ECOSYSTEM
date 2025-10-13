const ContextAnalyzer = require('./analyzer');
const DynamicQuestionnaire = require('./questionnaire');
const OsintOrchestrator = require('../orchestrator');
const prompts = require('./prompts');

class AIController {
  constructor() {
    this.analyzer = new ContextAnalyzer();
    this.orchestrator = new OsintOrchestrator();
    this.currentQuestionnaire = null;
  }

  async startInvestigation(userInput) {
    console.log(prompts.WELCOME);

    try {
      console.log('\n🔍 Analyse de votre requête...\n');
      const context = this.analyzer.analyzeRequest(userInput);
      
      console.log(`📋 Type détecté: ${context.type || 'Inconnu'}`);
      console.log(`🎯 Confiance: ${(context.confidence * 100).toFixed(0)}%`);
      
      if (Object.keys(context.availableData).length > 0) {
        console.log('📥 Données détectées:', context.availableData);
      }

      this.currentQuestionnaire = new DynamicQuestionnaire(context);
      const questions = this.currentQuestionnaire.generateQuestions();

      console.log(`\n❓ ${questions.length} question(s) à poser\n`);

      const investigationData = await this.simulateQuestionnaire(questions);

      if (!investigationData.confirmed) {
        console.log('\n❌ Investigation annulée');
        return { cancelled: true };
      }

      console.log('\n' + prompts.PROCESSING.replace('{tools}', 'Automatique'));
      
      const results = await this.orchestrator.investigate(investigationData.inputs);

      this.presentResults(results);

      return results;

    } catch (error) {
      console.error(prompts.ERROR.replace('{error}', error.message));
      return { success: false, error: error.message };
    }
  }

  async simulateQuestionnaire(questions) {
    const responses = {};

    for (const question of questions) {
      console.log(`\n${question.question}`);

      if (question.choices) {
        question.choices.forEach((choice, idx) => {
          console.log(`  ${idx + 1}) ${choice.label}`);
        });
      }

      if (question.id === 'investigation_type') {
        responses[question.id] = 'person';
        console.log('→ person (simulation)');
      } else if (question.id === 'confirm') {
        responses[question.id] = true;
        console.log('→ oui (simulation)');
      } else if (question.type === 'input') {
        console.log('→ (skip)');
      }
    }

    return this.currentQuestionnaire.compileInvestigationData();
  }

  presentResults(results) {
    console.log('\n' + '='.repeat(60));
    console.log('✅ INVESTIGATION TERMINÉE');
    console.log('='.repeat(60));

    console.log(`\n📊 Session: ${results.sessionId}`);
    console.log(`⏱️  Temps total: ${results.metadata?.executionTime || 0}ms`);
    console.log(`🔧 Outils utilisés: ${results.tools || 0}`);
    console.log(`✅ Succès: ${results.successCount}/${results.tools}`);

    if (results.results) {
      console.log('\n📋 Résultats par outil:\n');

      for (const [tool, result] of Object.entries(results.results)) {
        const icon = result.success ? '✅' : '❌';
        console.log(`${icon} ${tool}:`);

        if (result.success && result.output?.summary) {
          const summary = result.output.summary;
          console.log(`   Trouvés: ${summary.found || summary.total || 0}`);
          if (summary.executionTime) {
            console.log(`   Temps: ${summary.executionTime}ms`);
          }
        } else if (!result.success) {
          console.log(`   Erreur: ${result.error}`);
        }
        console.log();
      }
    }

    console.log('='.repeat(60));
  }
}

module.exports = AIController;
