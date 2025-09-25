#!/bin/bash

# Swrlr - Start All Servers
# This script starts both frontend and backend servers

set -e

echo "🚀 Starting Swrlr Servers..."
echo "================================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start backend
start_backend() {
    echo "🐍 Starting Backend Server..."
    cd "$BACKEND_DIR"
    
    if check_port 8000; then
        echo "⚠️  Backend already running on port 8000"
    else
        echo "   Activating virtual environment..."
        source venv/bin/activate
        echo "   Starting FastAPI server..."
        python main.py &
        BACKEND_PID=$!
        echo "   Backend PID: $BACKEND_PID"
        
        # Wait a moment for server to start
        sleep 3
        
        # Test if backend is responding
        if curl -s http://localhost:8000/health > /dev/null; then
            echo "✅ Backend server started successfully on http://localhost:8000"
        else
            echo "❌ Backend server failed to start"
            exit 1
        fi
    fi
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting Frontend Server..."
    cd "$FRONTEND_DIR"
    
    if check_port 5173; then
        echo "⚠️  Frontend already running (checking common ports)"
    else
        echo "   Installing dependencies (if needed)..."
        npm install --silent
        echo "   Starting Vite dev server..."
        npm run dev &
        FRONTEND_PID=$!
        echo "   Frontend PID: $FRONTEND_PID"
        
        # Wait for frontend to start
        sleep 5
        echo "✅ Frontend server started successfully"
        echo "   Check your browser for the running port (usually 5173-5180)"
    fi
}

# Start both servers
start_backend
echo ""
start_frontend

echo ""
echo "🎉 All servers started!"
echo "================================"
echo "Backend:  http://localhost:8000"
echo "Frontend: Check terminal output above for port"
echo ""
echo "💡 To stop servers, run: ./stop-servers.sh"
echo "💡 To restart servers, run: ./restart-servers.sh"
echo ""
echo "Press Ctrl+C to stop this script (servers will keep running)"
