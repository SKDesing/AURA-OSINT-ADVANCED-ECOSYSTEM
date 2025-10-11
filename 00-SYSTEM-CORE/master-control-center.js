/**
 * 🎯 AURA OSINT - MASTER CONTROL CENTER
 * 
 * Centre de contrôle principal de l'écosystème AURA OSINT
 * Implémente la philosophie "LE FIL QU'ON REMONTE"
 * 
 * @version 2.0.0
 * @author AURA OSINT Team
 * @license MIT
 */

class MasterControlCenter {
    constructor() {
        this.version = '2.0.0';
        this.philosophy = 'LE FIL QU\'ON REMONTE';
        this.approach = 'CIBLE → FIL → CONNEXIONS → RÉSEAU → ORIGINE';
        
        // État global du système
        this.systemState = {
            status: 'INITIALIZING',
            activeInvestigations: new Map(),
            connectedClients: new Set(),
            systemHealth: {},
            metrics: {
                totalInvestigations: 0,
                activeTools: 0,
                systemUptime: Date.now(),
                lastHealthCheck: null
            }
        };

        // Configuration système
        this.config = {
            maxConcurrentInvestigations: 50,
            healthCheckInterval: 30000, // 30 secondes
            metricsUpdateInterval: 5000, // 5 secondes
            autoCleanupInterval: 3600000, // 1 heure
            emergencyShutdownThreshold: 0.95 // 95% utilisation
        };

        // Modules système
        this.modules = {
            authentication: null,
            configuration: null,
            routing: null,
            monitoring: null,
            database: null,
            osintTools: null,
            analysis: null,
            visualization: null,
            reporting: null
        };

        // Event emitter pour communication inter-modules
        this.eventBus = new EventTarget();
        
        // Initialisation
        this.initialize();
    }

