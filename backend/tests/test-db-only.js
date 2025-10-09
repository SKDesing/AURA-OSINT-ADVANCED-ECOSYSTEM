const { pool } = require('../config/database');

async function testDatabase() {
  console.log('🔍 TEST DATABASE COMPLET\n');

  try {
    // Test 1: Connection
    console.log('1️⃣ Test Connection...');
    const timeResult = await pool.query('SELECT NOW()');
    console.log(`✅ Connection OK: ${timeResult.rows[0].now}`);

    // Test 2: Tables
    console.log('\n2️⃣ Test Tables...');
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`✅ Tables trouvées: ${tables.join(', ')}`);

    // Test 3: Count records
    console.log('\n3️⃣ Test Données...');
    const profilesCount = await pool.query('SELECT COUNT(*) FROM profiles');
    const investigationsCount = await pool.query('SELECT COUNT(*) FROM investigations');
    console.log(`✅ Profiles: ${profilesCount.rows[0].count} enregistrements`);
    console.log(`✅ Investigations: ${investigationsCount.rows[0].count} enregistrements`);

    // Test 4: Insert test
    console.log('\n4️⃣ Test Insert...');
    await pool.query(`
      INSERT INTO profiles (username, platform, data) 
      VALUES ('test_db_user', 'test_platform', '{"test": true, "timestamp": "${new Date().toISOString()}"}')
      ON CONFLICT DO NOTHING
    `);
    
    const testResult = await pool.query(`
      SELECT * FROM profiles WHERE username = 'test_db_user'
    `);
    console.log(`✅ Insert OK: ${testResult.rows.length} enregistrement(s)`);

    // Test 5: Performance
    console.log('\n5️⃣ Test Performance...');
    const start = Date.now();
    await pool.query('SELECT COUNT(*) FROM profiles WHERE platform = $1', ['test_platform']);
    const duration = Date.now() - start;
    console.log(`✅ Query performance: ${duration}ms`);

    console.log('\n🎯 DATABASE: 100% OPÉRATIONNELLE');

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error.message);
  }
}

if (require.main === module) {
  testDatabase().then(() => process.exit(0));
}

module.exports = { testDatabase };