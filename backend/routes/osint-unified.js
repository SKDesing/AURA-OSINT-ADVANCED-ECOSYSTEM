const express = require('express');
const { z } = require('zod');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuration des outils OSINT avec leurs wrappers Python
const OSINT_TOOLS = {
  // 📱 Phone Intelligence
  'phoneinfoga': {
    name: 'PhoneInfoga',
    category: 'phone',
    description: 'OSINT téléphonique avancé',
    script: 'phone/phoneinfoga.py',
    params: ['phone_number'],
    execution_time: '5-15s'
  },
  'phonenumbers': {
    name: 'PhoneNumbers',
    category: 'phone', 
    description: 'Validation et lookup opérateur',
    script: 'phone/phonenumbers.py',
    params: ['phone_number'],
    execution_time: '0.1-0.5s'
  },

  // 🧅 Darknet & Security
  'onionscan': {
    name: 'OnionScan',
    category: 'darknet',
    description: 'Scanner vulnérabilités services Tor',
    script: 'darknet/onionscan.py',
    params: ['onion_url'],
    execution_time: '30-120s'
  },
  'torbot': {
    name: 'TorBot',
    category: 'darknet',
    description: 'Crawler intelligence dark web',
    script: 'darknet/torbot.py',
    params: ['onion_url', 'depth'],
    execution_time: '20-90s'
  },

  // 👤 Username Intelligence
  'sherlock': {
    name: 'Sherlock',
    category: 'username',
    description: 'Recherche username sur 400+ sites',
    script: 'username/sherlock.py',
    params: ['username'],
    execution_time: '15-45s'
  },
  'maigret': {
    name: 'Maigret',
    category: 'username',
    description: 'Intelligence username avancée (2000+ sites)',
    script: 'username/maigret.py',
    params: ['username'],
    execution_time: '30-120s'
  },

  // 🌐 Network Intelligence
  'shodan': {
    name: 'Shodan',
    category: 'network',
    description: 'Reconnaissance réseau et vulnérabilités',
    script: 'network/shodan.py',
    params: ['ip_address', 'query'],
    execution_time: '2-10s'
  },
  'ip_intelligence': {
    name: 'IP Intelligence',
    category: 'network',
    description: 'Intelligence géolocalisation IP',
    script: 'network/ip_intelligence.py',
    params: ['ip_address'],
    execution_time: '1-3s'
  },
  'port_scanner': {
    name: 'Port Scanner',
    category: 'network',
    description: 'Scan ports et services',
    script: 'network/port_scanner.py',
    params: ['target', 'ports'],
    execution_time: '5-30s'
  },
  'ssl_analyzer': {
    name: 'SSL Analyzer',
    category: 'network',
    description: 'Analyse certificats SSL',
    script: 'network/ssl_analyzer.py',
    params: ['domain'],
    execution_time: '2-8s'
  },
  'network_mapper': {
    name: 'Network Mapper',
    category: 'network',
    description: 'Cartographie réseau',
    script: 'network/network_mapper.py',
    params: ['target_range'],
    execution_time: '10-60s'
  },

  // 📧 Email Intelligence
  'holehe': {
    name: 'Holehe',
    category: 'email',
    description: 'Vérification email sur 120+ sites',
    script: 'email/holehe.py',
    params: ['email'],
    execution_time: '10-30s'
  },

  // 💥 Breach Intelligence
  'h8mail': {
    name: 'H8Mail',
    category: 'breach',
    description: 'Recherche dans fuites de données',
    script: 'breach/h8mail.py',
    params: ['email'],
    execution_time: '5-20s'
  },

  // 🌍 Domain Intelligence
  'subfinder': {
    name: 'Subfinder',
    category: 'domain',
    description: 'Énumération passive sous-domaines',
    script: 'domain/subfinder.py',
    params: ['domain'],
    execution_time: '10-60s'
  },
  'whois': {
    name: 'Whois',
    category: 'domain',
    description: 'Informations domaine et DNS',
    script: 'domain/whois.py',
    params: ['domain'],
    execution_time: '1-5s'
  },

  // 📱 Social Intelligence
  'twitter': {
    name: 'Twitter Tool',
    category: 'social',
    description: 'Analyse profils et réseaux Twitter',
    script: 'social/twitter.py',
    params: ['username', 'user_id'],
    execution_time: '10-30s'
  },
  'instagram': {
    name: 'Instagram Tool',
    category: 'social',
    description: 'Analyse contenu Instagram',
    script: 'social/instagram.py',
    params: ['username'],
    execution_time: '15-45s'
  },

  // 🖼️ Image Intelligence
  'exifread': {
    name: 'ExifRead',
    category: 'image',
    description: 'Extraction métadonnées avec GPS',
    script: 'image/exifread.py',
    params: ['image_path'],
    execution_time: '0.5-2s'
  },

  // 💰 Crypto Intelligence
  'blockchain': {
    name: 'Blockchain Tool',
    category: 'crypto',
    description: 'Analyse adresses crypto',
    script: 'crypto/blockchain.py',
    params: ['address', 'currency'],
    execution_time: '3-15s'
  }
};

