# TuneReveal

[TuneReveal](https://tunereveal.vercel.app/) is a music analysis platform that extracts detailed audio features like **key**, **BPM**, **time signature** and more, directly from **YouTube videos**. Designed for DJs, music producers and music enthusiasts.

<img width="1300" alt="" src="https://imgur.com/YZokz2q.png">

---

## ✨ Features

- 🎧 Download audio directly from YouTube videos.
- 🎼 Analyze **key** and **camelot** (including alternative key detection).
- 🎚️ Detect **BPM (tempo)** accurately.
- 🥁 Time signature detection (e.g., 4/4, 3/4)
- 🔊 Loudness measurement (LUFS)
- 📊 Frontend interface to visualize results


## 🛠️ Tech Stack

- **Next.js + TypeScript** — Responsive and interactive frontend for visualizing and managing audio analysis results.
- **Spring Boot (Java 21)** — Main backend service and API provider.
- **Python + Flask** — Microservice for audio processing.
- **yt-dlp + ffmpeg + aria2c** — Audio processing (download and conversion).
- **Essentia** — Audio feature extraction (key, BPM, time signature, loudness).
- **Docker + Docker Compose** — Containerization and orchestration.

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- Docker & Docker Compose
- Node.js and npm (for frontend development)

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/duardodev/tunereveal.git
cd tunereveal
```

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy environment variables file:
   ```bash
   cp .env.example .env
   ```

3. Build and start backend and python service using Docker Compose:
   ```bash
   docker compose up --build
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Copy environment variables file:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

## 💻 Usage

1. Open the frontend app in your browser at `http://localhost:3000`.
2. Enter a YouTube video URL in the input form.
3. Submit and wait a few moments while the audio is processed.
4. View the detailed audio analysis results displayed on the page.

## 📡 API Endpoints

| Method | Endpoint        | Description                                        |
|--------|----------------|----------------------------------------------------|
| POST   | `/api/audio/analyze` | Submit a YouTube URL and receive audio analysis   |
| POST   | `/analyze`     | Audio analysis endpoint on Python microservice    |
| GET    | `/health`  | Health check endpoint                              |

## 🤝 Contributing

Contributions are welcome! If you'd like to enhance this project or report issues, please submit a pull request or open an issue.
