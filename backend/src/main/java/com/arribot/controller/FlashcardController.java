package com.arribot.controller;

import com.arribot.model.Flashcard;
import com.arribot.service.FlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateFlashcards(@RequestBody Map<String, Object> request) {
        try {
            String topic = (String) request.get("topic");
            Integer count = request.get("count") != null ? ((Number) request.get("count")).intValue() : 5;

            if (topic == null || topic.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Topic cannot be empty"));
            }

            List<Flashcard> flashcards = flashcardService.generateFlashcards(topic, count);
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate flashcards: " + e.getMessage()));
        }
    }

    @GetMapping("/topic/{topic}")
    public ResponseEntity<?> getFlashcardsByTopic(@PathVariable String topic) {
        try {
            List<Flashcard> flashcards = flashcardService.getFlashcardsByTopic(topic);
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve flashcards: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllFlashcards() {
        try {
            List<Flashcard> flashcards = flashcardService.getAllFlashcards();
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve flashcards: " + e.getMessage()));
        }
    }
}
