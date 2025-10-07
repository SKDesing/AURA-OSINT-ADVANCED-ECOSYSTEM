# 🎯 AURA OSINT - Site Vitrine Professionnel

> Site vitrine moderne et performant pour présenter la plateforme AURA OSINT aux professionnels de la cybersécurité et de l'investigation numérique.

## 🚀 Caractéristiques

### Design & UX
- **Design moderne** inspiré des meilleures pratiques visuelles
- **Animations fluides** avec Framer Motion
- **Responsive design** mobile-first
- **Performance optimisée** (Lighthouse 90+)
- **SEO avancé** avec Open Graph et métadonnées

### Contenu Professionnel
- **Hero section** avec dashboard preview interactif
- **Fonctionnalités détaillées** avec icônes et descriptions
- **Architecture technique** avec diagrammes
- **Témoignages clients** et cas d'usage
- **Tarification transparente** et contact direct

### Technologies
- **React 18** avec TypeScript
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes
- **CSS moderne** avec design tokens AURA
- **Intersection Observer** pour les animations au scroll

## 📁 Structure du Projet

```
showcase-landing/
├── public/
│   ├── index.html          # Template HTML avec SEO
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico         # Favicon AURA
├── src/
│   ├── components/
│   │   ├── Hero.tsx        # Section hero avec dashboard preview
│   │   ├── Features.tsx    # Fonctionnalités détaillées
│   │   ├── Architecture.tsx # Diagrammes techniques
│   │   ├── Testimonials.tsx # Témoignages clients
│   │   ├── Pricing.tsx     # Plans et tarification
│   │   ├── Contact.tsx     # Formulaire de contact
│   │   └── Footer.tsx      # Footer avec liens
│   ├── assets/            # Images et ressources
│   ├── hooks/             # Hooks React personnalisés
│   ├── utils/             # Utilitaires
│   ├── App.tsx            # Composant principal
│   ├── App.css            # Styles globaux avec tokens AURA
│   └── index.tsx          # Point d'entrée
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🛠️ Installation & Développement

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation
```bash
cd showcase-landing
npm install
```

### Développement
```bash
npm start
# Ouvre http://localhost:3000
```

### Build Production
```bash
npm run build
# Génère le dossier build/ optimisé
```

### Tests Performance
```bash
npm run lighthouse
# Génère un rapport Lighthouse
```

## 🎨 Design System

### Couleurs AURA
- **Primary**: #336AEA (Bleu énergique)
- **Accent Teal**: #17D1C6
- **Accent Coral**: #FF7D6A
- **Success**: #27AE60
- **Warning**: #F2C94C
- **Danger**: #E74C3C

### Typographie
- **Font**: Inter (Google Fonts)
- **Tailles**: 64px (hero) → 14px (labels)
- **Poids**: 400, 500, 600, 700

### Espacements
- **Container**: 1200px max-width
- **Sections**: 120px padding vertical
- **Grilles**: 80px gap entre colonnes

## 📊 Performance & SEO

### Objectifs Performance
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse**: ≥ 90 (toutes catégories)

### SEO Optimisé
- **Métadonnées** complètes (title, description, keywords)
- **Open Graph** pour réseaux sociaux
- **Schema.org** pour les moteurs de recherche
- **Sitemap** et robots.txt
- **Images optimisées** avec alt text

## 🚀 Déploiement

### Options de Déploiement
1. **Netlify** (recommandé)
   ```bash
   npm run build
   # Drag & drop du dossier build/
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **GitHub Pages**
   ```bash
   npm run build
   # Push vers gh-pages branch
   ```

4. **Serveur personnalisé**
   ```bash
   npm run build
   # Servir le contenu de build/ avec nginx/apache
   ```

### Variables d'Environnement
```bash
# .env.production
REACT_APP_API_URL=https://api.aura-osint.com
REACT_APP_CONTACT_EMAIL=contact@aura-osint.com
REACT_APP_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## 🔧 Configuration

### Scripts Disponibles
- `npm start` - Serveur de développement
- `npm run build` - Build production
- `npm test` - Tests unitaires
- `npm run lighthouse` - Audit performance
- `npm run deploy` - Déploiement automatique

### Personnalisation
1. **Contenu**: Modifier les textes dans les composants
2. **Design**: Ajuster les tokens CSS dans App.css
3. **Images**: Remplacer les assets dans public/
4. **Analytics**: Ajouter Google Analytics/Plausible

## 📈 Métriques & Analytics

### KPIs à Suivre
- **Taux de conversion** (contact/démo)
- **Temps sur la page**
- **Taux de rebond**
- **Sources de trafic**
- **Performance technique**

### Outils Recommandés
- **Google Analytics 4** pour le comportement
- **Hotjar** pour les heatmaps
- **Lighthouse CI** pour la performance
- **Sentry** pour les erreurs

## 🤝 Contribution

### Workflow
1. Fork le projet
2. Créer une branche feature
3. Développer et tester
4. Créer une Pull Request

### Standards
- **Code**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Tests**: Jest + React Testing Library
- **Performance**: Lighthouse CI

---

**🎯 Objectif**: Convertir les visiteurs en prospects qualifiés pour AURA OSINT avec une expérience utilisateur exceptionnelle et des performances optimales.