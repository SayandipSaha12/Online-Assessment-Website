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
            // Build HTML email
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to ExamPro!</h1>
                            <p>Online Assessment Platform</p>
                        </div>
                        <div class="content">
                            <h2>Verify Your Email Address</h2>
                            <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
                            <div class="code-box">
                                <div class="code">%s</div>
                            </div>
                            <p><strong>This code will expire in 15 minutes.</strong></p>
                            <p>If you didn't create an account with ExamPro, please ignore this email.</p>
                            <div class="footer">
                                <p>© 2026 ExamPro - Online Assessment Platform</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """, verificationCode);

            // Build JSON request body
            String jsonBody = String.format("""
                {
                  "from": "ExamPro <onboarding@resend.dev>",
                  "to": ["%s"],
                  "subject": "Verify Your ExamPro Account - Code: %s",
                  "html": %s
                }
                """, toEmail, verificationCode, escapeJson(htmlContent));

            // Create HTTP client and request
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            // Send request
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
    
    // Helper method to escape JSON strings
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

### **Commit changes:**
```
Update EmailService to use Resend API instead of SMTP
```

---

## ✅ **Step 4: Update application.properties**

### **Navigate to:**
```
backend/src/main/resources/application.properties
