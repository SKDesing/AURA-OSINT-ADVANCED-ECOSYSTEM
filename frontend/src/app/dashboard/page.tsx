import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Search, 
  FileText, 
  Activity, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-card p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur AURA OSINT
          </h1>
          <p className="text-primary-100 mb-6">
            Démarrez votre investigation en quelques clics. Interface débutant activée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" leftIcon={<Play className="w-5 h-5" />}>
              Nouvelle analyse TikTok
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
              leftIcon={<Search className="w-5 h-5" />}
            >
              Recherche OSINT
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analyses actives</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-card flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1">vs hier</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessions TikTok</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <div className="w-12 h-12 bg-accent-teal/10 rounded-card flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-teal" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Dernière: il y a 2h</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rapports générés</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-card flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">23 ce mois</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-gray-900">4.2m</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-card flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">par analyse</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Activité récente
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                id: 1,
                type: 'TikTok Live',
                target: '@username_example',
                status: 'done',
                time: 'il y a 2h'
              },
              {
                id: 2,
                type: 'Recherche OSINT',
                target: 'Pack France Gov',
                status: 'running',
                time: 'il y a 5m'
              }
            ].map((job) => (
              <div key={job.id} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'done' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.target}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-xs text-gray-500">{job.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}