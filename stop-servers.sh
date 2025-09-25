#!/bin/bash

# Swrlr - Stop All Servers (Development)
# This script stops both frontend and backend servers

echo "🛑 Stopping Swrlr Development Servers..."
echo "========================================"

# Function to stop processes by name pattern
stop_processes() {
    local pattern=$1
    local name=$2
    
    echo "🔍 Looking for $name processes..."
    PIDS=$(pgrep -f "$pattern" 2>/dev/null || true)
    
    if [ -n "$PIDS" ]; then
        echo "   Found PIDs: $PIDS"
        echo "   Stopping $name..."
        pkill -f "$pattern" 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        REMAINING=$(pgrep -f "$pattern" 2>/dev/null || true)
        if [ -n "$REMAINING" ]; then
            echo "   Force killing remaining processes..."
            pkill -9 -f "$pattern" 2>/dev/null || true
        fi
        
        echo "✅ $name stopped"
    else
        echo "   No $name processes found"
    fi
}

# Stop frontend (Vite/npm)
stop_processes "vite|npm.*dev" "Frontend (Vite)"

# Stop backend (Python FastAPI)
stop_processes "python.*main.py|uvicorn" "Backend (FastAPI)"

# Also stop any node processes that might be lingering
stop_processes "node.*vite" "Node (Vite)"

echo ""
echo "🧹 Cleaning up development artifacts..."

# Clear Vite cache
if [ -d "frontend/node_modules/.vite" ]; then
    echo "   Clearing Vite cache..."
    rm -rf frontend/node_modules/.vite
fi

# Clear any dist folders
if [ -d "frontend/dist" ]; then
    echo "   Clearing build artifacts..."
    rm -rf frontend/dist
fi

echo ""
echo "✅ All development servers stopped!"
echo "=================================="
echo "💡 To start servers again, run: ./start-servers.sh"
