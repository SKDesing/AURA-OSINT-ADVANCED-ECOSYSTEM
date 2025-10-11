#!/usr/bin/env python3
"""
Sherlock Tool Integration for AURA OSINT
Recherche de comptes utilisateur sur 400+ plateformes
"""

import subprocess
import json
import asyncio
from typing import Dict, List, Any
from ..base import BaseTool

class SherlockTool(BaseTool):
    def __init__(self):
        super().__init__()
        self.name = "sherlock"
        self.description = "Recherche de comptes utilisateur sur 400+ plateformes"
        self.category = "username"
        self.version = "0.15.0"
        
    async def execute(self, username: str, **kwargs) -> Dict[str, Any]:
        """Exécute Sherlock pour rechercher un username"""
        try:
            cmd = [
                "python3", "/opt/osint-tools/sherlock/sherlock.py",
                username, "--json", "--timeout", "10"
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                results = json.loads(stdout.decode())
                
                formatted_results = {
                    "username": username,
                    "found_accounts": [],
                    "total_found": 0
                }
                
                for site, data in results.items():
                    if data.get("status") == "Claimed":
                        formatted_results["found_accounts"].append({
                            "platform": site,
                            "url": data.get("url_user", ""),
                            "response_time": data.get("query_time", 0)
                        })
                
                formatted_results["total_found"] = len(formatted_results["found_accounts"])
                
                return {
                    "success": True,
                    "tool": self.name,
                    "target": username,
                    "results": formatted_results
                }
            else:
                return {
                    "success": False,
                    "tool": self.name,
                    "target": username,
                    "error": stderr.decode()
                }
                
        except Exception as e:
            return {
                "success": False,
                "tool": self.name,
                "target": username,
                "error": str(e)
            }