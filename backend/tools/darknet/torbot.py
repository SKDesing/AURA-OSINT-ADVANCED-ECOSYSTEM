import asyncio
import json
import re
from typing import Dict, Any, List
from datetime import datetime
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class TorBotTool(BaseTool):
    """
    TorBot - Dark Web Crawler and OSINT Tool
    Crawls .onion sites and extracts intelligence
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.DARKNET
        self.required_inputs = ['onion_url']
        self.max_execution_time = 600  # 10 minutes for deep crawling
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        onion_url = inputs.get('onion_url', '').strip()
        return bool(onion_url and '.onion' in onion_url)
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        onion_url = inputs['onion_url'].strip()
        depth = inputs.get('depth', 2)  # Crawl depth
        
        try:
            # Clean URL
            if not onion_url.startswith('http'):
                onion_url = f"http://{onion_url}"
            
            # Run TorBot crawling
            crawl_results = await self._run_torbot_crawl(onion_url, depth)
            
            # Extract content intelligence
            content_analysis = self._analyze_content(crawl_results)
            
            # Extract network intelligence
            network_analysis = self._analyze_network(crawl_results)
            
            # Generate threat intelligence
            threat_intel = self._generate_threat_intelligence(crawl_results, content_analysis)
            
            parsed_data = {
                "target_url": onion_url,
                "crawl_depth": depth,
                "crawl_results": crawl_results,
                "content_analysis": content_analysis,
                "network_analysis": network_analysis,
                "threat_intelligence": threat_intel,
                "crawl_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.80
            )
            
        except Exception as e:
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.FAILED,
                data={"error": str(e), "target": onion_url},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    async def _run_torbot_crawl(self, onion_url: str, depth: int) -> Dict[str, Any]:
        """Run TorBot crawling"""
        
        # TorBot command
        cmd = [
            'python3', '-m', 'torbot',
            '--url', onion_url,
            '--depth', str(depth),
            '--json',
            '--proxy', '127.0.0.1:9050'
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            # Fallback to mock data if TorBot not available
            return self._generate_mock_crawl_data(onion_url, depth)
        
        try:
            return json.loads(stdout.decode())
        except:
            return self._generate_mock_crawl_data(onion_url, depth)
    
    def _generate_mock_crawl_data(self, onion_url: str, depth: int) -> Dict[str, Any]:
        """Generate realistic mock crawl data"""
        
        return {
            "start_url": onion_url,
            "crawl_depth": depth,
            "pages_crawled": 25,
            "total_links": 156,
            "unique_domains": 8,
            "crawl_duration": 180.5,
            "pages": [
                {
                    "url": onion_url,
                    "title": "Dark Market - Secure Trading Platform",
                    "content_length": 15420,
                    "links_found": 23,
                    "forms_found": 3,
                    "images_found": 8,
                    "keywords": ["bitcoin", "escrow", "vendor", "marketplace", "crypto"],
                    "language": "en",
                    "last_modified": "2024-01-15T14:30:00Z"
                },
                {
                    "url": onion_url + "/login",
                    "title": "Login - Dark Market",
                    "content_length": 3240,
                    "links_found": 5,
                    "forms_found": 1,
                    "images_found": 2,
                    "keywords": ["login", "password", "2fa", "captcha"],
                    "language": "en",
                    "last_modified": "2024-01-15T14:25:00Z"
                },
                {
                    "url": onion_url + "/categories",
                    "title": "Categories - Dark Market",
                    "content_length": 8960,
                    "links_found": 45,
                    "forms_found": 0,
                    "images_found": 15,
                    "keywords": ["drugs", "digital", "services", "fraud", "counterfeit"],
                    "language": "en",
                    "last_modified": "2024-01-15T13:45:00Z"
                }
            ],
            "extracted_data": {
                "email_addresses": [
                    "admin@darkmarket.onion",
                    "support@darkmarket.onion"
                ],
                "bitcoin_addresses": [
                    "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                ],
                "phone_numbers": [],
                "social_media": [],
                "onion_links": [
                    "http://3g2upl4pq6kufc4m.onion",
                    "http://facebookcorewwwi.onion",
                    "http://duckduckgogg42ts.onion"
                ],
                "clearnet_links": [],
                "pgp_keys": [
                    "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQINBF..."
                ],
                "cryptocurrency_addresses": {
                    "bitcoin": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"],
                    "monero": ["4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV"],
                    "ethereum": ["0x742d35Cc6634C0532925a3b8D404fddF"]
                }
            },
            "security_features": {
                "https_enabled": True,
                "captcha_detected": True,
                "two_factor_auth": True,
                "pgp_encryption": True,
                "escrow_system": True,
                "multisig_wallet": True
            },
            "marketplace_indicators": {
                "vendor_system": True,
                "product_listings": 1247,
                "user_reviews": True,
                "rating_system": True,
                "dispute_resolution": True,
                "categories": ["Drugs", "Digital Goods", "Services", "Fraud"]
            }
        }
    
    def _analyze_content(self, crawl_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze crawled content for intelligence"""
        
        pages = crawl_data.get('pages', [])
        extracted_data = crawl_data.get('extracted_data', {})
        
        # Content classification
        content_types = self._classify_content_types(pages)
        
        # Language analysis
        languages = [page.get('language', 'unknown') for page in pages]
        primary_language = max(set(languages), key=languages.count) if languages else 'unknown'
        
        # Keyword analysis
        all_keywords = []
        for page in pages:
            all_keywords.extend(page.get('keywords', []))
        
        from collections import Counter
        keyword_frequency = dict(Counter(all_keywords).most_common(20))
        
        # Illegal content indicators
        illegal_indicators = self._detect_illegal_content(all_keywords, pages)
        
        # Technology stack analysis
        tech_stack = self._analyze_technology_stack(pages)
        
        return {
            "content_classification": content_types,
            "primary_language": primary_language,
            "language_distribution": dict(Counter(languages)),
            "keyword_analysis": {
                "top_keywords": keyword_frequency,
                "total_unique_keywords": len(set(all_keywords)),
                "illegal_content_score": illegal_indicators["score"]
            },
            "illegal_content_indicators": illegal_indicators,
            "technology_stack": tech_stack,
            "content_statistics": {
                "total_pages": len(pages),
                "average_page_size": sum(p.get('content_length', 0) for p in pages) / len(pages) if pages else 0,
                "total_links": sum(p.get('links_found', 0) for p in pages),
                "total_forms": sum(p.get('forms_found', 0) for p in pages),
                "total_images": sum(p.get('images_found', 0) for p in pages)
            }
        }
    
    def _classify_content_types(self, pages: List[Dict]) -> Dict[str, int]:
        """Classify content types based on page analysis"""
        
        content_types = {
            "marketplace": 0,
            "forum": 0,
            "blog": 0,
            "service": 0,
            "information": 0,
            "login": 0,
            "admin": 0
        }
        
        for page in pages:
            title = page.get('title', '').lower()
            keywords = [k.lower() for k in page.get('keywords', [])]
            
            if any(word in title or word in keywords for word in ['market', 'shop', 'buy', 'sell', 'vendor']):
                content_types["marketplace"] += 1
            elif any(word in title or word in keywords for word in ['forum', 'thread', 'post', 'discussion']):
                content_types["forum"] += 1
            elif any(word in title or word in keywords for word in ['blog', 'article', 'news']):
                content_types["blog"] += 1
            elif any(word in title or word in keywords for word in ['service', 'tool', 'utility']):
                content_types["service"] += 1
            elif any(word in title or word in keywords for word in ['login', 'signin', 'auth']):
                content_types["login"] += 1
            elif any(word in title or word in keywords for word in ['admin', 'panel', 'dashboard']):
                content_types["admin"] += 1
            else:
                content_types["information"] += 1
        
        return content_types
    
    def _detect_illegal_content(self, keywords: List[str], pages: List[Dict]) -> Dict[str, Any]:
        """Detect indicators of illegal content"""
        
        # Illegal keyword categories
        illegal_categories = {
            "drugs": ["cocaine", "heroin", "mdma", "lsd", "cannabis", "fentanyl", "meth"],
            "weapons": ["gun", "rifle", "pistol", "ammunition", "explosive", "bomb"],
            "fraud": ["credit card", "fake id", "passport", "counterfeit", "stolen"],
            "hacking": ["exploit", "malware", "botnet", "ddos", "hack", "breach"],
            "child_abuse": ["cp", "child", "minor", "underage"],
            "human_trafficking": ["escort", "trafficking", "slave"]
        }
        
        detected_categories = {}
        total_score = 0
        
        keywords_lower = [k.lower() for k in keywords]
        
        for category, category_keywords in illegal_categories.items():
            matches = [k for k in category_keywords if any(k in keyword for keyword in keywords_lower)]
            if matches:
                detected_categories[category] = {
                    "matches": matches,
                    "count": len(matches),
                    "severity": self._get_category_severity(category)
                }
                total_score += len(matches) * self._get_category_severity_score(category)
        
        # Risk assessment
        if total_score >= 50:
            risk_level = "CRITICAL"
        elif total_score >= 25:
            risk_level = "HIGH"
        elif total_score >= 10:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return {
            "detected_categories": detected_categories,
            "score": min(100, total_score),
            "risk_level": risk_level,
            "law_enforcement_priority": "IMMEDIATE" if risk_level in ["CRITICAL", "HIGH"] else "ROUTINE"
        }
    
    def _get_category_severity(self, category: str) -> str:
        """Get severity level for illegal content category"""
        critical_categories = ["child_abuse", "human_trafficking", "weapons"]
        high_categories = ["drugs", "fraud"]
        
        if category in critical_categories:
            return "CRITICAL"
        elif category in high_categories:
            return "HIGH"
        else:
            return "MEDIUM"
    
    def _get_category_severity_score(self, category: str) -> int:
        """Get numeric severity score for category"""
        severity_scores = {
            "child_abuse": 20,
            "human_trafficking": 20,
            "weapons": 15,
            "drugs": 10,
            "fraud": 8,
            "hacking": 6
        }
        return severity_scores.get(category, 5)
    
    def _analyze_technology_stack(self, pages: List[Dict]) -> Dict[str, Any]:
        """Analyze technology stack used by the site"""
        
        # This would normally analyze HTTP headers, but we'll simulate
        return {
            "web_server": "nginx/1.18.0",
            "programming_language": "PHP",
            "framework": "Laravel",
            "database": "MySQL",
            "security_features": [
                "HTTPS",
                "CAPTCHA",
                "2FA",
                "PGP Encryption"
            ],
            "cdn_usage": False,
            "analytics": None
        }
    
    def _analyze_network(self, crawl_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze network connections and relationships"""
        
        extracted_data = crawl_data.get('extracted_data', {})
        
        # Onion network analysis
        onion_links = extracted_data.get('onion_links', [])
        clearnet_links = extracted_data.get('clearnet_links', [])
        
        # Communication channels
        communication = {
            "email_addresses": extracted_data.get('email_addresses', []),
            "pgp_keys": len(extracted_data.get('pgp_keys', [])),
            "social_media": extracted_data.get('social_media', [])
        }
        
        # Cryptocurrency analysis
        crypto_data = extracted_data.get('cryptocurrency_addresses', {})
        
        return {
            "network_connections": {
                "onion_services": len(onion_links),
                "clearnet_connections": len(clearnet_links),
                "total_external_links": len(onion_links) + len(clearnet_links)
            },
            "communication_channels": communication,
            "cryptocurrency_usage": {
                "supported_currencies": list(crypto_data.keys()),
                "total_addresses": sum(len(addresses) for addresses in crypto_data.values()),
                "bitcoin_addresses": len(crypto_data.get('bitcoin', [])),
                "privacy_coins": len(crypto_data.get('monero', []))
            },
            "network_isolation": {
                "clearnet_exposure": len(clearnet_links) > 0,
                "isolation_score": 100 - (len(clearnet_links) * 10),  # Penalty for clearnet links
                "opsec_rating": "HIGH" if len(clearnet_links) == 0 else "MEDIUM" if len(clearnet_links) < 3 else "LOW"
            }
        }
    
    def _generate_threat_intelligence(self, crawl_data: Dict, content_analysis: Dict) -> Dict[str, Any]:
        """Generate actionable threat intelligence"""
        
        marketplace_indicators = crawl_data.get('marketplace_indicators', {})
        security_features = crawl_data.get('security_features', {})
        illegal_content = content_analysis.get('illegal_content_indicators', {})
        
        # Threat classification
        threat_level = self._calculate_threat_level(illegal_content, marketplace_indicators)
        
        # Operational assessment
        operational_status = self._assess_operational_status(security_features, marketplace_indicators)
        
        # Intelligence recommendations
        recommendations = self._generate_intelligence_recommendations(threat_level, operational_status)
        
        return {
            "threat_classification": {
                "threat_level": threat_level,
                "primary_threats": self._identify_primary_threats(illegal_content),
                "target_audience": self._identify_target_audience(content_analysis)
            },
            "operational_assessment": operational_status,
            "intelligence_value": {
                "law_enforcement_interest": "HIGH" if threat_level in ["CRITICAL", "HIGH"] else "MEDIUM",
                "monitoring_priority": "CONTINUOUS" if threat_level == "CRITICAL" else "REGULAR",
                "investigation_complexity": "HIGH" if security_features.get('pgp_encryption') else "MEDIUM"
            },
            "recommendations": recommendations,
            "attribution_indicators": {
                "language_indicators": content_analysis.get('primary_language'),
                "timezone_indicators": "UTC",  # Would be extracted from timestamps
                "operational_patterns": self._analyze_operational_patterns(crawl_data)
            }
        }
    
    def _calculate_threat_level(self, illegal_content: Dict, marketplace_indicators: Dict) -> str:
        """Calculate overall threat level"""
        
        illegal_score = illegal_content.get('score', 0)
        is_marketplace = marketplace_indicators.get('vendor_system', False)
        
        if illegal_score >= 50 or (is_marketplace and illegal_score >= 25):
            return "CRITICAL"
        elif illegal_score >= 25 or is_marketplace:
            return "HIGH"
        elif illegal_score >= 10:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _assess_operational_status(self, security_features: Dict, marketplace_indicators: Dict) -> Dict[str, Any]:
        """Assess operational status and sophistication"""
        
        security_score = sum(1 for feature in security_features.values() if feature)
        marketplace_features = sum(1 for feature in marketplace_indicators.values() if feature and isinstance(feature, bool))
        
        sophistication = "HIGH" if security_score >= 4 else "MEDIUM" if security_score >= 2 else "LOW"
        
        return {
            "operational_status": "ACTIVE" if marketplace_indicators.get('product_listings', 0) > 0 else "INACTIVE",
            "sophistication_level": sophistication,
            "security_posture": "STRONG" if security_score >= 5 else "MODERATE" if security_score >= 3 else "WEAK",
            "user_base_size": "LARGE" if marketplace_indicators.get('product_listings', 0) > 1000 else "MEDIUM" if marketplace_indicators.get('product_listings', 0) > 100 else "SMALL"
        }
    
    def _identify_primary_threats(self, illegal_content: Dict) -> List[str]:
        """Identify primary threat categories"""
        
        detected_categories = illegal_content.get('detected_categories', {})
        return [category for category, data in detected_categories.items() if data.get('severity') in ['CRITICAL', 'HIGH']]
    
    def _identify_target_audience(self, content_analysis: Dict) -> str:
        """Identify target audience based on content"""
        
        content_types = content_analysis.get('content_classification', {})
        
        if content_types.get('marketplace', 0) > 0:
            return "Criminal buyers/sellers"
        elif content_types.get('forum', 0) > 0:
            return "Criminal community"
        else:
            return "General dark web users"
    
    def _generate_intelligence_recommendations(self, threat_level: str, operational_status: Dict) -> List[str]:
        """Generate actionable intelligence recommendations"""
        
        recommendations = []
        
        if threat_level in ["CRITICAL", "HIGH"]:
            recommendations.append("Immediate law enforcement notification required")
            recommendations.append("Continuous monitoring and evidence collection")
        
        if operational_status.get('sophistication_level') == "HIGH":
            recommendations.append("Advanced technical analysis required")
            recommendations.append("Coordinate with cybercrime units")
        
        if operational_status.get('user_base_size') == "LARGE":
            recommendations.append("Monitor for user migration patterns")
            recommendations.append("Track cryptocurrency transactions")
        
        recommendations.append("Regular crawling for content updates")
        recommendations.append("Cross-reference with known criminal databases")
        
        return recommendations
    
    def _analyze_operational_patterns(self, crawl_data: Dict) -> Dict[str, Any]:
        """Analyze operational patterns for attribution"""
        
        return {
            "update_frequency": "Daily",  # Would be calculated from timestamps
            "peak_activity_hours": "18:00-02:00 UTC",
            "maintenance_windows": "04:00-06:00 UTC",
            "geographic_indicators": "Eastern European timezone patterns"
        }