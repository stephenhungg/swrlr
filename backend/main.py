from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from models import TextAnalysisRequest, GradientResponse
from services.gemini_client import get_gemini_client
from services.text_analyzer import convert_to_gradient
from api_log import api_logger

app = FastAPI(title="Swrlr API", description="API for gradient generation from text")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://swrlr.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Swrlr API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/logs")
async def get_logs(count: int = 10):
    """Get recent API logs"""
    logs = api_logger.get_recent_logs(count)
    return {"logs": logs, "count": len(logs)}

@app.delete("/api/logs")
async def clear_logs():
    """Clear all API logs"""
    api_logger.clear_logs()
    return {"message": "Logs cleared successfully"}

@app.post("/api/analyze", response_model=GradientResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyze text and return gradient parameters.
    """
    print(f"🔍 Received request: text='{request.text[:50]}...', use_gemini={request.use_gemini}")
    gemini_raw_response = None

    try:
        if request.use_gemini and request.text.strip():
            print("🚀 Calling Gemini AI...")
            # Use Gemini AI for enhanced analysis
            client = get_gemini_client()
            gemini_result, gemini_raw_response = await client.analyze_text_with_raw(request.text)

            if gemini_result:
                print(f"✅ Gemini response: colors={gemini_result.dominant_colors}, energy={gemini_result.energy_level}")
                # Convert Gemini result to gradient parameters
                gradient_params = convert_to_gradient(gemini_result)
                gradient_params['svg_path'] = gemini_result.svg_path
                response = GradientResponse(**gradient_params)

                # Log successful request
                api_logger.log_request(
                    text=request.text,
                    use_gemini=request.use_gemini,
                    response_data=response.dict(),
                    gemini_raw=gemini_raw_response
                )

                return response
            else:
                print("❌ Gemini returned None - using fallback")

        # Fallback to simple response if Gemini fails or is disabled
        print("🔄 Using fallback response")
        response = GradientResponse(
            colors=["#4A90E2", "#6BB6FF", "#A8E6CF"],
            animation_type="medium-spin",
            speed="8s",
            gradient_type="radial",
            mood="neutral",
            energy_level=5
        )

        # Log fallback request
        api_logger.log_request(
            text=request.text,
            use_gemini=request.use_gemini,
            response_data=response.dict(),
            gemini_raw="FALLBACK_USED"
        )

        return response

    except Exception as e:
        print(f"💥 Error: {str(e)}")
        # Log error
        api_logger.log_error(text=request.text, error=str(e))
        raise HTTPException(status_code=500, detail=f"Error analyzing text: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))