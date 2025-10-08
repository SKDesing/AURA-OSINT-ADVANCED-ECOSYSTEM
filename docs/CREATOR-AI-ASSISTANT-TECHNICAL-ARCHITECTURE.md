# 🎯 AURA CREATOR AI ASSISTANT - ARCHITECTURE TECHNIQUE

## Document Technique Détaillé pour l'Équipe de Développement

**Version:** 1.0  
**Date:** Janvier 2025  
**Classification:** Technique - Développement

---

## 🌐 VUE D'ENSEMBLE ARCHITECTURE

### Schéma Général
```
┌─────────────────────────────────────────────────────────────────┐
│                    AURA OSINT ECOSYSTEM                          │
│                     (Cerveau Central)                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ gRPC / Message Queue (RabbitMQ)
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   MITM      │ │    AI       │ │  OSINT      │
│   Proxy     │ │ Data Scientist│ │  Engine    │
│   Engine    │ │   (Claude)  │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │ REST API / WebSocket
                       │
       ┌───────────────▼───────────────┐
       │   CREATOR AI ASSISTANT        │
       │   (Nouvelle Application)      │
       │  ┌─────────────────────────┐  │
       │  │  Node.js Backend        │  │
       │  │  - Express.js           │  │
       │  │  - Socket.io            │  │
       │  │  - Bull Queue           │  │
       │  └─────────────────────────┘  │
       │  ┌─────────────────────────┐  │
       │  │  React Frontend         │  │
       │  │  - Next.js 14           │  │
       │  │  - TailwindCSS          │  │
       │  │  - Recharts             │  │
       │  └─────────────────────────┘  │
       └───────────────┬───────────────┘
                       │ OAuth 2.0 / Webhooks
                       │
       ┌───────────────▼───────────────┐
       │   SOCIAL MEDIA PLATFORMS      │
       │   - TikTok API                │
       │   - Instagram Graph API       │
       │   - YouTube Data API          │
       └───────────────────────────────┘
```

### Principes Architecturaux
- **Microservices**: Service autonome communiquant via gRPC/REST
- **Event-Driven**: RabbitMQ pour événements asynchrones
- **Real-Time**: WebSocket pour dashboard live
- **Data Privacy**: Chiffrement end-to-end données sensibles

---

## 🌳 STRUCTURE PROJET & BRANCHE GIT

### Création Branche
```bash
# Depuis la branche main de AURA OSINT
git checkout -b feature/creator-ai-assistant
mkdir -p apps/creator-ai-assistant
cd apps/creator-ai-assistant
npm init -y
```

