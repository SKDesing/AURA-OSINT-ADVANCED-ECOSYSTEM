const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Joi = require('joi');
const config = require('../../config');
const logger = require('../../utils/logger');

const db = new Pool(config.database);

// Schémas de validation Joi
const profileSchema = Joi.object({
    unique_id: Joi.string().required(),
    user_id: Joi.number().integer().required(),
    nom_affiche: Joi.string().allow('', null),
    bio: Joi.string().allow('', null),
    follower_count: Joi.number().integer().default(0),
    following_count: Joi.number().integer().default(0),
    heart_count: Joi.number().integer().default(0),
    video_count: Joi.number().integer().default(0),
    type_compte: Joi.string().valid('particulier', 'professionnel', 'agence').default('particulier')
});

const identitySchema = Joi.object({
    nom: Joi.string().allow('', null),
    prenom: Joi.string().allow('', null),
    nom_complet: Joi.string().allow('', null),
    adresse_complete: Joi.string().allow('', null),
    ville: Joi.string().allow('', null),
    telephone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/).allow('', null),
    email: Joi.string().email().allow('', null),
    niveau_confiance: Joi.number().integer().min(0).max(100).default(50)
});

const companySchema = Joi.object({
    nom_legal: Joi.string().required(),
    siret: Joi.string().pattern(/^[0-9]{14}$/).allow('', null),
    secteur_activite: Joi.string().allow('', null),
    type_liaison: Joi.string().valid('salarie', 'fondateur', 'partenaire', 'auto-entrepreneur', 'ambassadeur').required()
});

const agencySchema = Joi.object({
    nom: Joi.string().required(),
    site_web: Joi.string().uri().allow('', null),
    email_contact: Joi.string().email().allow('', null)
});

const createProfileSchema = Joi.object({
    tiktokProfile: profileSchema.required(),
    realIdentity: identitySchema.allow(null),
    companies: Joi.array().items(companySchema).allow(null),
    agency: agencySchema.allow(null),
    themes: Joi.array().items(Joi.string()).allow(null)
});

// Validation middleware
function validateProfileCreation(req, res, next) {
    const { error } = createProfileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: "Erreur de validation", 
            details: error.details 
        });
    }
    next();
}

