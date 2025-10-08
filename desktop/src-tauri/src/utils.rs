// ============================================
// AURA OSINT Desktop - Utility Functions
// Common utilities and helpers
// ============================================

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HarassmentAnalysis {
    pub is_harassment: bool,
    pub confidence: f32,
    pub severity: u8,
    pub category: String,
    pub keywords: Vec<String>,
    pub explanation: String,
}

// Simple harassment detection (placeholder for ML model)
pub fn analyze_harassment(message: &str) -> HarassmentAnalysis {
    let message_lower = message.to_lowercase();
    
    // Define harassment patterns
    let harassment_patterns = vec![
        ("threats", vec!["kill", "murder", "die", "death", "hurt", "harm"]),
        ("insults", vec!["stupid", "idiot", "moron", "loser", "ugly", "fat"]),
        ("hate_speech", vec!["hate", "racist", "nazi", "terrorist"]),
        ("sexual_harassment", vec!["sex", "nude", "naked", "porn"]),
        ("cyberbullying", vec!["nobody likes you", "everyone hates", "kill yourself"]),
    ];
    
    let mut detected_keywords = Vec::new();
    let mut max_severity = 0u8;
    let mut primary_category = "normal".to_string();
    
    for (category, keywords) in harassment_patterns {
        for keyword in keywords {
            if message_lower.contains(keyword) {
                detected_keywords.push(keyword.to_string());
                let severity = match category {
                    "threats" => 10,
                    "hate_speech" => 9,
                    "sexual_harassment" => 8,
                    "cyberbullying" => 7,
                    "insults" => 5,
                    _ => 1,
                };
                
                if severity > max_severity {
                    max_severity = severity;
                    primary_category = category.to_string();
                }
            }
        }
    }
    
    let is_harassment = max_severity >= 5;
    let confidence = if is_harassment {
        0.7 + (detected_keywords.len() as f32 * 0.1).min(0.3)
    } else {
        0.95
    };
    
    let explanation = if is_harassment {
        format!(
            "🚨 HARCÈLEMENT DÉTECTÉ\nCatégorie: {}\nSévérité: {}/10\nMots-clés: {}",
            primary_category.to_uppercase(),
            max_severity,
            detected_keywords.join(", ")
        )
    } else {
        "Message analysé comme sain, aucun signe de harcèlement détecté.".to_string()
    };
    
    HarassmentAnalysis {
        is_harassment,
        confidence,
        severity: max_severity,
        category: primary_category,
        keywords: detected_keywords,
        explanation,
    }
}

// Text preprocessing utilities
pub fn clean_text(text: &str) -> String {
    text.trim()
        .replace('\n', ' ')
        .replace('\r', ' ')
        .replace('\t', ' ')
        .chars()
        .filter(|c| c.is_ascii() || c.is_whitespace())
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join(" ")
}

// Extract mentions from text
pub fn extract_mentions(text: &str) -> Vec<String> {
    let mut mentions = Vec::new();
    let words: Vec<&str> = text.split_whitespace().collect();
    
    for word in words {
        if word.starts_with('@') && word.len() > 1 {
            let mention = word[1..].trim_end_matches(|c: char| !c.is_alphanumeric() && c != '_');
            if !mention.is_empty() {
                mentions.push(mention.to_string());
            }
        }
    }
    
    mentions
}

// Extract hashtags from text
pub fn extract_hashtags(text: &str) -> Vec<String> {
    let mut hashtags = Vec::new();
    let words: Vec<&str> = text.split_whitespace().collect();
    
    for word in words {
        if word.starts_with('#') && word.len() > 1 {
            let hashtag = word[1..].trim_end_matches(|c: char| !c.is_alphanumeric() && c != '_');
            if !hashtag.is_empty() {
                hashtags.push(hashtag.to_string());
            }
        }
    }
    
    hashtags
}

// Calculate text similarity (Jaccard similarity)
pub fn calculate_similarity(text1: &str, text2: &str) -> f32 {
    let words1: std::collections::HashSet<&str> = text1.split_whitespace().collect();
    let words2: std::collections::HashSet<&str> = text2.split_whitespace().collect();
    
    let intersection = words1.intersection(&words2).count();
    let union = words1.union(&words2).count();
    
    if union == 0 {
        0.0
    } else {
        intersection as f32 / union as f32
    }
}

