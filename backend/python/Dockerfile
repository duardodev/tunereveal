FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
 libfftw3-dev \
 libavcodec-dev \
 ffmpeg \
 ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && mkdir -p /tmp && chmod -R a+rw /tmp

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

WORKDIR /app
COPY main.py ./
COPY app/ app/

EXPOSE 5000
CMD ["python", "-u", "main.py"]