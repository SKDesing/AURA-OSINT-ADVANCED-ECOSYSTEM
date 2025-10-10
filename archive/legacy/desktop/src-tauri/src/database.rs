// ============================================
// AURA OSINT Desktop - Database Layer
// SQLite Database for Local Storage
// ============================================

use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool, Row};
use anyhow::{Result, anyhow};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub platform: String,
    pub streamer_id: String,
    pub session_name: Option<String>,
    pub started_at: chrono::DateTime<chrono::Utc>,
    pub ended_at: Option<chrono::DateTime<chrono::Utc>>,
    pub status: String,
    pub total_messages: i64,
    pub total_gifts: i64,
    pub peak_viewers: i64,
    pub metadata: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LiveData {
    pub id: String,
    pub session_id: String,
    pub data_type: String, // "message", "gift", "viewer_count", "metadata"
    pub user_id: Option<String>,
    pub username: Option<String>,
    pub content: serde_json::Value,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub harassment_detected: Option<bool>,
    pub harassment_severity: Option<i32>,
    pub harassment_category: Option<String>,
}

static mut DB_POOL: Option<SqlitePool> = None;

pub async fn init_database() -> Result<()> {
    // Get app data directory
    let app_data_dir = get_app_data_dir()?;
    std::fs::create_dir_all(&app_data_dir)?;
    
    let db_path = app_data_dir.join("aura_osint.db");
    let database_url = format!("sqlite:{}", db_path.display());
    
    tracing::info!("Initializing database at: {}", database_url);
    
    let pool = SqlitePool::connect(&database_url).await?;
    
    // Run migrations
    create_tables(&pool).await?;
    
    unsafe {
        DB_POOL = Some(pool);
    }
    
    tracing::info!("Database initialized successfully");
    Ok(())
}

fn get_app_data_dir() -> Result<PathBuf> {
    let app_data = if cfg!(target_os = "windows") {
        std::env::var("APPDATA")?
    } else if cfg!(target_os = "macos") {
        format!("{}/Library/Application Support", std::env::var("HOME")?)
    } else {
        format!("{}/.local/share", std::env::var("HOME")?)
    };
    
    Ok(PathBuf::from(app_data).join("AURA OSINT"))
}

async fn create_tables(pool: &SqlitePool) -> Result<()> {
    // Sessions table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            streamer_id TEXT NOT NULL,
            session_name TEXT,
            started_at DATETIME NOT NULL,
            ended_at DATETIME,
            status TEXT NOT NULL DEFAULT 'active',
            total_messages INTEGER DEFAULT 0,
            total_gifts INTEGER DEFAULT 0,
            peak_viewers INTEGER DEFAULT 0,
            metadata TEXT DEFAULT '{}',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    "#).execute(pool).await?;

    // Live data table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS live_data (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            data_type TEXT NOT NULL,
            user_id TEXT,
            username TEXT,
            content TEXT NOT NULL,
            timestamp DATETIME NOT NULL,
            harassment_detected BOOLEAN,
            harassment_severity INTEGER,
            harassment_category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    "#).execute(pool).await?;

    // Analytics table
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS analytics (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            metric_name TEXT NOT NULL,
            metric_value REAL NOT NULL,
            metric_metadata TEXT DEFAULT '{}',
            calculated_at DATETIME NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    "#).execute(pool).await?;

    // Users table (for caching user info)
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            user_id TEXT NOT NULL,
            username TEXT NOT NULL,
            display_name TEXT,
            avatar_url TEXT,
            follower_count INTEGER,
            verified BOOLEAN DEFAULT FALSE,
            metadata TEXT DEFAULT '{}',
            first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(platform, user_id)
        )
    "#).execute(pool).await?;

    // Create indexes for better performance
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_sessions_platform_streamer ON sessions(platform, streamer_id)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_live_data_session_timestamp ON live_data(session_id, timestamp)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_live_data_harassment ON live_data(harassment_detected, harassment_severity)").execute(pool).await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_users_platform_user ON users(platform, user_id)").execute(pool).await?;

    tracing::info!("Database tables created successfully");
    Ok(())
}

