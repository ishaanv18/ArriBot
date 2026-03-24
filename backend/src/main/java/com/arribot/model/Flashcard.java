package com.arribot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "flashcards")
public class Flashcard {

    @Id
    private String id;

    private String topic;
    private String question;
    private String answer;
    private LocalDateTime createdAt;

    public Flashcard(String topic, String question, String answer) {
        this.topic = topic;
        this.question = question;
        this.answer = answer;
        this.createdAt = LocalDateTime.now();
    }
}
