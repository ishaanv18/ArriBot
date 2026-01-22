package com.arribot.repository;

import com.arribot.model.AIUsage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIUsageRepository extends MongoRepository<AIUsage, String> {
    
    Optional<AIUsage> findByUserIdAndDate(String userId, String date);
    
    @Query("{ 'userId': ?0, 'date': { $gte: ?1 } }")
    List<AIUsage> findRecentUsage(String userId, String startDate);
    
    List<AIUsage> findByUserId(String userId);
}
