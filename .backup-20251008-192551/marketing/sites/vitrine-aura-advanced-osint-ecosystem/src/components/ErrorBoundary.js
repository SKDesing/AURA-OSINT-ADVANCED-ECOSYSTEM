import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // En production, envoyer à Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🛡️ AURA - Erreur Détectée</h2>
            <p>Une erreur inattendue s'est produite. Nos équipes ont été notifiées.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recharger la page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Détails techniques</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;