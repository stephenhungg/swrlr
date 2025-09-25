#!/bin/bash

# Swrlr - Restart All Servers (Development)
# This script stops and starts both frontend and backend servers

echo "🔄 Restarting Swrlr Development Servers..."
echo "========================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "1️⃣ Stopping existing servers..."
bash "$SCRIPT_DIR/stop-servers.sh"

echo ""
echo "2️⃣ Starting servers..."
bash "$SCRIPT_DIR/start-servers.sh"
