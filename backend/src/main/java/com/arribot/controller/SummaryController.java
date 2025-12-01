package com.arribot.controller;

import com.arribot.model.Summary;
import com.arribot.service.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/summarize")
@CrossOrigin(origins = "*")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @PostMapping
    public ResponseEntity<?> summarizeText(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");

            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Text cannot be empty"));
            }

            Summary summary = summaryService.summarizeText(text);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to summarize text: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSummaries() {
        try {
            List<Summary> summaries = summaryService.getAllSummaries();
            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve summaries: " + e.getMessage()));
        }
    }
}
