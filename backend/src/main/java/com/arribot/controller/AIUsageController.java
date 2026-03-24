package com.arribot.controller;

import com.arribot.service.AILimitsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai/usage")
@CrossOrigin(origins = "*")
public class AIUsageController {

    private final AILimitsService aiLimitsService;

    public AIUsageController(AILimitsService aiLimitsService) {
        this.aiLimitsService = aiLimitsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestParam String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
            }

            AILimitsService.AIUsageStats stats = aiLimitsService.getUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve usage stats: " + e.getMessage()));
        }
    }
}
