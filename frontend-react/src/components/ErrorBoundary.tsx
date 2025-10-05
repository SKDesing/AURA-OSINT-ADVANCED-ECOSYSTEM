import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#ff4444', marginBottom: '15px' }}>Erreur de Composant</h2>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>
            Une erreur s'est produite lors du rendu de ce composant.
          </p>
          {this.state.error && (
            <details style={{ 
              backgroundColor: '#333', 
              padding: '15px', 
              borderRadius: '5px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Détails de l'erreur
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                color: '#ff6666',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ff88',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;