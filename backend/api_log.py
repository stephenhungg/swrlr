import json
import datetime
import os
from typing import Any, Dict
from pathlib import Path

class APILogger:
    def __init__(self, log_file_path: str = "api_requests.log"):
        self.log_file_path = log_file_path
        self.ensure_log_file_exists()

    def log_request(self, text: str, use_gemini: bool, response_data: Dict[str, Any], gemini_raw: str = None):
        """Log API request and response"""
        timestamp = datetime.datetime.now().isoformat()

        log_entry = {
            "timestamp": timestamp,
            "request": {
                "text": text,
                "text_length": len(text),
                "use_gemini": use_gemini
            },
            "response": response_data,
            "gemini_raw_response": gemini_raw if gemini_raw else None,
            "success": True
        }

        self._write_log(log_entry)

    def log_error(self, text: str, error: str):
        """Log API errors"""
        timestamp = datetime.datetime.now().isoformat()

        log_entry = {
            "timestamp": timestamp,
            "request": {
                "text": text,
                "text_length": len(text)
            },
            "error": str(error),
            "success": False
        }

        self._write_log(log_entry)

    def ensure_log_file_exists(self):
        """Ensure log file exists and is writable"""
        try:
            Path(self.log_file_path).touch(exist_ok=True)
            print(f"📝 API Logger initialized: {os.path.abspath(self.log_file_path)}")
        except Exception as e:
            print(f"❌ Failed to initialize log file: {e}")

    def _write_log(self, log_entry: Dict[str, Any]):
        """Write log entry to file"""
        try:
            # Print to console for real-time monitoring
            if log_entry.get("success", False):
                text_preview = log_entry["request"]["text"][:30]
                if len(log_entry["request"]["text"]) > 30:
                    text_preview += "..."
                print(f"📝 LOGGED: '{text_preview}' -> {len(log_entry['response'].get('colors', []))} colors")
            else:
                print(f"📝 ERROR LOGGED: {log_entry.get('error', 'Unknown error')}")
            
            # Write to file
            with open(self.log_file_path, "a", encoding="utf-8") as f:
                json.dump(log_entry, f, ensure_ascii=False)
                f.write("\n")
                f.flush()  # Force write to disk
                
        except Exception as e:
            print(f"❌ Failed to write to log file: {e}")

    def get_recent_logs(self, count: int = 10):
        """Get recent log entries"""
        try:
            with open(self.log_file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                recent_lines = lines[-count:] if len(lines) > count else lines
                return [json.loads(line.strip()) for line in recent_lines if line.strip()]
        except Exception as e:
            print(f"Failed to read log file: {e}")
            return []

    def clear_logs(self):
        """Clear all logs"""
        try:
            with open(self.log_file_path, "w", encoding="utf-8") as f:
                f.write("")
            print(f"🧹 Cleared all logs from {self.log_file_path}")
        except Exception as e:
            print(f"❌ Failed to clear logs: {e}")

# Global logger instance
api_logger = APILogger()