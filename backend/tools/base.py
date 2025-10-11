# Update base.py to include new categories
from enum import Enum

class ToolCategory(Enum):
    EMAIL = "email"
    SOCIAL = "social"
    NETWORK = "network"
    DARKNET = "darknet"  # NEW
    BREACH = "breach"    # NEW
    CRYPTO = "crypto"    # NEW
    PHONE = "phone"
    DOMAIN = "domain"
    IMAGE = "image"
    GENERAL = "general"