#!/bin/bash

# Swrlr - Quick Development Launcher
# One-command development environment setup

set -e

echo "🎨 Swrlr Development Environment"
echo "==============================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Check if .env exists
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "⚠️  No .env file found in backend/"
    echo "💡 Copy .env.example to .env and add your GEMINI_API_KEY"
    echo "   cd backend && cp .env.example .env"
    echo ""
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

echo "🔍 Checking current status..."

# Check backend
if check_port 8000; then
    echo "✅ Backend already running on http://localhost:8000"
    BACKEND_RUNNING=true
else
    echo "❌ Backend not running"
    BACKEND_RUNNING=false
fi

# Check frontend (common Vite ports)
FRONTEND_RUNNING=false
for port in 5173 5174 5175 5176 5177 5178 5179 5180; do
    if check_port $port; then
        echo "✅ Frontend running on http://localhost:$port"
        FRONTEND_RUNNING=true
        break
    fi
done

if [ "$FRONTEND_RUNNING" = false ]; then
    echo "❌ Frontend not running"
fi

echo ""

# Ask user what to do
if [ "$BACKEND_RUNNING" = true ] || [ "$FRONTEND_RUNNING" = true ]; then
    echo "🤔 Some servers are already running. What would you like to do?"
    echo "1) Restart all servers (recommended)"
    echo "2) Start only stopped servers"
    echo "3) Stop all servers"
    echo "4) Exit"
    echo ""
    read -p "Choose option (1-4): " choice
    
    case $choice in
        1)
            echo "🔄 Restarting all servers..."
            bash "$SCRIPT_DIR/restart-servers.sh"
            ;;
        2)
            echo "🚀 Starting stopped servers..."
            if [ "$BACKEND_RUNNING" = false ]; then
                echo "Starting backend..."
                cd "$BACKEND_DIR" && source venv/bin/activate && python main.py &
            fi
            if [ "$FRONTEND_RUNNING" = false ]; then
                echo "Starting frontend..."
                cd "$FRONTEND_DIR" && npm run dev &
            fi
            ;;
        3)
            echo "🛑 Stopping all servers..."
            bash "$SCRIPT_DIR/stop-servers.sh"
            exit 0
            ;;
        4)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice"
            exit 1
            ;;
    esac
else
    echo "🚀 Starting development environment..."
    bash "$SCRIPT_DIR/start-servers.sh"
fi

echo ""
echo "🎉 Development environment ready!"
echo "================================"
echo "Backend API:  http://localhost:8000"
echo "Frontend App: Check terminal for port (usually 5173-5180)"
echo ""
echo "🛠️  Development Commands:"
echo "   ./stop-servers.sh    - Stop all servers"
echo "   ./restart-servers.sh - Restart all servers"
echo "   ./dev.sh             - This script"
echo ""
echo "Happy coding! 🚀"
