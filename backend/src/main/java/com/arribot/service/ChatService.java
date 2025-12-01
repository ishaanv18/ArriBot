package com.arribot.service;

import com.arribot.model.ChatMessage;
import com.arribot.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private final GeminiService geminiService;
    private final ChatMessageRepository chatMessageRepository;

    public ChatService(GeminiService geminiService, ChatMessageRepository chatMessageRepository) {
        this.geminiService = geminiService;
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatMessage sendMessage(String message, String sessionId) throws IOException {
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        String aiResponse = geminiService.chat(message);

        ChatMessage chatMessage = new ChatMessage(sessionId, message, aiResponse);
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}
