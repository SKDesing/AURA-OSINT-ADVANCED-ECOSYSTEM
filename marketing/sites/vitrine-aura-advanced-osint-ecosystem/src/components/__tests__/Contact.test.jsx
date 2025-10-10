import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../Contact';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

describe('Contact Component', () => {
  test('renders contact form', () => {
    render(<Contact />);
    expect(screen.getByText('📞 Contactez-nous')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom complet/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email professionnel/)).toBeInTheDocument();
  });

  test('form validation works', async () => {
    render(<Contact />);
    
    const submitButton = screen.getByText('Envoyer le message');
    fireEvent.click(submitButton);
    
    // Required fields should prevent submission
    expect(screen.getByLabelText(/Nom complet/)).toBeRequired();
    expect(screen.getByLabelText(/Email professionnel/)).toBeRequired();
  });

  test('form submission works', async () => {
    global.alert = jest.fn();
    
    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/Nom complet/), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/Email professionnel/), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: 'Test message' }
    });
    
    fireEvent.click(screen.getByText('Envoyer le message'));
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Message envoyé ! Nous vous recontacterons sous 24h.');
    });
  });
});