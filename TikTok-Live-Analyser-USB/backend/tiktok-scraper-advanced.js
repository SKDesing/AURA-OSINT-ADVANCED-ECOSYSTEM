const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const crypto = require('crypto');
const winston = require('winston');

// Configuration du logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'tiktok-scraper.log' }),
        new winston.transports.Console()
    ]
});

class TikTokForensicScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.profileData = {};
        this.evidenceHashes = [];
        this.networkRequests = [];
        this.maxRetries = 3;
    }

    async initialize() {
        try {
            this.browser = await puppeteer.launch({
                executablePath: '/snap/bin/brave',
                headless: false, // Mode visible pour inspection
                userDataDir: process.env.HOME + '/.config/BraveSoftware/Brave-Browser',
                args: [
                    '--no-first-run',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--no-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                ]
            });

            this.page = await this.browser.newPage();
            
            // Configuration avancée de la page
            await this.page.setViewport({ width: 1920, height: 1080 });
            await this.page.setExtraHTTPHeaders({
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            });

            // Intercepter les requêtes réseau
            await this.page.setRequestInterception(true);
            this.page.on('request', (request) => {
                const requestData = {
                    url: request.url(),
                    method: request.method(),
                    headers: request.headers(),
                    timestamp: Date.now()
                };
                
                this.networkRequests.push(requestData);
                logger.info('Network Request', requestData);
                request.continue();
            });

            // Intercepter les réponses
            this.page.on('response', async (response) => {
                if (response.url().includes('tiktok.com/api/') || 
                    response.url().includes('tiktok.com/node/') ||
                    response.url().includes('webcast')) {
                    try {
                        const responseData = await response.json();
                        logger.info('API Response Intercepted', {
                            url: response.url(),
                            status: response.status(),
                            data: responseData
                        });
                        
                        // Stocker les données API interceptées
                        this.storeEvidenceData('api_response', {
                            url: response.url(),
                            data: responseData,
                            timestamp: Date.now()
                        });
                    } catch (error) {
                        // Réponse non-JSON, ignorer
                    }
                }
            });

            logger.info('TikTok Forensic Scraper initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize scraper', { error: error.message });
            throw error;
        }
    }

    async scrapeProfile(username) {
        return this.retryOperation(async () => {
            const profileUrl = `https://www.tiktok.com/@${username}`;
            logger.info('Starting profile scrape', { username, url: profileUrl });

            await this.page.goto(profileUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Attendre le chargement du profil avec sélecteurs multiples
            await Promise.race([
                this.page.waitForSelector('[data-e2e="user-title"]', { timeout: 15000 }),
                this.page.waitForSelector('h1[data-e2e="user-title"]', { timeout: 15000 }),
                this.page.waitForSelector('[data-e2e="profile-header"]', { timeout: 15000 })
            ]).catch(() => {
                logger.warn('Profile selectors not found, continuing with available data');
            });

            // Extraire toutes les données visibles
            const profileData = await this.page.evaluate(() => {
                const data = {
                    // Informations de base
                    username: '',
                    displayName: '',
                    bio: '',
                    verified: false,
                    privateAccount: false,
                    
                    // Statistiques
                    followerCount: 0,
                    followingCount: 0,
                    videoCount: 0,
                    heartCount: 0,
                    
                    // URLs et médias
                    profilePicUrl: '',
                    profilePicHdUrl: '',
                    
                    // Métadonnées
                    pageTitle: document.title,
                    pageUrl: window.location.href,
                    
                    // Données techniques
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    cookieEnabled: navigator.cookieEnabled,
                    
                    // Données DOM brutes
                    rawHTML: '',
                    
                    // Scripts et données JSON
                    jsonData: [],
                    
                    // Liens externes
                    externalLinks: [],
                    
                    // Timestamp
                    scrapedAt: Date.now()
                };

                try {
                    // Username
                    const usernameEl = document.querySelector('[data-e2e="user-title"]');
                    if (usernameEl) data.username = usernameEl.textContent.trim();

                    // Display Name
                    const displayNameEl = document.querySelector('[data-e2e="user-subtitle"]');
                    if (displayNameEl) data.displayName = displayNameEl.textContent.trim();

                    // Bio
                    const bioEl = document.querySelector('[data-e2e="user-bio"]');
                    if (bioEl) data.bio = bioEl.textContent.trim();

                    // Vérification
                    const verifiedEl = document.querySelector('[data-e2e="user-title"] svg');
                    data.verified = !!verifiedEl;

                    // Photo de profil
                    const profilePicEl = document.querySelector('[data-e2e="user-avatar"] img');
                    if (profilePicEl) {
                        data.profilePicUrl = profilePicEl.src;
                        data.profilePicHdUrl = profilePicEl.src.replace(/\d+x\d+/, '720x720');
                    }

                    // Statistiques avec sélecteurs alternatifs
                    const statsSelectors = [
                        '[data-e2e="followers-count"]',
                        '[data-e2e="following-count"]', 
                        '[data-e2e="likes-count"]',
                        '[data-e2e="user-post-item"] strong'
                    ];
                    
                    // Essayer différents sélecteurs pour les stats
                    const followersEl = document.querySelector('[data-e2e="followers-count"]') || 
                                       document.querySelector('[data-e2e="user-post-item"]:nth-child(2) strong');
                    const followingEl = document.querySelector('[data-e2e="following-count"]') || 
                                       document.querySelector('[data-e2e="user-post-item"]:nth-child(1) strong');
                    const likesEl = document.querySelector('[data-e2e="likes-count"]') || 
                                   document.querySelector('[data-e2e="user-post-item"]:nth-child(3) strong');
                    
                    if (followersEl) data.followerCount = parseInt(followersEl.textContent.replace(/[^\d]/g, '')) || 0;
                    if (followingEl) data.followingCount = parseInt(followingEl.textContent.replace(/[^\d]/g, '')) || 0;
                    if (likesEl) data.heartCount = parseInt(likesEl.textContent.replace(/[^\d]/g, '')) || 0;

                    // Compter les vidéos
                    const videoElements = document.querySelectorAll('[data-e2e="user-post-item-list"] > div');
                    data.videoCount = videoElements.length;

                    // Extraire les liens externes
                    const links = document.querySelectorAll('a[href]');
                    links.forEach(link => {
                        const href = link.href;
                        if (!href.includes('tiktok.com') && 
                            (href.includes('http') || href.includes('mailto:'))) {
                            data.externalLinks.push({
                                url: href,
                                text: link.textContent.trim(),
                                title: link.title || ''
                            });
                        }
                    });

                    // Extraire les données JSON des scripts
                    const scripts = document.querySelectorAll('script');
                    scripts.forEach(script => {
                        if (script.textContent.includes('window.__UNIVERSAL_DATA_FOR_REHYDRATION__') ||
                            script.textContent.includes('window.__DEFAULT_SCOPE__')) {
                            try {
                                const jsonMatch = script.textContent.match(/window\.__[A-Z_]+__\s*=\s*({.+?});/);
                                if (jsonMatch) {
                                    data.jsonData.push({
                                        type: 'window_data',
                                        content: JSON.parse(jsonMatch[1])
                                    });
                                }
                            } catch (e) {
                                // JSON invalide, ignorer
                            }
                        }
                    });

                    // HTML brut (limité pour éviter les gros volumes)
                    data.rawHTML = document.documentElement.outerHTML.substring(0, 50000);

                } catch (error) {
                    console.error('Error extracting profile data:', error);
                }

                return data;
            });

            // Enrichir avec des données supplémentaires
            profileData.networkRequests = await this.getNetworkRequests();
            profileData.cookies = await this.page.cookies();
            profileData.localStorage = await this.getLocalStorage();
            profileData.sessionStorage = await this.getSessionStorage();

            // Générer hash d'intégrité
            const evidenceHash = this.generateEvidenceHash(profileData);
            profileData.evidenceHash = evidenceHash;

            // Stocker les données
            await this.storeProfileData(username, profileData);

            // Capturer des screenshots
            await this.captureScreenshots(username);

            // Analyser les vidéos récentes
            const videoData = await this.scrapeRecentVideos(username);
            profileData.recentVideos = videoData;

            logger.info('Profile scrape completed', { 
                username, 
                followerCount: profileData.followerCount,
                videoCount: profileData.videoCount,
                evidenceHash 
            });

            return profileData;
        }, `scrapeProfile-${username}`);
    }
    
    async retryOperation(operation, operationName, maxRetries = this.maxRetries) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.info(`Attempting ${operationName}`, { attempt, maxRetries });
                return await operation();
            } catch (error) {
                lastError = error;
                logger.warn(`${operationName} failed`, { 
                    attempt, 
                    maxRetries, 
                    error: error.message 
                });
                
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
                    logger.info(`Retrying in ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    logger.error(`${operationName} failed after ${maxRetries} attempts`, { 
                        error: error.message 
                    });
                }
            }
        }
        
        throw lastError;
    }

    async scrapeRecentVideos(username, limit = 10) {
        try {
            const videos = [];
            
            // Attendre le chargement des vidéos avec sélecteurs multiples
            const videoSelector = await Promise.race([
                this.page.waitForSelector('[data-e2e="user-post-item"]', { timeout: 10000 }),
                this.page.waitForSelector('[data-e2e="user-post-item-list"] > div', { timeout: 10000 }),
                this.page.waitForSelector('.video-feed-item', { timeout: 10000 })
            ]).catch(() => null);
            
            if (!videoSelector) {
                logger.warn('No video elements found', { username });
                return [];
            }

            const videoElements = await this.page.$$('[data-e2e="user-post-item"], [data-e2e="user-post-item-list"] > div');
            
            for (let i = 0; i < Math.min(videoElements.length, limit); i++) {
                try {
                    const videoData = await videoElements[i].evaluate((el) => {
                        const linkEl = el.querySelector('a');
                        const imgEl = el.querySelector('img');
                        const viewsEl = el.querySelector('[data-e2e="video-views"]');
                        
                        return {
                            url: linkEl ? linkEl.href : '',
                            thumbnailUrl: imgEl ? imgEl.src : '',
                            views: viewsEl ? viewsEl.textContent.trim() : '0',
                            title: imgEl ? imgEl.alt : ''
                        };
                    });

                    if (videoData.url) {
                        videos.push({
                            ...videoData,
                            scrapedAt: Date.now(),
                            position: i + 1
                        });
                    }
                } catch (error) {
                    logger.warn('Failed to scrape video data', { index: i, error: error.message });
                }
            }

            return videos;
        } catch (error) {
            logger.error('Failed to scrape recent videos', { username, error: error.message });
            return [];
        }
    }

    async getNetworkRequests() {
        // Initialiser si pas encore fait
        if (!this.networkRequests) {
            this.networkRequests = [];
        }
        return this.networkRequests;
    }

    async getLocalStorage() {
        try {
            return await this.page.evaluate(() => {
                const storage = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    storage[key] = localStorage.getItem(key);
                }
                return storage;
            });
        } catch (error) {
            return {};
        }
    }

    async getSessionStorage() {
        try {
            return await this.page.evaluate(() => {
                const storage = {};
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    storage[key] = sessionStorage.getItem(key);
                }
                return storage;
            });
        } catch (error) {
            return {};
        }
    }

    async captureScreenshots(username) {
        try {
            const timestamp = Date.now();
            const screenshotDir = `./evidence/screenshots/${username}`;
            
            // Créer le dossier s'il n'existe pas
            await fs.mkdir(screenshotDir, { recursive: true });

            // Screenshot complet
            await this.page.screenshot({
                path: `${screenshotDir}/full_page_${timestamp}.png`,
                fullPage: true
            });

            // Screenshot de la zone de profil
            const profileElement = await this.page.$('[data-e2e="user-page"]');
            if (profileElement) {
                await profileElement.screenshot({
                    path: `${screenshotDir}/profile_section_${timestamp}.png`
                });
            }

            logger.info('Screenshots captured', { username, timestamp });
        } catch (error) {
            logger.error('Failed to capture screenshots', { username, error: error.message });
        }
    }

    generateEvidenceHash(data) {
        const dataString = JSON.stringify(data, null, 0);
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    async storeEvidenceData(type, data) {
        const hash = this.generateEvidenceHash(data);
        this.evidenceHashes.push(hash);
        
        // Stocker dans un fichier JSON
        const evidenceDir = './evidence/raw';
        await fs.mkdir(evidenceDir, { recursive: true });
        
        const filename = `${evidenceDir}/${type}_${Date.now()}_${hash.substring(0, 8)}.json`;
        await fs.writeFile(filename, JSON.stringify(data, null, 2));
        
        logger.info('Evidence data stored', { type, hash, filename });
    }

    async storeProfileData(username, data) {
        try {
            const profileDir = `./evidence/profiles/${username}`;
            await fs.mkdir(profileDir, { recursive: true });
            
            const timestamp = Date.now();
            const filename = `${profileDir}/profile_data_${timestamp}.json`;
            
            await fs.writeFile(filename, JSON.stringify(data, null, 2));
            
            // Créer aussi un fichier de résumé
            const summary = {
                username: data.username,
                displayName: data.displayName,
                followerCount: data.followerCount,
                followingCount: data.followingCount,
                videoCount: data.videoCount,
                verified: data.verified,
                bio: data.bio,
                evidenceHash: data.evidenceHash,
                scrapedAt: data.scrapedAt,
                externalLinksCount: data.externalLinks.length
            };
            
            await fs.writeFile(`${profileDir}/summary_${timestamp}.json`, JSON.stringify(summary, null, 2));
            
            logger.info('Profile data stored', { username, filename, evidenceHash: data.evidenceHash });
        } catch (error) {
            logger.error('Failed to store profile data', { username, error: error.message });
        }
    }

    async performDeepInspection(username) {
        try {
            logger.info('Starting deep inspection', { username });

            // Ouvrir les outils de développement
            const client = await this.page.target().createCDPSession();
            await client.send('Runtime.enable');
            await client.send('Network.enable');
            await client.send('Page.enable');

            // Injecter du code d'inspection avancé
            await this.page.evaluateOnNewDocument(() => {
                // Intercepter les appels fetch
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    console.log('FETCH_INTERCEPTED:', args);
                    return originalFetch.apply(this, args);
                };

                // Intercepter XMLHttpRequest
                const originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    xhr.open = function(method, url) {
                        console.log('XHR_INTERCEPTED:', method, url);
                        return originalOpen.apply(this, arguments);
                    };
                    return xhr;
                };

                // Surveiller les changements DOM
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            console.log('DOM_CHANGE:', mutation.target, mutation.addedNodes);
                        }
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });

            // Collecter les logs de console
            const consoleLogs = [];
            this.page.on('console', (msg) => {
                consoleLogs.push({
                    type: msg.type(),
                    text: msg.text(),
                    timestamp: Date.now()
                });
            });

            // Attendre et collecter les données
            await this.page.waitForTimeout(10000);

            // Extraire les données avancées
            const advancedData = await this.page.evaluate(() => {
                return {
                    // Données de performance
                    performance: {
                        navigation: performance.getEntriesByType('navigation')[0],
                        resources: performance.getEntriesByType('resource').slice(0, 50)
                    },
                    
                    // Informations sur les iframes
                    iframes: Array.from(document.querySelectorAll('iframe')).map(iframe => ({
                        src: iframe.src,
                        id: iframe.id,
                        className: iframe.className
                    })),
                    
                    // Scripts chargés
                    scripts: Array.from(document.querySelectorAll('script[src]')).map(script => ({
                        src: script.src,
                        async: script.async,
                        defer: script.defer
                    })),
                    
                    // Métadonnées de la page
                    meta: Array.from(document.querySelectorAll('meta')).map(meta => ({
                        name: meta.name,
                        property: meta.property,
                        content: meta.content
                    })),
                    
                    // Variables globales TikTok
                    tiktokGlobals: Object.keys(window).filter(key => 
                        key.toLowerCase().includes('tiktok') || 
                        key.toLowerCase().includes('tt') ||
                        key.startsWith('__')
                    ).reduce((obj, key) => {
                        try {
                            obj[key] = typeof window[key] === 'object' ? '[Object]' : String(window[key]);
                        } catch (e) {
                            obj[key] = '[Inaccessible]';
                        }
                        return obj;
                    }, {})
                };
            });

            // Stocker les données d'inspection
            await this.storeEvidenceData('deep_inspection', {
                username,
                consoleLogs,
                advancedData,
                timestamp: Date.now()
            });

            logger.info('Deep inspection completed', { username });
            return advancedData;

        } catch (error) {
            logger.error('Deep inspection failed', { username, error: error.message });
            return null;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            logger.info('Browser closed');
        }
    }
}

// Fonction principale pour analyser tous les profils
async function analyzeTikTokProfiles() {
    const profiles = [
        'historia_med',
        'titilepirate2', 
        'titi.le.pirate',
        'titilepirate3',
        'saadallahnordine'
    ];

    const scraper = new TikTokForensicScraper();
    
    try {
        await scraper.initialize();
        
        const results = [];
        
        for (const username of profiles) {
            try {
                logger.info(`Starting analysis of ${username}`);
                
                // Scraper le profil
                const profileData = await scraper.scrapeProfile(username);
                
                // Inspection approfondie
                const inspectionData = await scraper.performDeepInspection(username);
                
                results.push({
                    username,
                    success: true,
                    profileData,
                    inspectionData,
                    analyzedAt: Date.now()
                });
                
                // Pause entre les profils
                await new Promise(resolve => setTimeout(resolve, 5000));
                
            } catch (error) {
                logger.error(`Failed to analyze ${username}`, { error: error.message });
                results.push({
                    username,
                    success: false,
                    error: error.message,
                    analyzedAt: Date.now()
                });
            }
        }
        
        // Sauvegarder le rapport final
        const reportDir = './evidence/reports';
        await fs.mkdir(reportDir, { recursive: true });
        
        const reportFilename = `${reportDir}/tiktok_analysis_report_${Date.now()}.json`;
        await fs.writeFile(reportFilename, JSON.stringify({
            summary: {
                totalProfiles: profiles.length,
                successfulAnalyses: results.filter(r => r.success).length,
                failedAnalyses: results.filter(r => !r.success).length,
                generatedAt: Date.now()
            },
            results
        }, null, 2));
        
        logger.info('Analysis completed', { 
            reportFilename,
            totalProfiles: profiles.length,
            successful: results.filter(r => r.success).length
        });
        
    } finally {
        await scraper.close();
    }
}

// Exporter pour utilisation en module
module.exports = { TikTokForensicScraper, analyzeTikTokProfiles };

// Exécuter si appelé directement
if (require.main === module) {
    analyzeTikTokProfiles().catch(console.error);
}