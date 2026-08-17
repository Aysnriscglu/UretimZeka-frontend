# ==========================================
# STAGE 1: Build the frontend (React/Vite)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package.json for frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Vite project into /app/dist
RUN npm run build


# ==========================================
# STAGE 2: Setup production backend
# ==========================================
FROM node:22-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Copy backend dependencies and install them
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source code
COPY backend ./backend

# Copy built frontend files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 5000

# Start the Express server
CMD ["node", "backend/server.js"]
