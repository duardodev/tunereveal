import sys
import shutil
import subprocess
import importlib

from app import create_app

def check_environment():
    print("=== ENVIRONMENT CHECK ===", flush=True)
    print("Python:", sys.version, flush=True)
    print("Python executable:", sys.executable, flush=True)

    packages = [
        "flask",
        "yt_dlp",
        "numpy",
        "essentia",
        "requests",
    ]

    for package in packages:
        try:
            module = importlib.import_module(package)
            version = getattr(module, "__version__", "installed")
            print(f"[OK] {package}: {version}", flush=True)
        except Exception as e:
            print(f"[ERROR] {package}: {e}", flush=True)

    yt_dlp_path = shutil.which("yt-dlp")
    ffmpeg_path = shutil.which("ffmpeg")

    print("yt-dlp executable:", yt_dlp_path, flush=True)
    print("ffmpeg executable:", ffmpeg_path, flush=True)

    try:
        result = subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            print("[OK] ffmpeg available", flush=True)
            print(
                result.stdout.splitlines()[0] if result.stdout else "",
                flush=True
            )
        else:
            print("[ERROR] ffmpeg returned an error", flush=True)

    except Exception as e:
        print("[ERROR] ffmpeg:", e, flush=True)

    print("=========================", flush=True)


app = create_app()

if __name__ == "__main__":
    check_environment()

    app.run(
        host="0.0.0.0",
        port=80
    )