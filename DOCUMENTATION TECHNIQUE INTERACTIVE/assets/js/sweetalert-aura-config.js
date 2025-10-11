/**
 * 🎯 AURA OSINT - SweetAlert2 Configuration Complète
 * Système d'alertes basé sur le Golden Ratio (Φ = 1.618)
 * Architecture: Frontend consolidation structurelle
 */

import Swal from 'sweetalert2';

// 🌟 Configuration Golden Ratio
const PHI = 1.618;
const GOLDEN_COLORS = {
    primary: '#C9A96E',      // Or doré
    secondary: '#8B7355',    // Bronze
    success: '#2ECC71',      // Vert émeraude
    warning: '#F39C12',      // Orange ambre
    error: '#E74C3C',        // Rouge rubis
    info: '#3498DB',         // Bleu saphir
    dark: '#2C3E50',         // Bleu nuit
    light: '#ECF0F1'         // Blanc perle
};

// 🎨 Configuration globale AURA SweetAlert2
const AuraSwal = Swal.mixin({
    customClass: {
        confirmButton: 'aura-btn aura-btn-primary',
        cancelButton: 'aura-btn aura-btn-secondary', 
        denyButton: 'aura-btn aura-btn-danger',
        popup: 'aura-swal-popup',
        header: 'aura-swal-header',
        title: 'aura-swal-title',
        closeButton: 'aura-swal-close',
        icon: 'aura-swal-icon',
        image: 'aura-swal-image',
        content: 'aura-swal-content',
        htmlContainer: 'aura-swal-html-container',
        input: 'aura-swal-input',
        inputLabel: 'aura-swal-input-label',
        validationMessage: 'aura-swal-validation-message',
        actions: 'aura-swal-actions',
        footer: 'aura-swal-footer',
        progressSteps: 'aura-swal-progress-steps'
    },
    buttonsStyling: false,
    showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster',
        backdrop: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster',
        backdrop: 'animate__animated animate__fadeOut animate__faster'
    },
    backdrop: `rgba(44, 62, 80, 0.8)`,
    allowOutsideClick: false,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: false,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showCancelButton: false,
    showDenyButton: false,
    showCloseButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    denyButtonText: 'Refuser',
    closeButtonAriaLabel: 'Fermer cette boîte de dialogue',
    timer: undefined,
    timerProgressBar: false,
    heightAuto: true,
    padding: `${PHI}rem`,
    width: `${PHI * 400}px`,
    background: '#ffffff',
    position: 'center',
    grow: false,
    showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
    }
});

// 🎯 Classe principale AURA Alerts
class AuraAlerts {
    constructor() {
        this.defaultConfig = {
            confirmButtonColor: GOLDEN_COLORS.primary,
            cancelButtonColor: GOLDEN_COLORS.secondary,
            iconColor: GOLDEN_COLORS.primary
        };
    }

