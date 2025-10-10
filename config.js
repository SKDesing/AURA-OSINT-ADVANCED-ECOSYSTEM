const defaults = {
  system: { name: 'AURA TikTok Intelligence' },
  ports: { gui: 3000, api: 4011 },
};

function get(path) {
  return String(path || '').split('.').reduce((a, k) => a?.[k], defaults);
}

function getPort(name) {
  return defaults.ports[name];
}

function validate() {
  if (!defaults.system?.name) throw new Error('system.name missing');
  if (!defaults.ports?.gui || !defaults.ports?.api) throw new Error('ports missing');
  return true;
}

function isDevelopment() {
  return process.env.NODE_ENV !== 'production';
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

module.exports = { get, getPort, validate, isDevelopment, isProduction };