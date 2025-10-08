// ============================================
// AURA OSINT Desktop - YouTube Live Tracker
// Real-time YouTube Live Stream Analysis
// ============================================

use super::{StreamTracker, StreamData, ChatMessage, Gift};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use anyhow::{Result, anyhow};

#[derive(Debug)]
pub struct YouTubeTracker {
    streamer_id: String,
    session_id: String,
    connected: bool,
    tracking: bool,
    current_data: Option<StreamData>,
    api_key: Option<String>,
}

#[derive(Debug, Deserialize)]
struct YouTubeLiveChatResponse {
    items: Vec<YouTubeChatMessage>,
    #[serde(rename = "nextPageToken")]
    next_page_token: Option<String>,
    #[serde(rename = "pollingIntervalMillis")]
    polling_interval: Option<u64>,
}

#[derive(Debug, Deserialize)]
struct YouTubeChatMessage {
    id: String,
    snippet: YouTubeChatSnippet,
    #[serde(rename = "authorDetails")]
    author_details: YouTubeAuthor,
}

#[derive(Debug, Deserialize)]
struct YouTubeChatSnippet {
    #[serde(rename = "displayMessage")]
    display_message: String,
    #[serde(rename = "publishedAt")]
    published_at: String,
    #[serde(rename = "type")]
    message_type: String,
}

#[derive(Debug, Deserialize)]
struct YouTubeAuthor {
    #[serde(rename = "channelId")]
    channel_id: String,
    #[serde(rename = "displayName")]
    display_name: String,
    #[serde(rename = "profileImageUrl")]
    profile_image_url: Option<String>,
    #[serde(rename = "isVerified")]
    is_verified: Option<bool>,
    #[serde(rename = "isChatModerator")]
    is_moderator: Option<bool>,
    #[serde(rename = "isChatOwner")]
    is_owner: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct YouTubeVideoDetails {
    items: Vec<YouTubeVideo>,
}

#[derive(Debug, Deserialize)]
struct YouTubeVideo {
    id: String,
    snippet: YouTubeVideoSnippet,
    #[serde(rename = "liveStreamingDetails")]
    live_streaming_details: Option<YouTubeLiveDetails>,
}

#[derive(Debug, Deserialize)]
struct YouTubeVideoSnippet {
    title: String,
    description: String,
    #[serde(rename = "channelId")]
    channel_id: String,
    #[serde(rename = "channelTitle")]
    channel_title: String,
}

#[derive(Debug, Deserialize)]
struct YouTubeLiveDetails {
    #[serde(rename = "actualStartTime")]
    actual_start_time: Option<String>,
    #[serde(rename = "concurrentViewers")]
    concurrent_viewers: Option<String>,
    #[serde(rename = "activeLiveChatId")]
    active_live_chat_id: Option<String>,
}

impl YouTubeTracker {
    pub async fn new(streamer_id: &str) -> Result<Self> {
        Ok(Self {
            streamer_id: streamer_id.to_string(),
            session_id: uuid::Uuid::new_v4().to_string(),
            connected: false,
            tracking: false,
            current_data: None,
            api_key: std::env::var("YOUTUBE_API_KEY").ok(),
        })
    }

    async fn get_live_video_id(&self) -> Result<String> {
        let api_key = self.api_key
            .as_ref()
            .ok_or_else(|| anyhow!("YouTube API key not configured"))?;

        let client = reqwest::Client::new();
        let url = format!(
            "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={}&eventType=live&type=video&key={}",
            self.streamer_id, api_key
        );

        let response = client.get(&url).send().await?;
        let search_result: serde_json::Value = response.json().await?;

        if let Some(items) = search_result["items"].as_array() {
            if let Some(first_item) = items.first() {
                if let Some(video_id) = first_item["id"]["videoId"].as_str() {
                    return Ok(video_id.to_string());
                }
            }
        }

        Err(anyhow!("No live stream found for channel: {}", self.streamer_id))
    }

    async fn get_live_chat_id(&self, video_id: &str) -> Result<String> {
        let api_key = self.api_key
            .as_ref()
            .ok_or_else(|| anyhow!("YouTube API key not configured"))?;

        let client = reqwest::Client::new();
        let url = format!(
            "https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id={}&key={}",
            video_id, api_key
        );

        let response = client.get(&url).send().await?;
        let video_details: YouTubeVideoDetails = response.json().await?;

        if let Some(video) = video_details.items.first() {
            if let Some(ref live_details) = video.live_streaming_details {
                if let Some(ref chat_id) = live_details.active_live_chat_id {
                    return Ok(chat_id.clone());
                }
            }
        }

        Err(anyhow!("No active live chat found for video: {}", video_id))
    }

