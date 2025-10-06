import React from 'react';
import { HeroSearch } from './components/hero/HeroSearch';
import { MegaMenu } from './components/navigation/MegaMenu';
import { CardMasonry } from './components/cards/CardMasonry';
import './styles/App.css';

const mockItems = [
  {
    id: '1',
    title: 'Rapport Forensique TikTok Live',
    image: '/assets/forensic-report.jpg',
    type: 'report' as const,
    tags: ['PDF', 'Forensique', 'TikTok'],
    author: 'AURA Team',
    downloads: 1247,
    views: 5630,
    likes: 89,
    description: 'Analyse complète d\'un live TikTok avec extraction des métadonnées'
  },
  {
    id: '2', 
    title: 'Dashboard Analytics',
    image: '/assets/dashboard.jpg',
    type: 'template' as const,
    tags: ['Dashboard', 'Analytics', 'Temps réel'],
    downloads: 892,
    views: 3421,
    isPremium: true
  }
];

function App() {
  return (
    <div className="App">
      <MegaMenu sections={[]} />
      <HeroSearch 
        onSearch={(query) => console.log('Search:', query)}
      />
      <section className="features-section">
        <div className="container">
          <h2>Découvrez nos ressources</h2>
          <CardMasonry 
            items={mockItems}
            onItemClick={(item) => console.log('Item clicked:', item)}
            onDownload={(item) => console.log('Download:', item)}
          />
        </div>
      </section>
    </div>
  );
}

export default App;