# Use an official Node.js image as the base image.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire frontend code into the container
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN echo '#!/bin/sh\n\
sed -i -e "s/\$PORT/'"${PORT:-80}"'/g" /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]