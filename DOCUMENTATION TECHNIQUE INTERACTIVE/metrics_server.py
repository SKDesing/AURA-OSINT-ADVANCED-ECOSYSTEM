#!/usr/bin/env python3
"""
AURA OSINT - Mini serveur de métriques temps réel
FastAPI + Server-Sent Events pour alimenter l'interface
"""

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
import time
from datetime import datetime

app = FastAPI(
    title="AURA OSINT Metrics Server",
    description="Serveur de métriques temps réel pour l'interface AURA OSINT",
    version="1.0.0"
)

# CORS sécurisé pour l'interface locale
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "file://"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["Cache-Control", "Content-Type"],
)

# Simulation de métriques OSINT réalistes
async def generate_metrics():
    """Générateur de métriques temps réel"""
    while True:
        # Métriques de performance
        throughput = random.randint(950, 1350)  # docs/min
        latency_p95 = round(random.uniform(4.2, 9.8), 1)  # secondes
        quality_schema = random.randint(94, 99)  # pourcentage
        
        # Métriques OSINT spécifiques
        active_investigations = random.randint(15, 45)
        tools_running = random.randint(3, 8)
        data_sources = random.randint(12, 18)
        
        # Métriques de sécurité
        security_score = random.randint(88, 96)
        threats_detected = random.randint(0, 3)
        
        # Métriques IA
        ai_confidence = round(random.uniform(0.85, 0.98), 2)
        embeddings_processed = random.randint(1200, 2800)
        
        payload = {
            "timestamp": int(time.time()),
            "datetime": datetime.now().isoformat(),
            "performance": {
                "throughput": throughput,
                "latency_p95": latency_p95,
                "quality_schema": quality_schema
            },
            "osint": {
                "active_investigations": active_investigations,
                "tools_running": tools_running,
                "data_sources": data_sources
            },
            "security": {
                "score": security_score,
                "threats_detected": threats_detected
            },
            "ai": {
                "confidence": ai_confidence,
                "embeddings_processed": embeddings_processed
            },
            "system": {
                "cpu_usage": round(random.uniform(15, 85), 1),
                "memory_usage": round(random.uniform(45, 78), 1),
                "disk_usage": round(random.uniform(25, 65), 1)
            }
        }
        
        yield f"data: {json.dumps(payload)}\n\n"
        await asyncio.sleep(3)  # Mise à jour toutes les 3 secondes

@app.get("/")
async def root():
    """Point d'entrée de l'API"""
    return {
        "service": "AURA OSINT Metrics Server",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "metrics_stream": "/sse",
            "health": "/health",
            "stats": "/stats"
        }
    }

@app.get("/sse")
async def metrics_stream():
    """Stream de métriques via Server-Sent Events"""
    return StreamingResponse(
        generate_metrics(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY"
        }
    )

@app.get("/health")
async def health_check():
    """Vérification de santé du service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": time.time(),
        "services": {
            "metrics_generator": "operational",
            "sse_stream": "operational"
        }
    }

@app.get("/stats")
async def get_current_stats():
    """Snapshot des métriques actuelles (sans streaming)"""
    return {
        "timestamp": int(time.time()),
        "performance": {
            "throughput": random.randint(950, 1350),
            "latency_p95": round(random.uniform(4.2, 9.8), 1),
            "quality_schema": random.randint(94, 99)
        },
        "osint": {
            "active_investigations": random.randint(15, 45),
            "tools_running": random.randint(3, 8),
            "data_sources": random.randint(12, 18)
        },
        "system_info": {
            "python_version": "3.11+",
            "fastapi_version": "0.104+",
            "metrics_interval": "3s"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Démarrage du serveur de métriques AURA OSINT...")
    print("📊 Interface: http://localhost:8000")
    print("📡 Stream SSE: http://localhost:8000/sse")
    print("💚 Health: http://localhost:8000/health")
    
    uvicorn.run(
        "metrics_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )