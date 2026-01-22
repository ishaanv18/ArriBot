
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
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Courier New', monospace; background-color: #030014; margin: 0; padding: 0; color: #e2e8f0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #0F0529; border: 1px solid #22d3ee33; border-radius: 16px; overflow: hidden; box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
                    .header { background: linear-gradient(90deg, #2e1065 0%, #0c4a6e 100%); padding: 30px; text-align: center; border-bottom: 1px solid #22d3ee33; }
                    .header h1 { color: #22d3ee; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px rgba(34, 211, 238, 0.5); }
                    .content { padding: 40px 30px; text-align: center; }
                    .otp-box { background: rgba(34, 211, 238, 0.05); border: 1px dashed #22d3ee; border-radius: 8px; padding: 20px; margin: 30px 0; display: inline-block; min-width: 200px; }
                    .otp-code { font-size: 42px; font-weight: bold; color: #fff; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
                    .notice { color: #94a3b8; font-size: 14px; margin-top: 20px; line-height: 1.6; }
                    .footer { background-color: #080216; padding: 20px; text-align: center; color: #475569; font-size: 12px; border-top: 1px solid #ffffff11; }
                    .accent { color: #c084fc; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ARR_IBOT // PROTOCOL</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #fff; margin-top: 0; font-weight: normal; font-size: 20px;">Identity Verification Required</h2>
                        <p style="color: #cbd5e1; font-size: 16px;">
                            Access request detected. Authenticate to proceed to the <span class="accent">Spatial Workspace</span>.
                        </p>
                        
                        <div class="otp-box">
                            <div class="otp-code">""" + otp + """
                            </div>
                        </div>

                        <p class="notice">
                            This key will self-destruct in <strong>10 minutes</strong>.<br>
                            If you did not initiate this sequence, ignore this transmission.
                        </p>
                    </div>
                    <div class="footer">
                        <p>SECURE CHANNEL ENCRYPTED</p>
                        <p>&copy; 2025 ArriBot Systems. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """;

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

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Courier New', monospace; background-color: #030014; margin: 0; padding: 0; color: #e2e8f0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #0F0529; border: 1px solid #22d3ee33; border-radius: 16px; overflow: hidden; box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
                    .header { background: linear-gradient(90deg, #2e1065 0%, #0c4a6e 100%); padding: 30px; text-align: center; border-bottom: 1px solid #22d3ee33; }
                    .header h1 { color: #22d3ee; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px rgba(34, 211, 238, 0.5); }
                    .content { padding: 40px 30px; text-align: center; }
                    .feature-box { background: rgba(34, 211, 238, 0.05); border-left: 3px solid #c084fc; padding: 15px; margin: 15px 0; text-align: left; }
                    .feature-title { color: #fff; font-weight: bold; margin: 0 0 5px 0; font-size: 16px; }
                    .footer { background-color: #080216; padding: 20px; text-align: center; color: #475569; font-size: 12px; border-top: 1px solid #ffffff11; }
                    .accent { color: #c084fc; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ARR_IBOT // ONLINE</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #fff; margin-top: 0; font-weight: normal; font-size: 20px;">Link Established: """ + fullName + """
                        </h2>
                        <p style="color: #cbd5e1; font-size: 16px;">
                            Welcome to the network. Your neural link to <span class="accent">ArriBot</span> is fully active.
                        </p>
                        
                        <div class="feature-box">
                            <p class="feature-title">✨ Neural Chat</p>
                            <span style="color: #94a3b8; font-size: 14px;">Advanced AI processing for complex tasks.</span>
                        </div>
                        <div class="feature-box">
                            <p class="feature-title">📚 Memory Shards</p>
                            <span style="color: #94a3b8; font-size: 14px;">Holographic flashcards for rapid retention.</span>
                        </div>
                        <div class="feature-box">
                            <p class="feature-title">📝 Cognitive Assessments</p>
                            <span style="color: #94a3b8; font-size: 14px;">Adaptive quizzes to test your knowledge.</span>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                            Systems Nominal. You may proceed to the dashboard.
                        </p>
                    </div>
                    <div class="footer">
                        <p>SECURE CHANNEL ENCRYPTED</p>
                        <p>&copy; 2025 ArriBot Systems. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """;

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

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Courier New', monospace; background-color: #030014; margin: 0; padding: 0; color: #e2e8f0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #0F0529; border: 1px solid #22d3ee33; border-radius: 16px; overflow: hidden; box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
                    .header { background: linear-gradient(90deg, #2e1065 0%, #0c4a6e 100%); padding: 30px; text-align: center; border-bottom: 1px solid #22d3ee33; }
                    .header h1 { color: #22d3ee; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px rgba(34, 211, 238, 0.5); }
                    .content { padding: 40px 30px; }
                    .info-box { background: rgba(34, 211, 238, 0.05); border-left: 3px solid #c084fc; padding: 15px; margin: 15px 0; }
                    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                    .value { color: #fff; font-size: 16px; font-weight: bold; }
                    .message-box { background: rgba(255, 255, 255, 0.03); border: 1px dashed #ffffff33; border-radius: 8px; padding: 20px; margin-top: 20px; color: #cbd5e1; line-height: 1.6; }
                    .footer { background-color: #080216; padding: 20px; text-align: center; color: #475569; font-size: 12px; border-top: 1px solid #ffffff11; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>INCOMING TRANSMISSION</h1>
                    </div>
                    <div class="content">
                        <div class="info-box">
                            <div class="label">Source ID (Name)</div>
                            <div class="value">""" + name + """
                            </div>
                        </div>
                        <div class="info-box">
                            <div class="label">Comm Link (Email)</div>
                            <div class="value">""" + email + """
                            </div>
                        </div>
                        
                        <div class="label" style="margin-top: 25px;">Decoded Message Payload:</div>
                        <div class="message-box">
                            """ + message + """
                        </div>
                    </div>
                    <div class="footer">
                        <p>SECURE CHANNEL ENCRYPTED</p>
                        <p>&copy; 2025 ArriBot Systems. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """;

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
