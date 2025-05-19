from flask import Flask, request, jsonify
import essentia.standard as es
import numpy as np
import subprocess
import os
import uuid

app = Flask(__name__)
TMP_DIR = "/tmp"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        video_url = data.get("video_url")
        if not video_url:
            return jsonify({"error": "Missing video_url"}), 400

        uid = uuid.uuid4().hex
        m4a_path = f"{TMP_DIR}/{uid}.m4a"
        wav_path = f"{TMP_DIR}/{uid}.wav"

        download_success = download_audio(video_url, m4a_path)
        if not download_success:
            return jsonify({"error": "Download failed"}), 500

        convert_success = convert_to_wav(m4a_path, wav_path)
        if not convert_success:
            return jsonify({"error": "Conversion failed"}), 500

        result = analyze_audio(wav_path)

        cleanup([m4a_path, wav_path])

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def download_audio(video_url, output_path):
    try:
        subprocess.run([
            "yt-dlp",
            "-f", "bestaudio[ext=m4a]",
            "--external-downloader", "aria2c",
            "--external-downloader-args", "aria2c:-x 16 -k 1M",
            "-o", output_path,
            "--no-warnings",
            video_url
        ], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def convert_to_wav(input_path, output_path):
    try:
        subprocess.run([
            "ffmpeg",
            "-y", "-i", input_path,
            "-ar", "44100",
            output_path
        ], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def analyze_audio(audio_path):
    extractor = es.MusicExtractor(lowlevelSilentFrames='drop')

    features, _ = extractor(audio_path)

    bpm = round(features['rhythm.bpm'])
    key = features['tonal.key_edma.key']
    scale = features['tonal.key_edma.scale']

    camelot_map = {
        "C major": "8B", "C minor": "5A",
        "C# major": "3B", "C# minor": "12A",
        "D major": "10B", "D minor": "7A",
        "D# major": "5B", "D# minor": "2A",
        "E major": "12B", "E minor": "9A",
        "F major": "7B", "F minor": "4A",
        "F# major": "2B", "F# minor": "11A",
        "G major": "9B", "G minor": "6A",
        "G# major": "4B", "G# minor": "1A",
        "A major": "11B", "A minor": "8A",
        "A# major": "6B", "A# minor": "3A",
        "B major": "1B", "B minor": "10A",
        "Db major": "3B", "Db minor": "12A",
        "Eb major": "5B", "Eb minor": "2A",
        "Gb major": "2B", "Gb minor": "11A",
        "Ab major": "4B", "Ab minor": "1A",
        "Bb major": "6B", "Bb minor": "3A"
    }
    camelot = camelot_map.get(f"{key} {scale}")

    loudness = round(features['lowlevel.loudness_ebu128.integrated'])
    energy = compute_energy(features)

    return {
        "bpm": bpm,
        "key": f"{key} {scale}",
        "camelot": camelot,
        "loudness": loudness,
        "energy": energy,
    }

def compute_energy(features):
    loudness = features['lowlevel.loudness_ebu128.integrated']
    loudness_score = np.clip((loudness + 60) / 60.0, 0.0, 1.0)

    onset_rate = features['rhythm.onset_rate']
    onset_score = np.clip(onset_rate / 10.0, 0.0, 1.0)

    spectral_complexity = features['lowlevel.spectral_complexity.mean']
    complexity_score = np.clip(spectral_complexity / 100.0, 0.0, 1.0)

    energy_score = (
        0.4 * loudness_score +
        0.35 * onset_score +
        0.25 * complexity_score
    )

    return round(energy_score * 100)

def cleanup(paths):
    for path in paths:
        if os.path.exists(path):
            os.remove(path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
