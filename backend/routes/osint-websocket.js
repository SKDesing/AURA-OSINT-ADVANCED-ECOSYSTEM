const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

class OSINTWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.activeInvestigations = new Map();
    this.clients = new Set();
    
    this.wss.on('connection', (ws) => {
      this.handleConnection(ws);
    });
  }

  handleConnection(ws) {
    console.log('🔌 Nouveau client WebSocket connecté');
    this.clients.add(ws);

    // Message de bienvenue
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connexion établie avec AURA OSINT WebSocket',
      timestamp: new Date().toISOString(),
      available_tools: 17
    }));

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        await this.handleMessage(ws, data);
      } catch (error) {
        console.error('Erreur traitement message WebSocket:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Erreur de traitement du message',
          error: error.message
        }));
      }
    });

    ws.on('close', () => {
      console.log('🔌 Client WebSocket déconnecté');
      this.clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('Erreur WebSocket:', error);
      this.clients.delete(ws);
    });
  }

  async handleMessage(ws, data) {
    switch (data.type) {
      case 'start_investigation':
        await this.startInvestigation(ws, data);
        break;
      
      case 'execute_tool':
        await this.executeTool(ws, data);
        break;
      
      case 'get_investigation_status':
        await this.getInvestigationStatus(ws, data);
        break;
      
      case 'stop_investigation':
        await this.stopInvestigation(ws, data);
        break;
      
      case 'chat':
        await this.handleChat(ws, data);
        break;
      
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: `Type de message non supporté: ${data.type}`
        }));
    }
  }

  async startInvestigation(ws, data) {
    const { target, target_type, tools, options } = data;
    const investigation_id = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Stocker l'investigation active
    this.activeInvestigations.set(investigation_id, {
      id: investigation_id,
      target,
      target_type,
      tools: tools || this.selectDefaultTools(target_type),
      status: 'running',
      progress: 0,
      results: [],
      started_at: new Date().toISOString(),
      client: ws
    });

    // Confirmer le démarrage
    ws.send(JSON.stringify({
      type: 'investigation_started',
      investigation_id: investigation_id,
      target: target,
      tools_selected: this.activeInvestigations.get(investigation_id).tools,
      timestamp: new Date().toISOString()
    }));

    // Lancer l'exécution
    this.executeInvestigationTools(investigation_id);
  }

  async executeInvestigationTools(investigation_id) {
    const investigation = this.activeInvestigations.get(investigation_id);
    if (!investigation) return;

    const { tools, target, client } = investigation;
    const totalTools = tools.length;

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      // Notifier le début d'exécution de l'outil
      client.send(JSON.stringify({
        type: 'tool_started',
        investigation_id: investigation_id,
        tool: tool,
        progress: Math.round((i / totalTools) * 100),
        timestamp: new Date().toISOString()
      }));

      try {
        // Exécuter l'outil
        const result = await this.runTool(tool, target);
        
        // Stocker le résultat
        investigation.results.push(result);
        investigation.progress = Math.round(((i + 1) / totalTools) * 100);

        // Notifier la completion de l'outil
        client.send(JSON.stringify({
          type: 'tool_completed',
          investigation_id: investigation_id,
          tool: tool,
          result: result,
          progress: investigation.progress,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        console.error(`Erreur exécution outil ${tool}:`, error);
        
        // Notifier l'erreur
        client.send(JSON.stringify({
          type: 'tool_error',
          investigation_id: investigation_id,
          tool: tool,
          error: error.message,
          progress: investigation.progress,
          timestamp: new Date().toISOString()
        }));
      }

      // Pause entre les outils
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Investigation terminée
    investigation.status = 'completed';
    investigation.completed_at = new Date().toISOString();

    client.send(JSON.stringify({
      type: 'investigation_completed',
      investigation_id: investigation_id,
      results: investigation.results,
      summary: {
        total_tools: totalTools,
        successful_tools: investigation.results.filter(r => r.status === 'success').length,
        total_findings: investigation.results.reduce((sum, r) => sum + (r.findings_count || 0), 0),
        execution_time: this.calculateExecutionTime(investigation.started_at)
      },
      timestamp: new Date().toISOString()
    }));
  }

  async runTool(toolName, target) {
    // Simulation d'exécution d'outil avec données réalistes
    const toolConfigs = {
      'sherlock': {
        execution_time: [15000, 45000],
        findings_range: [5, 25],
        confidence_range: [75, 95]
      },
      'maigret': {
        execution_time: [30000, 120000],
        findings_range: [10, 50],
        confidence_range: [80, 98]
      },
      'phoneinfoga': {
        execution_time: [5000, 15000],
        findings_range: [3, 8],
        confidence_range: [85, 95]
      },
      'holehe': {
        execution_time: [10000, 30000],
        findings_range: [5, 15],
        confidence_range: [90, 98]
      },
      'onionscan': {
        execution_time: [30000, 120000],
        findings_range: [2, 12],
        confidence_range: [70, 90]
      }
    };

    const config = toolConfigs[toolName] || {
      execution_time: [5000, 20000],
      findings_range: [1, 10],
      confidence_range: [70, 90]
    };

    // Simuler le temps d'exécution
    const executionTime = Math.random() * (config.execution_time[1] - config.execution_time[0]) + config.execution_time[0];
    await new Promise(resolve => setTimeout(resolve, executionTime));

    // Générer des résultats simulés
    const findingsCount = Math.floor(Math.random() * (config.findings_range[1] - config.findings_range[0]) + config.findings_range[0]);
    const confidence = Math.floor(Math.random() * (config.confidence_range[1] - config.confidence_range[0]) + config.confidence_range[0]);

    return {
      tool: toolName,
      status: 'success',
      execution_time: Math.round(executionTime),
      findings_count: findingsCount,
      confidence_score: confidence,
      data: this.generateMockFindings(toolName, target, findingsCount),
      timestamp: new Date().toISOString()
    };
  }

  generateMockFindings(toolName, target, count) {
    const mockData = {
      'sherlock': () => ({
        profiles_found: Array.from({length: count}, (_, i) => ({
          platform: ['Twitter', 'GitHub', 'Instagram', 'Facebook', 'LinkedIn'][i % 5],
          url: `https://example${i}.com/${target}`,
          confidence: Math.floor(Math.random() * 30 + 70)
        }))
      }),
      'phoneinfoga': () => ({
        number_info: {
          valid: true,
          country: 'FR',
          carrier: 'Orange France',
          line_type: 'mobile',
          location: 'Paris, Île-de-France'
        },
        google_results: count
      }),
      'holehe': () => ({
        registered_sites: Array.from({length: count}, (_, i) => 
          ['Netflix', 'Spotify', 'Adobe', 'Amazon', 'PayPal'][i % 5]
        )
      }),
      'onionscan': () => ({
        vulnerabilities: Array.from({length: count}, (_, i) => ({
          type: ['Apache ModStatus', 'SSH', 'FTP', 'Database'][i % 4],
          severity: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
        }))
      })
    };

    return mockData[toolName] ? mockData[toolName]() : { findings: count };
  }

  async executeTool(ws, data) {
    const { tool, parameters } = data;
    const execution_id = `EXEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    ws.send(JSON.stringify({
      type: 'tool_execution_started',
      execution_id: execution_id,
      tool: tool,
      timestamp: new Date().toISOString()
    }));

    try {
      const result = await this.runTool(tool, parameters.target || 'unknown');
      
      ws.send(JSON.stringify({
        type: 'tool_execution_completed',
        execution_id: execution_id,
        tool: tool,
        result: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'tool_execution_error',
        execution_id: execution_id,
        tool: tool,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  async getInvestigationStatus(ws, data) {
    const { investigation_id } = data;
    const investigation = this.activeInvestigations.get(investigation_id);

    if (!investigation) {
      ws.send(JSON.stringify({
        type: 'investigation_not_found',
        investigation_id: investigation_id,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'investigation_status',
      investigation: {
        id: investigation.id,
        target: investigation.target,
        status: investigation.status,
        progress: investigation.progress,
        tools_total: investigation.tools.length,
        tools_completed: investigation.results.length,
        started_at: investigation.started_at
      },
      timestamp: new Date().toISOString()
    }));
  }

  async stopInvestigation(ws, data) {
    const { investigation_id } = data;
    const investigation = this.activeInvestigations.get(investigation_id);

    if (investigation) {
      investigation.status = 'stopped';
      this.activeInvestigations.delete(investigation_id);

      ws.send(JSON.stringify({
        type: 'investigation_stopped',
        investigation_id: investigation_id,
        timestamp: new Date().toISOString()
      }));
    }
  }

  async handleChat(ws, data) {
    const { message } = data;
    
    // Analyser le message pour détecter les intentions OSINT
    const analysis = this.analyzeChatMessage(message);
    
    ws.send(JSON.stringify({
      type: 'chat_response',
      message: analysis.response,
      suggested_tools: analysis.tools,
      suggested_target_type: analysis.target_type,
      timestamp: new Date().toISOString()
    }));
  }

  analyzeChatMessage(message) {
    const msg = message.toLowerCase();
    
    // Détection d'email
    if (msg.includes('@') && msg.includes('.')) {
      return {
        response: 'Je détecte une adresse email. Je peux utiliser Holehe pour vérifier les comptes associés et H8Mail pour chercher dans les fuites de données.',
        tools: ['holehe', 'h8mail'],
        target_type: 'email'
      };
    }
    
    // Détection de numéro de téléphone
    if (msg.includes('+') || msg.match(/\d{10,}/)) {
      return {
        response: 'Je détecte un numéro de téléphone. PhoneInfoga peut fournir des informations détaillées sur ce numéro.',
        tools: ['phoneinfoga', 'phonenumbers'],
        target_type: 'phone'
      };
    }
    
    // Détection de domaine
    if (msg.includes('.com') || msg.includes('.org') || msg.includes('domaine')) {
      return {
        response: 'Je peux analyser ce domaine avec Subfinder pour les sous-domaines et Whois pour les informations d\'enregistrement.',
        tools: ['subfinder', 'whois', 'ssl_analyzer'],
        target_type: 'domain'
      };
    }
    
    // Détection d'username
    if (msg.includes('username') || msg.includes('pseudo') || msg.includes('utilisateur')) {
      return {
        response: 'Pour rechercher un nom d\'utilisateur, je recommande Sherlock (400+ sites) et Maigret (2000+ sites) pour une couverture maximale.',
        tools: ['sherlock', 'maigret'],
        target_type: 'username'
      };
    }
    
    // Détection darknet
    if (msg.includes('.onion') || msg.includes('tor') || msg.includes('darknet')) {
      return {
        response: 'Pour l\'analyse du dark web, j\'utilise OnionScan pour détecter les vulnérabilités et TorBot pour le crawling.',
        tools: ['onionscan', 'torbot'],
        target_type: 'onion_url'
      };
    }
    
    return {
      response: 'Je peux vous aider avec diverses investigations OSINT. Spécifiez votre cible (email, username, domaine, IP, téléphone) pour des recommandations personnalisées.',
      tools: ['sherlock', 'holehe'],
      target_type: 'general'
    };
  }

  selectDefaultTools(targetType) {
    const defaultTools = {
      'email': ['holehe', 'h8mail'],
      'username': ['sherlock', 'maigret'],
      'domain': ['subfinder', 'whois'],
      'ip': ['shodan', 'ip_intelligence'],
      'phone': ['phoneinfoga', 'phonenumbers'],
      'onion_url': ['onionscan', 'torbot'],
      'image': ['exifread'],
      'crypto_address': ['blockchain']
    };
    
    return defaultTools[targetType] || ['sherlock', 'holehe'];
  }

  calculateExecutionTime(startTime) {
    const start = new Date(startTime);
    const end = new Date();
    const diffMs = end - start;
    const diffSec = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;
    return `${minutes}m ${seconds}s`;
  }

  // Méthode pour broadcaster à tous les clients
  broadcast(message) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Nettoyage des investigations anciennes
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [id, investigation] of this.activeInvestigations.entries()) {
      const age = now - new Date(investigation.started_at).getTime();
      if (age > maxAge) {
        this.activeInvestigations.delete(id);
        console.log(`🧹 Investigation ${id} nettoyée (ancienne)`);
      }
    }
  }
}

module.exports = OSINTWebSocketServer;