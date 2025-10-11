FROM python:3.11-slim

# Security: Create non-root user
RUN groupadd -r darknet && useradd -r -g darknet -s /bin/false darknet

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    tor \
    proxychains4 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs && \
    chown -R darknet:darknet /app

# Configure proxychains for Tor
RUN echo "strict_chain\nproxy_dns\n[ProxyList]\nsocks5 tor-proxy 9050" > /etc/proxychains4.conf

# Switch to non-root user
USER darknet

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Start application
CMD ["python", "monitor.py"]