package com.arribot.controller;

import com.arribot.model.Quiz;
import com.arribot.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody Map<String, Object> request) {
        try {
            String topic = (String) request.get("topic");
            Integer questionCount = request.get("questionCount") != null
                    ? ((Number) request.get("questionCount")).intValue()
                    : 5;
            String userId = (String) request.get("userId"); // TODO: Extract from JWT token in production

            if (topic == null || topic.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Topic cannot be empty"));
            }

            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
            }

            Quiz quiz = quizService.generateQuiz(topic, questionCount, userId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/topic/{topic}")
    public ResponseEntity<?> getQuizzesByTopic(@PathVariable String topic) {
        try {
            List<Quiz> quizzes = quizService.getQuizzesByTopic(topic);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve quizzes: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable String id) {
        try {
            Quiz quiz = quizService.getQuizById(id);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve quiz: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizService.getAllQuizzes();
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve quizzes: " + e.getMessage()));
        }
    }
}
