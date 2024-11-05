#!/bin/bash

# Navigate to the project root
cd "$(dirname "$0")"

# Build and start the containers
docker-compose up --build
