package com.arribot.service;

import com.arribot.exception.AILimitExceededException;
import com.arribot.exception.RateLimitExceededException;
import com.arribot.model.AIFeature;
import com.arribot.model.AIUsage;
import com.arribot.repository.AIUsageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class AILimitsService {

    private static final Logger logger = LoggerFactory.getLogger(AILimitsService.class);

    @Value("${ai.limits.chat.daily}")
    private int chatDailyLimit;

    @Value("${ai.limits.flashcards.daily}")
    private int flashcardsDailyLimit;

    @Value("${ai.limits.quiz.daily}")
    private int quizDailyLimit;

    @Value("${ai.limits.summary.daily}")
    private int summaryDailyLimit;

    @Value("${ai.ratelimit.requests.per.minute}")
    private int rateLimitPerMinute;

    @Value("${ai.enabled}")
    private boolean aiEnabled;

    private final AIUsageRepository usageRepository;

    public AILimitsService(AIUsageRepository usageRepository) {
        this.usageRepository = usageRepository;
    }

    /**
     * Check if user can make AI request for specific feature
     * Throws exception if limit exceeded
     */
    public void checkAndIncrementUsage(String userId, AIFeature feature) {
        // Check if AI is globally enabled
        if (!aiEnabled) {
            throw new RuntimeException("AI features are temporarily disabled");
        }

        String today = LocalDate.now().toString();
        AIUsage usage = usageRepository.findByUserIdAndDate(userId, today)
                .orElse(new AIUsage(userId, today));

        // 1. Check rate limiting (5 req/min)
        if (isRateLimited(usage)) {
            logger.warn("Rate limit exceeded for user: {}", userId);
            throw new RateLimitExceededException(
                "Too many requests. Please wait a moment before trying again.");
        }

        // 2. Check daily feature limit
        if (isFeatureLimitExceeded(usage, feature)) {
            logger.warn("Daily limit exceeded for user: {} feature: {}", userId, feature);
            throw new AILimitExceededException(
                String.format("Daily limit reached for %s. Limit: %d requests per day. Try again tomorrow!",
                    feature.name().toLowerCase(), getFeatureLimit(feature)));
        }

        // 3. Increment counters
        incrementFeatureUsage(usage, feature);
        usage.setLastRequestTime(LocalDateTime.now());
        usage.setUpdatedAt(LocalDateTime.now());
        usage.setTotalRequests(usage.getTotalRequests() + 1);

        usageRepository.save(usage);
        logger.info("AI usage recorded - User: {} Feature: {} Total today: {}",
            userId, feature, usage.getTotalRequests());
    }

    private boolean isRateLimited(AIUsage usage) {
        if (usage.getLastRequestTime() == null) {
            return false;
        }

        long secondsSinceLastRequest = ChronoUnit.SECONDS.between(
            usage.getLastRequestTime(), LocalDateTime.now());

        // Simple rate limit: max X requests per minute
        // If less than 60/X seconds have passed, rate limit
        int minSecondsBetweenRequests = 60 / rateLimitPerMinute;
        return secondsSinceLastRequest < minSecondsBetweenRequests;
    }

    private boolean isFeatureLimitExceeded(AIUsage usage, AIFeature feature) {
        return switch (feature) {
            case CHAT -> usage.getChatMessages() >= chatDailyLimit;
            case FLASHCARDS -> usage.getFlashcardsGenerated() >= flashcardsDailyLimit;
            case QUIZ -> usage.getQuizzesGenerated() >= quizDailyLimit;
            case SUMMARY -> usage.getSummariesGenerated() >= summaryDailyLimit;
        };
    }

    private int getFeatureLimit(AIFeature feature) {
        return switch (feature) {
            case CHAT -> chatDailyLimit;
            case FLASHCARDS -> flashcardsDailyLimit;
            case QUIZ -> quizDailyLimit;
            case SUMMARY -> summaryDailyLimit;
        };
    }

    private void incrementFeatureUsage(AIUsage usage, AIFeature feature) {
        switch (feature) {
            case CHAT -> usage.setChatMessages(usage.getChatMessages() + 1);
            case FLASHCARDS -> usage.setFlashcardsGenerated(usage.getFlashcardsGenerated() + 1);
            case QUIZ -> usage.setQuizzesGenerated(usage.getQuizzesGenerated() + 1);
            case SUMMARY -> usage.setSummariesGenerated(usage.getSummariesGenerated() + 1);
        }
    }

    /**
     * Get remaining usage for user (for dashboard display)
     */
    public AIUsageStats getUserStats(String userId) {
        String today = LocalDate.now().toString();
        AIUsage usage = usageRepository.findByUserIdAndDate(userId, today)
                .orElse(new AIUsage(userId, today));

        return new AIUsageStats(
            chatDailyLimit - usage.getChatMessages(),
            flashcardsDailyLimit - usage.getFlashcardsGenerated(),
            quizDailyLimit - usage.getQuizzesGenerated(),
            summaryDailyLimit - usage.getSummariesGenerated(),
            usage.getTotalRequests()
        );
    }

    /**
     * Inner class for usage stats response
     */
    public static class AIUsageStats {
        private int chatRemaining;
        private int flashcardsRemaining;
        private int quizRemaining;
        private int summaryRemaining;
        private int totalRequestsToday;

        public AIUsageStats(int chatRemaining, int flashcardsRemaining,
                           int quizRemaining, int summaryRemaining, int totalRequestsToday) {
            this.chatRemaining = chatRemaining;
            this.flashcardsRemaining = flashcardsRemaining;
            this.quizRemaining = quizRemaining;
            this.summaryRemaining = summaryRemaining;
            this.totalRequestsToday = totalRequestsToday;
        }

        // Getters
        public int getChatRemaining() { return chatRemaining; }
        public int getFlashcardsRemaining() { return flashcardsRemaining; }
        public int getQuizRemaining() { return quizRemaining; }
        public int getSummaryRemaining() { return summaryRemaining; }
        public int getTotalRequestsToday() { return totalRequestsToday; }
    }
}
