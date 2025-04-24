import sys
import json
from math import floor

import essentia
import essentia.standard as es
import numpy as np

def analyze_audio(audio_path):
    audio = es.MonoLoader(filename=audio_path, sampleRate=44100)()

    audio = audio / np.max(np.abs(audio))
    audio = 0.89 * audio

    filtered_audio = es.LowPass(cutoffFrequency=150)(audio)

    bpm, _, _, _, _ = es.RhythmExtractor2013(method="multifeature")(filtered_audio)

    key_extractor = es.KeyExtractor(
        profileType="edma",
        tuningFrequency=440.0,
        frameSize=16384,
        hopSize=4096
    )

    key, scale, _ = key_extractor(filtered_audio)

    return {
        "bpm": floor(bpm),
        "key": f"{key} {scale}",
    }

if __name__ == "__main__":
    try:
        result = analyze_audio(sys.argv[1])
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
