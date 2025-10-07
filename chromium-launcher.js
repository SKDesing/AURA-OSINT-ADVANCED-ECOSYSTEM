// AURA Chromium Launcher
const puppeteer = require('puppeteer');
const ChromiumPathDetector = require('./src/utils/getChromiumPath');

class ChromiumLauncher {
    constructor(options = {}) {
        this.options = {
            headless: options.headless !== false,
            devtools: options.devtools || false,
            userDataDir: options.userDataDir || ChromiumPathDetector.getProfileDir(),
            ...options
        };
    }

    async launch() {
        const executablePath = ChromiumPathDetector.detect();
        
        const launchOptions = {
            headless: this.options.headless,
            devtools: this.options.devtools,
            userDataDir: this.options.userDataDir,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        };

        if (executablePath) {
            launchOptions.executablePath = executablePath;
        }

        console.log('🚀 Lancement de Chromium...');
        const browser = await puppeteer.launch(launchOptions);
        
        console.log('✅ Chromium démarré avec succès');
        return browser;
    }

    async launchWithUrl(url) {
        const browser = await this.launch();
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        return { browser, page };
    }
}

module.exports = ChromiumLauncher;