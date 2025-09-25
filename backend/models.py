from pydantic import BaseModel
from typing import List, Optional

class TextAnalysisRequest(BaseModel):
    text: str
    use_gemini: bool = True

class GradientResponse(BaseModel):
    colors: List[str]
    animation_type: str
    speed: str
    gradient_type: str
    mood: Optional[str] = None
    energy_level: Optional[int] = None
    svg_path: Optional[str] = None

class GeminiAnalysisResult(BaseModel):
    dominant_colors: List[str]
    energy_level: int
    svg_path: Optional[str] = None
