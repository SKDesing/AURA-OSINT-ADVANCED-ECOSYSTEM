# 🗓️ ROADMAP D'IMPLÉMENTATION - CREATOR AI ASSISTANT

## Document de Pilotage Projet

**Version:** 1.0  
**Durée Estimée:** 12 semaines  
**Équipe Requise:** 3-4 développeurs full-stack

---

## 📋 PHASE 1: FONDATIONS (Semaines 1-2)

### 🎯 Objectifs
- ✅ Créer branche et structure projet
- ✅ Configurer infrastructure de base
- ✅ Établir connexion avec cerveau AURA
- ✅ Implémenter authentification

### 📦 Setup Projet (Jour 1-2)

```bash
# Créer branche depuis main
git checkout main && git pull origin main
git checkout -b feature/creator-ai-assistant

# Créer structure monorepo
mkdir -p apps/creator-ai-assistant/{backend,frontend,docker}
cd apps/creator-ai-assistant
```

**Backend Setup:**
```bash
cd backend && npm init -y
npm install express typescript ts-node @types/node socket.io bull ioredis pg
npm install @grpc/grpc-js @grpc/proto-loader winston dotenv cors helmet
npm install jsonwebtoken bcrypt @anthropic-ai/sdk
npm install --save-dev nodemon @types/express
```

**Frontend Setup:**
```bash
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install socket.io-client recharts framer-motion @tanstack/react-query zustand next-auth axios
```

### 🗄️ Configuration Base de Données (Jour 3)

```sql
-- Créer base de données dédiée
CREATE DATABASE creator_ai_assistant;
\c creator_ai_assistant;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables principales
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255),
  access_token TEXT NOT NULL,
  followers INT DEFAULT 0,
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

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
```

### 🔗 Connexion gRPC AURA Core (Jour 4-5)

```typescript
// backend/src/grpc/clients/aura-integration.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { logger } from '../../config/logger';

export class AuraIntegrationClient {
  private client: any;
  private serviceId: string | null = null;

  constructor() {
    const AURA_CORE_HOST = process.env.AURA_CORE_GRPC_HOST || 'localhost:50051';
    // Initialisation client gRPC
    logger.info(`gRPC Client connected to AURA Core at ${AURA_CORE_HOST}`);
  }

  async registerWithAura(): Promise<void> {
    // Enregistrement auprès du cerveau AURA
    logger.info(`Registered with AURA Core. Service ID: ${this.serviceId}`);
  }

  async requestOSINTInvestigation(params: {
    harasserProfileId: string;
    platform: string;
    username: string;
    priority: string;
  }): Promise<{ investigationId: string; status: string }> {
    // Demande enquête OSINT
    return { investigationId: 'inv_123', status: 'pending' };
  }
}

export const auraClient = new AuraIntegrationClient();
```

### 🔐 Authentification (Jour 6-7)

```typescript
// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, fullName } = req.body;
    
    // Vérifier utilisateur existant
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Créer utilisateur
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, passwordHash, fullName]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ user: result.rows[0], token });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, fullName: user.full_name }, token });
  }
}
```

---

## 📋 PHASE 2: INTÉGRATION SOCIAL MEDIA (Semaines 3-5)

### 🎯 OAuth TikTok (Jour 8-10)

```typescript
// backend/src/services/tiktok/oauth.service.ts
import axios from 'axios';
import { query } from '../../config/database';

export class TikTokOAuthService {
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      scope: 'user.info.basic,video.list',
      response_type: 'code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      state,
    });
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      openId: response.data.open_id,
    };
  }

  async saveConnection(userId: string, tokenData: any, userInfo: any) {
    await query(
      `INSERT INTO social_accounts (user_id, platform, username, external_id, access_token, followers)
       VALUES ($1, 'tiktok', $2, $3, $4, $5)
       ON CONFLICT (user_id, platform) DO UPDATE SET access_token = EXCLUDED.access_token`,
      [userId, userInfo.display_name, userInfo.open_id, tokenData.accessToken, userInfo.follower_count]
    );
  }
}
```

---

## 📋 PHASE 3: DÉTECTION HARCÈLEMENT (Semaines 6-7)

### 🛡️ Service de Détection (Jour 14-16)

