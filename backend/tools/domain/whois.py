import whois
import dns.resolver
from typing import Dict, Any
from datetime import datetime
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class WhoisTool(BaseTool):
    """
    Domain OSINT tool using python-whois for domain registration and DNS information
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.DOMAIN
        self.required_inputs = ['domain']
        self.max_execution_time = 45
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        domain = inputs.get('domain', '')
        return domain and '.' in domain and len(domain) > 3
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        domain = inputs['domain'].strip().lower()
        
        try:
            # WHOIS lookup
            domain_info = whois.whois(domain)
            
            # DNS records lookup
            dns_records = await self._get_dns_records(domain)
            
            # Parse dates
            creation_date = self._parse_date(domain_info.creation_date)
            expiration_date = self._parse_date(domain_info.expiration_date)
            updated_date = self._parse_date(domain_info.updated_date)
            
            # Extract contact information
            registrant_info = self._extract_contact_info(domain_info)\n            \n            parsed_data = {\n                \"domain\": domain,\n                \"registrar\": domain_info.registrar,\n                \"registrant_name\": registrant_info.get('name'),\n                \"registrant_email\": registrant_info.get('email'),\n                \"registrant_phone\": registrant_info.get('phone'),\n                \"registrant_organization\": registrant_info.get('organization'),\n                \"creation_date\": creation_date.isoformat() if creation_date else None,\n                \"expiration_date\": expiration_date.isoformat() if expiration_date else None,\n                \"last_updated\": updated_date.isoformat() if updated_date else None,\n                \"name_servers\": domain_info.name_servers or [],\n                \"dns_records\": dns_records,\n                \"status\": domain_info.status or [],\n                \"analysis\": {\n                    \"age_days\": (datetime.now() - creation_date).days if creation_date else None,\n                    \"expires_soon\": self._expires_soon(expiration_date),\n                    \"privacy_protected\": self._is_privacy_protected(registrant_info),\n                    \"risk_level\": self._assess_risk(domain_info, creation_date)\n                }\n            }\n            \n            return ToolOutput(\n                tool_name=self.name,\n                category=self.category,\n                status=ToolStatus.SUCCESS,\n                data=parsed_data,\n                metrics=self.metrics,\n                raw_output=str(domain_info),\n                confidence_score=0.90\n            )\n            \n        except Exception as e:\n            error_data = {\n                \"error\": f\"WHOIS lookup failed: {str(e)}\",\n                \"domain\": domain,\n                \"analysis\": {\n                    \"risk_level\": \"unknown\"\n                }\n            }\n            \n            return ToolOutput(\n                tool_name=self.name,\n                category=self.category,\n                status=ToolStatus.FAILED,\n                data=error_data,\n                metrics=self.metrics,\n                raw_output=str(e),\n                confidence_score=0.0\n            )\n    \n    async def _get_dns_records(self, domain: str) -> Dict[str, Any]:\n        \"\"\"Get DNS records for domain\"\"\"\n        dns_info = {}\n        \n        record_types = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME']\n        \n        for record_type in record_types:\n            try:\n                answers = dns.resolver.resolve(domain, record_type)\n                dns_info[record_type] = [str(rdata) for rdata in answers]\n            except:\n                dns_info[record_type] = []\n        \n        return dns_info\n    \n    def _parse_date(self, date_value):\n        \"\"\"Parse date from whois response\"\"\"\n        if not date_value:\n            return None\n        \n        if isinstance(date_value, list):\n            date_value = date_value[0]\n        \n        if isinstance(date_value, datetime):\n            return date_value\n        \n        return None\n    \n    def _extract_contact_info(self, domain_info) -> Dict[str, str]:\n        \"\"\"Extract contact information from whois data\"\"\"\n        return {\n            'name': getattr(domain_info, 'name', None),\n            'email': getattr(domain_info, 'emails', [None])[0] if getattr(domain_info, 'emails', None) else None,\n            'phone': getattr(domain_info, 'phone', None),\n            'organization': getattr(domain_info, 'org', None)\n        }\n    \n    def _expires_soon(self, expiration_date) -> bool:\n        \"\"\"Check if domain expires within 30 days\"\"\"\n        if not expiration_date:\n            return False\n        \n        days_until_expiry = (expiration_date - datetime.now()).days\n        return days_until_expiry <= 30\n    \n    def _is_privacy_protected(self, registrant_info) -> bool:\n        \"\"\"Check if domain has privacy protection\"\"\"\n        privacy_indicators = ['privacy', 'protected', 'whoisguard', 'private']\n        \n        for field in registrant_info.values():\n            if field and isinstance(field, str):\n                if any(indicator in field.lower() for indicator in privacy_indicators):\n                    return True\n        \n        return False\n    \n    def _assess_risk(self, domain_info, creation_date) -> str:\n        \"\"\"Assess domain risk level\"\"\"\n        risk_factors = 0\n        \n        # Very new domain\n        if creation_date and (datetime.now() - creation_date).days < 30:\n            risk_factors += 2\n        \n        # No registrant info\n        if not getattr(domain_info, 'name', None):\n            risk_factors += 1\n        \n        # Suspicious registrar\n        registrar = getattr(domain_info, 'registrar', '')\n        if registrar and any(sus in registrar.lower() for sus in ['namecheap', 'godaddy']):\n            risk_factors += 0  # These are legitimate but commonly used by bad actors\n        \n        if risk_factors >= 3:\n            return \"high\"\n        elif risk_factors >= 1:\n            return \"medium\"\n        else:\n            return \"low\"