const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Connectez-vous à TikTok dans la fenêtre qui s\'ouvre...');
  await page.goto('https://www.tiktok.com/login');
  
  console.log('Appuyez sur Entrée après connexion...');
  await new Promise(resolve => process.stdin.once('data', resolve));

  await context.storageState({ path: 'tiktok-session.json' });
  console.log('Session sauvegardée !');
  await browser.close();
})();