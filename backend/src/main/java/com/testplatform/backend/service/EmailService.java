package com.testplatform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("ExamPro <noreply@exampro.com>");
            helper.setTo(toEmail);
            helper.setSubject("Verify Your ExamPro Account");
            
            String htmlContent = buildVerificationEmailHTML(code);
            helper.setText(htmlContent, true); // true = HTML email
            
            mailSender.send(message);
            System.out.println("✅ Verification email sent to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildVerificationEmailHTML(String code) {
        return "<!DOCTYPE html>" +
            "<html lang='en'>" +
            "<head>" +
            "    <meta charset='UTF-8'>" +
            "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "    <title>Verify Your Email</title>" +
            "</head>" +
            "<body style='margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;'>" +
            "    <table role='presentation' style='width: 100%; border-collapse: collapse;'>" +
            "        <tr>" +
            "            <td align='center' style='padding: 40px 0;'>" +
            "                <table role='presentation' style='width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>" +
            "                    " +
            "                    <!-- Header -->" +
            "                    <tr>" +
            "                        <td style='padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;'>" +
            "                            <h1 style='margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;'>" +
            "                                <span style='font-size: 32px;'>🎓</span> ExamPro" +
            "                            </h1>" +
            "                            <p style='margin: 10px 0 0 0; color: #f0f0f0; font-size: 14px;'>Online Assessment Platform</p>" +
            "                        </td>" +
            "                    </tr>" +
            "                    " +
            "                    <!-- Content -->" +
            "                    <tr>" +
            "                        <td style='padding: 40px;'>" +
            "                            <h2 style='margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;'>Verify Your Email Address</h2>" +
            "                            <p style='margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;'>" +
            "                                Thank you for signing up with ExamPro! To complete your registration, please use the verification code below:" +
            "                            </p>" +
            "                            " +
            "                            <!-- Verification Code Box -->" +
            "                            <table role='presentation' style='width: 100%; border-collapse: collapse; margin: 30px 0;'>" +
            "                                <tr>" +
            "                                    <td style='padding: 20px; background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; text-align: center;'>" +
            "                                        <p style='margin: 0 0 10px 0; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;'>Your Verification Code</p>" +
            "                                        <p style='margin: 0; font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;'>" + code + "</p>" +
            "                                    </td>" +
            "                                </tr>" +
            "                            </table>" +
            "                            " +
            "                            <p style='margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;'>" +
            "                                This code will expire in <strong>15 minutes</strong>. If you didn't create an account with ExamPro, please ignore this email." +
            "                            </p>" +
            "                            " +
            "                            <!-- Tips Box -->" +
            "                            <table role='presentation' style='width: 100%; border-collapse: collapse; margin: 20px 0;'>" +
            "                                <tr>" +
            "                                    <td style='padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;'>" +
            "                                        <p style='margin: 0; color: #2e7d32; font-size: 14px;'>" +
            "                                            <strong>💡 Tip:</strong> Keep this code confidential. ExamPro will never ask for your verification code via phone or social media." +
            "                                        </p>" +
            "                                    </td>" +
            "                                </tr>" +
            "                            </table>" +
            "                        </td>" +
            "                    </tr>" +
            "                    " +
            "                    <!-- Footer -->" +
            "                    <tr>" +
            "                        <td style='padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;'>" +
            "                            <p style='margin: 0 0 10px 0; color: #999999; font-size: 14px;'>" +
            "                                Need help? Contact us at <a href='mailto:exampro36@gmail.com' style='color: #667eea; text-decoration: none;'>exampro36@gmail.com</a>" +
            "                            </p>" +
            "                            <p style='margin: 10px 0 0 0; color: #999999; font-size: 12px;'>" +
            "                                © 2026 ExamPro. All rights reserved." +
            "                            </p>" +
            "                            <p style='margin: 10px 0 0 0; color: #cccccc; font-size: 11px;'>" +
            "                                ExamPro | Online Assessment Platform | Making Education Accessible" +
            "                            </p>" +
            "                        </td>" +
            "                    </tr>" +
            "                </table>" +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</body>" +
            "</html>";
    }
}


