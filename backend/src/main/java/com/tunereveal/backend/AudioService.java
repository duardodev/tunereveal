package com.tunereveal.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class AudioService {
    @Value("${PYTHON_API_URL}")
    private String pythonApiUrl;

    public Map<String, Object> analyzeAudio(String videoUrl) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"video_url\": \"" + videoUrl + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = rest.postForEntity(pythonApiUrl, request, Map.class);

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("Python API Error: " + response.getBody());
        }

        return response.getBody();
    }
}
