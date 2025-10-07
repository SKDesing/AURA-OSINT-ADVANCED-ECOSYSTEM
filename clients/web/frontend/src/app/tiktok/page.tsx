import { AppShell } from '@/components/layout/AppShell';
import { TikTokAnalyzer } from '@/components/tiktok/TikTokAnalyzer';

export default function TikTokPage() {
  return (
    <AppShell>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analyse TikTok Live
            </h1>
            <p className="text-gray-600">
              Analysez un live TikTok en temps réel pour collecter métriques, messages et données forensiques.
            </p>
          </div>
          
          <TikTokAnalyzer />
        </div>
      </div>
    </AppShell>
  );
}