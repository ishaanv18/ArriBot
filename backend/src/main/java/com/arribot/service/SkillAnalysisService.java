package com.arribot.service;

import com.arribot.model.Resume;
import com.arribot.model.SkillAnalysis;
import com.arribot.repository.SkillAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class SkillAnalysisService {

    @Autowired
    private SkillAnalysisRepository skillAnalysisRepository;

    @Autowired
    private GroqResumeAnalyzer groqResumeAnalyzer;

    /**
     * Analyze a resume and generate skill analysis
     */
    public SkillAnalysis analyzeResume(Resume resume, String targetRole) throws IOException {
        // Check if analysis already exists
        Optional<SkillAnalysis> existingAnalysis = 
                skillAnalysisRepository.findTopByResumeOrderByAnalyzedAtDesc(resume);

        // If analysis exists for same target role, return it (caching)
        if (existingAnalysis.isPresent() && 
            existingAnalysis.get().getTargetRole().equals(targetRole)) {
            return existingAnalysis.get();
        }

        // Get resume text
        String resumeText = resume.getExtractedText();
        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("Resume text is empty");
        }

        // Call Groq AI for analysis
        GroqResumeAnalyzer.SkillAnalysisResult aiResult = 
                groqResumeAnalyzer.analyzeResume(resumeText, targetRole);

        // Create and save skill analysis
        SkillAnalysis analysis = new SkillAnalysis(resume, targetRole);
        analysis.setDetectedSkills(aiResult.getDetectedSkills());
        analysis.setMissingSkills(aiResult.getMissingSkills());
        analysis.setRecommendedSkills(aiResult.getRecommendedSkills());
        analysis.setExperienceYears(aiResult.getExperienceYears());
        analysis.setLearningPath(aiResult.getLearningPath());
        
        // Set quality scores
        analysis.setOverallScore(aiResult.getOverallScore());
        analysis.setSkillMatchScore(aiResult.getSkillMatchScore());
        analysis.setExperienceScore(aiResult.getExperienceScore());
        analysis.setResumeQualityScore(aiResult.getResumeQualityScore());

        return skillAnalysisRepository.save(analysis);
    }

    /**
     * Get the latest analysis for a resume
     */
    public Optional<SkillAnalysis> getLatestAnalysis(Resume resume) {
        return skillAnalysisRepository.findTopByResumeOrderByAnalyzedAtDesc(resume);
    }

    /**
     * Get analysis by ID
     */
    public Optional<SkillAnalysis> getAnalysisById(String id) {
        return skillAnalysisRepository.findById(id);
    }
}
