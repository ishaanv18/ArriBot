package com.arribot.service;

import com.arribot.model.Flashcard;
import com.arribot.repository.FlashcardRepository;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlashcardService {

    private static final Logger logger = LoggerFactory.getLogger(FlashcardService.class);
    private final GeminiService geminiService;
    private final GroqService groqService;
    private final FlashcardRepository flashcardRepository;
    private final Gson gson;

    public FlashcardService(GeminiService geminiService, GroqService groqService, FlashcardRepository flashcardRepository) {
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.flashcardRepository = flashcardRepository;
        this.gson = new Gson();
    }

    public List<Flashcard> generateFlashcards(String topic, int count) throws IOException {
        String response;
        try {
            // Use Groq as primary
            response = groqService.generateFlashcards(topic, count);
            logger.info("Flashcards generated using Groq");
        } catch (IOException e) {
            // Fallback to Gemini
            logger.warn("Groq failed ({}), using Gemini fallback", e.getMessage());
            response = geminiService.generateFlashcards(topic, count);
            logger.info("Flashcards generated using Gemini");
        }
        
        List<Flashcard> flashcards = new ArrayList<>();

        try {
            // Extract JSON from response (might be wrapped in markdown code blocks)
            String jsonString = extractJson(response);
            JsonArray jsonArray = gson.fromJson(jsonString, JsonArray.class);

            for (int i = 0; i < jsonArray.size(); i++) {
                JsonObject obj = jsonArray.get(i).getAsJsonObject();
                String question = obj.get("question").getAsString();
                String answer = obj.get("answer").getAsString();

                Flashcard flashcard = new Flashcard(topic, question, answer);
                flashcards.add(flashcardRepository.save(flashcard));
            }
        } catch (Exception e) {
            logger.error("Error parsing flashcards from AI response", e);
            throw new IOException("Failed to parse flashcards: " + e.getMessage());
        }

        return flashcards;
    }

    public List<Flashcard> getFlashcardsByTopic(String topic) {
        return flashcardRepository.findByTopicOrderByCreatedAtDesc(topic);
    }

    public List<Flashcard> getAllFlashcards() {
        return flashcardRepository.findAll();
    }

    private String extractJson(String response) {
        // Remove markdown code blocks if present
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
