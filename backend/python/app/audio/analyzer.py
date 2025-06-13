import essentia.standard as es

def analyze_audio(audio_path):
    extractor = es.MusicExtractor(lowlevelSilentFrames='drop')

    features, _ = extractor(audio_path)

    bpm = round(features['rhythm.bpm'])
    key = features['tonal.key_edma.key']
    scale = features['tonal.key_edma.scale']
    alternative_key = features['tonal.key_temperley.key']
    alternative_scale = features['tonal.key_temperley.scale']

    camelot_map = {
        "C major": "8B", "C minor": "5A",
        "C# major": "3B", "C# minor": "12A",
        "D major": "10B", "D minor": "7A",
        "D# major": "5B", "D# minor": "2A",
        "E major": "12B", "E minor": "9A",
        "F major": "7B", "F minor": "4A",
        "F# major": "2B", "F# minor": "11A",
        "G major": "9B", "G minor": "6A",
        "G# major": "4B", "G# minor": "1A",
        "A major": "11B", "A minor": "8A",
        "A# major": "6B", "A# minor": "3A",
        "B major": "1B", "B minor": "10A",
        "Db major": "3B", "Db minor": "12A",
        "Eb major": "5B", "Eb minor": "2A",
        "Gb major": "2B", "Gb minor": "11A",
        "Ab major": "4B", "Ab minor": "1A",
        "Bb major": "6B", "Bb minor": "3A"
    }

    camelot = camelot_map.get(f"{key} {scale}")
    alternative_camelot = camelot_map.get(f"{alternative_key} {alternative_scale}")

    loudness = round(features['lowlevel.loudness_ebu128.integrated'])
    time_signature = compute_time_signature(features)

    return {
        "bpm": bpm,
        "key": f"{key} {scale}",
        "alternativeKey": f"{alternative_key} {alternative_scale}",
        "camelot": camelot,
        "alternativeCamelot": alternative_camelot,
        "loudness": loudness,
        "timeSignature": time_signature,
    }


def compute_time_signature(features):
    beats_count = features['rhythm.beats_count']
    bpm = features['rhythm.bpm']
    beat_histogram = features['rhythm.bpm_histogram']

    if beats_count in {2, 3, 4, 5, 6, 7}:
        time_sigs = {
            2: "2/4",
            3: "3/4",
            4: "4/4",
            5: "5/4",
            6: "6/8",
            7: "7/4"
        }
        return time_sigs[beats_count, "4/4"]

    if bpm > 160:
        return "2/4" if bpm % 2 == 0 else "4/4"
    elif 80 <= bpm <= 120:
        return "6/8" if len(beat_histogram) > 3 and beat_histogram[3] < 0.5 else "4/4"
    else:
        return "4/4"