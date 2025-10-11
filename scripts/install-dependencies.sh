#!/bin/bash
# AURA OSINT Complete Dependencies Installation Script

set -e

echo "🚀 AURA OSINT Dependencies Installation"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    echo -e "${RED}❌ Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Detected OS: $OS${NC}"

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.9"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}❌ Python 3.9+ required, found $PYTHON_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python $PYTHON_VERSION found${NC}"

# Install system dependencies
echo -e "${BLUE}📦 Installing system dependencies...${NC}"

if [[ "$OS" == "linux" ]]; then
    # Update package list
    sudo apt-get update
    
    # Install system packages
    sudo apt-get install -y \
        build-essential \
        cmake \
        pkg-config \
        libssl-dev \
        libffi-dev \
        libxml2-dev \
        libxslt1-dev \
        libjpeg-dev \
        libpng-dev \
        libfreetype6-dev \
        libblas-dev \
        liblapack-dev \
        libatlas-base-dev \
        gfortran \
        tor \
        proxychains4 \
        golang-go \
        git \
        curl \
        wget \
        unzip \
        postgresql-client \
        redis-tools
        
elif [[ "$OS" == "macos" ]]; then
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}⚠️  Installing Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install packages
    brew install \
        cmake \
        pkg-config \
        openssl \
        libffi \
        libxml2 \
        libxslt \
        jpeg \
        libpng \
        freetype \
        openblas \
        lapack \
        tor \
        proxychains-ng \
        go \
        git \
        curl \
        wget \
        unzip \
        postgresql \
        redis
fi

echo -e "${GREEN}✅ System dependencies installed${NC}"

# Create virtual environment
echo -e "${BLUE}🐍 Setting up Python virtual environment...${NC}"

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

echo -e "${GREEN}✅ Virtual environment ready${NC}"

# Install Python dependencies
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"

# Install core dependencies first
pip install -r backend/requirements-complete.txt

echo -e "${GREEN}✅ Python dependencies installed${NC}"

# Install special tools that need manual installation
echo -e "${BLUE}🔧 Installing special OSINT tools...${NC}"

# Install OnionScan (Go-based tool)
if ! command -v onionscan &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing OnionScan...${NC}"
    
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    git clone https://github.com/s-rah/onionscan.git
    cd onionscan
    go build
    
    # Install to user's local bin
    mkdir -p ~/.local/bin
    cp onionscan ~/.local/bin/
    
    # Add to PATH if not already there
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.local/bin:$PATH"
    fi
    
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
    
    echo -e "${GREEN}✅ OnionScan installed${NC}"
else
    echo -e "${GREEN}✅ OnionScan already installed${NC}"
fi

# Install Sublist3r
if ! command -v sublist3r &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing Sublist3r...${NC}"
    
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    git clone https://github.com/aboul3la/Sublist3r.git
    cd Sublist3r
    pip install -r requirements.txt
    
    # Create wrapper script
    cat > ~/.local/bin/sublist3r << 'EOF'
#!/bin/bash
python3 $(dirname $(realpath $0))/../share/Sublist3r/sublist3r.py "$@"
EOF
    
    mkdir -p ~/.local/share
    cp -r . ~/.local/share/Sublist3r
    chmod +x ~/.local/bin/sublist3r
    
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
    
    echo -e "${GREEN}✅ Sublist3r installed${NC}"
else
    echo -e "${GREEN}✅ Sublist3r already installed${NC}"
fi

# Install theHarvester
if ! command -v theHarvester &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing theHarvester...${NC}"
    
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    git clone https://github.com/laramies/theHarvester.git
    cd theHarvester
    pip install -r requirements.txt
    
    # Create wrapper script
    cat > ~/.local/bin/theHarvester << 'EOF'
#!/bin/bash
python3 $(dirname $(realpath $0))/../share/theHarvester/theHarvester.py "$@"
EOF
    
    mkdir -p ~/.local/share
    cp -r . ~/.local/share/theHarvester
    chmod +x ~/.local/bin/theHarvester
    
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
    
    echo -e "${GREEN}✅ theHarvester installed${NC}"
else
    echo -e "${GREEN}✅ theHarvester already installed${NC}"
fi

# Configure Tor
echo -e "${BLUE}🔧 Configuring Tor...${NC}"

# Backup original torrc if it exists
if [ -f /etc/tor/torrc ]; then
    sudo cp /etc/tor/torrc /etc/tor/torrc.backup
fi

# Copy our custom torrc
sudo cp tor-config/torrc /etc/tor/torrc

