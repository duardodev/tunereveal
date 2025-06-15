import essentia.standard as es
import numpy as np

def analyze_audio(audio_path):
    audio_st, _, _, _, _, _ = es.AudioLoader(filename=audio_path)()
    audio_st = es.StereoTrimmer()(audio_st)

    audio_mono = es.MonoLoader(filename=audio_path)()

    _, _, loudness, _ = es.LoudnessEBUR128(hopSize=1024/44100, startAtZero=True)(audio_st)
    loudness = round(float(loudness))

    rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
    bpm, beats, _, _, _ = rhythm_extractor(audio_mono)
    bpm = round(float(bpm))

    key_edma, scale_edma, _= es.KeyExtractor(profileType='edma')(audio_mono)
    key_temp, scale_temp, _ = es.KeyExtractor(profileType='temperley')(audio_mono)

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

    camelot = camelot_map.get(f"{key_edma} {scale_edma}")
    alternative_camelot = camelot_map.get(f"{key_temp} {scale_temp}")

    time_signature = compute_time_signature(beats, bpm)

    result = {
        "bpm": bpm,
        "key": f"{key_edma} {scale_edma}",
        "alternativeKey": f"{key_temp} {scale_temp}",
        "camelot": camelot,
        "alternativeCamelot": alternative_camelot,
        "loudness": loudness,
        "timeSignature": time_signature,
    }

    return result


def compute_time_signature(beats, bpm):
    if len(beats) < 4:
        return "4/4"

    intervals = np.diff(beats)
    mean_interval = np.median(intervals)

    if bpm >= 160:
        return "2/4"

    if 90 <= bpm <= 130:
        if mean_interval < 0.35:
            return "6/8"
        else:
            return "4/4"

    if 60 <= bpm < 90:
        return "3/4"

    return "4/4"