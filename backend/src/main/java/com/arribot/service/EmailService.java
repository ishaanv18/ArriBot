package com.arribot.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOTP(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("ArriBot - Your OTP Verification Code");

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #9333ea 0%%, #7e22ce 100%%); padding: 40px 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 32px; }
                        .content { padding: 40px 30px; }
                        .otp-box { background-color: #f9fafb; border: 2px dashed #9333ea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
                        .otp-code { font-size: 48px; font-weight: bold; color: #9333ea; letter-spacing: 8px; }
                        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🤖 ArriBot</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up with ArriBot! To complete your registration, please use the following OTP code:
                            </p>
                            <div class="otp-box">
                                <div class="otp-code">%s</div>
                            </div>
                            <p style="color: #6b7280; font-size: 14px;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2024 ArriBot. All rights reserved.</p>
                            <p>AI-Powered Learning Platform</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(otp);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String fullName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Welcome to ArriBot! 🎉");

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #9333ea 0%%, #7e22ce 100%%); padding: 50px 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 36px; }
                        .content { padding: 40px 30px; }
                        .feature-box { background-color: #faf5ff; border-left: 4px solid #9333ea; padding: 20px; margin: 20px 0; border-radius: 8px; }
                        .cta-button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%%, #7e22ce 100%%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome to ArriBot!</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #1f2937; margin-top: 0;">Hi %s! 👋</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We're thrilled to have you join our AI-powered learning community! Your account has been successfully verified.
                            </p>
                            <h3 style="color: #9333ea;">What you can do with ArriBot:</h3>
                            <div class="feature-box">
                                <strong>💬 AI ChatBot</strong><br>
                                Get instant answers to your coding and learning questions
                            </div>
                            <div class="feature-box">
                                <strong>📚 Flashcard Generator</strong><br>
                                Create custom flashcards for effective studying
                            </div>
                            <div class="feature-box">
                                <strong>📝 Quiz Generator</strong><br>
                                Test your knowledge with AI-generated quizzes
                            </div>
                            <div class="feature-box">
                                <strong>📄 Summarization Tool</strong><br>
                                Summarize long texts into concise, digestible content
                            </div>
                            <div style="text-align: center;">
                                <a href="http://localhost:5173/dashboard" class="cta-button">Get Started Now</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2024 ArriBot. All rights reserved.</p>
                            <p>AI-Powered Learning Platform</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(fullName);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    public void sendContactFormNotification(String name, String email, String messageContent)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(fromEmail); // Send to admin email
        helper.setSubject("New Contact Form Submission - ArriBot");

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #9333ea 0%%, #7e22ce 100%%); padding: 30px 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
                        .content { padding: 30px; }
                        .info-row { margin: 15px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; }
                        .label { font-weight: bold; color: #9333ea; }
                        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📧 New Contact Form Submission</h1>
                        </div>
                        <div class="content">
                            <div class="info-row">
                                <span class="label">From:</span> %s
                            </div>
                            <div class="info-row">
                                <span class="label">Email:</span> %s
                            </div>
                            <div class="info-row">
                                <span class="label">Message:</span><br><br>
                                %s
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2024 ArriBot Contact Form</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(name, email, messageContent);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