// Generate analytics summary
pub fn generate_analytics_summary(messages: &[crate::commands::ChatMessage]) -> serde_json::Value {
    let total_messages = messages.len();
    let harassment_messages: Vec<_> = messages.iter()
        .filter(|m| m.is_harassment.unwrap_or(false))
        .collect();
    
    let harassment_count = harassment_messages.len();
    let harassment_rate = if total_messages > 0 {
        (harassment_count as f32 / total_messages as f32) * 100.0
    } else {
        0.0
    };
    
    // Calculate average severity
    let avg_severity = if harassment_count > 0 {
        harassment_messages.iter()
            .map(|m| m.severity.unwrap_or(0) as f32)
            .sum::<f32>() / harassment_count as f32
    } else {
        0.0
    };
    
    // Count unique users
    let unique_users: std::collections::HashSet<_> = messages.iter()
        .map(|m| &m.user_id)
        .collect();
    
    // Count messages per hour
    let mut hourly_distribution = vec![0; 24];
    for message in messages {
        let hour = message.timestamp.hour() as usize;
        if hour < 24 {
            hourly_distribution[hour] += 1;
        }
    }
    
    // Find most active users
    let mut user_message_count: HashMap<String, usize> = HashMap::new();
    for message in messages {
        *user_message_count.entry(message.username.clone()).or_insert(0) += 1;
    }
    
    let mut top_users: Vec<_> = user_message_count.into_iter().collect();
    top_users.sort_by(|a, b| b.1.cmp(&a.1));
    top_users.truncate(10);
    
    serde_json::json!({
        "total_messages": total_messages,
        "harassment_detected": harassment_count,
        "harassment_rate": format!("{:.1}%", harassment_rate),
        "average_severity": format!("{:.1}", avg_severity),
        "unique_users": unique_users.len(),
        "hourly_distribution": hourly_distribution,
        "top_users": top_users.into_iter().map(|(username, count)| {
            serde_json::json!({
                "username": username,
                "message_count": count
            })
        }).collect::<Vec<_>>(),
        "peak_hour": {
            let (peak_hour, peak_count) = hourly_distribution.iter()
                .enumerate()
                .max_by_key(|(_, &count)| count)
                .unwrap_or((0, &0));
            serde_json::json!({
                "hour": peak_hour,
                "message_count": peak_count
            })
        }
    })
}

// Format duration in human readable format
pub fn format_duration(seconds: u64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    let secs = seconds % 60;
    
    if hours > 0 {
        format!("{}h {}m {}s", hours, minutes, secs)
    } else if minutes > 0 {
        format!("{}m {}s", minutes, secs)
    } else {
        format!("{}s", secs)
    }
}

// Format large numbers with K, M suffixes
pub fn format_number(num: u64) -> String {
    if num >= 1_000_000 {
        format!("{:.1}M", num as f64 / 1_000_000.0)
    } else if num >= 1_000 {
        format!("{:.1}K", num as f64 / 1_000.0)
    } else {
        num.to_string()
    }
}

// Validate streamer ID format
pub fn validate_streamer_id(platform: &str, streamer_id: &str) -> Result<(), String> {
    if streamer_id.is_empty() {
        return Err("Streamer ID cannot be empty".to_string());
    }
    
    if streamer_id.len() > 50 {
        return Err("Streamer ID too long (max 50 characters)".to_string());
    }
    
    match platform {
        "tiktok" => {
            if !streamer_id.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '.') {
                return Err("TikTok username can only contain letters, numbers, underscores, and dots".to_string());
            }
        }
        "youtube" => {
            if streamer_id.starts_with("UC") && streamer_id.len() == 24 {
                // Channel ID format
            } else if streamer_id.starts_with('@') {
                // Handle format
            } else if streamer_id.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
                // Username format
            } else {
                return Err("Invalid YouTube channel ID or username format".to_string());
            }
        }
        "twitch" => {
            if !streamer_id.chars().all(|c| c.is_alphanumeric() || c == '_') {
                return Err("Twitch username can only contain letters, numbers, and underscores".to_string());
            }
        }
        _ => {
            return Err(format!("Unsupported platform: {}", platform));
        }
    }
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_harassment_detection() {
        let safe_message = "Hello everyone, great stream!";
        let result = analyze_harassment(safe_message);
        assert!(!result.is_harassment);
        assert!(result.confidence > 0.9);

        let harassment_message = "You are so stupid and ugly";
        let result = analyze_harassment(harassment_message);
        assert!(result.is_harassment);
        assert_eq!(result.category, "insults");
        assert!(result.severity >= 5);
    }

    #[test]
    fn test_extract_mentions() {
        let text = "Hey @user1 and @user_2, check this out!";
        let mentions = extract_mentions(text);
        assert_eq!(mentions, vec!["user1", "user_2"]);
    }

    #[test]
    fn test_extract_hashtags() {
        let text = "This is #awesome and #cool_stuff!";
        let hashtags = extract_hashtags(text);
        assert_eq!(hashtags, vec!["awesome", "cool_stuff"]);
    }

    #[test]
    fn test_validate_streamer_id() {
        assert!(validate_streamer_id("tiktok", "valid_user").is_ok());
        assert!(validate_streamer_id("tiktok", "").is_err());
        assert!(validate_streamer_id("tiktok", "invalid@user").is_err());
        
        assert!(validate_streamer_id("youtube", "UCabcdefghijklmnopqrstuvw").is_ok());
        assert!(validate_streamer_id("twitch", "valid_user").is_ok());
    }

    #[test]
    fn test_format_number() {
        assert_eq!(format_number(500), "500");
        assert_eq!(format_number(1500), "1.5K");
        assert_eq!(format_number(1500000), "1.5M");
    }
}