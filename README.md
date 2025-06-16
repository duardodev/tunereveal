# TuneReveal

[TuneReveal](https://tunereveal.vercel.app/) is a music analysis platform that extracts detailed audio features like **key**, **BPM**, **time signature** and more, directly from **YouTube videos**. Designed for DJs, music producers and music enthusiasts.
<img width="1301" alt="Screenshot 2024-02-09 at 4 19 56 PM" src="https://imgur.com/CD6laza.png">

## ✨ Features

- 🎧 Download audio directly from YouTube videos.
- 🎼 Analyze **key** and **camelot** (including alternative key detection).
- 🎚️ Detect **BPM (tempo)** accurately.
- 🥁 Analyze **time signature (meter)**.
- 📏 Accurate **loudness measurement**.

---

## 🛠️ Tech Stack

- **Next.js + TypeScript** — Responsive and interactive frontend for visualizing and managing audio analysis results.
- **Spring Boot (Java 21)** — Main backend service and API provider.
- **Python + Flask** — Microservice for audio processing.
- **yt-dlp + ffmpeg + aria2c** — Audio processing (download and conversion).
- **Essentia** — Audio feature extraction (key, BPM, time signature, loudness).
- **Docker + Docker Compose** — Containerization and orchestration.

---

## ✅ Prerequisites

- Docker & Docker Compose installed
- (Optional) Java 21 and Node.js if running without Docker
