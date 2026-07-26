import sqlite3
import json
import os
from datetime import datetime, timedelta

CACHE_DB_PATH = "/tmp/analysis_cache.db"
INACTIVITY_DAYS = 60  # Remove entries not accessed in 60 days

def init_cache():
    """Initialize the cache database."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_cache (
            youtube_id TEXT PRIMARY KEY,
            result_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_cached_analysis(youtube_id):
    """Get cached analysis if exists and update last_accessed."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT result_json FROM analysis_cache 
        WHERE youtube_id = ?
    ''', (youtube_id,))
    
    row = cursor.fetchone()
    
    if row:
        # Update last_accessed timestamp
        cursor.execute('''
            UPDATE analysis_cache 
            SET last_accessed = CURRENT_TIMESTAMP 
            WHERE youtube_id = ?
        ''', (youtube_id,))
        conn.commit()
    
    conn.close()
    
    if not row:
        return None
    
    result_json = row[0]
    return json.loads(result_json)

def save_analysis_to_cache(youtube_id, result):
    """Save analysis result to cache."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO analysis_cache (youtube_id, result_json, created_at, last_accessed)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (youtube_id, json.dumps(result)))
    
    conn.commit()
    conn.close()

def delete_cached_analysis(youtube_id):
    """Delete analysis from cache."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM analysis_cache WHERE youtube_id = ?', (youtube_id,))
    
    conn.commit()
    conn.close()

def clear_inactive_cache():
    """Clear entries not accessed in INACTIVITY_DAYS."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        DELETE FROM analysis_cache 
        WHERE last_accessed < datetime('now', '-' || ? || ' days')
    ''', (INACTIVITY_DAYS,))
    
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    
    return deleted_count

def get_cache_stats():
    """Get cache statistics."""
    conn = sqlite3.connect(CACHE_DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM analysis_cache')
    total_count = cursor.fetchone()[0]
    
    cursor.execute('''
        SELECT COUNT(*) FROM analysis_cache 
        WHERE last_accessed > datetime('now', '-' || ? || ' days')
    ''', (INACTIVITY_DAYS,))
    active_count = cursor.fetchone()[0]
    
    # Get cache size in bytes
    cursor.execute('SELECT SUM(LENGTH(result_json)) FROM analysis_cache')
    size_result = cursor.fetchone()[0]
    cache_size_bytes = size_result if size_result else 0
    
    conn.close()
    
    return {
        "total_entries": total_count,
        "active_entries": active_count,
        "inactive_entries": total_count - active_count,
        "inactivity_days": INACTIVITY_DAYS,
        "cache_size_bytes": cache_size_bytes,
        "cache_size_mb": round(cache_size_bytes / (1024 * 1024), 2)
    }
