// AURA Chromium Stealth Logger - Lecture native des logs sans détection TikTok
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ChromiumStealthLogger {
    constructor(options = {}) {
        this.profilePath = options.profilePath || this.detectChromiumProfile();
        this.outputDir = options.outputDir || './logs/chromium-stealth';
        this.sessionId = `session_${Date.now()}`;
        this.logs = {
            network: [],
            console: [],
            websockets: [],
            cookies: [],
            storage: [],
            forensic: []
        };
        this.isActive = false;
        this.browser = null;
        this.page = null;
        
        this.ensureOutputDir();
    }

    detectChromiumProfile() {
        const possiblePaths = [
            '/home/soufiane/.config/chromium/Default',
            '/home/soufiane/.config/google-chrome/Default',
            process.env.CHROMIUM_PROFILE_PATH
        ];
        
        for (const profilePath of possiblePaths) {
            if (profilePath && fs.existsSync(profilePath)) {
                return profilePath;
            }
        }
        
        return null;
    }

    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async startStealthSession(targetUrl = 'https://www.tiktok.com') {
        try {
            console.log('🕵️  Démarrage session stealth Chromium...');
            
            // Configuration stealth maximale
            this.browser = await puppeteer.launch({
                headless: false, // Visible pour paraître naturel
                userDataDir: this.profilePath,
                executablePath: this.getChromiumPath(),
                args: [
                    '--disable-blink-features=AutomationControlled',
                    '--disable-extensions-except=',
                    '--disable-extensions',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection',
                    '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                ]
            });

            this.page = await this.browser.newPage();
            
            // Masquer les traces d'automation
            await this.page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
                
                // Masquer chrome.runtime
                delete window.chrome;
                
                // Simuler des propriétés normales
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });
            });

            // Configuration des listeners stealth
            await this.setupStealthListeners();
            
            // Navigation vers TikTok
            console.log(`🎯 Navigation vers ${targetUrl}...`);
            await this.page.goto(targetUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            this.isActive = true;
            console.log('✅ Session stealth active - Collecte des logs en cours...');
            
            return {
                success: true,
                sessionId: this.sessionId,
                message: 'Session stealth démarrée avec succès'
            };
            
        } catch (error) {
            console.error('❌ Erreur démarrage session stealth:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async setupStealthListeners() {
        // 1. Logs réseau (requêtes/réponses)
        this.page.on('request', (request) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: 'network_request',
                method: request.method(),
                url: request.url(),
                headers: request.headers(),
                postData: request.postData(),
                resourceType: request.resourceType()
            };
            
            this.logs.network.push(logEntry);
            
            // Forensic spécial TikTok
            if (this.isTikTokForensicRequest(request)) {
                this.logs.forensic.push({
                    ...logEntry,
                    forensic_type: 'tiktok_api',
                    analysis: this.analyzeTikTokRequest(request)
                });
            }
        });

        this.page.on('response', (response) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: 'network_response',
                status: response.status(),
                url: response.url(),
                headers: response.headers(),
                fromCache: response.fromCache(),
                fromServiceWorker: response.fromServiceWorker()
            };
            
            this.logs.network.push(logEntry);
            
            // Capture des réponses TikTok importantes
            if (this.isTikTokDataResponse(response)) {
                this.captureTikTokResponse(response);
            }
        });

        // 2. Logs console JavaScript
        this.page.on('console', (msg) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: 'console',
                level: msg.type(),
                text: msg.text(),
                location: msg.location(),
                args: msg.args().map(arg => arg.toString())
            };
            
            this.logs.console.push(logEntry);
        });

        // 3. WebSockets (lives TikTok)
        this.page.on('framenavigated', async (frame) => {
            try {
                const url = frame.url();
                if (url.includes('tiktok') && url.includes('live')) {
                    this.logs.websockets.push({
                        timestamp: new Date().toISOString(),
                        type: 'websocket_frame',
                        url: url,
                        forensic_type: 'tiktok_live'
                    });
                }
            } catch (error) {
                // Ignore les erreurs de frame
            }
        });

        // 4. Cookies et storage
        setInterval(async () => {
            if (this.isActive) {
                await this.captureCookiesAndStorage();
            }
        }, 30000); // Toutes les 30 secondes
    }

    isTikTokForensicRequest(request) {
        const url = request.url();
        const forensicPatterns = [
            '/api/recommend/',
            '/api/post/',
            '/api/user/',
            '/api/live/',
            '/webcast/',
            '/aweme/v1/',
            '/tiktok/v1/'
        ];
        
        return forensicPatterns.some(pattern => url.includes(pattern));
    }

    analyzeTikTokRequest(request) {
        const url = request.url();
        const analysis = {
            endpoint_type: 'unknown',
            data_type: 'unknown',
            forensic_value: 'low'
        };
        
        if (url.includes('/api/user/')) {
            analysis.endpoint_type = 'user_profile';
            analysis.data_type = 'profile_data';
            analysis.forensic_value = 'high';
        } else if (url.includes('/api/recommend/')) {
            analysis.endpoint_type = 'recommendation';
            analysis.data_type = 'algorithm_data';
            analysis.forensic_value = 'medium';
        } else if (url.includes('/webcast/')) {
            analysis.endpoint_type = 'live_stream';
            analysis.data_type = 'live_data';
            analysis.forensic_value = 'high';
        }
        
        return analysis;
    }

    isTikTokDataResponse(response) {
        const url = response.url();
        return response.status() === 200 && 
               (url.includes('/api/') || url.includes('/webcast/')) &&
               response.headers()['content-type']?.includes('application/json');
    }

    async captureTikTokResponse(response) {
        try {
            const responseData = await response.json();
            
            this.logs.forensic.push({
                timestamp: new Date().toISOString(),
                type: 'tiktok_response_data',
                url: response.url(),
                status: response.status(),
                data: responseData,
                data_hash: crypto.createHash('sha256').update(JSON.stringify(responseData)).digest('hex')
            });
        } catch (error) {
            // Ignore les erreurs de parsing JSON
        }
    }

    async captureCookiesAndStorage() {
        try {
            // Cookies
            const cookies = await this.page.cookies();
            this.logs.cookies.push({
                timestamp: new Date().toISOString(),
                type: 'cookies_snapshot',
                cookies: cookies.filter(cookie => cookie.domain.includes('tiktok'))
            });

            // Local Storage
            const localStorage = await this.page.evaluate(() => {
                const storage = {};
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    storage[key] = window.localStorage.getItem(key);
                }
                return storage;
            });

            this.logs.storage.push({
                timestamp: new Date().toISOString(),
                type: 'localstorage_snapshot',
                data: localStorage
            });

        } catch (error) {
            console.error('Erreur capture cookies/storage:', error);
        }
    }

    async stopStealthSession() {
        try {
            this.isActive = false;
            
            // Sauvegarde finale des logs
            await this.exportLogs();
            
            if (this.browser) {
                await this.browser.close();
            }
            
            console.log('🛑 Session stealth arrêtée');
            return {
                success: true,
                sessionId: this.sessionId,
                logsExported: true
            };
            
        } catch (error) {
            console.error('❌ Erreur arrêt session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async exportLogs() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `stealth-logs-${this.sessionId}-${timestamp}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        const exportData = {
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            profile_path: this.profilePath,
            logs: this.logs,
            statistics: {
                network_requests: this.logs.network.filter(l => l.type === 'network_request').length,
                network_responses: this.logs.network.filter(l => l.type === 'network_response').length,
                console_logs: this.logs.console.length,
                forensic_entries: this.logs.forensic.length,
                cookies_snapshots: this.logs.cookies.length,
                storage_snapshots: this.logs.storage.length
            },
            integrity_hash: crypto.createHash('sha256').update(JSON.stringify(this.logs)).digest('hex')
        };
        
        fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
        console.log(`📁 Logs exportés: ${filepath}`);
        
        return filepath;
    }

    getChromiumPath() {
        const paths = [
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable'
        ];
        
        for (const chromiumPath of paths) {
            if (fs.existsSync(chromiumPath)) {
                return chromiumPath;
            }
        }
        
        return 'chromium'; // Fallback
    }

    getSessionStats() {
        return {
            session_id: this.sessionId,
            is_active: this.isActive,
            logs_count: {
                network: this.logs.network.length,
                console: this.logs.console.length,
                forensic: this.logs.forensic.length,
                cookies: this.logs.cookies.length,
                storage: this.logs.storage.length
            },
            uptime: this.isActive ? Date.now() - parseInt(this.sessionId.split('_')[1]) : 0
        };
    }
}

module.exports = ChromiumStealthLogger;