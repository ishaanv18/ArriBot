package com.arribot.service;

import com.arribot.model.Summary;
import com.arribot.repository.SummaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class SummaryService {

    private static final Logger logger = LoggerFactory.getLogger(SummaryService.class);
    private final GeminiService geminiService;
    private final GroqService groqService;
    private final SummaryRepository summaryRepository;

    public SummaryService(GeminiService geminiService, GroqService groqService, SummaryRepository summaryRepository) {
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.summaryRepository = summaryRepository;
    }

    public Summary summarizeText(String text) throws IOException {
        String summarizedText;
        try {
            // Use Groq as primary
            summarizedText = groqService.summarize(text);
            logger.info("Summary generated using Groq");
        } catch (IOException e) {
            // Fallback to Gemini
            logger.warn("Groq failed ({}), using Gemini fallback", e.getMessage());
            summarizedText = geminiService.summarize(text);
            logger.info("Summary generated using Gemini");
        }

        Summary summary = new Summary(text, summarizedText);
        return summaryRepository.save(summary);
    }

    public List<Summary> getAllSummaries() {
        return summaryRepository.findAll();
    }
}
