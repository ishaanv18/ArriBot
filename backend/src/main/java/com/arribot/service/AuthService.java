package com.arribot.service;

import com.arribot.model.User;
import com.arribot.repository.UserRepository;
import com.arribot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String signup(String fullName, String email, String password) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        // Hash password
        String hashedPassword = passwordEncoder.encode(password);

        // Create user
        User user = new User(fullName, email, hashedPassword);

        // Generate OTP
        String otp = generateOTP();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        // Save user
        userRepository.save(user);

        // Log OTP to console for development
        System.out.println("===========================================");
        System.out.println("OTP for " + email + ": " + otp);
        System.out.println("===========================================");

        // Send OTP email (non-blocking - don't fail signup if email fails)
        try {
            emailService.sendOTP(email, otp);
            return "OTP sent to " + email;
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            return "Account created. Check console for OTP (Email service unavailable)";
        }
    }

    public String verifyOTP(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Check if OTP matches
        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check if OTP expired
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        // Mark user as verified
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Send welcome email (non-blocking)
        try {
            emailService.sendWelcomeEmail(email, user.getFullName());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return "Email verified successfully";
    }

    public String signin(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        return jwtUtil.generateToken(email, user.getFullName());
    }

    public String resendOTP(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (user.isVerified()) {
            throw new RuntimeException("User already verified");
        }

        // Generate new OTP
        String otp = generateOTP();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Log OTP to console for development
        System.out.println("===========================================");
        System.out.println("RESEND OTP for " + email + ": " + otp);
        System.out.println("===========================================");

        // Send OTP email (non-blocking)
        try {
            emailService.sendOTP(email, otp);
            return "OTP resent to " + email;
        } catch (Exception e) {
            System.err.println("Failed to resend OTP email: " + e.getMessage());
            return "OTP regenerated. Check console for OTP (Email service unavailable)";
        }
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000); // 4-digit OTP
        return String.valueOf(otp);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
