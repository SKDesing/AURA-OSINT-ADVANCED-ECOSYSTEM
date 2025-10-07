const { chromium } = require('playwright');
const endpoints = [
  { name: "GUI", url: "http://localhost:3000" },
  { name: "Frontend React", url: "http://localhost:3002" },
  { name: "API Analytics", url: "http://localhost:4002/api/status", api: true }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test GUI
  try {
    await page.goto(endpoints[0].url, { timeout: 5000 });
    const title = await page.title();
    console.log(`[GUI] Titre détecté : ${title}`);
    await page.screenshot({ path: 'test-gui.png' });
  } catch (err) {
    console.log(`[GUI] Erreur d'accès : ${err.message}`);
  }

  // Test Frontend React
  try {
    await page.goto(endpoints[1].url, { timeout: 5000 });
    const h1 = await page.$('h1');
    if (h1) {
      console.log("[Frontend React] H1 détecté");
    }
    await page.screenshot({ path: 'test-frontend.png' });
  } catch (err) {
    console.log(`[Frontend React] Erreur d'accès : ${err.message}`);
  }

  // Test API status
  const fetch = require('node-fetch');
  try {
    const res = await fetch(endpoints[2].url);
    const json = await res.json();
    if (json.status === "running") {
      console.log("[API Analytics] OK");
    } else {
      console.log("[API Analytics] Réponse inattendue", json);
    }
  } catch (err) {
    console.log(`[API Analytics] Erreur d'accès : ${err.message}`);
  }

  await browser.close();
})();