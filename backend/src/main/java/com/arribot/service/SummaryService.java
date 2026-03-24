package com.arribot.service;

import com.arribot.model.AIFeature;
import com.arribot.model.GroqResponse;
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
    private final GroqService groqService;
    private final SummaryRepository summaryRepository;
    private final AILimitsService aiLimitsService;

    public SummaryService(GroqService groqService,
                          SummaryRepository summaryRepository,
                          AILimitsService aiLimitsService) {
        this.groqService = groqService;
        this.summaryRepository = summaryRepository;
        this.aiLimitsService = aiLimitsService;
    }

    public Summary summarizeText(String text, String userId) throws IOException {
        aiLimitsService.checkAndIncrementUsage(userId, AIFeature.SUMMARY);

        GroqResponse groqResponse = groqService.summarize(text);
        aiLimitsService.recordTokenUsage(userId, groqResponse);
        logger.info("Summary generated using Groq");

        return summaryRepository.save(new Summary(text, groqResponse.getText()));
    }

    public List<Summary> getAllSummaries() {
        return summaryRepository.findAll();
    }
}
