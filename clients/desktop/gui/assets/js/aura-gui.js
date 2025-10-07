class AuraGUI {
    constructor() {
        this.currentAnalysis = null;
        this.profiles = [];
        this.googleDorks = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadGoogleDorks();
    }

    setupNavigation() {
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('[data-section]').dataset.section;
                this.showSection(section);
            });
        });
    }

    setupEventListeners() {
        // Formulaire OSINT
        const osintForm = document.getElementById('osint-form');
        if (osintForm) {
            osintForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startOSINTAnalysis();
            });
        }
    }

    showSection(sectionName) {
        // Cacher toutes les sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Charger les données spécifiques à la section
        this.loadSectionData(sectionName);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'profiles':
                await this.loadProfiles();
                break;
            case 'dorks':
                await this.loadGoogleDorksUI();
                break;
            case 'correlation':
                await this.loadCorrelationData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            
            document.getElementById('profiles-count').textContent = `${data.profiles || 0} profils`;
            document.getElementById('analyses-count').textContent = `${data.analyses || 0} analyses`;
            document.getElementById('correlations-count').textContent = `${data.correlations || 0} liens`;
            
            this.updateRecentActivity(data.recent_activity || []);
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        }
    }

    updateRecentActivity(activities) {
        const container = document.getElementById('recent-activity');
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucune activité récente</p>';
            return;
        }

        let html = '';
        activities.forEach(activity => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>${activity.type}</strong> - ${activity.target}
                        <br><small class="text-muted">${new Date(activity.timestamp).toLocaleString()}</small>
                    </div>
                    <span class="badge bg-${activity.status === 'success' ? 'success' : 'warning'}">${activity.status}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    async startOSINTAnalysis() {
        const platform = document.getElementById('platform-select').value;
        const analysisType = document.getElementById('analysis-type').value;
        const target = document.getElementById('target-input').value.trim();
        const deepSearch = document.getElementById('deep-search').checked;
        const includeMetadata = document.getElementById('include-metadata').checked;

        if (!target) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez saisir une cible à analyser',
                background: '#212529',
                color: '#fff'
            });
            return;
        }

        // Afficher la fenêtre de processus
        this.showAnalysisProcess();

        try {
            // Étape 1: Initialisation
            this.updateProcessStep('Initialisation de l\'analyse...', 10);
            
            // Étape 2: Création du profil cible
            this.updateProcessStep('Création du profil cible...', 25);
            
            const response = await fetch('/api/analytics/cross-platform-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: target,
                    platforms: platform === 'all' ? ['tiktok', 'instagram', 'twitter', 'facebook'] : [platform],
                    analysisType: analysisType,
                    options: {
                        deep_search: deepSearch,
                        include_metadata: includeMetadata
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            // Étape 3: Collecte des données
            this.updateProcessStep('Collecte des données OSINT...', 50);
            
            const results = await response.json();
            
            // Étape 4: Analyse et corrélation
            this.updateProcessStep('Analyse et corrélation...', 75);
            
            // Simulation du processus d'analyse
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Étape 5: Finalisation
            this.updateProcessStep('Finalisation...', 100);
            
            // Afficher les résultats
            await this.displayOSINTResults(results);
            
            // Notification de succès
            Swal.fire({
                icon: 'success',
                title: 'Analyse terminée !',
                text: `${results.matches?.length || 0} résultats trouvés`,
                background: '#212529',
                color: '#fff',
                timer: 3000
            });

            // Confirmer la création en base
            if (results.target_id) {
                Swal.fire({
                    icon: 'info',
                    title: 'Profil créé',
                    text: `Profil sauvegardé avec l'ID: ${results.target_id}`,
                    background: '#212529',
                    color: '#fff',
                    timer: 2000
                });
            }

        } catch (error) {
            console.error('Erreur analyse OSINT:', error);
            this.updateProcessStep(`Erreur: ${error.message}`, 0, 'error');
            
            Swal.fire({
                icon: 'error',
                title: 'Erreur d\'analyse',
                text: error.message,
                background: '#212529',
                color: '#fff'
            });
        }
    }

    showAnalysisProcess() {
        document.getElementById('analysis-process').classList.remove('d-none');
        document.getElementById('process-steps').innerHTML = '';
        document.getElementById('analysis-progress').style.width = '0%';
    }

    updateProcessStep(message, progress, status = 'info') {
        const stepsContainer = document.getElementById('process-steps');
        const progressBar = document.getElementById('analysis-progress');
        
        // Mettre à jour la barre de progression
        progressBar.style.width = `${progress}%`;
        progressBar.className = `progress-bar progress-bar-striped ${progress < 100 ? 'progress-bar-animated' : ''}`;
        
        if (status === 'error') {
            progressBar.classList.add('bg-danger');
        } else if (progress === 100) {
            progressBar.classList.add('bg-success');
        }

        // Ajouter l'étape
        const stepElement = document.createElement('div');
        stepElement.className = `d-flex align-items-center mb-2 text-${status === 'error' ? 'danger' : 'light'}`;
        stepElement.innerHTML = `
            <i class="bi bi-${status === 'error' ? 'x-circle' : progress === 100 ? 'check-circle' : 'arrow-right'} me-2"></i>
            ${message}
            <small class="ms-auto">${new Date().toLocaleTimeString()}</small>
        `;
        
        stepsContainer.appendChild(stepElement);
        stepsContainer.scrollTop = stepsContainer.scrollHeight;
    }

    async displayOSINTResults(results) {
        const resultsContainer = document.getElementById('analysis-results');
        resultsContainer.classList.remove('d-none');

        let html = `
            <div class="card bg-dark mt-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">🎯 Résultats de l'analyse</h5>
                    <div>
                        <button class="btn btn-sm btn-success me-2" onclick="exportResults()">
                            <i class="bi bi-download"></i> Exporter
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="correlateResults()">
                            <i class="bi bi-diagram-3"></i> Corréler
                        </button>
                    </div>
                </div>
                <div class="card-body">
        `;

        if (results.matches && results.matches.length > 0) {
            html += '<div class="row">';
            results.matches.forEach((match, index) => {
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card bg-secondary">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="card-title">
                                        <i class="bi bi-${this.getPlatformIcon(match.platform)} me-2"></i>
                                        ${match.platform || 'TikTok'}
                                    </h6>
                                    <span class="badge bg-${this.getConfidenceColor(match.confidence_score)}">${(match.confidence_score * 100).toFixed(1)}%</span>
                                </div>
                                <p class="card-text">
                                    <strong>@${match.username || 'Utilisateur'}</strong><br>
                                    ${match.bio ? `<small>${match.bio.substring(0, 100)}...</small><br>` : ''}
                                    <small class="text-muted">Followers: ${match.followers_count || 'N/A'}</small><br>
                                    <small class="text-muted">Collecté: ${new Date(match.collected_at || Date.now()).toLocaleString()}</small>
                                </p>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary" onclick="viewProfile('${match.target_id}')">
                                        <i class="bi bi-eye"></i> Voir
                                    </button>
                                    <button class="btn btn-outline-success" onclick="analyzeDeeper('${match.target_id}')">
                                        <i class="bi bi-search"></i> Approfondir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<div class="alert alert-warning">Aucun résultat trouvé pour cette recherche.</div>';
        }

        html += `
                    <div class="mt-3">
                        <small class="text-muted">
                            Recherche effectuée le ${new Date().toLocaleString()} | 
                            Hash d'intégrité: ${results.evidence_hash || 'N/A'}
                        </small>
                    </div>
                </div>
            </div>
        `;

        resultsContainer.innerHTML = html;
    }

    getPlatformIcon(platform) {
        const icons = {
            'tiktok': 'music-note-beamed',
            'instagram': 'camera',
            'twitter': 'twitter',
            'facebook': 'facebook'
        };
        return icons[platform] || 'globe';
    }

    getConfidenceColor(score) {
        if (score >= 0.8) return 'success';
        if (score >= 0.6) return 'warning';
        return 'danger';
    }

    async loadProfiles() {
        try {
            const response = await fetch('/api/analytics/profiles');
            const profiles = await response.json();
            
            const container = document.getElementById('profiles-list');
            if (profiles.length === 0) {
                container.innerHTML = '<div class="alert alert-info">Aucun profil trouvé</div>';
                return;
            }

            let html = '<div class="row">';
            profiles.forEach(profile => {
                html += `
                    <div class="col-md-4 mb-3">
                        <div class="card bg-secondary">
                            <div class="card-body">
                                <h6 class="card-title">@${profile.username}</h6>
                                <p class="card-text">
                                    <small>Plateforme: ${profile.platform}</small><br>
                                    <small>Créé: ${new Date(profile.created_at).toLocaleDateString()}</small>
                                </p>
                                <button class="btn btn-sm btn-primary" onclick="viewProfile('${profile.target_id}')">
                                    Voir détails
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Erreur chargement profils:', error);
        }
    }

    loadGoogleDorks() {
        this.googleDorks = {
            'social_media': {
                name: 'Réseaux sociaux',
                dorks: [
                    'site:tiktok.com "@username"',
                    'site:instagram.com "username"',
                    'site:twitter.com "username"',
                    'site:facebook.com "username"'
                ]
            },
            'personal_info': {
                name: 'Informations personnelles',
                dorks: [
                    '"nom prénom" site:linkedin.com',
                    '"email@domain.com"',
                    '"numéro de téléphone"',
                    'intitle:"CV" OR intitle:"Resume" "nom"'
                ]
            },
            'documents': {
                name: 'Documents',
                dorks: [
                    'filetype:pdf "nom prénom"',
                    'filetype:doc "nom prénom"',
                    'filetype:xlsx "nom prénom"'
                ]
            },
            'images': {
                name: 'Images',
                dorks: [
                    'site:imgur.com "username"',
                    'site:flickr.com "username"',
                    'inurl:photo "username"'
                ]
            }
        };
    }

    async loadGoogleDorksUI() {
        const categoriesContainer = document.getElementById('dorks-categories');
        let html = '';
        
        Object.entries(this.googleDorks).forEach(([key, category]) => {
            html += `
                <button class="list-group-item list-group-item-action bg-secondary text-light" 
                        onclick="selectDorkCategory('${key}')">
                    ${category.name}
                    <span class="badge bg-primary rounded-pill">${category.dorks.length}</span>
                </button>
            `;
        });
        
        categoriesContainer.innerHTML = html;
    }

    selectDorkCategory(categoryKey) {
        const category = this.googleDorks[categoryKey];
        const container = document.getElementById('selected-dorks');
        
        let html = `<h6>${category.name}</h6>`;
        category.dorks.forEach((dork, index) => {
            html += `
                <div class="mb-2">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control bg-dark text-light" value="${dork}" readonly>
                        <button class="btn btn-outline-primary" onclick="copyDork('${dork}')">
                            <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="searchWithDork('${dork}')">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    copyDork(dork) {
        navigator.clipboard.writeText(dork);
        Swal.fire({
            icon: 'success',
            title: 'Copié !',
            text: 'Dork copié dans le presse-papiers',
            background: '#212529',
            color: '#fff',
            timer: 1500,
            showConfirmButton: false
        });
    }

    searchWithDork(dork) {
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(dork)}`;
        window.open(googleUrl, '_blank');
    }

    // === STEALTH LOGGER METHODS ===
    
    async startStealthSession() {
        const targetUrl = document.getElementById('stealth-target-url').value;
        const profilePath = document.getElementById('stealth-profile-path').value;
        
        try {
            const response = await fetch('/api/stealth/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: targetUrl || 'https://www.tiktok.com',
                    profilePath: profilePath || null
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Session stealth démarrée !',
                    text: `Session ID: ${result.sessionId}`,
                    background: '#212529',
                    color: '#fff',
                    timer: 3000
                });
                
                this.updateStealthUI(true);
                this.startStealthMonitoring();
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur session stealth',
                text: error.message,
                background: '#212529',
                color: '#fff'
            });
        }
    }
    
    async stopStealthSession() {
        try {
            const response = await fetch('/api/stealth/stop', { method: 'POST' });
            const result = await response.json();
            
            if (result.success) {
                Swal.fire({
                    icon: 'info',
                    title: 'Session arrêtée',
                    text: 'Logs exportés avec succès',
                    background: '#212529',
                    color: '#fff',
                    timer: 2000
                });
                
                this.updateStealthUI(false);
                this.stopStealthMonitoring();
            }
            
        } catch (error) {
            console.error('Erreur arrêt session:', error);
        }
    }
    
    updateStealthUI(isActive) {
        const startBtn = document.getElementById('start-stealth-btn');
        const stopBtn = document.getElementById('stop-stealth-btn');
        const statusEl = document.getElementById('stealth-status');
        
        if (isActive) {
            startBtn.classList.add('d-none');
            stopBtn.classList.remove('d-none');
            statusEl.textContent = 'Actif';
            statusEl.className = 'card-text text-success';
        } else {
            startBtn.classList.remove('d-none');
            stopBtn.classList.add('d-none');
            statusEl.textContent = 'Inactif';
            statusEl.className = 'card-text text-muted';
        }
    }
    
    startStealthMonitoring() {
        this.stealthInterval = setInterval(async () => {
            await this.updateStealthStats();
            await this.updateStealthLogs();
        }, 2000);
    }
    
    stopStealthMonitoring() {
        if (this.stealthInterval) {
            clearInterval(this.stealthInterval);
            this.stealthInterval = null;
        }
    }
    
    async updateStealthStats() {
        try {
            const response = await fetch('/api/stealth/status');
            const status = await response.json();
            
            document.getElementById('stealth-logs-count').textContent = status.logs_count || 0;
            document.getElementById('stealth-uptime').textContent = this.formatUptime(status.uptime || 0);
            
            // Forensic count
            const forensicResponse = await fetch('/api/stealth/forensic');
            const forensicData = await forensicResponse.json();
            document.getElementById('stealth-forensic-count').textContent = forensicData.high_value_count || 0;
            
        } catch (error) {
            console.error('Erreur stats stealth:', error);
        }
    }
    
    async updateStealthLogs() {
        try {
            const filter = document.getElementById('logs-filter').value;
            const url = filter === 'all' ? '/api/stealth/logs' : `/api/stealth/logs?type=${filter}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.displayStealthLogs(data.logs || []);
            
        } catch (error) {
            console.error('Erreur logs stealth:', error);
        }
    }
    
    displayStealthLogs(logs) {
        const container = document.getElementById('stealth-logs-container');
        
        if (logs.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucun log disponible</p>';
            return;
        }
        
        let html = '';
        logs.slice(0, 50).forEach(log => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            const typeColor = this.getLogTypeColor(log.type);
            
            html += `
                <div class="mb-2 p-2 border-start border-${typeColor} border-3" style="background: rgba(0,0,0,0.2);">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-${typeColor} me-2">${log.type}</span>
                            <small class="text-muted">${time}</small>
                        </div>
                    </div>
                    <div class="mt-1">
                        <small>${this.formatLogContent(log)}</small>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.scrollTop = 0;
    }
    
    getLogTypeColor(type) {
        const colors = {
            'network_request': 'primary',
            'network_response': 'info',
            'console': 'warning',
            'forensic': 'danger',
            'tiktok_response_data': 'success'
        };
        return colors[type] || 'secondary';
    }
    
    formatLogContent(log) {
        switch (log.type) {
            case 'network_request':
                return `${log.method} ${log.url}`;
            case 'network_response':
                return `${log.status} ${log.url}`;
            case 'console':
                return `[${log.level}] ${log.text}`;
            case 'tiktok_response_data':
                return `TikTok API: ${log.url} (Hash: ${log.data_hash?.substring(0, 8)}...)`;
            default:
                return JSON.stringify(log).substring(0, 100) + '...';
        }
    }
    
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    async refreshForensicAnalysis() {
        try {
            const response = await fetch('/api/stealth/analysis');
            const data = await response.json();
            
            if (!data.analysis) {
                document.getElementById('forensic-analysis').innerHTML = 
                    '<p class="text-muted">Aucune analyse disponible</p>';
                return;
            }
            
            const analysis = data.analysis;
            let html = `
                <div class="row">
                    <div class="col-md-6">
                        <h6>Analyse réseau</h6>
                        <ul class="list-unstyled">
                            <li>Requêtes totales: <strong>${analysis.network_analysis.total_requests}</strong></li>
                            <li>Appels API TikTok: <strong>${analysis.network_analysis.tiktok_api_calls}</strong></li>
                            <li>Endpoints uniques: <strong>${analysis.network_analysis.unique_endpoints}</strong></li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>Analyse forensique</h6>
                        <ul class="list-unstyled">
                            <li>Données haute valeur: <strong>${analysis.forensic_analysis.high_value_data}</strong></li>
                            <li>Profils détectés: <strong>${analysis.forensic_analysis.user_profiles_detected}</strong></li>
                            <li>Lives détectés: <strong>${analysis.forensic_analysis.live_streams_detected}</strong></li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Analyse sécurité</h6>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="text-center">
                                    <div class="h4 text-info">${analysis.security_analysis.cookies_captured}</div>
                                    <small>Cookies</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <div class="h4 text-warning">${analysis.security_analysis.storage_snapshots}</div>
                                    <small>Storage</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <div class="h4 text-danger">${analysis.security_analysis.console_errors}</div>
                                    <small>Erreurs</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <div class="h4 text-success">${analysis.security_analysis.potential_tracking}</div>
                                    <small>Tracking</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('forensic-analysis').innerHTML = html;
            
        } catch (error) {
            console.error('Erreur analyse forensique:', error);
        }
    }

    stopAnalysis() {
        if (this.currentAnalysis) {
            // Logique pour arrêter l'analyse en cours
            this.currentAnalysis = null;
        }
        
        document.getElementById('analysis-process').classList.add('d-none');
        
        Swal.fire({
            icon: 'info',
            title: 'Analyse arrêtée',
            text: 'L\'analyse a été interrompue',
            background: '#212529',
            color: '#fff',
            timer: 2000
        });
    }
}

// Fonctions globales
function viewProfile(targetId) {
    // Logique pour afficher les détails d'un profil
    console.log('Affichage profil:', targetId);
}

function analyzeDeeper(targetId) {
    // Logique pour une analyse plus approfondie
    console.log('Analyse approfondie:', targetId);
}

function exportResults() {
    // Logique d'export
    Swal.fire({
        icon: 'success',
        title: 'Export en cours',
        text: 'Les résultats sont en cours d\'export...',
        background: '#212529',
        color: '#fff',
        timer: 2000
    });
}

function correlateResults() {
    // Logique de corrélation
    console.log('Corrélation des résultats');
}

function refreshProfiles() {
    const gui = new AuraGUI();
    gui.loadProfiles();
}

// Fonctions Stealth Logger globales
function startStealthSession() {
    window.auraGUI.startStealthSession();
}

function stopStealthSession() {
    window.auraGUI.stopStealthSession();
}

function filterStealthLogs() {
    window.auraGUI.updateStealthLogs();
}

function refreshForensicAnalysis() {
    window.auraGUI.refreshForensicAnalysis();
}

function selectDorkCategory(category) {
    window.auraGUI.selectDorkCategory(category);
}

function copyDork(dork) {
    window.auraGUI.copyDork(dork);
}

function searchWithDork(dork) {
    window.auraGUI.searchWithDork(dork);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.auraGUI = new AuraGUI();
});