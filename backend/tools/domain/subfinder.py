"""
Subfinder Tool - Énumération passive de sous-domaines
"""

import asyncio
import json
from typing import Dict, List, Any
from ..base import BaseTool

class SubfinderTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="subfinder",
            description="Énumération passive de sous-domaines",
            category="domain",
            version="2.6.3"
        )
    
    async def execute(self, domain: str, **kwargs) -> Dict[str, Any]:
        """
        Exécute Subfinder pour énumérer les sous-domaines
        
        Args:
            domain: Domaine cible
            **kwargs: Options supplémentaires
                - timeout: Timeout en secondes (défaut: 180)
                - sources: Sources spécifiques à utiliser
                - silent: Mode silencieux
                - recursive: Recherche récursive
        
        Returns:
            Dict contenant les sous-domaines trouvés
        """
        try:
            # Paramètres
            timeout = kwargs.get('timeout', 180)
            sources = kwargs.get('sources', [])
            silent = kwargs.get('silent', True)
            recursive = kwargs.get('recursive', False)
            
            # Construction de la commande
            cmd = ['subfinder', '-d', domain]
            
            if silent:
                cmd.append('-silent')
            
            if recursive:
                cmd.append('-recursive')
            
            if sources:
                cmd.extend(['-sources', ','.join(sources)])
            
            # Format JSON
            cmd.extend(['-o', '/dev/stdout'])
            
            # Exécution
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(), 
                timeout=timeout
            )
            
            # Parsing des résultats
            if process.returncode == 0:
                subdomains = self._parse_subdomains(stdout.decode())
                return {
                    'success': True,
                    'domain': domain,
                    'subdomains': subdomains,
                    'count': len(subdomains),
                    'tool': 'subfinder'
                }
            else:
                return {
                    'success': False,
                    'error': stderr.decode(),
                    'domain': domain
                }
                
        except asyncio.TimeoutError:
            return {
                'success': False,
                'error': f'Timeout après {timeout} secondes',
                'domain': domain
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'domain': domain
            }
    
    def _parse_subdomains(self, output: str) -> List[Dict[str, Any]]:
        """Parse les sous-domaines trouvés"""
        subdomains = []
        
        for line in output.strip().split('\n'):
            line = line.strip()
            if line and '.' in line:
                subdomains.append({
                    'subdomain': line,
                    'source': 'subfinder',
                    'type': 'passive'
                })
        
        return subdomains
    
    def get_required_params(self) -> List[str]:
        """Paramètres requis"""
        return ['domain']
    
    def get_optional_params(self) -> Dict[str, Any]:
        """Paramètres optionnels"""
        return {
            'timeout': 180,
            'sources': [],
            'silent': True,
            'recursive': False
        }
    
    async def validate_params(self, params: Dict[str, Any]) -> bool:
        """Valide les paramètres"""
        if 'domain' not in params:
            return False
        
        domain = params['domain']
        if not domain or '.' not in domain:
            return False
        
        return True