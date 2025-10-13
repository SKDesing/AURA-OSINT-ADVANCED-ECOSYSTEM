const EventEmitter = require('events');

// Configuration des outils
const TOOLS = {
  sherlock: {
    name: 'Sherlock',
    category: 'username',
    wrapper: require('../tools/wrappers/sherlock.wrapper'),
    enabled: true
  },
  subfinder: {
    name: 'Subfinder',
    category: 'domain',
    wrapper: require('../tools/wrappers/subfinder.wrapper'),
    enabled: true
  }
};

class OsintOrchestrator extends EventEmitter {
  constructor() {
    super();
  }

  async investigate(inputs) {
    const sessionId = `session_${Date.now()}`;
    console.log(`\n🚀 INVESTIGATION: ${sessionId}`);
    console.log(`📥 Inputs:`, inputs);

    const tools = this.selectTools(inputs);
    
    if (tools.length === 0) {
      return {
        sessionId,
        success: false,
        error: 'Aucun outil disponible'
      };
    }

    console.log(`🔀 Outils: ${tools.map(t => t.name).join(', ')}`);

    const results = {};
    let successCount = 0;

    for (const tool of tools) {
      try {
        console.log(`\n🔍 ${tool.name}...`);
        
        // Extraire input approprié selon catégorie
        let input;
        if (tool.category === 'username') {
          input = inputs.username;
        } else if (tool.category === 'domain') {
          input = { domain: inputs.domain };
        } else if (tool.category === 'email') {
          input = { email: inputs.email };
        }

        const result = await tool.wrapper.execute(input);
        
        results[tool.name] = result;
        
        if (result.success) {
          successCount++;
          const count = result.output?.summary?.found || result.output?.summary?.total || 0;
          console.log(`   ✅ ${tool.name}: ${count} résultats`);
        } else {
          console.log(`   ❌ ${tool.name}: ${result.error}`);
        }
      } catch (error) {
        results[tool.name] = {
          success: false,
          error: error.message
        };
        console.log(`   ❌ ${tool.name}: ${error.message}`);
      }
    }

    return {
      sessionId,
      tools: tools.length,
      success: `${successCount}/${tools.length}`,
      results,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };
  }

  selectTools(inputs) {
    const tools = [];

    if (inputs.username && TOOLS.sherlock.enabled) {
      tools.push(TOOLS.sherlock);
    }

    if (inputs.domain && TOOLS.subfinder.enabled) {
      tools.push(TOOLS.subfinder);
    }

    return tools;
  }
}

module.exports = OsintOrchestrator;
