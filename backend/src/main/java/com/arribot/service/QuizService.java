package com.arribot.service;

import com.arribot.model.AIFeature;
 import com.arribot.model.Quiz;
import com.arribot.repository.QuizRepository;
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
public class QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);
    private final GeminiService geminiService;
    private final GroqService groqService;
    private final QuizRepository quizRepository;
    private final Gson gson;
    private final AILimitsService aiLimitsService;

    public QuizService(GeminiService geminiService, GroqService groqService, 
                      QuizRepository quizRepository, AILimitsService aiLimitsService) {
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.quizRepository = quizRepository;
        this.gson = new Gson();
        this.aiLimitsService = aiLimitsService;
    }

    public Quiz generateQuiz(String topic, int questionCount, String userId) throws IOException {
        // Check AI limits before generation
        aiLimitsService.checkAndIncrementUsage(userId, AIFeature.QUIZ);
        
        String response;
        try {
            // Use Groq as primary
            response = groqService.generateQuiz(topic, questionCount);
            logger.info("Quiz generated using Groq");
        } catch (IOException e) {
            // Fallback to Gemini
            logger.warn("Groq failed ({}), using Gemini fallback", e.getMessage());
            response = geminiService.generateQuiz(topic, questionCount);
            logger.info("Quiz generated using Gemini");
        }
        
        List<Quiz.QuizQuestion> questions = new ArrayList<>();

        try {
            String jsonString = extractJson(response);
            JsonArray jsonArray = gson.fromJson(jsonString, JsonArray.class);

            for (int i = 0; i < jsonArray.size(); i++) {
                JsonObject obj = jsonArray.get(i).getAsJsonObject();

                String question = obj.get("question").getAsString();
                JsonArray optionsArray = obj.getAsJsonArray("options");
                List<String> options = new ArrayList<>();
                for (int j = 0; j < optionsArray.size(); j++) {
                    options.add(optionsArray.get(j).getAsString());
                }
                int correctAnswerIndex = obj.get("correctAnswerIndex").getAsInt();
                String explanation = obj.get("explanation").getAsString();

                questions.add(new Quiz.QuizQuestion(question, options, correctAnswerIndex, explanation));
            }
        } catch (Exception e) {
            logger.error("Error parsing quiz from AI response", e);
            throw new IOException("Failed to parse quiz: " + e.getMessage());
        }

        Quiz quiz = new Quiz(topic, questions);
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesByTopic(String topic) {
        return quizRepository.findByTopicOrderByCreatedAtDesc(topic);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz getQuizById(String id) {
        return quizRepository.findById(id).orElse(null);
    }

    private String extractJson(String response) {
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
