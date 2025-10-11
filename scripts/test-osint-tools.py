#!/usr/bin/env python3
"""
Script de test pour tous les outils OSINT
Vérifie l'intégration et la disponibilité
"""

import asyncio
import sys
import os
sys.path.append('/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend')

from tools.registry import AVAILABLE_TOOLS, TOOL_CONFIGS

class OSINTToolsTester:
    def __init__(self):
        self.results = {}
        self.total_tools = len(AVAILABLE_TOOLS)
        self.passed = 0
        self.failed = 0
    
    async def test_all_tools(self):
        """Test tous les outils OSINT"""
        print("🔍 DÉBUT DES TESTS OUTILS OSINT")
        print(f"📊 Total d'outils à tester: {self.total_tools}")
        print("=" * 60)
        
        for tool_name, tool_class in AVAILABLE_TOOLS.items():
            await self.test_tool(tool_name, tool_class)
        
        self.print_summary()
    
    async def test_tool(self, tool_name: str, tool_class):
        """Test un outil spécifique"""
        try:
            print(f"\n🔧 Test: {tool_name}")
            
            # Instanciation
            tool = tool_class()
            
            # Vérifications de base
            checks = {
                'name': hasattr(tool, 'name'),
                'description': hasattr(tool, 'description'),
                'category': hasattr(tool, 'category'),
                'execute': hasattr(tool, 'execute'),
                'validate_params': hasattr(tool, 'validate_params'),
                'get_required_params': hasattr(tool, 'get_required_params')
            }
            
            # Test des méthodes
            required_params = tool.get_required_params()
            optional_params = tool.get_optional_params() if hasattr(tool, 'get_optional_params') else {}
            
            # Vérification configuration
            config_exists = tool_name in TOOL_CONFIGS
            
            # Résultats
            all_passed = all(checks.values()) and config_exists and len(required_params) > 0
            
            if all_passed:
                print(f"  ✅ {tool_name} - OK")
                self.passed += 1
            else:
                print(f"  ❌ {tool_name} - ÉCHEC")
                if not config_exists:
                    print(f"    - Configuration manquante")
                for check, result in checks.items():
                    if not result:
                        print(f"    - Méthode manquante: {check}")
                self.failed += 1
            
            self.results[tool_name] = {
                'status': 'PASS' if all_passed else 'FAIL',
                'checks': checks,
                'config_exists': config_exists,
                'required_params': required_params,
                'optional_params': optional_params,
                'category': tool.category if hasattr(tool, 'category') else 'unknown'
            }
            
        except Exception as e:
            print(f"  ❌ {tool_name} - ERREUR: {str(e)}")
            self.failed += 1
            self.results[tool_name] = {
                'status': 'ERROR',
                'error': str(e)
            }
    
    def print_summary(self):
        """Affiche le résumé des tests"""
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 60)
        
        print(f"✅ Outils OK: {self.passed}")
        print(f"❌ Outils KO: {self.failed}")
        print(f"📈 Taux de réussite: {(self.passed/self.total_tools)*100:.1f}%")
        
        # Détail par catégorie
        categories = {}
        for tool_name, result in self.results.items():
            if result['status'] in ['PASS', 'FAIL']:
                category = result.get('category', 'unknown')
                if category not in categories:
                    categories[category] = {'pass': 0, 'fail': 0}
                
                if result['status'] == 'PASS':
                    categories[category]['pass'] += 1
                else:
                    categories[category]['fail'] += 1
        
        print("\n📋 DÉTAIL PAR CATÉGORIE:")
        for category, stats in categories.items():
            total = stats['pass'] + stats['fail']
            rate = (stats['pass'] / total) * 100 if total > 0 else 0
            print(f"  {category}: {stats['pass']}/{total} ({rate:.1f}%)")
        
        # Outils en échec
        failed_tools = [name for name, result in self.results.items() if result['status'] != 'PASS']
        if failed_tools:
            print(f"\n❌ OUTILS EN ÉCHEC ({len(failed_tools)}):")
            for tool in failed_tools:
                print(f"  - {tool}")
        
        print("\n🎯 RECOMMANDATIONS:")
        if self.failed == 0:
            print("  🎉 Tous les outils sont opérationnels !")
        else:
            print(f"  🔧 Corriger {self.failed} outils en échec")
            print("  📚 Vérifier la documentation d'intégration")
            print("  🧪 Relancer les tests après corrections")

async def main():
    """Point d'entrée principal"""
    tester = OSINTToolsTester()
    await tester.test_all_tools()

if __name__ == "__main__":
    asyncio.run(main())