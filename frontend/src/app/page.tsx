import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Play, Search, Zap, Shield, BarChart3, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-soft flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AURA OSINT</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Fonctionnalités
              </a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Documentation
              </a>
              <Button variant="outline" size="sm">
                Connexion
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Démarrer une analyse TikTok en{' '}
            <span className="text-primary-600">2 étapes</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-balance max-w-2xl mx-auto">
            Moteur d'intelligence forensique cross-plateforme pour l'analyse OSINT, 
            la corrélation d'identités et l'investigation numérique.
          </p>

          {/* Quick Start Form */}
          <div className="card-elevated max-w-2xl mx-auto p-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">1</span>
                <span>Coller une URL de live TikTok ou un handle</span>
              </div>
              
              <Input
                placeholder="https://tiktok.com/@username/live ou @username"
                leftIcon={<Search className="w-4 h-4" />}
                hint="Astuce: vous pouvez coller une URL de live TikTok directement ici."
              />
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">2</span>
                <span>Lancer l'analyse</span>
              </div>
              
              <Button size="lg" className="w-full" leftIcon={<Play className="w-5 h-5" />}>
                Lancer l'analyse
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-card flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyse temps réel
              </h3>
              <p className="text-gray-600 text-sm">
                Monitoring live des métriques, viewers, messages et détection de spam
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-card flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-accent-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                OSINT avancé
              </h3>
              <p className="text-gray-600 text-sm">
                Corrélation d'identités cross-plateforme avec ML et scoring de confiance
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-card flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Forensique sécurisé
              </h3>
              <p className="text-gray-600 text-sm">
                Chain of custody, chiffrement automatique et export légal
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-600 rounded-card p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Prêt à commencer votre investigation ?
            </h3>
            <p className="text-primary-100 mb-6">
              Interface zéro CLI, setup en une commande, résultats immédiats
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" leftIcon={<Download className="w-5 h-5" />}>
                Installation rapide
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Voir la documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary-600 rounded-soft flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-600">AURA OSINT v2.0.0</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Documentation</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}