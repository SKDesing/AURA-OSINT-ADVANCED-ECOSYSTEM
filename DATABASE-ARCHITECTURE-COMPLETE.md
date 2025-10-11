# 🗄️ ARCHITECTURE BASE DE DONNÉES ULTIME - AURA OSINT ECOSYSTEM

## 📋 TABLE DES MATIÈRES
1. [Vue d'Ensemble Architecture](#vue-ensemble)
2. [PostgreSQL - Base Principale](#postgresql)
3. [Elasticsearch - Recherche](#elasticsearch)
4. [Qdrant - Base Vectorielle](#qdrant)
5. [Redis - Cache](#redis)
6. [Outputs OSINT Analysés](#outputs-osint)
7. [Intégration & Synchronisation](#integration)

---

## 🏗️ VUE D'ENSEMBLE ARCHITECTURE {#vue-ensemble}

### 🎯 **ARCHITECTURE MULTI-BASE**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   POSTGRESQL    │    │  ELASTICSEARCH  │    │     QDRANT      │
│  Base Principale│    │   Recherche     │    │ Base Vectorielle│
│                 │    │   Full-Text     │    │   IA/Embeddings │
│ • Investigations│    │ • Indexation    │    │ • Similarité    │
│ • Profils       │    │ • Agrégations   │    │ • Clustering    │
│ • Relations     │    │ • Analytics     │    │ • Recommandations│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │      REDIS      │
                    │      Cache      │
                    │                 │
                    │ • Sessions      │
                    │ • Rate Limiting │
                    │ • Temp Results  │
                    └─────────────────┘
```

### 📊 **RÉPARTITION DES DONNÉES**

| Type de Données | PostgreSQL | Elasticsearch | Qdrant | Redis |
|------------------|------------|---------------|--------|-------|
| **Investigations** | ✅ Master | ✅ Search | ✅ Similarity | ✅ Cache |
| **Profils Sociaux** | ✅ Master | ✅ Search | ✅ Embeddings | ✅ Cache |
| **Posts/Contenu** | ✅ Master | ✅ Full-text | ✅ Semantic | ❌ |
| **Relations** | ✅ Master | ✅ Graph | ❌ | ❌ |
| **Métriques** | ✅ TimescaleDB | ✅ Analytics | ❌ | ✅ Real-time |
| **Sessions** | ❌ | ❌ | ❌ | ✅ Master |

---

## 🐘 POSTGRESQL - BASE PRINCIPALE {#postgresql}

### 📁 **FICHIERS CRÉÉS**
- `database/schema-ultimate-v2.sql` - Schéma complet optimisé
- Extensions: TimescaleDB, PostGIS, pg_trgm, pgcrypto

### 🎯 **TABLES PRINCIPALES**
1. **organizations** - Multi-tenant
2. **users** - Authentification
3. **investigations** - Enquêtes OSINT
4. **targets** - Cibles d'investigation
5. **osint_scans** - Exécutions outils
6. **social_profiles** - Profils réseaux sociaux
7. **social_posts** - Publications (TimescaleDB)
8. **email_accounts** - Comptes email trouvés
9. **phone_numbers** - Numéros téléphone
10. **domains** - Domaines & sous-domaines
11. **ip_addresses** - Infrastructure réseau

### ⚡ **OPTIMISATIONS**
- **Indexes GIN** pour JSONB et arrays
- **Indexes géospatiaux** PostGIS
- **Hypertables** TimescaleDB pour séries temporelles
- **Partitioning** par organisation
- **Compression** automatique données anciennes

---

## 🔍 ELASTICSEARCH - RECHERCHE {#elasticsearch}

### 📁 **FICHIERS CRÉÉS**
- `database/elasticsearch-mappings.json` - Configuration mappings

### 🎯 **INDEX PRINCIPAL: osint_entities**
```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "osint_analyzer": "custom tokenization",
        "username_analyzer": "keyword + lowercase"
      }
    }
  },
  "mappings": {
    "username": "multi-field (text + keyword)",
    "content": "full-text search optimized",
    "location": "geo_point",
    "hashtags": "keyword array",
    "mentions": "keyword array"
  }
}
```

### 🚀 **FONCTIONNALITÉS**
- **Recherche full-text** multi-langue
- **Agrégations** pour analytics
- **Géolocalisation** avec geo_point
- **Suggestions** auto-complete
- **Highlighting** résultats

---

## 🧠 QDRANT - BASE VECTORIELLE {#qdrant}

### 📁 **FICHIERS CRÉÉS**
- `database/qdrant-collections.py` - Setup collections

### 🎯 **COLLECTIONS CONFIGURÉES**
1. **investigations_embeddings** (384D) - Similarité cas
2. **social_profiles_embeddings** (384D) - Profils similaires  
3. **content_embeddings** (768D) - Contenu sémantique
4. **domain_embeddings** (384D) - Infrastructure réseau
5. **knowledge_base** (1536D) - Base connaissances OSINT

### 🤖 **MODÈLES IA SUPPORTÉS**
- **sentence-transformers/all-MiniLM-L6-v2** (384D)
- **sentence-transformers/all-mpnet-base-v2** (768D)
- **OpenAI text-embedding-ada-002** (1536D)
- **Qwen embeddings** (custom)

---

## ⚡ REDIS - CACHE {#redis}

### 📁 **FICHIERS CRÉÉS**
- `database/redis-structure.md` - Documentation complète

### 🔑 **PATTERNS DE CLÉS**
```
user:{user_id}:session              # Sessions
investigation:{id}:cache            # Cache investigations  
scan:{id}:status                    # Statut scans temps réel
ai:prompt:{hash}                    # Cache prompts IA
social:{platform}:profile:{user}    # Cache profils sociaux
rate_limit:{ip}:{endpoint}          # Rate limiting
```

### ⏱️ **TTL OPTIMISÉS**
- Sessions: 1h
- Cache profils: 30min
- Résultats scans: 2h
- Métriques: 5min
- Rate limiting: 1h

---

## 🔍 OUTPUTS OSINT ANALYSÉS {#outputs-osint}

### 📊 **FORMATS SUPPORTÉS**

#### **SHERLOCK** - Recherche Comptes
```json
{
  "username": "target_user",
  "results": [
    {
      "platform": "GitHub",
      "url": "https://github.com/target_user",
      "status": "found",
      "response_time": 0.342
    }
  ],
  "total_found": 42
}
```

#### **HOLEHE** - OSINT Email
```json
{
  "email": "target@example.com",
  "services": [
    {
      "name": "spotify",
      "exists": true,
      "method": "register"
    }
  ],
  "found": 28
}
```

#### **TIKTOK ANALYZER** - Profils TikTok
```json
{
  "username": "@charlidamelio",
  "profile": {
    "followers": 155800000,
    "verified": true,
    "bio": "booking: charli@unitedtalent.com"
  },
  "videos": [
    {
      "video_id": "7180512345678901234",
      "stats": {
        "views": 45000000,
        "likes": 8900000
      },
      "hashtags": ["#fyp", "#dance"]
    }
  ]
}
```

#### **SUBFINDER** - Sous-domaines
```json
{
  "host": "example.com",
  "subdomains": [
    {
      "subdomain": "mail.example.com",
      "ip": "192.168.1.10",
      "source": "crtsh"
    }
  ]
}
```

---

## 🔄 INTÉGRATION & SYNCHRONISATION {#integration}

### 📊 **FLUX DE DONNÉES**
```
1. OSINT Tool → Raw Output
2. Parser → Structured Data
3. PostgreSQL ← Master Data
4. Elasticsearch ← Search Index
5. Qdrant ← Embeddings
6. Redis ← Cache Layer
```

### 🔄 **SYNCHRONISATION**
- **Real-time**: PostgreSQL → Redis (triggers)
- **Batch**: PostgreSQL → Elasticsearch (ETL 5min)
- **AI Processing**: PostgreSQL → Qdrant (async)
- **Cleanup**: Redis TTL + PostgreSQL retention

### 📈 **MONITORING**
- **PostgreSQL**: pg_stat_statements
- **Elasticsearch**: Cluster health + indices stats
- **Qdrant**: Collection metrics
- **Redis**: INFO stats + hit rates

---

## 🚀 **DÉPLOIEMENT RAPIDE**

### 1️⃣ **PostgreSQL**
```bash
# Appliquer schéma
psql -U aura -d aura_osint -f database/schema-ultimate-v2.sql
```

### 2️⃣ **Elasticsearch**
```bash
# Créer index
curl -X PUT "localhost:9200/osint_entities" \
  -H "Content-Type: application/json" \
  -d @database/elasticsearch-mappings.json
```

### 3️⃣ **Qdrant**
```bash
# Setup collections
python database/qdrant-collections.py
```

### 4️⃣ **Redis**
```bash
# Configuration optimisée dans redis.conf
# Patterns documentés dans redis-structure.md
```

---

## 📊 **STATISTIQUES ARCHITECTURE**

- **📋 Tables PostgreSQL**: 11 tables principales
- **🔍 Index Elasticsearch**: 1 index multi-type optimisé  
- **🧠 Collections Qdrant**: 5 collections vectorielles
- **⚡ Patterns Redis**: 50+ patterns organisés
- **📈 Capacité**: Multi-million records
- **🚀 Performance**: Sub-second queries
- **🔒 Sécurité**: Multi-tenant + RLS + chiffrement

**🎯 ARCHITECTURE COMPLÈTE PRÊTE POUR PRODUCTION !**