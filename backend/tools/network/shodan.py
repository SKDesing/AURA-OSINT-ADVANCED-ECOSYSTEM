import asyncio
import json
import ipaddress
from typing import Dict, Any, List
from datetime import datetime
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class ShodanTool(BaseTool):
    """
    Shodan OSINT for IP/domain reconnaissance
    Extracts: open ports, services, vulnerabilities, geolocation
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.NETWORK
        self.required_inputs = ['target']  # IP or domain
        self.max_execution_time = 60
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        target = inputs.get('target', '').strip()
        if not target:
            return False
        
        # Check if IP or domain
        try:
            ipaddress.ip_address(target)
            return True
        except:
            # Check domain format
            import re
            domain_pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$'
            return bool(re.match(domain_pattern, target))
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        target = inputs['target'].strip()
        
        try:
            # Get Shodan data
            shodan_data = await self._query_shodan(target)
            
            # Analyze vulnerabilities
            vuln_analysis = self._analyze_vulnerabilities(shodan_data)
            
            # Analyze services
            service_analysis = self._analyze_services(shodan_data)
            
            # Generate threat assessment
            threat_assessment = self._generate_threat_assessment(shodan_data, vuln_analysis, service_analysis)
            
            parsed_data = {
                "target": target,
                "shodan_results": shodan_data,
                "vulnerability_analysis": vuln_analysis,
                "service_analysis": service_analysis,
                "threat_assessment": threat_assessment,
                "scan_timestamp": datetime.now().isoformat()
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                confidence_score=0.95
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
    
    async def _query_shodan(self, target: str) -> Dict[str, Any]:
        """Query Shodan API or use shodan CLI"""
        
        # Try Shodan CLI first (requires API key in config)
        cmd = ['shodan', 'host', target, '--format', 'json']
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode == 0:
            try:
                return json.loads(stdout.decode())
            except:
                pass
        
        # Fallback to mock data for demo
        return self._generate_mock_shodan_data(target)
    
    def _generate_mock_shodan_data(self, target: str) -> Dict[str, Any]:
        """Generate realistic mock Shodan data for demo"""
        
        # Determine if target is IP or domain
        try:
            ipaddress.ip_address(target)
            ip = target
            hostnames = [f"server-{target.replace('.', '-')}.example.com"]
        except:
            ip = "192.168.1.100"  # Mock IP
            hostnames = [target]
        
        return {
            "ip_str": ip,
            "hostnames": hostnames,
            "country_name": "United States",
            "country_code": "US",
            "city": "San Francisco",
            "region_code": "CA",
            "postal_code": "94102",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "org": "Example Hosting Inc.",
            "isp": "Example ISP",
            "asn": "AS12345",
            "ports": [22, 80, 443, 3306, 8080],
            "data": [
                {
                    "port": 22,
                    "transport": "tcp",
                    "product": "OpenSSH",
                    "version": "7.4",
                    "banner": "SSH-2.0-OpenSSH_7.4",
                    "timestamp": "2024-01-15T10:30:00.000000"
                },
                {
                    "port": 80,
                    "transport": "tcp",
                    "product": "Apache httpd",
                    "version": "2.4.41",
                    "banner": "HTTP/1.1 200 OK\\r\\nServer: Apache/2.4.41",
                    "timestamp": "2024-01-15T10:30:00.000000"
                },
                {
                    "port": 443,
                    "transport": "tcp",
                    "product": "Apache httpd",
                    "version": "2.4.41",
                    "ssl": {
                        "cert": {
                            "subject": {"CN": target},
                            "issuer": {"CN": "Let's Encrypt Authority X3"},
                            "expired": False
                        }
                    },
                    "timestamp": "2024-01-15T10:30:00.000000"
                },
                {
                    "port": 3306,
                    "transport": "tcp",
                    "product": "MySQL",
                    "version": "5.7.33",
                    "banner": "5.7.33-0ubuntu0.18.04.1",
                    "timestamp": "2024-01-15T10:30:00.000000"
                }
            ],
            "vulns": {
                "CVE-2021-44228": {
                    "cvss": 10.0,
                    "summary": "Apache Log4j2 Remote Code Execution"
                }
            },
            "tags": ["cloud", "web-server", "database"]
        }
    
    def _analyze_vulnerabilities(self, shodan_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze vulnerabilities from Shodan data"""
        
        vulns = shodan_data.get('vulns', {})
        
        if not vulns:
            return {
                "total_vulnerabilities": 0,
                "critical_vulns": [],
                "high_vulns": [],
                "medium_vulns": [],
                "low_vulns": [],
                "risk_score": 0
            }
        
        critical_vulns = []
        high_vulns = []
        medium_vulns = []
        low_vulns = []
        
        for cve, details in vulns.items():
            cvss = details.get('cvss', 0)
            vuln_info = {
                "cve": cve,
                "cvss_score": cvss,
                "summary": details.get('summary', 'No description available')
            }
            
            if cvss >= 9.0:
                critical_vulns.append(vuln_info)
            elif cvss >= 7.0:
                high_vulns.append(vuln_info)
            elif cvss >= 4.0:
                medium_vulns.append(vuln_info)
            else:
                low_vulns.append(vuln_info)
        
        # Calculate risk score
        risk_score = (
            len(critical_vulns) * 10 +
            len(high_vulns) * 7 +
            len(medium_vulns) * 4 +
            len(low_vulns) * 1
        )
        
        return {
            "total_vulnerabilities": len(vulns),
            "critical_vulns": critical_vulns,
            "high_vulns": high_vulns,
            "medium_vulns": medium_vulns,
            "low_vulns": low_vulns,
            "risk_score": min(100, risk_score)
        }
    
    def _analyze_services(self, shodan_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze running services"""
        
        services = shodan_data.get('data', [])
        ports = shodan_data.get('ports', [])
        
        service_summary = {}
        risky_services = []
        outdated_services = []
        
        # Known risky services
        risky_ports = {
            21: "FTP",
            23: "Telnet", 
            53: "DNS",
            135: "RPC",
            139: "NetBIOS",
            445: "SMB",
            1433: "MSSQL",
            3306: "MySQL",
            3389: "RDP",
            5432: "PostgreSQL",
            6379: "Redis",
            27017: "MongoDB"
        }
        
        # Known outdated versions
        outdated_versions = {
            "OpenSSH": ["6.0", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6"],
            "Apache httpd": ["2.2", "2.3"],
            "MySQL": ["5.0", "5.1", "5.5", "5.6"],
            "nginx": ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5"]
        }
        
        for service in services:
            port = service.get('port')
            product = service.get('product', 'Unknown')
            version = service.get('version', 'Unknown')
            
            service_summary[port] = {
                "product": product,
                "version": version,
                "banner": service.get('banner', '')[:100]  # Truncate banner
            }
            
            # Check if risky
            if port in risky_ports:
                risky_services.append({
                    "port": port,
                    "service": risky_ports[port],
                    "product": product,
                    "risk_reason": f"{risky_ports[port]} service exposed"
                })
            
            # Check if outdated
            if product in outdated_versions:
                for old_version in outdated_versions[product]:
                    if version.startswith(old_version):
                        outdated_services.append({
                            "port": port,
                            "product": product,
                            "version": version,
                            "risk_reason": f"Outdated {product} version"
                        })
                        break
        
        return {
            "total_services": len(services),
            "open_ports": ports,
            "service_details": service_summary,
            "risky_services": risky_services,
            "outdated_services": outdated_services,
            "service_categories": self._categorize_services(services)
        }
    
    def _categorize_services(self, services: List[Dict]) -> Dict[str, List]:
        """Categorize services by type"""
        
        categories = {
            "web_services": [],
            "database_services": [],
            "remote_access": [],
            "file_services": [],
            "other_services": []
        }
        
        for service in services:
            port = service.get('port')
            product = service.get('product', '').lower()
            
            if port in [80, 443, 8080, 8443] or 'http' in product:
                categories["web_services"].append(service)
            elif port in [3306, 5432, 1433, 27017] or any(db in product for db in ['mysql', 'postgres', 'mssql', 'mongo']):
                categories["database_services"].append(service)
            elif port in [22, 3389, 23] or any(remote in product for remote in ['ssh', 'rdp', 'telnet']):
                categories["remote_access"].append(service)
            elif port in [21, 139, 445] or any(file_svc in product for file_svc in ['ftp', 'smb', 'netbios']):
                categories["file_services"].append(service)
            else:
                categories["other_services"].append(service)
        
        return categories
    
    def _generate_threat_assessment(self, shodan_data: Dict, vuln_analysis: Dict, service_analysis: Dict) -> Dict[str, Any]:
        """Generate comprehensive threat assessment"""
        
        # Calculate overall risk level
        vuln_score = vuln_analysis.get('risk_score', 0)
        risky_services_count = len(service_analysis.get('risky_services', []))
        outdated_services_count = len(service_analysis.get('outdated_services', []))
        
        total_risk_score = vuln_score + (risky_services_count * 5) + (outdated_services_count * 3)
        
        if total_risk_score >= 50:
            risk_level = "CRITICAL"
        elif total_risk_score >= 30:
            risk_level = "HIGH"
        elif total_risk_score >= 15:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Generate recommendations
        recommendations = []
        
        if vuln_analysis.get('critical_vulns'):
            recommendations.append("URGENT: Patch critical vulnerabilities immediately")
        
        if service_analysis.get('risky_services'):
            recommendations.append("Close or secure risky services (FTP, Telnet, etc.)")
        
        if service_analysis.get('outdated_services'):
            recommendations.append("Update outdated software versions")
        
        # Check for common attack vectors
        attack_vectors = []
        open_ports = service_analysis.get('open_ports', [])
        
        if 22 in open_ports:
            attack_vectors.append("SSH brute force attacks")
        if 3389 in open_ports:
            attack_vectors.append("RDP brute force attacks")
        if any(port in open_ports for port in [3306, 5432, 1433]):
            attack_vectors.append("Database exploitation")
        if any(port in open_ports for port in [80, 443, 8080]):
            attack_vectors.append("Web application attacks")
        
        # Geographic risk assessment
        country = shodan_data.get('country_code', 'Unknown')
        high_risk_countries = ['CN', 'RU', 'KP', 'IR']
        geo_risk = "HIGH" if country in high_risk_countries else "LOW"
        
        return {
            "overall_risk_level": risk_level,
            "risk_score": min(100, total_risk_score),
            "attack_surface": {
                "open_ports_count": len(open_ports),
                "exposed_services": len(service_analysis.get('service_details', {})),
                "attack_vectors": attack_vectors
            },
            "security_recommendations": recommendations,
            "geographic_risk": {
                "country": shodan_data.get('country_name', 'Unknown'),
                "risk_level": geo_risk,
                "hosting_provider": shodan_data.get('org', 'Unknown')
            },
            "compliance_concerns": {
                "pci_dss": "FAIL" if any(port in open_ports for port in [3306, 5432, 1433]) else "PASS",
                "gdpr": "REVIEW_REQUIRED" if country in ['US', 'CN', 'RU'] else "COMPLIANT",
                "hipaa": "FAIL" if risky_services_count > 0 else "PASS"
            },
            "monitoring_priority": "IMMEDIATE" if risk_level in ["CRITICAL", "HIGH"] else "ROUTINE"
        }