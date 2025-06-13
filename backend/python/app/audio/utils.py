import os

def cleanup(paths):
    for path in paths:
        if os.path.exists(path):
            os.remove(path)
