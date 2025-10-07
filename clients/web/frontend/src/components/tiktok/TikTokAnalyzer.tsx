'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSSE } from '@/hooks/useSSE';
import { Play, Activity, Users, MessageCircle, Download } from 'lucide-react';

export function TikTokAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const { events, isConnected } = useSSE(['job.update', 'job.done']);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    setIsAnalyzing(true);
    // TODO: Call API
    setTimeout(() => {
      setJobId('job_' + Math.random().toString(36).substr(2, 9));
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Analysis Form */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Démarrer une nouvelle analyse
        </h2>
        
        <div className="space-y-4">
          <Input
            label="URL du live TikTok ou handle utilisateur"
            placeholder="https://tiktok.com/@username/live ou @username"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            hint="Collez l'URL complète du live ou saisissez le handle (@username)"
          />
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAnalyze}
              loading={isAnalyzing}
              leftIcon={<Play className="w-5 h-5" />}
              disabled={!url.trim()}
            >
              Lancer l'analyse
            </Button>
            
            <div className="text-sm text-gray-500">
              💡 L'analyse démarre immédiatement et capture les données en temps réel
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      {jobId && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Viewers</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-green-600">+12% vs 5min</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Messages/min</h3>
              <MessageCircle className="w-5 h-5 text-accent-teal" />
            </div>
            <div className="text-2xl font-bold text-gray-900">89</div>
            <div className="text-sm text-gray-500">Pic: 156</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Durée</h3>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">12:34</div>
            <div className="text-sm text-gray-500">En cours</div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      {jobId && (
        <div className="card">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Messages récents
            </h3>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
          </div>
          
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {[
              { user: 'user123', message: 'Salut tout le monde! 👋', time: '12:34:56' },
              { user: 'fan_tiktok', message: 'Super live!', time: '12:34:52' },
              { user: 'viewer_pro', message: 'Question: comment faire...?', time: '12:34:48' }
            ].map((msg, i) => (
              <div key={i} className="flex items-start space-x-3 text-sm">
                <span className="text-gray-500 font-mono text-xs">{msg.time}</span>
                <span className="font-medium text-primary-600">@{msg.user}</span>
                <span className="text-gray-900 flex-1">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}