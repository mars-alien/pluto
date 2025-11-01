# Multi-stage build for Pluto MERN app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy backend files
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm install

# Copy frontend files
WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy root files
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
