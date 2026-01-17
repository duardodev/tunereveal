import subprocess
import json
import traceback
import os
import requests

def test_proxy(proxy_url):
    try:
        response = requests.get(
            "https://httpbin.org/ip",
            proxies={"http": proxy_url, "https": proxy_url},
            timeout=15
        )
        print(f"[DEBUG] Proxy working. IP: {response.json()['origin']}")
        return True
    except Exception as e:
        print(f"[ERROR] Proxy not working: {e}")
        return False


def download_audio(video_url, base_path):
    proxy_url = os.getenv("PROXY_URL")

    try:
        if proxy_url and not test_proxy(proxy_url):
            print("[WARNING] Proxy disabled due to failure")
            proxy_url = None

        command = [
            "yt-dlp",
            "--cookies", "cookies.txt",
            "--user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "-f", "bestaudio[ext=m4a]/bestaudio",
            "--limit-rate", "400K",
            "--no-playlist",
            "--no-warnings",
            "--newline",
            "-o", f"{base_path}.%(ext)s",
            video_url
        ]

        if proxy_url:
            command.extend(["--proxy", proxy_url])

        print("[DEBUG] Executing:", " ".join(command), flush=True)

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=300
        )

        if result.returncode != 0:
            raise RuntimeError(result.stderr)

        # detectar arquivo baixado
        for ext in ("m4a", "webm", "mp3", "opus"):
            path = f"{base_path}.{ext}"
            if os.path.exists(path):
                return path

        raise RuntimeError("Download finished but file not found")

    except Exception as e:
        stderr = str(e)

        if "Sign in to confirm" in stderr:
            return {
                "error": "YOUTUBE_BOT_PROTECTION",
                "retryable": False
            }

        if "fragment" in stderr or "aria2c" in stderr:
            return {
                "error": "FRAGMENT_DOWNLOAD_FAILED",
                "retryable": True
            }

        if "timed out" in stderr.lower():
            return {
                "error": "DOWNLOAD_TIMEOUT",
                "retryable": True
            }

        print("[ERROR] Download failed")
        print(stderr)
        print(traceback.format_exc())
        return {
            "error": "UNKNOWN_DOWNLOAD_ERROR",
            "retryable": False
        }