async function createProfile(req, res) {
    const client = await db.connect();
    
    try {
        await client.query('BEGIN');
        
        const { tiktokProfile, realIdentity, companies, agency, themes } = req.body;
        
        logger.info('Tentative de création de profil', { 
            unique_id: tiktokProfile.unique_id,
            user_id: tiktokProfile.user_id,
            user: req.user?.id || 'anonymous'
        });

        // 1. Créer l'identité réelle si fournie
        let identityId = null;
        if (realIdentity && Object.keys(realIdentity).length > 0) {
            const identityQuery = `
                INSERT INTO identites (nom, prenom, nom_complet, adresse_complete, 
                                     ville, telephone, email, niveau_confiance, source_information)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `;
            
            const nomComplet = realIdentity.nom && realIdentity.prenom 
                ? `${realIdentity.prenom} ${realIdentity.nom}` 
                : realIdentity.nom_complet || null;
                
            const identityResult = await client.query(identityQuery, [
                realIdentity.nom || null,
                realIdentity.prenom || null,
                nomComplet,
                realIdentity.adresse_complete || null,
                realIdentity.ville || null,
                realIdentity.telephone || null,
                realIdentity.email || null,
                realIdentity.niveau_confiance || 50,
                'Saisie manuelle'
            ]);
            
            identityId = identityResult.rows[0].id;
            logger.info('Identité créée', { identityId, nomComplet });
        }

        // 2. Créer le profil TikTok
        const profileQuery = `
            INSERT INTO profils_tiktok (
                identite_id, unique_id, user_id, nom_affiche, bio, 
                follower_count, following_count, heart_count, video_count, 
                type_compte, hash_preuve, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
            RETURNING id
        `;
        
        const hashPreuve = crypto.createHash('sha256')
            .update(JSON.stringify(tiktokProfile) + Date.now())
            .digest('hex');
            
        const profileResult = await client.query(profileQuery, [
            identityId,
            tiktokProfile.unique_id,
            tiktokProfile.user_id,
            tiktokProfile.nom_affiche || null,
            tiktokProfile.bio || null,
            tiktokProfile.follower_count || 0,
            tiktokProfile.following_count || 0,
            tiktokProfile.heart_count || 0,
            tiktokProfile.video_count || 0,
            tiktokProfile.type_compte || 'particulier',
            hashPreuve
        ]);
        
        const profileId = profileResult.rows[0].id;
        logger.info('Profil TikTok créé', { profileId, unique_id: tiktokProfile.unique_id });

        // 3. Gérer les entreprises
        if (companies && companies.length > 0) {
            for (const companyData of companies) {
                let companyResult = await client.query(
                    'SELECT id FROM entreprises WHERE nom_legal = $1',
                    [companyData.nom_legal]
                );
                
                let companyId;
                if (companyResult.rows.length === 0) {
                    const companyInsert = await client.query(`
                        INSERT INTO entreprises (nom_legal, siret, secteur_activite, created_at, updated_at)
                        VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id
                    `, [
                        companyData.nom_legal,
                        companyData.siret || null,
                        companyData.secteur_activite || null
                    ]);
                    companyId = companyInsert.rows[0].id;
                    logger.info('Entreprise créée', { companyId, nom_legal: companyData.nom_legal });
                } else {
                    companyId = companyResult.rows[0].id;
                }
                
                await client.query(`
                    INSERT INTO profil_entreprises (profil_id, entreprise_id, type_liaison, created_at)
                    VALUES ($1, $2, $3, NOW())
                    ON CONFLICT (profil_id, entreprise_id) DO NOTHING
                `, [profileId, companyId, companyData.type_liaison]);
            }
        }

        // 4. Gérer l'agence
        if (agency && Object.keys(agency).length > 0) {
            let agencyResult = await client.query(
                'SELECT id FROM agences WHERE nom = $1',
                [agency.nom]
            );
            
            let agencyId;
            if (agencyResult.rows.length === 0) {
                const agencyInsert = await client.query(`
                    INSERT INTO agences (nom, site_web, email_contact, created_at, updated_at)
                    VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id
                `, [
                    agency.nom,
                    agency.site_web || null,
                    agency.email_contact || null
                ]);
                agencyId = agencyInsert.rows[0].id;
                logger.info('Agence créée', { agencyId, nom: agency.nom });
            } else {
                agencyId = agencyResult.rows[0].id;
            }
            
            await client.query(`
                INSERT INTO agence_influenceurs (agence_id, profil_id, created_at)
                VALUES ($1, $2, NOW())
                ON CONFLICT (agence_id, profil_id) DO NOTHING
            `, [agencyId, profileId]);
        }

        // 5. Gérer les thèmes
        if (themes && themes.length > 0) {
            for (const themeName of themes) {
                let themeResult = await client.query(
                    'SELECT id FROM themes WHERE nom = $1',
                    [themeName]
                );
                
                let themeId;
                if (themeResult.rows.length === 0) {
                    const themeInsert = await client.query(
                        'INSERT INTO themes (nom, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING id',
                        [themeName]
                    );
                    themeId = themeInsert.rows[0].id;
                    logger.info('Thème créé', { themeId, nom: themeName });
                } else {
                    themeId = themeResult.rows[0].id;
                }
                
                await client.query(`
                    INSERT INTO profil_themes (profil_id, theme_id, score_confiance, created_at)
                    VALUES ($1, $2, $3, NOW())
                    ON CONFLICT (profil_id, theme_id) DO NOTHING
                `, [profileId, themeId, 100]);
            }
        }

        await client.query('COMMIT');
        
        logger.info('Profil créé avec succès', { profileId, unique_id: tiktokProfile.unique_id });
        
        res.status(201).json({ 
            success: true,
            message: 'Profil créé avec succès', 
            profileId,
            hashPreuve 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Erreur création profil', { 
            error: error.message, 
            stack: error.stack,
            body: req.body 
        });
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur interne', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
        });
    } finally {
        client.release();
    }
}

