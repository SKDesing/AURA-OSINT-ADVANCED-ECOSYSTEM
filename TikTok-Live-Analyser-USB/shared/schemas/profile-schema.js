const Joi = require('joi');

const profileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  platform: Joi.string().valid('tiktok', 'instagram', 'youtube', 'twitter').required(),
  fullName: Joi.string().min(2).max(100).allow(''),
  age: Joi.number().integer().min(13).max(120).allow(null),
  location: Joi.string().max(200).allow(''),
  email: Joi.string().email().allow(''),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical').default('low'),
  interests: Joi.array().items(Joi.string().max(50)).max(20),
  behaviorNotes: Joi.string().max(2000).allow(''),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  assignedTo: Joi.string().max(100).allow(''),
  finalNotes: Joi.string().max(5000).allow(''),
  followerCount: Joi.number().integer().min(0).allow(null),
  followingCount: Joi.number().integer().min(0).allow(null),
  postsCount: Joi.number().integer().min(0).allow(null),
  isVerified: Joi.boolean().default(false),
  isPrivate: Joi.boolean().default(false),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'under_review').default('active'),
  createdBy: Joi.string().required()
});

const profileUpdateSchema = profileSchema.fork(['username', 'platform', 'createdBy'], (schema) => schema.optional());

const profileSearchSchema = Joi.object({
  platform: Joi.string().valid('tiktok', 'instagram', 'youtube', 'twitter'),
  riskLevel: Joi.string().valid('low', 'medium', 'high', 'critical'),
  status: Joi.string().valid('active', 'inactive', 'suspended', 'under_review'),
  assignedTo: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  minFollowers: Joi.number().integer().min(0),
  maxFollowers: Joi.number().integer().min(0),
  isVerified: Joi.boolean(),
  isPrivate: Joi.boolean(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = { profileSchema, profileUpdateSchema, profileSearchSchema };