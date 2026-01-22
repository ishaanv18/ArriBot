package com.arribot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class AILimitExceededException extends RuntimeException {
    public AILimitExceededException(String message) {
        super(message);
    }
}
