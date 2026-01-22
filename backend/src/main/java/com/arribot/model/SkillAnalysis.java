package com.arribot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "skill_analyses")
public class SkillAnalysis {

    @Id
    private String id;

    @DBRef
    private Resume resume;

    private List<String> detectedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> recommendedSkills = new ArrayList<>();
    private String targetRole;
    private Integer experienceYears;
    private String learningPath; // JSON string
    private LocalDateTime analyzedAt;
    
    // Quality Metrics (0-100)
    private Integer overallScore = 0;
    private Integer skillMatchScore = 0;
    private Integer experienceScore = 0;
    private Integer resumeQualityScore = 0;

    // Constructors
    public SkillAnalysis() {
        this.analyzedAt = LocalDateTime.now();
    }

    public SkillAnalysis(Resume resume, String targetRole) {
        this.resume = resume;
        this.targetRole = targetRole;
        this.analyzedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public List<String> getDetectedSkills() {
        return detectedSkills;
    }

    public void setDetectedSkills(List<String> detectedSkills) {
        this.detectedSkills = detectedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(String learningPath) {
        this.learningPath = learningPath;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public Integer getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(Integer skillMatchScore) {
        this.skillMatchScore = skillMatchScore;
    }

    public Integer getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(Integer experienceScore) {
        this.experienceScore = experienceScore;
    }

    public Integer getResumeQualityScore() {
        return resumeQualityScore;
    }

    public void setResumeQualityScore(Integer resumeQualityScore) {
        this.resumeQualityScore = resumeQualityScore;
    }
}
