package com.arribot.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class GroqService {

    private static final Logger logger = LoggerFactory.getLogger(GroqService.class);

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final OkHttpClient client;
    private final Gson gson;

    public GroqService() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    /**
     * Generate content using Groq API
     */
    private String generateContent(String prompt) throws IOException {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", model);
        
        JsonArray messages = new JsonArray();
        JsonObject message = new JsonObject();
        message.addProperty("role", "user");
        message.addProperty("content", prompt);
        messages.add(message);
        
        requestBody.add("messages", messages);
        requestBody.addProperty("temperature", 0.3);
        requestBody.addProperty("max_tokens", 2000);

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "null";
                logger.error("Groq API Error Code: {}", response.code());
                logger.error("Groq API Error Body: {}", errorBody);
                throw new IOException("Groq API error: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            
            return jsonResponse
                    .getAsJsonArray("choices")
                    .get(0)
                    .getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content")
                    .getAsString();
        }
    }

    /**
     * Chat completion
     */
    public String chat(String message) throws IOException {
        String prompt = "You are a helpful AI assistant. Provide clear, concise, and accurate answers. User message: " + message;
        return generateContent(prompt);
    }

    /**
     * Generate flashcards
     */
    public String generateFlashcards(String topic, int count) throws IOException {
        String prompt = String.format(
                "Generate EXACTLY %d flashcards about '%s'. " +
                "CRITICAL: Return ONLY a valid JSON array, no additional text before or after. " +
                "Each object must have 'question' and 'answer' fields. " +
                "Make questions clear and answers concise. " +
                "Output format: [{\"question\": \"What is...\", \"answer\": \"It is...\"}]. " +
                "Generate EXACTLY %d items, no more, no less.",
                count, topic, count);
        return generateContent(prompt);
    }

    /**
     * Generate quiz
     */
    public String generateQuiz(String topic, int questionCount) throws IOException {
        String prompt = String.format(
                "Generate a quiz with exactly %d multiple-choice questions about '%s'. " +
                "Format your response as a JSON array with objects containing: " +
                "'question' (string), 'options' (array of 4 strings), 'correctAnswerIndex' (0-3), and 'explanation' (string). " +
                "Example format: [{\"question\": \"What is...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswerIndex\": 0, \"explanation\": \"Because...\"}]",
                questionCount, topic);
        return generateContent(prompt);
    }

    /**
     * Summarize text
     */
    public String summarize(String text) throws IOException {
        String prompt = String.format(
                "Summarize the following text concisely, capturing the main points and key information. " +
                "Keep the summary clear and well-structured:\n\n%s",
                text);
        return generateContent(prompt);
    }
}
