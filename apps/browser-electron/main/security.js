const { app, session } = require('electron');

/**
 * Security hardening for AURA Browser
 */
class SecurityManager {
  static initialize() {
    // Disable Node.js integration in renderer processes
    app.on('web-contents-created', (event, contents) => {
      contents.on('new-window', (event, navigationUrl) => {
        // Prevent new window creation
        event.preventDefault();
      });

      contents.setWindowOpenHandler(({ url }) => {
        // Deny all window.open() calls
        return { action: 'deny' };
      });

      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        // Only allow localhost navigation
        if (parsedUrl.origin !== 'http://localhost:3000' && 
            parsedUrl.origin !== 'http://localhost:4010') {
          event.preventDefault();
        }
      });
    });

    // Set CSP for all sessions
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' http://localhost:* ws://localhost:*; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "connect-src 'self' http://localhost:* ws://localhost:*; " +
            "img-src 'self' data: blob:; " +
            "style-src 'self' 'unsafe-inline';"
          ]
        }
      });
    });

    // Disable remote module
    app.on('remote-require', (event) => {
      event.preventDefault();
    });

    app.on('remote-get-global', (event) => {
      event.preventDefault();
    });

    app.on('remote-get-builtin', (event) => {
      event.preventDefault();
    });

    app.on('remote-get-current-window', (event) => {
      event.preventDefault();
    });

    app.on('remote-get-current-web-contents', (event) => {
      event.preventDefault();
    });
  }
}

module.exports = { SecurityManager };