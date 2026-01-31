import subprocess
import traceback
import os
import glob
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


def find_downloaded_audio(base_path):
    matches = glob.glob(f"{base_path}.*")
    if not matches:
        raise RuntimeError("Download finished but no output file was found")
    return matches[0]


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
            "Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
            "--extractor-args", "youtube:player_client=android",
            "--add-header", "Accept-Language:en-US,en;q=0.9",

            "-f", "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best[ext=m4a]/best[ext=webm]/best",
            "--no-playlist",
            "--no-warnings",
            "--newline",
            "--extractor-retries", "3",
            "--fragment-retries", "5",

            "--extract-audio",
            "--audio-format", "best",
            "-o", f"{base_path}.%(ext)s",
        ]

        if proxy_url:
            print(f"[DEBUG] Using proxy: {proxy_url}")
            command.extend(["--proxy", proxy_url])

        command.append(video_url)

        print("[DEBUG] Executing:", " ".join(command), flush=True)

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=300
        )

        if result.returncode != 0:
            print("[ERROR] Download failed")
            print(result.stderr)
            raise RuntimeError(result.stderr)

        downloaded_file = find_downloaded_audio(base_path)
        
        file_size = os.path.getsize(downloaded_file)
        if file_size == 0:
            raise RuntimeError("Downloaded file is empty (0 bytes)")
        
        print(f"[DEBUG] Download successful: {downloaded_file} ({file_size} bytes)")
        return downloaded_file

    except Exception as e:
        stderr = str(e)

        if "HTTP Error 403" in stderr or "Forbidden" in stderr:
            return {
                "error": "YOUTUBE_ACCESS_DENIED",
                "message": "YouTube blocked access",
                "retryable": False
            }

        if "Sign in to confirm" in stderr:
            return {
                "error": "YOUTUBE_BOT_PROTECTION",
                "message": "YouTube requires sign-in verification",
                "retryable": False
            }

        if "empty" in stderr.lower():
            return {
                "error": "EMPTY_DOWNLOAD",
                "message": "File is empty",
                "retryable": True
            }

        if "Requested format is not available" in stderr:
            return {
                "error": "AUDIO_FORMAT_NOT_AVAILABLE",
                "message": "No audio format available for this video",
                "retryable": False
            }

        if "fragment" in stderr.lower():
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
            "message": str(e)[:200],
            "retryable": False
        }