    /**
     * 🚀 Initialisation du Master Control Center
     */
    async initialize() {
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎯 AURA OSINT v${this.version}                    ║
║                  MASTER CONTROL CENTER                       ║
║                                                              ║
║  Philosophie: "${this.philosophy}"              ║
║  Approche: ${this.approach}  ║
╚══════════════════════════════════════════════════════════════╝
        `);

        try {
            this.systemState.status = 'STARTING';
            
            // Phase 1: Chargement configuration
            await this.loadConfiguration();
            
            // Phase 2: Initialisation modules core
            await this.initializeCoreModules();
            
            // Phase 3: Démarrage services
            await this.startServices();
            
            // Phase 4: Vérifications santé
            await this.performHealthChecks();
            
            // Phase 5: Activation monitoring
            this.startMonitoring();
            
            // Phase 6: Interface CLI
            this.initializeCLI();
            
            this.systemState.status = 'OPERATIONAL';
            this.logSystemEvent('SYSTEM_READY', 'Master Control Center opérationnel');
            
            console.log('✅ AURA OSINT Master Control Center - OPÉRATIONNEL');
            
        } catch (error) {
            this.systemState.status = 'ERROR';
            this.handleCriticalError('INITIALIZATION_FAILED', error);
        }
    }

    /**
     * 📋 Chargement de la configuration système
     */
    async loadConfiguration() {
        console.log('📋 Chargement configuration système...');
        
        try {
            // Configuration par défaut
            const defaultConfig = {
                database: {
                    host: process.env.DB_HOST || 'localhost',
                    port: process.env.DB_PORT || 5432,
                    name: process.env.DB_NAME || 'aura_osint',
                    user: process.env.DB_USER || 'aura_user',
                    password: process.env.DB_PASSWORD || 'Phi1.618Golden!'
                },
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379,
                    password: process.env.REDIS_PASSWORD || null
                },
                elasticsearch: {
                    host: process.env.ES_HOST || 'localhost',
                    port: process.env.ES_PORT || 9200,
                    username: process.env.ES_USERNAME || 'elastic',
                    password: process.env.ES_PASSWORD || 'changeme'
                },
                qdrant: {
                    host: process.env.QDRANT_HOST || 'localhost',
                    port: process.env.QDRANT_PORT || 6333
                },
                ai: {
                    qwen_url: process.env.QWEN_URL || 'http://localhost:11434',
                    model: process.env.QWEN_MODEL || 'qwen2.5:7b'
                },
                security: {
                    jwt_secret: process.env.JWT_SECRET || 'aura-osint-secret-key',
                    encryption_key: process.env.ENCRYPTION_KEY || 'phi-1618-golden-ratio',
                    session_timeout: parseInt(process.env.SESSION_TIMEOUT) || 28800 // 8h
                },
                osint: {
                    max_concurrent_tools: parseInt(process.env.MAX_CONCURRENT_TOOLS) || 10,
                    rate_limit_per_minute: parseInt(process.env.RATE_LIMIT) || 100,
                    timeout_seconds: parseInt(process.env.TOOL_TIMEOUT) || 300
                }
            };

            // Merge avec configuration personnalisée si elle existe
            this.config = { ...this.config, ...defaultConfig };
            
            console.log('✅ Configuration système chargée');
            
        } catch (error) {
            throw new Error(`Erreur chargement configuration: ${error.message}`);
        }
    }

    /**
     * 🔧 Initialisation des modules core
     */
    async initializeCoreModules() {
        console.log('🔧 Initialisation modules core...');
        
        const moduleInitializers = [
            { name: 'authentication', init: this.initAuthenticationModule },
            { name: 'database', init: this.initDatabaseModule },
            { name: 'routing', init: this.initRoutingModule },
            { name: 'monitoring', init: this.initMonitoringModule },
            { name: 'osintTools', init: this.initOSINTToolsModule },
            { name: 'analysis', init: this.initAnalysisModule },
            { name: 'visualization', init: this.initVisualizationModule },
            { name: 'reporting', init: this.initReportingModule }
        ];

        for (const { name, init } of moduleInitializers) {
            try {
                console.log(`  🔄 Initialisation module ${name}...`);
                this.modules[name] = await init.call(this);
                console.log(`  ✅ Module ${name} initialisé`);
            } catch (error) {
                console.error(`  ❌ Erreur module ${name}:`, error.message);
                throw new Error(`Échec initialisation module ${name}: ${error.message}`);
            }
        }
        
        console.log('✅ Tous les modules core initialisés');
    }

    /**
     * 🔐 Initialisation module authentification
     */
    async initAuthenticationModule() {
        return {
            status: 'active',
            sessions: new Map(),
            
            async authenticate(credentials) {
                // Implémentation authentification
                const { username, password } = credentials;
                
                // Vérification ROOT account
                if (username === 'root' && password === 'Phi1.618Golden!') {
                    const sessionId = this.generateSessionId();
                    const session = {
                        id: sessionId,
                        username: 'root',
                        role: 'admin',
                        permissions: ['*'],
                        createdAt: new Date(),
                        lastActivity: new Date(),
                        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8h
                    };
                    
                    this.sessions.set(sessionId, session);
                    return { success: true, sessionId, session };
                }
                
                return { success: false, error: 'Identifiants invalides' };
            },
            
            generateSessionId() {
                return 'aura_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
            },
            
            validateSession(sessionId) {
                const session = this.sessions.get(sessionId);
                if (!session) return { valid: false, error: 'Session inexistante' };
                
                if (new Date() > session.expiresAt) {
                    this.sessions.delete(sessionId);
                    return { valid: false, error: 'Session expirée' };
                }
                
                // Mise à jour dernière activité
                session.lastActivity = new Date();
                return { valid: true, session };
            }
        };
    }

    /**
     * 🗄️ Initialisation module base de données
     */
    async initDatabaseModule() {
        return {
            status: 'active',
            connections: {
                postgresql: null,
                redis: null,
                elasticsearch: null,
                qdrant: null
            },
            
            async connect() {
                // Simulation connexions BDD
                console.log('    🔌 Connexion PostgreSQL...');
                this.connections.postgresql = { status: 'connected', host: 'localhost:5432' };
                
                console.log('    🔌 Connexion Redis...');
                this.connections.redis = { status: 'connected', host: 'localhost:6379' };
                
                console.log('    🔌 Connexion Elasticsearch...');
                this.connections.elasticsearch = { status: 'connected', host: 'localhost:9200' };
                
                console.log('    🔌 Connexion Qdrant...');
                this.connections.qdrant = { status: 'connected', host: 'localhost:6333' };
                
                return true;
            },
            
            async executeQuery(query, params = []) {
                // Simulation exécution requête
                return { success: true, data: [], affectedRows: 0 };
            },
            
            async getHealthStatus() {
                return {
                    postgresql: this.connections.postgresql?.status === 'connected',
                    redis: this.connections.redis?.status === 'connected',
                    elasticsearch: this.connections.elasticsearch?.status === 'connected',
                    qdrant: this.connections.qdrant?.status === 'connected'
                };
            }
        };
    }

    /**
     * 🌐 Initialisation module routage
     */
    async initRoutingModule() {
        return {
            status: 'active',
            routes: new Map(),
            
            registerRoute(path, handler, method = 'GET') {
                const routeKey = `${method}:${path}`;
                this.routes.set(routeKey, handler);
                console.log(`    📍 Route enregistrée: ${routeKey}`);
            },
            
            async handleRequest(method, path, data = {}) {
                const routeKey = `${method}:${path}`;
                const handler = this.routes.get(routeKey);
                
                if (!handler) {
                    return { status: 404, error: 'Route non trouvée' };
                }
                
                try {
                    return await handler(data);
                } catch (error) {
                    return { status: 500, error: error.message };
                }
            }
        };
    }

    /**
     * 📊 Initialisation module monitoring
     */
    async initMonitoringModule() {
        return {
            status: 'active',
            metrics: {
                requests: 0,
                errors: 0,
                responseTime: [],
                memoryUsage: [],
                cpuUsage: []
            },
            
            recordMetric(type, value) {
                if (this.metrics[type] !== undefined) {
                    if (Array.isArray(this.metrics[type])) {
                        this.metrics[type].push({ value, timestamp: Date.now() });
                        // Garder seulement les 1000 dernières valeurs
                        if (this.metrics[type].length > 1000) {
                            this.metrics[type] = this.metrics[type].slice(-1000);
                        }
                    } else {
                        this.metrics[type] = value;
                    }
                }
            },
            
            getSystemMetrics() {
                return {
                    ...this.metrics,
                    uptime: Date.now() - this.systemState.metrics.systemUptime,
                    activeInvestigations: this.systemState.activeInvestigations.size,
                    connectedClients: this.systemState.connectedClients.size
                };
            }
        };
    }

    /**
     * 🔍 Initialisation module outils OSINT
     */
    async initOSINTToolsModule() {
        return {
            status: 'active',
            availableTools: new Map(),
            activeJobs: new Map(),
            
            registerTool(name, toolConfig) {
                this.availableTools.set(name, {
                    name,
                    ...toolConfig,
                    registeredAt: new Date(),
                    status: 'available'
                });
                console.log(`    🔧 Outil OSINT enregistré: ${name}`);
            },
            
            async executeTool(toolName, params) {
                const tool = this.availableTools.get(toolName);
                if (!tool) {
                    throw new Error(`Outil OSINT non trouvé: ${toolName}`);
                }
                
                const jobId = this.generateJobId();
                const job = {
                    id: jobId,
                    tool: toolName,
                    params,
                    status: 'running',
                    startTime: Date.now(),
                    progress: 0
                };
                
                this.activeJobs.set(jobId, job);
                
                // Simulation exécution outil
                setTimeout(() => {
                    job.status = 'completed';
                    job.endTime = Date.now();
                    job.progress = 100;
                    job.result = { success: true, data: `Résultat de ${toolName}` };
                }, Math.random() * 5000 + 1000); // 1-6 secondes
                
                return jobId;
            },
            
            generateJobId() {
                return 'job_' + Math.random().toString(36).substr(2, 12);
            },
            
            getJobStatus(jobId) {
                return this.activeJobs.get(jobId) || null;
            }
        };
    }

    /**
     * 🧠 Initialisation module analyse
     */
    async initAnalysisModule() {
        return {
            status: 'active',
            
            async analyzeData(data, analysisType = 'correlation') {
                // Simulation analyse IA
                return {
                    type: analysisType,
                    confidence: Math.random() * 0.4 + 0.6, // 60-100%
                    patterns: ['pattern1', 'pattern2'],
                    recommendations: ['rec1', 'rec2'],
                    timestamp: new Date()
                };
            },
            
            async followThread(initialData) {
                // Implémentation Thread Follower Engine
                const thread = {
                    id: this.generateThreadId(),
                    initialData,
                    steps: [],
                    connections: [],
                    timeline: [],
                    status: 'active'
                };
                
                // Simulation remontée du fil
                for (let i = 0; i < 5; i++) {
                    thread.steps.push({
                        step: i + 1,
                        action: `Analyse niveau ${i + 1}`,
                        data: `Données découvertes étape ${i + 1}`,
                        timestamp: new Date()
                    });
                }
                
                return thread;
            },
            
            generateThreadId() {
                return 'thread_' + Math.random().toString(36).substr(2, 10);
            }
        };
    }

    /**
     * 📊 Initialisation module visualisation
     */
    async initVisualizationModule() {
        return {
            status: 'active',
            
            generateNetworkGraph(data) {
                return {
                    nodes: data.entities || [],
                    edges: data.relationships || [],
                    layout: 'force-directed',
                    config: {
                        width: 800,
                        height: 600,
                        nodeSize: 10,
                        linkDistance: 100
                    }
                };
            },
            
            generateTimeline(events) {
                return {
                    events: events.map(event => ({
                        ...event,
                        x: new Date(event.timestamp).getTime(),
                        y: Math.random() * 100
                    })),
                    config: {
                        width: 1000,
                        height: 400,
                        margin: { top: 20, right: 20, bottom: 30, left: 40 }
                    }
                };
            }
        };
    }

    /**
     * 📄 Initialisation module reporting
     */
    async initReportingModule() {
        return {
            status: 'active',
            
            async generateReport(investigationId, format = 'html') {
                const report = {
                    id: this.generateReportId(),
                    investigationId,
                    format,
                    generatedAt: new Date(),
                    status: 'generating'
                };
                
                // Simulation génération rapport
                setTimeout(() => {
                    report.status = 'completed';
                    report.url = `/reports/${report.id}.${format}`;
                    report.size = Math.floor(Math.random() * 1000000) + 100000; // 100KB - 1MB
                }, 2000);
                
                return report;
            },
            
            generateReportId() {
                return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            }
        };
    }

    /**
     * 🚀 Démarrage des services
     */
    async startServices() {
        console.log('🚀 Démarrage des services...');
        
        // Connexion base de données
        await this.modules.database.connect();
        
        // Enregistrement routes API
        this.registerAPIRoutes();
        
        // Enregistrement outils OSINT
        this.registerOSINTTools();
        
        console.log('✅ Services démarrés');
    }

    /**
     * 📍 Enregistrement des routes API
     */
    registerAPIRoutes() {
        const router = this.modules.routing;
        
        // Routes système
        router.registerRoute('/api/health', () => this.getSystemHealth(), 'GET');
        router.registerRoute('/api/metrics', () => this.getSystemMetrics(), 'GET');
        router.registerRoute('/api/status', () => this.getSystemStatus(), 'GET');
        
        // Routes authentification
        router.registerRoute('/api/auth/login', (data) => this.modules.authentication.authenticate(data), 'POST');
        router.registerRoute('/api/auth/validate', (data) => this.modules.authentication.validateSession(data.sessionId), 'POST');
        
        // Routes investigations
        router.registerRoute('/api/investigations', (data) => this.startInvestigation(data), 'POST');
        router.registerRoute('/api/investigations/:id', (data) => this.getInvestigation(data.id), 'GET');
        
        // Routes outils OSINT
        router.registerRoute('/api/tools', () => this.getAvailableTools(), 'GET');
        router.registerRoute('/api/tools/execute', (data) => this.executeOSINTTool(data), 'POST');
        
        // Routes rapports
        router.registerRoute('/api/reports/generate', (data) => this.generateReport(data), 'POST');
        
        console.log('    📍 Routes API enregistrées');
    }

    /**
     * 🔧 Enregistrement des outils OSINT
     */
    registerOSINTTools() {
        const osintModule = this.modules.osintTools;
        
        // Outils Social Media
        osintModule.registerTool('twitter', {
            category: 'social',
            description: 'Analyse profil Twitter',
            inputs: ['username'],
            outputs: ['profile', 'tweets', 'network']
        });
        
        osintModule.registerTool('instagram', {
            category: 'social',
            description: 'Analyse profil Instagram',
            inputs: ['username'],
            outputs: ['profile', 'posts', 'engagement']
        });
        
        // Outils Email
        osintModule.registerTool('holehe', {
            category: 'email',
            description: 'Vérification email sur 120+ sites',
            inputs: ['email'],
            outputs: ['sites_found', 'breach_risk']
        });
        
        // Outils Network
        osintModule.registerTool('shodan', {
            category: 'network',
            description: 'Scan infrastructure réseau',
            inputs: ['ip', 'domain'],
            outputs: ['ports', 'services', 'vulnerabilities']
        });
        
        // Outils Darknet
        osintModule.registerTool('onionscan', {
            category: 'darknet',
            description: 'Scanner sites .onion',
            inputs: ['onion_url'],
            outputs: ['services', 'vulnerabilities', 'opsec_issues']
        });
        
        console.log('    🔧 Outils OSINT enregistrés');
    }

    /**
     * 🏥 Vérifications santé système
     */
    async performHealthChecks() {
        console.log('🏥 Vérifications santé système...');
        
        const healthChecks = [
            { name: 'Database', check: () => this.modules.database.getHealthStatus() },
            { name: 'Memory', check: () => this.checkMemoryUsage() },
            { name: 'CPU', check: () => this.checkCPUUsage() },
            { name: 'Disk', check: () => this.checkDiskUsage() }
        ];
        
        const healthResults = {};
        
        for (const { name, check } of healthChecks) {
            try {
                healthResults[name] = await check();
                console.log(`    ✅ ${name}: OK`);
            } catch (error) {
                healthResults[name] = { status: 'error', error: error.message };
                console.log(`    ❌ ${name}: ${error.message}`);
            }
        }
        
        this.systemState.systemHealth = healthResults;
        this.systemState.metrics.lastHealthCheck = new Date();
        
        console.log('✅ Vérifications santé terminées');
    }

    /**
     * 📊 Démarrage du monitoring
     */
    startMonitoring() {
        console.log('📊 Démarrage monitoring système...');
        
        // Health checks périodiques
        setInterval(() => {
            this.performHealthChecks();
        }, this.config.healthCheckInterval);
        
        // Mise à jour métriques
        setInterval(() => {
            this.updateSystemMetrics();
        }, this.config.metricsUpdateInterval);
        
        // Nettoyage automatique
        setInterval(() => {
            this.performAutomaticCleanup();
        }, this.config.autoCleanupInterval);
        
        console.log('✅ Monitoring système actif');
    }

    /**
     * 💻 Initialisation interface CLI
     */
    initializeCLI() {
        console.log('💻 Interface CLI disponible:');
        console.log('  aura> help                    - Afficher aide');
        console.log('  aura> status                  - État système');
        console.log('  aura> metrics                 - Métriques système');
        console.log('  aura> investigations          - Liste investigations');
        console.log('  aura> tools                   - Outils disponibles');
        console.log('  aura> start <target>          - Démarrer investigation');
        console.log('  aura> stop <id>               - Arrêter investigation');
        console.log('  aura> export <id> <format>    - Exporter rapport');
        console.log('  aura> shutdown                - Arrêt système');
        
        // Simulation interface CLI
        if (typeof window !== 'undefined') {
            window.aura = {
                help: () => this.showHelp(),
                status: () => this.getSystemStatus(),
                metrics: () => this.getSystemMetrics(),
                investigations: () => this.listInvestigations(),
                tools: () => this.getAvailableTools(),
                start: (target) => this.startInvestigation({ target }),
                stop: (id) => this.stopInvestigation(id),
                export: (id, format) => this.generateReport({ investigationId: id, format }),
                shutdown: () => this.shutdown()
            };
        }
    }

    /**
     * 🎯 Démarrage d'une investigation
     */
    async startInvestigation(params) {
        const investigationId = this.generateInvestigationId();
        
        const investigation = {
            id: investigationId,
            target: params.target,
            type: params.type || 'person',
            depth: params.depth || 'medium',
            status: 'starting',
            startTime: Date.now(),
            progress: 0,
            steps: [],
            results: {},
            metadata: {
                createdBy: params.userId || 'system',
                createdAt: new Date(),
                priority: params.priority || 'normal'
            }
        };
        
        this.systemState.activeInvestigations.set(investigationId, investigation);
        this.systemState.metrics.totalInvestigations++;
        
        // Démarrage du Thread Follower Engine
        setTimeout(async () => {
            investigation.status = 'running';
            investigation.thread = await this.modules.analysis.followThread(params.target);
            
            // Simulation progression
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    investigation.status = 'completed';
                    investigation.endTime = Date.now();
                    clearInterval(progressInterval);
                    
                    this.logSystemEvent('INVESTIGATION_COMPLETED', `Investigation ${investigationId} terminée`);
                }
                investigation.progress = Math.min(progress, 100);
            }, 1000);
        }, 100);
        
        this.logSystemEvent('INVESTIGATION_STARTED', `Investigation ${investigationId} démarrée pour: ${params.target}`);
        
        return {
            success: true,
            investigationId,
            message: 'Investigation démarrée',
            estimatedDuration: '5-10 minutes'
        };
    }

    /**
     * 📊 Méthodes utilitaires
     */
    generateInvestigationId() {
        return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    getSystemStatus() {
        return {
            status: this.systemState.status,
            version: this.version,
            uptime: Date.now() - this.systemState.metrics.systemUptime,
            activeInvestigations: this.systemState.activeInvestigations.size,
            connectedClients: this.systemState.connectedClients.size,
            systemHealth: this.systemState.systemHealth,
            lastHealthCheck: this.systemState.metrics.lastHealthCheck
        };
    }

    getSystemMetrics() {
        return this.modules.monitoring.getSystemMetrics();
    }

    getSystemHealth() {
        return this.systemState.systemHealth;
    }

    getAvailableTools() {
        return Array.from(this.modules.osintTools.availableTools.values());
    }

    listInvestigations() {
        return Array.from(this.systemState.activeInvestigations.values());
    }

    async executeOSINTTool(params) {
        return await this.modules.osintTools.executeTool(params.tool, params.params);
    }

    async generateReport(params) {
        return await this.modules.reporting.generateReport(params.investigationId, params.format);
    }

    checkMemoryUsage() {
        if (typeof process !== 'undefined') {
            const usage = process.memoryUsage();
            return {
                status: 'ok',
                rss: usage.rss,
                heapTotal: usage.heapTotal,
                heapUsed: usage.heapUsed,
                external: usage.external
            };
        }
        return { status: 'ok', message: 'Memory check not available in browser' };
    }

    checkCPUUsage() {
        return { status: 'ok', usage: Math.random() * 30 + 10 }; // Simulation 10-40%
    }

    checkDiskUsage() {
        return { status: 'ok', usage: Math.random() * 20 + 30 }; // Simulation 30-50%
    }

    updateSystemMetrics() {
        const monitoring = this.modules.monitoring;
        monitoring.recordMetric('memoryUsage', this.checkMemoryUsage());
        monitoring.recordMetric('cpuUsage', this.checkCPUUsage());
    }

    performAutomaticCleanup() {
        // Nettoyage investigations terminées anciennes
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24h
        
        for (const [id, investigation] of this.systemState.activeInvestigations) {
            if (investigation.status === 'completed' && investigation.endTime < cutoffTime) {
                this.systemState.activeInvestigations.delete(id);
                this.logSystemEvent('CLEANUP', `Investigation ${id} archivée`);
            }
        }
    }

    logSystemEvent(type, message, data = {}) {
        const event = {
            type,
            message,
            data,
            timestamp: new Date(),
            system: 'MasterControlCenter'
        };
        
        console.log(`[${event.timestamp.toISOString()}] ${type}: ${message}`);
        
        // Émission événement pour autres modules
        this.eventBus.dispatchEvent(new CustomEvent('systemEvent', { detail: event }));
    }

    handleCriticalError(type, error) {
        console.error(`🚨 ERREUR CRITIQUE [${type}]:`, error);
        
        this.logSystemEvent('CRITICAL_ERROR', `${type}: ${error.message}`, { error: error.stack });
        
        // Protocoles d'urgence si nécessaire
        if (type === 'INITIALIZATION_FAILED') {
            console.log('🔄 Tentative de récupération...');
            // Logique de récupération
        }
    }

    showHelp() {
        return `
🎯 AURA OSINT - Master Control Center v${this.version}

COMMANDES DISPONIBLES:
  help                    - Afficher cette aide
  status                  - État du système
  metrics                 - Métriques système
  investigations          - Liste des investigations
  tools                   - Outils OSINT disponibles
  start <target>          - Démarrer investigation
  stop <id>               - Arrêter investigation
  export <id> <format>    - Exporter rapport (html/pdf/json)
  shutdown                - Arrêt système

PHILOSOPHIE: "${this.philosophy}"
APPROCHE: ${this.approach}

Pour plus d'informations: https://github.com/aura-osint/ecosystem
        `;
    }

    async shutdown() {
        console.log('🔄 Arrêt du Master Control Center...');
        
        this.systemState.status = 'SHUTTING_DOWN';
        
        // Arrêt des investigations en cours
        for (const [id, investigation] of this.systemState.activeInvestigations) {
            if (investigation.status === 'running') {
                investigation.status = 'interrupted';
                this.logSystemEvent('INVESTIGATION_INTERRUPTED', `Investigation ${id} interrompue`);
            }
        }
        
        // Sauvegarde état système
        this.logSystemEvent('SYSTEM_SHUTDOWN', 'Master Control Center arrêté');
        
        this.systemState.status = 'STOPPED';
        console.log('✅ Master Control Center arrêté proprement');
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MasterControlCenter;
}

// Initialisation automatique si dans un navigateur
if (typeof window !== 'undefined') {
    window.MasterControlCenter = MasterControlCenter;
    
    // Auto-start si pas en mode développement
    if (!window.location.search.includes('dev=true')) {
        window.auraMasterControl = new MasterControlCenter();
    }
}

console.log('🎯 Master Control Center chargé - Prêt à l\'initialisation');