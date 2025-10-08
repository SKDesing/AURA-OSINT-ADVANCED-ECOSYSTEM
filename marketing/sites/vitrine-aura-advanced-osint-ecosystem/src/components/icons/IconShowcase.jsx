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
