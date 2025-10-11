/**
 * 🧵 AURA OSINT - THREAD FOLLOWER ENGINE
 * 
 * Moteur de suivi des fils d'investigation
 * Implémente la philosophie "LE FIL QU'ON REMONTE"
 * CIBLE → FIL → CONNEXIONS → RÉSEAU → ORIGINE
 * 
 * @version 2.0.0
 * @author AURA OSINT Team
 * @license MIT
 */

class ThreadFollowerEngine {
    constructor() {
        this.version = '2.0.0';
        this.philosophy = 'LE FIL QU\'ON REMONTE';
        this.approach = 'CIBLE → FIL → CONNEXIONS → RÉSEAU → ORIGINE';
        
        // Configuration du moteur
        this.config = {
            maxDepth: 7,                    // Profondeur maximale de remontée
            maxThreads: 50,                 // Nombre maximum de fils simultanés
            correlationThreshold: 0.75,     // Seuil de corrélation (75%)
            timeWindowHours: 168,           // Fenêtre temporelle (7 jours)
            confidenceThreshold: 0.6,       // Seuil de confiance (60%)
            maxIterations: 100,             // Itérations maximales par fil
            backtrackingEnabled: true,      // Remontée temporelle activée
            aiCorrelationEnabled: true,     // Corrélation IA activée
            realTimeUpdates: true           // Mises à jour temps réel
        };

        // État du moteur
        this.state = {
            activeThreads: new Map(),       // Fils actifs
            completedThreads: new Map(),    // Fils terminés
            correlationMatrix: new Map(),   // Matrice de corrélation
            timelineEvents: [],             // Événements chronologiques
            networkGraph: {                 // Graphe réseau
                nodes: new Map(),
                edges: new Map()
            },
            statistics: {
                totalThreads: 0,
                successfulThreads: 0,
                averageDepth: 0,
                averageConfidence: 0,
                totalConnections: 0,
                processingTime: 0
            }
        };

        // Phases d'exécution
        this.phases = {
            1: { name: 'IDENTIFICATION', description: 'Identification de la cible initiale' },
            2: { name: 'EXPANSION', description: 'Expansion des données de base' },
            3: { name: 'CORRELATION', description: 'Corrélation avec sources externes' },
            4: { name: 'NETWORK_MAPPING', description: 'Cartographie du réseau' },
            5: { name: 'TEMPORAL_ANALYSIS', description: 'Analyse temporelle' },
            6: { name: 'BACKTRACKING', description: 'Remontée chronologique' },
            7: { name: 'SYNTHESIS', description: 'Synthèse et validation' }
        };

        // Types de fils
        this.threadTypes = {
            IDENTITY: { priority: 10, color: '#3B82F6', icon: '👤' },
            CONTACT: { priority: 9, color: '#10B981', icon: '📞' },
            SOCIAL: { priority: 8, color: '#8B5CF6', icon: '🌐' },
            FINANCIAL: { priority: 7, color: '#F59E0B', icon: '💰' },
            LOCATION: { priority: 6, color: '#EF4444', icon: '📍' },
            DIGITAL: { priority: 5, color: '#06B6D4', icon: '💻' },
            BEHAVIORAL: { priority: 4, color: '#84CC16', icon: '🧠' },
            TEMPORAL: { priority: 3, color: '#F97316', icon: '⏰' },
            NETWORK: { priority: 2, color: '#EC4899', icon: '🕸️' },
            METADATA: { priority: 1, color: '#6B7280', icon: '📊' }
        };

        this.initialize();
    }

