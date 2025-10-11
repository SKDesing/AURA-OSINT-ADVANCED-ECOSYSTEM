# AURA OSINT - Contrat API
## Alliance Stratégique Front-Back

### Endpoints de Configuration

#### GET /api/health
**Réponse**:
```json
{
  "status": "Backend AURA OSINT opérationnel",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/config
**Réponse**:
```json
{
  "backend_url": "http://localhost:3001",
  "websocket_url": "ws://localhost:3001",
  "osint_tools_available": true,
  "database_connected": true
}
```

#### POST /api/config/test
**Body**:
```json
{
  "backend_url": "http://localhost:3001",
  "websocket_url": "ws://localhost:3001"
}
```

#### GET /api/osint/tools
**Réponse**:
```json
{
  "available": ["sherlock", "theHarvester", "spiderfoot", "maltego"],
  "count": 8,
  "status": "operational"
}
```

### Endpoints OSINT Core

#### POST /api/osint/investigate
**Body**:
```json
{
  "target": "username@example.com",
  "tools": ["sherlock", "theHarvester"],
  "depth": "standard"
}
```

#### GET /api/osint/results/:id
**Description**: Récupérer les résultats d'investigation

#### WebSocket /ws
**Events**: `investigation_started`, `tool_progress`, `investigation_completed`, `error`

### Codes de Statut
- `200`: Succès
- `400`: Erreur de requête  
- `401`: Non autorisé
- `500`: Erreur serveur