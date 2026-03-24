package com.arribot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_usage")
@CompoundIndex(name = "user_date_idx", def = "{'userId': 1, 'date': 1}", unique = true)
public class AIUsage {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String date; // YYYY-MM-DD format

    // ── Per-feature request counts ─────────────────────────────────────────────
    private Integer chatMessages = 0;
    private Integer flashcardsGenerated = 0;
    private Integer quizzesGenerated = 0;
    private Integer summariesGenerated = 0;
    private Integer learningPathsGenerated = 0;
    private Integer totalRequests = 0;

    // ── Groq token usage ──────────────────────────────────────────────────────
    private Long promptTokensUsed = 0L;
    private Long completionTokensUsed = 0L;
    private Long totalTokensUsed = 0L;

    private LocalDateTime lastRequestTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AIUsage() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public AIUsage(String userId, String date) {
        this.userId = userId;
        this.date = date;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ── Getters and Setters ────────────────────────────────────────────────────
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getChatMessages() { return chatMessages; }
    public void setChatMessages(Integer chatMessages) { this.chatMessages = chatMessages; }

    public Integer getFlashcardsGenerated() { return flashcardsGenerated; }
    public void setFlashcardsGenerated(Integer flashcardsGenerated) { this.flashcardsGenerated = flashcardsGenerated; }

    public Integer getQuizzesGenerated() { return quizzesGenerated; }
    public void setQuizzesGenerated(Integer quizzesGenerated) { this.quizzesGenerated = quizzesGenerated; }

    public Integer getSummariesGenerated() { return summariesGenerated; }
    public void setSummariesGenerated(Integer summariesGenerated) { this.summariesGenerated = summariesGenerated; }

    public Integer getLearningPathsGenerated() { return learningPathsGenerated; }
    public void setLearningPathsGenerated(Integer learningPathsGenerated) { this.learningPathsGenerated = learningPathsGenerated; }

    public Integer getTotalRequests() { return totalRequests; }
    public void setTotalRequests(Integer totalRequests) { this.totalRequests = totalRequests; }

    public Long getPromptTokensUsed() { return promptTokensUsed; }
    public void setPromptTokensUsed(Long promptTokensUsed) { this.promptTokensUsed = promptTokensUsed; }

    public Long getCompletionTokensUsed() { return completionTokensUsed; }
    public void setCompletionTokensUsed(Long completionTokensUsed) { this.completionTokensUsed = completionTokensUsed; }

    public Long getTotalTokensUsed() { return totalTokensUsed; }
    public void setTotalTokensUsed(Long totalTokensUsed) { this.totalTokensUsed = totalTokensUsed; }

    public LocalDateTime getLastRequestTime() { return lastRequestTime; }
    public void setLastRequestTime(LocalDateTime lastRequestTime) { this.lastRequestTime = lastRequestTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
