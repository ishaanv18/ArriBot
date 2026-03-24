package com.arribot.model;

/**
 * Wrapper for Groq API responses — carries both the generated text
 * and the token usage metadata returned by the API.
 */
public class GroqResponse {

    private String text;
    private long promptTokens;
    private long completionTokens;
    private long totalTokens;

    public GroqResponse(String text, long promptTokens, long completionTokens, long totalTokens) {
        this.text = text;
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.totalTokens = totalTokens;
    }

    public String getText() { return text; }
    public long getPromptTokens() { return promptTokens; }
    public long getCompletionTokens() { return completionTokens; }
    public long getTotalTokens() { return totalTokens; }
}
