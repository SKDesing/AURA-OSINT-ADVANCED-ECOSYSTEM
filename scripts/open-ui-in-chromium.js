// Ouvre l'UI AURA dans votre Chromium via Puppeteer (profil isolé)
const path = require('node:path');

(async () => {
  const ChromiumLauncher = require(path.resolve(__dirname, '..', 'chromium-launcher.js'));
  const launcher = new ChromiumLauncher({
    headless: false,
    devtools: false,
    userDataDir: path.resolve(process.cwd(), '.profiles', 'ui')
  });
  const url = process.env.AURA_UI_URL || 'http://localhost:3000';
  const { browser, page } = await launcher.launchWithUrl(url);
  console.log(`✅ UI ouverte dans Chromium: ${url}`);
  page.on('close', () => browser.close());
})().catch(err => {
  console.error('❌ Impossible d\'ouvrir Chromium:', err);
  process.exit(1);
});