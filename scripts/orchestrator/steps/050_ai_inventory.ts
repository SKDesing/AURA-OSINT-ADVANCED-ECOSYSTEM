import fs from 'fs';
import path from 'path';

import { Step } from '../types';

export const aiInventoryStep: Step = {
  id: '050_ai_inventory',
  title: 'AI Components Inventory',
  description: 'Inventory existing AI components and prepare migration',
  order: 50,
  
  verify: async () => {
    // Check if inventory document exists
    if (!fs.existsSync('docs/ai/INVENTAIRE-IA.md')) {
      return { success: false, message: 'AI inventory document missing' };
    }
    
    // Check if legacy harassment detector exists
    if (!fs.existsSync('ai/models/harassment-detector.js')) {
      return { success: false, message: 'Legacy harassment detector not found' };
    }
    
    return { success: true, message: 'AI inventory completed' };
  },
  
  run: async () => {
    console.log('📋 Creating AI components inventory...');
    
    const inventory = {
      engines: [],
      models: [],
      services: [],
      datasets: [],
      configs: []
    };
    
    // Scan for AI components
    const aiPaths = [
      'ai/models',
      'ai/engines', 
      'backend/ml',
      'algorithms'
    ];
    
    for (const aiPath of aiPaths) {
      if (fs.existsSync(aiPath)) {
        const files = fs.readdirSync(aiPath, { recursive: true });
        files.forEach(file => {
          const fullPath = path.join(aiPath, file.toString());
          if (fs.statSync(fullPath).isFile()) {
            const ext = path.extname(file.toString());
            if (['.js', '.ts', '.py', '.json'].includes(ext)) {
              inventory.engines.push({
                path: fullPath,
                type: ext.slice(1),
                size: fs.statSync(fullPath).size
              });
            }
          }
        });
      }
    }
    
    // Create inventory report
    const inventoryReport = `# 📋 INVENTAIRE IA - ÉTAT INITIAL

## **COMPOSANTS DÉTECTÉS**

### **Engines Existants**
${inventory.engines.map(e => `- \`${e.path}\` (${e.type}, ${e.size} bytes)`).join('\n')}

### **État Actuel**
- **Harassment Detection**: Monolithique dans \`ai/models/harassment-detector.js\`
- **Architecture**: Non modulaire, pas de contrats unifiés
- **Tests**: Absents ou incomplets
- **Versioning**: Aucun système de version

### **Actions Requises**
1. Refactor harassment engine → structure modulaire
2. Créer contrats JSON unifiés
3. Ajouter tests avec dataset
4. Implémenter versioning engines
5. Préparer gateway IA

### **Prochaines Étapes**
- Migration vers \`ai/engines/harassment/\`
- Création wrapper contrat unifié
- Tests baseline avec métriques

---
*Généré automatiquement le ${new Date().toISOString()}*`;
    
    // Ensure docs/ai directory exists
    if (!fs.existsSync('docs/ai')) {
      fs.mkdirSync('docs/ai', { recursive: true });
    }
    
    fs.writeFileSync('docs/ai/INVENTAIRE-IA.md', inventoryReport);
    
    return { 
      success: true, 
      message: `AI inventory created: ${inventory.engines.length} components found`,
      data: inventory
    };
  }
};