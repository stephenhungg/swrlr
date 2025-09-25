#!/bin/bash

echo "🧪 Testing SVG Particle System"
echo "=============================="

echo ""
echo "1️⃣ Testing Backend API..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "red square", "use_gemini": true}')

echo "API Response:"
echo "$RESPONSE" | jq '.'

echo ""
echo "2️⃣ Extracting SVG Path..."
SVG_PATH=$(echo "$RESPONSE" | jq -r '.svg_path')
echo "SVG Path: $SVG_PATH"

echo ""
echo "3️⃣ Testing Frontend Connection..."
if curl -s http://localhost:5175 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:5175"
else
    echo "❌ Frontend not accessible"
fi

echo ""
echo "🔍 Instructions:"
echo "1. Open http://localhost:5175 in your browser"
echo "2. Open Developer Console (F12)"
echo "3. Type 'red square' and press Enter"
echo "4. Look for these console messages:"
echo "   🔍 API Response: {...}"
echo "   🔄 SVG path changed: ..."
echo "   🎨 Parsing SVG path: ..."
echo "   🎯 Simple center force applied: ..."
echo ""
echo "If you see those messages, the system is working!"
echo "If particles still don't move to center, there's a rendering issue."
