module.exports = function ensureElectronLaunch() {
  const mustBeElectron = process.env.AURA_BROWSER_ONLY !== '0';
  const launchedByElectron = process.env.ELECTRON_LAUNCH === '1';
  
  if (mustBeElectron && !launchedByElectron) {
    console.error('[AURA] Backend blocked: must be launched via AURA Browser (Electron).');
    console.error('[AURA] Use: pnpm run dev (launches Electron + orchestrates services)');
    process.exit(1);
  }
};