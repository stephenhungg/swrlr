import google.generativeai as genai
import json
import os
from typing import Optional
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from models import GeminiAnalysisResult

class GeminiClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_text(self, text: str) -> Optional[GeminiAnalysisResult]:
        """
        Analyze text using Gemini AI and return visual characteristics.
        """
        result, _ = await self.analyze_text_with_raw(text)
        return result

    async def analyze_text_with_raw(self, text: str) -> tuple[Optional[GeminiAnalysisResult], Optional[str]]:
        """
        Analyze text using Gemini AI and return both parsed result and raw response.
        """
        print(f"🔮 Gemini analyzing: '{text[:30]}...'")
        try:
            prompt = f"""
            Analyze this text for a particle effect: "{text}"

            Return JSON with these fields:
            {{
                "dominant_colors": ["#color1", "#color2", "#color3"],
                "energy_level": 5,
                "svg_path": "M 50 10 L 90 50 L 50 90 L 10 50 Z"
            }}

            Rules:
            - dominant_colors: 3-4 hex colors representing the text's visual essence
            - energy_level: 1-10 (1=calm, 10=intense)  
            - svg_path: A simple SVG path string representing the shape/object in the text. Use coordinates 0-100. For "cube" make a square, for "circle" make a circle, for "wave" make a wavy line, etc. Keep it simple and accurate. If no clear shape, use null.

            Examples:
            - Square: "M 20 20 L 80 20 L 80 80 L 20 80 Z"
            - Circle: "M 50 10 A 40 40 0 1 1 49 10 Z"  
            - Triangle: "M 50 10 L 90 80 L 10 80 Z"
            - Wave: "M 10 50 Q 30 20 50 50 T 90 50"

            Return only valid JSON, no markdown or extra text.
            """

            print("📡 Sending request to Gemini API...")
            response = self.model.generate_content(prompt)
            raw_response = response.text
            print(f"📥 Raw Gemini response: {raw_response[:200]}...")

            result = self._parse_gemini_response(raw_response)
            if result:
                print("✅ Successfully parsed Gemini response")
            return result, raw_response

        except Exception as e:
            print(f"💥 Gemini API Error: {e}")
            return None, None

    def _parse_gemini_response(self, response_text: str) -> Optional[GeminiAnalysisResult]:
        """
        Parse the JSON response from Gemini.
        """
        try:
            # Clean up the response text
            cleaned_text = response_text.strip()

            # Remove any markdown code blocks
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:-3].strip()
            elif cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:-3].strip()

            # Parse JSON
            data = json.loads(cleaned_text)

            # Validate required fields
            required_fields = ["dominant_colors", "energy_level"]
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            
            # svg_path is optional
            if "svg_path" not in data:
                data["svg_path"] = None

            return GeminiAnalysisResult(**data)

        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing Gemini response: {e}")
            print(f"Raw response: {response_text}")
            return None

# Global instance
gemini_client = None

def get_gemini_client() -> GeminiClient:
    """
    Get or create the global Gemini client instance.
    """
    global gemini_client
    if gemini_client is None:
        gemini_client = GeminiClient()
    return gemini_client