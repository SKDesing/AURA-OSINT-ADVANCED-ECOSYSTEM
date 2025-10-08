import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../Hero';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

describe('Hero Component', () => {
  test('renders hero title correctly', () => {
    render(<Hero />);
    expect(screen.getByText(/AURA ADVANCED/)).toBeInTheDocument();
    expect(screen.getByText(/OSINT ECOSYSTEM/)).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<Hero />);
    expect(screen.getByText('Accéder à l\'Interface')).toBeInTheDocument();
    expect(screen.getByText('Voir le Code Source')).toBeInTheDocument();
  });

  test('button clicks work correctly', () => {
    const mockOpen = jest.fn();
    global.window.open = mockOpen;

    render(<Hero />);
    
    const interfaceButton = screen.getByText('Accéder à l\'Interface');
    fireEvent.click(interfaceButton);
    expect(mockOpen).toHaveBeenCalledWith('http://localhost:3000', '_blank');
  });
});