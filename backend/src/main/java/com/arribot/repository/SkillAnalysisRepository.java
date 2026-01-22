package com.arribot.repository;

import com.arribot.model.Resume;
import com.arribot.model.SkillAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillAnalysisRepository extends MongoRepository<SkillAnalysis, String> {
    
    Optional<SkillAnalysis> findByResume(Resume resume);
    
    Optional<SkillAnalysis> findTopByResumeOrderByAnalyzedAtDesc(Resume resume);
}
