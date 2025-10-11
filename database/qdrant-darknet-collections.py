#!/usr/bin/env python3
"""
Qdrant Collections Setup for Darknet OSINT
Creates vector collections for all OSINT intelligence types
"""

import sys
import os
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams, 
    Distance, 
    CollectionStatus,
    OptimizersConfigDiff,
    HnswConfigDiff,
    ScalarQuantization,
    ScalarQuantizationConfig,
    ScalarType
)

# Configuration
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
VECTOR_SIZE = 768  # Sentence Transformers dimension
DISTANCE_METRIC = Distance.COSINE

# Collection configurations
COLLECTIONS_CONFIG = {
    "email_intelligence": {
        "description": "Email OSINT embeddings (holehe, h8mail)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "email": "keyword",
            "investigation_id": "keyword", 
            "tool_name": "keyword",
            "sites_found": "keyword",
            "breach_count": "integer",
            "risk_level": "keyword",
            "created_at": "datetime"
        }
    },
    
    "social_profiles": {
        "description": "Social media profiles embeddings (twitter, instagram)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "platform": "keyword",
            "username": "keyword",
            "investigation_id": "keyword",
            "display_name": "text",
            "bio": "text",
            "followers_count": "integer",
            "bot_probability": "float",
            "sentiment_score": "float",
            "created_at": "datetime"
        }
    },
    
    "network_intelligence": {
        "description": "Network and IP intelligence embeddings (shodan, ip_intelligence)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "ip_address": "keyword",
            "investigation_id": "keyword",
            "asn": "integer",
            "country_code": "keyword",
            "threat_level": "keyword",
            "ports_open": "integer",
            "services": "text",
            "created_at": "datetime"
        }
    },
    
    "darknet_findings": {
        "description": "Darknet OSINT embeddings (onionscan, torbot)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "onion_url": "keyword",
            "investigation_id": "keyword",
            "site_type": "keyword",
            "risk_level": "keyword",
            "services_detected": "text",
            "content_classification": "text",
            "vulnerabilities": "text",
            "created_at": "datetime"
        }
    },
    
    "crypto_intelligence": {
        "description": "Cryptocurrency intelligence embeddings (blockchain analysis)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "blockchain": "keyword",
            "address": "keyword",
            "investigation_id": "keyword",
            "total_received": "float",
            "balance": "float",
            "risk_score": "integer",
            "cluster_id": "keyword",
            "aml_flags": "text",
            "created_at": "datetime"
        }
    },
    
    "phone_intelligence": {
        "description": "Phone number intelligence embeddings (phonenumbers)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "phone_number": "keyword",
            "investigation_id": "keyword",
            "country_code": "keyword",
            "carrier": "keyword",
            "is_valid": "bool",
            "location_data": "text",
            "osint_data": "text",
            "created_at": "datetime"
        }
    },
    
    "domain_intelligence": {
        "description": "Domain intelligence embeddings (whois, dns)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "domain": "keyword",
            "investigation_id": "keyword",
            "registrar": "keyword",
            "creation_date": "datetime",
            "expiration_date": "datetime",
            "dns_records": "text",
            "historical_data": "text",
            "created_at": "datetime"
        }
    },
    
    "image_intelligence": {
        "description": "Image intelligence embeddings (face_recognition, reverse search)",
        "vector_size": VECTOR_SIZE,
        "distance": DISTANCE_METRIC,
        "payload_schema": {
            "image_url": "keyword",
            "investigation_id": "keyword",
            "faces_detected": "text",
            "metadata": "text",
            "reverse_search_results": "text",
            "created_at": "datetime"
        }
    }
}

def create_qdrant_client() -> QdrantClient:
    """Create Qdrant client with error handling"""
    try:
        client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        
        # Test connection
        collections = client.get_collections()
        print(f"✅ Connected to Qdrant at {QDRANT_HOST}:{QDRANT_PORT}")
        print(f"📊 Current collections: {len(collections.collections)}")
        
        return client
    
    except Exception as e:
        print(f"❌ Failed to connect to Qdrant: {e}")
        print(f"💡 Make sure Qdrant is running on {QDRANT_HOST}:{QDRANT_PORT}")
        print("   Docker: docker run -p 6333:6333 qdrant/qdrant")
        sys.exit(1)

