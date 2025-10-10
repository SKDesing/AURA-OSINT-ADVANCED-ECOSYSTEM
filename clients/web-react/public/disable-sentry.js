// Désactiver Sentry complètement
window.Sentry = {
  init: () => {},
  captureException: () => {},
  captureMessage: () => {},
  addBreadcrumb: () => {},
  setUser: () => {},
  setTag: () => {},
  setContext: () => {},
  configureScope: () => {}
};