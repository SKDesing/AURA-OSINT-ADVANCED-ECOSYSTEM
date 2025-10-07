const AnalyticsDB = require('./lib/database/AnalyticsDB');
const StealthDB = require('./lib/database/StealthDB');
const ForensicDB = require('./lib/database/ForensicDB');
const ReportsDB = require('./lib/database/ReportsDB');

async function testAnalyticsDB() {
    console.log('🔍 Test Analytics DB...');
    const db = new AnalyticsDB();
    
    try {
        // Test création profil
        const profile = await db.createProfile('tiktok', 'test_user', { followers: 1000 }, 0.5);
        console.log('   ✅ Profil créé:', profile.id);
        
        // Test récupération profils
        const profiles = await db.getProfiles(10);
        console.log('   ✅ Profils récupérés:', profiles.length);
        
        // Test recherche cross-platform
        const search = await db.createCrossPlatformSearch('test query', ['tiktok'], [], 0.8);
        console.log('   ✅ Recherche créée:', search.id);
        
        // Test réseau coordonné
        const network = await db.createCoordinatedNetwork('Test Network', ['user1', 'user2'], 0.9, 'ml_detection');
        console.log('   ✅ Réseau créé:', network.id);
        
        return true;
    } catch (error) {
        console.error('   ❌ Analytics DB Error:', error.message);
        return false;
    }
}

async function testStealthDB() {
    console.log('🥷 Test Stealth DB...');
    const db = new StealthDB();
    
    try {
        // Test création session
        const session = await db.createSession('session_123', 'https://tiktok.com');
        console.log('   ✅ Session créée:', session.id);
        
        // Test ajout log
        const log = await db.addLog('session_123', 'network', 'Test log message', { url: 'test.com' });
        console.log('   ✅ Log ajouté:', log.id);
        
        // Test récupération logs
        const logs = await db.getLogs('session_123');
        console.log('   ✅ Logs récupérés:', logs.length);
        
        // Test données forensiques
        const forensicData = await db.addForensicData('session_123', { username: 'test' }, [], [], {});
        console.log('   ✅ Données forensiques ajoutées:', forensicData.id);
        
        // Test arrêt session
        await db.updateSessionStatus('session_123', 'stopped');
        console.log('   ✅ Session arrêtée');
        
        return true;
    } catch (error) {
        console.error('   ❌ Stealth DB Error:', error.message);
        return false;
    }
}

async function testForensicDB() {
    console.log('🔐 Test Forensic DB...');
    const db = new ForensicDB();
    
    try {
        // Test création preuve
        const evidence = await db.createEvidence(
            'EVD_001', 'CASE_123', 'profile', 'analytics', 
            { username: 'test', data: 'sensitive' }, 'investigator_1'
        );
        console.log('   ✅ Preuve créée:', evidence.id);
        
        // Test ajout custody
        const custody = await db.addCustodyEntry('EVD_001', 'accessed', 'investigator_1', { reason: 'analysis' });
        console.log('   ✅ Custody ajoutée:', custody.id);
        
        // Test export forensique
        const exportData = await db.createForensicExport(
            'EXP_001', 'pdf', ['EVD_001'], '/exports/report.pdf', 'investigator_1'
        );
        console.log('   ✅ Export créé:', exportData.id);
        
        // Test validation intégrité
        const validation = await db.validateIntegrity('EVD_001', 'evidence', 'sha256', true, { hash: 'valid' }, 'system');
        console.log('   ✅ Validation créée:', validation.id);
        
        return true;
    } catch (error) {
        console.error('   ❌ Forensic DB Error:', error.message);
        return false;
    }
}

async function testReportsDB() {
    console.log('📋 Test Reports DB...');
    const db = new ReportsDB();
    
    try {
        // Test création rapport
        const report = await db.createReport(
            'RPT_001', 'forensic', 'Test Report', { summary: 'Test content' }, 'analyst_1'
        );
        console.log('   ✅ Rapport créé:', report.id);
        
        // Test validation IA
        const aiValidation = await db.addAIValidation('RPT_001', 'content', 'gpt-4', 0.95, { valid: true });
        console.log('   ✅ Validation IA ajoutée:', aiValidation.id);
        
        // Test métrique système
        const metric = await db.recordMetric('analytics', 'response_time', 150.5, { endpoint: '/api/profiles' });
        console.log('   ✅ Métrique enregistrée:', metric.id);
        
        // Test alerte
        const alert = await db.createAlert('performance', 'warning', 'High response time detected', 'analytics');
        console.log('   ✅ Alerte créée:', alert.id);
        
        return true;
    } catch (error) {
        console.error('   ❌ Reports DB Error:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🧪 TESTS D\'INTÉGRITÉ JSON DATABASE PER SERVICE');
    console.log('===============================================');
    
    const results = await Promise.all([
        testAnalyticsDB(),
        testStealthDB(),
        testForensicDB(),
        testReportsDB()
    ]);
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log('');
    console.log(`📊 RÉSULTATS: ${passed}/${total} tests réussis`);
    
    if (passed === total) {
        console.log('✅ Tous les tests sont passés !');
        console.log('🎉 Architecture JSON Database per Service opérationnelle !');
        process.exit(0);
    } else {
        console.log('❌ Certains tests ont échoué');
        process.exit(1);
    }
}

runAllTests().catch(console.error);
