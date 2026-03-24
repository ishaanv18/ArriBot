package com.arribot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;

    private String topic;
    private List<QuizQuestion> questions;
    private LocalDateTime createdAt;

    public Quiz(String topic, List<QuizQuestion> questions) {
        this.topic = topic;
        this.questions = questions;
        this.createdAt = LocalDateTime.now();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizQuestion {
        private String question;
        private List<String> options;
        private int correctAnswerIndex;
        private String explanation;
    }
}
