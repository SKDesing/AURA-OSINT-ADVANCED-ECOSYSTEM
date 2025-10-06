FROM node:18-alpine

WORKDIR /app

# Install Chromium
RUN apk add --no-cache chromium

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S aura -u 1001

# Set permissions
RUN chown -R aura:nodejs /app
USER aura

# Expose ports
EXPOSE 3000 4002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/status || exit 1

# Default command
CMD ["npm", "run", "gui"]