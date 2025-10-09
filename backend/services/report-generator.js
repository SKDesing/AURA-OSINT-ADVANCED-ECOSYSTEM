// ============================================
// 📄 AURA OSINT - REPORT GENERATOR
// ============================================
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../../reports');
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aura_tiktok_streams',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

// ============================================
// RÉCUPÉRATION DONNÉES
// ============================================
async function fetchLiveData(sessionId) {
    // Session info
    const session = await pool.query(`
        SELECT * FROM live_sessions WHERE session_id = $1
    `, [sessionId]);

    if (session.rows.length === 0) {
        throw new Error(`Session ${sessionId} non trouvée`);
    }

    // Stats globales
    const stats = await pool.query(`
        SELECT 
            COUNT(*) as total_messages,
            COUNT(DISTINCT user_id) as unique_users,
            AVG(sentiment_score) as avg_sentiment
        FROM chat_messages
        WHERE session_id = $1
    `, [sessionId]);

    // Top utilisateurs
    const topUsers = await pool.query(`
        SELECT 
            username,
            COUNT(*) as message_count
        FROM chat_messages
        WHERE session_id = $1
        GROUP BY username
        ORDER BY message_count DESC
        LIMIT 10
    `, [sessionId]);

    // Messages récents
    const recentMessages = await pool.query(`
        SELECT username, message_text, timestamp_live
        FROM chat_messages
        WHERE session_id = $1
        ORDER BY timestamp_live DESC
        LIMIT 50
    `, [sessionId]);

    return {
        session: session.rows[0],
        stats: stats.rows[0],
        topUsers: topUsers.rows,
        recentMessages: recentMessages.rows
    };
}

// ============================================
// GÉNÉRATION PDF
// ============================================
async function generatePDF(sessionId) {
    const data = await fetchLiveData(sessionId);
    const filename = `report_${sessionId}_${Date.now()}.pdf`;
    const filepath = path.join(REPORTS_DIR, filename);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('RAPPORT AURA OSINT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Session: ${data.session.target_username}`, { align: 'center' });
    doc.text(`Date: ${new Date(data.session.started_at).toLocaleString('fr-FR')}`, { align: 'center' });
    doc.moveDown(2);

    // Stats
    doc.fontSize(16).text('📊 STATISTIQUES');
    doc.fontSize(12);
    doc.text(`Messages totaux: ${data.stats.total_messages}`);
    doc.text(`Utilisateurs uniques: ${data.stats.unique_users}`);
    doc.text(`Sentiment moyen: ${data.stats.avg_sentiment?.toFixed(2) || 'N/A'}`);
    doc.moveDown();

    // Top utilisateurs
    doc.fontSize(16).text('👥 TOP UTILISATEURS');
    doc.fontSize(10);
    data.topUsers.forEach((user, i) => {
        doc.text(`${i + 1}. @${user.username} - ${user.message_count} messages`);
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            console.log(`✅ PDF généré: ${filename}`);
            resolve({ filename, filepath });
        });
        stream.on('error', reject);
    });
}

// ============================================
// FONCTION PRINCIPALE
// ============================================
async function generateReport(sessionId, type = 'pdf') {
    console.log(`🔄 Génération rapport pour session ${sessionId}...`);

    try {
        if (type === 'pdf') {
            return await generatePDF(sessionId);
        }
        
        throw new Error(`Type ${type} non supporté`);
    } catch (error) {
        console.error(`❌ Erreur génération rapport:`, error);
        throw error;
    }
}

module.exports = {
    generateReport,
    fetchLiveData
};