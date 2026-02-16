package com.testplatform.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            String htmlContent = String.format(
                "<html>" +
                "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">" +
                "    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">" +
                "        <div style=\"background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;\">" +
                "            <h1 style=\"margin: 0;\">Welcome to ExamPro!</h1>" +
                "            <p style=\"margin: 10px 0 0 0;\">Online Assessment Platform</p>" +
                "        </div>" +
                "        <div style=\"background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;\">" +
                "            <h2>Verify Your Email Address</h2>" +
                "            <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>" +
                "            <div style=\"background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;\">" +
                "                <div style=\"font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;\">%s</div>" +
                "            </div>" +
                "            <p><strong>This code will expire in 15 minutes.</strong></p>" +
                "            <p>If you didn't create an account with ExamPro, please ignore this email.</p>" +
                "            <div style=\"text-align: center; margin-top: 20px; color: #666; font-size: 12px;\">" +
                "                <p>© 2026 ExamPro - Online Assessment Platform</p>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>",
                verificationCode
            );

            String jsonBody = String.format(
                "{" +
                "  \"from\": \"ExamPro <onboarding@resend.dev>\"," +
                "  \"to\": [\"%s\"]," +
                "  \"subject\": \"Verify Your ExamPro Account - Code: %s\"," +
                "  \"html\": %s" +
                "}",
                toEmail,
                verificationCode,
                escapeJson(htmlContent)
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                System.out.println("✅ Email sent successfully to: " + toEmail);
            } else {
                System.err.println("❌ Email failed. Status: " + response.statusCode() + ", Response: " + response.body());
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String escapeJson(String text) {
        return "\"" + text
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t") + "\"";
    }
}
```

### **Commit message:**
```
Fix EmailService for Resend API integration
