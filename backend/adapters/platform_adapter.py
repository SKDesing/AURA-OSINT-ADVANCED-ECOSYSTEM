"""
AURA OSINT - Platform Adapter Pattern
Architecture abstraite pour multi-plateformes
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Post:
    """Modèle universel pour tous les posts"""
    id: str
    content: str
    author: str
    timestamp: datetime
    platform: str
    url: str
    content_type: str = "text"
    metadata: Dict[str, Any] = None

@dataclass 
class Author:
    """Modèle universel pour les auteurs"""
    id: str
    username: str
    display_name: str
    platform: str
    followers_count: Optional[int] = None
    verified: bool = False

class PlatformAdapter(ABC):
    """Interface abstraite pour tous les adaptateurs de plateforme"""
    
    @abstractmethod
    def parse_post(self, raw_data: Dict[str, Any]) -> Post:
        """Normalise les données plateforme → format universel"""
        pass
    
    @abstractmethod
    def get_author_info(self, author_id: str) -> Author:
        """Récupère les informations auteur"""
        pass
    
    @abstractmethod
    def detect_content_type(self, post: Post) -> str:
        """Détecte le type de contenu (video, image, text, etc.)"""
        pass
    
    @abstractmethod
    def validate_data(self, raw_data: Dict[str, Any]) -> bool:
        """Valide la structure des données reçues"""
        pass
    
    def get_platform_name(self) -> str:
        """Retourne le nom de la plateforme"""
        return self.__class__.__name__.replace('Adapter', '').lower()