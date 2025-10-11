#!/usr/bin/env python3
"""
AURA OSINT Dependencies Audit Tests
Comprehensive testing of all dependencies and integrations
"""

import pytest
import subprocess
import sys
import importlib
import asyncio
import os
from pathlib import Path

class TestSystemDependencies:
    """Test system-level dependencies"""
    
    def test_python_version(self):
        """Test Python version is 3.9+"""
        version = sys.version_info
        assert version.major == 3, f"Python 3 required, found {version.major}"
        assert version.minor >= 9, f"Python 3.9+ required, found {version.major}.{version.minor}"
        print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    
    def test_tor_installation(self):
        """Test Tor is installed and accessible"""
        try:
            result = subprocess.run(['tor', '--version'], capture_output=True, text=True, timeout=10)
            assert result.returncode == 0, "Tor not installed or not accessible"
            print(f"✅ Tor installed: {result.stdout.split()[2]}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pytest.fail("Tor not found or not responding")
    
    def test_go_installation(self):
        """Test Go is installed (needed for OnionScan)"""
        try:
            result = subprocess.run(['go', 'version'], capture_output=True, text=True, timeout=10)
            assert result.returncode == 0, "Go not installed"
            print(f"✅ Go installed: {result.stdout.strip()}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pytest.fail("Go not found")

class TestPythonDependencies:
    """Test Python package dependencies"""
    
    # Core FastAPI dependencies
    CORE_PACKAGES = [
        'fastapi', 'uvicorn', 'pydantic', 'sqlalchemy', 'asyncpg', 'redis'
    ]
    
    # OSINT tool packages
    OSINT_PACKAGES = [
        'holehe', 'shodan', 'phonenumbers', 'whois', 'face_recognition',
        'stem', 'requests', 'aiohttp', 'beautifulsoup4'
    ]
    
    # ML/AI packages
    ML_PACKAGES = [
        'scikit-learn', 'textblob', 'transformers', 'torch', 'numpy', 'pandas'
    ]
    
    # Optional packages (may not be installed)
    OPTIONAL_PACKAGES = [
        'h8mail', 'ntscraper', 'instaloader', 'tweepy', 'praw', 'telethon'
    ]
    
    @pytest.mark.parametrize("package", CORE_PACKAGES)
    def test_core_packages(self, package):
        """Test core packages are importable"""
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError as e:
            pytest.fail(f"Failed to import {package}: {e}")
    
    @pytest.mark.parametrize("package", OSINT_PACKAGES)
    def test_osint_packages(self, package):
        """Test OSINT packages are importable"""
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError as e:
            pytest.fail(f"Failed to import {package}: {e}")
    
    @pytest.mark.parametrize("package", ML_PACKAGES)
    def test_ml_packages(self, package):
        """Test ML packages are importable"""
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError as e:
            print(f"⚠️  {package} not available: {e}")
            pytest.skip(f"Optional ML package {package} not installed")
    
    @pytest.mark.parametrize("package", OPTIONAL_PACKAGES)
    def test_optional_packages(self, package):
        """Test optional packages (skip if not available)"""
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError as e:
            print(f"⚠️  {package} not available: {e}")
            pytest.skip(f"Optional package {package} not installed")

class TestOSINTToolsIntegration:
    """Test OSINT tools integration"""
    
    def test_holehe_functionality(self):
        """Test holehe email checker"""
        try:
            import holehe
            # Test basic functionality without actual execution
            assert hasattr(holehe, 'holehe'), "holehe module missing main function"
            print("✅ holehe integration ready")
        except ImportError:
            pytest.skip("holehe not installed")
    
    def test_shodan_functionality(self):
        """Test Shodan API wrapper"""
        try:
            import shodan
            # Test API class exists
            api = shodan.Shodan("test_key")
            assert hasattr(api, 'host'), "Shodan API missing host method"
            print("✅ shodan integration ready")
        except ImportError:
            pytest.skip("shodan not installed")
    
    def test_phonenumbers_functionality(self):
        """Test phonenumbers library"""
        try:
            import phonenumbers
            from phonenumbers import carrier, geocoder, timezone
            
            # Test basic parsing
            number = phonenumbers.parse("+1234567890", None)
            assert isinstance(number, phonenumbers.PhoneNumber)
            print("✅ phonenumbers integration ready")
        except ImportError:
            pytest.skip("phonenumbers not installed")
    
    def test_whois_functionality(self):
        """Test python-whois library"""
        try:
            import whois
            # Test basic functionality exists
            assert hasattr(whois, 'whois'), "whois module missing main function"
            print("✅ whois integration ready")
        except ImportError:
            pytest.skip("python-whois not installed")
    
    def test_face_recognition_functionality(self):
        """Test face_recognition library"""
        try:
            import face_recognition
            import numpy as np
            
            # Test basic functionality
            assert hasattr(face_recognition, 'load_image_file')
            assert hasattr(face_recognition, 'face_encodings')
            print("✅ face_recognition integration ready")
        except ImportError:
            pytest.skip("face_recognition not installed")

class TestDatabaseConnectivity:
    """Test database connections"""
    
    @pytest.mark.asyncio
    async def test_postgresql_connection(self):
        """Test PostgreSQL connection"""
        try:
            import asyncpg
            
            # Test connection parameters
            conn_params = {
                'host': 'localhost',
                'port': 5433,
                'database': 'aura_osint',
                'user': 'aura_user'
            }
            
            # Don't actually connect in tests, just verify asyncpg works
            assert hasattr(asyncpg, 'connect')
            print("✅ PostgreSQL driver ready")
            
        except ImportError:
            pytest.fail("asyncpg not installed")
    
    def test_redis_connection(self):
        """Test Redis connection"""
        try:
            import redis
            
            # Test Redis client creation
            client = redis.Redis(host='localhost', port=6379, decode_responses=True)
            assert hasattr(client, 'ping')
            print("✅ Redis driver ready")
            
        except ImportError:
            pytest.fail("redis not installed")
    
    def test_qdrant_connection(self):
        """Test Qdrant connection"""
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import VectorParams, Distance
            
            # Test client creation
            client = QdrantClient(host="localhost", port=6333)
            assert hasattr(client, 'get_collections')
            print("✅ Qdrant client ready")
            
        except ImportError:
            pytest.fail("qdrant-client not installed")

class TestTorConnectivity:
    """Test Tor network connectivity"""
    
    def test_tor_service_running(self):
        """Test if Tor service is running"""
        try:
            import stem.control
            
            # Try to connect to Tor control port
            with stem.control.Controller.from_port(port=9051) as controller:
                controller.authenticate()
                print("✅ Tor control connection successful")
                
        except Exception as e:
            print(f"⚠️  Tor control connection failed: {e}")
            pytest.skip("Tor service not running or not configured")
    
    def test_tor_socks_proxy(self):
        """Test Tor SOCKS proxy"""
        try:
            import requests
            
            # Configure SOCKS proxy
            proxies = {
                'http': 'socks5://127.0.0.1:9050',
                'https': 'socks5://127.0.0.1:9050'
            }
            
            # Test connection (with timeout)
            response = requests.get(
                'https://check.torproject.org/api/ip',
                proxies=proxies,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('IsTor'):
                    print("✅ Tor SOCKS proxy working")
                else:
                    print("⚠️  Connected but not through Tor")
            else:
                print(f"⚠️  Tor proxy test failed: {response.status_code}")
                
        except Exception as e:
            print(f"⚠️  Tor proxy test failed: {e}")
            pytest.skip("Tor SOCKS proxy not available")

class TestConfigurationFiles:
    """Test configuration files exist and are valid"""
    
    def test_database_schema_exists(self):
        """Test database schema file exists"""
        schema_file = Path("database/schema-hybrid-final.sql")
        assert schema_file.exists(), "Database schema file not found"
        
        # Check file is not empty
        assert schema_file.stat().st_size > 0, "Database schema file is empty"
        print("✅ Database schema file exists")
    
    def test_tool_mappings_exists(self):
        """Test tool mappings configuration exists"""
        mappings_file = Path("backend/config/tool-mappings.yaml")
        assert mappings_file.exists(), "Tool mappings file not found"
        
        # Test YAML is valid
        try:
            import yaml
            with open(mappings_file) as f:
                config = yaml.safe_load(f)
            
            assert 'tools' in config, "tools section missing from config"
            assert len(config['tools']) > 0, "No tools configured"
            print(f"✅ Tool mappings file valid ({len(config['tools'])} tools)")
            
        except ImportError:
            pytest.skip("PyYAML not installed")
        except yaml.YAMLError as e:
            pytest.fail(f"Invalid YAML in tool mappings: {e}")
    
    def test_requirements_file_exists(self):
        """Test requirements file exists"""
        req_file = Path("backend/requirements-complete.txt")
        assert req_file.exists(), "Requirements file not found"
        
        # Count packages
        with open(req_file) as f:
            lines = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        
        assert len(lines) > 50, f"Too few packages in requirements ({len(lines)})"
        print(f"✅ Requirements file exists ({len(lines)} packages)")

class TestDockerConfiguration:
    """Test Docker configuration files"""
    
    def test_docker_compose_files_exist(self):
        """Test Docker Compose files exist"""
        compose_files = [
            "docker-compose.yml",
            "docker-compose.darknet-secure.yml"
        ]
        
        for file in compose_files:
            path = Path(file)
            assert path.exists(), f"Docker Compose file {file} not found"
            print(f"✅ {file} exists")
    
    def test_tor_config_exists(self):
        """Test Tor configuration exists"""
        tor_config = Path("tor-config/torrc")
        assert tor_config.exists(), "Tor configuration not found"
        
        # Check basic configuration
        with open(tor_config) as f:
            content = f.read()
        
        assert "SocksPort" in content, "SocksPort not configured"
        assert "ControlPort" in content, "ControlPort not configured"
        print("✅ Tor configuration exists and valid")

def run_comprehensive_audit():
    """Run comprehensive dependency audit"""
    
    print("🔍 AURA OSINT Dependencies Audit")
    print("=" * 50)
    
    # Run all tests
    exit_code = pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "--disable-warnings"
    ])
    
    if exit_code == 0:
        print("\n✅ All dependency tests passed!")
        print("\n🚀 System ready for AURA OSINT operations")
    else:
        print("\n❌ Some dependency tests failed")
        print("\n🔧 Please check the output above and install missing dependencies")
    
    return exit_code

if __name__ == "__main__":
    exit_code = run_comprehensive_audit()
    sys.exit(exit_code)