# Start Tor service
if [[ "$OS" == "linux" ]]; then
    sudo systemctl enable tor
    sudo systemctl start tor
elif [[ "$OS" == "macos" ]]; then
    brew services start tor
fi

echo -e "${GREEN}✅ Tor configured and started${NC}"

# Configure proxychains
echo -e "${BLUE}🔧 Configuring proxychains...${NC}"

if [[ "$OS" == "linux" ]]; then
    PROXYCHAINS_CONF="/etc/proxychains4.conf"
elif [[ "$OS" == "macos" ]]; then
    PROXYCHAINS_CONF="/usr/local/etc/proxychains.conf"
fi

# Backup original config
sudo cp "$PROXYCHAINS_CONF" "${PROXYCHAINS_CONF}.backup"

# Create new config
sudo tee "$PROXYCHAINS_CONF" > /dev/null << 'EOF'
strict_chain
proxy_dns
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000

[ProxyList]
socks5 127.0.0.1 9050
EOF

echo -e "${GREEN}✅ Proxychains configured${NC}"

# Test installations
echo -e "${BLUE}🧪 Testing installations...${NC}"

# Test Python imports
python3 -c "
import sys
modules = [
    'fastapi', 'uvicorn', 'sqlalchemy', 'redis', 'qdrant_client',
    'holehe', 'shodan', 'phonenumbers', 'whois', 'face_recognition',
    'requests', 'aiohttp', 'beautifulsoup4', 'stem'
]

failed = []
for module in modules:
    try:
        __import__(module)
        print(f'✅ {module}')
    except ImportError as e:
        print(f'❌ {module}: {e}')
        failed.append(module)

if failed:
    print(f'\n❌ Failed to import: {failed}')
    sys.exit(1)
else:
    print('\n✅ All Python modules imported successfully')
"

# Test Tor connection
echo -e "${BLUE}🧪 Testing Tor connection...${NC}"
if curl --socks5 127.0.0.1:9050 --max-time 10 -s https://check.torproject.org/api/ip | grep -q "true"; then
    echo -e "${GREEN}✅ Tor connection working${NC}"
else
    echo -e "${YELLOW}⚠️  Tor connection test failed (may need time to establish circuits)${NC}"
fi

# Test command-line tools
echo -e "${BLUE}🧪 Testing command-line tools...${NC}"

TOOLS=("onionscan" "sublist3r" "theHarvester")
for tool in "${TOOLS[@]}"; do
    if command -v "$tool" &> /dev/null; then
        echo -e "${GREEN}✅ $tool available${NC}"
    else
        echo -e "${YELLOW}⚠️  $tool not found in PATH${NC}"
    fi
done

# Create API keys template
echo -e "${BLUE}📝 Creating API keys template...${NC}"

cat > .env.api-keys.template << 'EOF'
# AURA OSINT API Keys Template
# Copy this to .env.api-keys and add your actual keys

# Have I Been Pwned
HIBP_API_KEY=your_hibp_api_key_here

# DeHashed
DEHASHED_API_KEY=your_dehashed_api_key_here

# Snusbase
SNUSBASE_API_KEY=your_snusbase_api_key_here

# Shodan
SHODAN_API_KEY=your_shodan_api_key_here

# Blockchain.info
BLOCKCHAIN_INFO_API=your_blockchain_info_api_key_here

# Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# VirusTotal
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here

# Censys
CENSYS_API_ID=your_censys_api_id_here
CENSYS_API_SECRET=your_censys_api_secret_here

# Twitter (if using official API)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Telegram (for notifications)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
EOF

echo -e "${GREEN}✅ API keys template created${NC}"

# Final summary
echo -e "\n${GREEN}🎉 Installation completed successfully!${NC}"
echo -e "\n${BLUE}📋 Summary:${NC}"
echo "  ✅ System dependencies installed"
echo "  ✅ Python virtual environment created"
echo "  ✅ Python packages installed"
echo "  ✅ OSINT tools installed"
echo "  ✅ Tor configured and running"
echo "  ✅ Proxychains configured"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Copy .env.api-keys.template to .env.api-keys and add your API keys"
echo "  3. Start the database: docker-compose up -d postgres"
echo "  4. Run database migrations: alembic upgrade head"
echo "  5. Start the backend: uvicorn main:app --reload"

echo -e "\n${BLUE}🔧 Troubleshooting:${NC}"
echo "  - If Tor test fails, wait a few minutes for circuits to establish"
echo "  - Add ~/.local/bin to your PATH if tools aren't found"
echo "  - Restart your shell to pick up environment changes"

echo -e "\n${GREEN}✅ Ready to run AURA OSINT!${NC}"