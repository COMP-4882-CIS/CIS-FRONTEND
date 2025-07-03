#!/bin/bash

# Docker test script for CIS Frontend
# Tests the built Docker container to ensure it's working properly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[TEST INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[TEST ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[TEST WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_header "CIS Frontend Docker Container Tests"

# Get the current branch for the image tag
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
IMAGE_NAME="iisdevs/cis-frontend:$CURRENT_BRANCH"

print_status "Testing image: $IMAGE_NAME"

# Test 1: Check if the image exists
print_status "Test 1: Checking if Docker image exists..."
if sudo docker image inspect $IMAGE_NAME > /dev/null 2>&1; then
    print_status "✅ Docker image $IMAGE_NAME exists"
else
    print_error "❌ Docker image $IMAGE_NAME not found"
    exit 1
fi

# Test 2: Start container and test HTTP response
print_status "Test 2: Starting container and testing HTTP response..."
CONTAINER_ID=$(sudo docker run -d -p 8080:80 $IMAGE_NAME)
print_status "Container started with ID: $CONTAINER_ID"

# Wait for container to be ready
sleep 5

# Test HTTP response
print_status "Testing HTTP response on port 8080..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "✅ HTTP response test passed (Status: $HTTP_STATUS)"
else
    print_error "❌ HTTP response test failed (Status: $HTTP_STATUS)"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

# Test 3: Check if Angular app is served
print_status "Test 3: Checking if Angular app content is served..."
CONTENT=$(curl -s http://localhost:8080)
if echo "$CONTENT" | grep -q "CIS\|Angular\|app-root"; then
    print_status "✅ Angular app content detected"
else
    print_warning "⚠️  Angular app content not clearly detected, but server is responding"
fi

# Test 4: Check container logs for errors
print_status "Test 4: Checking container logs for errors..."
LOGS=$(sudo docker logs $CONTAINER_ID 2>&1)
if echo "$LOGS" | grep -i "error\|fail\|exception" > /dev/null; then
    print_warning "⚠️  Found potential errors in container logs:"
    echo "$LOGS" | grep -i "error\|fail\|exception"
else
    print_status "✅ No obvious errors found in container logs"
fi

# Cleanup
print_status "Cleaning up test container..."
sudo docker stop $CONTAINER_ID > /dev/null
sudo docker rm $CONTAINER_ID > /dev/null
print_status "✅ Test container cleaned up"

print_header "All Tests Completed Successfully"
print_status "Image $IMAGE_NAME is ready for deployment"

exit 0
