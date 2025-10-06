import { AppShell } from '@/components/layout/AppShell';
import { DorksBuilder } from '@/components/dorks/DorksBuilder';

export default function DorksPage() {
  return (
    <AppShell>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Orchestrateur OSINT
            </h1>
            <p className="text-gray-600">
              Construisez et exécutez des requêtes OSINT avec des packs prédéfinis ou des requêtes personnalisées.
            </p>
          </div>
          
          <DorksBuilder />
        </div>
      </div>
    </AppShell>
  );
}