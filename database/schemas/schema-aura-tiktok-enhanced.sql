-- AURA TikTok Intelligence - Enhanced Database Schema
-- Optimized for high-volume TikTok live data collection

-- Database: aura_tiktok_targets
CREATE DATABASE aura_tiktok_targets;
\c aura_tiktok_targets;

-- TikTok targets (users to monitor)
CREATE TABLE tiktok_targets (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    bio TEXT,
    avatar_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'none',
    account_type VARCHAR(20) DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    priority_level INTEGER DEFAULT 1,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    last_live_at TIMESTAMP,
    total_lives_monitored INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_tiktok_targets_username ON tiktok_targets(username);
CREATE INDEX idx_tiktok_targets_status ON tiktok_targets(status);
CREATE INDEX idx_tiktok_targets_priority ON tiktok_targets(priority_level DESC);
CREATE INDEX idx_tiktok_targets_last_live ON tiktok_targets(last_live_at DESC);

-- Database: aura_tiktok_streams  
CREATE DATABASE aura_tiktok_streams;
\c aura_tiktok_streams;

-- Live sessions
CREATE TABLE live_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    target_id BIGINT NOT NULL,
    target_username VARCHAR(50) NOT NULL,
    title TEXT,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    viewer_count_max INTEGER DEFAULT 0,
    viewer_count_avg INTEGER DEFAULT 0,
    viewer_count_samples JSONB DEFAULT '[]',
    total_messages BIGINT DEFAULT 0,
    total_gifts BIGINT DEFAULT 0,
    total_likes BIGINT DEFAULT 0,
    total_shares BIGINT DEFAULT 0,
    unique_chatters INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    stream_quality VARCHAR(20),
    stream_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages (partitioned by month for performance)
CREATE TABLE chat_messages (
    id BIGSERIAL,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(50),
    username VARCHAR(50),
    display_name VARCHAR(100),
    message_text TEXT,
    message_type VARCHAR(20) DEFAULT 'chat',
    timestamp_live TIMESTAMP NOT NULL,
    timestamp_captured TIMESTAMP DEFAULT NOW(),
    user_level INTEGER DEFAULT 0,
    user_badges JSONB DEFAULT '[]',
    is_moderator BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    message_hash VARCHAR(64),
    language_detected VARCHAR(10),
    sentiment_score FLOAT,
    toxicity_score FLOAT,
    PRIMARY KEY (id, timestamp_live)
) PARTITION BY RANGE (timestamp_live);

-- Create monthly partitions
CREATE TABLE chat_messages_2024_10 PARTITION OF chat_messages
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE chat_messages_2024_11 PARTITION OF chat_messages
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE chat_messages_2024_12 PARTITION OF chat_messages
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Gifts and donations
CREATE TABLE live_gifts (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(50),
    username VARCHAR(50),
    gift_name VARCHAR(100),
    gift_id VARCHAR(50),
    gift_value INTEGER DEFAULT 0,
    gift_count INTEGER DEFAULT 1,
    total_coins INTEGER DEFAULT 0,
    timestamp_live TIMESTAMP NOT NULL,
    timestamp_captured TIMESTAMP DEFAULT NOW(),
    gift_metadata JSONB DEFAULT '{}'
);

-- User interactions (likes, follows, shares during live)
CREATE TABLE live_interactions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(50),
    username VARCHAR(50),
    interaction_type VARCHAR(20) NOT NULL, -- 'like', 'follow', 'share'
    timestamp_live TIMESTAMP NOT NULL,
    timestamp_captured TIMESTAMP DEFAULT NOW(),
    interaction_metadata JSONB DEFAULT '{}'
);

-- Viewer analytics
CREATE TABLE viewer_analytics (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    timestamp_captured TIMESTAMP DEFAULT NOW(),
    viewer_count INTEGER NOT NULL,
    new_viewers INTEGER DEFAULT 0,
    returning_viewers INTEGER DEFAULT 0,
    top_countries JSONB DEFAULT '[]',
    age_demographics JSONB DEFAULT '{}',
    gender_demographics JSONB DEFAULT '{}'
);

-- Performance indexes
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_time ON chat_messages(timestamp_live);
CREATE INDEX idx_chat_messages_username ON chat_messages(username);

CREATE INDEX idx_live_gifts_session ON live_gifts(session_id);
CREATE INDEX idx_live_gifts_user ON live_gifts(user_id);
CREATE INDEX idx_live_gifts_value ON live_gifts(total_coins DESC);

CREATE INDEX idx_live_sessions_target ON live_sessions(target_id);
CREATE INDEX idx_live_sessions_started ON live_sessions(started_at DESC);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);

-- Database: aura_tiktok_analytics
CREATE DATABASE aura_tiktok_analytics;
\c aura_tiktok_analytics;

-- Aggregated daily statistics
CREATE TABLE daily_stats (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    target_id BIGINT NOT NULL,
    target_username VARCHAR(50) NOT NULL,
    total_live_time_seconds INTEGER DEFAULT 0,
    total_messages BIGINT DEFAULT 0,
    total_gifts BIGINT DEFAULT 0,
    total_gift_value BIGINT DEFAULT 0,
    unique_chatters INTEGER DEFAULT 0,
    avg_viewer_count INTEGER DEFAULT 0,
    max_viewer_count INTEGER DEFAULT 0,
    engagement_rate FLOAT DEFAULT 0,
    sentiment_avg FLOAT DEFAULT 0,
    toxicity_avg FLOAT DEFAULT 0,
    top_keywords JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date, target_id)
);

-- User behavior patterns
CREATE TABLE user_patterns (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    first_seen TIMESTAMP NOT NULL,
    last_seen TIMESTAMP NOT NULL,
    total_messages BIGINT DEFAULT 0,
    total_gifts_sent BIGINT DEFAULT 0,
    total_gift_value BIGINT DEFAULT 0,
    favorite_streamers JSONB DEFAULT '[]',
    activity_hours JSONB DEFAULT '{}',
    avg_sentiment FLOAT DEFAULT 0,
    avg_toxicity FLOAT DEFAULT 0,
    user_classification VARCHAR(20) DEFAULT 'regular',
    risk_score FLOAT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Trending analysis
CREATE TABLE trending_analysis (
    id BIGSERIAL PRIMARY KEY,
    analysis_date DATE NOT NULL,
    trend_type VARCHAR(20) NOT NULL, -- 'hashtag', 'keyword', 'user', 'topic'
    trend_value VARCHAR(200) NOT NULL,
    mention_count BIGINT DEFAULT 0,
    growth_rate FLOAT DEFAULT 0,
    sentiment_score FLOAT DEFAULT 0,
    related_streamers JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes for analytics
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);
CREATE INDEX idx_daily_stats_target ON daily_stats(target_id);
CREATE INDEX idx_user_patterns_user ON user_patterns(user_id);
CREATE INDEX idx_user_patterns_classification ON user_patterns(user_classification);
CREATE INDEX idx_trending_date_type ON trending_analysis(analysis_date DESC, trend_type);

-- Views for common queries
CREATE VIEW active_streamers AS
SELECT 
    t.username,
    t.display_name,
    t.follower_count,
    COUNT(ls.id) as total_sessions,
    SUM(ls.duration_seconds) as total_stream_time,
    AVG(ls.viewer_count_max) as avg_max_viewers,
    MAX(ls.started_at) as last_stream
FROM tiktok_targets t
LEFT JOIN live_sessions ls ON t.id = ls.target_id
WHERE t.status = 'active'
GROUP BY t.id, t.username, t.display_name, t.follower_count
ORDER BY last_stream DESC;

CREATE VIEW top_chatters AS
SELECT 
    username,
    COUNT(*) as message_count,
    COUNT(DISTINCT session_id) as sessions_participated,
    AVG(sentiment_score) as avg_sentiment,
    MAX(timestamp_live) as last_activity
FROM chat_messages
WHERE timestamp_live >= NOW() - INTERVAL '30 days'
GROUP BY username
ORDER BY message_count DESC
LIMIT 100;