module.exports = function override(config, env) {
  if (env === 'production') {
    // Suppression des source maps en production
    config.devtool = false;
  }

  return config;
};