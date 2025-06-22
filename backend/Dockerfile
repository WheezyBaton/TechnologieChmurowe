# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Install debugging tools
RUN apk add --no-cache curl

EXPOSE 5000
CMD ["node", "--inspect=0.0.0.0:9229", "server.js"]