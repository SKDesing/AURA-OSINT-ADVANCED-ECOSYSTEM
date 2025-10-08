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
