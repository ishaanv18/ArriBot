package com.arribot.controller;

import com.arribot.model.ContactForm;
import com.arribot.model.User;
import com.arribot.service.AuthService;
import com.arribot.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");
            String email = request.get("email");
            String password = request.get("password");

            String message = authService.signup(fullName, email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);
            response.put("email", email);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");

            String message = authService.verifyOTP(email, otp);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            String token = authService.signin(email, password);
            User user = authService.getUserByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", Map.of(
                    "email", user.getEmail(),
                    "fullName", user.getFullName()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String message = authService.resendOTP(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<?> contactForm(@RequestBody ContactForm contactForm) {
        try {
            // Log contact form submission
            System.out.println("===========================================");
            System.out.println("CONTACT FORM SUBMISSION");
            System.out.println("Name: " + contactForm.getName());
            System.out.println("Email: " + contactForm.getEmail());
            System.out.println("Message: " + contactForm.getMessage());
            System.out.println("===========================================");

            // Try to send email (non-blocking)
            try {
                emailService.sendContactFormEmail(
                        contactForm.getName(),
                        contactForm.getEmail(),
                        contactForm.getMessage());
            } catch (Exception e) {
                System.err.println("Failed to send contact form email: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Your message has been received successfully!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to submit message. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
