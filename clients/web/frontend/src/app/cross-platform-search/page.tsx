'use client';
import { useState } from 'react';

export default function CrossPlatformSearch() {
  const [query, setQuery] = useState('');
  const [platforms, setPlatforms] = useState(['tiktok', 'instagram']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/cross-platform-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, platforms })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Recherche Cross-Platform</h1>
      
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un utilisateur, hashtag, contenu..."
          className="w-full p-3 bg-gray-800 rounded-lg text-white"
        />
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Plateformes:</h3>
        <div className="flex gap-4">
          {['tiktok', 'instagram', 'twitter', 'facebook'].map(platform => (
            <label key={platform} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={platforms.includes(platform)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPlatforms([...platforms, platform]);
                  } else {
                    setPlatforms(platforms.filter(p => p !== platform));
                  }
                }}
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || !query}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-80 disabled:opacity-50"
      >
        {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
      </button>

      {results && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Résultats:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
