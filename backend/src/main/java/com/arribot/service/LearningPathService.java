package com.arribot.service;

import com.arribot.model.DailyMilestone;
import com.arribot.model.GroqResponse;
import com.arribot.model.LearningPath;
import com.arribot.model.WeeklyModule;
import com.arribot.repository.LearningPathRepository;
import com.google.gson.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPathService {

    private static final Logger logger = LoggerFactory.getLogger(LearningPathService.class);

    @Autowired
    private LearningPathRepository learningPathRepository;

    @Autowired
    private GroqService groqService;

    @Autowired
    private AILimitsService aiLimitsService;

    /**
     * Generate a new learning path using Groq AI and persist it.
     */
    public LearningPath generateAndSave(String userId, String goal, int weeks) throws IOException {
        if (weeks < 1 || weeks > 12) throw new IllegalArgumentException("Weeks must be between 1 and 12");
        if (goal == null || goal.trim().isEmpty()) throw new IllegalArgumentException("Goal cannot be empty");

        GroqResponse groqResponse = groqService.generateLearningPath(goal.trim(), weeks);
        aiLimitsService.recordTokenUsage(userId, groqResponse);

        String cleaned = groqResponse.getText().trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
        }

        LearningPath path = parseLearningPathJson(cleaned, userId);
        path.setUserId(userId);
        path.setCreatedAt(LocalDateTime.now());
        path.setUpdatedAt(LocalDateTime.now());

        logger.info("Learning path generated for user: {} goal: '{}' tokens: {}", userId, goal, groqResponse.getTotalTokens());
        return learningPathRepository.save(path);
    }

    /**
     * Get all learning paths for a user, ordered by createdAt desc.
     */
    public List<LearningPath> getUserPaths(String userId) {
        return learningPathRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get a single learning path by ID, scoped to a user.
     */
    public Optional<LearningPath> getPathById(String id, String userId) {
        return learningPathRepository.findById(id)
                .filter(path -> path.getUserId().equals(userId));
    }

    /**
     * Mark a specific day milestone as complete or incomplete.
     */
    public LearningPath updateMilestoneComplete(String pathId, String userId, int weekNum, int dayNum, boolean completed) {
        LearningPath path = learningPathRepository.findById(pathId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Learning path not found"));

        boolean found = false;
        for (WeeklyModule week : path.getWeeks()) {
            if (week.getWeekNumber() == weekNum) {
                for (DailyMilestone day : week.getDays()) {
                    if (day.getDayNumber() == dayNum) {
                        day.setCompleted(completed);
                        day.setCompletedAt(completed ? LocalDateTime.now() : null);
                        found = true;
                        break;
                    }
                }
                break;
            }
        }

        if (!found) {
            throw new RuntimeException("Milestone week " + weekNum + " day " + dayNum + " not found");
        }

        path.setUpdatedAt(LocalDateTime.now());
        return learningPathRepository.save(path);
    }

    /**
     * Delete a learning path by ID scoped to user.
     */
    public void deletePath(String pathId, String userId) {
        LearningPath path = learningPathRepository.findById(pathId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Learning path not found"));
        learningPathRepository.delete(path);
    }

    // ============ Private parsing helpers ============

    private LearningPath parseLearningPathJson(String json, String userId) {
        try {
            JsonObject obj = JsonParser.parseString(json).getAsJsonObject();

            String goal = obj.has("goal") ? obj.get("goal").getAsString() : "Unknown Goal";
            int totalWeeks = obj.has("totalWeeks") ? obj.get("totalWeeks").getAsInt() : 1;
            String difficulty = obj.has("difficultyLevel") ? obj.get("difficultyLevel").getAsString() : "Intermediate";
            String description = obj.has("description") ? obj.get("description").getAsString() : "";

            List<WeeklyModule> weeklyModules = new ArrayList<>();
            if (obj.has("weeks")) {
                JsonArray weeksArr = obj.getAsJsonArray("weeks");
                for (JsonElement weekEl : weeksArr) {
                    JsonObject weekObj = weekEl.getAsJsonObject();
                    int weekNum = weekObj.has("weekNumber") ? weekObj.get("weekNumber").getAsInt() : 0;
                    String weekTitle = weekObj.has("weekTitle") ? weekObj.get("weekTitle").getAsString() : "";
                    String weekGoal = weekObj.has("weekGoal") ? weekObj.get("weekGoal").getAsString() : "";

                    List<DailyMilestone> days = new ArrayList<>();
                    if (weekObj.has("days")) {
                        JsonArray daysArr = weekObj.getAsJsonArray("days");
                        for (JsonElement dayEl : daysArr) {
                            JsonObject dayObj = dayEl.getAsJsonObject();
                            int dayNum = dayObj.has("dayNumber") ? dayObj.get("dayNumber").getAsInt() : 0;
                            String topic = dayObj.has("topic") ? dayObj.get("topic").getAsString() : "";
                            String desc = dayObj.has("description") ? dayObj.get("description").getAsString() : "";

                            List<String> tasks = new ArrayList<>();
                            if (dayObj.has("scheduledTasks")) {
                                JsonArray tasksArr = dayObj.getAsJsonArray("scheduledTasks");
                                for (JsonElement t : tasksArr) {
                                    tasks.add(t.getAsString());
                                }
                            }

                            days.add(new DailyMilestone(dayNum, topic, desc, tasks));
                        }
                    }

                    weeklyModules.add(new WeeklyModule(weekNum, weekTitle, weekGoal, days));
                }
            }

            return new LearningPath(userId, goal, totalWeeks, difficulty, description, weeklyModules);
        } catch (Exception e) {
            logger.error("Failed to parse learning path JSON: {}", e.getMessage());
            throw new RuntimeException("Failed to parse AI response into a learning path: " + e.getMessage());
        }
    }
}
