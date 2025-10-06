'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Play, Package, Search } from 'lucide-react';

export function DorksBuilder() {
  const [query, setQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const packs = [
    { id: 'france-gov', name: 'France Gouvernement', description: 'Sites officiels français' },
    { id: 'social-media', name: 'Réseaux Sociaux', description: 'Profils et contenus sociaux' },
    { id: 'leaked-data', name: 'Données Exposées', description: 'Fichiers et bases exposés' }
  ];

  return (
    <div className="space-y-8">
      {/* Pack Selection */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Packs OSINT Prédéfinis
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`p-4 border rounded-soft cursor-pointer transition-colors ${
                selectedPack === pack.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPack(pack.id)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Package className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">{pack.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{pack.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Query */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Requête Personnalisée
        </h2>
        
        <div className="space-y-4">
          <Input
            label="Requête OSINT"
            placeholder='site:example.com "données sensibles" filetype:pdf'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            hint="Utilisez les opérateurs Google Dorks standards"
          />
          
          <div className="flex items-center gap-4">
            <Button
              leftIcon={<Play className="w-5 h-5" />}
              disabled={!query.trim() && !selectedPack}
            >
              Lancer la recherche
            </Button>
            
            <div className="text-sm text-gray-500">
              💡 Sélectionnez un pack ou saisissez une requête personnalisée
            </div>
          </div>
        </div>
      </div>

      {/* Results Preview */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Résultats de recherche
          </h3>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            Aucune recherche lancée. Sélectionnez un pack ou saisissez une requête pour commencer.
          </div>
        </div>
      </div>
    </div>
  );
}