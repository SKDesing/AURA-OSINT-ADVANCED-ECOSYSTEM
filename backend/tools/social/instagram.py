import asyncio
import json
import re
from typing import Dict, Any, List
from datetime import datetime
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class InstagramTool(BaseTool):
    """
    Instagram OSINT analysis using instaloader
    Extracts: profile info, posts, followers, hashtags analysis
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.SOCIAL
        self.required_inputs = ['username']
        self.max_execution_time = 180
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        username = inputs.get('username', '').strip('@')
        return bool(username and re.match(r'^[A-Za-z0-9_.]{1,30}$', username))
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        username = inputs['username'].strip('@')
        
        try:
            # Get profile info
            profile_data = await self._get_profile(username)
            
            # Get recent posts
            posts_data = await self._get_posts(username, limit=20)
            
            # Analyze content
            content_analysis = self._analyze_content(posts_data)
            
            # Generate intelligence
            intelligence = self._generate_intelligence(profile_data, posts_data, content_analysis)
            
            parsed_data = {
                "username": username,
                "profile": profile_data,
                "posts": posts_data,
                "content_analysis": content_analysis,
                "intelligence_summary": intelligence,
                "extraction_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.85
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
        """Extract Instagram profile information"""
        cmd = ['python3', '-c', f'''
import instaloader
import json

L = instaloader.Instaloader()
try:
    profile = instaloader.Profile.from_username(L.context, "{username}")
    data = {{
        "username": profile.username,
        "full_name": profile.full_name,
        "biography": profile.biography,
        "followers": profile.followers,
        "followees": profile.followees,
        "posts_count": profile.mediacount,
        "is_verified": profile.is_verified,
        "is_private": profile.is_private,
        "is_business": profile.is_business_account,
        "external_url": profile.external_url,
        "profile_pic_url": profile.profile_pic_url
    }}
    print(json.dumps(data))
except Exception as e:
    print(json.dumps({{"error": str(e)}}))
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
    
    async def _get_posts(self, username: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Extract recent posts"""
        cmd = ['python3', '-c', f'''
import instaloader
import json
from datetime import datetime

L = instaloader.Instaloader()
try:
    profile = instaloader.Profile.from_username(L.context, "{username}")
    posts = []
    
    for post in profile.get_posts():
        if len(posts) >= {limit}:
            break
            
        post_data = {{
            "shortcode": post.shortcode,
            "caption": post.caption,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date_utc.isoformat(),
            "is_video": post.is_video,
            "url": f"https://instagram.com/p/{{post.shortcode}}/",
            "hashtags": list(post.caption_hashtags) if post.caption_hashtags else [],
            "mentions": list(post.caption_mentions) if post.caption_mentions else []
        }}
        posts.append(post_data)
    
    print(json.dumps(posts))
except Exception as e:
    print("[]")
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
    
    def _analyze_content(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze Instagram content patterns"""
        
        if not posts:
            return {"error": "No posts to analyze"}
        
        # Hashtag analysis
        all_hashtags = []
        all_mentions = []
        total_likes = 0
        total_comments = 0
        video_count = 0
        
        for post in posts:
            all_hashtags.extend(post.get('hashtags', []))
            all_mentions.extend(post.get('mentions', []))
            total_likes += post.get('likes', 0)
            total_comments += post.get('comments', 0)
            if post.get('is_video', False):
                video_count += 1
        
        from collections import Counter
        
        # Engagement analysis
        avg_likes = total_likes / len(posts) if posts else 0
        avg_comments = total_comments / len(posts) if posts else 0
        engagement_rate = (avg_likes + avg_comments) / 1000  # Simplified calculation
        
        # Content type analysis
        content_types = {
            "photos": len(posts) - video_count,
            "videos": video_count,
            "video_percentage": (video_count / len(posts)) * 100 if posts else 0
        }
        
        # Posting frequency
        post_dates = [datetime.fromisoformat(p['date'].replace('Z', '+00:00')) for p in posts if p.get('date')]
        if len(post_dates) > 1:
            date_diffs = [(post_dates[i] - post_dates[i+1]).days for i in range(len(post_dates)-1)]
            avg_posting_frequency = sum(date_diffs) / len(date_diffs) if date_diffs else 0
        else:
            avg_posting_frequency = 0
        
        return {
            "top_hashtags": dict(Counter(all_hashtags).most_common(10)),
            "top_mentions": dict(Counter(all_mentions).most_common(10)),
            "engagement_metrics": {
                "average_likes": avg_likes,
                "average_comments": avg_comments,
                "engagement_rate": engagement_rate,
                "total_engagement": total_likes + total_comments
            },
            "content_analysis": content_types,
            "posting_patterns": {
                "average_days_between_posts": avg_posting_frequency,
                "total_posts_analyzed": len(posts)
            },
            "network_size": {
                "unique_hashtags": len(set(all_hashtags)),
                "unique_mentions": len(set(all_mentions))
            }
        }
    
    def _generate_intelligence(self, profile: Dict, posts: List[Dict], content: Dict) -> Dict[str, Any]:
        """Generate intelligence summary"""
        
        # Influence assessment
        followers = profile.get('followers', 0)
        if followers > 1000000:
            influence_level = "CELEBRITY"
        elif followers > 100000:
            influence_level = "INFLUENCER"
        elif followers > 10000:
            influence_level = "MICRO_INFLUENCER"
        else:
            influence_level = "REGULAR_USER"
        
        # Account authenticity
        authenticity_score = 100
        if profile.get('is_private', False):
            authenticity_score -= 10
        if not profile.get('is_verified', False) and followers > 100000:
            authenticity_score -= 20
        if profile.get('posts_count', 0) < 10:
            authenticity_score -= 30
        
        # Privacy assessment
        privacy_risks = []
        if not profile.get('is_private', False):
            privacy_risks.append("PUBLIC_ACCOUNT")
        if profile.get('external_url'):
            privacy_risks.append("EXTERNAL_LINK_EXPOSED")
        
        # Location analysis from posts
        location_mentions = []
        for post in posts:
            caption = post.get('caption', '') or ''
            # Simple location detection
            location_patterns = [
                r'\b(at|in|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b',
                r'#([A-Z][a-z]+(?:[A-Z][a-z]+)*)'
            ]
            for pattern in location_patterns:
                matches = re.findall(pattern, caption)
                location_mentions.extend([m[1] if isinstance(m, tuple) else m for m in matches])
        
        # Business analysis
        business_indicators = []
        if profile.get('is_business', False):
            business_indicators.append("BUSINESS_ACCOUNT")
        if profile.get('external_url'):
            business_indicators.append("EXTERNAL_WEBSITE")
        
        bio = profile.get('biography', '') or ''
        business_keywords = ['shop', 'buy', 'sale', 'contact', 'email', 'dm', 'business']
        if any(keyword in bio.lower() for keyword in business_keywords):
            business_indicators.append("COMMERCIAL_CONTENT")
        
        return {
            "influence_level": influence_level,
            "authenticity_score": max(0, authenticity_score),
            "privacy_risk_assessment": {
                "risk_level": "HIGH" if len(privacy_risks) > 1 else "MEDIUM" if privacy_risks else "LOW",
                "identified_risks": privacy_risks
            },
            "business_analysis": {
                "is_commercial": len(business_indicators) > 0,
                "business_indicators": business_indicators
            },
            "geographic_intelligence": {
                "potential_locations": list(set(location_mentions[:10])),
                "location_exposure_level": "HIGH" if len(location_mentions) > 5 else "MEDIUM" if location_mentions else "LOW"
            },
            "engagement_quality": {
                "engagement_rate": content.get('engagement_metrics', {}).get('engagement_rate', 0),
                "follower_engagement_ratio": (content.get('engagement_metrics', {}).get('average_likes', 0) / max(followers, 1)) * 100
            },
            "content_strategy": {
                "posting_consistency": "HIGH" if content.get('posting_patterns', {}).get('average_days_between_posts', 0) < 3 else "LOW",
                "content_diversity": "HIGH" if content.get('content_analysis', {}).get('video_percentage', 0) > 20 else "LOW"
            }
        }