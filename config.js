module.exports = {
  get: (key) => {
    const config = {
      'system.name': 'AURA TikTok Intelligence',
      'ports.gui': 3000
    };
    return config[key];
  },
  getPort: (service) => {
    const ports = { gui: 3000, api: 4011 };
    return ports[service];
  },
  validate: () => true
};