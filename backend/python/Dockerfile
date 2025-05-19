FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libfftw3-dev \
    libavcodec-dev \
    ffmpeg \
    aria2 \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /tmp && chmod -R a+rw /tmp

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

WORKDIR /app
COPY app.py ./

EXPOSE 5000
CMD ["python", "app.py"]