    async fn fetch_chat_messages(&self, chat_id: &str, page_token: Option<&str>) -> Result<YouTubeLiveChatResponse> {
        let api_key = self.api_key
            .as_ref()
            .ok_or_else(|| anyhow!("YouTube API key not configured"))?;

        let client = reqwest::Client::new();
        let mut url = format!(
            "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId={}&part=snippet,authorDetails&key={}",
            chat_id, api_key
        );

        if let Some(token) = page_token {
            url.push_str(&format!("&pageToken={}", token));
        }

        let response = client.get(&url).send().await?;
        let chat_response: YouTubeLiveChatResponse = response.json().await?;

        Ok(chat_response)
    }

    async fn process_chat_messages(&mut self, messages: Vec<YouTubeChatMessage>) -> Result<()> {
        for msg in messages {
            let chat_message = ChatMessage {
                id: msg.id,
                user_id: msg.author_details.channel_id,
                username: msg.author_details.display_name,
                message: msg.snippet.display_message,
                timestamp: chrono::DateTime::parse_from_rfc3339(&msg.snippet.published_at)
                    .map(|dt| dt.with_timezone(&chrono::Utc))
                    .unwrap_or_else(|_| chrono::Utc::now()),
                metadata: {
                    let mut meta = HashMap::new();
                    meta.insert("type".to_string(), serde_json::Value::String(msg.snippet.message_type));
                    if let Some(verified) = msg.author_details.is_verified {
                        meta.insert("verified".to_string(), serde_json::Value::Bool(verified));
                    }
                    if let Some(moderator) = msg.author_details.is_moderator {
                        meta.insert("moderator".to_string(), serde_json::Value::Bool(moderator));
                    }
                    if let Some(owner) = msg.author_details.is_owner {
                        meta.insert("owner".to_string(), serde_json::Value::Bool(owner));
                    }
                    meta
                },
            };

            if let Some(ref mut data) = self.current_data {
                data.messages.push(chat_message);
            }
        }

        Ok(())
    }
}

impl StreamTracker for YouTubeTracker {
    async fn connect(&mut self) -> Result<()> {
        tracing::info!("Connecting to YouTube live stream: {}", self.streamer_id);

        if self.api_key.is_none() {
            return Err(anyhow!("YouTube API key not configured. Set YOUTUBE_API_KEY environment variable."));
        }

        // Get live video ID
        let video_id = self.get_live_video_id().await?;
        tracing::debug!("Found live video ID: {}", video_id);

        // Get live chat ID
        let chat_id = self.get_live_chat_id(&video_id).await?;
        tracing::debug!("Found live chat ID: {}", chat_id);

        self.connected = true;
        self.current_data = Some(StreamData {
            platform: "youtube".to_string(),
            streamer_id: self.streamer_id.clone(),
            viewer_count: 0,
            messages: Vec::new(),
            gifts: Vec::new(), // YouTube doesn't have gifts like TikTok
            metadata: {
                let mut meta = HashMap::new();
                meta.insert("video_id".to_string(), serde_json::Value::String(video_id));
                meta.insert("chat_id".to_string(), serde_json::Value::String(chat_id));
                meta
            },
            timestamp: chrono::Utc::now(),
        });

        tracing::info!("Connected to YouTube live stream");
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<()> {
        self.connected = false;
        self.tracking = false;
        tracing::info!("Disconnected from YouTube live stream");
        Ok(())
    }

    async fn start_tracking(&mut self) -> Result<()> {
        if !self.connected {
            self.connect().await?;
        }

        self.tracking = true;
        tracing::info!("Started tracking YouTube live stream: {}", self.streamer_id);

        // Start polling for chat messages
        let streamer_id = self.streamer_id.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(10));
            loop {
                interval.tick().await;
                tracing::debug!("Polling YouTube chat messages for: {}", streamer_id);
                // Here we would poll the YouTube API for new messages
            }
        });

        Ok(())
    }

    async fn stop_tracking(&mut self) -> Result<()> {
        self.tracking = false;
        tracing::info!("Stopped tracking YouTube live stream: {}", self.streamer_id);
        Ok(())
    }

    async fn get_current_data(&self) -> Result<StreamData> {
        self.current_data
            .clone()
            .ok_or_else(|| anyhow!("No data available"))
    }

    fn is_connected(&self) -> bool {
        self.connected
    }

    fn is_tracking(&self) -> bool {
        self.tracking
    }
}