### Arborescence Complète
```
aura-osint/
├── apps/
│   ├── creator-ai-assistant/              # ← NOUVELLE APP
│   │   ├── backend/
│   │   │   ├── src/
│   │   │   │   ├── config/
│   │   │   │   │   ├── database.ts        # PostgreSQL config
│   │   │   │   │   ├── redis.ts           # Redis client
│   │   │   │   │   ├── rabbitmq.ts        # RabbitMQ connection
│   │   │   │   │   ├── grpc-client.ts     # gRPC vers AURA core
│   │   │   │   │   └── logger.ts          # Winston logger
│   │   │   │   │
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── dashboard.controller.ts
│   │   │   │   │   ├── analytics.controller.ts
│   │   │   │   │   ├── content.controller.ts
│   │   │   │   │   └── ai.controller.ts
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── tiktok/
│   │   │   │   │   │   ├── oauth.service.ts
│   │   │   │   │   │   ├── sync.service.ts
│   │   │   │   │   │   ├── webhook.service.ts
│   │   │   │   │   │   └── api-client.ts
│   │   │   │   │   │
│   │   │   │   │   ├── ai/
│   │   │   │   │   │   ├── recommendations.service.ts
│   │   │   │   │   │   ├── content-generator.service.ts
│   │   │   │   │   │   ├── sentiment-analyzer.service.ts
│   │   │   │   │   │   └── live-coach.service.ts
│   │   │   │   │   │
│   │   │   │   │   ├── harassment/
│   │   │   │   │   │   ├── detector.service.ts      # ← NOUVEAU
│   │   │   │   │   │   ├── profiler.service.ts      # ← NOUVEAU
│   │   │   │   │   │   └── osint-trigger.service.ts # ← NOUVEAU
│   │   │   │   │   │
│   │   │   │   │   └── aura-integration/
│   │   │   │   │       ├── grpc-client.service.ts   # Connexion cerveau
│   │   │   │   │       ├── osint-request.service.ts # Demande enquête
│   │   │   │   │       └── ai-scientist.service.ts  # Appel IA Data Scientist
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── User.ts
│   │   │   │   │   ├── SocialAccount.ts
│   │   │   │   │   ├── Post.ts
│   │   │   │   │   ├── Comment.ts
│   │   │   │   │   ├── Recommendation.ts
│   │   │   │   │   ├── HarassmentCase.ts           # ← NOUVEAU
│   │   │   │   │   ├── HarasserProfile.ts          # ← NOUVEAU
│   │   │   │   │   └── OsintInvestigation.ts       # ← NOUVEAU
│   │   │   │   │
│   │   │   │   ├── routes/
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── dashboard.routes.ts
│   │   │   │   │   ├── analytics.routes.ts
│   │   │   │   │   ├── content.routes.ts
│   │   │   │   │   ├── ai.routes.ts
│   │   │   │   │   └── harassment.routes.ts         # ← NOUVEAU
│   │   │   │   │
│   │   │   │   ├── queues/
│   │   │   │   │   ├── sync-queue.ts               # Sync social media
│   │   │   │   │   ├── ai-queue.ts                 # AI recommendations
│   │   │   │   │   ├── harassment-queue.ts         # ← NOUVEAU
│   │   │   │   │   └── osint-queue.ts              # ← NOUVEAU
│   │   │   │   │
│   │   │   │   ├── websocket/
│   │   │   │   │   ├── socket-server.ts
│   │   │   │   │   └── handlers/
│   │   │   │   │       ├── live-metrics.handler.ts
│   │   │   │   │       ├── notifications.handler.ts
│   │   │   │   │       └── coaching.handler.ts
│   │   │   │   │
│   │   │   │   └── grpc/
│   │   │   │       ├── proto/
│   │   │   │       │   ├── aura-core.proto         # Interface cerveau
│   │   │   │       │   ├── osint-engine.proto
│   │   │   │       │   └── ai-scientist.proto
│   │   │   │       │
│   │   │   │       └── clients/
│   │   │   │           ├── aura-core-client.ts
│   │   │   │           ├── osint-client.ts
│   │   │   │           └── ai-client.ts
│   │   │   │
│   │   │   └── package.json
│   │   │
│   │   ├── frontend/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── signup/page.tsx
│   │   │   │   │
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx                    # Dashboard principal
│   │   │   │   │   ├── analytics/page.tsx
│   │   │   │   │   ├── content/page.tsx
│   │   │   │   │   ├── live/page.tsx
│   │   │   │   │   ├── harassment/page.tsx         # ← NOUVEAU
│   │   │   │   │   └── settings/page.tsx
│   │   │   │   │
│   │   │   │   └── api/auth/[...nextauth]/route.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── EngagementChart.tsx
│   │   │   │   │   ├── GrowthMetrics.tsx
│   │   │   │   │   └── AudienceInsights.tsx
│   │   │   │   │
│   │   │   │   ├── ai/
│   │   │   │   │   ├── RecommendationCard.tsx
│   │   │   │   │   ├── LiveCoach.tsx
│   │   │   │   │   ├── ContentIdeas.tsx
│   │   │   │   │   └── ChatAssistant.tsx
│   │   │   │   │
│   │   │   │   ├── harassment/                     # ← NOUVEAU
│   │   │   │   │   ├── AlertBanner.tsx
│   │   │   │   │   ├── HarasserProfile.tsx
│   │   │   │   │   ├── InvestigationTimeline.tsx
│   │   │   │   │   └── SafetyDashboard.tsx
│   │   │   │   │
│   │   │   │   └── shared/
│   │   │   │       ├── Navigation.tsx
│   │   │   │       ├── Notifications.tsx
│   │   │   │       └── LoadingStates.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useRealTimeMetrics.ts
│   │   │   │   ├── useAIRecommendations.ts
│   │   │   │   ├── useHarassmentAlerts.ts          # ← NOUVEAU
│   │   │   │   └── useTikTokAuth.ts
│   │   │   │
│   │   │   └── package.json
│   │   │
│   │   └── docker/
│   │       ├── Dockerfile.backend
│   │       ├── Dockerfile.frontend
│   │       └── docker-compose.yml
│   │
│   └── core/                                       # Cerveau AURA existant
│       ├── mitm-proxy/
│       ├── osint-engine/
│       └── ai-data-scientist/
│
└── shared/                                         # Librairies partagées
    ├── proto/                                      # Définitions gRPC
    ├── types/                                      # TypeScript types
    └── utils/
```

---

## 🔗 INTÉGRATION AVEC ÉCOSYSTÈME AURA

### Définitions gRPC (Protobuf)

```protobuf
// shared/proto/aura-core.proto
syntax = "proto3";
package aura.core;

service AuraCore {
  rpc RegisterClient(ClientRegistration) returns (ClientCredentials);
  rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
  rpc GetConfig(ConfigRequest) returns (ConfigResponse);
}

message ClientRegistration {
  string client_name = 1;
  string client_version = 2;
  repeated string required_services = 3;
}

message ClientCredentials {
  string client_id = 1;
  string api_key = 2;
  int64 expires_at = 3;
}
```

