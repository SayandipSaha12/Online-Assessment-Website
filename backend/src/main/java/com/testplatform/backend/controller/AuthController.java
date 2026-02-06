package com.testplatform.backend.controller;

import com.testplatform.backend.dto.VerifyRequest;
import com.testplatform.backend.entity.User;
import com.testplatform.backend.repository.UserRepository;
import com.testplatform.backend.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired   
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Password strength validation
    private boolean isStrongPassword(String password) {
        return password.matches(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
        );
    }

    // ========= REGISTER =========
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        
        try {
            // Check if email already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return "EMAIL_ALREADY_EXISTS";
            }

            // Validate password
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return "PASSWORD_REQUIRED";
            }

            if (!isStrongPassword(user.getPassword())) {
                return "WEAK_PASSWORD";
            }

            // Generate OTP
            String code = String.valueOf((int)(Math.random() * 900000) + 100000);

            // Save user
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setVerified(false);
            user.setVerificationCode(code);
            userRepository.save(user);

            // Send email
            emailService.sendVerificationEmail(user.getEmail(), code);

            return "VERIFICATION_SENT";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }

    @PostMapping("/verify")
    public String verify(@RequestBody VerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) return "USER_NOT_FOUND";

        if (user.getVerificationCode() == null) {
            return "NO_PENDING_VERIFICATION";
        }

        if (user.getVerificationCode().equals(request.getCode())) {
            user.setVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return "VERIFIED";
        }

        return "INVALID_CODE";
    }

    // ========= LOGIN =========
    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {
        Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());

        if (userOpt.isEmpty()) {
            return "USER_NOT_FOUND";
        }

        User user = userOpt.get();

        if (!user.isVerified()) {
            return "EMAIL_NOT_VERIFIED";
        }

        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            return "INVALID_PASSWORD";
        }

        return "LOGIN_SUCCESS";
    }
}