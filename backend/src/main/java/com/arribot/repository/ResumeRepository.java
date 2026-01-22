package com.arribot.repository;

import com.arribot.model.Resume;
import com.arribot.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {
    
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    
    Optional<Resume> findByIdAndUser(String id, User user);
    
    long countByUser(User user);
}
