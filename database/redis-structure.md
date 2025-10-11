# 🚀 REDIS CACHE STRUCTURE - AURA OSINT

## 📋 PATTERNS DE CLÉS REDIS

### 🔐 **AUTHENTIFICATION & SESSIONS**
```
user:{user_id}:session                  # Session utilisateur active
user:{user_id}:permissions              # Cache permissions utilisateur
user:{user_id}:preferences              # Préférences utilisateur
auth:token:{token_hash}                 # Validation tokens JWT
auth:refresh:{user_id}                  # Refresh tokens
```

### 🔍 **INVESTIGATIONS & CACHES**
```
investigation:{id}:cache                # Cache données investigation
investigation:{id}:targets              # Liste cibles investigation
investigation:{id}:progress             # Progression scans en cours
investigation:{id}:results:summary      # Résumé résultats
target:{id}:profiles                    # Profils sociaux découverts
target:{id}:last_scan                   # Timestamp dernier scan
```

### ⚡ **SCANS & OUTILS OSINT**
```
scan:{id}:status                        # Statut scan temps réel
scan:{id}:progress                      # Progression scan (0-100%)
scan:{id}:results                       # Résultats temporaires
tool:{tool_name}:queue                  # File d'attente outils
tool:{tool_name}:rate_limit             # Rate limiting par outil
tool:{tool_name}:config                 # Configuration outil
```

### 🤖 **INTELLIGENCE ARTIFICIELLE**
```
ai:prompt:{hash}                        # Cache prompts IA
ai:embeddings:{entity_id}               # Cache embeddings
ai:analysis:{investigation_id}          # Analyses IA en cours
ai:model:{model_name}:status            # Statut modèles IA
qwen:conversation:{session_id}          # Conversations Qwen
```

### 📊 **MÉTRIQUES & MONITORING**
```
metrics:realtime:{metric_name}          # Métriques temps réel
metrics:daily:{date}:{metric}           # Métriques journalières
stats:user:{user_id}:activity           # Activité utilisateur
stats:tool:{tool_name}:usage            # Statistiques usage outils
performance:{service}:response_time     # Temps réponse services
```

### 🌐 **PLATEFORMES SOCIALES**
```
social:{platform}:profile:{username}   # Cache profil social
social:{platform}:posts:{profile_id}   # Cache posts récents
social:trending:hashtags:{platform}    # Hashtags tendance
social:rate_limit:{platform}:{ip}      # Rate limiting plateformes
tiktok:user:{username}:videos           # Cache vidéos TikTok
instagram:user:{username}:stories       # Cache stories Instagram
```

### 🔒 **RATE LIMITING & SÉCURITÉ**
```
rate_limit:{ip}:{endpoint}              # Rate limiting par IP
rate_limit:user:{user_id}:{action}      # Rate limiting utilisateur
security:failed_login:{ip}              # Tentatives connexion échouées
security:suspicious:{ip}                # Activité suspecte
proxy:rotation:{service}                # Rotation proxies
```

### 📧 **EMAIL & COMMUNICATIONS**
```
email:queue:pending                     # File emails à envoyer
email:template:{template_id}            # Templates emails
notification:{user_id}:unread           # Notifications non lues
alert:{investigation_id}:active         # Alertes actives
```

### 🗄️ **CACHE DONNÉES EXTERNES**
```
whois:{domain}                          # Cache données WHOIS
dns:{domain}:records                    # Cache enregistrements DNS
geo:ip:{ip_address}                     # Cache géolocalisation IP
breach:{email}:data                     # Cache données breaches
threat_intel:{indicator}                # Cache threat intelligence
```

## ⚙️ **CONFIGURATION REDIS**

### 🔧 **Paramètres Optimisés**
```redis
# redis.conf optimisé pour AURA OSINT

# Mémoire
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistance
save 900 1
save 300 10
save 60 10000

# Performance
tcp-keepalive 300
timeout 0
tcp-backlog 511

# Sécurité
requirepass aura_redis_2025
rename-command FLUSHDB ""
rename-command FLUSHALL ""
```

### 📊 **TTL (Time To Live) Recommandés**
```
Sessions utilisateur:           3600s (1h)
Cache profils sociaux:         1800s (30min)
Résultats scans:               7200s (2h)
Métriques temps réel:          300s (5min)
Cache DNS/WHOIS:               86400s (24h)
Rate limiting:                 3600s (1h)
Embeddings IA:                 604800s (7j)
Données breach:                2592000s (30j)
```

## 🚀 **COMMANDES REDIS UTILES**

### 📋 **Monitoring**
```bash
# Statistiques générales
redis-cli INFO stats

# Mémoire utilisée
redis-cli INFO memory

# Clés par pattern
redis-cli KEYS "user:*:session"

# Monitoring temps réel
redis-cli MONITOR
```

### 🔍 **Debugging**
```bash
# Voir toutes les clés d'un utilisateur
redis-cli KEYS "user:12345:*"

# Vérifier TTL d'une clé
redis-cli TTL "scan:abc123:status"

# Voir contenu clé
redis-cli GET "investigation:xyz:cache"

# Supprimer pattern
redis-cli EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 "temp:*"
```

## 📈 **MÉTRIQUES REDIS IMPORTANTES**

### 🎯 **KPIs à Surveiller**
- **Hit Rate Cache**: > 85%
- **Mémoire Utilisée**: < 80% max
- **Connexions Actives**: < 1000
- **Commandes/sec**: Selon charge
- **Latence Moyenne**: < 1ms
- **Évictions**: Minimales

### 🚨 **Alertes Recommandées**
- Mémoire > 90%
- Hit rate < 70%
- Connexions > 800
- Latence > 5ms
- Évictions > 100/min

---

**🎯 REDIS OPTIMISÉ POUR PERFORMANCE OSINT MAXIMALE**