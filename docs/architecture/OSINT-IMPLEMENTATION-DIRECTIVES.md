# Directives d'implémentation OSINT - AURA

**Objectif**: Règles strictes pour l'équipe sur l'intégration d'outils OSINT selon le standard filesystem.

## RÈGLES ABSOLUES

### ❌ INTERDICTIONS
- **JAMAIS cloner** d'outils tiers dans le repo principal
- **JAMAIS commit** de secrets/API keys (même en .env.example avec vraies valeurs)
- **JAMAIS installer** de binaires/executables dans le repo Git
- **JAMAIS exposer** directement les UIs des outils tiers au client final

### ✅ OBLIGATIONS
- **TOUJOURS utiliser Docker** pour l'exécution d'outils
- **TOUJOURS** placer les configs publiques dans `config/osint/<tool>/`
- **TOUJOURS** utiliser `var/osint/` pour les données runtime (gitignored)
- **TOUJOURS** créer un adapter TypeScript dans `packages/core/src/osint/adapters/`

## WORKFLOW D'INTÉGRATION

### 1. Analyse de l'outil
```bash
# Questions à se poser:
# - Image Docker officielle disponible ?
# - Peut fonctionner en mode éphémère ?
# - Quels volumes/configs nécessaires ?
# - APIs/formats de sortie ?
```

### 2. Création de l'adapter
```typescript
// packages/core/src/osint/adapters/example-tool.ts
export interface ExampleToolConfig {
  target: string;
  options?: Record<string, any>;
}

export interface ExampleToolResult {
  tool: 'example-tool';
  target: string;
  timestamp: string;
  data: any[];
}

export class ExampleToolAdapter {
  async run(config: ExampleToolConfig): Promise<ExampleToolResult> {
    // Implémentation Docker run
  }
}
```

### 3. Script runner
```bash
# scripts/osint/run-example-tool.sh
#!/usr/bin/env bash
set -euo pipefail

# Validation params
# Docker run avec volumes
# Parsing résultats
# Nettoyage
```

### 4. Tests d'intégration
```bash
# Tester le script
./scripts/osint/run-example-tool.sh test-target

# Tester l'adapter
npm test -- packages/core/src/osint/adapters/example-tool.test.ts
```

## GESTION DES SECRETS

### Secret Manager Integration
```typescript
// Récupération sécurisée
const apiKey = await secretManager.get('osint.shodan.apiKey');

// Injection runtime (jamais en logs)
const dockerCmd = `docker run -e API_KEY=${apiKey} ...`;
```

### Template de configuration
```json
// config/osint/example-tool/config.json
{
  "timeout": 300,
  "retries": 3,
  "outputFormat": "json",
  "apiKeyRequired": true
}
```

## STRUCTURE DE DONNÉES

### Normalisation des résultats
```typescript
interface OSINTEntity {
  type: 'domain' | 'ip' | 'email' | 'phone' | 'person' | 'file';
  value: string;
  confidence: number;
  source: string;
  metadata?: Record<string, any>;
}

interface OSINTResult {
  jobId: string;
  tool: string;
  target: string;
  timestamp: string;
  status: 'success' | 'error' | 'timeout';
  entities: OSINTEntity[];
  rawData?: any;
  error?: string;
}
```

## DOCKER BEST PRACTICES

### Images éphémères
```bash
# Bon: container détruit après usage
docker run --rm -v "$WORK_DIR:/data" tool:latest

# Mauvais: container persistant
docker run -d --name persistent-tool tool:latest
```

### Sécurité containers
```bash
# Isolation réseau si pas besoin internet
docker run --network none

# User non-root si possible
docker run --user 1000:1000

# Ressources limitées
docker run --memory=512m --cpus=1.0
```

## MONITORING & LOGGING

### Logs structurés
```typescript
logger.info('OSINT job started', {
  jobId,
  tool: 'amass',
  target: 'example.com',
  userId: req.user.id
});
```

### Métriques
- Temps d'exécution par outil
- Taux de succès/échec
- Nombre d'entités découvertes
- Usage des API keys (quotas)

## CONFORMITÉ & ÉTHIQUE

### Validation des cibles
```typescript
// Vérifier que la cible est autorisée
const isAuthorized = await targetValidator.check(target, userId);
if (!isAuthorized) {
  throw new UnauthorizedTargetError();
}
```

### Audit trail
```typescript
// Journaliser toutes les actions
await auditLogger.log({
  action: 'osint.scan',
  tool: 'subfinder',
  target: 'example.com',
  user: userId,
  timestamp: new Date(),
  result: 'success'
});
```

## CHECKLIST VALIDATION

Avant de merger une intégration OSINT:

- [ ] ✅ Outil fonctionne via Docker uniquement
- [ ] ✅ Adapter TypeScript créé et testé
- [ ] ✅ Script runner fonctionnel
- [ ] ✅ Configs dans `config/osint/`
- [ ] ✅ Données dans `var/osint/` (gitignored)
- [ ] ✅ Secrets via Secret Manager
- [ ] ✅ Résultats normalisés (OSINTEntity)
- [ ] ✅ Logs structurés
- [ ] ✅ Tests d'intégration passent
- [ ] ✅ Documentation mise à jour
- [ ] ✅ Validation éthique/légale

## EXEMPLES DE REJET

### ❌ Mauvaise pratique
```bash
# Clone dans le repo
git submodule add https://github.com/tool/repo vendors/tool

# Secrets hardcodés
export SHODAN_KEY="abc123"

# Installation système
apt-get install tool-binary
```

### ✅ Bonne pratique
```bash
# Docker uniquement
docker run --rm projectdiscovery/subfinder

# Secrets via API
const key = await secrets.get('shodan.key');

# Pas d'installation
# Tout via containers
```

**Aucune exception à ces règles. Toute PR non conforme sera rejetée.**