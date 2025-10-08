const { MongoClient } = require('mongodb');

async function createCriticalIndexes() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aura_osint';
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('📊 Connexion MongoDB réussie');
    
    const db = client.db('aura_osint');

    // Indexes pour live_sessions
    console.log('Création indexes live_sessions...');
    await db.collection('live_sessions').createIndexes([
      { key: { platform: 1, timestamp: -1 }, name: 'platform_timestamp' },
      { key: { user_id: 1, status: 1 }, name: 'user_status' },
      { key: { timestamp: 1 }, expireAfterSeconds: 86400, name: 'ttl_24h' }
    ]);

    // Indexes pour comments
    console.log('Création indexes comments...');
    await db.collection('comments').createIndexes([
      { key: { session_id: 1, timestamp: -1 }, name: 'session_timestamp' },
      { key: { sentiment: 1 }, name: 'sentiment' },
      { key: { author_name: 1 }, name: 'author' },
      { key: { platform: 1, timestamp: -1 }, name: 'platform_timestamp' }
    ]);

    // Indexes pour users
    console.log('Création indexes users...');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { api_key: 1 }, unique: true, name: 'api_key_unique' },
      { key: { last_active: 1 }, name: 'last_active' }
    ]);

    console.log('✅ Tous les indexes créés avec succès');
    
  } catch (error) {
    console.error('❌ Erreur création indexes:', error);
  } finally {
    await client.close();
  }
}

// Lancer si appelé directement
if (require.main === module) {
  createCriticalIndexes().catch(console.error);
}

module.exports = { createCriticalIndexes };
