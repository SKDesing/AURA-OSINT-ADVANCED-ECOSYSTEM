// ============================================
// AURA OSINT Desktop - Tauri Commands
// Frontend-Backend Bridge
// ============================================

use serde::{Deserialize, Serialize};
use tauri::State;
use std::collections::HashMap;
use std::sync::Mutex;

use crate::osint::{TikTokTracker, YouTubeTracker, TwitchTracker};
use crate::database::{Session, LiveData};

// Global state for active trackers
type TrackerState = Mutex<HashMap<String, Box<dyn Send + Sync>>>;

#[derive(Debug, Serialize, Deserialize)]
pub struct TrackingRequest {
    pub platform: String,
    pub streamer_id: String,
    pub session_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TrackingResponse {
    pub success: bool,
    pub session_id: Option<String>,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LiveDataResponse {
    pub session_id: String,
    pub platform: String,
    pub streamer_id: String,
    pub viewer_count: u32,
    pub messages: Vec<ChatMessage>,
    pub gifts: Vec<Gift>,
    pub metadata: serde_json::Value,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: String,
    pub user_id: String,
    pub username: String,
    pub message: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub is_harassment: Option<bool>,
    pub severity: Option<u8>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Gift {
    pub id: String,
    pub user_id: String,
    pub username: String,
    pub gift_name: String,
    pub gift_value: u32,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HarassmentAnalysis {
    pub message_id: String,
    pub is_harassment: bool,
    pub confidence: f32,
    pub severity: u8,
    pub category: String,
    pub keywords: Vec<String>,
    pub explanation: String,
}

// ============================================
// OSINT TRACKING COMMANDS
// ============================================

#[tauri::command]
pub async fn start_tiktok_tracking(
    request: TrackingRequest,
    state: State<'_, TrackerState>,
) -> Result<TrackingResponse, String> {
    tracing::info!("Starting TikTok tracking for: {}", request.streamer_id);
    
    let session_id = uuid::Uuid::new_v4().to_string();
    
    match TikTokTracker::new(&request.streamer_id).await {
        Ok(mut tracker) => {
            // Start tracking in background
            let streamer_id = request.streamer_id.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = tracker.start_tracking().await {
                    tracing::error!("TikTok tracking failed: {}", e);
                }
            });
            
            // Store tracker reference
            // state.lock().unwrap().insert(session_id.clone(), Box::new(tracker));
            
            Ok(TrackingResponse {
                success: true,
                session_id: Some(session_id),
                message: format!("Started tracking TikTok user: {}", streamer_id),
            })
        }
        Err(e) => {
            tracing::error!("Failed to create TikTok tracker: {}", e);
            Ok(TrackingResponse {
                success: false,
                session_id: None,
                message: format!("Failed to start tracking: {}", e),
            })
        }
    }
}

#[tauri::command]
pub async fn stop_tiktok_tracking(session_id: String) -> Result<TrackingResponse, String> {
    tracing::info!("Stopping TikTok tracking for session: {}", session_id);
    
    // Implementation to stop tracking
    Ok(TrackingResponse {
        success: true,
        session_id: Some(session_id),
        message: "Tracking stopped successfully".to_string(),
    })
}

#[tauri::command]
pub async fn start_youtube_tracking(
    request: TrackingRequest,
) -> Result<TrackingResponse, String> {
    tracing::info!("Starting YouTube tracking for: {}", request.streamer_id);
    
    let session_id = uuid::Uuid::new_v4().to_string();
    
    match YouTubeTracker::new(&request.streamer_id).await {
        Ok(mut tracker) => {
            let streamer_id = request.streamer_id.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = tracker.start_tracking().await {
                    tracing::error!("YouTube tracking failed: {}", e);
                }
            });
            
            Ok(TrackingResponse {
                success: true,
                session_id: Some(session_id),
                message: format!("Started tracking YouTube channel: {}", streamer_id),
            })
        }
        Err(e) => {
            Ok(TrackingResponse {
                success: false,
                session_id: None,
                message: format!("Failed to start YouTube tracking: {}", e),
            })
        }
    }
}

#[tauri::command]
pub async fn start_twitch_tracking(
    request: TrackingRequest,
) -> Result<TrackingResponse, String> {
    tracing::info!("Starting Twitch tracking for: {}", request.streamer_id);
    
    let session_id = uuid::Uuid::new_v4().to_string();
    
    match TwitchTracker::new(&request.streamer_id).await {
        Ok(mut tracker) => {
            let streamer_id = request.streamer_id.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = tracker.start_tracking().await {
                    tracing::error!("Twitch tracking failed: {}", e);
                }
            });
            
            Ok(TrackingResponse {
                success: true,
                session_id: Some(session_id),
                message: format!("Started tracking Twitch channel: {}", streamer_id),
            })
        }
        Err(e) => {
            Ok(TrackingResponse {
                success: false,
                session_id: None,
                message: format!("Failed to start Twitch tracking: {}", e),
            })
        }
    }
}

// ============================================
// DATA RETRIEVAL COMMANDS
// ============================================

