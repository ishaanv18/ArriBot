package com.arribot.service;

import com.arribot.model.AIFeature;
import com.arribot.model.ChatMessage;
import com.arribot.repository.ChatMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final GeminiService geminiService;
    private final GroqService groqService;
    private final ChatMessageRepository chatMessageRepository;
    private final AILimitsService aiLimitsService;

    public ChatService(GeminiService geminiService, GroqService groqService, 
                      ChatMessageRepository chatMessageRepository, AILimitsService aiLimitsService) {
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.chatMessageRepository = chatMessageRepository;
        this.aiLimitsService = aiLimitsService;
    }

    public ChatMessage sendMessage(String message, String sessionId, String userId) throws IOException {
        // 1. Check AI limits BEFORE calling API
        aiLimitsService.checkAndIncrementUsage(userId, AIFeature.CHAT);
        
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        String aiResponse;
        try {
            // Try Gemini first
            aiResponse = geminiService.chat(message);
            logger.info("Chat response generated using Gemini");
        } catch (IOException e) {
            // Fallback to Groq if Gemini fails
            logger.warn("Gemini failed ({}), using Groq fallback", e.getMessage());
            aiResponse = groqService.chat(message);
            logger.info("Chat response generated using Groq");
        }

        ChatMessage chatMessage = new ChatMessage(sessionId, message, aiResponse);
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}
