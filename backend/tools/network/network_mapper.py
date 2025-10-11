#!/usr/bin/env python3
"""
Network Mapper Tool - Complete Network Intelligence
Combines BGP analysis, ASN mapping, and network topology discovery
"""

import asyncio
import json
import subprocess
from typing import Dict, Any, List, Optional
from datetime import datetime
import requests
import socket
from ipaddress import ip_network, ip_address

from ..base import BaseTool, ToolOutput, ToolCategory, ToolStatus, ToolMetrics


class NetworkMapperTool(BaseTool):
    """
    Advanced Network Mapper combining:
    - BGP route analysis
    - ASN hierarchy mapping
    - Network topology discovery
    - Peer relationship analysis
    - Subnet enumeration
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.NETWORK
        self.name = "network_mapper"
        self.version = "1.0.0"
        self.required_inputs = ["target"]
        self.optional_inputs = ["scan_type", "depth", "include_peers"]
        self.max_execution_time = 180  # 3 minutes
        
        # BGP and ASN APIs
        self.bgp_he_url = "https://bgp.he.net"
        self.ripestat_url = "https://stat.ripe.net/data"
        self.bgptools_url = "https://bgptools.net/api"
        
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        """Validate target (IP, CIDR, or ASN)"""
        target = inputs.get("target", "").strip()
        if not target:
            return False
        
        # Check if it's an IP, CIDR, or ASN
        try:
            # Try IP address
            ip_address(target)
            return True
        except:
            try:
                # Try CIDR notation
                ip_network(target, strict=False)
                return True
            except:
                # Try ASN (AS followed by number)
                if target.upper().startswith('AS') and target[2:].isdigit():
                    return True
                # Try just number (assume ASN)
                if target.isdigit():
                    return True
        
        return False
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        """Execute network mapping analysis"""
        target = inputs["target"].strip()
        scan_type = inputs.get("scan_type", "comprehensive")  # basic, comprehensive, deep
        depth = int(inputs.get("depth", 2))
        include_peers = inputs.get("include_peers", True)
        
        results = {
            "target": target,
            "target_type": self._detect_target_type(target),
            "analysis_timestamp": datetime.now().isoformat(),
            "network_info": {},
            "bgp_analysis": {},
            "asn_hierarchy": {},
            "peer_analysis": {},
            "subnet_discovery": {},
            "topology_map": {}
        }
        
        try:
            # Determine analysis path based on target type
            target_type = results["target_type"]
            
            if target_type == "ip":
                results = await self._analyze_ip(target, results, scan_type, depth)
            elif target_type == "cidr":
                results = await self._analyze_cidr(target, results, scan_type, depth)
            elif target_type == "asn":
                results = await self._analyze_asn(target, results, scan_type, depth)
            
            # Peer analysis if requested
            if include_peers and results.get("network_info", {}).get("asn"):
                results["peer_analysis"] = await self._analyze_peers(
                    results["network_info"]["asn"]
                )
            
            # Generate topology map
            results["topology_map"] = self._generate_topology_map(results)
            
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
    
    def _detect_target_type(self, target: str) -> str:
        """Detect if target is IP, CIDR, or ASN"""
        try:
            ip_address(target)
            return "ip"
        except:
            try:
                ip_network(target, strict=False)
                return "cidr"
            except:
                if target.upper().startswith('AS') or target.isdigit():
                    return "asn"
        return "unknown"
    
    async def _analyze_ip(self, ip: str, results: Dict, scan_type: str, depth: int) -> Dict:
        """Analyze single IP address"""
        
        # Get basic network info
        network_info = await self._get_ip_network_info(ip)
        results["network_info"] = network_info
        
        # BGP analysis
        if network_info.get("asn"):
            results["bgp_analysis"] = await self._get_bgp_info(network_info["asn"])
            
            # ASN hierarchy
            results["asn_hierarchy"] = await self._get_asn_hierarchy(
                network_info["asn"], depth
            )
        
        # Subnet discovery
        if scan_type in ["comprehensive", "deep"]:
            results["subnet_discovery"] = await self._discover_subnets(ip, network_info)
        
        return results
    
    async def _analyze_cidr(self, cidr: str, results: Dict, scan_type: str, depth: int) -> Dict:
        """Analyze CIDR block"""
        
        network = ip_network(cidr, strict=False)
        
        # Sample IPs from the network for analysis
        sample_ips = self._sample_network_ips(network, max_samples=5)
        
        results["network_info"] = {
            "cidr": str(network),
            "network_address": str(network.network_address),
            "broadcast_address": str(network.broadcast_address),
            "num_addresses": network.num_addresses,
            "prefixlen": network.prefixlen,
            "sample_ips": sample_ips
        }
        
        # Analyze first IP for ASN info
        if sample_ips:
            first_ip_info = await self._get_ip_network_info(sample_ips[0])
            results["network_info"].update(first_ip_info)
            
            if first_ip_info.get("asn"):
                results["bgp_analysis"] = await self._get_bgp_info(first_ip_info["asn"])
        
        return results
    
    async def _analyze_asn(self, asn: str, results: Dict, scan_type: str, depth: int) -> Dict:
        """Analyze ASN"""
        
        # Normalize ASN format
        if not asn.upper().startswith('AS'):
            asn = f"AS{asn}"
        
        asn_number = asn[2:] if asn.upper().startswith('AS') else asn
        
        # Get ASN information
        results["network_info"] = await self._get_asn_info(asn_number)
        results["bgp_analysis"] = await self._get_bgp_info(asn_number)
        results["asn_hierarchy"] = await self._get_asn_hierarchy(asn_number, depth)
        
        # Get prefixes announced by this ASN
        if scan_type in ["comprehensive", "deep"]:
            results["subnet_discovery"] = await self._get_asn_prefixes(asn_number)
        
        return results
    
    async def _get_ip_network_info(self, ip: str) -> Dict[str, Any]:
        """Get network information for an IP"""
        info = {}
        
        try:
            # Use multiple sources for robustness
            
            # Try ipinfo.io first (free tier)
            try:
                response = requests.get(f"https://ipinfo.io/{ip}/json", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    info.update({
                        "asn": data.get("org", "").split()[0] if data.get("org") else None,
                        "asn_name": " ".join(data.get("org", "").split()[1:]) if data.get("org") else None,
                        "country": data.get("country"),
                        "region": data.get("region"),
                        "city": data.get("city"),
                        "hostname": data.get("hostname"),
                        "company": data.get("company", {}).get("name") if data.get("company") else None
                    })
            except Exception:
                pass
            
            # Fallback to RIPE Stat API
            if not info.get("asn"):
                try:
                    response = requests.get(
                        f"{self.ripestat_url}/network-info/data.json?resource={ip}",
                        timeout=10
                    )
                    if response.status_code == 200:
                        data = response.json()
                        asns = data.get("data", {}).get("asns", [])
                        if asns:
                            info["asn"] = f"AS{asns[0]}"
                            info["asn_number"] = asns[0]
                except Exception:
                    pass
            
            # Clean up ASN format
            if info.get("asn"):
                asn = info["asn"]
                if asn.startswith("AS"):
                    info["asn_number"] = asn[2:]
                else:
                    info["asn_number"] = asn
                    info["asn"] = f"AS{asn}"
            
        except Exception as e:
            info["error"] = f"Network info lookup failed: {str(e)}"
        
        return info
    
    async def _get_asn_info(self, asn_number: str) -> Dict[str, Any]:
        """Get detailed ASN information"""
        info = {}
        
        try:
            # RIPE Stat ASN overview
            response = requests.get(
                f"{self.ripestat_url}/as-overview/data.json?resource=AS{asn_number}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                info.update({
                    "asn": f"AS{asn_number}",
                    "asn_number": asn_number,
                    "holder": data.get("holder"),
                    "announced": data.get("announced", False),
                    "block": data.get("block", {}),
                    "type": data.get("type")
                })
            
            # Get country and registration info
            response = requests.get(
                f"{self.ripestat_url}/as-overview/data.json?resource=AS{asn_number}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                block_info = data.get("block", {})
                if block_info:
                    info.update({
                        "country": block_info.get("resource"),
                        "name": block_info.get("name"),
                        "description": block_info.get("desc")
                    })
        
        except Exception as e:
            info["error"] = f"ASN info lookup failed: {str(e)}"
        
        return info
    
    async def _get_bgp_info(self, asn_number: str) -> Dict[str, Any]:
        """Get BGP routing information"""
        bgp_info = {}
        
        try:
            # Get announced prefixes
            response = requests.get(
                f"{self.ripestat_url}/announced-prefixes/data.json?resource=AS{asn_number}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                prefixes = data.get("prefixes", [])
                
                bgp_info.update({
                    "announced_prefixes": prefixes[:20],  # Limit to first 20
                    "total_prefixes": len(prefixes),
                    "ipv4_prefixes": len([p for p in prefixes if ":" not in p.get("prefix", "")]),
                    "ipv6_prefixes": len([p for p in prefixes if ":" in p.get("prefix", "")])
                })
            
            # Get routing consistency
            response = requests.get(
                f"{self.ripestat_url}/routing-status/data.json?resource=AS{asn_number}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                bgp_info["routing_status"] = {
                    "visibility": data.get("visibility"),
                    "announced_space": data.get("announced_space")
                }
        
        except Exception as e:
            bgp_info["error"] = f"BGP info lookup failed: {str(e)}"
        
        return bgp_info
    
    async def _get_asn_hierarchy(self, asn_number: str, depth: int) -> Dict[str, Any]:
        """Get ASN hierarchy and relationships"""
        hierarchy = {}
        
        try:
            # Get ASN neighbours (peers)
            response = requests.get(
                f"{self.ripestat_url}/asn-neighbours/data.json?resource=AS{asn_number}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                neighbours = data.get("neighbours", [])
                
                hierarchy.update({
                    "neighbours": neighbours[:10],  # Limit to first 10
                    "total_neighbours": len(neighbours),
                    "left_neighbours": [n for n in neighbours if n.get("type") == "left"],
                    "right_neighbours": [n for n in neighbours if n.get("type") == "right"],
                    "uncertain_neighbours": [n for n in neighbours if n.get("type") == "uncertain"]
                })
            
            # Get upstream/downstream relationships if depth > 1
            if depth > 1:
                # This would require more complex BGP analysis
                # For now, we'll use the neighbours data
                hierarchy["relationship_analysis"] = self._analyze_relationships(
                    hierarchy.get("neighbours", [])
                )
        
        except Exception as e:
            hierarchy["error"] = f"ASN hierarchy lookup failed: {str(e)}"
        
        return hierarchy
    
    async def _analyze_peers(self, asn_number: str) -> Dict[str, Any]:
        """Analyze peering relationships"""
        peer_analysis = {}
        
        try:
            # Get peering information
            response = requests.get(
                f"{self.ripestat_url}/asn-neighbours/data.json?resource=AS{asn_number}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                neighbours = data.get("neighbours", [])
                
                # Analyze peer types
                peer_types = {}
                for neighbour in neighbours:
                    peer_type = neighbour.get("type", "unknown")
                    if peer_type not in peer_types:
                        peer_types[peer_type] = []
                    peer_types[peer_type].append(neighbour)
                
                peer_analysis.update({
                    "peer_distribution": {
                        ptype: len(peers) for ptype, peers in peer_types.items()
                    },
                    "major_peers": neighbours[:5],  # Top 5 peers
                    "peer_countries": list(set([
                        n.get("country") for n in neighbours 
                        if n.get("country")
                    ]))
                })
        
        except Exception as e:
            peer_analysis["error"] = f"Peer analysis failed: {str(e)}"
        
        return peer_analysis
    
    async def _discover_subnets(self, ip: str, network_info: Dict) -> Dict[str, Any]:
        """Discover related subnets"""
        subnet_info = {}
        
        try:
            # Get more specific prefixes
            response = requests.get(
                f"{self.ripestat_url}/more-specifics/data.json?resource={ip}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                prefixes = data.get("prefixes", [])
                
                subnet_info.update({
                    "more_specific_prefixes": prefixes[:10],
                    "total_more_specifics": len(prefixes)
                })
            
            # Get less specific prefixes
            response = requests.get(
                f"{self.ripestat_url}/less-specifics/data.json?resource={ip}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                prefixes = data.get("prefixes", [])
                
                subnet_info.update({
                    "less_specific_prefixes": prefixes,
                    "total_less_specifics": len(prefixes)
                })
        
        except Exception as e:
            subnet_info["error"] = f"Subnet discovery failed: {str(e)}"
        
        return subnet_info
    
    async def _get_asn_prefixes(self, asn_number: str) -> Dict[str, Any]:
        """Get all prefixes announced by ASN"""
        prefix_info = {}
        
        try:
            response = requests.get(
                f"{self.ripestat_url}/announced-prefixes/data.json?resource=AS{asn_number}",
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json().get("data", {})
                prefixes = data.get("prefixes", [])
                
                # Analyze prefixes
                ipv4_prefixes = [p for p in prefixes if ":" not in p.get("prefix", "")]
                ipv6_prefixes = [p for p in prefixes if ":" in p.get("prefix", "")]
                
                prefix_info.update({
                    "all_prefixes": prefixes[:50],  # Limit to first 50
                    "total_prefixes": len(prefixes),
                    "ipv4_prefixes": len(ipv4_prefixes),
                    "ipv6_prefixes": len(ipv6_prefixes),
                    "prefix_summary": {
                        "smallest_ipv4": min([p.get("prefix", "").split("/")[1] for p in ipv4_prefixes if "/" in p.get("prefix", "")], default=None),
                        "largest_ipv4": max([p.get("prefix", "").split("/")[1] for p in ipv4_prefixes if "/" in p.get("prefix", "")], default=None)
                    }
                })
        
        except Exception as e:
            prefix_info["error"] = f"ASN prefix lookup failed: {str(e)}"
        
        return prefix_info
    
    def _sample_network_ips(self, network, max_samples: int = 5) -> List[str]:
        """Sample IPs from a network for analysis"""
        ips = []
        
        try:
            # For small networks, sample all
            if network.num_addresses <= max_samples:
                ips = [str(ip) for ip in network.hosts()]
            else:
                # Sample strategically: first, last, middle, and random
                hosts = list(network.hosts())
                ips.append(str(hosts[0]))  # First
                ips.append(str(hosts[-1]))  # Last
                ips.append(str(hosts[len(hosts)//2]))  # Middle
                
                # Add random samples
                import random
                remaining = max_samples - 3
                if remaining > 0:
                    random_hosts = random.sample(hosts[1:-1], min(remaining, len(hosts)-2))
                    ips.extend([str(ip) for ip in random_hosts])
        
        except Exception:
            # Fallback for networks without hosts (like /31, /32)
            ips = [str(network.network_address)]
        
        return ips
    
    def _analyze_relationships(self, neighbours: List[Dict]) -> Dict[str, Any]:
        """Analyze ASN relationships"""
        analysis = {
            "upstream_providers": [],
            "downstream_customers": [],
            "peers": [],
            "relationship_summary": {}
        }
        
        for neighbour in neighbours:
            rel_type = neighbour.get("type", "unknown")
            asn = neighbour.get("asn")
            
            if rel_type == "left":
                analysis["upstream_providers"].append(asn)
            elif rel_type == "right":
                analysis["downstream_customers"].append(asn)
            else:
                analysis["peers"].append(asn)
        
        analysis["relationship_summary"] = {
            "total_upstreams": len(analysis["upstream_providers"]),
            "total_downstreams": len(analysis["downstream_customers"]),
            "total_peers": len(analysis["peers"]),
            "tier_estimation": self._estimate_tier(analysis)
        }
        
        return analysis
    
    def _estimate_tier(self, relationships: Dict) -> str:
        """Estimate ASN tier based on relationships"""
        upstreams = relationships.get("total_upstreams", 0)
        downstreams = relationships.get("total_downstreams", 0)
        peers = relationships.get("total_peers", 0)
        
        if upstreams == 0 and downstreams > 100:
            return "Tier 1"
        elif upstreams <= 2 and downstreams > 10:
            return "Tier 2"
        elif upstreams <= 5 and downstreams > 0:
            return "Tier 3"
        else:
            return "End User / Small ISP"
    
    def _generate_topology_map(self, results: Dict) -> Dict[str, Any]:
        """Generate network topology visualization data"""
        topology = {
            "nodes": [],
            "edges": [],
            "clusters": []
        }
        
        try:
            # Add main target node
            target_asn = results.get("network_info", {}).get("asn")
            if target_asn:
                topology["nodes"].append({
                    "id": target_asn,
                    "label": results.get("network_info", {}).get("asn_name", target_asn),
                    "type": "target",
                    "country": results.get("network_info", {}).get("country"),
                    "size": 20
                })
                
                # Add neighbour nodes
                neighbours = results.get("asn_hierarchy", {}).get("neighbours", [])
                for neighbour in neighbours[:10]:  # Limit for visualization
                    neighbour_asn = f"AS{neighbour.get('asn')}"
                    topology["nodes"].append({
                        "id": neighbour_asn,
                        "label": neighbour_asn,
                        "type": neighbour.get("type", "peer"),
                        "country": neighbour.get("country"),
                        "size": 10
                    })
                    
                    # Add edge
                    topology["edges"].append({
                        "source": target_asn,
                        "target": neighbour_asn,
                        "type": neighbour.get("type", "peer"),
                        "weight": 1
                    })
        
        except Exception as e:
            topology["error"] = f"Topology generation failed: {str(e)}"
        
        return topology
    
    def parse_output(self, raw_output: str) -> Dict[str, Any]:
        """Parse raw output (not used in this implementation)"""
        try:
            return json.loads(raw_output)
        except:
            return {"error": "Failed to parse output", "raw": raw_output}


# Example usage
if __name__ == "__main__":
    async def test_network_mapper():
        tool = NetworkMapperTool()
        
        # Test with different target types
        test_cases = [
            {"target": "8.8.8.8", "scan_type": "comprehensive"},  # IP
            {"target": "192.168.1.0/24", "scan_type": "basic"},   # CIDR
            {"target": "AS15169", "scan_type": "deep", "depth": 2}  # ASN (Google)
        ]
        
        for inputs in test_cases:
            print(f"\n=== Testing {inputs['target']} ===")
            result = await tool.run_with_monitoring(inputs)
            print(json.dumps(result.data, indent=2))
    
    asyncio.run(test_network_mapper())