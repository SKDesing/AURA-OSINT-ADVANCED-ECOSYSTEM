#!/usr/bin/env python3
"""
Port Scanner Tool - Network Service Discovery
Advanced port scanning with service detection and vulnerability hints
"""

import asyncio
import json
import subprocess
import xml.etree.ElementTree as ET
from typing import Dict, Any, List, Optional
from datetime import datetime
import socket
import concurrent.futures

from ..base import BaseTool, ToolOutput, ToolCategory, ToolStatus, ToolMetrics


class PortScannerTool(BaseTool):
    """
    Advanced port scanner combining:
    - Nmap integration (service detection, OS fingerprinting)
    - Custom TCP/UDP scanning
    - Service banner grabbing
    - Vulnerability hints
    - Performance optimization
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.NETWORK
        self.name = "port_scanner"
        self.version = "1.0.0"
        self.required_inputs = ["target"]
        self.optional_inputs = ["scan_type", "port_range", "timing", "service_detection"]
        self.max_execution_time = 300  # 5 minutes
        
        # Common ports for quick scanning
        self.common_ports = [
            21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995,
            1723, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 9200, 27017
        ]
        
        # Service signatures for banner analysis
        self.service_signatures = {
            "SSH": ["SSH-", "OpenSSH"],
            "HTTP": ["HTTP/", "Server:", "nginx", "Apache"],
            "FTP": ["220", "FTP", "vsftpd"],
            "SMTP": ["220", "SMTP", "Postfix", "Exim"],
            "MySQL": ["mysql_native_password", "MySQL"],
            "PostgreSQL": ["PostgreSQL", "FATAL"],
            "Redis": ["+PONG", "Redis"],
            "MongoDB": ["MongoDB", "ismaster"]
        }
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        """Validate target format (IP or hostname)"""
        target = inputs.get("target", "").strip()
        if not target:
            return False
        
        # Basic validation - could be enhanced
        return len(target) > 0 and not any(char in target for char in [";", "&", "|", "`"])
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        """Execute port scanning"""
        target = inputs["target"].strip()
        scan_type = inputs.get("scan_type", "quick")  # quick, full, custom
        port_range = inputs.get("port_range", "")
        timing = inputs.get("timing", "normal")  # stealth, normal, aggressive
        service_detection = inputs.get("service_detection", True)
        
        results = {
            "target": target,
            "scan_timestamp": datetime.now().isoformat(),
            "scan_type": scan_type,
            "open_ports": [],
            "services": {},
            "os_detection": {},
            "vulnerabilities": [],
            "scan_statistics": {}
        }
        
        try:
            # Choose scanning method
            if scan_type == "nmap" and self._is_nmap_available():
                results = await self._nmap_scan(target, port_range, timing, service_detection)
            else:
                results = await self._custom_scan(target, scan_type, service_detection)
            
            # Add vulnerability hints
            results["vulnerabilities"] = self._check_vulnerabilities(results)
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=results,
                metrics=self.metrics,
                confidence_score=0.85
            )
            
        except Exception as e:
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.FAILED,
                data={"error": str(e), "target": target},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    async def _nmap_scan(self, target: str, port_range: str, timing: str, service_detection: bool) -> Dict[str, Any]:
        """Execute Nmap scan with XML output parsing"""
        
        # Build nmap command
        cmd = ["nmap", "-oX", "-"]  # XML output to stdout
        
        # Timing template
        timing_map = {
            "stealth": "-T1",
            "normal": "-T3", 
            "aggressive": "-T4"
        }
        cmd.append(timing_map.get(timing, "-T3"))
        
        # Service detection
        if service_detection:
            cmd.extend(["-sV", "-sC"])  # Version detection + default scripts
        
        # Port range
        if port_range:
            cmd.extend(["-p", port_range])
        else:
            cmd.extend(["-p", "1-1000"])  # Default range
        
        # OS detection (requires root, so optional)
        try:
            cmd.append("-O")
        except:
            pass
        
        cmd.append(target)
        
        # Execute nmap
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"Nmap scan failed: {stderr.decode()}")
        
        # Parse XML output
        return self._parse_nmap_xml(stdout.decode())
    
    async def _custom_scan(self, target: str, scan_type: str, service_detection: bool) -> Dict[str, Any]:
        """Custom TCP port scanning implementation"""
        
        results = {
            "target": target,
            "scan_timestamp": datetime.now().isoformat(),
            "scan_type": f"custom_{scan_type}",
            "open_ports": [],
            "services": {},
            "scan_statistics": {}
        }
        
        # Determine ports to scan
        if scan_type == "quick":
            ports_to_scan = self.common_ports
        elif scan_type == "full":
            ports_to_scan = range(1, 65536)
        else:
            ports_to_scan = self.common_ports
        
        start_time = datetime.now()
        
        # Parallel port scanning
        open_ports = await self._scan_ports_parallel(target, ports_to_scan)
        results["open_ports"] = sorted(open_ports)
        
        # Service detection on open ports
        if service_detection and open_ports:
            results["services"] = await self._detect_services(target, open_ports[:20])  # Limit to first 20
        
        end_time = datetime.now()
        results["scan_statistics"] = {
            "ports_scanned": len(ports_to_scan),
            "open_ports_found": len(open_ports),
            "scan_duration_seconds": (end_time - start_time).total_seconds()
        }
        
        return results
    
    async def _scan_ports_parallel(self, target: str, ports: List[int], max_workers: int = 100) -> List[int]:
        """Scan ports in parallel using asyncio"""
        
        async def scan_port(port: int) -> Optional[int]:
            try:
                # Create connection with timeout
                future = asyncio.open_connection(target, port)
                reader, writer = await asyncio.wait_for(future, timeout=3)
                writer.close()
                await writer.wait_closed()
                return port
            except:
                return None
        
        # Limit concurrent connections
        semaphore = asyncio.Semaphore(max_workers)
        
        async def scan_with_semaphore(port: int) -> Optional[int]:
            async with semaphore:
                return await scan_port(port)
        
        # Execute all scans
        tasks = [scan_with_semaphore(port) for port in ports]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter successful results
        open_ports = [port for port in results if isinstance(port, int)]
        return open_ports
    
    async def _detect_services(self, target: str, ports: List[int]) -> Dict[int, Dict[str, Any]]:
        """Detect services running on open ports"""
        services = {}
        
        for port in ports:
            try:
                service_info = await self._grab_banner(target, port)
                if service_info:
                    services[port] = service_info
            except Exception as e:
                services[port] = {"error": str(e)}
        
        return services
    
    async def _grab_banner(self, target: str, port: int) -> Dict[str, Any]:
        """Grab service banner and identify service"""
        
        try:
            # Connect and try to get banner
            future = asyncio.open_connection(target, port)
            reader, writer = await asyncio.wait_for(future, timeout=5)
            
            # Send HTTP request for web services
            if port in [80, 8080, 8000, 8443]:
                writer.write(b"GET / HTTP/1.1\r\nHost: " + target.encode() + b"\r\n\r\n")
                await writer.drain()
            
            # Read response
            try:
                banner = await asyncio.wait_for(reader.read(1024), timeout=3)
                banner_text = banner.decode('utf-8', errors='ignore').strip()
            except:
                banner_text = ""
            
            writer.close()
            await writer.wait_closed()
            
            # Analyze banner
            service_info = {
                "port": port,
                "banner": banner_text[:500],  # Limit banner length
                "service": self._identify_service(port, banner_text),
                "version": self._extract_version(banner_text),
                "confidence": "medium"
            }
            
            return service_info
            
        except Exception as e:
            return {
                "port": port,
                "error": str(e),
                "service": self._guess_service_by_port(port),
                "confidence": "low"
            }
    
    def _identify_service(self, port: int, banner: str) -> str:
        """Identify service based on banner and port"""
        
        banner_lower = banner.lower()
        
        # Check signatures
        for service, signatures in self.service_signatures.items():
            if any(sig.lower() in banner_lower for sig in signatures):
                return service
        
        # Fallback to port-based identification
        return self._guess_service_by_port(port)
    
    def _guess_service_by_port(self, port: int) -> str:
        """Guess service based on common port assignments"""
        
        port_services = {
            21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
            80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 993: "IMAPS",
            995: "POP3S", 1723: "PPTP", 3306: "MySQL", 3389: "RDP",
            5432: "PostgreSQL", 5900: "VNC", 6379: "Redis", 8080: "HTTP-Alt",
            8443: "HTTPS-Alt", 9200: "Elasticsearch", 27017: "MongoDB"
        }
        
        return port_services.get(port, "Unknown")
    
    def _extract_version(self, banner: str) -> Optional[str]:
        """Extract version information from banner"""
        
        import re
        
        # Common version patterns
        version_patterns = [
            r'(\d+\.\d+\.\d+)',
            r'(\d+\.\d+)',
            r'v(\d+\.\d+\.\d+)',
            r'version\s+(\d+\.\d+)',
        ]
        
        for pattern in version_patterns:
            match = re.search(pattern, banner, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None
    
    def _parse_nmap_xml(self, xml_output: str) -> Dict[str, Any]:
        """Parse Nmap XML output"""
        
        try:
            root = ET.fromstring(xml_output)
            
            results = {
                "target": "",
                "scan_timestamp": datetime.now().isoformat(),
                "scan_type": "nmap",
                "open_ports": [],
                "services": {},
                "os_detection": {},
                "scan_statistics": {}
            }
            
            # Parse host information
            for host in root.findall('host'):
                # Get target address
                address = host.find('address')
                if address is not None:
                    results["target"] = address.get('addr')
                
                # Parse ports
                ports = host.find('ports')
                if ports is not None:
                    for port in ports.findall('port'):
                        port_id = int(port.get('portid'))
                        protocol = port.get('protocol')
                        
                        state = port.find('state')
                        if state is not None and state.get('state') == 'open':
                            results["open_ports"].append(port_id)
                            
                            # Service information
                            service = port.find('service')
                            if service is not None:
                                results["services"][port_id] = {
                                    "name": service.get('name'),
                                    "product": service.get('product'),
                                    "version": service.get('version'),
                                    "protocol": protocol,
                                    "confidence": service.get('conf', '0')
                                }
                
                # OS detection
                os_elem = host.find('os')
                if os_elem is not None:
                    osmatch = os_elem.find('osmatch')
                    if osmatch is not None:
                        results["os_detection"] = {
                            "name": osmatch.get('name'),
                            "accuracy": osmatch.get('accuracy'),
                            "line": osmatch.get('line')
                        }
            
            return results
            
        except ET.ParseError as e:
            raise Exception(f"Failed to parse Nmap XML: {str(e)}")
    
    def _check_vulnerabilities(self, scan_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check for common vulnerabilities based on scan results"""
        
        vulnerabilities = []
        services = scan_results.get("services", {})
        
        for port, service_info in services.items():
            service_name = service_info.get("service", "").lower()
            version = service_info.get("version", "")
            
            # Check for common vulnerable services
            if service_name == "ssh" and port == 22:
                vulnerabilities.append({
                    "port": port,
                    "service": service_name,
                    "vulnerability": "SSH brute force risk",
                    "severity": "medium",
                    "description": "SSH service exposed to internet",
                    "recommendation": "Use key-based authentication, change default port"
                })
            
            elif service_name in ["http", "https"] and port in [80, 443, 8080]:
                vulnerabilities.append({
                    "port": port,
                    "service": service_name,
                    "vulnerability": "Web service exposure",
                    "severity": "low",
                    "description": "Web service accessible",
                    "recommendation": "Ensure proper authentication and security headers"
                })
            
            elif service_name == "ftp" and port == 21:
                vulnerabilities.append({
                    "port": port,
                    "service": service_name,
                    "vulnerability": "FTP service exposure",
                    "severity": "high",
                    "description": "FTP service may allow anonymous access",
                    "recommendation": "Disable anonymous FTP, use SFTP instead"
                })
            
            elif service_name in ["mysql", "postgresql"] and port in [3306, 5432]:
                vulnerabilities.append({
                    "port": port,
                    "service": service_name,
                    "vulnerability": "Database exposure",
                    "severity": "critical",
                    "description": "Database service exposed to internet",
                    "recommendation": "Restrict access to trusted IPs only"
                })
        
        return vulnerabilities
    
    def _is_nmap_available(self) -> bool:
        """Check if nmap is available on the system"""
        try:
            subprocess.run(["nmap", "--version"], 
                         capture_output=True, check=True, timeout=5)
            return True
        except:
            return False
    
    def parse_output(self, raw_output: str) -> Dict[str, Any]:
        """Parse raw output (not used in this implementation)"""
        try:
            return json.loads(raw_output)
        except:
            return {"error": "Failed to parse output", "raw": raw_output}


# Example usage
if __name__ == "__main__":
    async def test_port_scanner():
        tool = PortScannerTool()
        
        # Test with a target
        inputs = {
            "target": "scanme.nmap.org",
            "scan_type": "quick",
            "service_detection": True,
            "timing": "normal"
        }
        
        result = await tool.run_with_monitoring(inputs)
        print(json.dumps(result.data, indent=2))
    
    asyncio.run(test_port_scanner())