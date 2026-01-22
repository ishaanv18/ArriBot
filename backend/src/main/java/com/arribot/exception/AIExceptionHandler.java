package com.arribot.exception;

import com.arribot.exception.AILimitExceededException;
import com.arribot.exception.RateLimitExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.util.Map;

@RestControllerAdvice
public class AIExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(AIExceptionHandler.class);

    @ExceptionHandler(AILimitExceededException.class)
    public ResponseEntity<?> handleAILimitExceeded(AILimitExceededException e) {
        logger.warn("AI limit exceeded: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
            "error", "AI_LIMIT_EXCEEDED",
            "message", e.getMessage(),
            "retryAfter", "Tomorrow at 00:00 UTC",
            "status", 429
        ));
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<?> handleRateLimitExceeded(RateLimitExceededException e) {
        logger.warn("Rate limit exceeded: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
            "error", "RATE_LIMIT_EXCEEDED",
            "message", e.getMessage(),
            "retryAfter", "60 seconds",
            "status", 429
        ));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleGroqAPIError(IOException e) {
        logger.error("AI service error", e);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
            "error", "AI_SERVICE_UNAVAILABLE",
            "message", "AI service is temporarily unavailable. Please try again later.",
            "status", 503
        ));
    }
}
