import subprocess
import json
import traceback
import os
import requests

def test_proxy(proxy_url):
    try:
        response = requests.get(
            "https://httpbin.org/ip",
            proxies={
                "http": proxy_url,
                "https": proxy_url
            }
        )

        print(f"[DEBUG] Proxy working. IP: {response.json()['origin']}")
        return True
    except Exception as e:
        print(f"[ERROR] Proxy not working: {e}")
        return False

def download_audio(video_url, base_path):
    try:
        proxy_url = os.getenv('PROXY_URL')

        if proxy_url and not test_proxy(proxy_url):
            print(f"[WARNING] Proxy is not working!")
            proxy_url = None

        command = [
            "yt-dlp",
            "--cookies", "cookies.txt",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--proxy", proxy_url,
            "-f", "bestaudio",
            "--external-downloader", "aria2c",
            "--external-downloader-args", "aria2c:-x 16 -k 1M",
            "--print-json",
            "-o", f"{base_path}.%(ext)s",
            "--no-warnings",
            video_url
        ]

        print("[DEBUG] Executing command:", " ".join(command), flush=True)

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )

        info = json.loads(result.stdout)
        return f"{base_path}.{info['ext']}"

    except subprocess.CalledProcessError as e:
        print("[ERROR] yt-dlp failed with CalledProcessError")
        print("Return code:", e.returncode)
        print("STDOUT:\n", e.stdout)
        print("STDERR:\n", e.stderr)
        return False

    except json.JSONDecodeError as e:
        print("[ERROR] Failed to decode yt-dlp JSON")
        print("Output was:\n", result.stdout)
        print("Exception:\n", traceback.format_exc())
        return False

    except Exception as e:
        print("[ERROR] Unexpected exception during download")
        print(traceback.format_exc())
        return False
