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
            },
            timeout=15
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
        ]
        
        if proxy_url:
            command.extend(["--proxy", proxy_url])
        
        command.extend([
            "-f", "bestaudio/best",
            "--external-downloader", "aria2c",
            "--external-downloader-args", "aria2c:-x 16 -k 1M",
            "--print-json",
            "-o", f"{base_path}.%(ext)s",
            "--no-warnings",
            video_url
        ])
        
        print("[DEBUG] Executing command:", " ".join(command), flush=True)
        
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
            timeout=300
        )
        
        info = json.loads(result.stdout)
        return f"{base_path}.{info['ext']}"
        
    except subprocess.CalledProcessError as e:
        print("[ERROR] yt-dlp failed with CalledProcessError")
        print("Return code:", e.returncode)
        print("STDOUT:\n", e.stdout)
        print("STDERR:\n", e.stderr)
        
        try:
            debug_cmd = ["yt-dlp", "--list-formats", video_url]
            if proxy_url:
                debug_cmd.extend(["--proxy", proxy_url])
            debug_result = subprocess.run(debug_cmd, capture_output=True, text=True, timeout=30)
            print("[DEBUG] Available formats:\n", debug_result.stdout)
        except Exception as debug_error:
            print(f"[DEBUG] Could not list formats: {debug_error}")
        
        return False
        
    except json.JSONDecodeError as e:
        print("[ERROR] Failed to decode yt-dlp JSON")
        print("Output was:\n", result.stdout)
        print("Exception:\n", traceback.format_exc())
        return False
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Download timeout after 5 minutes")
        return False
        
    except Exception as e:
        print("[ERROR] Unexpected exception during download")
        print(traceback.format_exc())
        return False