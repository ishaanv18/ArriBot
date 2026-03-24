package com.arribot.controller;

import com.arribot.model.LearningPath;
import com.arribot.service.LearningPathService;
import com.arribot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-path")
@CrossOrigin(origins = "*")
public class LearningPathController {

    @Autowired
    private LearningPathService learningPathService;

    @Autowired
    private JwtUtil jwtUtil;

    // ─── POST /api/learning-path/generate ───────────────────────────────────────
    /**
     * Generate a new AI-powered learning path.
     * Body: { "goal": "Master Data Structures", "weeks": 4 }
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateLearningPath(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {
        try {
            String userId = extractUserId(request);

            String goal = (String) body.get("goal");
            int weeks = body.containsKey("weeks") ? (int) body.get("weeks") : 4;

            if (goal == null || goal.trim().isEmpty()) {
                return error("Goal is required", HttpStatus.BAD_REQUEST);
            }
            if (weeks < 1 || weeks > 12) {
                return error("Weeks must be between 1 and 12", HttpStatus.BAD_REQUEST);
            }

            LearningPath path = learningPathService.generateAndSave(userId, goal, weeks);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Learning path generated successfully");
            response.put("data", path);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return error("Failed to generate learning path: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── GET /api/learning-path ──────────────────────────────────────────────────
    /**
     * Get all learning paths for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<?> getUserPaths(HttpServletRequest request) {
        try {
            String userId = extractUserId(request);
            List<LearningPath> paths = learningPathService.getUserPaths(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paths);
            response.put("total", paths.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return error("Failed to fetch learning paths: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── GET /api/learning-path/{id} ────────────────────────────────────────────
    /**
     * Get a specific learning path by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPathById(@PathVariable String id, HttpServletRequest request) {
        try {
            String userId = extractUserId(request);

            return learningPathService.getPathById(id, userId)
                    .map(path -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("data", path);
                        return (ResponseEntity<Map<String, Object>>) ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> error("Learning path not found", HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return error("Failed to fetch learning path: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── PATCH /api/learning-path/{id}/milestone ─────────────────────────────────
    /**
     * Mark a daily milestone as completed or not.
     * Body: { "week": 1, "day": 3, "completed": true }
     */
    @PatchMapping("/{id}/milestone")
    public ResponseEntity<?> updateMilestone(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {
        try {
            String userId = extractUserId(request);

            int week = (int) body.get("week");
            int day = (int) body.get("day");
            boolean completed = (boolean) body.get("completed");

            LearningPath updated = learningPathService.updateMilestoneComplete(id, userId, week, day, completed);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Milestone updated successfully");
            response.put("data", updated);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return error("Failed to update milestone: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── DELETE /api/learning-path/{id} ─────────────────────────────────────────
    /**
     * Delete a learning path by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePath(@PathVariable String id, HttpServletRequest request) {
        try {
            String userId = extractUserId(request);
            learningPathService.deletePath(id, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Learning path deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return error("Failed to delete learning path: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── Private helpers ─────────────────────────────────────────────────────────

    private String extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized: missing or invalid token");
        }
        String token = authHeader.substring(7);
        // Use email as the userId (consistent with the rest of the app)
        return jwtUtil.extractEmail(token);
    }

    private ResponseEntity<Map<String, Object>> error(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}
