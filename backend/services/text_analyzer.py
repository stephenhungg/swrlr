from typing import Dict, Any
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from models import GeminiAnalysisResult, GradientResponse

def convert_to_gradient(gemini_data: GeminiAnalysisResult) -> Dict[str, Any]:
    """
    Convert Gemini analysis results to gradient parameters.
    """
    colors = gemini_data.dominant_colors if gemini_data.dominant_colors else ["#4A90E2", "#6BB6FF", "#A8E6CF"]
    energy = gemini_data.energy_level

    # Determine animation based on energy level only
    if energy > 8:
        animation_type = "fast-spin"
        speed = "3s"
    elif energy > 6:
        animation_type = "medium-spin"
        speed = "6s"
    elif energy > 3:
        animation_type = "slow-pulse"
        speed = "10s"
    else:  # low energy
        animation_type = "slow-pulse"
        speed = "15s"

    # Determine gradient type based on energy
    gradient_type = "conic" if energy > 7 else "radial"

    # Generate simple mood based on energy
    if energy > 8:
        mood = "intense"
    elif energy > 6:
        mood = "energetic"
    elif energy > 3:
        mood = "calm"
    else:
        mood = "peaceful"

    return {
        "colors": colors,
        "animation_type": animation_type,
        "speed": speed,
        "gradient_type": gradient_type,
        "mood": mood,
        "energy_level": energy
    }

def create_css_gradient(colors: list, gradient_type: str) -> str:
    """
    Create CSS gradient string from colors and type.
    """
    color_string = ", ".join(colors)

    if gradient_type == "conic":
        return f"conic-gradient(from 0deg, {color_string})"
    else:
        return f"radial-gradient(circle at center, {color_string})"