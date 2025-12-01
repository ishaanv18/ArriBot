package com.arribot.service;

import com.arribot.config.GeminiConfig;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private final GeminiConfig geminiConfig;
    private final OkHttpClient httpClient;
    private final Gson gson;

    public GeminiService(GeminiConfig geminiConfig, OkHttpClient httpClient) {
        this.geminiConfig = geminiConfig;
        this.httpClient = httpClient;
        this.gson = new Gson();
    }

    public String generateContent(String prompt) throws IOException {
        String url = geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey();

        JsonObject requestBody = new JsonObject();
        JsonArray contents = new JsonArray();
        JsonObject content = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();

        part.addProperty("text", prompt);
        parts.add(part);
        content.add("parts", parts);
        contents.add(content);
        requestBody.add("contents", contents);

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "null";
                logger.error("Gemini API Request URL: {}", url);
                logger.error("Gemini API Error Code: {}", response.code());
                logger.error("Gemini API Error Body: {}", errorBody);
                throw new IOException("Unexpected response from Gemini API: " + response + " Body: " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            return extractTextFromResponse(jsonResponse);
        }
    }

    private String extractTextFromResponse(JsonObject response) {
        try {
            return response
                    .getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString();
        } catch (Exception e) {
            logger.error("Error extracting text from Gemini response", e);
            return "Error processing response";
        }
    }

    public String chat(String message) throws IOException {
        String prompt = "You are a helpful AI assistant. Provide clear, concise, and accurate answers. User message: "
                + message;
        return generateContent(prompt);
    }

    public String generateFlashcards(String topic, int count) throws IOException {
        String prompt = String.format(
                "Generate exactly %d flashcards about '%s'. " +
                        "Format your response as a JSON array with objects containing 'question' and 'answer' fields. "
                        +
                        "Make the questions clear and the answers concise but informative. " +
                        "Example format: [{\"question\": \"What is...\", \"answer\": \"It is...\"}]",
                count, topic);
        return generateContent(prompt);
    }

    public String generateQuiz(String topic, int questionCount) throws IOException {
        String prompt = String.format(
                "Generate a quiz with exactly %d multiple-choice questions about '%s'. " +
                        "Format your response as a JSON array with objects containing: " +
                        "'question' (string), 'options' (array of 4 strings), 'correctAnswerIndex' (0-3), and 'explanation' (string). "
                        +
                        "Example format: [{\"question\": \"What is...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswerIndex\": 0, \"explanation\": \"Because...\"}]",
                questionCount, topic);
        return generateContent(prompt);
    }

    public String summarize(String text) throws IOException {
        String prompt = String.format(
                "Summarize the following text concisely, capturing the main points and key information. " +
                        "Keep the summary clear and well-structured:\n\n%s",
                text);
        return generateContent(prompt);
    }
}
