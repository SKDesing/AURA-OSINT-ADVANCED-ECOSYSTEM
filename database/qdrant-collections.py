#!/usr/bin/env python3
"""
AURA OSINT - Configuration Collections Qdrant
Base vectorielle pour IA et recherche sémantique
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, CollectionInfo

def setup_qdrant_collections():
    """Configure toutes les collections Qdrant pour AURA OSINT"""
    
    client = QdrantClient(url="http://localhost:6333")
    
    collections = [
        {
            "name": "investigations_embeddings",
            "size": 384,  # sentence-transformers/all-MiniLM-L6-v2
            "distance": Distance.COSINE,
            "description": "Embeddings des investigations et cas OSINT"
        },
        {
            "name": "social_profiles_embeddings", 
            "size": 384,
            "distance": Distance.COSINE,
            "description": "Embeddings des profils sociaux (bio, username, etc.)"
        },
        {
            "name": "content_embeddings",
            "size": 768,  # sentence-transformers/all-mpnet-base-v2
            "distance": Distance.COSINE,
            "description": "Embeddings du contenu (posts, messages, documents)"
        },
        {
            "name": "domain_embeddings",
            "size": 384,
            "distance": Distance.COSINE,
            "description": "Embeddings des domaines et infrastructure réseau"
        },
        {
            "name": "knowledge_base",
            "size": 1536,  # OpenAI text-embedding-ada-002 ou équivalent
            "distance": Distance.COSINE,
            "description": "Base de connaissances OSINT et techniques"
        }
    ]
    
    for collection in collections:
        try:
            # Vérifier si la collection existe
            try:
                info = client.get_collection(collection["name"])
                print(f"✅ Collection '{collection['name']}' existe déjà")
                continue
            except:
                pass
            
            # Créer la collection
            client.create_collection(
                collection_name=collection["name"],
                vectors_config=VectorParams(
                    size=collection["size"], 
                    distance=collection["distance"]
                ),
                on_disk_payload=True,  # Optimisation stockage
                hnsw_config={
                    "m": 16,
                    "ef_construct": 100,
                    "full_scan_threshold": 10000
                }
            )
            
            print(f"✅ Collection '{collection['name']}' créée")
            print(f"   - Taille vecteurs: {collection['size']}")
            print(f"   - Distance: {collection['distance']}")
            print(f"   - Description: {collection['description']}")
            
        except Exception as e:
            print(f"❌ Erreur création collection '{collection['name']}': {e}")

def create_sample_points():
    """Créer des points d'exemple pour tester"""
    
    client = QdrantClient(url="http://localhost:6333")
    
    # Exemple: Investigation embedding
    sample_investigation = PointStruct(
        id=1,
        vector=[0.1] * 384,  # Vecteur exemple
        payload={
            "investigation_id": "00000000-0000-0000-0000-000000000001",
            "name": "Investigation TikTok Influencer",
            "description": "Analyse comportement suspect influenceur TikTok",
            "tags": ["tiktok", "influencer", "suspicious"],
            "created_at": "2025-01-11T00:00:00Z"
        }
    )
    
    try:
        client.upsert(
            collection_name="investigations_embeddings",
            points=[sample_investigation]
        )
        print("✅ Point d'exemple ajouté à investigations_embeddings")
    except Exception as e:
        print(f"❌ Erreur ajout point exemple: {e}")

def list_collections():
    """Lister toutes les collections"""
    
    client = QdrantClient(url="http://localhost:6333")
    
    try:
        collections = client.get_collections()
        print("\n📋 Collections Qdrant:")
        for collection in collections.collections:
            info = client.get_collection(collection.name)
            print(f"  - {collection.name}")
            print(f"    Vecteurs: {info.vectors_count}")
            print(f"    Points: {info.points_count}")
            print(f"    Taille: {info.config.params.vectors.size}")
    except Exception as e:
        print(f"❌ Erreur listage collections: {e}")

if __name__ == "__main__":
    print("🚀 Configuration Collections Qdrant - AURA OSINT")
    print("=" * 50)
    
    setup_qdrant_collections()
    create_sample_points()
    list_collections()
    
    print("\n✅ Configuration Qdrant terminée!")