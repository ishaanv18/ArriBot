package com.arribot.service;

import com.arribot.exception.AILimitExceededException;
import com.arribot.exception.RateLimitExceededException;
import com.arribot.model.AIFeature;
import com.arribot.model.AIUsage;
import com.arribot.model.GroqResponse;
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

    // ─── Pre-call check (rate + daily limit) ──────────────────────────────────

    /**
     * Check if user can make AI request for specific feature.
     * Throws exception if rate-limited or daily limit exceeded.
     */
    public void checkAndIncrementUsage(String userId, AIFeature feature) {
        if (!aiEnabled) {
            throw new RuntimeException("AI features are temporarily disabled");
        }

        String today = LocalDate.now().toString();
        AIUsage usage = usageRepository.findByUserIdAndDate(userId, today)
                .orElse(new AIUsage(userId, today));

        // 1. Rate limit check
        if (isRateLimited(usage)) {
            logger.warn("Rate limit exceeded for user: {}", userId);
            throw new RateLimitExceededException("Too many requests. Please wait a moment before trying again.");
        }

        // 2. Daily feature limit check
        if (isFeatureLimitExceeded(usage, feature)) {
            logger.warn("Daily limit exceeded for user: {} feature: {}", userId, feature);
            throw new AILimitExceededException(
                String.format("Daily limit reached for %s. Limit: %d requests per day. Try again tomorrow!",
                    feature.name().toLowerCase(), getFeatureLimit(feature)));
        }

        // 3. Increment request counter
        incrementFeatureUsage(usage, feature);
        usage.setLastRequestTime(LocalDateTime.now());
        usage.setUpdatedAt(LocalDateTime.now());
        usage.setTotalRequests(usage.getTotalRequests() + 1);

        usageRepository.save(usage);
        logger.info("AI usage recorded — user: {} feature: {} total today: {}", userId, feature, usage.getTotalRequests());
    }

    // ─── Post-call token recording ─────────────────────────────────────────────

    /**
     * Record token usage after a successful Groq API call.
     * Call this AFTER checkAndIncrementUsage() succeeds.
     */
    public void recordTokenUsage(String userId, GroqResponse groqResponse) {
        if (groqResponse == null || groqResponse.getTotalTokens() == 0) return;

        String today = LocalDate.now().toString();
        AIUsage usage = usageRepository.findByUserIdAndDate(userId, today)
                .orElse(new AIUsage(userId, today));

        usage.setPromptTokensUsed(safeAdd(usage.getPromptTokensUsed(), groqResponse.getPromptTokens()));
        usage.setCompletionTokensUsed(safeAdd(usage.getCompletionTokensUsed(), groqResponse.getCompletionTokens()));
        usage.setTotalTokensUsed(safeAdd(usage.getTotalTokensUsed(), groqResponse.getTotalTokens()));
        usage.setUpdatedAt(LocalDateTime.now());

        usageRepository.save(usage);
        logger.info("Token usage recorded — user: {} +{} tokens (total today: {})",
                userId, groqResponse.getTotalTokens(), usage.getTotalTokensUsed());
    }

    // ─── Stats for Dashboard ───────────────────────────────────────────────────

    public AIUsageStats getUserStats(String userId) {
        String today = LocalDate.now().toString();
        AIUsage usage = usageRepository.findByUserIdAndDate(userId, today)
                .orElse(new AIUsage(userId, today));

        return new AIUsageStats(
            // Remaining counts
            chatDailyLimit           - usage.getChatMessages(),
            flashcardsDailyLimit     - usage.getFlashcardsGenerated(),
            quizDailyLimit           - usage.getQuizzesGenerated(),
            summaryDailyLimit        - usage.getSummariesGenerated(),
            // Absolute counts today
            usage.getChatMessages(),
            usage.getFlashcardsGenerated(),
            usage.getQuizzesGenerated(),
            usage.getSummariesGenerated(),
            usage.getLearningPathsGenerated(),
            usage.getTotalRequests(),
            // Limits
            chatDailyLimit,
            flashcardsDailyLimit,
            quizDailyLimit,
            summaryDailyLimit,
            // Groq token usage
            usage.getPromptTokensUsed(),
            usage.getCompletionTokensUsed(),
            usage.getTotalTokensUsed()
        );
    }

    // ─── Private helpers ───────────────────────────────────────────────────────

    private boolean isRateLimited(AIUsage usage) {
        if (usage.getLastRequestTime() == null) return false;
        long secondsSinceLastRequest = ChronoUnit.SECONDS.between(usage.getLastRequestTime(), LocalDateTime.now());
        int minSecondsBetweenRequests = 60 / rateLimitPerMinute;
        return secondsSinceLastRequest < minSecondsBetweenRequests;
    }

    private boolean isFeatureLimitExceeded(AIUsage usage, AIFeature feature) {
        return switch (feature) {
            case CHAT      -> usage.getChatMessages()        >= chatDailyLimit;
            case FLASHCARDS -> usage.getFlashcardsGenerated() >= flashcardsDailyLimit;
            case QUIZ      -> usage.getQuizzesGenerated()     >= quizDailyLimit;
            case SUMMARY   -> usage.getSummariesGenerated()   >= summaryDailyLimit;
        };
    }

    private int getFeatureLimit(AIFeature feature) {
        return switch (feature) {
            case CHAT      -> chatDailyLimit;
            case FLASHCARDS -> flashcardsDailyLimit;
            case QUIZ      -> quizDailyLimit;
            case SUMMARY   -> summaryDailyLimit;
        };
    }

    private void incrementFeatureUsage(AIUsage usage, AIFeature feature) {
        switch (feature) {
            case CHAT      -> usage.setChatMessages(usage.getChatMessages() + 1);
            case FLASHCARDS -> usage.setFlashcardsGenerated(usage.getFlashcardsGenerated() + 1);
            case QUIZ      -> usage.setQuizzesGenerated(usage.getQuizzesGenerated() + 1);
            case SUMMARY   -> usage.setSummariesGenerated(usage.getSummariesGenerated() + 1);
        }
    }

    private long safeAdd(Long a, long b) {
        return (a == null ? 0L : a) + b;
    }

    // ─── Stats DTO ─────────────────────────────────────────────────────────────

    public static class AIUsageStats {
        // Remaining allowance
        private final int chatRemaining;
        private final int flashcardsRemaining;
        private final int quizRemaining;
        private final int summaryRemaining;
        // Used today
        private final int chatUsed;
        private final int flashcardsUsed;
        private final int quizUsed;
        private final int summaryUsed;
        private final int learningPathsGenerated;
        private final int totalRequestsToday;
        // Daily limits
        private final int chatLimit;
        private final int flashcardsLimit;
        private final int quizLimit;
        private final int summaryLimit;
        // Token counts
        private final long promptTokensUsed;
        private final long completionTokensUsed;
        private final long totalTokensUsed;

        public AIUsageStats(int chatRemaining, int flashcardsRemaining, int quizRemaining,
                            int summaryRemaining, int chatUsed, int flashcardsUsed, int quizUsed,
                            int summaryUsed, int learningPathsGenerated, int totalRequestsToday,
                            int chatLimit, int flashcardsLimit, int quizLimit, int summaryLimit,
                            long promptTokensUsed, long completionTokensUsed, long totalTokensUsed) {
            this.chatRemaining = chatRemaining;
            this.flashcardsRemaining = flashcardsRemaining;
            this.quizRemaining = quizRemaining;
            this.summaryRemaining = summaryRemaining;
            this.chatUsed = chatUsed;
            this.flashcardsUsed = flashcardsUsed;
            this.quizUsed = quizUsed;
            this.summaryUsed = summaryUsed;
            this.learningPathsGenerated = learningPathsGenerated;
            this.totalRequestsToday = totalRequestsToday;
            this.chatLimit = chatLimit;
            this.flashcardsLimit = flashcardsLimit;
            this.quizLimit = quizLimit;
            this.summaryLimit = summaryLimit;
            this.promptTokensUsed = promptTokensUsed;
            this.completionTokensUsed = completionTokensUsed;
            this.totalTokensUsed = totalTokensUsed;
        }

        public int getChatRemaining()          { return chatRemaining; }
        public int getFlashcardsRemaining()    { return flashcardsRemaining; }
        public int getQuizRemaining()          { return quizRemaining; }
        public int getSummaryRemaining()       { return summaryRemaining; }
        public int getChatUsed()               { return chatUsed; }
        public int getFlashcardsUsed()         { return flashcardsUsed; }
        public int getQuizUsed()               { return quizUsed; }
        public int getSummaryUsed()            { return summaryUsed; }
        public int getLearningPathsGenerated() { return learningPathsGenerated; }
        public int getTotalRequestsToday()     { return totalRequestsToday; }
        public int getChatLimit()              { return chatLimit; }
        public int getFlashcardsLimit()        { return flashcardsLimit; }
        public int getQuizLimit()              { return quizLimit; }
        public int getSummaryLimit()           { return summaryLimit; }
        public long getPromptTokensUsed()      { return promptTokensUsed; }
        public long getCompletionTokensUsed()  { return completionTokensUsed; }
        public long getTotalTokensUsed()       { return totalTokensUsed; }
    }
}
