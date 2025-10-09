// AURA Config - Centralized environment configuration
export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // API Configuration  
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:4010',
    aiGatewayPort: parseInt(process.env.AI_GATEWAY_PORT || '4010'),
    analyticsPort: parseInt(process.env.ANALYTICS_PORT || '4002'),
    timeout: parseInt(process.env.API_TIMEOUT || '15000')
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'aura_osint',
    user: process.env.DB_USER || 'aura_user',
    password: process.env.DB_PASSWORD,
    statementTimeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000')
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtIssuer: process.env.JWT_ISSUER || 'aura-osint',
    jwtAudience: process.env.JWT_AUDIENCE || 'aura-api',
    corsAllowlist: process.env.CORS_ALLOWLIST?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    sessionSecret: process.env.SESSION_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
  },

  // AI Configuration
  ai: {
    qwenModelFile: process.env.AI_QWEN_MODEL_FILE || 'ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf',
    qwenPort: parseInt(process.env.AI_QWEN_PORT || '8090'),
    gatewayPort: parseInt(process.env.AI_GATEWAY_PORT || '4010'),
    maxInputChars: parseInt(process.env.AI_MAX_INPUT_CHARS || '6000'),
    datasetCapture: process.env.AI_DATASET_CAPTURE === 'true'
  }
} as const;

export default config;