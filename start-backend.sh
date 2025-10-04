#!/bin/bash
cd "/home/soufiane/Bureau/TikTok Live Analyser/backend"
export DATABASE_URL="postgresql://aura_user:secure_password@localhost:5433/aura_investigations"
node src/server.js