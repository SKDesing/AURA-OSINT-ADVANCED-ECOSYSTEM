# 🚀 AURA AI Orchestrator Backend

## Architecture Révolutionnaire

```
🧠 AI Orchestrator
├── 🎯 Intent Parser (Qwen AI)
├── 📋 Investigation Planner
├── 🔧 Tool Registry (150+ outils)
├── ⚡ Execution Engine
└── 📊 Report Generator
```

## Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development
npm run start:dev
```

## API Endpoints

### 🚀 Start Investigation
```http
POST /api/v2/investigation/start
Content-Type: application/json

{
  "query": "Analyser le profil TikTok @johndoe",
  "userId": "user123"
}
```

### 📡 Stream Progress
```http
GET /api/v2/investigation/stream/{investigationId}
Accept: text/event-stream
```

## Outils Intégrés

- 🎵 **TikTok Analyzer** - Analyse de profils
- 🔍 **Sherlock** - Recherche username
- 🌐 **Sublist3r** - Énumération sous-domaines
- 📧 **TheHarvester** - Intelligence email/domaine
- 📸 **Instagram Analyzer** - Analyse profils IG
- 🔐 **Holehe** - OSINT email

## Flux d'Exécution

1. **Parse Intent** → IA analyse la requête utilisateur
2. **Create Plan** → Sélection optimale des outils
3. **Execute Tools** → Exécution parallèle/séquentielle
4. **Aggregate Results** → Corrélation des données
5. **Generate Report** → Rapport narratif IA

## Technologies

- **NestJS** - Framework backend
- **TypeORM** - ORM base de données
- **PostgreSQL** - Base de données principale
- **Redis** - Cache et sessions
- **Qwen AI** - Intelligence artificielle
- **SSE** - Streaming temps réel