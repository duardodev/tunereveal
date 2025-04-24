FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libfftw3-dev libavcodec-dev libavformat-dev \
    libavutil-dev libswresample-dev python3-dev libsamplerate0-dev libtag1-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install "numpy<2"

RUN pip install essentia