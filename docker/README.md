# 🐳 AURA OSINT - Docker Deployment

## Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Services

- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:8080
- **Nginx Proxy**: http://localhost:80

## Architecture

```
┌─────────────┐
│   Nginx     │ :80
│ (Reverse    │
│   Proxy)    │
└──────┬──────┘
       │
   ┌───┴────┬─────────┐
   │        │         │
┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│Front│  │Back │  │WS   │
│end  │  │end  │  │     │
│:8080│  │:3000│  │:3000│
└─────┘  └─────┘  └─────┘
```

## Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Remove volumes
docker-compose down -v
```

## Health Checks

```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost:8080

# Via Nginx
curl http://localhost/health
```
