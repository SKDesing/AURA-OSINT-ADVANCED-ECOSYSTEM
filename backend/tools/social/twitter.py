import asyncio
import json
import re
from typing import Dict, Any, List
from datetime import datetime, timedelta
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class TwitterTool(BaseTool):
    """
    Twitter OSINT analysis using ntscraper
    Extracts: profile info, tweets, followers, network analysis
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.SOCIAL
        self.required_inputs = ['username']
        self.max_execution_time = 120
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        username = inputs.get('username', '').strip('@')
        return bool(username and re.match(r'^[A-Za-z0-9_]{1,15}$', username))
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        username = inputs['username'].strip('@')
        
        try:
            # Get profile info
            profile_data = await self._get_profile(username)
            
            # Get recent tweets
            tweets_data = await self._get_tweets(username, limit=50)
            
            # Analyze network
            network_data = await self._analyze_network(tweets_data)
            
            # Generate intelligence summary
            intelligence = self._generate_intelligence(profile_data, tweets_data, network_data)
            
            parsed_data = {
                "username": username,
                "profile": profile_data,
                "tweets": tweets_data,
                "network_analysis": network_data,
                "intelligence_summary": intelligence,
                "extraction_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.90
            )
            
        except Exception as e:
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.FAILED,
                data={"error": str(e)},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    async def _get_profile(self, username: str) -> Dict[str, Any]:
        """Extract Twitter profile information"""
        cmd = ['python3', '-c', f'''
import asyncio
from ntscraper import Nitter

async def get_profile():
    scraper = Nitter()
    try:
        profile = await scraper.get_profile("{username}")
        print(profile.to_json() if profile else "{{}}")
    except Exception as e:
        print(f'{{"error": "{str(e)}"}}')

asyncio.run(get_profile())
''']
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        try:
            return json.loads(stdout.decode())
        except:
            return {"error": "Failed to parse profile data"}
    
    async def _get_tweets(self, username: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Extract recent tweets"""
        cmd = ['python3', '-c', f'''
import asyncio
from ntscraper import Nitter

async def get_tweets():
    scraper = Nitter()
    try:
        tweets = await scraper.get_tweets("{username}", mode="user", number={limit})
        print([tweet.to_dict() for tweet in tweets] if tweets else "[]")
    except Exception as e:
        print("[]")

asyncio.run(get_tweets())
''']
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        try:
            return json.loads(stdout.decode())
        except:
            return []
    
    async def _analyze_network(self, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze social network from tweets"""
        mentions = []
        hashtags = []
        urls = []
        
        for tweet in tweets:
            text = tweet.get('text', '')
            
            # Extract mentions
            mentions.extend(re.findall(r'@(\w+)', text))
            
            # Extract hashtags
            hashtags.extend(re.findall(r'#(\w+)', text))
            
            # Extract URLs
            urls.extend(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text))
        
        # Count frequencies
        from collections import Counter
        
        return {
            "top_mentions": dict(Counter(mentions).most_common(10)),
            "top_hashtags": dict(Counter(hashtags).most_common(10)),
            "unique_urls": list(set(urls)),
            "network_size": {
                "mentions": len(set(mentions)),
                "hashtags": len(set(hashtags)),
                "urls": len(set(urls))
            }
        }
    
    def _generate_intelligence(self, profile: Dict, tweets: List[Dict], network: Dict) -> Dict[str, Any]:
        """Generate intelligence summary"""
        
        # Profile analysis
        profile_risk = "LOW"
        if profile.get('followers_count', 0) > 100000:
            profile_risk = "HIGH"
        elif profile.get('followers_count', 0) > 10000:
            profile_risk = "MEDIUM"
        
        # Activity analysis
        recent_tweets = len([t for t in tweets if self._is_recent(t.get('date', ''))])
        activity_level = "HIGH" if recent_tweets > 10 else "MEDIUM" if recent_tweets > 3 else "LOW"
        
        # Sentiment analysis (basic)
        negative_words = ['hate', 'angry', 'terrible', 'awful', 'bad']
        positive_words = ['love', 'great', 'awesome', 'amazing', 'good']
        
        sentiment_score = 0
        for tweet in tweets:
            text = tweet.get('text', '').lower()
            sentiment_score += sum(1 for word in positive_words if word in text)
            sentiment_score -= sum(1 for word in negative_words if word in text)
        
        sentiment = "POSITIVE" if sentiment_score > 5 else "NEGATIVE" if sentiment_score < -5 else "NEUTRAL"
        
        return {
            "profile_risk_level": profile_risk,
            "activity_level": activity_level,
            "sentiment_analysis": sentiment,
            "influence_score": min(100, (profile.get('followers_count', 0) / 1000) + len(network.get('top_mentions', {}))),
            "verification_status": profile.get('verified', False),
            "account_age_days": self._calculate_account_age(profile.get('joined', '')),
            "potential_bot_indicators": self._detect_bot_indicators(profile, tweets),
            "privacy_concerns": self._assess_privacy(profile, tweets)
        }
    
    def _is_recent(self, date_str: str) -> bool:
        """Check if date is within last 7 days"""
        try:
            tweet_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
            return (datetime.now() - tweet_date).days <= 7
        except:
            return False
    
    def _calculate_account_age(self, joined_date: str) -> int:
        """Calculate account age in days"""
        try:
            joined = datetime.strptime(joined_date, '%Y-%m-%d')
            return (datetime.now() - joined).days
        except:
            return 0
    
    def _detect_bot_indicators(self, profile: Dict, tweets: List[Dict]) -> List[str]:
        """Detect potential bot indicators"""
        indicators = []
        
        # High tweet frequency
        if len(tweets) > 30:  # 30+ tweets in recent data
            indicators.append("HIGH_TWEET_FREQUENCY")
        
        # Low follower/following ratio
        followers = profile.get('followers_count', 0)
        following = profile.get('following_count', 0)
        if following > 0 and followers / following < 0.1:
            indicators.append("LOW_FOLLOWER_RATIO")
        
        # Default profile picture
        if 'default' in profile.get('avatar', '').lower():
            indicators.append("DEFAULT_AVATAR")
        
        # Repetitive content
        tweet_texts = [t.get('text', '') for t in tweets]
        if len(set(tweet_texts)) < len(tweet_texts) * 0.7:
            indicators.append("REPETITIVE_CONTENT")
        
        return indicators
    
    def _assess_privacy(self, profile: Dict, tweets: List[Dict]) -> Dict[str, Any]:
        """Assess privacy exposure"""
        
        # Location exposure
        location_exposed = bool(profile.get('location'))
        
        # Personal info in tweets
        personal_patterns = [
            r'\b\d{3}-\d{3}-\d{4}\b',  # Phone numbers
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Emails
            r'\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr)\b'  # Addresses
        ]
        
        personal_info_exposed = False
        for tweet in tweets:
            text = tweet.get('text', '')
            if any(re.search(pattern, text, re.IGNORECASE) for pattern in personal_patterns):
                personal_info_exposed = True
                break
        
        return {
            "location_exposed": location_exposed,
            "personal_info_in_tweets": personal_info_exposed,
            "account_protected": profile.get('protected', False),
            "privacy_risk_level": "HIGH" if (location_exposed and personal_info_exposed) else "MEDIUM" if (location_exposed or personal_info_exposed) else "LOW"
        }