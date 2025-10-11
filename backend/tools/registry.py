# Complete tool registry with all categories
from tools.email.holehe import HoleheTool
from tools.social.twitter import TwitterTool
from tools.social.instagram import InstagramTool
from tools.network.shodan import ShodanTool
from tools.darknet.onionscan import OnionScanTool
from tools.darknet.torbot import TorBotTool
from tools.breach.h8mail import H8MailTool
from tools.crypto.blockchain import BlockchainTool
from tools.phone.phonenumbers import PhoneNumbersTool
from tools.domain.whois import WhoisTool
from tools.username.sherlock import SherlockTool
from tools.username.maigret import MaigretTool
from tools.domain.subfinder import SubfinderTool
from tools.phone.phoneinfoga import PhoneInfogaTool
from tools.image.exifread import ExifReadTool

# Complete tool registry
AVAILABLE_TOOLS = {
    'holehe': HoleheTool,
    'twitter': TwitterTool,
    'instagram': InstagramTool,
    'shodan': ShodanTool,
    'onionscan': OnionScanTool,
    'torbot': TorBotTool,
    'h8mail': H8MailTool,
    'blockchain': BlockchainTool,
    'phonenumbers': PhoneNumbersTool,
    'whois': WhoisTool,
    'sherlock': SherlockTool,
    'maigret': MaigretTool,
    'subfinder': SubfinderTool,
    'phoneinfoga': PhoneInfogaTool,
    'exifread': ExifReadTool,
}

# Tool configurations with darknet layer
TOOL_CONFIGS = {
    'holehe': {
        'category': 'email',
        'priority': 1,
        'conditions': ['email'],
        'description': 'Check if email is registered on 120+ sites'
    },
    'h8mail': {
        'category': 'breach',
        'priority': 1,
        'conditions': ['email'],
        'description': 'Search email in data breaches and leaks'
    },
    'twitter': {
        'category': 'social',
        'priority': 2,
        'conditions': ['username'],
        'description': 'Twitter profile and network analysis'
    },
    'instagram': {
        'category': 'social',
        'priority': 2,
        'conditions': ['username'],
        'description': 'Instagram profile and content analysis'
    },
    'shodan': {
        'category': 'network',
        'priority': 1,
        'conditions': ['domain', 'ip_address'],
        'description': 'Network reconnaissance and vulnerability scan'
    },
    'onionscan': {
        'category': 'darknet',
        'priority': 1,
        'conditions': ['onion_url'],
        'description': 'Tor hidden service vulnerability scanner'
    },
    'torbot': {
        'category': 'darknet',
        'priority': 2,
        'conditions': ['onion_url'],
        'description': 'Dark web crawler and intelligence extractor'
    },
    'blockchain': {
        'category': 'crypto',
        'priority': 1,
        'conditions': ['bitcoin_address', 'ethereum_address'],
        'description': 'Cryptocurrency address analysis and tracking'
    },
    'phonenumbers': {
        'category': 'phone',
        'priority': 1,
        'conditions': ['phone'],
        'description': 'Phone number validation and carrier lookup'
    },
    'whois': {
        'category': 'domain',
        'priority': 1,
        'conditions': ['domain'],
        'description': 'Domain registration and DNS information'
    },
    'sherlock': {
        'category': 'username',
        'priority': 1,
        'conditions': ['username'],
        'description': 'Search username across 400+ social networks'
    },
    'maigret': {
        'category': 'username',
        'priority': 1,
        'conditions': ['username'],
        'description': 'Advanced username search on 2000+ sites'
    },
    'subfinder': {
        'category': 'domain',
        'priority': 1,
        'conditions': ['domain'],
        'description': 'Passive subdomain enumeration'
    },
    'phoneinfoga': {
        'category': 'phone',
        'priority': 1,
        'conditions': ['phone'],
        'description': 'Advanced phone number OSINT'
    },
    'exifread': {
        'category': 'image',
        'priority': 1,
        'conditions': ['image_path'],
        'description': 'Extract EXIF metadata from images'
    },
}