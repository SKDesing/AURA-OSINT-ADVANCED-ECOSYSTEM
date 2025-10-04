#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

clear

echo -e "${PURPLE}"
echo "████████╗██╗██╗  ██╗████████╗ ██████╗ ██╗  ██╗"
echo "╚══██╔══╝██║██║ ██╔╝╚══██╔══╝██╔═══██╗██║ ██╔╝"
echo "   ██║   ██║█████╔╝    ██║   ██║   ██║█████╔╝ "
echo "   ██║   ██║██╔═██╗    ██║   ██║   ██║██╔═██╗ "
echo "   ██║   ██║██║  ██╗   ██║   ╚██████╔╝██║  ██╗"
echo "   ╚═╝   ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝"
echo -e "${NC}"

echo -e "${BLUE}██╗     ██╗██╗   ██╗███████╗    █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗███████╗██████╗ ${NC}"
echo -e "${BLUE}██║     ██║██║   ██║██╔════╝   ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝██╔════╝██╔══██╗${NC}"
echo -e "${BLUE}██║     ██║██║   ██║█████╗     ███████║██╔██╗ ██║███████║██║   ╚████╔╝ ███████╗█████╗  ██████╔╝${NC}"
echo -e "${BLUE}██║     ██║╚██╗ ██╔╝██╔══╝     ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝  ╚════██║██╔══╝  ██╔══██╗${NC}"
echo -e "${BLUE}███████╗██║ ╚████╔╝ ███████╗   ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████║███████╗██║  ██║${NC}"
echo -e "${BLUE}╚══════╝╚═╝  ╚═══╝  ╚══════╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝${NC}"

echo ""
echo -e "${YELLOW}🚀 TikTok Live Analyser - AURA Project${NC}"
echo -e "${GREEN}📊 Real-time TikTok Live Stream Analysis Tool${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    echo -e "${YELLOW}💡 Start Docker and run: docker-compose up -d${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Starting services...${NC}"
docker-compose up -d --remove-orphans

sleep 5

echo ""
echo -e "${YELLOW}🌐 Application URLs:${NC}"
echo -e "${BLUE}   Frontend: http://localhost:3001${NC}"
echo -e "${BLUE}   Backend API: http://localhost:3002${NC}"
echo ""
echo -e "${GREEN}🎯 Ready to analyze TikTok Live streams!${NC}"
echo -e "${PURPLE}✨ Enjoy your analysis session!${NC}"

# Open browser
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3001 2>/dev/null &
fi