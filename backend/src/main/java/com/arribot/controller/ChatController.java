package com.arribot.controller;

import com.arribot.model.ChatMessage;
import com.arribot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            String sessionId = request.get("sessionId");
            String userId = request.get("userId"); // TODO: Extract from JWT token in production

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
            }

            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
            }

            ChatMessage chatMessage = chatService.sendMessage(message, sessionId, userId);
            return ResponseEntity.ok(chatMessage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process message: " + e.getMessage()));
        }
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<?> getChatHistory(@PathVariable String sessionId) {
        try {
            List<ChatMessage> history = chatService.getChatHistory(sessionId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve chat history: " + e.getMessage()));
        }
    }
}
