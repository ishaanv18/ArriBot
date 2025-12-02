package com.arribot.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    public void sendOTP(String toEmail, String otp) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        String subject = "ArriBot - Your OTP Verification Code";

        // Build HTML content with OTP inserted directly
        String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                +
                ".header { background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); padding: 40px 20px; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 32px; }" +
                ".content { padding: 40px 30px; }" +
                ".otp-box { background-color: #f9fafb; border: 2px dashed #9333ea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }"
                +
                ".otp-code { font-size: 48px; font-weight: bold; color: #9333ea; letter-spacing: 8px; }" +
                ".footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }"
                +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>🤖 ArriBot</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<h2 style=\"color: #1f2937; margin-top: 0;\">Verify Your Email</h2>" +
                "<p style=\"color: #4b5563; font-size: 16px; line-height: 1.6;\">" +
                "Thank you for signing up with ArriBot! To complete your registration, please use the following One-Time Password (OTP):"
                +
                "</p>" +
                "<div class=\"otp-box\">" +
                "<div class=\"otp-code\">" + otp + "</div>" +
                "</div>" +
                "<p style=\"color: #4b5563; font-size: 14px; line-height: 1.6;\">" +
                "This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone." +
                "</p>" +
                "<p style=\"color: #4b5563; font-size: 14px; line-height: 1.6;\">" +
                "If you didn't request this code, please ignore this email." +
                "</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p style=\"margin: 0;\">© 2025 ArriBot. All rights reserved.</p>" +
                "<p style=\"margin: 10px 0 0 0;\">Your AI-powered learning companion</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid API error: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("Failed to send OTP email via SendGrid: " + ex.getMessage());
            throw ex;
        }
    }

    public void sendWelcomeEmail(String toEmail, String fullName) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        String subject = "Welcome to ArriBot! 🎉";

        String htmlContent = "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                +
                ".header { background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); padding: 40px 20px; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 32px; }" +
                ".content { padding: 40px 30px; }" +
                ".feature-box { background-color: #f9fafb; border-left: 4px solid #9333ea; padding: 20px; margin: 20px 0; }"
                +
                ".footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }"
                +
                "</style></head><body>" +
                "<div class=\"container\"><div class=\"header\"><h1>🤖 Welcome to ArriBot!</h1></div>" +
                "<div class=\"content\"><h2 style=\"color: #1f2937; margin-top: 0;\">Hi " + fullName + "! 👋</h2>" +
                "<p style=\"color: #4b5563; font-size: 16px; line-height: 1.6;\">Thank you for joining ArriBot!</p>" +
                "<div class=\"feature-box\"><p style=\"margin: 0; color: #1f2937; font-weight: bold;\">✨ Chat with AI</p></div>"
                +
                "<div class=\"feature-box\"><p style=\"margin: 0; color: #1f2937; font-weight: bold;\">📚 Create Flashcards</p></div>"
                +
                "<div class=\"feature-box\"><p style=\"margin: 0; color: #1f2937; font-weight: bold;\">📝 Generate Quizzes</p></div>"
                +
                "<div class=\"feature-box\"><p style=\"margin: 0; color: #1f2937; font-weight: bold;\">📖 Summarize Content</p></div>"
                +
                "</div><div class=\"footer\"><p style=\"margin: 0;\">© 2025 ArriBot. All rights reserved.</p></div></div>"
                +
                "</body></html>";

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid API error: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("Failed to send welcome email via SendGrid: " + ex.getMessage());
            throw ex;
        }
    }

    public void sendContactFormEmail(String name, String email, String message) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(fromEmail);
        String subject = "New Contact Form Submission - ArriBot";

        String htmlContent = "<!DOCTYPE html><html><head><style>" +
                "body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                +
                ".header { background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); padding: 40px 20px; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 28px; }" +
                ".content { padding: 40px 30px; }" +
                ".info-box { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }" +
                ".footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }"
                +
                "</style></head><body>" +
                "<div class=\"container\"><div class=\"header\"><h1>📬 New Contact Form</h1></div>" +
                "<div class=\"content\">" +
                "<div class=\"info-box\"><p style=\"margin: 0; color: #6b7280; font-size: 14px;\">Name</p>" +
                "<p style=\"margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;\">" + name
                + "</p></div>" +
                "<div class=\"info-box\"><p style=\"margin: 0; color: #6b7280; font-size: 14px;\">Email</p>" +
                "<p style=\"margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;\">" + email
                + "</p></div>" +
                "<div class=\"info-box\"><p style=\"margin: 0; color: #6b7280; font-size: 14px;\">Message</p>" +
                "<p style=\"margin: 10px 0 0 0; color: #1f2937; font-size: 16px; line-height: 1.6;\">" + message
                + "</p></div>" +
                "</div><div class=\"footer\"><p style=\"margin: 0;\">© 2025 ArriBot</p></div></div>" +
                "</body></html>";

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid API error: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("Failed to send contact form email via SendGrid: " + ex.getMessage());
            throw ex;
        }
    }
}
