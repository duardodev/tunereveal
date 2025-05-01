package com.tunereveal.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

@Service
public class AudioService {
    private static final String DOWNLOAD_PATH = "downloads/audio.wav";

    public Map<String, Object> downloadAndAnalyze(String videoUrl) throws IOException, InterruptedException {
        boolean downloadSuccess = downloadAudio(videoUrl);

        if (!downloadSuccess) {
            throw new RuntimeException("Error downloading audio!");
        }

        return analyzeAudio();
    }

    private boolean downloadAudio(String videoUrl) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "yt-dlp", "--extract-audio", "--audio-format", "wav", "--audio-quality", "0", "-o",  DOWNLOAD_PATH, videoUrl
        );

        Process process = processBuilder.start();
        int exitCode = process.waitFor();
        return exitCode == 0;
    }

    private Map<String, Object> analyzeAudio() throws IOException, InterruptedException {
        Process process = getProcess();

        String jsonOutput = "";

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().startsWith("{")) {
                    jsonOutput = line;
                    break;
                }
            }
        };

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Error analyzing audio!");
        };

        if (jsonOutput.isEmpty()) {
            throw new RuntimeException("No valid JSON found in Python output.");
        }
        
        new File(DOWNLOAD_PATH).delete();

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonOutput, Map.class);
    }

    private static Process getProcess() throws IOException {
        String downloadsPath = new File("downloads/audio.wav").getAbsolutePath();
        String scriptsPath = new File("scripts").getAbsolutePath();

        ProcessBuilder processBuilder = new ProcessBuilder(
                "docker", "run", "--rm",
                "-v", downloadsPath + ":/audio.wav",
                "-v", scriptsPath + ":/scripts",
                "essentia-python",
                "python", "/scripts/analyze_audio.py", "/audio.wav"
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        return process;
    }
}
