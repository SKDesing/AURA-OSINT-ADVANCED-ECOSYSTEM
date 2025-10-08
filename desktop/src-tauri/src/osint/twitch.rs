// ============================================
// AURA OSINT Desktop - Twitch Live Tracker
// Real-time Twitch Live Stream Analysis
// ============================================

use super::{StreamTracker, StreamData, ChatMessage, Gift};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio_tungstenite::{connect_async, tungstenite::Message};
use futures_util::{SinkExt, StreamExt};
use anyhow::{Result, anyhow};

#[derive(Debug)]
pub struct TwitchTracker {
    streamer_id: String,
    session_id: String,
    connected: bool,
    tracking: bool,
    current_data: Option<StreamData>,
    oauth_token: Option<String>,
}

#[derive(Debug, Deserialize)]
struct TwitchIRCMessage {
    tags: HashMap<String, String>,
    prefix: Option<String>,
    command: String,
    params: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct TwitchUserInfo {
    id: String,
    login: String,
    display_name: String,
    #[serde(rename = "profile_image_url")]
    profile_image_url: String,
    #[serde(rename = "view_count")]
    view_count: u32,
    description: String,
}

#[derive(Debug, Deserialize)]
struct TwitchStreamInfo {
    id: String,
    #[serde(rename = "user_id")]
    user_id: String,
    #[serde(rename = "user_login")]
    user_login: String,
    #[serde(rename = "user_name")]
    user_name: String,
    #[serde(rename = "game_id")]
    game_id: String,
    #[serde(rename = "game_name")]
    game_name: String,
    title: String,
    #[serde(rename = "viewer_count")]
    viewer_count: u32,
    #[serde(rename = "started_at")]
    started_at: String,
    language: String,
    #[serde(rename = "thumbnail_url")]
    thumbnail_url: String,
}

impl TwitchTracker {
    pub async fn new(streamer_id: &str) -> Result<Self> {
        Ok(Self {
            streamer_id: streamer_id.to_string(),
            session_id: uuid::Uuid::new_v4().to_string(),
            connected: false,
            tracking: false,
            current_data: None,
            oauth_token: std::env::var("TWITCH_OAUTH_TOKEN").ok(),
        })
    }

    async fn get_stream_info(&self) -> Result<TwitchStreamInfo> {
        let client = reqwest::Client::new();
        let url = format!(
            "https://api.twitch.tv/helix/streams?user_login={}",
            self.streamer_id
        );

        let response = client
            .get(&url)
            .header("Client-ID", std::env::var("TWITCH_CLIENT_ID").unwrap_or_default())
            .header("Authorization", format!("Bearer {}", 
                self.oauth_token.as_ref().unwrap_or(&String::new())))
            .send()
            .await?;

        let api_response: serde_json::Value = response.json().await?;
        
        if let Some(data) = api_response["data"].as_array() {
            if let Some(stream) = data.first() {
                let stream_info: TwitchStreamInfo = serde_json::from_value(stream.clone())?;
                return Ok(stream_info);
            }
        }

        Err(anyhow!("Stream not found or not live: {}", self.streamer_id))
    }

    async fn connect_to_irc(&mut self) -> Result<()> {
        let url = "wss://irc-ws.chat.twitch.tv:443";
        let (ws_stream, _) = connect_async(url).await?;
        let (mut ws_sender, mut ws_receiver) = ws_stream.split();

        // Send authentication
        let nick = format!("justinfan{}", rand::random::<u32>() % 100000);
        ws_sender.send(Message::Text(format!("NICK {}", nick))).await?;
        ws_sender.send(Message::Text("CAP REQ :twitch.tv/tags twitch.tv/commands".to_string())).await?;
        ws_sender.send(Message::Text(format!("JOIN #{}", self.streamer_id))).await?;

        tracing::info!("Connected to Twitch IRC for channel: {}", self.streamer_id);

        // Start message processing loop
        let streamer_id = self.streamer_id.clone();
        tokio::spawn(async move {
            while let Some(msg) = ws_receiver.next().await {
                match msg {
                    Ok(Message::Text(text)) => {
                        if let Err(e) = Self::process_irc_message(&text).await {
                            tracing::error!("Error processing Twitch IRC message: {}", e);
                        }
                    }
                    Ok(Message::Ping(ping)) => {
                        if let Err(e) = ws_sender.send(Message::Pong(ping)).await {
                            tracing::error!("Error sending pong: {}", e);
                            break;
                        }
                    }
                    Err(e) => {
                        tracing::error!("WebSocket error: {}", e);
                        break;
                    }
                    _ => {}
                }
            }
            tracing::info!("Twitch IRC connection closed for: {}", streamer_id);
        });

        Ok(())
    }

    async fn process_irc_message(message: &str) -> Result<()> {
        tracing::debug!("Twitch IRC message: {}", message);

        // Parse IRC message
        if message.starts_with("@") {
            // This is a tagged message (chat, subscription, etc.)
            let parts: Vec<&str> = message.splitn(2, ' ').collect();
            if parts.len() == 2 {
                let tags = Self::parse_irc_tags(parts[0])?;
                let irc_part = parts[1];

                if irc_part.contains("PRIVMSG") {
                    // This is a chat message
                    Self::process_chat_message(&tags, irc_part).await?;
                } else if irc_part.contains("USERNOTICE") {
                    // This could be a subscription, gift, etc.
                    Self::process_user_notice(&tags, irc_part).await?;
                }
            }
        }

        Ok(())
    }

