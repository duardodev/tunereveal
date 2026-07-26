from flask import Blueprint, request, jsonify
from app.audio.downloader import download_audio
from app.audio.converter import convert_to_wav
from app.audio.analyzer import analyze_audio
from app.audio.utils import cleanup
from app.cache import init_cache, get_cached_analysis, save_analysis_to_cache, get_cache_stats, clear_inactive_cache
from app.youtube_utils import extract_youtube_id
import gc
import os
import base64
import uuid

api_bp = Blueprint('api', __name__)
TMP_DIR = "/tmp"

# Initialize cache on startup
init_cache()

if os.getenv("COOKIES_B64"):
    with open("cookies.txt", "wb") as f:
        f.write(base64.b64decode(os.getenv("COOKIES_B64")))

@api_bp.route("/health", methods=["GET", "HEAD"])
def health():
    return "OK", 200

@api_bp.route("/cache/stats", methods=["GET"])
def cache_stats():
    """Get cache statistics."""
    stats = get_cache_stats()
    return jsonify(stats)

@api_bp.route("/cache/clear-inactive", methods=["POST"])
def clear_inactive():
    """Clear inactive cache entries (not accessed in 180 days)."""
    deleted_count = clear_inactive_cache()
    return jsonify({
        "message": f"Cleared {deleted_count} inactive entries",
        "deleted_count": deleted_count
    })

@api_bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        youtube_music_url = data.get("youtube_music_url")
        if not youtube_music_url:
            return jsonify({"error": "Missing youtube_music_url"}), 400

        # Extract YouTube ID for caching
        youtube_id = extract_youtube_id(youtube_music_url)
        if not youtube_id:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        # Check cache first
        cached_result = get_cached_analysis(youtube_id)
        if cached_result:
            cached_result["cached"] = True
            return jsonify(cached_result)

        # If not in cache, perform analysis
        uid = uuid.uuid4().hex
        base_path = f"{TMP_DIR}/{uid}"

        audio_path = download_audio(youtube_music_url, base_path)
        if not audio_path:
            return jsonify({"error": "Download failed"}), 500

        wav_path = f"{base_path}.wav"

        convert_success = convert_to_wav(audio_path, wav_path)
        if not convert_success:
            return jsonify({"error": "Conversion failed"}), 500

        result = analyze_audio(wav_path)

        cleanup([audio_path, wav_path])
        gc.collect()

        # Save to cache
        result["cached"] = False
        save_analysis_to_cache(youtube_id, result)

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500