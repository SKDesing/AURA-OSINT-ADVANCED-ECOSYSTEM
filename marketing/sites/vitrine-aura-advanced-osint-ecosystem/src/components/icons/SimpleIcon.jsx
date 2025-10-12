import React from 'react';

export default function SimpleIcon({ 
  icon: Icon, 
  color = '#00ff88',
  size = '48px',
  className = '',
  ...props 
}) {
  const style = {
    width: size,
    height: size,
    color: color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={style} className={className} {...props}>
      <Icon />
    </div>
  );
}