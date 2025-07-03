#!/bin/bash

# CIS Frontend Autobuild Script
# Builds, tests, and pushes Docker images for the CIS frontend application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository. Please initialize git first."
    exit 1
fi

print_header "CIS Frontend Autobuild"


# Get Git information with descriptive messages
echo "** Retrieving Git information..."
COMMIT_ID=$(git rev-parse HEAD)
echo "  - Commit ID: $COMMIT_ID"
BUILD_TIMESTAMP=$(date +"%A %Y-%m-%d")
echo "  - Build Timestamp: $BUILD_TIMESTAMP"
BUILDER_USERNAME=$(git config user.name)
echo "  - Builder Username: $BUILDER_USERNAME"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)  # Use git rev-parse for branch name
echo "  - Branch: $CURRENT_BRANCH"
REPO_URL=$(git config --get remote.origin.url)
echo "  - Repository URL: $REPO_URL"

# Get the last 5 commit messages
COMMIT_MESSAGES=$(git log --pretty=format:"%s" -n 5 HEAD | sed 's/\n//g')

#remove newlines from commit messages
COMMIT_MESSAGES=$(echo $COMMIT_MESSAGES | tr -d '\n')

#remove all double quotes from commit messages
COMMIT_MESSAGES=$(echo $COMMIT_MESSAGES | tr -d '"')

# Create a release on GitHub with datestamp (vYYYY-MM-DD-HH-MM-SS)
RELEASE_NAME="v$(date +"%Y-%m-%d-%H-%M-%S")-$CURRENT_BRANCH-autobuild"
RELEASE_BODY="Built and pushed image for branch: $CURRENT_BRANCH \n Last 5 Commit Messages: \n $COMMIT_MESSAGES"

# Construct the JSON data
echo "** Constructing JSON data..."
JSON_DATA="{
  \"commitID\": \"$COMMIT_ID\",
  \"buildTimestamp\": \"$BUILD_TIMESTAMP\",
  \"buildersUsername\": \"$BUILDER_USERNAME\",
  \"branch\": \"$CURRENT_BRANCH\",
  \"repoURL\": \"$REPO_URL\",
  \"last5commitMessages\": \"$COMMIT_MESSAGES\",
  \"releaseName\": \"$RELEASE_NAME\"
}"
echo "  - JSON Data: $JSON_DATA"


# Save the JSON data to the file
echo "** Saving JSON data to file..."
mkdir -p ./build-info
echo "$JSON_DATA" > ./build-info/versionInfo.json

# Make a build info file for the application
echo "** Creating build info for CIS frontend..."
echo "export const BUILD_INFO = $JSON_DATA;" > ./build-info/buildInfo.js
echo "  - Build info created"

# Update the docker-compose.yml tag
echo "** Updating docker-compose.yml tag... to $CURRENT_BRANCH"
sed -i "s/image: iisdevs\/cis-frontend:main/image: iisdevs\/cis-frontend:$CURRENT_BRANCH/g" ./docker-compose.yml
echo "  - Updated docker-compose.yml tag to iisdevs/cis-frontend:$CURRENT_BRANCH"


#get the github token from the environment, if it exists
if [ -z "$GITHUB_TOKEN" ]; then
  echo "GITHUB_TOKEN not set, please enter your GitHub token:"
  read GITHUB_TOKEN
  export GITHUB_TOKEN
fi


# Tag the commit with the release name
echo "** Tagging the commit with the release name: $RELEASE_NAME"
git tag -a $RELEASE_NAME -m "Autobuild release for branch: $CURRENT_BRANCH"
git push origin $RELEASE_NAME
echo "  - Tagged the commit with the release name: $RELEASE_NAME"


# Create a release on GitHub
echo "** Creating a release on GitHub, Release Name: $RELEASE_NAME" 
REPO_NAME=$(basename -s .git $(git config --get remote.origin.url))
REPO_OWNER=$(git config --get remote.origin.url | sed 's/.*:\([^/]*\)\/.*/\1/' | sed 's/.*\/\([^/]*\)\/.*/\1/')
curl -sSL -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -X POST https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases -d "{\"tag_name\": \"$RELEASE_NAME\", \"name\": \"$RELEASE_NAME\", \"body\": \"$RELEASE_BODY\"}"
echo "  - Release created on GitHub"

# Clean up the local docker cache
#ask the user if they want to clean up the local docker cache
echo "Do you want to clean up the local docker cache? (y/n)"
read CLEANUP
if [ "$CLEANUP" == "y" ]; then
  echo "** Cleaning up the local docker cache..."
  sudo docker system prune -a
  echo "  - Local docker cache cleaned up"
fi


# Build and push the image
print_header "Building and Testing Docker Image"
print_status "Building Docker image..."
docker login

# Build the image
sudo docker compose build cis-frontend

# Verify image was built before running tests
print_status "Verifying Docker image was built..."
if sudo docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "iisdevs/cis-frontend:$CURRENT_BRANCH"; then
  print_status "✅ Docker image iisdevs/cis-frontend:$CURRENT_BRANCH confirmed"
else
  print_error "❌ Docker image iisdevs/cis-frontend:$CURRENT_BRANCH not found after build"
  exit 1
fi

# Run Docker tests to verify the build
print_status "Running Docker tests to verify the build..."
if [ -f "./docker-test.sh" ]; then
  print_status "Running container tests..."
  # Run tests in non-interactive mode
  export DOCKER_TEST_AUTO=true
  ./docker-test.sh
  if [ $? -eq 0 ]; then
    print_status "✅ Docker tests passed successfully"
  else
    print_error "❌ Docker tests failed"
    exit 1
  fi
else
  print_warning "docker-test.sh not found, skipping tests"
fi

# Push the image
print_status "Pushing image to registry..."
sudo docker compose push cis-frontend
print_status "✅ Build and push completed for tag: $CURRENT_BRANCH"

print_header "Autobuild Complete"
print_status "Release: $RELEASE_NAME"
print_status "Branch: $CURRENT_BRANCH"
print_status "Image: iisdevs/cis-frontend:$CURRENT_BRANCH"
print_status "Build info saved to: ./build-info/versionInfo.json"