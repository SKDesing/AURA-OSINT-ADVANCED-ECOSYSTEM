const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getBraveExecutablePath } = require('../utils/getBravePath');

puppeteer.use(StealthPlugin());

class PuppeteerService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async startBrowser() {
        try {
            const bravePath = getBraveExecutablePath();

            this.browser = await puppeteer.launch({
                headless: "new",
                executablePath: bravePath,
                userDataDir: process.env.USER_DATA_DIR || './data/browser_profile',
                defaultViewport: null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--disable-gpu',
                    '--disable-blink-features=AutomationControlled'
                ]
            });

            console.log("🚀 Navigateur Brave démarré avec succès.");
            return this.browser;
        } catch (error) {
            console.error("❌ Échec du démarrage du navigateur Brave:", error.message);
            process.exit(1);
        }
    }

    async createPage() {
        if (!this.browser) {
            await this.startBrowser();
        }
        this.page = await this.browser.newPage();
        return this.page;
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

module.exports = PuppeteerService;