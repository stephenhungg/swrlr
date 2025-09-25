# swrlr

Particle visualization app that turns text into dynamic visual effects.

## What it does

Type anything → get animated particles in matching colors. Uses AI to pick colors and creates different particle patterns.

## Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env
python main.py
```

## Environment

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

**Backend (.env):**
```
GEMINI_API_KEY=your_key_here
FRONTEND_URL=http://localhost:5173
```

## Deploy

- Frontend: Vercel
- Backend: Railway/Render/etc

## Tech

React + TypeScript + FastAPI + Gemini AI