import pkg from 'pg';
const { Pool } = pkg;

// Test de connexion
const pool = new Pool({
  connectionString: 'postgresql://aura_user:secure_password@localhost:5433/aura_investigations'
});

async function testDB() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ DB connectée:', result.rows[0]);
    
    const sessions = await pool.query('SELECT COUNT(*) FROM sessions');
    console.log('✅ Sessions table:', sessions.rows[0]);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur DB:', error.message);
  }
}

testDB();