// Schémas de validation
const investigationSchema = z.object({
  target: z.string().min(1),
  target_type: z.enum(['email', 'username', 'domain', 'ip', 'phone', 'onion_url', 'image', 'crypto_address']),
  tools: z.array(z.string()).optional(),
  options: z.record(z.any()).optional()
});

const toolExecutionSchema = z.object({
  tool_id: z.string().min(1),
  parameters: z.record(z.any())
});

// GET /api/osint/tools - Liste tous les outils disponibles
router.get('/tools', (req, res) => {
  try {
    const toolsList = Object.entries(OSINT_TOOLS).map(([id, tool]) => ({
      id,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      parameters: tool.params,
      execution_time: tool.execution_time
    }));

    const categorized = toolsList.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {});

    res.json({
      success: true,
      total_tools: toolsList.length,
      available: toolsList,
      categorized: categorized,
      categories: Object.keys(categorized)
    });
  } catch (error) {
    console.error('Erreur récupération outils:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des outils' 
    });
  }
});

// GET /api/osint/tools/:category - Outils par catégorie
router.get('/tools/:category', (req, res) => {
  try {
    const { category } = req.params;
    const categoryTools = Object.entries(OSINT_TOOLS)
      .filter(([id, tool]) => tool.category === category)
      .map(([id, tool]) => ({
        id,
        name: tool.name,
        description: tool.description,
        parameters: tool.params,
        execution_time: tool.execution_time
      }));

    if (categoryTools.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Aucun outil trouvé pour la catégorie: ${category}`
      });
    }

    res.json({
      success: true,
      category: category,
      tools: categoryTools,
      count: categoryTools.length
    });
  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération de la catégorie' 
    });
  }
});

// POST /api/osint/execute/:tool_id - Exécuter un outil spécifique
router.post('/execute/:tool_id', async (req, res) => {
  try {
    const { tool_id } = req.params;
    const { parameters } = toolExecutionSchema.parse(req.body);

    const tool = OSINT_TOOLS[tool_id];
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: `Outil non trouvé: ${tool_id}`
      });
    }

    // Générer un ID d'exécution unique
    const execution_id = `${tool_id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Démarrer l'exécution
    const startTime = Date.now();
    
    res.json({
      success: true,
      execution_id: execution_id,
      tool: tool.name,
      status: 'started',
      estimated_time: tool.execution_time,
      timestamp: new Date().toISOString()
    });

    // Exécuter l'outil en arrière-plan (simulation pour l'instant)
    setTimeout(() => {
      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000;
      
      // Ici on pourrait stocker les résultats en base de données
      console.log(`✅ Outil ${tool.name} terminé en ${executionTime}s`);
    }, Math.random() * 10000 + 2000); // 2-12 secondes de simulation

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Paramètres invalides', 
        details: error.errors 
      });
    }
    console.error('Erreur exécution outil:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'exécution de l\'outil' 
    });
  }
});

