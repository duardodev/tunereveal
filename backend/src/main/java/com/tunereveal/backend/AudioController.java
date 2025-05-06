package com.tunereveal.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/audio")
public class AudioController {
    private final AudioService audioService;

    @Autowired
    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAudio(@RequestBody Map<String, String> request) {
        String videoUrl = request.get("videoUrl");

        if (videoUrl == null || videoUrl.isEmpty()) {
            return ResponseEntity.badRequest().body("Video URL is required!");
        }

        try {
            Map<String, Object> analysisResult = audioService.analyzeAudio(videoUrl);
            return ResponseEntity.ok(analysisResult);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing audio!");
        }
    }
}