def collection_exists(client: QdrantClient, collection_name: str) -> bool:
    """Check if collection exists"""
    try:
        collections = client.get_collections()
        return any(coll.name == collection_name for coll in collections.collections)
    except:
        return False

def create_collection(client: QdrantClient, name: str, config: Dict[str, Any]) -> bool:
    """Create a single collection with optimized settings"""
    try:
        print(f"🔄 Creating collection: {name}")
        
        # Optimized HNSW configuration for OSINT workloads
        hnsw_config = HnswConfigDiff(
            m=16,                    # Number of bi-directional links for each node
            ef_construct=200,        # Size of the dynamic candidate list
            full_scan_threshold=10000,  # Threshold for full scan vs HNSW
            max_indexing_threads=0   # Use all available threads
        )
        
        # Optimizers configuration
        optimizers_config = OptimizersConfigDiff(
            deleted_threshold=0.2,      # Threshold for deleted vectors cleanup
            vacuum_min_vector_number=1000,  # Minimum vectors before vacuum
            default_segment_number=0,   # Auto-determine segment number
            max_segment_size=None,      # No limit on segment size
            memmap_threshold=None,      # Use default memmap threshold
            indexing_threshold=20000,   # Start indexing after 20k vectors
            flush_interval_sec=5,       # Flush every 5 seconds
            max_optimization_threads=1  # Single optimization thread
        )
        
        # Scalar quantization for memory efficiency
        quantization_config = ScalarQuantization(
            scalar=ScalarQuantizationConfig(
                type=ScalarType.INT8,   # 8-bit quantization
                quantile=0.99,          # Use 99th percentile for range
                always_ram=True         # Keep quantized vectors in RAM
            )
        )
        
        # Create collection
        client.create_collection(
            collection_name=name,
            vectors_config=VectorParams(
                size=config["vector_size"],
                distance=config["distance"]
            ),
            hnsw_config=hnsw_config,
            optimizers_config=optimizers_config,
            quantization_config=quantization_config
        )
        
        print(f"✅ Collection '{name}' created successfully")
        print(f"   📝 Description: {config['description']}")
        print(f"   📏 Vector size: {config['vector_size']}")
        print(f"   📐 Distance: {config['distance']}")
        print(f"   🔧 HNSW: m={hnsw_config.m}, ef_construct={hnsw_config.ef_construct}")
        print(f"   🗜️  Quantization: INT8 enabled")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to create collection '{name}': {e}")
        return False

def create_indexes(client: QdrantClient, collection_name: str, payload_schema: Dict[str, str]):
    """Create payload indexes for efficient filtering"""
    try:
        print(f"🔍 Creating indexes for collection: {collection_name}")
        
        # Create indexes for key fields
        key_fields = ["investigation_id", "created_at"]
        
        for field in key_fields:
            if field in payload_schema:
                try:
                    client.create_payload_index(
                        collection_name=collection_name,
                        field_name=field,
                        field_schema=payload_schema[field]
                    )
                    print(f"   ✅ Index created for field: {field}")
                except Exception as e:
                    print(f"   ⚠️  Index creation failed for {field}: {e}")
        
        # Create composite index for investigation_id + created_at
        try:
            client.create_payload_index(
                collection_name=collection_name,
                field_name="investigation_created",
                field_schema="keyword"  # Will be populated as "investigation_id:created_at"
            )
            print(f"   ✅ Composite index created for investigation_created")
        except Exception as e:
            print(f"   ⚠️  Composite index creation failed: {e}")
            
    except Exception as e:
        print(f"❌ Failed to create indexes for '{collection_name}': {e}")

def verify_collection(client: QdrantClient, collection_name: str) -> bool:
    """Verify collection was created correctly"""
    try:
        info = client.get_collection(collection_name)
        
        print(f"🔍 Verifying collection: {collection_name}")
        print(f"   📊 Status: {info.status}")
        print(f"   📏 Vector size: {info.config.params.vectors.size}")
        print(f"   📐 Distance: {info.config.params.vectors.distance}")
        print(f"   🔢 Points count: {info.points_count}")
        print(f"   🗜️  Quantization: {'Enabled' if info.config.quantization_config else 'Disabled'}")
        
        return info.status == CollectionStatus.GREEN
        
    except Exception as e:
        print(f"❌ Failed to verify collection '{collection_name}': {e}")
        return False