// POST /api/osint/investigate - Lancer une investigation complète
router.post('/investigate', async (req, res) => {
  try {
    const { target, target_type, tools, options } = investigationSchema.parse(req.body);

    // Sélection automatique des outils si non spécifiés
    let selectedTools = tools;
    if (!selectedTools || selectedTools.length === 0) {
      selectedTools = selectToolsForTarget(target_type);
    }

    // Valider que tous les outils existent
    const invalidTools = selectedTools.filter(toolId => !OSINT_TOOLS[toolId]);
    if (invalidTools.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Outils invalides: ${invalidTools.join(', ')}`
      });
    }

    // Générer un ID d'investigation unique
    const investigation_id = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Préparer la réponse
    const investigation = {
      investigation_id: investigation_id,
      target: target,
      target_type: target_type,
      tools_selected: selectedTools.map(toolId => ({
        id: toolId,
        name: OSINT_TOOLS[toolId].name,
        category: OSINT_TOOLS[toolId].category,
        estimated_time: OSINT_TOOLS[toolId].execution_time
      })),
      status: 'started',
      created_at: new Date().toISOString(),
      estimated_completion: calculateEstimatedCompletion(selectedTools)
    };

    res.json({
      success: true,
      investigation: investigation
    });

    // Lancer l'exécution des outils en arrière-plan
    executeInvestigation(investigation_id, target, selectedTools, options || {});

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Paramètres d\'investigation invalides', 
        details: error.errors 
      });
    }
    console.error('Erreur lancement investigation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors du lancement de l\'investigation' 
    });
  }
});

// GET /api/osint/investigations/:id - Statut d'une investigation
router.get('/investigations/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Récupérer depuis la base de données
    // Pour l'instant, simulation
    res.json({
      success: true,
      investigation: {
        investigation_id: id,
        status: 'completed',
        progress: 100,
        tools_completed: 5,
        tools_total: 5,
        results_count: 47,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur récupération investigation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération de l\'investigation' 
    });
  }
});

// GET /api/osint/results/:investigation_id - Résultats d'une investigation
router.get('/results/:investigation_id', (req, res) => {
  try {
    const { investigation_id } = req.params;
    
    // TODO: Récupérer les vrais résultats depuis la base de données
    // Simulation pour l'instant
    const mockResults = {
      investigation_id: investigation_id,
      status: 'completed',
      summary: {
        total_findings: 47,
        high_confidence: 32,
        medium_confidence: 12,
        low_confidence: 3,
        execution_time: '2m 34s'
      },
      results_by_tool: [
        {
          tool: 'sherlock',
          status: 'completed',
          findings: 15,
          confidence_score: 85,
          data: {
            profiles_found: ['twitter.com/target', 'github.com/target', 'instagram.com/target']
          }
        },
        {
          tool: 'holehe',
          status: 'completed', 
          findings: 8,
          confidence_score: 92,
          data: {
            registered_sites: ['netflix.com', 'spotify.com', 'adobe.com']
          }
        }
      ],
      metadata: {
        started_at: new Date(Date.now() - 154000).toISOString(),
        completed_at: new Date().toISOString(),
        tools_used: ['sherlock', 'holehe', 'phoneinfoga']
      }
    };

    res.json({
      success: true,
      results: mockResults
    });
  } catch (error) {
    console.error('Erreur récupération résultats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des résultats' 
    });
  }
});

// Fonctions utilitaires
function selectToolsForTarget(targetType) {
  const toolMapping = {
    'email': ['holehe', 'h8mail'],
    'username': ['sherlock', 'maigret', 'twitter', 'instagram'],
    'domain': ['subfinder', 'whois', 'ssl_analyzer'],
    'ip': ['shodan', 'ip_intelligence', 'port_scanner'],
    'phone': ['phoneinfoga', 'phonenumbers'],
    'onion_url': ['onionscan', 'torbot'],
    'image': ['exifread'],
    'crypto_address': ['blockchain']
  };
  
  return toolMapping[targetType] || ['sherlock', 'holehe'];
}

function calculateEstimatedCompletion(toolIds) {
  const totalSeconds = toolIds.reduce((sum, toolId) => {
    const tool = OSINT_TOOLS[toolId];
    if (!tool) return sum;
    
    // Extraire le temps moyen depuis la chaîne "X-Ys"
    const timeStr = tool.execution_time;
    const match = timeStr.match(/(\d+)-(\d+)s/);
    if (match) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      return sum + (min + max) / 2;
    }
    return sum + 15; // Défaut 15s
  }, 0);
  
  const completionTime = new Date(Date.now() + totalSeconds * 1000);
  return completionTime.toISOString();
}

async function executeInvestigation(investigationId, target, toolIds, options) {
  console.log(`🚀 Démarrage investigation ${investigationId} pour cible: ${target}`);
  
  for (const toolId of toolIds) {
    const tool = OSINT_TOOLS[toolId];
    if (!tool) continue;
    
    console.log(`⚡ Exécution ${tool.name}...`);
    
    // Simulation d'exécution
    const executionTime = Math.random() * 10000 + 2000; // 2-12s
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    console.log(`✅ ${tool.name} terminé`);
  }
  
  console.log(`🎯 Investigation ${investigationId} terminée`);
}

module.exports = router;