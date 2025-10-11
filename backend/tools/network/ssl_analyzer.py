#!/usr/bin/env python3
"""
SSL/TLS Analyzer Tool - Certificate Intelligence
Comprehensive SSL certificate analysis and security assessment
"""

import asyncio
import json
import ssl
import socket
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import OpenSSL.crypto
from cryptography import x509
from cryptography.hazmat.backends import default_backend
import dns.resolver

from ..base import BaseTool, ToolOutput, ToolCategory, ToolStatus, ToolMetrics


class SSLAnalyzerTool(BaseTool):
    """
    SSL/TLS Certificate Analyzer combining:
    - Certificate chain validation
    - Certificate transparency logs (crt.sh)
    - SSL configuration analysis
    - Vulnerability assessment
    - Expiration monitoring
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.NETWORK
        self.name = "ssl_analyzer"
        self.version = "1.0.0"
        self.required_inputs = ["target"]
        self.optional_inputs = ["port", "include_ct_logs", "check_vulnerabilities"]
        self.max_execution_time = 60  # 1 minute
        
        # Certificate Transparency API
        self.crt_sh_api = "https://crt.sh/"
        
        # Common SSL/TLS vulnerabilities
        self.ssl_vulnerabilities = {
            "SSLv2": {"severity": "critical", "description": "SSLv2 is deprecated and insecure"},
            "SSLv3": {"severity": "high", "description": "SSLv3 vulnerable to POODLE attack"},
            "TLSv1.0": {"severity": "medium", "description": "TLS 1.0 is deprecated"},
            "TLSv1.1": {"severity": "medium", "description": "TLS 1.1 is deprecated"},
            "RC4": {"severity": "high", "description": "RC4 cipher is cryptographically broken"},
            "DES": {"severity": "critical", "description": "DES encryption is weak"},
            "3DES": {"severity": "medium", "description": "3DES is deprecated"},
            "MD5": {"severity": "high", "description": "MD5 signature algorithm is weak"},
            "SHA1": {"severity": "medium", "description": "SHA1 is deprecated for certificates"}
        }
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        """Validate target format"""
        target = inputs.get("target", "").strip()
        if not target:
            return False
        
        port = inputs.get("port", 443)
        try:
            port = int(port)
            return 1 <= port <= 65535
        except:
            return False
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        """Execute SSL analysis"""
        target = inputs["target"].strip()
        port = int(inputs.get("port", 443))
        include_ct_logs = inputs.get("include_ct_logs", True)
        check_vulnerabilities = inputs.get("check_vulnerabilities", True)
        
        results = {
            "target": target,
            "port": port,
            "analysis_timestamp": datetime.now().isoformat(),
            "certificate_chain": [],
            "ssl_configuration": {},
            "vulnerabilities": [],
            "ct_logs": [],
            "security_assessment": {}
        }
        
        try:
            # Get SSL certificate and configuration
            cert_info = await self._get_ssl_certificate(target, port)
            results.update(cert_info)
            
            # Certificate Transparency logs
            if include_ct_logs and results.get("certificate_chain"):
                results["ct_logs"] = await self._get_ct_logs(target)
            
            # Vulnerability assessment
            if check_vulnerabilities:
                results["vulnerabilities"] = await self._check_ssl_vulnerabilities(target, port)
            
            # Overall security assessment
            results["security_assessment"] = self._assess_ssl_security(results)
            
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
                data={"error": str(e), "target": target, "port": port},
                metrics=self.metrics,
                confidence_score=0.0
            )
    
    async def _get_ssl_certificate(self, target: str, port: int) -> Dict[str, Any]:
        """Get SSL certificate and analyze chain"""
        
        try:
            # Create SSL context
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            # Connect and get certificate
            with socket.create_connection((target, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=target) as ssock:
                    # Get peer certificate chain
                    cert_der = ssock.getpeercert(binary_form=True)
                    cert_chain = ssock.getpeercert_chain()
                    
                    # SSL configuration
                    ssl_config = {
                        "protocol": ssock.version(),
                        "cipher": ssock.cipher(),
                        "compression": ssock.compression(),
                        "server_hostname": target,
                        "peer_cert_chain_length": len(cert_chain) if cert_chain else 0
                    }
            
            # Parse certificate chain
            certificate_chain = []
            if cert_chain:
                for i, cert_der in enumerate(cert_chain):
                    cert_info = self._parse_certificate(cert_der, i == 0)
                    certificate_chain.append(cert_info)
            
            return {
                "certificate_chain": certificate_chain,
                "ssl_configuration": ssl_config,
                "connection_successful": True
            }
            
        except Exception as e:
            return {
                "certificate_chain": [],
                "ssl_configuration": {},
                "connection_successful": False,
                "connection_error": str(e)
            }
    
    def _parse_certificate(self, cert_der: bytes, is_leaf: bool = False) -> Dict[str, Any]:
        """Parse X.509 certificate"""
        
        try:
            # Parse with cryptography library
            cert = x509.load_der_x509_certificate(cert_der, default_backend())
            
            # Basic certificate information
            cert_info = {
                "is_leaf_certificate": is_leaf,
                "version": cert.version.name,
                "serial_number": str(cert.serial_number),
                "signature_algorithm": cert.signature_algorithm_oid._name,
                "issuer": self._format_name(cert.issuer),
                "subject": self._format_name(cert.subject),
                "not_valid_before": cert.not_valid_before.isoformat(),
                "not_valid_after": cert.not_valid_after.isoformat(),
                "is_expired": cert.not_valid_after < datetime.now(),
                "days_until_expiry": (cert.not_valid_after - datetime.now()).days,
                "public_key_algorithm": cert.public_key().algorithm.name,
                "public_key_size": cert.public_key().key_size,
                "extensions": {}
            }
            
            # Parse extensions
            for ext in cert.extensions:
                ext_name = ext.oid._name
                
                if ext_name == "subjectAltName":
                    san_list = []
                    for name in ext.value:
                        san_list.append(f"{name.__class__.__name__}: {name.value}")
                    cert_info["extensions"]["subject_alt_names"] = san_list
                
                elif ext_name == "keyUsage":
                    key_usage = []
                    for usage in ["digital_signature", "key_encipherment", "key_agreement", 
                                "key_cert_sign", "crl_sign", "content_commitment", 
                                "data_encipherment", "encipher_only", "decipher_only"]:
                        if hasattr(ext.value, usage) and getattr(ext.value, usage):
                            key_usage.append(usage)
                    cert_info["extensions"]["key_usage"] = key_usage
                
                elif ext_name == "extendedKeyUsage":
                    ext_key_usage = [eku.dotted_string for eku in ext.value]
                    cert_info["extensions"]["extended_key_usage"] = ext_key_usage
                
                elif ext_name == "basicConstraints":
                    cert_info["extensions"]["basic_constraints"] = {
                        "ca": ext.value.ca,
                        "path_length": ext.value.path_length
                    }
            
            # Certificate validation
            cert_info["validation"] = self._validate_certificate(cert)
            
            return cert_info
            
        except Exception as e:
            return {
                "parse_error": str(e),
                "is_leaf_certificate": is_leaf
            }
    
    def _format_name(self, name) -> Dict[str, str]:
        """Format X.509 distinguished name"""
        name_dict = {}
        for attribute in name:
            name_dict[attribute.oid._name] = attribute.value
        return name_dict
    
    def _validate_certificate(self, cert) -> Dict[str, Any]:
        """Validate certificate properties"""
        
        validation = {
            "issues": [],
            "warnings": [],
            "score": 100
        }
        
        # Check expiration
        days_until_expiry = (cert.not_valid_after - datetime.now()).days
        if days_until_expiry < 0:
            validation["issues"].append("Certificate has expired")
            validation["score"] -= 50
        elif days_until_expiry < 30:
            validation["warnings"].append(f"Certificate expires in {days_until_expiry} days")
            validation["score"] -= 20
        
        # Check signature algorithm
        sig_alg = cert.signature_algorithm_oid._name.lower()
        if "md5" in sig_alg:
            validation["issues"].append("Uses weak MD5 signature algorithm")
            validation["score"] -= 30
        elif "sha1" in sig_alg:
            validation["warnings"].append("Uses deprecated SHA1 signature algorithm")
            validation["score"] -= 15
        
        # Check key size
        key_size = cert.public_key().key_size
        if key_size < 2048:
            validation["issues"].append(f"Weak key size: {key_size} bits")
            validation["score"] -= 25
        elif key_size < 3072:
            validation["warnings"].append(f"Key size {key_size} bits is acceptable but not optimal")
            validation["score"] -= 5
        
        return validation
    
    async def _get_ct_logs(self, domain: str) -> List[Dict[str, Any]]:
        """Get Certificate Transparency logs from crt.sh"""
        
        try:
            # Query crt.sh API
            params = {"q": domain, "output": "json"}
            response = requests.get(self.crt_sh_api, params=params, timeout=15)
            
            if response.status_code == 200:
                ct_data = response.json()
                
                # Process and deduplicate results
                processed_logs = []
                seen_serials = set()
                
                for entry in ct_data[:50]:  # Limit to 50 entries
                    serial = entry.get("serial_number")
                    if serial not in seen_serials:
                        seen_serials.add(serial)
                        
                        log_entry = {
                            "id": entry.get("id"),
                            "logged_at": entry.get("entry_timestamp"),
                            "not_before": entry.get("not_before"),
                            "not_after": entry.get("not_after"),
                            "serial_number": serial,
                            "issuer_name": entry.get("issuer_name"),
                            "common_name": entry.get("common_name"),
                            "name_value": entry.get("name_value")
                        }
                        processed_logs.append(log_entry)
                
                return processed_logs
            
        except Exception as e:
            return [{"error": f"CT logs query failed: {str(e)}"}]
        
        return []
    
    async def _check_ssl_vulnerabilities(self, target: str, port: int) -> List[Dict[str, Any]]:
        """Check for SSL/TLS vulnerabilities"""
        
        vulnerabilities = []
        
        try:
            # Test different SSL/TLS versions
            protocols_to_test = [
                ("SSLv2", ssl.PROTOCOL_SSLv23),
                ("SSLv3", ssl.PROTOCOL_SSLv23),
                ("TLSv1.0", ssl.PROTOCOL_TLSv1),
                ("TLSv1.1", ssl.PROTOCOL_TLSv1_1),
                ("TLSv1.2", ssl.PROTOCOL_TLSv1_2)
            ]
            
            for protocol_name, protocol_const in protocols_to_test:
                if await self._test_ssl_protocol(target, port, protocol_const):
                    if protocol_name in self.ssl_vulnerabilities:
                        vuln_info = self.ssl_vulnerabilities[protocol_name]
                        vulnerabilities.append({
                            "type": "protocol",
                            "name": f"{protocol_name} supported",
                            "severity": vuln_info["severity"],
                            "description": vuln_info["description"],
                            "recommendation": f"Disable {protocol_name} support"
                        })
            
            # Test cipher suites (basic check)
            weak_ciphers = await self._check_weak_ciphers(target, port)
            vulnerabilities.extend(weak_ciphers)
            
        except Exception as e:
            vulnerabilities.append({
                "type": "scan_error",
                "name": "Vulnerability scan failed",
                "severity": "info",
                "description": str(e)
            })
        
        return vulnerabilities
    
    async def _test_ssl_protocol(self, target: str, port: int, protocol: int) -> bool:
        """Test if a specific SSL/TLS protocol is supported"""
        
        try:
            context = ssl.SSLContext(protocol)
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((target, port), timeout=5) as sock:
                with context.wrap_socket(sock) as ssock:
                    return True
        except:
            return False
    
    async def _check_weak_ciphers(self, target: str, port: int) -> List[Dict[str, Any]]:
        """Check for weak cipher suites"""
        
        weak_cipher_vulns = []
        
        try:
            # Get current cipher suite
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((target, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=target) as ssock:
                    cipher_info = ssock.cipher()
                    
                    if cipher_info:
                        cipher_name = cipher_info[0]
                        
                        # Check for weak ciphers
                        if "RC4" in cipher_name:
                            weak_cipher_vulns.append({
                                "type": "cipher",
                                "name": "RC4 cipher in use",
                                "severity": "high",
                                "description": "RC4 cipher is cryptographically broken",
                                "cipher": cipher_name
                            })
                        
                        if "DES" in cipher_name and "3DES" not in cipher_name:
                            weak_cipher_vulns.append({
                                "type": "cipher",
                                "name": "DES cipher in use",
                                "severity": "critical",
                                "description": "DES encryption is weak",
                                "cipher": cipher_name
                            })
                        
                        if "3DES" in cipher_name:
                            weak_cipher_vulns.append({
                                "type": "cipher",
                                "name": "3DES cipher in use",
                                "severity": "medium",
                                "description": "3DES is deprecated",
                                "cipher": cipher_name
                            })
        
        except Exception:
            pass
        
        return weak_cipher_vulns
    
    def _assess_ssl_security(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall SSL security posture"""
        
        assessment = {
            "overall_grade": "A",
            "score": 100,
            "issues": [],
            "recommendations": []
        }
        
        # Check certificate chain
        cert_chain = results.get("certificate_chain", [])
        if not cert_chain:
            assessment["score"] -= 50
            assessment["issues"].append("No valid certificate chain")
            assessment["overall_grade"] = "F"
        else:
            # Check leaf certificate
            leaf_cert = next((cert for cert in cert_chain if cert.get("is_leaf_certificate")), None)
            if leaf_cert:
                validation = leaf_cert.get("validation", {})
                cert_score = validation.get("score", 100)
                assessment["score"] = min(assessment["score"], cert_score)
                
                if leaf_cert.get("is_expired"):
                    assessment["score"] -= 50
                    assessment["issues"].append("Certificate has expired")
        
        # Check vulnerabilities
        vulnerabilities = results.get("vulnerabilities", [])
        for vuln in vulnerabilities:
            severity = vuln.get("severity", "low")
            if severity == "critical":
                assessment["score"] -= 30
            elif severity == "high":
                assessment["score"] -= 20
            elif severity == "medium":
                assessment["score"] -= 10
            elif severity == "low":
                assessment["score"] -= 5
        
        # Determine grade
        if assessment["score"] >= 90:
            assessment["overall_grade"] = "A"
        elif assessment["score"] >= 80:
            assessment["overall_grade"] = "B"
        elif assessment["score"] >= 70:
            assessment["overall_grade"] = "C"
        elif assessment["score"] >= 60:
            assessment["overall_grade"] = "D"
        else:
            assessment["overall_grade"] = "F"
        
        # Generate recommendations
        if vulnerabilities:
            assessment["recommendations"].append("Address identified SSL/TLS vulnerabilities")
        
        if cert_chain and any(cert.get("days_until_expiry", 365) < 30 for cert in cert_chain):
            assessment["recommendations"].append("Renew expiring certificates")
        
        if not results.get("ssl_configuration", {}).get("protocol", "").startswith("TLS"):
            assessment["recommendations"].append("Ensure TLS 1.2 or higher is used")
        
        return assessment
    
    def parse_output(self, raw_output: str) -> Dict[str, Any]:
        """Parse raw output (not used in this implementation)"""
        try:
            return json.loads(raw_output)
        except:
            return {"error": "Failed to parse output", "raw": raw_output}


# Example usage
if __name__ == "__main__":
    async def test_ssl_analyzer():
        tool = SSLAnalyzerTool()
        
        # Test with a target
        inputs = {
            "target": "google.com",
            "port": 443,
            "include_ct_logs": True,
            "check_vulnerabilities": True
        }
        
        result = await tool.run_with_monitoring(inputs)
        print(json.dumps(result.data, indent=2))
    
    asyncio.run(test_ssl_analyzer())