"""
PhoneInfoga Tool - OSINT téléphonique avancé
"""

import asyncio
import json
from typing import Dict, List, Any
from ..base import BaseTool

class PhoneInfogaTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="phoneinfoga",
            description="OSINT téléphonique avancé",
            category="phone",
            version="2.10.0"
        )
    
    async def execute(self, phone_number: str, **kwargs) -> Dict[str, Any]:
        """
        Exécute PhoneInfoga pour analyser un numéro de téléphone
        
        Args:
            phone_number: Numéro de téléphone à analyser
            **kwargs: Options supplémentaires
                - timeout: Timeout en secondes (défaut: 120)
                - scanner: Type de scanner (all, local, numverify, etc.)
        
        Returns:
            Dict contenant les informations du numéro
        """
        try:
            # Paramètres
            timeout = kwargs.get('timeout', 120)
            scanner = kwargs.get('scanner', 'all')
            
            # Construction de la commande
            cmd = ['phoneinfoga', 'scan', '-n', phone_number]
            
            if scanner != 'all':
                cmd.extend(['-s', scanner])
            
            # Format JSON
            cmd.extend(['--format', 'json'])
            
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
                results = self._parse_results(stdout.decode())
                return {
                    'success': True,
                    'phone_number': phone_number,
                    'results': results,
                    'tool': 'phoneinfoga'
                }
            else:
                return {
                    'success': False,
                    'error': stderr.decode(),
                    'phone_number': phone_number
                }
                
        except asyncio.TimeoutError:
            return {
                'success': False,
                'error': f'Timeout après {timeout} secondes',
                'phone_number': phone_number
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'phone_number': phone_number
            }
    
    def _parse_results(self, output: str) -> Dict[str, Any]:
        """Parse les résultats PhoneInfoga"""
        try:
            # Essayer de parser le JSON
            data = json.loads(output)
            
            results = {
                'valid': data.get('valid', False),
                'country': data.get('country', ''),
                'country_code': data.get('countryCode', ''),
                'carrier': data.get('carrier', ''),
                'line_type': data.get('lineType', ''),
                'international_format': data.get('internationalFormat', ''),
                'national_format': data.get('nationalFormat', ''),
                'possible': data.get('possible', False),
                'local_format': data.get('localFormat', ''),
                'timezone': data.get('timezone', [])
            }
            
            return results
            
        except json.JSONDecodeError:
            # Fallback: parsing texte
            lines = output.strip().split('\n')
            results = {}
            
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    results[key.strip().lower().replace(' ', '_')] = value.strip()
            
            return results
    
    def get_required_params(self) -> List[str]:
        """Paramètres requis"""
        return ['phone_number']
    
    def get_optional_params(self) -> Dict[str, Any]:
        """Paramètres optionnels"""
        return {
            'timeout': 120,
            'scanner': 'all'
        }
    
    async def validate_params(self, params: Dict[str, Any]) -> bool:
        """Valide les paramètres"""
        if 'phone_number' not in params:
            return False
        
        phone_number = params['phone_number']
        if not phone_number or len(phone_number) < 8:
            return False
        
        return True