def setup_all_collections(recreate: bool = False) -> bool:
    """Setup all OSINT collections"""
    print("🚀 AURA OSINT - Qdrant Collections Setup")
    print("=" * 50)
    
    # Connect to Qdrant
    client = create_qdrant_client()
    
    success_count = 0
    total_collections = len(COLLECTIONS_CONFIG)
    
    for collection_name, config in COLLECTIONS_CONFIG.items():
        print(f"\n📦 Processing collection: {collection_name}")
        
        # Check if collection exists
        if collection_exists(client, collection_name):
            if recreate:
                print(f"🗑️  Deleting existing collection: {collection_name}")
                try:
                    client.delete_collection(collection_name)
                    print(f"✅ Collection '{collection_name}' deleted")
                except Exception as e:
                    print(f"❌ Failed to delete collection '{collection_name}': {e}")
                    continue
            else:
                print(f"⚠️  Collection '{collection_name}' already exists (use --recreate to overwrite)")
                if verify_collection(client, collection_name):
                    success_count += 1
                continue
        
        # Create collection
        if create_collection(client, collection_name, config):
            # Create indexes
            create_indexes(client, collection_name, config["payload_schema"])
            
            # Verify creation
            if verify_collection(client, collection_name):
                success_count += 1
            else:
                print(f"❌ Collection '{collection_name}' verification failed")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 SETUP SUMMARY")
    print(f"✅ Successful: {success_count}/{total_collections}")
    print(f"❌ Failed: {total_collections - success_count}/{total_collections}")
    
    if success_count == total_collections:
        print("🎉 All collections created successfully!")
        print("\n💡 Next steps:")
        print("   1. Start your OSINT tools")
        print("   2. Generate embeddings with sentence-transformers")
        print("   3. Insert vectors using the Qdrant client")
        return True
    else:
        print("⚠️  Some collections failed to create")
        return False

def list_collections():
    """List all existing collections"""
    print("📋 QDRANT COLLECTIONS STATUS")
    print("=" * 50)
    
    client = create_qdrant_client()
    
    try:
        collections = client.get_collections()
        
        if not collections.collections:
            print("📭 No collections found")
            return
        
        for collection in collections.collections:
            try:
                info = client.get_collection(collection.name)
                print(f"\n📦 {collection.name}")
                print(f"   📊 Status: {info.status}")
                print(f"   📏 Vector size: {info.config.params.vectors.size}")
                print(f"   🔢 Points: {info.points_count}")
                print(f"   💾 Disk usage: {info.config.params.vectors.size * info.points_count * 4 / 1024 / 1024:.2f} MB")
                
            except Exception as e:
                print(f"   ❌ Error getting info: {e}")
    
    except Exception as e:
        print(f"❌ Failed to list collections: {e}")

def delete_all_collections():
    """Delete all collections (use with caution!)"""
    print("🗑️  DELETING ALL COLLECTIONS")
    print("=" * 50)
    
    client = create_qdrant_client()
    
    try:
        collections = client.get_collections()
        
        if not collections.collections:
            print("📭 No collections to delete")
            return
        
        for collection in collections.collections:
            try:
                client.delete_collection(collection.name)
                print(f"✅ Deleted: {collection.name}")
            except Exception as e:
                print(f"❌ Failed to delete {collection.name}: {e}")
    
    except Exception as e:
        print(f"❌ Failed to delete collections: {e}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="AURA OSINT Qdrant Collections Setup")
    parser.add_argument("--recreate", action="store_true", 
                       help="Recreate existing collections")
    parser.add_argument("--list", action="store_true", 
                       help="List existing collections")
    parser.add_argument("--delete-all", action="store_true", 
                       help="Delete all collections (DANGEROUS!)")
    parser.add_argument("--host", default="localhost", 
                       help="Qdrant host (default: localhost)")
    parser.add_argument("--port", type=int, default=6333, 
                       help="Qdrant port (default: 6333)")
    
    args = parser.parse_args()
    
    # Update global config
    QDRANT_HOST = args.host
    QDRANT_PORT = args.port
    
    if args.list:
        list_collections()
    elif args.delete_all:
        confirm = input("⚠️  Are you sure you want to delete ALL collections? (yes/no): ")
        if confirm.lower() == "yes":
            delete_all_collections()
        else:
            print("❌ Operation cancelled")
    else:
        setup_all_collections(recreate=args.recreate)