#[tauri::command]
pub async fn get_live_data(session_id: String) -> Result<LiveDataResponse, String> {
    tracing::debug!("Getting live data for session: {}", session_id);
    
    // Mock data for now - replace with actual database query
    Ok(LiveDataResponse {
        session_id: session_id.clone(),
        platform: "tiktok".to_string(),
        streamer_id: "example_user".to_string(),
        viewer_count: 1250,
        messages: vec![
            ChatMessage {
                id: uuid::Uuid::new_v4().to_string(),
                user_id: "user123".to_string(),
                username: "viewer1".to_string(),
                message: "Great stream!".to_string(),
                timestamp: chrono::Utc::now(),
                is_harassment: Some(false),
                severity: Some(1),
            },
            ChatMessage {
                id: uuid::Uuid::new_v4().to_string(),
                user_id: "user456".to_string(),
                username: "viewer2".to_string(),
                message: "You are stupid".to_string(),
                timestamp: chrono::Utc::now(),
                is_harassment: Some(true),
                severity: Some(7),
            },
        ],
        gifts: vec![
            Gift {
                id: uuid::Uuid::new_v4().to_string(),
                user_id: "user789".to_string(),
                username: "generous_viewer".to_string(),
                gift_name: "Rose".to_string(),
                gift_value: 1,
                timestamp: chrono::Utc::now(),
            },
        ],
        metadata: serde_json::json!({
            "stream_title": "Live Gaming Session",
            "category": "Gaming",
            "duration": 3600,
            "peak_viewers": 2500
        }),
        timestamp: chrono::Utc::now(),
    })
}

#[tauri::command]
pub async fn get_sessions() -> Result<Vec<Session>, String> {
    tracing::debug!("Getting all sessions");
    
    match crate::database::get_all_sessions().await {
        Ok(sessions) => Ok(sessions),
        Err(e) => {
            tracing::error!("Failed to get sessions: {}", e);
            Err(format!("Failed to get sessions: {}", e))
        }
    }
}

#[tauri::command]
pub async fn get_session_data(session_id: String) -> Result<Vec<LiveData>, String> {
    tracing::debug!("Getting session data for: {}", session_id);
    
    match crate::database::get_session_data(&session_id).await {
        Ok(data) => Ok(data),
        Err(e) => {
            tracing::error!("Failed to get session data: {}", e);
            Err(format!("Failed to get session data: {}", e))
        }
    }
}

#[tauri::command]
pub async fn export_session(session_id: String, format: String) -> Result<String, String> {
    tracing::info!("Exporting session {} as {}", session_id, format);
    
    match crate::database::export_session(&session_id, &format).await {
        Ok(file_path) => Ok(file_path),
        Err(e) => {
            tracing::error!("Failed to export session: {}", e);
            Err(format!("Failed to export session: {}", e))
        }
    }
}

// ============================================
// ANALYTICS COMMANDS
// ============================================

#[tauri::command]
pub async fn analyze_harassment(message: String) -> Result<HarassmentAnalysis, String> {
    tracing::debug!("Analyzing message for harassment: {}", message);
    
    // Mock analysis - replace with actual ML model
    let is_harassment = message.to_lowercase().contains("stupid") || 
                       message.to_lowercase().contains("hate") ||
                       message.to_lowercase().contains("kill");
    
    Ok(HarassmentAnalysis {
        message_id: uuid::Uuid::new_v4().to_string(),
        is_harassment,
        confidence: if is_harassment { 0.85 } else { 0.95 },
        severity: if is_harassment { 7 } else { 1 },
        category: if is_harassment { "insults".to_string() } else { "normal".to_string() },
        keywords: if is_harassment { vec!["stupid".to_string()] } else { vec![] },
        explanation: if is_harassment {
            "Message contains insulting language".to_string()
        } else {
            "Message appears to be normal conversation".to_string()
        },
    })
}

#[tauri::command]
pub async fn get_analytics(session_id: String) -> Result<serde_json::Value, String> {
    tracing::debug!("Getting analytics for session: {}", session_id);
    
    // Mock analytics data
    Ok(serde_json::json!({
        "session_id": session_id,
        "total_messages": 1250,
        "harassment_detected": 45,
        "harassment_rate": 3.6,
        "peak_viewers": 2500,
        "average_viewers": 1800,
        "top_keywords": ["gaming", "awesome", "cool"],
        "sentiment_distribution": {
            "positive": 65.2,
            "neutral": 31.2,
            "negative": 3.6
        },
        "hourly_activity": [120, 150, 200, 250, 300, 280, 220, 180]
    }))
}

// ============================================
// SYSTEM COMMANDS
// ============================================

#[tauri::command]
pub async fn get_app_info() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "name": "AURA OSINT",
        "version": "1.0.0",
        "description": "Professional OSINT Platform for Live Stream Intelligence",
        "author": "WebSK",
        "build_date": env!("BUILD_DATE"),
        "commit_hash": env!("GIT_HASH")
    }))
}

#[tauri::command]
pub async fn check_updates() -> Result<serde_json::Value, String> {
    tracing::info!("Checking for updates");
    
    // This will be handled by Tauri's built-in updater
    Ok(serde_json::json!({
        "update_available": false,
        "current_version": "1.0.0",
        "latest_version": "1.0.0"
    }))
}