### Client gRPC - Backend Node.js

```typescript
// backend/src/grpc/clients/aura-core-client.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { logger } from '../../config/logger';

export class AuraCoreClient {
  private client: any;
  private clientId: string | null = null;

  constructor() {
    const AURA_CORE_HOST = process.env.AURA_CORE_GRPC_HOST || 'localhost:50051';
    // Initialisation client gRPC
    logger.info(`gRPC Client connected to AURA Core at ${AURA_CORE_HOST}`);
  }

  async register(): Promise<void> {
    // Enregistrement auprès du cerveau AURA
    logger.info(`Registered with AURA Core. Client ID: ${this.clientId}`);
  }

  async healthCheck(): Promise<any> {
    // Vérification santé système
    return {};
  }
}

export const auraCoreClient = new AuraCoreClient();
```

---

## 🗄️ SCHÉMA BASE DE DONNÉES

### Tables PostgreSQL

```sql
-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table Comptes Social Media
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255),
  access_token TEXT NOT NULL,
  followers INT DEFAULT 0,
  connected_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, platform)
);

-- Table Posts/Vidéos
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  external_id VARCHAR(255) NOT NULL,
  caption TEXT,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views BIGINT DEFAULT 0,
  engagement_rate FLOAT DEFAULT 0,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(social_account_id, external_id)
);

-- Table Commentaires
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL UNIQUE,
  text TEXT NOT NULL,
  author_username VARCHAR(255),
  sentiment_score FLOAT,
  toxicity_score FLOAT,
  is_toxic BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Recommandations IA
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- NOUVELLES TABLES - SYSTÈME ANTI-HARCÈLEMENT
-- ========================================

-- Table Cas de Harcèlement
CREATE TABLE harassment_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_number VARCHAR(50) UNIQUE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  severity VARCHAR(50) NOT NULL,
  total_incidents INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Profils Harceleurs
CREATE TABLE harasser_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255) NOT NULL,
  risk_level VARCHAR(50) DEFAULT 'low',
  total_harassment_cases INT DEFAULT 0,
  osint_investigation_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, username)
);

-- Table Enquêtes OSINT
CREATE TABLE osint_investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investigation_id VARCHAR(255) UNIQUE NOT NULL,
  harasser_profile_id UUID NOT NULL REFERENCES harasser_profiles(id),
  status VARCHAR(50) DEFAULT 'pending',
  threat_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 DÉPLOIEMENT & INFRASTRUCTURE

### Configuration Docker

```yaml
# docker/docker-compose.yml
version: '3.8'
services:
  creator-ai-backend:
    build:
      context: ../backend
      dockerfile: ../docker/Dockerfile.backend
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@postgres:5432/creator_ai
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  creator-ai-frontend:
    build:
      context: ../frontend
      dockerfile: ../docker/Dockerfile.frontend
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3002

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: creator_ai
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Scripts de Démarrage

```json
// package.json (root)
{
  "scripts": {
    "dev:creator": "concurrently \"npm run dev:creator:backend\" \"npm run dev:creator:frontend\"",
    "dev:creator:backend": "npm run dev --workspace=apps/creator-ai-assistant/backend",
    "dev:creator:frontend": "npm run dev --workspace=apps/creator-ai-assistant/frontend",
    "build:creator": "npm run build --workspace=apps/creator-ai-assistant",
    "docker:creator": "cd apps/creator-ai-assistant && docker-compose -f docker/docker-compose.yml up -d"
  }
}
```

---

## 🎯 INTÉGRATION AVEC ÉCOSYSTÈME EXISTANT

### Points d'Intégration Clés

1. **Extension Chrome existante** → Réutilisation pour capture données TikTok
2. **Backend API capture** → Extension pour endpoints Creator AI
3. **Base PostgreSQL** → Nouvelles tables harassment + osint
4. **Moteur NLP** → Intégration service sentiment analysis
5. **OSINT Engine** → Déclenchement enquêtes automatiques

### Modifications Minimales Requises

```bash
# Extensions à l'écosystème existant
backend/api/capture.js → Ajouter endpoints harassment detection
backend/core/nlp_analyzer.py → Exposer via gRPC
extensions/chrome-tiktok/ → Webhook vers Creator AI
```

---

## ✅ VALIDATION ARCHITECTURE

**PERTINENCE POUR ÉCOSYSTÈME AURA :**
- ✅ Réutilise infrastructure existante (PostgreSQL, Redis, gRPC)
- ✅ Étend capacités OSINT avec cas d'usage créateurs
- ✅ Monétise expertise technique via SaaS B2C
- ✅ Architecture modulaire compatible
- ✅ Sécurité et conformité RGPD intégrées

**PRÊT POUR DÉVELOPPEMENT** 🚀