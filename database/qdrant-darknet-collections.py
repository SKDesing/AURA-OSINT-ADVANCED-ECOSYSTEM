#!/usr/bin/env python3
"""
Qdrant Collections Setup for Darknet Intelligence
Creates vector collections for darknet OSINT data
"""

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, OptimizersConfigDiff, HnswConfigDiff

def setup_darknet_collections():
    """Setup Qdrant collections for darknet intelligence"""
    
    # Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    collections = [
        {
            "name": "darknet_intel",
            "description": "Darknet sites content and intelligence",
            "size": 768,
            "distance": Distance.COSINE
        },
        {
            "name": "crypto_intel", 
            "description": "Cryptocurrency transactions and addresses",
            "size": 768,
            "distance": Distance.COSINE
        },
        {
            "name": "breach_intel",
            "description": "Data breach information and leaked data",
            "size": 768,
            "distance": Distance.COSINE
        },
        {
            "name": "tor_content",
            "description": "Tor hidden service content analysis",
            "size": 768,
            "distance": Distance.COSINE
        },
        {
            "name": "criminal_entities",
            "description": "Criminal entities and network analysis",
            "size": 768,
            "distance": Distance.COSINE
        }
    ]
    
    for collection in collections:
        try:
            # Check if collection exists
            existing_collections = [c.name for c in client.get_collections().collections]
            
            if collection["name"] in existing_collections:
                print(f"✅ Collection '{collection['name']}' already exists")
                continue
            
            # Create collection
            client.create_collection(
                collection_name=collection["name"],
                vectors_config=VectorParams(
                    size=collection["size"], 
                    distance=collection["distance"]
                ),
                optimizers_config=OptimizersConfigDiff(
                    memmap_threshold=20000,
                    indexing_threshold=20000
                ),
                hnsw_config=HnswConfigDiff(
                    m=16,
                    ef_construct=100,
                    full_scan_threshold=10000,
                    max_indexing_threads=4
                )
            )
            
            print(f"✅ Created collection: {collection['name']}")
            print(f"   Description: {collection['description']}")
            print(f"   Vector size: {collection['size']}")
            print(f"   Distance: {collection['distance']}")
            print()
            
        except Exception as e:
            print(f"❌ Error creating collection {collection['name']}: {e}")
    
    # Verify collections
    print("\n📊 Collection Summary:")
    collections_info = client.get_collections()
    for collection in collections_info.collections:
        if collection.name.endswith('_intel') or collection.name in ['tor_content', 'criminal_entities']:
            info = client.get_collection(collection.name)
            print(f"   {collection.name}: {info.vectors_count} vectors")

def create_sample_data():
    """Create sample data for testing"""
    
    client = QdrantClient(host="localhost", port=6333)
    
    # Sample darknet intelligence
    darknet_samples = [
        {
            "id": 1,
            "vector": [0.1] * 768,  # Mock embedding
            "payload": {
                "onion_url": "http://3g2upl4pq6kufc4m.onion",
                "site_type": "search_engine",
                "risk_level": "low",
                "content": "DuckDuckGo Tor search engine",
                "services": ["http", "https"],
                "timestamp": "2024-01-15T10:30:00Z"
            }
        },
        {
            "id": 2,
            "vector": [0.2] * 768,
            "payload": {
                "onion_url": "http://darkmarket123456.onion",
                "site_type": "marketplace",
                "risk_level": "critical",
                "content": "Dark marketplace for illegal goods",
                "services": ["http", "bitcoin", "escrow"],
                "timestamp": "2024-01-15T11:00:00Z"
            }
        }
    ]
    
    # Sample crypto intelligence
    crypto_samples = [
        {
            "id": 1,
            "vector": [0.3] * 768,
            "payload": {
                "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                "blockchain": "bitcoin",
                "risk_score": 25,
                "cluster_type": "exchange",
                "total_value": 1.5,
                "transaction_count": 47
            }
        }
    ]
    
    # Sample breach intelligence
    breach_samples = [
        {
            "id": 1,
            "vector": [0.4] * 768,
            "payload": {
                "email": "test@example.com",
                "breach_name": "LinkedIn",
                "breach_date": "2012-06-05",
                "records_affected": 164000000,
                "data_classes": ["Email addresses", "Passwords"],
                "risk_level": "high"
            }
        }
    ]
    
    try:
        # Insert sample data
        client.upsert("darknet_intel", darknet_samples)
        client.upsert("crypto_intel", crypto_samples)
        client.upsert("breach_intel", breach_samples)
        
        print("✅ Sample data inserted successfully")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")

if __name__ == "__main__":
    print("🚀 Setting up Qdrant collections for Darknet Intelligence...")
    print("=" * 60)
    
    setup_darknet_collections()
    
    print("\n🔧 Creating sample data for testing...")
    create_sample_data()
    
    print("\n✅ Darknet Qdrant setup completed!")
    print("\nNext steps:")
    print("1. Start Qdrant: docker-compose up qdrant")
    print("2. Run this script: python3 qdrant-darknet-collections.py")
    print("3. Verify in Qdrant dashboard: http://localhost:6333/dashboard")