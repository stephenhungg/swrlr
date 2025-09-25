#!/bin/bash

# Test script for Swrlr API logging
echo "🧪 Testing Swrlr API Logging System"
echo "=================================="

# Test 1: Simple test
echo "1️⃣ Testing fallback response..."
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "simple test", "use_gemini": false}' \
  -s | jq '.colors | length' | xargs echo "Colors returned:"

echo ""

# Test 2: Gemini test (if API key is available)
echo "2️⃣ Testing Gemini AI response..."
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "vibrant sunset over the ocean", "use_gemini": true}' \
  -s | jq '.colors | length' | xargs echo "Colors returned:"

echo ""

# Test 3: Check recent logs
echo "3️⃣ Recent API logs:"
curl -s "http://localhost:8000/api/logs?count=5" | jq '.logs[] | {timestamp: .timestamp, text: .request.text, success: .success, colors: (.response.colors | length)}'

echo ""
echo "✅ Test complete!"
echo ""
echo "💡 To monitor logs in real-time:"
echo "   cd backend && python monitor_logs.py"
