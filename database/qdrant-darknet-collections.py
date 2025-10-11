#!/usr/bin/env python3
"""
AURA OSINT - Qdrant Collections Setup for Darknet Intelligence
Creates vector collections for all OSINT data types with optimized configurations
"""

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, OptimizersConfigDiff, HnswConfigDiff
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_qdrant_collections():
    """Create all Qdrant collections for AURA OSINT ecosystem"""
    
    # Connect to Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    # Collection configurations
    collections_config = {
        "email_intelligence": {
            "description": "Email OSINT data embeddings (holehe, h8mail)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "social_profiles": {
            "description": "Social media profiles embeddings (twitter, instagram, linkedin)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "network_intelligence": {
            "description": "Network OSINT embeddings (shodan, nmap, ssl)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "darknet_findings": {
            "description": "Darknet discoveries embeddings (onionscan, torbot)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "crypto_intelligence": {
            "description": "Cryptocurrency analysis embeddings (blockchain, wallets)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "phone_intelligence": {
            "description": "Phone number OSINT embeddings (phonenumbers, truecaller)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "domain_intelligence": {
            "description": "Domain OSINT embeddings (whois, dns, certificates)",
            "vector_size": 768,
            "distance": Distance.COSINE
        },
        "image_intelligence": {
            "description": "Image analysis embeddings (face recognition, reverse search)",
            "vector_size": 768,
            "distance": Distance.COSINE
        }
    }
    
    # Create collections
    for collection_name, config in collections_config.items():
        try:
            # Delete existing collection if it exists
            try:
                client.delete_collection(collection_name)
                logger.info(f"Deleted existing collection: {collection_name}")
            except:
                pass
            
            # Create new collection with optimized settings
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=config["vector_size"], 
                    distance=config["distance"]
                ),
                optimizers_config=OptimizersConfigDiff(
                    memmap_threshold=20000,
                    indexing_threshold=10000
                ),
                hnsw_config=HnswConfigDiff(
                    m=16,
                    ef_construct=200,
                    full_scan_threshold=10000
                )
            )
            
            logger.info(f"✅ Created collection: {collection_name}")
            logger.info(f"   Description: {config['description']}")
            logger.info(f"   Vector size: {config['vector_size']}")
            logger.info(f"   Distance: {config['distance']}")
            
        except Exception as e:
            logger.error(f"❌ Failed to create collection {collection_name}: {e}")
    
    # Verify collections
    collections = client.get_collections()
    logger.info(f"\n📊 Total collections created: {len(collections.collections)}")
    
    for collection in collections.collections:
        info = client.get_collection(collection.name)
        logger.info(f"   - {collection.name}: {info.vectors_count} vectors")

if __name__ == "__main__":
    logger.info("🚀 AURA OSINT - Setting up Qdrant collections...")
    create_qdrant_collections()
    logger.info("✅ Qdrant collections setup completed!")