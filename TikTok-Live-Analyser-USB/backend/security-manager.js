const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Pool } = require('pg');

/**
 * 🔒 SCIS SECURITY MANAGER
 * Gestionnaire de sécurité pour architecture forensique
 */
class SCISSecurityManager {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'aura_user',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'aura_investigations',
            password: process.env.DB_PASSWORD || 'aura_secure_2024',
            port: process.env.DB_PORT || 5432,
        });
        
        this.saltRounds = 12; // BCRYPT rounds
        this.tokenExpiry = 24 * 60 * 60 * 1000; // 24h en ms
        this.apiKeyExpiry = 30 * 24 * 60 * 60 * 1000; // 30 jours
        this.maxFailedAttempts = 5;
        this.lockoutDuration = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * 🔐 AUTHENTIFICATION SÉCURISÉE
     */
    async authenticateUser(username, password) {
        try {
            // Vérifier si l'utilisateur existe et n'est pas verrouillé
            const userResult = await this.pool.query(`
                SELECT id, username, password_hash, password_salt, 
                       failed_login_attempts, locked_until, active, verified
                FROM investigators 
                WHERE username = $1 AND active = true
            `, [username]);

            if (userResult.rows.length === 0) {
                await this.logSecurityEvent('LOGIN_FAILED', { username, reason: 'user_not_found' });
                return { success: false, error: 'Invalid credentials' };
            }

            const user = userResult.rows[0];

            // Vérifier si le compte est verrouillé
            if (user.locked_until && new Date(user.locked_until) > new Date()) {
                await this.logSecurityEvent('LOGIN_BLOCKED', { username, reason: 'account_locked' });
                return { success: false, error: 'Account temporarily locked' };
            }

            // Vérifier le mot de passe
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                await this.handleFailedLogin(user.id, username);
                return { success: false, error: 'Invalid credentials' };
            }

            // Réinitialiser les tentatives échouées
            await this.resetFailedAttempts(user.id);

            // Générer un token de session sécurisé
            const sessionToken = await this.generateSecureToken();
            const expiresAt = new Date(Date.now() + this.tokenExpiry);

            await this.pool.query(`
                UPDATE investigators SET
                    session_token = $2,
                    session_expires_at = $3,
                    last_login = CURRENT_TIMESTAMP,
                    last_ip = $4
                WHERE id = $1
            `, [user.id, sessionToken, expiresAt, this.getClientIP()]);

            await this.logSecurityEvent('LOGIN_SUCCESS', { 
                user_id: user.id, 
                username,
                session_token: sessionToken.substring(0, 8) + '...' 
            });

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    session_token: sessionToken,
                    expires_at: expiresAt
                }
            };

        } catch (error) {
            await this.logSecurityEvent('LOGIN_ERROR', { username, error: error.message });
            return { success: false, error: 'Authentication failed' };
        }
    }

    /**
     * 🔑 GESTION DES MOTS DE PASSE SÉCURISÉS
     */
    async hashPassword(password) {
        // Validation de la force du mot de passe
        if (!this.isStrongPassword(password)) {
            throw new Error('Password does not meet security requirements');
        }

        const salt = await bcrypt.genSalt(this.saltRounds);
        const hash = await bcrypt.hash(password, salt);
        
        return { hash, salt };
    }

    isStrongPassword(password) {
        // Minimum 12 caractères, majuscule, minuscule, chiffre, caractère spécial
        const minLength = 12;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    }

    /**
     * 🚫 GESTION DES TENTATIVES ÉCHOUÉES
     */
    async handleFailedLogin(userId, username) {
        const result = await this.pool.query(`
            UPDATE investigators SET
                failed_login_attempts = failed_login_attempts + 1,
                locked_until = CASE 
                    WHEN failed_login_attempts + 1 >= $2 
                    THEN CURRENT_TIMESTAMP + INTERVAL '${this.lockoutDuration / 1000} seconds'
                    ELSE locked_until
                END
            WHERE id = $1
            RETURNING failed_login_attempts, locked_until
        `, [userId, this.maxFailedAttempts]);

        const attempts = result.rows[0].failed_login_attempts;
        const lockedUntil = result.rows[0].locked_until;

        await this.logSecurityEvent('LOGIN_FAILED', {
            user_id: userId,
            username,
            attempts,
            locked: !!lockedUntil
        });

        if (attempts >= this.maxFailedAttempts) {
            await this.notifySecurityTeam('ACCOUNT_LOCKED', {
                username,
                locked_until: lockedUntil,
                attempts
            });
        }
    }

    async resetFailedAttempts(userId) {
        await this.pool.query(`
            UPDATE investigators SET
                failed_login_attempts = 0,
                locked_until = NULL
            WHERE id = $1
        `, [userId]);
    }

    /**
     * 🎫 GESTION DES TOKENS SÉCURISÉS
     */
    async generateSecureToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    async generateAPIKey(userId) {
        const apiKey = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + this.apiKeyExpiry);

        await this.pool.query(`
            UPDATE investigators SET
                api_key = $2,
                api_key_expires_at = $3
            WHERE id = $1
        `, [userId, apiKey, expiresAt]);

        await this.logSecurityEvent('API_KEY_GENERATED', {
            user_id: userId,
            expires_at: expiresAt
        });

        return { api_key: apiKey, expires_at: expiresAt };
    }

    async validateSession(sessionToken) {
        const result = await this.pool.query(`
            SELECT id, username, session_expires_at, access_level, permissions
            FROM investigators
            WHERE session_token = $1 
            AND session_expires_at > CURRENT_TIMESTAMP
            AND active = true
        `, [sessionToken]);

        if (result.rows.length === 0) {
            return { valid: false, error: 'Invalid or expired session' };
        }

        const user = result.rows[0];
        
        // Étendre la session si elle expire bientôt
        const expiresIn = new Date(user.session_expires_at) - new Date();
        if (expiresIn < (this.tokenExpiry / 4)) { // Renouveler si < 6h restantes
            const newExpiry = new Date(Date.now() + this.tokenExpiry);
            await this.pool.query(`
                UPDATE investigators SET session_expires_at = $2 WHERE id = $1
            `, [user.id, newExpiry]);
        }

        return {
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                access_level: user.access_level,
                permissions: user.permissions
            }
        };
    }

    /**
     * 🔐 CHIFFREMENT DES DONNÉES SENSIBLES
     */
    async encryptSensitiveData(data, key = null) {
        const encryptionKey = key || process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipher('aes-256-gcm', encryptionKey);
        cipher.setAAD(Buffer.from('SCIS-FORENSIC', 'utf8'));
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            algorithm: 'aes-256-gcm'
        };
    }

    async decryptSensitiveData(encryptedData, key = null) {
        const decryptionKey = key || process.env.ENCRYPTION_KEY;
        
        const decipher = crypto.createDecipher('aes-256-gcm', decryptionKey);
        decipher.setAAD(Buffer.from('SCIS-FORENSIC', 'utf8'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    /**
     * 🔍 INTÉGRITÉ DES PREUVES
     */
    async generateEvidenceHash(filePath, algorithm = 'sha256') {
        const fs = require('fs');
        const hash = crypto.createHash(algorithm);
        
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            stream.on('data', data => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    async verifyEvidenceIntegrity(evidenceId) {
        const result = await this.pool.query(`
            SELECT file_path, file_hash, hash_algorithm
            FROM digital_evidence
            WHERE id = $1
        `, [evidenceId]);

        if (result.rows.length === 0) {
            return { valid: false, error: 'Evidence not found' };
        }

        const evidence = result.rows[0];
        const currentHash = await this.generateEvidenceHash(
            evidence.file_path, 
            evidence.hash_algorithm.toLowerCase()
        );

        const isValid = currentHash === evidence.file_hash;

        await this.pool.query(`
            UPDATE digital_evidence SET
                integrity_verified = $2,
                integrity_last_check = CURRENT_TIMESTAMP
            WHERE id = $1
        `, [evidenceId, isValid]);

        if (!isValid) {
            await this.logSecurityEvent('INTEGRITY_VIOLATION', {
                evidence_id: evidenceId,
                expected_hash: evidence.file_hash,
                actual_hash: currentHash
            });
        }

        return { valid: isValid, evidence_id: evidenceId };
    }

    /**
     * 📝 LOGS DE SÉCURITÉ
     */
    async logSecurityEvent(eventType, details) {
        await this.pool.query(`
            INSERT INTO forensic_logs (
                log_level, action, category, message, details, 
                user_ip, timestamp
            ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        `, [
            'info',
            eventType,
            'security',
            `Security event: ${eventType}`,
            JSON.stringify(details),
            this.getClientIP()
        ]);
    }

    /**
     * 🚨 NOTIFICATIONS SÉCURITÉ
     */
    async notifySecurityTeam(alertType, details) {
        // Insérer une alerte de sécurité
        await this.pool.query(`
            INSERT INTO automated_alerts (
                alert_type, alert_category, severity, title, description,
                details, triggered_by, confidence_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            alertType,
            'security',
            'high',
            `Security Alert: ${alertType}`,
            `Automated security alert triggered`,
            JSON.stringify(details),
            'SecurityManager',
            1.0
        ]);

        // Log l'événement
        await this.logSecurityEvent('SECURITY_ALERT', { type: alertType, details });
    }

    /**
     * 🧹 MAINTENANCE SÉCURISÉE
     */
    async performSecurityMaintenance() {
        // Nettoyer les sessions expirées
        await this.pool.query(`
            UPDATE investigators SET
                session_token = NULL,
                session_expires_at = NULL
            WHERE session_expires_at < CURRENT_TIMESTAMP
        `);

        // Nettoyer les clés API expirées
        await this.pool.query(`
            UPDATE investigators SET
                api_key = NULL,
                api_key_expires_at = NULL
            WHERE api_key_expires_at < CURRENT_TIMESTAMP
        `);

        // Déverrouiller les comptes dont le délai est expiré
        await this.pool.query(`
            UPDATE investigators SET
                locked_until = NULL,
                failed_login_attempts = 0
            WHERE locked_until < CURRENT_TIMESTAMP
        `);

        await this.logSecurityEvent('SECURITY_MAINTENANCE', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 🌐 UTILITAIRES
     */
    getClientIP() {
        // À implémenter selon le contexte (Express req.ip, etc.)
        return '127.0.0.1'; // Placeholder
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = SCISSecurityManager;