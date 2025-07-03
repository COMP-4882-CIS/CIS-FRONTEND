# Multi-stage Dockerfile for Angular CIS Frontend

# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular application for production
# This uses the baseHref: "/cis-dashboard/" from your angular.json
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine AS production

# Copy the built Angular application from the build stage
# Copy from /app/dist/ (as specified in angular.json outputPath) to nginx html directory
COPY --from=build /app/dist/ /usr/share/nginx/html/cis-dashboard/

# Create custom nginx configuration for the Angular SPA at a subpath
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html index.htm;' >> /etc/nginx/conf.d/default.conf && \
    echo '' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Main location block for the Angular app at /cis-dashboard/' >> /etc/nginx/conf.d/default.conf && \
    echo '    location /cis-dashboard/ {' >> /etc/nginx/conf.d/default.conf && \
    echo '        # Try to serve the requested file directly, then a directory index.html,' >> /etc/nginx/conf.d/default.conf && \
    echo '        # then fallback to the main index.html for client-side routing.' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /cis-dashboard/index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Optional: Redirect root requests to the /cis-dashboard/ subpath' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        return 301 /cis-dashboard/;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Gzip compression for better performance' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip on;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_proxied any;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_vary on;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_comp_level 6;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_buffers 16 8k;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_http_version 1.1;' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
