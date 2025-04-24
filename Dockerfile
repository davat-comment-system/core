# Stage 1: Build the project
FROM node:18 AS builder

WORKDIR /core

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /core

# Copy package.json and package-lock.json from the builder stage
COPY --from=builder /core/package.json /core/package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the build from the first stage
COPY --from=builder /core .

# Start the application
CMD ["node", "dist/server.js"]
