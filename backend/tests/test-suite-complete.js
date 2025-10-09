const { pool } = require('../config/database');
const nodemailer = require('nodemailer');
const axios = require('axios');

const BASE_URL = 'http://localhost:4002';

class TestSuite {
  constructor() {
    this.results = {
      database: { passed: 0, failed: 0 },
      email: { passed: 0, failed: 0 },
      api: { passed: 0, failed: 0 }
    };
  }

  async runTest(category, name, testFn) {
    try {
      const start = Date.now();
      await testFn();
      const duration = Date.now() - start;
      this.results[category].passed++;
      console.log(`✅ ${name} (${duration}ms)`);
    } catch (error) {
      this.results[category].failed++;
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  async testDatabaseConnection() {
    const result = await pool.query('SELECT NOW()');
    if (!result.rows[0].now) throw new Error('No timestamp');
  }

  async testDatabaseTables() {
    const result = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    const tables = result.rows.map(r => r.table_name);
    if (!tables.includes('profiles')) throw new Error('Table profiles missing');
    if (!tables.includes('investigations')) throw new Error('Table investigations missing');
  }

  async testDatabaseInsert() {
    await pool.query(`INSERT INTO profiles (username, platform, data) VALUES ('test_user', 'test', '{"test": true}')`);
    const result = await pool.query(`SELECT * FROM profiles WHERE username = 'test_user'`);
    if (result.rows.length === 0) throw new Error('Insert failed');
  }

  async testEmailConnection() {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: false
    });
    await transporter.verify();
  }

  async testEmailSend() {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: false
    });

    const info = await transporter.sendMail({
      from: 'test@aura-osint.com',
      to: 'test@example.com',
      subject: 'Test Suite',
      text: 'Test email'
    });

    if (!info.messageId) throw new Error('No message ID');
  }

  async testApiHealth() {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.status !== 200) throw new Error(`Status: ${response.status}`);
  }

  async testApiOsintSearch() {
    const response = await axios.post(`${BASE_URL}/api/v1/osint/search`, {
      query: 'test',
      platforms: ['all']
    });
    if (response.status !== 200) throw new Error(`Status: ${response.status}`);
  }

  async runAllTests() {
    console.log('🚀 AURA OSINT - Test Suite Complet\n');

    console.log('📊 Tests Base de Données:');
    await this.runTest('database', 'Connection PostgreSQL', () => this.testDatabaseConnection());
    await this.runTest('database', 'Tables existantes', () => this.testDatabaseTables());
    await this.runTest('database', 'Insert/Select', () => this.testDatabaseInsert());

    console.log('\n📧 Tests Email:');
    await this.runTest('email', 'Connection SMTP', () => this.testEmailConnection());
    await this.runTest('email', 'Envoi email', () => this.testEmailSend());

    console.log('\n🌐 Tests API:');
    await this.runTest('api', 'Health endpoint', () => this.testApiHealth());
    await this.runTest('api', 'Recherche OSINT', () => this.testApiOsintSearch());

    this.printResults();
  }

  printResults() {
    console.log('\n📊 RÉSULTATS:');
    Object.entries(this.results).forEach(([category, result]) => {
      const total = result.passed + result.failed;
      const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
      console.log(`${category}: ${result.passed}/${total} (${percentage}%)`);
    });

    const totalPassed = Object.values(this.results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, r) => sum + r.failed, 0);
    const overallPercentage = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);
    
    console.log(`\n🎯 SCORE GLOBAL: ${overallPercentage}%`);
  }
}

if (require.main === module) {
  const testSuite = new TestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = TestSuite;