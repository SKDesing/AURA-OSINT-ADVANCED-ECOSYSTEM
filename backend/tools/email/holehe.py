import asyncio
import subprocess
import json
from typing import Dict, Any
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class HoleheTool(BaseTool):
    """
    Email OSINT tool using holehe to check if email is registered on 120+ sites
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.EMAIL
        self.required_inputs = ['email']
        self.max_execution_time = 60
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        return 'email' in inputs and '@' in inputs['email']
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        email = inputs['email']
        
        # Execute holehe command
        cmd = ['holehe', '--only-used', '--no-color', email]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd='/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend',
            env={'PATH': '/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend/venv/bin:/usr/bin:/bin'}
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"holehe failed: {stderr.decode()}")
        
        raw_output = stdout.decode()
        parsed_data = self.parse_output(raw_output, email)
        
        return ToolOutput(
            tool_name=self.name,
            category=self.category,
            status=ToolStatus.SUCCESS,
            data=parsed_data,
            metrics=self.metrics,
            raw_output=raw_output,
            confidence_score=0.95
        )
    
    def parse_output(self, raw_output: str, email: str) -> Dict[str, Any]:
        """Parse holehe output"""
        try:
            sites_found = []
            high_value_sites = []
            
            # Parse holehe output line by line
            for line in raw_output.split('\n'):
                if '[+]' in line and email in line:
                    # Extract site name from line like "[+] Email used on example.com"
                    parts = line.split()
                    for part in parts:
                        if '.' in part and not '@' in part:
                            site = part.strip('.,!?')
                            sites_found.append(site)
                            
                            # High value sites
                            if any(hvs in site.lower() for hvs in ['twitter', 'instagram', 'linkedin', 'github', 'facebook']):
                                high_value_sites.append(site)
                            break
            
            # Risk assessment
            total_sites = len(sites_found)
            if total_sites > 20:
                risk_level = "HIGH"
            elif total_sites > 10:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            return {
                "email": email,
                "sites_found": sites_found,
                "total_sites": total_sites,
                "high_value_sites": high_value_sites,
                "data_breach_risk": risk_level,
                "analysis": {
                    "digital_footprint": "extensive" if total_sites > 15 else "moderate" if total_sites > 5 else "minimal",
                    "social_presence": len(high_value_sites) > 0,
                    "professional_presence": any('linkedin' in site.lower() for site in sites_found)
                }
            }
        except Exception as e:
            return {
                "error": f"Failed to parse holehe output: {str(e)}", 
                "raw": raw_output,
                "email": email
            }