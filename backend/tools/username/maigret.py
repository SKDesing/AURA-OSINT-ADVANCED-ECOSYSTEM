"""
Maigret Tool - Username OSINT sur 2000+ sites
Alternative avancée à Sherlock
"""

import asyncio
import json
import subprocess
from typing import Dict, List, Any
from ..base import BaseTool

class MaigretTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="maigret",
            description="Recherche username sur 2000+ sites web",
            category="username",
            version="0.4.4"
        )
    
    async def execute(self, username: str, **kwargs) -> Dict[str, Any]:
        """
        Exécute Maigret pour rechercher un username
        
        Args:
            username: Nom d'utilisateur à rechercher
            **kwargs: Options supplémentaires
                - timeout: Timeout en secondes (défaut: 300)
                - sites: Liste de sites spécifiques
                - no_color: Désactiver les couleurs
        
        Returns:
            Dict contenant les résultats de la recherche
        """
        try:
            # Paramètres
            timeout = kwargs.get('timeout', 300)
            sites = kwargs.get('sites', [])
            no_color = kwargs.get('no_color', True)
            
            # Construction de la commande
            cmd = ['maigret', username]
            
            if no_color:
                cmd.append('--no-color')
            
            if sites:
                cmd.extend(['--site', ','.join(sites)])
            
            # Format JSON pour parsing
            cmd.extend(['--json', 'simple'])
            
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
                    'username': username,
                    'found_profiles': results['found'],
                    'total_sites': results['total'],
                    'execution_time': results.get('time', 0),
                    'raw_output': stdout.decode()
                }
            else:
                return {
                    'success': False,
                    'error': stderr.decode(),
                    'username': username
                }
                
        except asyncio.TimeoutError:
            return {
                'success': False,
                'error': f'Timeout après {timeout} secondes',
                'username': username
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'username': username
            }
    
    def _parse_results(self, output: str) -> Dict[str, Any]:
        """Parse les résultats Maigret"""
        try:
            # Maigret peut retourner du JSON ou du texte
            lines = output.strip().split('\n')
            found_profiles = []
            total_sites = 0
            
            for line in lines:
                if '[+]' in line and 'http' in line:
                    # Extraction URL et site
                    parts = line.split()
                    url = next((part for part in parts if part.startswith('http')), '')
                    site = url.split('/')[2] if url else 'unknown'
                    
                    found_profiles.append({
                        'site': site,
                        'url': url,
                        'status': 'found'
                    })
                elif 'Total:' in line:
                    # Extraction du total
                    try:
                        total_sites = int(line.split('Total:')[1].strip().split()[0])
                    except:
                        pass
            
            return {
                'found': found_profiles,
                'total': total_sites or len(found_profiles),
                'time': 0
            }
            
        except Exception as e:
            return {
                'found': [],
                'total': 0,
                'error': str(e)
            }
    
    def get_required_params(self) -> List[str]:
        """Paramètres requis"""
        return ['username']
    
    def get_optional_params(self) -> Dict[str, Any]:
        """Paramètres optionnels"""
        return {
            'timeout': 300,
            'sites': [],
            'no_color': True
        }
    
    async def validate_params(self, params: Dict[str, Any]) -> bool:
        """Valide les paramètres"""
        if 'username' not in params:
            return False
        
        username = params['username']
        if not username or len(username) < 2:
            return False
        
        return True