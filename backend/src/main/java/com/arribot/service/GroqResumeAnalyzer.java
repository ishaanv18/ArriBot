package com.arribot.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class GroqResumeAnalyzer {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final OkHttpClient client;
    private final Gson gson;

    public GroqResumeAnalyzer() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    /**
     * Analyze resume and extract skills, experience, and recommendations
     */
    public SkillAnalysisResult analyzeResume(String resumeText, String targetRole) throws IOException {
        String prompt = buildAnalysisPrompt(resumeText, targetRole);
        String response = callGroqAPI(prompt);
        return parseAnalysisResponse(response);
    }

    /**
     * Build the analysis prompt
     */
    private String buildAnalysisPrompt(String resumeText, String targetRole) {
        return String.format("""
            You are an expert career advisor and resume analyzer. Analyze the following resume and provide a detailed skill assessment with quality metrics.
            
            TARGET ROLE: %s
            
            RESUME TEXT:
            %s
            
            Please analyze this resume and provide a JSON response with the following structure:
            {
              "detectedSkills": ["skill1", "skill2", ...],
              "experienceYears": <number>,
              "missingSkills": ["skill1", "skill2", ...],
              "recommendedSkills": ["skill1", "skill2", ...],
              "overallScore": <0-100>,
              "skillMatchScore": <0-100>,
              "experienceScore": <0-100>,
              "resumeQualityScore": <0-100>,
              "learningPath": [
                {
                  "skill": "skill name",
                  "priority": "high/medium/low",
                  "reason": "why this skill is important",
                  "suggestedResources": ["resource1", "resource2"],
                  "estimatedTime": "time estimate"
                }
              ]
            }
            
            Guidelines:
            1. Extract ALL technical and soft skills mentioned in the resume
            2. Estimate years of experience based on work history
            3. Identify skills commonly required for the target role that are missing
            4. Recommend skills that would make the candidate more competitive
            5. Create a prioritized learning path with specific, actionable recommendations
            6. For each learning recommendation, explain WHY it's important for the target role
            7. Calculate quality scores (0-100):
               - overallScore: Overall resume quality and fit for the target role
               - skillMatchScore: How well skills match the target role requirements
               - experienceScore: Quality and relevance of work experience
               - resumeQualityScore: Resume formatting, clarity, and presentation quality
            
            Return ONLY valid JSON, no additional text.
            """, targetRole != null ? targetRole : "General Software Developer", resumeText);
    }

    /**
     * Call Groq API
     */
    private String callGroqAPI(String prompt) throws IOException {
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
                throw new IOException("Groq API error: " + response.code() + " - " + response.message());
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
     * Parse the AI response into structured data
     */
    private SkillAnalysisResult parseAnalysisResponse(String response) {
        try {
            // Clean the response (remove markdown code blocks if present)
            String cleanedResponse = response.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();

            JsonObject json = gson.fromJson(cleanedResponse, JsonObject.class);
            
            SkillAnalysisResult result = new SkillAnalysisResult();
            
            // Extract detected skills
            if (json.has("detectedSkills")) {
                JsonArray detectedSkills = json.getAsJsonArray("detectedSkills");
                List<String> skills = new ArrayList<>();
                detectedSkills.forEach(skill -> skills.add(skill.getAsString()));
                result.setDetectedSkills(skills);
            }
            
            // Extract experience years
            if (json.has("experienceYears")) {
                result.setExperienceYears(json.get("experienceYears").getAsInt());
            }
            
            // Extract missing skills
            if (json.has("missingSkills")) {
                JsonArray missingSkills = json.getAsJsonArray("missingSkills");
                List<String> skills = new ArrayList<>();
                missingSkills.forEach(skill -> skills.add(skill.getAsString()));
                result.setMissingSkills(skills);
            }
            
            // Extract recommended skills
            if (json.has("recommendedSkills")) {
                JsonArray recommendedSkills = json.getAsJsonArray("recommendedSkills");
                List<String> skills = new ArrayList<>();
                recommendedSkills.forEach(skill -> skills.add(skill.getAsString()));
                result.setRecommendedSkills(skills);
            }
            
            // Store learning path as JSON string
            if (json.has("learningPath")) {
                result.setLearningPath(json.get("learningPath").toString());
            }
            
            // Extract quality scores
            if (json.has("overallScore")) {
                result.setOverallScore(json.get("overallScore").getAsInt());
            }
            if (json.has("skillMatchScore")) {
                result.setSkillMatchScore(json.get("skillMatchScore").getAsInt());
            }
            if (json.has("experienceScore")) {
                result.setExperienceScore(json.get("experienceScore").getAsInt());
            }
            if (json.has("resumeQualityScore")) {
                result.setResumeQualityScore(json.get("resumeQualityScore").getAsInt());
            }
            
            return result;
            
        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
            System.err.println("Response was: " + response);
            
            // Return empty result on parse failure
            return new SkillAnalysisResult();
        }
    }

    /**
     * Result class for skill analysis
     */
    public static class SkillAnalysisResult {
        private List<String> detectedSkills = new ArrayList<>();
        private Integer experienceYears = 0;
        private List<String> missingSkills = new ArrayList<>();
        private List<String> recommendedSkills = new ArrayList<>();
        private String learningPath = "[]";
        private Integer overallScore = 0;
        private Integer skillMatchScore = 0;
        private Integer experienceScore = 0;
        private Integer resumeQualityScore = 0;

        // Getters and Setters
        public List<String> getDetectedSkills() {
            return detectedSkills;
        }

        public void setDetectedSkills(List<String> detectedSkills) {
            this.detectedSkills = detectedSkills;
        }

        public Integer getExperienceYears() {
            return experienceYears;
        }

        public void setExperienceYears(Integer experienceYears) {
            this.experienceYears = experienceYears;
        }

        public List<String> getMissingSkills() {
            return missingSkills;
        }

        public void setMissingSkills(List<String> missingSkills) {
            this.missingSkills = missingSkills;
        }

        public List<String> getRecommendedSkills() {
            return recommendedSkills;
        }

        public void setRecommendedSkills(List<String> recommendedSkills) {
            this.recommendedSkills = recommendedSkills;
        }

        public String getLearningPath() {
            return learningPath;
        }

        public void setLearningPath(String learningPath) {
            this.learningPath = learningPath;
        }

        public Integer getOverallScore() {
            return overallScore;
        }

        public void setOverallScore(Integer overallScore) {
            this.overallScore = overallScore;
        }

        public Integer getSkillMatchScore() {
            return skillMatchScore;
        }

        public void setSkillMatchScore(Integer skillMatchScore) {
            this.skillMatchScore = skillMatchScore;
        }

        public Integer getExperienceScore() {
            return experienceScore;
        }

        public void setExperienceScore(Integer experienceScore) {
            this.experienceScore = experienceScore;
        }

        public Integer getResumeQualityScore() {
            return resumeQualityScore;
        }

        public void setResumeQualityScore(Integer resumeQualityScore) {
            this.resumeQualityScore = resumeQualityScore;
        }
    }
}
