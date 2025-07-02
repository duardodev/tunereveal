import subprocess

def convert_to_wav(input_path, output_path):
    try:
        subprocess.run([
            "ffmpeg",
            "-y",
            "-i", input_path,
            "-ac", "1",
            "-ar", "22050",
            output_path
        ], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Conversion error: {e}")
        return False