package com.arribot.controller;

import com.arribot.model.Resume;
import com.arribot.model.User;
import com.arribot.repository.UserRepository;
import com.arribot.service.ResumeService;
import com.arribot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Upload a resume
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract user from JWT
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Upload resume
            Resume resume = resumeService.uploadResume(file, user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("resumeId", resume.getId());
            response.put("fileName", resume.getFileName());
            response.put("uploadedAt", resume.getUploadedAt());
            response.put("message", "Resume uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all resumes for the authenticated user
     */
    @GetMapping("/list")
    public ResponseEntity<?> listResumes(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user from JWT
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Resume> resumes = resumeService.getUserResumes(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("resumes", resumes);
            response.put("count", resumes.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch resumes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get a specific resume by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract user from JWT
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Resume> resumeOpt = resumeService.getResumeById(id, user);

            if (resumeOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Resume not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("resume", resumeOpt.get());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete a resume
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract user from JWT
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean deleted = resumeService.deleteResume(id, user);

            if (!deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Resume not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resume deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
