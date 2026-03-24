package com.arribot.repository;

import com.arribot.model.LearningPath;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPathRepository extends MongoRepository<LearningPath, String> {

    List<LearningPath> findByUserIdOrderByCreatedAtDesc(String userId);

    long countByUserId(String userId);

    void deleteByIdAndUserId(String id, String userId);
}
