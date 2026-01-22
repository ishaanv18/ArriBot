package com.arribot.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PDFProcessorService {

    /**
     * Extract text content from a PDF file
     */
    public String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return cleanText(text);
        }
    }

    /**
     * Clean and normalize extracted text
     */
    private String cleanText(String text) {
        if (text == null) {
            return "";
        }
        
        // Remove excessive whitespace
        text = text.replaceAll("\\s+", " ");
        
        // Remove special characters that might cause issues
        text = text.replaceAll("[^\\p{L}\\p{N}\\p{P}\\s]", "");
        
        // Trim
        return text.trim();
    }

    /**
     * Validate if the file is a valid PDF
     */
    public boolean isValidPDF(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return false;
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            return false;
        }

        // Check file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return false;
        }

        return true;
    }
}
