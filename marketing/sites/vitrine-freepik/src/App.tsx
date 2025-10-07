import React from 'react';
import { HeroSearch } from './components/hero/HeroSearch.tsx';
import { MegaMenu } from './components/navigation/MegaMenu.tsx';
import { CardMasonry } from './components/cards/CardMasonry.tsx';
import { ForensicDemo } from './components/forensic/ForensicDemo.tsx';
import { OSINTWorkflow } from './components/features/OSINTWorkflow.tsx';
import InvestigationTimeline from './components/forensic/InvestigationTimeline.tsx';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard.tsx';
import SystemHealth from './components/system/SystemHealth.tsx';
import InteractiveDemo from './components/demo/InteractiveDemo.tsx';
import APIDocumentation from './components/docs/APIDocumentation.tsx';
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
      <ForensicDemo />
      <OSINTWorkflow />
      <section className="analytics-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <InvestigationTimeline />
            <AnalyticsDashboard />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <InteractiveDemo />
            <APIDocumentation />
          </div>
          <div className="max-w-4xl mx-auto mt-8">
            <SystemHealth />
          </div>
        </div>
      </section>
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