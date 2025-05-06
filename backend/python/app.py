from flask import Flask, request, jsonify
import essentia.standard as es
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
            "-ar", "44100", "-ac", "1",
            output_path
        ], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def analyze_audio(audio_path):
    audio = es.MonoLoader(filename=audio_path, sampleRate=44100)()
    bpm, _, _, _, _ = es.RhythmExtractor2013(method="multifeature")(audio)

    key_extractor = es.KeyExtractor(
        profileType="temperley2005",
        tuningFrequency=440.0,
        frameSize=8192,
        hopSize=2048
    )
    key, scale, _ = key_extractor(audio)

    return {
        "bpm": round(bpm),
        "key": f"{key} {scale}",
    }

def cleanup(paths):
    for path in paths:
        if os.path.exists(path):
            os.remove(path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
