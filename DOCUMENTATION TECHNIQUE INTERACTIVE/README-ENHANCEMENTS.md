# 🚀 AURA OSINT - Améliorations Interface

## ✨ **Nouvelles Fonctionnalités**

### 🎨 **Effets Visuels Avancés**
- **Parallaxe fluide** avec `data-parallax` attributes
- **Hover 3D** sur les cartes avec effet de profondeur
- **Bordures néon** subtiles au survol
- **Animations respectueuses** de `prefers-reduced-motion`

### ⚡ **Optimisations Performance**
- **Throttle/Debounce** pour scroll et resize
- **Intersection Observer** pour révélations progressives
- **Will-change** optimisé pour GPU
- **Idle callbacks** pour tâches non-critiques

### ♿ **Accessibilité Renforcée**
- **Focus management** amélioré sur ancres
- **Outline visible** pour navigation clavier
- **ARIA labels** sur éléments interactifs
- **Respect préférences** utilisateur

## 🛠️ **Utilisation**

### Parallaxe
```html
<!-- Élément avec parallaxe -->
<div data-parallax data-parallax-speed="0.3">
  Contenu qui bouge au scroll
</div>

<!-- Avec rotation -->
<div data-parallax data-parallax-speed="0.2" data-parallax-rotate="0.1">
  Contenu avec rotation
</div>

<!-- Avec fade -->
<div data-parallax data-parallax-opacity="500">
  Contenu qui fade avec le scroll
</div>
```

### Révélations Progressives
```html
<!-- Éléments qui apparaissent au scroll -->
<div class="reveal-on-scroll">Contenu révélé</div>
<div class="reveal-on-scroll" style="transition-delay:.1s">Avec délai</div>
```

### Effets Visuels
```html
<!-- Bordure dégradée -->
<div class="card-neo border-gradient">Carte avec bordure néon</div>

<!-- Bouton avec pulse -->
<button class="btn btn-gradient btn-pulse">CTA Important</button>
```

## 📊 **Serveur de Métriques (Optionnel)**

### Installation
```bash
cd "DOCUMENTATION TECHNIQUE INTERACTIVE"
pip install -r requirements.txt
python metrics_server.py
```

### Intégration Frontend
```javascript
// Connexion au stream de métriques
function initLiveMetrics() {
  try {
    const es = new EventSource('http://localhost:8000/sse');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      // Mise à jour des KPIs
      document.getElementById('kpiThroughput').textContent = 
        data.performance.throughput.toLocaleString('fr-FR');
      document.getElementById('kpiLatency').textContent = 
        data.performance.latency_p95;
      document.getElementById('kpiQuality').textContent = 
        data.performance.quality_schema + '%';
    };
  } catch (e) {
    console.warn('Live metrics disabled:', e);
  }
}
```

## 🎯 **API Publique**

### Runtime Info
```javascript
// Accès aux informations runtime
const info = window.AuraOSINT.getRuntime();
console.log(info);
// {
//   theme: "dark",
//   reducedMotion: false,
//   viewport: { w: 1920, h: 1080 },
//   now: "2024-01-15T10:30:00.000Z"
// }
```

## 🔧 **Configuration**

### Variables CSS Personnalisables
```css
:root {
  --parallax-intensity: 0.25; /* Intensité parallaxe */
  --tilt-max: 6deg;           /* Angle max hover 3D */
  --reveal-distance: 16px;    /* Distance révélation */
  --pulse-duration: 2.4s;     /* Durée animation pulse */
}
```

### JavaScript Options
```javascript
// Désactiver certains effets
const config = {
  parallax: false,        // Désactiver parallaxe
  tiltHover: false,       // Désactiver hover 3D
  revealObserver: false   // Désactiver révélations
};
```

## 📈 **Métriques Disponibles**

Le serveur expose ces métriques via SSE :

- **Performance** : throughput, latency, quality
- **OSINT** : investigations actives, outils en cours
- **Sécurité** : score, menaces détectées
- **IA** : confiance, embeddings traités
- **Système** : CPU, mémoire, disque

## 🚀 **Démarrage Rapide**

1. **CSS/JS** : Déjà intégrés, aucune action requise
2. **Parallaxe** : Ajouter `data-parallax` sur éléments souhaités
3. **Métriques** : Lancer `python metrics_server.py` (optionnel)
4. **Personnalisation** : Modifier variables CSS selon besoins

## 🔍 **Compatibilité**

- ✅ **Navigateurs** : Chrome 90+, Firefox 88+, Safari 14+
- ✅ **Mobile** : iOS 14+, Android 10+
- ✅ **Accessibilité** : WCAG 2.1 AA compliant
- ✅ **Performance** : Optimisé GPU, 60fps maintenu

---

**🎨 Interface enrichie, performance préservée, accessibilité garantie !**