// AURA TikTok UI Components - React Implementation

import React from 'react';
import '../assets/ui/theme.css';

// corposant Icon générique
export const TikTokIcon = ({ 
  name, 
  size = 'md', 
  glow = false, 
  animated = false, 
  onClick,
  className = '' 
}) => {
  const sizeClass = size === 'lg' ? 'tiktok-icon-lg' : 'tiktok-icon';
  const glowClass = glow ? 'glow-primary' : '';
  const animatedClass = animated ? 'animate-pulse-glow' : '';
  
  return (
    <img
      src={`/assets/ui/icons/${name}.svg`}
      alt={name}
      className={`${sizeClass} ${glowClass} ${animatedClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

// Navigation TikTok
export const TikTokNav = ({ user, onNavigate }) => {
  return (
    <nav className="tiktok-nav">
      <div className="flex items-center">
        <img 
          src="/assets/ui/logos/aura-logo.svg" 
          alt="AURA" 
          className="h-10"
        />
      </div>
      
      <div className="flex items-center space-x-6">
        <TikTokIcon 
          name="home" 
          glow={true} 
          onClick={() => onNavigate('home')}
        />
        <TikTokIcon 
          name="search" 
          className="glow-secondary"
          onClick={() => onNavigate('search')}
        />
        <TikTokIcon 
          name="analytics" 
          glow={true}
          onClick={() => onNavigate('analytics')}
        />
        <TikTokIcon 
          name="security" 
          className="glow-secondary"
          onClick={() => onNavigate('security')}
        />
      </div>
      
      <div className="flex items-center">
        <img 
          src={user?.avatar || "/assets/ui/logos/avatar-default.svg"}
          alt="Profile" 
          className="h-10 w-10 rounded-full glow-white"
        />
      </div>
    </nav>
  );
};

// Card TikTok
export const TikTokCard = ({ 
  title, 
  children, 
  icon, 
  className = '',
  animated = false 
}) => {
  const animatedClass = animated ? 'animate-float' : '';
  
  return (
    <div className={`tiktok-card ${animatedClass} ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <TikTokIcon name={icon} className="mr-3" glow={true} />}
          <h2 className="text-xl font-bold color-primary">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

// Bouton TikTok
export const TikTokButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = ''
}) => {
  const baseClass = 'tiktok-btn';
  const variantClass = variant === 'secondary' ? 'bg-secondary' : '';
  const sizeClass = size === 'lg' ? 'text-lg px-8 py-4' : '';
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <TikTokIcon name="loading" animated={true} className="mr-2" />
      ) : icon ? (
        <TikTokIcon name={icon} className="mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default {
  TikTokIcon,
  TikTokNav,
  TikTokCard,
  TikTokButton
};