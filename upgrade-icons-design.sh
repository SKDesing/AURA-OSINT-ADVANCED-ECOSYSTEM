#!/bin/bash
# 🎨 Upgrade design des icônes - AURA OSINT

echo "🎨 UPGRADE DESIGN ICÔNES - AURA OSINT"
echo "======================================"
echo ""

PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
VITRINE_PATH="$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"

cd "$VITRINE_PATH" || exit 1

# 1. Installer bibliothèques supplémentaires
echo "📦 Installation bibliothèques design..."
npm install --save phosphor-react @emotion/styled

# 2. Créer composant EnhancedIcon
echo "✨ Création EnhancedIcon component..."
mkdir -p src/components/icons

cat > src/components/icons/EnhancedIcon.jsx << 'EOF'
import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
  50% { filter: drop-shadow(0 0 16px currentColor); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  color: ${props => props.color || '#00ff88'};
  filter: drop-shadow(0 0 8px ${props => props.color || '#00ff88'});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    animation: ${glow} 2s ease-in-out infinite;
    transform: scale(1.05);
    cursor: pointer;
  }
  
  ${props => props.pulse && `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  
  ${props => props.rotate && `
    animation: ${rotate} 3s linear infinite;
  `}
  
  ${props => props.background && `
    background: linear-gradient(135deg, 
      ${props.color}15, 
      ${props.color}05
    );
    border-radius: ${props.rounded ? '50%' : '12px'};
    padding: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid ${props.color}30;
    box-shadow: 0 8px 32px ${props.color}20;
  `}
  
  svg {
    width: 100%;
    height: 100%;
    stroke-width: ${props => props.strokeWidth || '2'};
  }
`;

export default function EnhancedIcon({ 
  icon: Icon, 
  color = '#00ff88',
  size = '48px',
  pulse = false,
  rotate = false,
  background = false,
  rounded = false,
  strokeWidth = '2',
  className = '',
  ...props 
}) {
  return (
    <IconContainer 
      color={color}
      size={size}
      pulse={pulse}
      rotate={rotate}
      background={background}
      rounded={rounded}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    >
      <Icon />
    </IconContainer>
  );
}
EOF

echo "✅ EnhancedIcon créé"

# 3. Créer showcase
echo "📝 Création showcase..."
cat > src/components/icons/IconShowcase.jsx << 'EOF'
import React from 'react';
import styled from 'styled-components';
import EnhancedIcon from './EnhancedIcon';
import { Shield, Target, Eye, Zap, Database, Network, Lock, Search } from 'lucide-react';
import { ShieldCheck, MagnifyingGlass, Target as TargetPhosphor, Database as DatabasePhosphor } from 'phosphor-react';

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: #0a0b0d;
  min-height: 100vh;
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1a1b1e, #0f1012);
  border: 1px solid #00ff8820;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00ff88;
    box-shadow: 0 8px 32px #00ff8820;
    transform: translateY(-4px);
  }
`;

const Label = styled.span`
  color: #a0a0a0;
  font-size: 0.875rem;
  font-family: 'Space Mono', monospace;
  text-align: center;
`;

export default function IconShowcase() {
  return (
    <ShowcaseGrid>
      <IconCard>
        <EnhancedIcon icon={Shield} color="#00ff88" size="64px" background />
        <Label>Shield (Glow)</Label>
      </IconCard>
      
      <IconCard>
        <EnhancedIcon icon={Target} color="#00d4ff" size="64px" background pulse />
        <Label>Target (Pulse)</Label>
      </IconCard>
      
      <IconCard>
        <EnhancedIcon icon={Eye} color="#ff00ff" size="64px" background rounded />
        <Label>Eye (Rounded)</Label>
      </IconCard>
      
      <IconCard>
        <EnhancedIcon icon={Zap} color="#ffff00" size="64px" background pulse rotate />
        <Label>Zap (All FX)</Label>
      </IconCard>
      
      <IconCard>
        <EnhancedIcon icon={() => <ShieldCheck weight="duotone" />} color="#00ff88" size="64px" background />
        <Label>Shield Phosphor</Label>
      </IconCard>
      
      <IconCard>
        <EnhancedIcon icon={() => <MagnifyingGlass weight="duotone" />} color="#00d4ff" size="64px" background pulse />
        <Label>Search Phosphor</Label>
      </IconCard>
    </ShowcaseGrid>
  );
}
EOF

echo "✅ Showcase créé"

echo ""
echo "✅ UPGRADE TERMINÉ !"
echo ""
echo "🎯 UTILISATION:"
echo "import EnhancedIcon from './components/icons/EnhancedIcon';"
echo "import { Shield } from 'lucide-react';"
echo ""
echo "<EnhancedIcon icon={Shield} color='#00ff88' size='64px' background pulse />"
echo ""
echo "🔗 Voir showcase: http://localhost:3000 (ajouter route /icons)"