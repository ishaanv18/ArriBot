package com.arribot.model;

import java.time.LocalDateTime;
import java.util.List;

public class DailyMilestone {

    private int dayNumber;
    private String topic;
    private String description;

    /**
     * Types of tasks scheduled for this day.
     * Values: "FLASHCARD", "QUIZ", "SUMMARY"
     */
    private List<String> scheduledTasks;

    private boolean completed;
    private LocalDateTime completedAt;

    public DailyMilestone() {}

    public DailyMilestone(int dayNumber, String topic, String description, List<String> scheduledTasks) {
        this.dayNumber = dayNumber;
        this.topic = topic;
        this.description = description;
        this.scheduledTasks = scheduledTasks;
        this.completed = false;
    }

    // Getters and Setters
    public int getDayNumber() { return dayNumber; }
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getScheduledTasks() { return scheduledTasks; }
    public void setScheduledTasks(List<String> scheduledTasks) { this.scheduledTasks = scheduledTasks; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
