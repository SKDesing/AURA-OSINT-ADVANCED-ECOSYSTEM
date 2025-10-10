# SLI/SLO Catalogue

## 📊 Ingestion Pipeline
- **SLI**: records/min, P95 ingestion→index latency
- **SLO**: 120k+/min stable, P95 < 800ms
- **Budget d'erreur**: 0.1% (43min/mois)

## 🔧 Fiabilité Système
- **SLI**: Uptime, MTTR incidents
- **SLO**: 99.9% uptime, MTTR < 30min
- **Budget d'erreur**: 43min downtime/mois max

## 🖥️ Desktop Application
- **SLI**: Crash-free sessions, update success rate
- **SLO**: P99 crash-free > 99.5%, updates > 95%
- **Budget d'erreur**: 0.5% crash rate max

## 🕵️ Furtivité (Conforme)
- **SLI**: Taux d'événements signalés comme anormaux
- **SLO**: < 0.5% events flaggés/semaine
- **Mesure**: Proxys, captchas, throttling observés

## 🔍 Corrélation & Recherche
- **SLI**: Query response time, index freshness
- **SLO**: P95 < 200ms, freshness < 5min
- **Budget d'erreur**: 5% queries > 200ms

## 📈 Métriques RED/USE

### RED (Request/Error/Duration)
- **Request Rate**: req/sec par endpoint
- **Error Rate**: % erreurs 4xx/5xx
- **Duration**: P50/P95/P99 latency

### USE (Utilization/Saturation/Errors)
- **Utilization**: CPU/Memory/Disk %
- **Saturation**: Queue depth, backpressure
- **Errors**: System errors, timeouts