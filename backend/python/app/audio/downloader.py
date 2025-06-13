import subprocess
import json

def download_audio(video_url, base_path):
    try:
        result = subprocess.run([
            "yt-dlp",
            "--cookies", "cookies.txt",
            "-f", "bestaudio",
            "--external-downloader", "aria2c",
            "--external-downloader-args", "aria2c:-x 16 -k 1M",
            "--print-json",
            "-o", f"{base_path}.%(ext)s",
            "--no-warnings",
            video_url
        ],
            capture_output=True,
            text=True,
            check=True
        )

        info = json.loads(result.stdout)
        return f"{base_path}.{info['ext']}"
    except subprocess.CalledProcessError as e:
            return False