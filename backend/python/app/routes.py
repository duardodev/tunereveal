from flask import Blueprint, request, jsonify
from app.audio.downloader import download_audio
from app.audio.converter import convert_to_wav
from app.audio.analyzer import analyze_audio
from app.audio.utils import cleanup
import os
import base64
import uuid

api_bp = Blueprint('api', __name__)
TMP_DIR = "/tmp"

cookies_b64 = os.environ.get("COOKIES_B64")
if cookies_b64:
    with open("cookies.txt", "wb") as f:
        f.write(base64.b64decode(cookies_b64))

@api_bp.route("/health", methods=["GET", "HEAD"])
def health():
    return "OK", 200

@api_bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        video_url = data.get("video_url")
        if not video_url:
            return jsonify({"error": "Missing video_url"}), 400

        uid = uuid.uuid4().hex
        base_path = f"{TMP_DIR}/{uid}"

        audio_path = download_audio(video_url, base_path)
        if not audio_path:
            return jsonify({"error": "Download failed"}), 500

        wav_path = f"{base_path}.wav"

        convert_success = convert_to_wav(audio_path, wav_path)
        if not convert_success:
            return jsonify({"error": "Conversion failed"}), 500

        result = analyze_audio(wav_path)

        cleanup([audio_path, wav_path])

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500