async function getProfiles(req, res) {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        // Filtres
        const { type_compte, theme, search } = req.query;
        
        let whereClause = '';
        const queryParams = [];
        let paramIndex = 1;
        
        if (type_compte) {
            whereClause += ` WHERE p.type_compte = $${paramIndex++}`;
            queryParams.push(type_compte);
        }
        
        if (theme) {
            whereClause += whereClause ? ' AND' : ' WHERE';
            whereClause += ` EXISTS (SELECT 1 FROM profil_themes pt JOIN themes t ON pt.theme_id = t.id WHERE pt.profil_id = p.id AND t.nom = $${paramIndex++})`;
            queryParams.push(theme);
        }
        
        if (search) {
            whereClause += whereClause ? ' AND' : ' WHERE';
            whereClause += ` (p.unique_id ILIKE $${paramIndex++} OR p.nom_affiche ILIKE $${paramIndex++} OR i.nom_complet ILIKE $${paramIndex++})`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        // Requête de comptage
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM profils_tiktok p
            LEFT JOIN identites i ON p.identite_id = i.id
            ${whereClause}
        `;
        
        const countResult = await db.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].total);
        
        // Requête principale
        const dataQuery = `
            SELECT p.*, i.nom_complet as identite_nom_complet,
                   COUNT(DISTINCT ls.id) as nombre_sessions_live,
                   ARRAY_AGG(DISTINCT t.nom) FILTER (WHERE t.nom IS NOT NULL) as themes
            FROM profils_tiktok p
            LEFT JOIN identites i ON p.identite_id = i.id
            LEFT JOIN live_sessions ls ON p.id = ls.profil_tiktok_id
            LEFT JOIN profil_themes pt ON p.id = pt.profil_id
            LEFT JOIN themes t ON pt.theme_id = t.id
            ${whereClause}
            GROUP BY p.id, i.nom_complet
            ORDER BY p.follower_count DESC, p.created_at DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}
        `;
        
        queryParams.push(limit, offset);
        
        const result = await db.query(dataQuery, queryParams);
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Erreur récupération profils', { 
            error: error.message, 
            stack: error.stack 
        });
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
        });
    }
}

async function getProfileById(req, res) {
    try {
        const { id } = req.params;
        
        // Récupérer le profil principal
        const profileQuery = `
            SELECT p.*, i.nom_complet as identite_nom_complet
            FROM profils_tiktok p
            LEFT JOIN identites i ON p.identite_id = i.id
            WHERE p.id = $1
        `;
        
        const profileResult = await db.query(profileQuery, [id]);
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profil non trouvé'
            });
        }
        
        const profile = profileResult.rows[0];
        
        // Récupérer les entités associées
        const [companiesResult, agencyResult, themesResult, sessionsResult] = await Promise.all([
            db.query(`
                SELECT e.*, pe.type_liaison
                FROM entreprises e
                JOIN profil_entreprises pe ON e.id = pe.entreprise_id
                WHERE pe.profil_id = $1
            `, [id]),
            db.query(`
                SELECT a.*
                FROM agences a
                JOIN agence_influenceurs ai ON a.id = ai.agence_id
                WHERE ai.profil_id = $1
            `, [id]),
            db.query(`
                SELECT t.*, pt.score_confiance
                FROM themes t
                JOIN profil_themes pt ON t.id = pt.theme_id
                WHERE pt.profil_id = $1
            `, [id]),
            db.query(`
                SELECT *
                FROM live_sessions
                WHERE profil_tiktok_id = $1
                ORDER BY start_timestamp DESC
                LIMIT 10
            `, [id])
        ]);
        
        profile.companies = companiesResult.rows;
        profile.agency = agencyResult.rows.length > 0 ? agencyResult.rows[0] : null;
        profile.themes = themesResult.rows;
        profile.recent_sessions = sessionsResult.rows;
        
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        logger.error('Erreur récupération profil par ID', { 
            error: error.message, 
            stack: error.stack,
            profileId: req.params.id
        });
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
        });
    }
}

module.exports = {
    validateProfileCreation,
    createProfile,
    getProfiles,
    getProfileById
};