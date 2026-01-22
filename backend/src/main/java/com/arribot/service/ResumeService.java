package com.arribot.service;

import com.arribot.model.Resume;
import com.arribot.model.User;
import com.arribot.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private PDFProcessorService pdfProcessorService;

    @Value("${file.upload.dir:./uploads/resumes}")
    private String uploadDir;

    /**
     * Upload and save a resume
     */
    public Resume uploadResume(MultipartFile file, User user) throws IOException {
        // Validate PDF
        if (!pdfProcessorService.isValidPDF(file)) {
            throw new IllegalArgumentException("Invalid PDF file");
        }

        // Create upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        String filePath = uploadDir + File.separator + uniqueFilename;

        // Save file to disk
        Path targetPath = Paths.get(filePath);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text from PDF
        String extractedText = pdfProcessorService.extractTextFromPDF(file);

        // Create and save resume entity
        Resume resume = new Resume(user.getId(), originalFilename, filePath);
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    /**
     * Get all resumes for a user
     */
    public List<Resume> getUserResumes(User user) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
    }

    /**
     * Get a specific resume by ID (user-specific)
     */
    public Optional<Resume> getResumeById(String id, User user) {
        return resumeRepository.findByIdAndUserId(id, user.getId());
    }

    /**
     * Delete a resume
     */
    public boolean deleteResume(String id, User user) {
        Optional<Resume> resumeOpt = resumeRepository.findByIdAndUserId(id, user.getId());
        
        if (resumeOpt.isEmpty()) {
            return false;
        }

        Resume resume = resumeOpt.get();

        // Delete file from disk
        try {
            Path filePath = Paths.get(resume.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Delete from database
        resumeRepository.delete(resume);
        return true;
    }

    /**
     * Get resume count for a user
     */
    public long getResumeCount(User user) {
        return resumeRepository.countByUserId(user.getId());
    }
}
