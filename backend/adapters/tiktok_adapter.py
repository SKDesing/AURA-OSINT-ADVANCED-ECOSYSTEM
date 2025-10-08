"""
AURA OSINT - TikTok Platform Adapter
Implémentation spécifique pour TikTok
"""

from typing import Dict, Any
from datetime import datetime
from .platform_adapter import PlatformAdapter, Post, Author

class TikTokAdapter(PlatformAdapter):
    """Adaptateur pour la plateforme TikTok"""
    
    def parse_post(self, raw_data: Dict[str, Any]) -> Post:
        """Parse les données TikTok vers format universel"""
        return Post(
            id=raw_data.get('aweme_id', raw_data.get('id', 'unknown')),
            content=raw_data.get('desc', raw_data.get('content', '')),
            author=raw_data.get('author', {}).get('unique_id', 'unknown'),
            timestamp=datetime.fromtimestamp(
                int(raw_data.get('create_time', raw_data.get('timestamp', 0)))
            ),
            platform='tiktok',
            url=self._build_tiktok_url(raw_data),
            content_type=self._detect_tiktok_content_type(raw_data),
            metadata={
                'likes': raw_data.get('statistics', {}).get('digg_count', 0),
                'shares': raw_data.get('statistics', {}).get('share_count', 0),
                'comments': raw_data.get('statistics', {}).get('comment_count', 0),
                'views': raw_data.get('statistics', {}).get('play_count', 0)
            }
        )
    
    def get_author_info(self, author_id: str) -> Author:
        """Récupère les infos auteur TikTok"""
        # Implémentation basique - à enrichir avec API TikTok
        return Author(
            id=author_id,
            username=author_id,
            display_name=author_id,
            platform='tiktok'
        )
    
    def detect_content_type(self, post: Post) -> str:
        """Détecte le type de contenu TikTok"""
        if post.metadata and 'video' in str(post.metadata):
            return 'video'
        return 'text'
    
    def validate_data(self, raw_data: Dict[str, Any]) -> bool:
        """Valide les données TikTok"""
        required_fields = ['content', 'author', 'timestamp']
        return all(field in raw_data for field in required_fields)
    
    def _build_tiktok_url(self, raw_data: Dict[str, Any]) -> str:
        """Construit l'URL TikTok"""
        author = raw_data.get('author', {}).get('unique_id', 'unknown')
        video_id = raw_data.get('aweme_id', raw_data.get('id', 'unknown'))
        return f"https://tiktok.com/@{author}/video/{video_id}"
    
    def _detect_tiktok_content_type(self, raw_data: Dict[str, Any]) -> str:
        """Détecte le type de contenu spécifique TikTok"""
        if 'video' in raw_data:
            return 'video'
        elif 'images' in raw_data:
            return 'image_carousel'
        return 'text'