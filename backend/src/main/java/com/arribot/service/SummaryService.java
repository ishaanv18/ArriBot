package com.arribot.service;

import com.arribot.model.Summary;
import com.arribot.repository.SummaryRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class SummaryService {

    private final GeminiService geminiService;
    private final SummaryRepository summaryRepository;

    public SummaryService(GeminiService geminiService, SummaryRepository summaryRepository) {
        this.geminiService = geminiService;
        this.summaryRepository = summaryRepository;
    }

    public Summary summarizeText(String text) throws IOException {
        String summarizedText = geminiService.summarize(text);

        Summary summary = new Summary(text, summarizedText);
        return summaryRepository.save(summary);
    }

    public List<Summary> getAllSummaries() {
        return summaryRepository.findAll();
    }
}
