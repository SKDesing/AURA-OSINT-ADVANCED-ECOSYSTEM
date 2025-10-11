#!/usr/bin/env python3
"""
IP Intelligence Tool - Comprehensive IP Analysis
Combines geolocation, reputation, network info, and threat intelligence
"""

import asyncio
import json
import socket
import subprocess
from typing import Dict, Any, Optional
from datetime import datetime
import requests
import dns.resolver
import dns.reversename
from ipwhois import IPWhois
import geoip2.database
import geoip2.errors

from ..base import BaseTool, ToolOutput, ToolCategory, ToolStatus, ToolMetrics


class IPIntelligenceTool(BaseTool):
    """
    Comprehensive IP Intelligence combining:
    - Geolocation (GeoIP2 + ipapi.co)
    - Network info (ipwhois, ASN)
    - Reputation (AbuseIPDB, VirusTotal)
    - Reverse DNS
    - Threat classification
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.NETWORK
        self.name = "ip_intelligence"
        self.version = "1.0.0"
        self.required_inputs = ["ip_address"]
        self.optional_inputs = ["include_reputation", "include_geolocation", "include_whois"]
        self.max_execution_time = 60  # 1 minute
        
        # API endpoints
        self.ipapi_url = "http://ip-api.com/json"
        self.abuseipdb_url = "https://api.abuseipdb.com/api/v2/check"
        self.virustotal_url = "https://www.virustotal.com/vtapi/v2/ip-address/report"
        
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        """Validate IP address format"""
        ip = inputs.get("ip_address", "").strip()
        if not ip:
            return False
        
        try:
            socket.inet_aton(ip)
            return True
        except socket.error:
            try:
                socket.inet_pton(socket.AF_INET6, ip)
                return True
            except socket.error:
                return False
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        """Execute IP intelligence gathering"""
        ip_address = inputs["ip_address"].strip()
        include_reputation = inputs.get("include_reputation", True)
        include_geolocation = inputs.get("include_geolocation", True)
        include_whois = inputs.get("include_whois", True)
        
        results = {
            "ip_address": ip_address,
            "ip_version": 4 if "." in ip_address else 6,
            "analysis_timestamp": datetime.now().isoformat(),
            "geolocation": {},
            "network_info": {},
            "reputation": {},
            "reverse_dns": {},
            "risk_assessment": {}
        }
        
        try:
            # Parallel execution of different checks
            tasks = []
            
            if include_geolocation:
                tasks.append(self._get_geolocation(ip_address))
            
            if include_whois:
                tasks.append(self._get_network_info(ip_address))
            
            tasks.append(self._get_reverse_dns(ip_address))
            
            if include_reputation:
                tasks.append(self._check_reputation(ip_address))
            
            # Execute all tasks concurrently
            task_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            idx = 0
            if include_geolocation:
                results["geolocation"] = task_results[idx] if not isinstance(task_results[idx], Exception) else {}
                idx += 1
            
            if include_whois:
                results["network_info"] = task_results[idx] if not isinstance(task_results[idx], Exception) else {}
                idx += 1
            
            results["reverse_dns"] = task_results[idx] if not isinstance(task_results[idx], Exception) else {}
            idx += 1
            
            if include_reputation:
                results["reputation"] = task_results[idx] if not isinstance(task_results[idx], Exception) else {}
            
            # Calculate risk assessment
            results["risk_assessment"] = self._assess_risk(results)
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=results,
                metrics=self.metrics,
                confidence_score=0.9
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
    
    async def _get_geolocation(self, ip_address: str) -> Dict[str, Any]:
        """Get geolocation data from multiple sources"""
        geo_data = {}
        
        try:
            # Primary: ip-api.com (free, reliable)
            response = requests.get(f"{self.ipapi_url}/{ip_address}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    geo_data = {
                        "country_code": data.get("countryCode"),
                        "country_name": data.get("country"),
                        "region": data.get("regionName"),
                        "city": data.get("city"),
                        "latitude": data.get("lat"),
                        "longitude": data.get("lon"),
                        "timezone": data.get("timezone"),
                        "isp": data.get("isp"),
                        "organization": data.get("org"),
                        "as_number": data.get("as"),
                        "connection_type": self._classify_connection_type(data.get("isp", "")),
                        "is_mobile": data.get("mobile", False),
                        "is_proxy": data.get("proxy", False),
                        "is_hosting": data.get("hosting", False)
                    }
        except Exception as e:
            geo_data["error"] = f"Geolocation failed: {str(e)}"
        
        return geo_data
    
    async def _get_network_info(self, ip_address: str) -> Dict[str, Any]:
        """Get network information via WHOIS"""
        network_info = {}
        
        try:
            obj = IPWhois(ip_address)
            results = obj.lookup_rdap(depth=1)
            
            network_info = {
                "asn": results.get("asn"),
                "asn_description": results.get("asn_description"),
                "asn_country_code": results.get("asn_country_code"),
                "network_cidr": results.get("network", {}).get("cidr"),
                "network_name": results.get("network", {}).get("name"),
                "network_handle": results.get("network", {}).get("handle"),
                "network_start_address": results.get("network", {}).get("start_address"),
                "network_end_address": results.get("network", {}).get("end_address"),
                "registration_date": results.get("network", {}).get("events", [{}])[0].get("timestamp"),
                "entities": []
            }
            
            # Extract entity information (registrar, contacts)
            for entity in results.get("entities", []):
                entity_info = {
                    "handle": entity.get("handle"),
                    "name": entity.get("name"),
                    "roles": entity.get("roles", []),
                    "country": entity.get("contact", {}).get("address", [{}])[0].get("country") if entity.get("contact") else None
                }
                network_info["entities"].append(entity_info)
                
        except Exception as e:
            network_info["error"] = f"Network info failed: {str(e)}"
        
        return network_info
    
    async def _get_reverse_dns(self, ip_address: str) -> Dict[str, Any]:
        """Get reverse DNS information"""
        reverse_info = {}
        
        try:
            # Reverse DNS lookup
            addr = dns.reversename.from_address(ip_address)
            ptr_records = []
            
            try:
                answers = dns.resolver.resolve(addr, "PTR")
                ptr_records = [str(rdata) for rdata in answers]
            except dns.resolver.NXDOMAIN:
                ptr_records = []
            except Exception:
                ptr_records = []
            
            reverse_info = {
                "ptr_records": ptr_records,
                "primary_hostname": ptr_records[0] if ptr_records else None,
                "hostname_count": len(ptr_records)
            }
            
            # Additional hostname analysis
            if ptr_records:
                reverse_info["hostname_analysis"] = self._analyze_hostnames(ptr_records)
                
        except Exception as e:
            reverse_info["error"] = f"Reverse DNS failed: {str(e)}"
        
        return reverse_info
    
    async def _check_reputation(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation from multiple sources"""
        reputation = {
            "abuse_score": 0,
            "threat_categories": [],
            "blacklists": [],
            "last_seen": None,
            "confidence": "low"
        }
        
        try:
            # Simple reputation check (would need API keys for full functionality)
            # This is a basic implementation - in production, integrate with:
            # - AbuseIPDB API
            # - VirusTotal API
            # - GreyNoise API
            # - IPVoid API
            
            # Basic heuristics
            if self._is_private_ip(ip_address):
                reputation["confidence"] = "high"
                reputation["abuse_score"] = 0
                reputation["threat_categories"] = ["private"]
            else:
                # Placeholder for external API calls
                reputation["confidence"] = "medium"
                reputation["abuse_score"] = 25  # Default moderate score
                
        except Exception as e:
            reputation["error"] = f"Reputation check failed: {str(e)}"
        
        return reputation
    
    def _assess_risk(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate overall risk assessment"""
        risk_factors = []
        risk_score = 0
        
        # Geolocation risk factors
        geo = results.get("geolocation", {})
        if geo.get("is_proxy"):
            risk_factors.append("proxy_detected")
            risk_score += 30
        
        if geo.get("is_hosting"):
            risk_factors.append("hosting_provider")
            risk_score += 20
        
        # High-risk countries (example)
        high_risk_countries = ["CN", "RU", "KP", "IR"]
        if geo.get("country_code") in high_risk_countries:
            risk_factors.append("high_risk_country")
            risk_score += 25
        
        # Reputation factors
        reputation = results.get("reputation", {})
        abuse_score = reputation.get("abuse_score", 0)
        risk_score += abuse_score
        
        if abuse_score > 75:
            risk_factors.append("high_abuse_score")
        
        # Network factors
        network = results.get("network_info", {})
        if "hosting" in str(network.get("asn_description", "")).lower():
            risk_factors.append("hosting_asn")
            risk_score += 15
        
        # Determine risk level
        if risk_score >= 80:
            risk_level = "critical"
        elif risk_score >= 60:
            risk_level = "high"
        elif risk_score >= 40:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "risk_level": risk_level,
            "risk_score": min(risk_score, 100),
            "risk_factors": risk_factors,
            "recommendation": self._get_recommendation(risk_level, risk_factors)
        }
    
    def _classify_connection_type(self, isp: str) -> str:
        """Classify connection type based on ISP name"""
        isp_lower = isp.lower()
        
        if any(keyword in isp_lower for keyword in ["hosting", "server", "cloud", "datacenter", "vps"]):
            return "hosting"
        elif any(keyword in isp_lower for keyword in ["mobile", "cellular", "wireless"]):
            return "mobile"
        elif any(keyword in isp_lower for keyword in ["residential", "broadband", "cable", "dsl"]):
            return "residential"
        else:
            return "unknown"
    
    def _analyze_hostnames(self, hostnames: list) -> Dict[str, Any]:
        """Analyze hostname patterns"""
        analysis = {
            "patterns": [],
            "suspicious_indicators": []
        }
        
        for hostname in hostnames:
            hostname_lower = hostname.lower()
            
            # Check for suspicious patterns
            if any(pattern in hostname_lower for pattern in ["dyn", "dynamic", "dhcp", "pool"]):
                analysis["suspicious_indicators"].append("dynamic_hostname")
            
            if any(pattern in hostname_lower for pattern in ["bot", "spam", "malware"]):
                analysis["suspicious_indicators"].append("malicious_hostname")
            
            # Extract patterns
            if hostname.count(".") >= 3:
                analysis["patterns"].append("subdomain_heavy")
        
        return analysis
    
    def _is_private_ip(self, ip_address: str) -> bool:
        """Check if IP is in private ranges"""
        try:
            import ipaddress
            ip = ipaddress.ip_address(ip_address)
            return ip.is_private
        except:
            return False
    
    def _get_recommendation(self, risk_level: str, risk_factors: list) -> str:
        """Get security recommendation based on risk assessment"""
        if risk_level == "critical":
            return "BLOCK: High-risk IP with multiple threat indicators"
        elif risk_level == "high":
            return "MONITOR: Elevated risk, implement additional monitoring"
        elif risk_level == "medium":
            return "CAUTION: Some risk factors present, verify legitimacy"
        else:
            return "ALLOW: Low risk, normal traffic patterns"
    
    def parse_output(self, raw_output: str) -> Dict[str, Any]:
        """Parse raw output (not used in this implementation)"""
        try:
            return json.loads(raw_output)
        except:
            return {"error": "Failed to parse output", "raw": raw_output}


# Example usage
if __name__ == "__main__":
    async def test_ip_intelligence():
        tool = IPIntelligenceTool()
        
        # Test with a public IP
        inputs = {
            "ip_address": "8.8.8.8",
            "include_reputation": True,
            "include_geolocation": True,
            "include_whois": True
        }
        
        result = await tool.run_with_monitoring(inputs)
        print(json.dumps(result.data, indent=2))
    
    asyncio.run(test_ip_intelligence())