fn get_pool() -> Result<&'static SqlitePool> {
    unsafe {
        DB_POOL.as_ref().ok_or_else(|| anyhow!("Database not initialized"))
    }
}

// ============================================
// SESSION OPERATIONS
// ============================================

pub async fn create_session(session: &Session) -> Result<()> {
    let pool = get_pool()?;
    
    sqlx::query(r#"
        INSERT INTO sessions (
            id, platform, streamer_id, session_name, started_at, 
            status, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    "#)
    .bind(&session.id)
    .bind(&session.platform)
    .bind(&session.streamer_id)
    .bind(&session.session_name)
    .bind(&session.started_at)
    .bind(&session.status)
    .bind(session.metadata.to_string())
    .execute(pool)
    .await?;
    
    tracing::info!("Created session: {}", session.id);
    Ok(())
}

pub async fn get_all_sessions() -> Result<Vec<Session>> {
    let pool = get_pool()?;
    
    let rows = sqlx::query(r#"
        SELECT id, platform, streamer_id, session_name, started_at, ended_at,
               status, total_messages, total_gifts, peak_viewers, metadata
        FROM sessions
        ORDER BY started_at DESC
    "#)
    .fetch_all(pool)
    .await?;
    
    let mut sessions = Vec::new();
    for row in rows {
        let metadata_str: String = row.get("metadata");
        let metadata: serde_json::Value = serde_json::from_str(&metadata_str)
            .unwrap_or(serde_json::Value::Object(serde_json::Map::new()));
        
        sessions.push(Session {
            id: row.get("id"),
            platform: row.get("platform"),
            streamer_id: row.get("streamer_id"),
            session_name: row.get("session_name"),
            started_at: row.get("started_at"),
            ended_at: row.get("ended_at"),
            status: row.get("status"),
            total_messages: row.get("total_messages"),
            total_gifts: row.get("total_gifts"),
            peak_viewers: row.get("peak_viewers"),
            metadata,
        });
    }
    
    Ok(sessions)
}

pub async fn update_session_stats(session_id: &str, messages: i64, gifts: i64, viewers: i64) -> Result<()> {
    let pool = get_pool()?;
    
    sqlx::query(r#"
        UPDATE sessions 
        SET total_messages = ?, total_gifts = ?, peak_viewers = MAX(peak_viewers, ?),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    "#)
    .bind(messages)
    .bind(gifts)
    .bind(viewers)
    .bind(session_id)
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn end_session(session_id: &str) -> Result<()> {
    let pool = get_pool()?;
    
    sqlx::query(r#"
        UPDATE sessions 
        SET status = 'completed', ended_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    "#)
    .bind(session_id)
    .execute(pool)
    .await?;
    
    tracing::info!("Ended session: {}", session_id);
    Ok(())
}

// ============================================
// LIVE DATA OPERATIONS
// ============================================

pub async fn insert_live_data(data: &LiveData) -> Result<()> {
    let pool = get_pool()?;
    
    sqlx::query(r#"
        INSERT INTO live_data (
            id, session_id, data_type, user_id, username, content, timestamp,
            harassment_detected, harassment_severity, harassment_category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    "#)
    .bind(&data.id)
    .bind(&data.session_id)
    .bind(&data.data_type)
    .bind(&data.user_id)
    .bind(&data.username)
    .bind(data.content.to_string())
    .bind(&data.timestamp)
    .bind(data.harassment_detected)
    .bind(data.harassment_severity)
    .bind(&data.harassment_category)
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn get_session_data(session_id: &str) -> Result<Vec<LiveData>> {
    let pool = get_pool()?;
    
    let rows = sqlx::query(r#"
        SELECT id, session_id, data_type, user_id, username, content, timestamp,
               harassment_detected, harassment_severity, harassment_category
        FROM live_data
        WHERE session_id = ?
        ORDER BY timestamp ASC
    "#)
    .bind(session_id)
    .fetch_all(pool)
    .await?;
    
    let mut data = Vec::new();
    for row in rows {
        let content_str: String = row.get("content");
        let content: serde_json::Value = serde_json::from_str(&content_str)
            .unwrap_or(serde_json::Value::Null);
        
        data.push(LiveData {
            id: row.get("id"),
            session_id: row.get("session_id"),
            data_type: row.get("data_type"),
            user_id: row.get("user_id"),
            username: row.get("username"),
            content,
            timestamp: row.get("timestamp"),
            harassment_detected: row.get("harassment_detected"),
            harassment_severity: row.get("harassment_severity"),
            harassment_category: row.get("harassment_category"),
        });
    }
    
    Ok(data)
}

pub async fn get_harassment_data(session_id: &str) -> Result<Vec<LiveData>> {
    let pool = get_pool()?;
    
    let rows = sqlx::query(r#"
        SELECT id, session_id, data_type, user_id, username, content, timestamp,
               harassment_detected, harassment_severity, harassment_category
        FROM live_data
        WHERE session_id = ? AND harassment_detected = TRUE
        ORDER BY harassment_severity DESC, timestamp ASC
    "#)
    .bind(session_id)
    .fetch_all(pool)
    .await?;
    
    let mut data = Vec::new();
    for row in rows {
        let content_str: String = row.get("content");
        let content: serde_json::Value = serde_json::from_str(&content_str)
            .unwrap_or(serde_json::Value::Null);
        
        data.push(LiveData {
            id: row.get("id"),
            session_id: row.get("session_id"),
            data_type: row.get("data_type"),
            user_id: row.get("user_id"),
            username: row.get("username"),
            content,
            timestamp: row.get("timestamp"),
            harassment_detected: row.get("harassment_detected"),
            harassment_severity: row.get("harassment_severity"),
            harassment_category: row.get("harassment_category"),
        });
    }
    
    Ok(data)
}

// ============================================
// EXPORT OPERATIONS
// ============================================

pub async fn export_session(session_id: &str, format: &str) -> Result<String> {
    let session_data = get_session_data(session_id).await?;
    let sessions = get_all_sessions().await?;
    let session = sessions.into_iter().find(|s| s.id == session_id)
        .ok_or_else(|| anyhow!("Session not found"))?;
    
    let app_data_dir = get_app_data_dir()?;
    let exports_dir = app_data_dir.join("exports");
    std::fs::create_dir_all(&exports_dir)?;
    
    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let filename = format!("aura_export_{}_{}.{}", session_id, timestamp, format);
    let file_path = exports_dir.join(&filename);
    
    match format {
        "json" => {
            let export_data = serde_json::json!({
                "session": session,
                "data": session_data,
                "exported_at": chrono::Utc::now(),
                "export_version": "1.0"
            });
            std::fs::write(&file_path, serde_json::to_string_pretty(&export_data)?)?;
        }
        "csv" => {
            let mut csv_content = String::new();
            csv_content.push_str("timestamp,data_type,user_id,username,content,harassment_detected,harassment_severity,harassment_category\n");
            
            for data in session_data {
                csv_content.push_str(&format!(
                    "{},{},{},{},{},{},{},{}\n",
                    data.timestamp.format("%Y-%m-%d %H:%M:%S"),
                    data.data_type,
                    data.user_id.unwrap_or_default(),
                    data.username.unwrap_or_default(),
                    data.content.to_string().replace(',', ';').replace('\n', ' '),
                    data.harassment_detected.unwrap_or(false),
                    data.harassment_severity.unwrap_or(0),
                    data.harassment_category.unwrap_or_default()
                ));
            }
            
            std::fs::write(&file_path, csv_content)?;
        }
        _ => {
            return Err(anyhow!("Unsupported export format: {}", format));
        }
    }
    
    tracing::info!("Exported session {} to: {}", session_id, file_path.display());
    Ok(file_path.to_string_lossy().to_string())
}