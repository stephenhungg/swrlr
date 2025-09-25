#!/usr/bin/env python3
"""
Real-time log monitor for Swrlr API
Usage: python monitor_logs.py
"""

import time
import json
import os
import sys
from datetime import datetime

def format_timestamp(iso_timestamp):
    """Format ISO timestamp to readable format"""
    try:
        dt = datetime.fromisoformat(iso_timestamp.replace('Z', '+00:00'))
        return dt.strftime('%H:%M:%S')
    except:
        return iso_timestamp

def format_log_entry(entry):
    """Format a log entry for display"""
    timestamp = format_timestamp(entry.get('timestamp', ''))
    text = entry.get('request', {}).get('text', '')[:40]
    if len(entry.get('request', {}).get('text', '')) > 40:
        text += '...'
    
    if entry.get('success', False):
        colors = entry.get('response', {}).get('colors', [])
        mood = entry.get('response', {}).get('mood', 'unknown')
        return f"[{timestamp}] ✅ '{text}' -> {len(colors)} colors ({mood})"
    else:
        error = entry.get('error', 'Unknown error')
        return f"[{timestamp}] ❌ '{text}' -> ERROR: {error}"

def monitor_logs(log_file="api_requests.log"):
    """Monitor log file for changes"""
    print("🔍 Monitoring Swrlr API logs...")
    print("Press Ctrl+C to stop\n")
    
    if not os.path.exists(log_file):
        print(f"❌ Log file not found: {log_file}")
        return
    
    # Get initial file size
    last_size = os.path.getsize(log_file)
    
    # Show recent entries
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            recent_lines = lines[-5:] if len(lines) > 5 else lines
            
            print("📜 Recent entries:")
            for line in recent_lines:
                if line.strip():
                    try:
                        entry = json.loads(line.strip())
                        print(f"   {format_log_entry(entry)}")
                    except json.JSONDecodeError:
                        continue
            print("\n🔄 Watching for new entries...\n")
    except Exception as e:
        print(f"❌ Error reading log file: {e}")
        return
    
    try:
        while True:
            current_size = os.path.getsize(log_file)
            
            if current_size > last_size:
                # File has grown, read new content
                with open(log_file, 'r', encoding='utf-8') as f:
                    f.seek(last_size)
                    new_content = f.read()
                    
                    for line in new_content.strip().split('\n'):
                        if line.strip():
                            try:
                                entry = json.loads(line.strip())
                                print(f"🆕 {format_log_entry(entry)}")
                            except json.JSONDecodeError:
                                continue
                
                last_size = current_size
            
            time.sleep(1)  # Check every second
            
    except KeyboardInterrupt:
        print("\n👋 Stopping log monitor...")
    except Exception as e:
        print(f"\n❌ Error monitoring logs: {e}")

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    monitor_logs()