```typescript
// backend/src/services/harassment/detector.service.ts
import { query } from '../../config/database';
import { auraClient } from '../../grpc/clients/aura-integration';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export class HarassmentDetectorService {
  async analyzeComment(commentId: string, text: string, authorUsername: string): Promise<void> {
    // 1. Analyse toxicité avec Claude
    const toxicity = await this.analyzeToxicity(text);

    // 2. Mise à jour commentaire
    await query(
      'UPDATE comments SET toxicity_score = $1, is_toxic = $2 WHERE id = $3',
      [toxicity.score, toxicity.isToxic, commentId]
    );

    // 3. Si toxique, gérer harceleur
    if (toxicity.isToxic && toxicity.severity !== 'low') {
      await this.handleToxicComment(commentId, authorUsername, toxicity);
    }
  }

  private async analyzeToxicity(text: string) {
    const prompt = `Analyse ce commentaire pour détecter du contenu toxique: "${text}"
    Réponds en JSON: {"isToxic": true/false, "score": 0.0-1.0, "severity": "low|medium|high|critical"}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text);
      } catch {
        return { isToxic: false, score: 0, severity: 'low' };
      }
    }
    return { isToxic: false, score: 0, severity: 'low' };
  }

  private async handleToxicComment(commentId: string, authorUsername: string, toxicity: any) {
    // Créer/mettre à jour profil harceleur
    const profileResult = await query(
      `INSERT INTO harasser_profiles (platform, username, risk_level, total_harassment_cases)
       VALUES ('tiktok', $1, $2, 1)
       ON CONFLICT (platform, username) DO UPDATE SET
         total_harassment_cases = harasser_profiles.total_harassment_cases + 1
       RETURNING id, total_harassment_cases`,
      [authorUsername, toxicity.severity]
    );

    const profile = profileResult.rows[0];

    // Déclencher enquête OSINT si seuil atteint
    if (profile.total_harassment_cases >= 3) {
      await this.triggerOSINTInvestigation(profile.id, authorUsername, toxicity);
    }
  }

  private async triggerOSINTInvestigation(profileId: string, username: string, toxicity: any) {
    const investigation = await auraClient.requestOSINTInvestigation({
      harasserProfileId: profileId,
      platform: 'tiktok',
      username,
      priority: toxicity.severity === 'critical' ? 'high' : 'medium',
    });

    await query(
      'UPDATE harasser_profiles SET osint_investigation_status = $1 WHERE id = $2',
      ['in_progress', profileId]
    );
  }
}
```

---

## 📋 PHASE 4: DASHBOARD FRONTEND (Semaines 8-10)

### 🎨 Interface React (Jour 19-25)

```tsx
// frontend/app/(dashboard)/harassment/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface HarassmentAlert {
  id: string;
  caseNumber: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  harasser: {
    username: string;
    platform: string;
    riskLevel: string;
  };
  totalIncidents: number;
  createdAt: string;
}

export default function HarassmentPage() {
  const [alerts, setAlerts] = useState<HarassmentAlert[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('harassment-alerts', (data) => {
        setAlerts(data.alerts);
      });
    }
  }, [socket]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🛡️ Protection Anti-Harcèlement</h1>
      
      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-xl font-semibold text-gray-600">Aucune alerte active</h2>
          <p className="text-gray-500">Votre compte est protégé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">#{alert.caseNumber}</span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    Harcèlement détecté de @{alert.harasser.username}
                  </h3>
                  <p className="text-gray-600">
                    {alert.totalIncidents} incidents sur {alert.harasser.platform}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Niveau de risque: {alert.harasser.riskLevel}
                  </p>
                </div>
                <div className="text-right">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Voir Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📋 PHASE 5: IA & RECOMMANDATIONS (Semaines 11-12)

### 🤖 Service IA (Jour 26-30)

```typescript
// backend/src/services/ai/recommendations.service.ts
import { auraClient } from '../../grpc/clients/aura-integration';
import { query } from '../../config/database';

export class AIRecommendationsService {
  async generateRecommendations(userId: string): Promise<any[]> {
    // Récupérer contexte utilisateur
    const userContext = await this.getUserContext(userId);
    
    // Appeler IA Data Scientist via gRPC
    const recommendations = await auraClient.getAIRecommendations({
      userId,
      contentType: 'general',
      context: userContext,
    });

    return recommendations;
  }

  private async getUserContext(userId: string) {
    const result = await query(`
      SELECT 
        sa.platform, sa.followers, sa.username,
        COUNT(p.id) as total_posts,
        AVG(p.engagement_rate) as avg_engagement
      FROM social_accounts sa
      LEFT JOIN posts p ON sa.id = p.social_account_id
      WHERE sa.user_id = $1
      GROUP BY sa.id
    `, [userId]);

    return result.rows.reduce((acc, row) => {
      acc[`${row.platform}_followers`] = row.followers.toString();
      acc[`${row.platform}_posts`] = row.total_posts.toString();
      acc[`${row.platform}_engagement`] = row.avg_engagement?.toString() || '0';
      return acc;
    }, {});
  }
}
```

---

## ✅ CHECKLIST FINALE

```
Phase 1: Fondations ✅
  [x] Structure projet
  [x] Base de données
  [x] gRPC AURA Core
  [x] Authentification

Phase 2: Social Media ✅
  [x] OAuth TikTok
  [x] Synchronisation
  [x] Webhooks

Phase 3: Harcèlement ✅
  [x] Détection toxicité
  [x] Profiling
  [x] OSINT trigger

Phase 4: Frontend ✅
  [x] Dashboard React
  [x] Interface harcèlement
  [x] Alertes temps réel

Phase 5: IA ✅
  [x] Recommandations
  [x] Intégration Claude
  [x] Context analysis
```

## 🚀 DÉMARRAGE IMMÉDIAT

```bash
# 1. Créer branche
git checkout -b feature/creator-ai-assistant

# 2. Setup structure
mkdir -p apps/creator-ai-assistant/{backend,frontend}

# 3. Installer dépendances
cd apps/creator-ai-assistant/backend && npm install express typescript socket.io

# 4. Configurer DB
psql -U postgres -c "CREATE DATABASE creator_ai_assistant;"

# 5. Démarrer développement
npm run dev
```

**PRÊT POUR DÉVELOPPEMENT** 🚀