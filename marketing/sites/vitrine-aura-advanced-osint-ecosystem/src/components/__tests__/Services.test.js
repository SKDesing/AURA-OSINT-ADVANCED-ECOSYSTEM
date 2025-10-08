import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Services from '../Services';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

describe('Services Component', () => {
  test('renders services section', () => {
    render(<Services />);
    expect(screen.getByText('🎯 Nos Services')).toBeInTheDocument();
    expect(screen.getByText('Solutions OSINT professionnelles pour tous vos besoins')).toBeInTheDocument();
  });

  test('renders all service cards', () => {
    render(<Services />);
    expect(screen.getByText('OSINT Investigation')).toBeInTheDocument();
    expect(screen.getByText('Intelligence Forensique')).toBeInTheDocument();
    expect(screen.getByText('Développement Custom')).toBeInTheDocument();
    expect(screen.getByText('Consulting & Formation')).toBeInTheDocument();
    expect(screen.getByText('Sécurité & Compliance')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument();
  });

  test('renders service prices', () => {
    render(<Services />);
    expect(screen.getByText('À partir de 500€/mois')).toBeInTheDocument();
    expect(screen.getByText('À partir de 2000€/mois')).toBeInTheDocument();
    expect(screen.getByText('Sur devis')).toBeInTheDocument();
  });

  test('renders CTA section', () => {
    render(<Services />);
    expect(screen.getByText('Besoin d\'une solution personnalisée ?')).toBeInTheDocument();
    expect(screen.getByText('Demander un devis')).toBeInTheDocument();
  });
});