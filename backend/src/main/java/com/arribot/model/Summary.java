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
@Document(collection = "summaries")
public class Summary {
    
    @Id
    private String id;
    
    private String originalText;
    private String summarizedText;
    private LocalDateTime createdAt;
    
    public Summary(String originalText, String summarizedText) {
        this.originalText = originalText;
        this.summarizedText = summarizedText;
        this.createdAt = LocalDateTime.now();
    }
}