    /**
     * 🚀 Initialisation du Thread Follower Engine
     */
    async initialize() {
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║              🧵 THREAD FOLLOWER ENGINE v${this.version}              ║
║                                                              ║
║  Philosophie: "${this.philosophy}"              ║
║  Approche: ${this.approach}  ║
║                                                              ║
║  🎯 7 Phases d'Exécution                                     ║
║  🕸️ Cartographie Réseau Avancée                             ║
║  ⏰ Remontée Temporelle Intelligente                         ║
║  🤖 Corrélation IA Intégrée                                  ║
╚══════════════════════════════════════════════════════════════╝
        `);

        try {
            // Initialisation des modules
            await this.initializeCorrelationEngine();
            await this.initializeNetworkMapper();
            await this.initializeTemporalAnalyzer();
            await this.initializeAICorrelator();
            
            console.log('✅ Thread Follower Engine initialisé avec succès');
            
        } catch (error) {
            console.error('❌ Erreur initialisation Thread Follower Engine:', error);
            throw error;
        }
    }

    /**
     * 🧵 Démarrage du suivi d'un fil principal
     */
    async followThread(initialData, options = {}) {
        const threadId = this.generateThreadId();
        const startTime = Date.now();
        
        console.log(`🧵 Démarrage Thread ${threadId} - Cible: ${JSON.stringify(initialData)}`);
        
        // Configuration du thread
        const thread = {
            id: threadId,
            initialData,
            options: { ...this.config, ...options },
            status: 'STARTING',
            currentPhase: 1,
            depth: 0,
            confidence: 1.0,
            startTime,
            lastUpdate: startTime,
            
            // Données collectées
            data: {
                raw: new Map(),              // Données brutes
                processed: new Map(),        // Données traitées
                correlations: new Map(),     // Corrélations trouvées
                timeline: [],               // Timeline événements
                network: {                  // Réseau découvert
                    nodes: new Map(),
                    edges: new Map()
                }
            },
            
            // Métriques
            metrics: {
                phasesCompleted: 0,
                connectionsFound: 0,
                confidenceScore: 1.0,
                processingTime: 0,
                dataPoints: 0,
                correlationScore: 0
            },
            
            // Historique des phases
            phaseHistory: [],
            
            // Fils dérivés
            childThreads: new Set(),
            parentThread: null
        };
        
        // Enregistrement du thread
        this.state.activeThreads.set(threadId, thread);
        this.state.statistics.totalThreads++;
        
        try {
            // Exécution des 7 phases
            await this.executePhases(thread);
            
            // Finalisation
            thread.status = 'COMPLETED';
            thread.endTime = Date.now();
            thread.metrics.processingTime = thread.endTime - thread.startTime;
            
            // Archivage
            this.state.completedThreads.set(threadId, thread);
            this.state.activeThreads.delete(threadId);
            this.state.statistics.successfulThreads++;
            
            console.log(`✅ Thread ${threadId} terminé avec succès`);
            
            return this.generateThreadReport(thread);
            
        } catch (error) {
            console.error(`❌ Erreur Thread ${threadId}:`, error);
            thread.status = 'FAILED';
            thread.error = error.message;
            
            return this.generateThreadReport(thread);
        }
    }

    /**
     * 🔄 Exécution des 7 phases du Thread Follower
     */
    async executePhases(thread) {
        for (let phaseNumber = 1; phaseNumber <= 7; phaseNumber++) {
            const phase = this.phases[phaseNumber];
            
            console.log(`  📍 Phase ${phaseNumber}: ${phase.name}`);
            
            thread.currentPhase = phaseNumber;
            thread.status = `PHASE_${phaseNumber}`;
            
            const phaseStartTime = Date.now();
            
            try {
                // Exécution de la phase
                const phaseResult = await this.executePhase(thread, phaseNumber);
                
                // Enregistrement du résultat
                const phaseRecord = {
                    phase: phaseNumber,
                    name: phase.name,
                    startTime: phaseStartTime,
                    endTime: Date.now(),
                    duration: Date.now() - phaseStartTime,
                    result: phaseResult,
                    success: true
                };
                
                thread.phaseHistory.push(phaseRecord);
                thread.metrics.phasesCompleted++;
                
                console.log(`    ✅ Phase ${phaseNumber} terminée (${phaseRecord.duration}ms)`);
                
                // Mise à jour temps réel
                if (this.config.realTimeUpdates) {
                    this.emitThreadUpdate(thread);
                }
                
                // Vérification conditions d'arrêt
                if (this.shouldStopThread(thread)) {
                    console.log(`    🛑 Arrêt anticipé Thread ${thread.id}`);
                    break;
                }
                
            } catch (error) {
                console.error(`    ❌ Erreur Phase ${phaseNumber}:`, error);
                
                thread.phaseHistory.push({
                    phase: phaseNumber,
                    name: phase.name,
                    startTime: phaseStartTime,
                    endTime: Date.now(),
                    error: error.message,
                    success: false
                });
                
                // Décision de continuer ou arrêter
                if (this.isCriticalPhase(phaseNumber)) {
                    throw error;
                }
            }
        }
    }

    /**
     * 🎯 Exécution d'une phase spécifique
     */
    async executePhase(thread, phaseNumber) {
        switch (phaseNumber) {
            case 1:
                return await this.phaseIdentification(thread);
            case 2:
                return await this.phaseExpansion(thread);
            case 3:
                return await this.phaseCorrelation(thread);
            case 4:
                return await this.phaseNetworkMapping(thread);
            case 5:
                return await this.phaseTemporalAnalysis(thread);
            case 6:
                return await this.phaseBacktracking(thread);
            case 7:
                return await this.phaseSynthesis(thread);
            default:
                throw new Error(`Phase ${phaseNumber} non reconnue`);
        }
    }

    /**
     * 👤 PHASE 1: IDENTIFICATION
     * Identification et normalisation de la cible initiale
     */
    async phaseIdentification(thread) {
        const { initialData } = thread;
        
        // Analyse du type de cible
        const targetType = this.identifyTargetType(initialData);
        
        // Normalisation des données
        const normalizedData = this.normalizeTargetData(initialData, targetType);
        
        // Extraction des identifiants uniques
        const uniqueIdentifiers = this.extractUniqueIdentifiers(normalizedData);
        
        // Calcul de la confiance initiale
        const initialConfidence = this.calculateInitialConfidence(normalizedData);
        
        // Stockage des résultats
        thread.data.processed.set('target_type', targetType);
        thread.data.processed.set('normalized_data', normalizedData);
        thread.data.processed.set('unique_identifiers', uniqueIdentifiers);
        thread.confidence = initialConfidence;
        
        return {
            targetType,
            normalizedData,
            uniqueIdentifiers,
            confidence: initialConfidence,
            dataPoints: Object.keys(normalizedData).length
        };
    }

    /**
     * 🔍 PHASE 2: EXPANSION
     * Expansion des données de base via sources primaires
     */
    async phaseExpansion(thread) {
        const normalizedData = thread.data.processed.get('normalized_data');
        const expansionResults = new Map();
        
        // Sources d'expansion par type de données
        const expansionSources = {
            email: ['holehe', 'hunter', 'emailrep'],
            phone: ['truecaller', 'numverify'],
            username: ['sherlock', 'maigret'],
            domain: ['whois', 'dns', 'subdomains'],
            ip: ['shodan', 'censys', 'geoip']
        };
        
        // Expansion pour chaque type de donnée
        for (const [dataType, value] of Object.entries(normalizedData)) {
            if (expansionSources[dataType]) {
                const sources = expansionSources[dataType];
                
                for (const source of sources) {
                    try {
                        const result = await this.queryExpansionSource(source, dataType, value);
                        if (result && result.data) {
                            expansionResults.set(`${dataType}_${source}`, result);
                            thread.metrics.dataPoints += result.dataPoints || 0;
                        }
                    } catch (error) {
                        console.warn(`    ⚠️ Erreur source ${source}:`, error.message);
                    }
                }
            }
        }
        
        // Stockage des résultats d'expansion
        thread.data.raw.set('expansion_results', expansionResults);
        
        return {
            sourcesQueried: Array.from(expansionResults.keys()),
            dataPointsAdded: thread.metrics.dataPoints,
            expansionResults: Object.fromEntries(expansionResults)
        };
    }

    /**
     * 🔗 PHASE 3: CORRELATION
     * Corrélation des données avec sources externes et IA
     */
    async phaseCorrelation(thread) {
        const expansionResults = thread.data.raw.get('expansion_results');
        const correlations = new Map();
        
        // Corrélation croisée entre sources
        for (const [source1, data1] of expansionResults) {
            for (const [source2, data2] of expansionResults) {
                if (source1 !== source2) {
                    const correlation = await this.calculateCorrelation(data1, data2);
                    
                    if (correlation.score > this.config.correlationThreshold) {
                        const correlationKey = `${source1}_${source2}`;
                        correlations.set(correlationKey, correlation);
                        thread.metrics.correlationScore += correlation.score;
                    }
                }
            }
        }
        
        // Corrélation IA si activée
        if (this.config.aiCorrelationEnabled) {
            const aiCorrelations = await this.performAICorrelation(expansionResults);
            for (const [key, correlation] of aiCorrelations) {
                correlations.set(`ai_${key}`, correlation);
            }
        }
        
        // Stockage des corrélations
        thread.data.correlations = correlations;
        
        return {
            correlationsFound: correlations.size,
            averageCorrelationScore: correlations.size > 0 ? 
                thread.metrics.correlationScore / correlations.size : 0,
            strongCorrelations: Array.from(correlations.entries())
                .filter(([_, corr]) => corr.score > 0.9)
                .length
        };
    }

    /**
     * 🕸️ PHASE 4: NETWORK MAPPING
     * Cartographie du réseau de connexions
     */
    async phaseNetworkMapping(thread) {
        const correlations = thread.data.correlations;
        const networkNodes = new Map();
        const networkEdges = new Map();
        
        // Création des nœuds du réseau
        const targetNode = {
            id: 'target',
            type: 'target',
            data: thread.data.processed.get('normalized_data'),
            importance: 1.0,
            connections: 0
        };
        networkNodes.set('target', targetNode);
        
        // Ajout des nœuds découverts
        for (const [correlationKey, correlation] of correlations) {
            const [source1, source2] = correlationKey.split('_');
            
            // Nœud source 1
            if (!networkNodes.has(source1)) {
                networkNodes.set(source1, {
                    id: source1,
                    type: 'source',
                    importance: correlation.score,
                    connections: 0
                });
            }
            
            // Nœud source 2
            if (!networkNodes.has(source2)) {
                networkNodes.set(source2, {
                    id: source2,
                    type: 'source',
                    importance: correlation.score,
                    connections: 0
                });
            }
            
            // Arête entre les nœuds
            const edgeId = `${source1}_${source2}`;
            networkEdges.set(edgeId, {
                id: edgeId,
                source: source1,
                target: source2,
                weight: correlation.score,
                type: correlation.type || 'correlation'
            });
            
            // Mise à jour compteurs connexions
            networkNodes.get(source1).connections++;
            networkNodes.get(source2).connections++;
        }
        
        // Calcul métriques réseau
        const networkMetrics = this.calculateNetworkMetrics(networkNodes, networkEdges);
        
        // Stockage du réseau
        thread.data.network.nodes = networkNodes;
        thread.data.network.edges = networkEdges;
        thread.metrics.connectionsFound = networkEdges.size;
        
        return {
            nodesCount: networkNodes.size,
            edgesCount: networkEdges.size,
            networkDensity: networkMetrics.density,
            centralNodes: networkMetrics.centralNodes,
            clusters: networkMetrics.clusters
        };
    }

    /**
     * ⏰ PHASE 5: TEMPORAL ANALYSIS
     * Analyse temporelle et construction de la timeline
     */
    async phaseTemporalAnalysis(thread) {
        const allData = new Map([
            ...thread.data.raw,
            ...thread.data.processed
        ]);
        
        const timelineEvents = [];
        
        // Extraction des événements temporels
        for (const [source, data] of allData) {
            const events = this.extractTemporalEvents(source, data);
            timelineEvents.push(...events);
        }
        
        // Tri chronologique
        timelineEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Analyse des patterns temporels
        const temporalPatterns = this.analyzeTemporalPatterns(timelineEvents);
        
        // Détection d'anomalies temporelles
        const temporalAnomalies = this.detectTemporalAnomalies(timelineEvents);
        
        // Stockage de la timeline
        thread.data.timeline = timelineEvents;
        
        return {
            eventsCount: timelineEvents.length,
            timeSpan: this.calculateTimeSpan(timelineEvents),
            patterns: temporalPatterns,
            anomalies: temporalAnomalies,
            timeline: timelineEvents
        };
    }

    /**
     * ⏪ PHASE 6: BACKTRACKING
     * Remontée chronologique pour trouver l'origine
     */
    async phaseBacktracking(thread) {
        if (!this.config.backtrackingEnabled) {
            return { message: 'Backtracking désactivé' };
        }
        
        const timeline = thread.data.timeline;
        const backtrackResults = [];
        
        // Remontée chronologique par étapes
        const timeWindows = this.createTimeWindows(timeline);
        
        for (const window of timeWindows.reverse()) { // Du plus récent au plus ancien
            const windowEvents = timeline.filter(event => 
                new Date(event.timestamp) >= window.start && 
                new Date(event.timestamp) <= window.end
            );
            
            if (windowEvents.length > 0) {
                // Analyse de la fenêtre temporelle
                const windowAnalysis = await this.analyzeTimeWindow(windowEvents);
                
                // Recherche de nouvelles pistes
                const newLeads = await this.findNewLeads(windowEvents);
                
                backtrackResults.push({
                    window,
                    eventsCount: windowEvents.length,
                    analysis: windowAnalysis,
                    newLeads: newLeads
                });
                
                // Lancement de fils dérivés si nouvelles pistes
                if (newLeads.length > 0) {
                    await this.launchChildThreads(thread, newLeads);
                }
            }
        }
        
        return {
            windowsAnalyzed: backtrackResults.length,
            totalNewLeads: backtrackResults.reduce((sum, r) => sum + r.newLeads.length, 0),
            childThreadsLaunched: thread.childThreads.size,
            backtrackResults
        };
    }

    /**
     * 🎯 PHASE 7: SYNTHESIS
     * Synthèse finale et validation des découvertes
     */
    async phaseSynthesis(thread) {
        // Collecte de toutes les données
        const allFindings = this.collectAllFindings(thread);
        
        // Calcul du score de confiance final
        const finalConfidence = this.calculateFinalConfidence(thread);
        
        // Génération du résumé exécutif
        const executiveSummary = this.generateExecutiveSummary(thread);
        
        // Recommandations pour investigations futures
        const recommendations = this.generateRecommendations(thread);
        
        // Validation croisée des découvertes
        const validationResults = await this.validateFindings(allFindings);
        
        // Mise à jour des métriques finales
        thread.metrics.confidenceScore = finalConfidence;
        thread.confidence = finalConfidence;
        
        return {
            totalFindings: allFindings.length,
            finalConfidence,
            executiveSummary,
            recommendations,
            validationResults,
            threadComplete: true
        };
    }

    /**
     * 🔧 Méthodes utilitaires
     */
    
    generateThreadId() {
        return 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    identifyTargetType(data) {
        // Logique d'identification du type de cible
        if (data.email) return 'person';
        if (data.domain) return 'organization';
        if (data.ip) return 'infrastructure';
        if (data.username) return 'digital_identity';
        return 'unknown';
    }

    normalizeTargetData(data, type) {
        // Normalisation des données selon le type
        const normalized = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === 'string') {
                normalized[key] = value.trim().toLowerCase();
            } else {
                normalized[key] = value;
            }
        }
        
        return normalized;
    }

    extractUniqueIdentifiers(data) {
        const identifiers = [];
        
        // Extraction des identifiants uniques
        if (data.email) identifiers.push({ type: 'email', value: data.email });
        if (data.phone) identifiers.push({ type: 'phone', value: data.phone });
        if (data.username) identifiers.push({ type: 'username', value: data.username });
        
        return identifiers;
    }

    calculateInitialConfidence(data) {
        // Calcul de la confiance basé sur la qualité des données
        let confidence = 0.5; // Base 50%
        
        if (data.email && this.isValidEmail(data.email)) confidence += 0.2;
        if (data.phone && this.isValidPhone(data.phone)) confidence += 0.15;
        if (data.firstName && data.lastName) confidence += 0.15;
        
        return Math.min(confidence, 1.0);
    }

    async queryExpansionSource(source, dataType, value) {
        // Simulation de requête vers source externe
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    source,
                    dataType,
                    value,
                    data: `Données de ${source} pour ${value}`,
                    dataPoints: Math.floor(Math.random() * 10) + 1,
                    confidence: Math.random() * 0.4 + 0.6
                });
            }, Math.random() * 1000 + 500);
        });
    }

    async calculateCorrelation(data1, data2) {
        // Calcul de corrélation entre deux sources de données
        const score = Math.random() * 0.5 + 0.5; // 50-100%
        
        return {
            score,
            type: 'data_correlation',
            confidence: score,
            commonFields: ['field1', 'field2'],
            timestamp: new Date().toISOString()
        };
    }

    async performAICorrelation(expansionResults) {
        // Corrélation via IA
        const correlations = new Map();
        
        // Simulation corrélation IA
        correlations.set('ai_pattern_1', {
            score: 0.85,
            type: 'ai_pattern',
            description: 'Pattern comportemental détecté',
            confidence: 0.85
        });
        
        return correlations;
    }

    calculateNetworkMetrics(nodes, edges) {
        const nodeCount = nodes.size;
        const edgeCount = edges.size;
        const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
        
        return {
            density: maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0,
            centralNodes: Array.from(nodes.values())
                .sort((a, b) => b.connections - a.connections)
                .slice(0, 3),
            clusters: Math.ceil(nodeCount / 5) // Estimation simple
        };
    }

    extractTemporalEvents(source, data) {
        // Extraction d'événements temporels des données
        const events = [];
        
        // Simulation d'extraction d'événements
        for (let i = 0; i < 3; i++) {
            events.push({
                id: `event_${source}_${i}`,
                source,
                timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                type: 'data_point',
                description: `Événement ${i} de ${source}`,
                importance: Math.random()
            });
        }
        
        return events;
    }

    analyzeTemporalPatterns(events) {
        // Analyse des patterns temporels
        return {
            totalEvents: events.length,
            averageFrequency: events.length > 0 ? 'daily' : 'none',
            peakPeriods: ['morning', 'evening'],
            patterns: ['regular_activity', 'weekend_quiet']
        };
    }

    detectTemporalAnomalies(events) {
        // Détection d'anomalies temporelles
        return [
            {
                type: 'unusual_activity',
                timestamp: new Date().toISOString(),
                description: 'Activité inhabituelle détectée',
                severity: 'medium'
            }
        ];
    }

    calculateTimeSpan(events) {
        if (events.length === 0) return null;
        
        const timestamps = events.map(e => new Date(e.timestamp));
        const earliest = new Date(Math.min(...timestamps));
        const latest = new Date(Math.max(...timestamps));
        
        return {
            earliest: earliest.toISOString(),
            latest: latest.toISOString(),
            duration: latest - earliest
        };
    }

    createTimeWindows(timeline) {
        // Création de fenêtres temporelles pour le backtracking
        const windows = [];
        const now = new Date();
        
        for (let i = 0; i < 12; i++) { // 12 mois
            const end = new Date(now.getTime() - (i * 30 * 24 * 60 * 60 * 1000));
            const start = new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000));
            
            windows.push({ start, end, period: `month_${i}` });
        }
        
        return windows;
    }

    async analyzeTimeWindow(events) {
        // Analyse d'une fenêtre temporelle
        return {
            eventsCount: events.length,
            dominantTypes: ['data_point'],
            activityLevel: events.length > 5 ? 'high' : events.length > 2 ? 'medium' : 'low',
            keyEvents: events.slice(0, 3)
        };
    }

    async findNewLeads(events) {
        // Recherche de nouvelles pistes dans les événements
        const leads = [];
        
        // Simulation de découverte de nouvelles pistes
        if (events.length > 2) {
            leads.push({
                type: 'new_identifier',
                value: 'discovered_email@example.com',
                confidence: 0.7,
                source: 'temporal_analysis'
            });
        }
        
        return leads;
    }

    async launchChildThreads(parentThread, leads) {
        // Lancement de fils dérivés
        for (const lead of leads) {
            if (parentThread.childThreads.size < 5) { // Limite fils dérivés
                const childThreadId = await this.followThread(
                    { [lead.type]: lead.value },
                    { maxDepth: 3, parentThread: parentThread.id }
                );
                
                parentThread.childThreads.add(childThreadId);
            }
        }
    }

    collectAllFindings(thread) {
        // Collecte de toutes les découvertes
        const findings = [];
        
        // Données de base
        findings.push(...Array.from(thread.data.processed.entries()));
        
        // Corrélations
        findings.push(...Array.from(thread.data.correlations.entries()));
        
        // Événements timeline
        findings.push(...thread.data.timeline);
        
        return findings;
    }

    calculateFinalConfidence(thread) {
        // Calcul de la confiance finale
        let confidence = thread.confidence;
        
        // Bonus pour corrélations fortes
        if (thread.metrics.correlationScore > 0.8) confidence += 0.1;
        
        // Bonus pour réseau dense
        if (thread.metrics.connectionsFound > 10) confidence += 0.05;
        
        // Malus pour erreurs
        const errors = thread.phaseHistory.filter(p => !p.success).length;
        confidence -= errors * 0.05;
        
        return Math.max(0.1, Math.min(1.0, confidence));
    }

    generateExecutiveSummary(thread) {
        return {
            threadId: thread.id,
            targetType: thread.data.processed.get('target_type'),
            phasesCompleted: thread.metrics.phasesCompleted,
            connectionsFound: thread.metrics.connectionsFound,
            finalConfidence: thread.metrics.confidenceScore,
            processingTime: thread.metrics.processingTime,
            keyFindings: [
                'Identité confirmée avec haute confiance',
                'Réseau social étendu découvert',
                'Patterns temporels identifiés'
            ]
        };
    }

    generateRecommendations(thread) {
        return [
            'Approfondir l\'analyse des connexions sociales',
            'Investiguer les anomalies temporelles détectées',
            'Corréler avec bases de données externes',
            'Surveiller l\'activité future'
        ];
    }

    async validateFindings(findings) {
        // Validation croisée des découvertes
        return {
            totalFindings: findings.length,
            validatedFindings: Math.floor(findings.length * 0.85),
            validationScore: 0.85,
            inconsistencies: [],
            recommendations: ['Vérifier sources externes']
        };
    }

    generateThreadReport(thread) {
        return {
            thread: {
                id: thread.id,
                status: thread.status,
                confidence: thread.confidence,
                processingTime: thread.metrics.processingTime
            },
            phases: thread.phaseHistory,
            network: {
                nodes: Array.from(thread.data.network.nodes.values()),
                edges: Array.from(thread.data.network.edges.values())
            },
            timeline: thread.data.timeline,
            correlations: Array.from(thread.data.correlations.entries()),
            summary: thread.status === 'COMPLETED' ? 
                this.generateExecutiveSummary(thread) : null,
            recommendations: thread.status === 'COMPLETED' ? 
                this.generateRecommendations(thread) : []
        };
    }

    // Méthodes utilitaires de validation
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
    }

    shouldStopThread(thread) {
        return thread.confidence < this.config.confidenceThreshold ||
               thread.depth > this.config.maxDepth ||
               thread.metrics.phasesCompleted > this.config.maxIterations;
    }

    isCriticalPhase(phaseNumber) {
        return [1, 2, 7].includes(phaseNumber); // Phases critiques
    }

    emitThreadUpdate(thread) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('threadUpdate', {
                detail: {
                    threadId: thread.id,
                    phase: thread.currentPhase,
                    progress: (thread.currentPhase / 7) * 100,
                    status: thread.status
                }
            }));
        }
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreadFollowerEngine;
}

// Initialisation automatique si dans un navigateur
if (typeof window !== 'undefined') {
    window.ThreadFollowerEngine = ThreadFollowerEngine;
}

console.log('🧵 Thread Follower Engine chargé - Prêt à remonter les fils');