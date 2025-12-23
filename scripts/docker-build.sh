#!/bin/bash
# Build Docker images for UAT Platform

set -e

VERSION=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

echo "Building UAT Platform Docker images (version: $VERSION)..."

# Build API service
docker build \
  --target production \
  --tag "${REGISTRY}uat-api:${VERSION}" \
  --file Dockerfile \
  .

echo "Build complete!"
echo "Images created:"
echo "  - ${REGISTRY}uat-api:${VERSION}"

