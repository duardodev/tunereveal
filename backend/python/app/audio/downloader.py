import subprocess
import json
import traceback

def download_audio(video_url, base_path):
    try:
        command = [
            "yt-dlp",
            "--cookies", "cookies.txt",
            "-f", "bestaudio",
            "--external-downloader", "aria2c",
            "--external-downloader-args", "aria2c:-x 16 -k 1M",
            "--print-json",
            "-o", f"{base_path}.%(ext)s",
            "--no-warnings",
            "--verbose",
            video_url
        ]

        print("[DEBUG] Executing command:", " ".join(command), flush=True)

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )

        print("[YT-DLP STDOUT]:", result.stdout, flush=True)
        print("[YT-DLP STDERR]:", result.stderr, flush=True)

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
