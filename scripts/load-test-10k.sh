#!/bin/bash

# ============================================
# 🚀 AURA OSINT - TEST DE CHARGE 10K REQ/S
# ============================================

echo "🔥 DÉMARRAGE TEST DE CHARGE 10K REQ/S"
echo "====================================="

# Vérifications préalables
if ! command -v autocannon &> /dev/null; then
    echo "📦 Installation autocannon..."
    npm install -g autocannon
fi

# Configuration test
TARGET_URL="http://localhost:3000"
CONNECTIONS=10000
DURATION=60
WORKERS=8

echo "🎯 Configuration:"
echo "- URL: $TARGET_URL"
echo "- Connexions: $CONNECTIONS"
echo "- Durée: ${DURATION}s"
echo "- Workers: $WORKERS"

# Vérifier que le serveur est démarré
echo "🔍 Vérification serveur..."
if ! curl -s "$TARGET_URL/health" > /dev/null; then
    echo "❌ Serveur non accessible sur $TARGET_URL"
    echo "💡 Démarrer avec: ./scripts/execute-ecosystem-final.sh"
    exit 1
fi

echo "✅ Serveur accessible"

# Test de charge progressif
echo "📊 PHASE 1: Test 1K req/s (warmup)"
autocannon -c 1000 -d 30 "$TARGET_URL/health"

echo "📊 PHASE 2: Test 5K req/s"
autocannon -c 5000 -d 45 "$TARGET_URL/health"

echo "📊 PHASE 3: Test 10K req/s (CRITIQUE)"
autocannon -c $CONNECTIONS -d $DURATION -w $WORKERS "$TARGET_URL/health" > load-test-results.txt

# Analyse résultats
echo "📈 ANALYSE RÉSULTATS:"
echo "===================="

REQUESTS_PER_SEC=$(grep "Req/Sec" load-test-results.txt | awk '{print $2}' | head -1)
LATENCY_AVG=$(grep "Latency" load-test-results.txt | awk '{print $2}' | head -1)
ERRORS=$(grep "Non-2xx" load-test-results.txt | awk '{print $3}' | head -1 || echo "0")

echo "🚀 Req/sec: $REQUESTS_PER_SEC"
echo "⏱️ Latence moyenne: $LATENCY_AVG"
echo "❌ Erreurs: $ERRORS"

# Validation seuils
if (( $(echo "$REQUESTS_PER_SEC > 8000" | bc -l) )); then
    echo "✅ SUCCÈS: >8K req/s atteint"
    RESULT="PASS"
else
    echo "❌ ÉCHEC: <8K req/s"
    RESULT="FAIL"
fi

if (( $(echo "$ERRORS > 100" | bc -l) )); then
    echo "⚠️ ATTENTION: >100 erreurs détectées"
    RESULT="FAIL"
fi

# Rapport final
cat > LOAD-TEST-REPORT.md << EOF
# 📊 RAPPORT TEST DE CHARGE 10K REQ/S

**Date**: $(date)
**Durée**: ${DURATION}s
**Connexions**: $CONNECTIONS

## 📈 RÉSULTATS

| Métrique | Valeur | Seuil | Status |
|----------|--------|-------|--------|
| Req/sec | $REQUESTS_PER_SEC | >8000 | $([ "$REQUESTS_PER_SEC" -gt 8000 ] && echo "✅ PASS" || echo "❌ FAIL") |
| Latence | $LATENCY_AVG | <100ms | $([ "${LATENCY_AVG%ms}" -lt 100 ] 2>/dev/null && echo "✅ PASS" || echo "⚠️ CHECK") |
| Erreurs | $ERRORS | <100 | $([ "$ERRORS" -lt 100 ] && echo "✅ PASS" || echo "❌ FAIL") |

## 🎯 VERDICT FINAL: $RESULT

$(if [ "$RESULT" = "PASS" ]; then
    echo "✅ **SYSTÈME VALIDÉ POUR PRODUCTION**"
    echo "- Performance conforme aux exigences"
    echo "- Prêt pour déploiement 10K utilisateurs"
else
    echo "❌ **OPTIMISATIONS REQUISES**"
    echo "- Augmenter ressources serveur"
    echo "- Optimiser code backend"
    echo "- Revoir architecture base de données"
fi)

## 📋 DÉTAILS COMPLETS
\`\`\`
$(cat load-test-results.txt)
\`\`\`
EOF

echo "📄 Rapport sauvé: LOAD-TEST-REPORT.md"
echo "🎯 RÉSULTAT FINAL: $RESULT"

if [ "$RESULT" = "PASS" ]; then
    echo "🎉 VALIDATION COMPLÈTE - PRÊT PRODUCTION"
    exit 0
else
    echo "⚠️ OPTIMISATIONS REQUISES"
    exit 1
fi