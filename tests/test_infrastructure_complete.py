#!/usr/bin/env python3
"""
Complete Infrastructure Test Suite
Tests all components of the AURA OSINT ecosystem
"""

import os
import sys
import asyncio
import json
import subprocess
import time
from typing import Dict, List, Any, Optional
from datetime import datetime
import requests
import psycopg2
import redis
from qdrant_client import QdrantClient
import yaml

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Color codes for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text: str):
    """Print colored header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")

def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text: str):
    """Print info message"""
    print(f"{Colors.CYAN}ℹ️  {text}{Colors.END}")

class InfrastructureTest:
    """Complete infrastructure test suite"""
    
    def __init__(self):
        self.results = {
            "database": {},
            "cache": {},
            "vector_db": {},
            "tools": {},
            "apis": {},
            "docker": {},
            "files": {}
        }
        self.start_time = time.time()
    
    async def run_all_tests(self):
        """Run all infrastructure tests"""
        print_header("AURA OSINT - INFRASTRUCTURE TEST SUITE")
        print_info(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test order (dependencies first)
        test_methods = [
            ("Database Tests", self.test_database),
            ("Cache Tests", self.test_cache),
            ("Vector Database Tests", self.test_vector_db),
            ("File System Tests", self.test_files),
            ("Docker Tests", self.test_docker),
            ("OSINT Tools Tests", self.test_osint_tools),
            ("API Tests", self.test_apis),
        ]
        
        total_tests = len(test_methods)
        passed_tests = 0
        
        for test_name, test_method in test_methods:
            print_header(test_name)
            try:
                result = await test_method()
                if result:
                    passed_tests += 1
                    print_success(f"{test_name} PASSED")
                else:
                    print_error(f"{test_name} FAILED")
            except Exception as e:
                print_error(f"{test_name} FAILED: {str(e)}")
        
        # Final summary
        self.print_final_summary(passed_tests, total_tests)
    
    async def test_database(self) -> bool:
        """Test PostgreSQL database connectivity and schema"""
        try:
            # Test connection
            conn = psycopg2.connect(
                host="localhost",
                port=5433,
                database="aura_osint",
                user="aura_user",
                password="aura_secure_password_2024"
            )
            cursor = conn.cursor()
            
            print_success("PostgreSQL connection established")
            
            # Test schema exists
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
            expected_tables = [
                'investigations',
                'osint_executions', 
                'email_intelligence',
                'social_profiles',
                'network_intelligence',
                'darknet_findings',
                'crypto_intelligence',
                'phone_intelligence',
                'domain_intelligence',
                'image_intelligence'
            ]
            
            missing_tables = [t for t in expected_tables if t not in tables]
            if missing_tables:
                print_error(f"Missing tables: {missing_tables}")
                self.results["database"]["missing_tables"] = missing_tables
                return False
            
            print_success(f"All {len(expected_tables)} tables exist")
            
            # Test TimescaleDB extension
            cursor.execute("SELECT extname FROM pg_extension WHERE extname = 'timescaledb'")
            if cursor.fetchone():
                print_success("TimescaleDB extension loaded")
            else:
                print_warning("TimescaleDB extension not found")
            
            # Test pgvector extension
            cursor.execute("SELECT extname FROM pg_extension WHERE extname = 'vector'")
            if cursor.fetchone():
                print_success("pgvector extension loaded")
            else:
                print_warning("pgvector extension not found")
            
            # Test PostGIS extension
            cursor.execute("SELECT extname FROM pg_extension WHERE extname = 'postgis'")
            if cursor.fetchone():
                print_success("PostGIS extension loaded")
            else:
                print_warning("PostGIS extension not found")
            
            cursor.close()
            conn.close()
            
            self.results["database"]["status"] = "success"
            self.results["database"]["tables_count"] = len(tables)
            return True
            
        except Exception as e:
            print_error(f"Database test failed: {str(e)}")
            self.results["database"]["status"] = "failed"
            self.results["database"]["error"] = str(e)
            return False
    
    async def test_cache(self) -> bool:
        """Test Redis cache connectivity"""
        try:
            # Test main Redis
            r = redis.Redis(host='localhost', port=6379, db=0)
            r.ping()
            print_success("Redis main instance connected")
            
            # Test set/get
            test_key = "aura_test_key"
            test_value = "aura_test_value"
            r.set(test_key, test_value, ex=60)
            retrieved = r.get(test_key).decode('utf-8')
            
            if retrieved == test_value:
                print_success("Redis read/write test passed")
            else:
                print_error("Redis read/write test failed")
                return False
            
            # Clean up
            r.delete(test_key)
            
            # Test darknet Redis (if available)
            try:
                r_darknet = redis.Redis(host='localhost', port=6380, db=0)
                r_darknet.ping()
                print_success("Redis darknet instance connected")
            except:
                print_warning("Redis darknet instance not available")
            
            self.results["cache"]["status"] = "success"
            return True
            
        except Exception as e:
            print_error(f"Cache test failed: {str(e)}")
            self.results["cache"]["status"] = "failed"
            self.results["cache"]["error"] = str(e)
            return False
    
    async def test_vector_db(self) -> bool:
        """Test Qdrant vector database"""
        try:
            client = QdrantClient(host="localhost", port=6333)
            
            # Test connection
            collections = client.get_collections()
            print_success(f"Qdrant connected - {len(collections.collections)} collections")
            
            # Expected collections
            expected_collections = [
                "email_intelligence",
                "social_profiles", 
                "network_intelligence",
                "darknet_findings",
                "crypto_intelligence",
                "phone_intelligence",
                "domain_intelligence",
                "image_intelligence"
            ]
            
            existing_collections = [c.name for c in collections.collections]
            missing_collections = [c for c in expected_collections if c not in existing_collections]
            
            if missing_collections:
                print_warning(f"Missing collections: {missing_collections}")
                print_info("Run: python database/qdrant-darknet-collections.py")
            else:
                print_success("All expected collections exist")
            
            # Test collection details
            for collection_name in existing_collections:
                if collection_name in expected_collections:
                    try:
                        info = client.get_collection(collection_name)
                        print_info(f"  {collection_name}: {info.points_count} points, {info.config.params.vectors.size}D")
                    except Exception as e:
                        print_warning(f"  {collection_name}: Error getting info - {e}")
            
            self.results["vector_db"]["status"] = "success"
            self.results["vector_db"]["collections_count"] = len(existing_collections)
            return True
            
        except Exception as e:
            print_error(f"Vector DB test failed: {str(e)}")
            self.results["vector_db"]["status"] = "failed"
            self.results["vector_db"]["error"] = str(e)
            return False
    
    async def test_files(self) -> bool:
        """Test critical files exist"""
        try:
            critical_files = [
                "backend/requirements-complete.txt",
                "backend/config/tool-mappings.yaml",
                "database/schema-hybrid-final.sql",
                "database/qdrant-darknet-collections.py",
                "scripts/install-dependencies.sh",
                "backend/utils/database_mapper.py"
            ]
            
            missing_files = []
            for file_path in critical_files:
                if os.path.exists(file_path):
                    print_success(f"Found: {file_path}")
                else:
                    print_error(f"Missing: {file_path}")
                    missing_files.append(file_path)
            
            if missing_files:
                self.results["files"]["missing_files"] = missing_files
                return False
            
            # Test tool mappings YAML
            try:
                with open("backend/config/tool-mappings.yaml", 'r') as f:
                    mappings = yaml.safe_load(f)
                    tools_count = len(mappings.get("tools", {}))
                    print_success(f"Tool mappings loaded: {tools_count} tools configured")
            except Exception as e:
                print_error(f"Tool mappings YAML error: {e}")
                return False
            
            self.results["files"]["status"] = "success"
            return True
            
        except Exception as e:
            print_error(f"Files test failed: {str(e)}")
            self.results["files"]["status"] = "failed"
            return False
    
    async def test_docker(self) -> bool:
        """Test Docker services"""
        try:
            # Check if Docker is running
            result = subprocess.run(["docker", "ps"], capture_output=True, text=True)
            if result.returncode != 0:
                print_error("Docker is not running")
                return False
            
            print_success("Docker is running")
            
            # Parse running containers
            lines = result.stdout.strip().split('\n')[1:]  # Skip header
            containers = []
            
            for line in lines:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 2:
                        containers.append(parts[1])  # Container name/image
            
            print_info(f"Running containers: {len(containers)}")
            
            # Check for AURA OSINT containers
            aura_containers = [c for c in containers if 'aura' in c.lower() or 'postgres' in c.lower() or 'redis' in c.lower() or 'qdrant' in c.lower()]
            
            if aura_containers:
                print_success(f"AURA containers found: {aura_containers}")
            else:
                print_warning("No AURA containers detected")
            
            self.results["docker"]["status"] = "success"
            self.results["docker"]["containers_count"] = len(containers)
            return True
            
        except Exception as e:
            print_error(f"Docker test failed: {str(e)}")
            self.results["docker"]["status"] = "failed"
            return False
    
    async def test_osint_tools(self) -> bool:
        """Test OSINT tools availability"""
        try:
            tools_status = {}
            
            # Test Python packages
            python_tools = [
                ("holehe", "holehe"),
                ("ntscraper", "ntscraper"), 
                ("instaloader", "instaloader"),
                ("shodan", "shodan"),
                ("phonenumbers", "phonenumbers"),
                ("whois", "python-whois"),
                ("face_recognition", "face_recognition"),
                ("stem", "stem"),  # Tor controller
                ("requests", "requests"),
                ("beautifulsoup4", "bs4")
            ]
            
            for tool_name, import_name in python_tools:
                try:
                    __import__(import_name)
                    print_success(f"Python tool: {tool_name}")
                    tools_status[tool_name] = "available"
                except ImportError:
                    print_error(f"Python tool missing: {tool_name}")
                    tools_status[tool_name] = "missing"
            
            # Test system tools
            system_tools = [
                ("nmap", ["nmap", "--version"]),
                ("tor", ["tor", "--version"]),
                ("onionscan", ["onionscan", "--help"])
            ]
            
            for tool_name, cmd in system_tools:
                try:
                    result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
                    if result.returncode == 0:
                        print_success(f"System tool: {tool_name}")
                        tools_status[tool_name] = "available"
                    else:
                        print_error(f"System tool failed: {tool_name}")
                        tools_status[tool_name] = "failed"
                except (subprocess.TimeoutExpired, FileNotFoundError):
                    print_error(f"System tool missing: {tool_name}")
                    tools_status[tool_name] = "missing"
            
            # Check if critical tools are available
            critical_tools = ["holehe", "requests", "phonenumbers"]
            missing_critical = [t for t in critical_tools if tools_status.get(t) != "available"]
            
            if missing_critical:
                print_error(f"Critical tools missing: {missing_critical}")
                self.results["tools"]["missing_critical"] = missing_critical
                return False
            
            available_count = sum(1 for status in tools_status.values() if status == "available")
            total_count = len(tools_status)
            
            print_success(f"Tools available: {available_count}/{total_count}")
            
            self.results["tools"]["status"] = "success"
            self.results["tools"]["available_count"] = available_count
            self.results["tools"]["total_count"] = total_count
            return True
            
        except Exception as e:
            print_error(f"OSINT tools test failed: {str(e)}")
            self.results["tools"]["status"] = "failed"
            return False
    
    async def test_apis(self) -> bool:
        """Test API endpoints"""
        try:
            # Test NestJS backend (if running)
            try:
                response = requests.get("http://localhost:3000/health", timeout=5)
                if response.status_code == 200:
                    print_success("NestJS backend API responding")
                else:
                    print_warning(f"NestJS backend returned {response.status_code}")
            except requests.exceptions.RequestException:
                print_warning("NestJS backend not running (http://localhost:3000)")
            
            # Test FastAPI orchestrator (if running)
            try:
                response = requests.get("http://localhost:8000/health", timeout=5)
                if response.status_code == 200:
                    print_success("FastAPI orchestrator responding")
                else:
                    print_warning(f"FastAPI orchestrator returned {response.status_code}")
            except requests.exceptions.RequestException:
                print_warning("FastAPI orchestrator not running (http://localhost:8000)")
            
            # Test Qdrant API
            try:
                response = requests.get("http://localhost:6333/collections", timeout=5)
                if response.status_code == 200:
                    print_success("Qdrant API responding")
                else:
                    print_warning(f"Qdrant API returned {response.status_code}")
            except requests.exceptions.RequestException:
                print_error("Qdrant API not accessible (http://localhost:6333)")
                return False
            
            self.results["apis"]["status"] = "success"
            return True
            
        except Exception as e:
            print_error(f"APIs test failed: {str(e)}")
            self.results["apis"]["status"] = "failed"
            return False
    
    def print_final_summary(self, passed: int, total: int):
        """Print final test summary"""
        duration = time.time() - self.start_time
        
        print_header("FINAL TEST SUMMARY")
        
        if passed == total:
            print_success(f"ALL TESTS PASSED ({passed}/{total})")
            print_success("🎉 Infrastructure is ready for production!")
        else:
            print_error(f"SOME TESTS FAILED ({passed}/{total})")
            print_warning("⚠️  Please fix the issues before proceeding")
        
        print_info(f"Total duration: {duration:.2f} seconds")
        
        # Detailed results
        print("\n" + Colors.BOLD + "Detailed Results:" + Colors.END)
        for category, result in self.results.items():
            status = result.get("status", "unknown")
            if status == "success":
                print(f"  {Colors.GREEN}✅ {category.title()}{Colors.END}")
            elif status == "failed":
                print(f"  {Colors.RED}❌ {category.title()}{Colors.END}")
                if "error" in result:
                    print(f"     Error: {result['error']}")
            else:
                print(f"  {Colors.YELLOW}⚠️  {category.title()}: {status}{Colors.END}")
        
        # Next steps
        print("\n" + Colors.BOLD + "Next Steps:" + Colors.END)
        if passed == total:
            print("1. Start your OSINT investigations")
            print("2. Monitor system performance")
            print("3. Scale as needed")
        else:
            print("1. Fix failing components")
            print("2. Re-run tests: python tests/test_infrastructure_complete.py")
            print("3. Check logs for detailed errors")
        
        # Save results to file
        results_file = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "duration_seconds": duration,
                "tests_passed": passed,
                "tests_total": total,
                "success_rate": (passed / total) * 100,
                "results": self.results
            }, f, indent=2)
        
        print_info(f"Results saved to: {results_file}")

async def main():
    """Main test runner"""
    tester = InfrastructureTest()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())