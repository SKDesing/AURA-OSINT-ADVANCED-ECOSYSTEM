const Joi = require('joi');

const profileCreationSchema = Joi.object({
    tiktokProfile: Joi.object({
        unique_id: Joi.string().required(),
        user_id: Joi.number().integer().required(),
        nom_affiche: Joi.string().optional(),
        bio: Joi.string().optional(),
        follower_count: Joi.number().integer().min(0).optional(),
        following_count: Joi.number().integer().min(0).optional(),
        heart_count: Joi.number().integer().min(0).optional(),
        video_count: Joi.number().integer().min(0).optional(),
        type_compte: Joi.string().valid('particulier', 'professionnel', 'agence').required()
    }).required(),
    
    realIdentity: Joi.object({
        nom: Joi.string().optional(),
        prenom: Joi.string().optional(),
        nom_complet: Joi.string().optional(),
        adresse_complete: Joi.string().optional(),
        ville: Joi.string().optional(),
        telephone: Joi.string().optional(),
        email: Joi.string().email().optional(),
        niveau_confiance: Joi.number().integer().min(0).max(100).optional()
    }).optional(),

    companies: Joi.array().items(Joi.object({
        nom_legal: Joi.string().required(),
        siret: Joi.string().optional(),
        secteur_activite: Joi.string().optional(),
        type_liaison: Joi.string().valid('salarie', 'fondateur', 'partenaire', 'auto-entrepreneur', 'ambassadeur').required()
    })).optional(),
    
    agency: Joi.object({
        nom: Joi.string().required(),
        site_web: Joi.string().uri().optional(),
        email_contact: Joi.string().email().optional()
    }).optional(),

    themes: Joi.array().items(Joi.string().max(50)).optional()
});

function validateProfileCreation(req, res, next) {
    const { error } = profileCreationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false,
            message: "Erreur de validation", 
            details: error.details 
        });
    }
    next();
}

module.exports = { validateProfileCreation };