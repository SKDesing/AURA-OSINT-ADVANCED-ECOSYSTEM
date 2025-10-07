import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Play, 
  Search, 
  FileText, 
  Users, 
  BookOpen, 
  MessageCircle,
  Github,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '../ui/Button.js';

interface MenuSection {
  title: string;
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
    badge?: string;
  }>;
}

interface MegaMenuProps {
  sections: MenuSection[];
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ sections }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      label: 'Fonctionnalités',
      key: 'features',
      sections: [
        {
          title: 'Analyse & Investigation',
          items: [
            { label: 'TikTok Live Analyzer', href: '/features/tiktok', icon: <Play />, description: 'Analyse temps réel des lives', badge: 'Populaire' },
            { label: 'Dorks Builder', href: '/features/dorks', icon: <Search />, description: 'Requêtes OSINT avancées' },
            { label: 'Corrélation IA', href: '/features/correlation', icon: <Zap />, description: 'Matching identités ML', badge: 'Nouveau' },
            { label: 'Export Forensique', href: '/features/export', icon: <FileText />, description: 'Rapports légaux certifiés' }
          ]
        },
        {
          title: 'Sécurité & Compliance',
          items: [
            { label: 'Chiffrement git-crypt', href: '/security/encryption', icon: <Shield />, description: 'Protection données sensibles' },
            { label: 'Chain of Custody', href: '/security/custody', icon: <FileText />, description: 'Traçabilité forensique' },
            { label: 'Audit RGPD', href: '/security/gdpr', icon: <Shield />, description: 'Conformité européenne' }
          ]
        }
      ]
    },
    {
      label: 'Ressources',
      key: 'resources',
      sections: [
        {
          title: 'Documentation',
          items: [
            { label: 'Guide débutant', href: '/docs/getting-started', icon: <BookOpen />, description: 'Premiers pas avec AURA' },
            { label: 'API Reference', href: '/docs/api', icon: <FileText />, description: 'Documentation technique' },
            { label: 'Cas d\'usage', href: '/docs/use-cases', icon: <Users />, description: 'Exemples concrets' }
          ]
        },
        {
          title: 'Communauté',
          items: [
            { label: 'Discord', href: 'https://discord.gg/aura', icon: <MessageCircle />, description: 'Support communautaire' },
            { label: 'GitHub', href: 'https://github.com/SKDesing', icon: <Github />, description: 'Code source ouvert' },
            { label: 'Blog', href: '/blog', icon: <BookOpen />, description: 'Actualités OSINT' }
          ]
        }
      ]
    }
  ];

  return (
    <header className={`mega-menu-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Zap className="logo-icon" />
          <span className="logo-text">AURA OSINT</span>
        </div>

        {/* Navigation principale */}
        <nav className="header-nav">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className="nav-item"
              onMouseEnter={() => setActiveMenu(item.key)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="nav-button">
                {item.label}
                <ChevronDown className="nav-chevron" />
              </button>

              <AnimatePresence>
                {activeMenu === item.key && (
                  <motion.div
                    className="mega-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-content">
                      {item.sections.map((section) => (
                        <div key={section.title} className="dropdown-section">
                          <h3 className="section-title">{section.title}</h3>
                          <div className="section-items">
                            {section.items.map((menuItem) => (
                              <a
                                key={menuItem.label}
                                href={menuItem.href}
                                className="menu-item-link"
                              >
                                <div className="item-icon">{menuItem.icon}</div>
                                <div className="item-content">
                                  <div className="item-header">
                                    <span className="item-label">{menuItem.label}</span>
                                    {menuItem.badge && (
                                      <span className="item-badge">{menuItem.badge}</span>
                                    )}
                                  </div>
                                  {menuItem.description && (
                                    <p className="item-description">{menuItem.description}</p>
                                  )}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <a href="/pricing" className="nav-link">Tarifs</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <Button variant="ghost" size="sm">
            Connexion
          </Button>
          <Button variant="primary" size="sm">
            Essai gratuit
          </Button>
        </div>

        {/* Menu mobile */}
        <button className="mobile-menu-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};