    // 🚀 1. Alerte de démarrage investigation
    async startInvestigation(targetName = '') {
        return await AuraSwal.fire({
            title: '🎯 Nouvelle Investigation OSINT',
            html: `
                <div class="aura-investigation-start">
                    <div class="golden-spiral-icon">🌀</div>
                    <p>Démarrage de l'investigation pour:</p>
                    <strong class="target-name">${targetName || 'Cible non spécifiée'}</strong>
                    <div class="investigation-stats">
                        <div class="stat-item">
                            <span class="stat-number">150+</span>
                            <span class="stat-label">Outils OSINT</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">∞</span>
                            <span class="stat-label">Sources de données</span>
                        </div>
                    </div>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: '🚀 Lancer l\'investigation',
            cancelButtonText: '❌ Annuler',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('Investigation initialisée');
                    }, 2000);
                });
            }
        });
    }

    // 📊 2. Progression investigation avec étapes
    async showProgress(currentStep, totalSteps, toolName, progress = 0) {
        const progressHtml = `
            <div class="aura-progress-container">
                <div class="current-tool">
                    <div class="tool-icon">🔍</div>
                    <div class="tool-info">
                        <h4>${toolName}</h4>
                        <p>Étape ${currentStep} sur ${totalSteps}</p>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <span class="progress-text">${progress}%</span>
                </div>
                <div class="investigation-timeline">
                    <div class="timeline-item ${currentStep >= 1 ? 'completed' : ''}">
                        <span>🎯 Collecte initiale</span>
                    </div>
                    <div class="timeline-item ${currentStep >= 2 ? 'completed' : ''}">
                        <span>🔍 Analyse OSINT</span>
                    </div>
                    <div class="timeline-item ${currentStep >= 3 ? 'completed' : ''}">
                        <span>🕸️ Cartographie réseau</span>
                    </div>
                    <div class="timeline-item ${currentStep >= 4 ? 'completed' : ''}">
                        <span>📊 Génération rapport</span>
                    </div>
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: 'Investigation en cours...',
            html: progressHtml,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: '⏸️ Suspendre',
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    // ✅ 3. Investigation terminée avec succès
    async investigationComplete(results) {
        const resultsHtml = `
            <div class="aura-completion-summary">
                <div class="success-icon">✨</div>
                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-number">${results.profilesFound || 0}</div>
                        <div class="result-label">Profils trouvés</div>
                    </div>
                    <div class="result-card">
                        <div class="result-number">${results.connectionsFound || 0}</div>
                        <div class="result-label">Connexions</div>
                    </div>
                    <div class="result-card">
                        <div class="result-number">${results.dataPoints || 0}</div>
                        <div class="result-label">Points de données</div>
                    </div>
                    <div class="result-card">
                        <div class="result-number">${results.riskLevel || 'Faible'}</div>
                        <div class="result-label">Niveau de risque</div>
                    </div>
                </div>
                <div class="completion-time">
                    ⏱️ Durée: ${results.duration || '00:00:00'}
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: '🎉 Investigation Terminée !',
            html: resultsHtml,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: '📄 Générer le rapport PDF',
            cancelButtonText: '👁️ Voir les détails',
            showDenyButton: true,
            denyButtonText: '🔄 Nouvelle investigation'
        });
    }

    // 📄 4. Génération rapport PDF
    async generatePDFReport(reportData) {
        const reportHtml = `
            <div class="aura-pdf-generator">
                <div class="pdf-icon">📋</div>
                <h3>Génération du rapport PDF</h3>
                <div class="report-options">
                    <label class="option-item">
                        <input type="checkbox" checked> Résumé exécutif
                    </label>
                    <label class="option-item">
                        <input type="checkbox" checked> Données techniques
                    </label>
                    <label class="option-item">
                        <input type="checkbox" checked> Graphiques et visualisations
                    </label>
                    <label class="option-item">
                        <input type="checkbox"> Données sensibles (classification requise)
                    </label>
                </div>
                <div class="security-notice">
                    🔒 Le rapport sera chiffré et horodaté de manière infalsifiable
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: 'Configuration du rapport',
            html: reportHtml,
            showCancelButton: true,
            confirmButtonText: '📥 Générer et télécharger',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    // Simulation génération PDF
                    setTimeout(() => {
                        resolve({
                            filename: `AURA_OSINT_Report_${Date.now()}.pdf`,
                            size: '2.4 MB',
                            pages: 47
                        });
                    }, 3000);
                });
            }
        });
    }

    // 🔐 5. Authentification utilisateur
    async authenticate() {
        return await AuraSwal.fire({
            title: '🔐 Authentification AURA OSINT',
            html: `
                <div class="aura-auth-form">
                    <div class="auth-logo">🌟</div>
                    <div class="auth-subtitle">Accès sécurisé à l'écosystème</div>
                </div>
            `,
            input: 'password',
            inputLabel: 'Mot de passe',
            inputPlaceholder: 'Entrez votre mot de passe',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: '🚀 Se connecter',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
                if (!password) {
                    Swal.showValidationMessage('Le mot de passe est requis');
                    return false;
                }
                // Simulation authentification
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (password === 'Phi1.618Golden!') {
                            resolve({ user: 'root', role: 'admin' });
                        } else {
                            reject('Mot de passe incorrect');
                        }
                    }, 1500);
                });
            }
        });
    }

    // 🛠️ 6. Sélection outils OSINT
    async selectOSINTTools() {
        const toolsHtml = `
            <div class="aura-tools-selector">
                <div class="tools-categories">
                    <div class="category-group">
                        <h4>🌐 Réseaux sociaux</h4>
                        <label><input type="checkbox" checked> LinkedIn</label>
                        <label><input type="checkbox" checked> Twitter/X</label>
                        <label><input type="checkbox" checked> Facebook</label>
                        <label><input type="checkbox"> Instagram</label>
                        <label><input type="checkbox"> TikTok</label>
                    </div>
                    <div class="category-group">
                        <h4>📧 Email & Communication</h4>
                        <label><input type="checkbox" checked> Hunter.io</label>
                        <label><input type="checkbox" checked> Clearbit</label>
                        <label><input type="checkbox"> Breach databases</label>
                    </div>
                    <div class="category-group">
                        <h4>🏢 Business Intelligence</h4>
                        <label><input type="checkbox" checked> Societe.com</label>
                        <label><input type="checkbox"> Infogreffe</label>
                        <label><input type="checkbox"> Crunchbase</label>
                    </div>
                    <div class="category-group">
                        <h4>🌑 Dark Web</h4>
                        <label><input type="checkbox"> Tor scanning</label>
                        <label><input type="checkbox"> Paste monitoring</label>
                    </div>
                </div>
                <div class="tools-summary">
                    <span class="selected-count">12 outils sélectionnés</span>
                    <span class="estimated-time">⏱️ ~15 minutes estimées</span>
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: '🛠️ Sélection des outils OSINT',
            html: toolsHtml,
            width: '800px',
            showCancelButton: true,
            confirmButtonText: '✅ Confirmer la sélection',
            cancelButtonText: 'Annuler'
        });
    }

    // ⚠️ 7. Alerte erreur système
    async systemError(errorDetails) {
        return await AuraSwal.fire({
            title: '⚠️ Erreur Système',
            html: `
                <div class="aura-error-details">
                    <div class="error-icon">🚨</div>
                    <div class="error-message">${errorDetails.message}</div>
                    <div class="error-code">Code: ${errorDetails.code}</div>
                    <div class="error-timestamp">${new Date().toLocaleString()}</div>
                    <details class="error-stack">
                        <summary>Détails techniques</summary>
                        <pre>${errorDetails.stack || 'Aucun détail disponible'}</pre>
                    </details>
                </div>
            `,
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: '🔄 Réessayer',
            cancelButtonText: '📞 Contacter le support',
            showDenyButton: true,
            denyButtonText: '📋 Copier les détails'
        });
    }

    // 🎯 8. Configuration système
    async systemConfiguration() {
        const configHtml = `
            <div class="aura-system-config">
                <div class="config-tabs">
                    <button class="tab-btn active" data-tab="general">Général</button>
                    <button class="tab-btn" data-tab="tools">Outils</button>
                    <button class="tab-btn" data-tab="security">Sécurité</button>
                    <button class="tab-btn" data-tab="export">Export</button>
                </div>
                <div class="config-content">
                    <div class="tab-panel active" id="general">
                        <label>Langue d'interface:
                            <select>
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </select>
                        </label>
                        <label>Thème:
                            <select>
                                <option value="golden">Golden Ratio</option>
                                <option value="dark">Mode sombre</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: '⚙️ Configuration Système',
            html: configHtml,
            width: '700px',
            showCancelButton: true,
            confirmButtonText: '💾 Sauvegarder',
            cancelButtonText: 'Annuler'
        });
    }

    // 🤖 9. Assistant IA intégré
    async aiAssistant(query = '') {
        const assistantHtml = `
            <div class="aura-ai-assistant">
                <div class="ai-avatar">🤖</div>
                <div class="ai-name">AURA Intelligence</div>
                <div class="chat-container">
                    <div class="chat-message ai-message">
                        Bonjour ! Je suis votre assistant IA OSINT. Comment puis-je vous aider dans votre investigation ?
                    </div>
                    ${query ? `<div class="chat-message user-message">${query}</div>` : ''}
                </div>
                <div class="ai-suggestions">
                    <button class="suggestion-btn">💡 Suggérer des sources</button>
                    <button class="suggestion-btn">🔍 Analyser les résultats</button>
                    <button class="suggestion-btn">📊 Créer une visualisation</button>
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: '🤖 Assistant IA OSINT',
            html: assistantHtml,
            input: 'text',
            inputLabel: 'Votre question:',
            inputPlaceholder: 'Tapez votre question ici...',
            width: '600px',
            showCancelButton: true,
            confirmButtonText: '📤 Envoyer',
            cancelButtonText: 'Fermer'
        });
    }

    // 📊 10. Export de données
    async exportData(dataTypes) {
        const exportHtml = `
            <div class="aura-export-wizard">
                <div class="export-icon">📦</div>
                <h3>Assistant d'export de données</h3>
                <div class="export-formats">
                    <label class="format-option">
                        <input type="radio" name="format" value="pdf" checked>
                        <span class="format-icon">📄</span>
                        <span class="format-name">PDF</span>
                        <span class="format-desc">Rapport complet</span>
                    </label>
                    <label class="format-option">
                        <input type="radio" name="format" value="json">
                        <span class="format-icon">📋</span>
                        <span class="format-name">JSON</span>
                        <span class="format-desc">Données brutes</span>
                    </label>
                    <label class="format-option">
                        <input type="radio" name="format" value="csv">
                        <span class="format-icon">📊</span>
                        <span class="format-name">CSV</span>
                        <span class="format-desc">Tableur</span>
                    </label>
                    <label class="format-option">
                        <input type="radio" name="format" value="xml">
                        <span class="format-icon">🗂️</span>
                        <span class="format-name">XML</span>
                        <span class="format-desc">Structuré</span>
                    </label>
                </div>
                <div class="export-options">
                    <label><input type="checkbox" checked> Inclure les métadonnées</label>
                    <label><input type="checkbox" checked> Horodatage sécurisé</label>
                    <label><input type="checkbox"> Chiffrement AES-256</label>
                </div>
            </div>
        `;

        return await AuraSwal.fire({
            title: '📤 Export de données',
            html: exportHtml,
            showCancelButton: true,
            confirmButtonText: '⬇️ Télécharger',
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true
        });
    }
}

// 🌟 Instance globale
window.AuraAlerts = new AuraAlerts();

// 🎨 Export pour modules ES6
export default AuraAlerts;
export { AuraSwal, GOLDEN_COLORS, PHI };