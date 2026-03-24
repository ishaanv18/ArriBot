package com.arribot.service;

import com.arribot.model.GroqResponse;
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
                .readTimeout(120, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    // ─── Public API methods ────────────────────────────────────────────────────

    public GroqResponse chat(String message) throws IOException {
        String prompt = "You are a helpful AI assistant. Provide clear, concise, and accurate answers. User message: " + message;
        return callApi(prompt, 2000);
    }

    public GroqResponse generateFlashcards(String topic, int count) throws IOException {
        String prompt = String.format(
                "Generate EXACTLY %d flashcards about '%s'. " +
                "CRITICAL: Return ONLY a valid JSON array, no additional text before or after. " +
                "Each object must have 'question' and 'answer' fields. " +
                "Make questions clear and answers concise. " +
                "Output format: [{\"question\": \"What is...\", \"answer\": \"It is...\"}]. " +
                "Generate EXACTLY %d items, no more, no less.",
                count, topic, count);
        return callApi(prompt, 2000);
    }

    public GroqResponse generateQuiz(String topic, int questionCount) throws IOException {
        String prompt = String.format(
                "Generate a quiz with exactly %d multiple-choice questions about '%s'. " +
                "Format your response as a JSON array with objects containing: " +
                "'question' (string), 'options' (array of 4 strings), 'correctAnswerIndex' (0-3), and 'explanation' (string). " +
                "Example format: [{\"question\": \"What is...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswerIndex\": 0, \"explanation\": \"Because...\"}]",
                questionCount, topic);
        return callApi(prompt, 2000);
    }

    public GroqResponse summarize(String text) throws IOException {
        String prompt = String.format(
                "Summarize the following text concisely, capturing the main points and key information. " +
                "Keep the summary clear and well-structured:\n\n%s",
                text);
        return callApi(prompt, 2000);
    }

    public GroqResponse generateLearningPath(String goal, int weeks) throws IOException {
        String prompt = String.format(
                """
                You are an expert curriculum designer. Create a detailed %d-week learning path for the goal: "%s".

                Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
                {
                  "goal": "%s",
                  "totalWeeks": %d,
                  "difficultyLevel": "Beginner|Intermediate|Advanced",
                  "description": "Brief overview of the curriculum in 1-2 sentences",
                  "weeks": [
                    {
                      "weekNumber": 1,
                      "weekTitle": "Title of this week's focus",
                      "weekGoal": "What the learner will achieve this week",
                      "days": [
                        {
                          "dayNumber": 1,
                          "topic": "Specific topic to study today",
                          "description": "Short description of what to do today (1-2 sentences)",
                          "scheduledTasks": ["FLASHCARD", "SUMMARY"]
                        }
                      ]
                    }
                  ]
                }

                Rules:
                - Include exactly 5 days per week (weekdays only).
                - scheduledTasks must be a non-empty array containing one or more of: "FLASHCARD", "QUIZ", "SUMMARY".
                - Day 1-3 of each week: use FLASHCARD and/or SUMMARY for learning.
                - Day 4: use QUIZ for assessment.
                - Day 5: use all three for review.
                - Make topics progressively more advanced each week.
                - Return ONLY the JSON, no markdown fences.
                """,
                weeks, goal, goal, weeks);
        return callApi(prompt, 8000);
    }

    // ─── Private HTTP helper ───────────────────────────────────────────────────

    private GroqResponse callApi(String prompt, int maxTokens) throws IOException {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", model);

        JsonArray messages = new JsonArray();
        JsonObject message = new JsonObject();
        message.addProperty("role", "user");
        message.addProperty("content", prompt);
        messages.add(message);

        requestBody.add("messages", messages);
        requestBody.addProperty("temperature", 0.3);
        requestBody.addProperty("max_tokens", maxTokens);

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
            String responseBodyStr = response.body() != null ? response.body().string() : "null";

            if (!response.isSuccessful()) {
                logger.error("Groq API Error Code: {}", response.code());
                logger.error("Groq API Error Body: {}", responseBodyStr);
                throw new IOException("Groq API error: " + response.code() + " - " + responseBodyStr);
            }

            JsonObject json = gson.fromJson(responseBodyStr, JsonObject.class);

            String text = json
                    .getAsJsonArray("choices")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content").getAsString();

            // Extract token usage from response
            long promptTokens = 0L;
            long completionTokens = 0L;
            long totalTokens = 0L;

            if (json.has("usage")) {
                JsonObject usage = json.getAsJsonObject("usage");
                promptTokens     = usage.has("prompt_tokens")     ? usage.get("prompt_tokens").getAsLong()     : 0L;
                completionTokens = usage.has("completion_tokens") ? usage.get("completion_tokens").getAsLong() : 0L;
                totalTokens      = usage.has("total_tokens")      ? usage.get("total_tokens").getAsLong()      : 0L;
            }

            logger.info("Groq token usage — prompt: {} completion: {} total: {}", promptTokens, completionTokens, totalTokens);
            return new GroqResponse(text, promptTokens, completionTokens, totalTokens);
        }
    }
}
