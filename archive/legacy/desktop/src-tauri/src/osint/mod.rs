// ============================================
// AURA OSINT Desktop - OSINT Modules
// Live Stream Tracking Implementation
// ============================================

pub mod tiktok;
pub mod youtube;
pub mod twitch;

pub use tiktok::TikTokTracker;
pub use youtube::YouTubeTracker;
pub use twitch::TwitchTracker;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StreamData {
    pub platform: String,
    pub streamer_id: String,
    pub viewer_count: u32,
    pub messages: Vec<ChatMessage>,
    pub gifts: Vec<Gift>,
    pub metadata: HashMap<String, serde_json::Value>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: String,
    pub user_id: String,
    pub username: String,
    pub message: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Gift {
    pub id: String,
    pub user_id: String,
    pub username: String,
    pub gift_name: String,
    pub gift_value: u32,
    pub gift_count: u32,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    pub user_id: String,
    pub username: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub follower_count: Option<u32>,
    pub verified: bool,
    pub metadata: HashMap<String, serde_json::Value>,
}

// Trait for all platform trackers
pub trait StreamTracker {
    async fn connect(&mut self) -> Result<(), anyhow::Error>;
    async fn disconnect(&mut self) -> Result<(), anyhow::Error>;
    async fn start_tracking(&mut self) -> Result<(), anyhow::Error>;
    async fn stop_tracking(&mut self) -> Result<(), anyhow::Error>;
    async fn get_current_data(&self) -> Result<StreamData, anyhow::Error>;
    fn is_connected(&self) -> bool;
    fn is_tracking(&self) -> bool;
}