    fn parse_irc_tags(tags_str: &str) -> Result<HashMap<String, String>> {
        let mut tags = HashMap::new();
        
        // Remove the @ prefix
        let tags_str = tags_str.strip_prefix('@').unwrap_or(tags_str);
        
        for tag in tags_str.split(';') {
            if let Some((key, value)) = tag.split_once('=') {
                tags.insert(key.to_string(), value.to_string());
            }
        }
        
        Ok(tags)
    }

    async fn process_chat_message(tags: &HashMap<String, String>, irc_message: &str) -> Result<()> {
        // Extract message content
        if let Some(colon_pos) = irc_message.rfind(':') {
            let message_content = &irc_message[colon_pos + 1..];
            
            let chat_message = ChatMessage {
                id: tags.get("id").cloned().unwrap_or_else(|| uuid::Uuid::new_v4().to_string()),
                user_id: tags.get("user-id").cloned().unwrap_or_default(),
                username: tags.get("display-name").cloned().unwrap_or_default(),
                message: message_content.to_string(),
                timestamp: if let Some(timestamp) = tags.get("tmi-sent-ts") {
                    chrono::DateTime::from_timestamp(
                        timestamp.parse::<i64>().unwrap_or(0) / 1000, 0
                    ).unwrap_or_else(chrono::Utc::now)
                } else {
                    chrono::Utc::now()
                },
                metadata: {
                    let mut meta = HashMap::new();
                    if let Some(badges) = tags.get("badges") {
                        meta.insert("badges".to_string(), serde_json::Value::String(badges.clone()));
                    }
                    if let Some(color) = tags.get("color") {
                        meta.insert("color".to_string(), serde_json::Value::String(color.clone()));
                    }
                    if let Some(subscriber) = tags.get("subscriber") {
                        meta.insert("subscriber".to_string(), serde_json::Value::Bool(subscriber == "1"));
                    }
                    if let Some(mod_status) = tags.get("mod") {
                        meta.insert("moderator".to_string(), serde_json::Value::Bool(mod_status == "1"));
                    }
                    meta
                },
            };

            tracing::debug!("Processed Twitch chat message: {} - {}", chat_message.username, chat_message.message);
        }

        Ok(())
    }

    async fn process_user_notice(tags: &HashMap<String, String>, _irc_message: &str) -> Result<()> {
        if let Some(msg_id) = tags.get("msg-id") {
            match msg_id.as_str() {
                "sub" | "resub" => {
                    tracing::debug!("Subscription event: {:?}", tags);
                }
                "subgift" | "anonsubgift" => {
                    tracing::debug!("Gift subscription event: {:?}", tags);
                }
                "raid" => {
                    tracing::debug!("Raid event: {:?}", tags);
                }
                _ => {
                    tracing::debug!("Other user notice: {} - {:?}", msg_id, tags);
                }
            }
        }

        Ok(())
    }
}

impl StreamTracker for TwitchTracker {
    async fn connect(&mut self) -> Result<()> {
        tracing::info!("Connecting to Twitch stream: {}", self.streamer_id);

        // Get stream info to verify it's live
        let stream_info = self.get_stream_info().await?;
        tracing::debug!("Stream info: {} viewers, playing {}", 
            stream_info.viewer_count, stream_info.game_name);

        // Connect to IRC chat
        self.connect_to_irc().await?;

        self.connected = true;
        self.current_data = Some(StreamData {
            platform: "twitch".to_string(),
            streamer_id: self.streamer_id.clone(),
            viewer_count: stream_info.viewer_count,
            messages: Vec::new(),
            gifts: Vec::new(),
            metadata: {
                let mut meta = HashMap::new();
                meta.insert("stream_id".to_string(), serde_json::Value::String(stream_info.id));
                meta.insert("game_name".to_string(), serde_json::Value::String(stream_info.game_name));
                meta.insert("title".to_string(), serde_json::Value::String(stream_info.title));
                meta.insert("language".to_string(), serde_json::Value::String(stream_info.language));
                meta
            },
            timestamp: chrono::Utc::now(),
        });

        tracing::info!("Connected to Twitch stream");
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<()> {
        self.connected = false;
        self.tracking = false;
        tracing::info!("Disconnected from Twitch stream");
        Ok(())
    }

    async fn start_tracking(&mut self) -> Result<()> {
        if !self.connected {
            self.connect().await?;
        }

        self.tracking = true;
        tracing::info!("Started tracking Twitch stream: {}", self.streamer_id);

        // Start periodic viewer count updates
        let streamer_id = self.streamer_id.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(30));
            loop {
                interval.tick().await;
                tracing::debug!("Updating Twitch stream info for: {}", streamer_id);
                // Here we would update viewer count and other stream info
            }
        });

        Ok(())
    }

    async fn stop_tracking(&mut self) -> Result<()> {
        self.tracking = false;
        tracing::info!("Stopped tracking Twitch stream: {}", self.streamer_id);
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