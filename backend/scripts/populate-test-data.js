const { pool } = require('../config/database');

const testProfiles = [
  { username: 'john_doe_2024', platform: 'twitter', verified: true, followers: 1250 },
  { username: 'suspicious123456', platform: 'instagram', verified: false, followers: 50 },
  { username: 'bot_account_999', platform: 'tiktok', verified: false, followers: 10000 },
  { username: 'legitimate_user', platform: 'facebook', verified: true, followers: 500 },
  { username: 'fake_profile_2024', platform: 'twitter', verified: false, followers: 25 },
  { username: 'osint_researcher', platform: 'linkedin', verified: true, followers: 2500 },
  { username: 'anonymous_user', platform: 'telegram', verified: false, followers: 0 },
  { username: 'security_expert', platform: 'twitter', verified: true, followers: 5000 },
  { username: 'test_account_123', platform: 'instagram', verified: false, followers: 100 },
  { username: 'aura_osint_demo', platform: 'github', verified: true, followers: 150 }
];

async function populateTestData() {
  try {
    console.log('🔄 Insertion des données de test...');
    
    for (const profile of testProfiles) {
      const data = {
        bio: `Test profile for ${profile.username}`,
        followers: profile.followers,
        following: Math.floor(profile.followers * 0.8),
        posts: Math.floor(Math.random() * 100) + 10,
        verified: profile.verified,
        location: ['Paris', 'London', 'New York', 'Berlin', 'Tokyo'][Math.floor(Math.random() * 5)]
      };
      
      await pool.query(
        `INSERT INTO profiles (username, platform, data, created_at) 
         VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [
          profile.username,
          profile.platform,
          JSON.stringify(data),
          new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        ]
      );
    }
    
    const result = await pool.query('SELECT COUNT(*) FROM profiles');
    console.log(`✅ ${result.rows[0].count} profils dans la base de données`);
    
    await pool.query(
      `INSERT INTO investigations (title, status, data, created_at) 
       VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [
        'Investigation Test - Comptes Suspects',
        'active',
        JSON.stringify({description: 'Analyse de comptes potentiellement frauduleux détectés par AURA OSINT'}),
        new Date()
      ]
    );
    
    const invResult = await pool.query('SELECT COUNT(*) FROM investigations');
    console.log(`✅ ${invResult.rows[0].count} investigations dans la base de données`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  populateTestData();
}

module.exports = { populateTestData };