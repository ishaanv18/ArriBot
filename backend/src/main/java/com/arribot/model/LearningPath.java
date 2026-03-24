package com.arribot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "learning_paths")
public class LearningPath {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String goal;
    private int totalWeeks;
    private String difficultyLevel;
    private String description;
    private List<WeeklyModule> weeks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LearningPath() {}

    public LearningPath(String userId, String goal, int totalWeeks, String difficultyLevel,
                        String description, List<WeeklyModule> weeks) {
        this.userId = userId;
        this.goal = goal;
        this.totalWeeks = totalWeeks;
        this.difficultyLevel = difficultyLevel;
        this.description = description;
        this.weeks = weeks;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public int getTotalWeeks() { return totalWeeks; }
    public void setTotalWeeks(int totalWeeks) { this.totalWeeks = totalWeeks; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<WeeklyModule> getWeeks() { return weeks; }
    public void setWeeks(List<WeeklyModule> weeks) { this.weeks = weeks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
