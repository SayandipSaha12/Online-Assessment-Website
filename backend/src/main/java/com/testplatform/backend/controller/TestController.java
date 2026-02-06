package com.testplatform.backend.controller;

import com.testplatform.backend.dto.CreateTestRequest;
import com.testplatform.backend.dto.SubmitTestRequest;
import com.testplatform.backend.dto.TestResponse;
import com.testplatform.backend.entity.Question;
import com.testplatform.backend.entity.Test;
import com.testplatform.backend.entity.TestResult;
import com.testplatform.backend.repository.TestRepository;
import com.testplatform.backend.repository.TestResultRepository;
import com.testplatform.backend.util.TestCodeGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createTest(@RequestBody CreateTestRequest request) {
        try {
            // Create Test entity
            Test test = new Test();
            test.setTitle(request.getTitle());
            test.setDuration(request.getDuration());
            test.setDescription(request.getDescription());
            test.setCreatedBy(request.getCreatedBy());
            
            // Parse date and time
            String dateTimeString = request.getDate() + "T" + request.getTime();
            LocalDateTime activationDateTime = LocalDateTime.parse(dateTimeString);
            test.setActivationDateTime(activationDateTime);
            
            // Generate unique test code
            test.setTestCode(TestCodeGenerator.generate());
            
            // Add questions
            for (CreateTestRequest.QuestionDTO qDto : request.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(qDto.getText());
                question.setOptionA(qDto.getOptions().get(0));
                question.setOptionB(qDto.getOptions().get(1));
                question.setOptionC(qDto.getOptions().get(2));
                question.setOptionD(qDto.getOptions().get(3));
                question.setCorrectAnswer(qDto.getCorrectAnswer());
                
                test.addQuestion(question);
            }
            
            // Save to database
            Test savedTest = testRepository.save(test);
            
            // Return response with test code
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("testCode", savedTest.getTestCode());
            response.put("testId", savedTest.getId());
            response.put("message", "Test created successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating test: " + e.getMessage());
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getTestByCode(@PathVariable String code) {
        return testRepository.findByTestCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-tests")
    public ResponseEntity<?> getMyTests(@RequestParam String email) {
        List<Test> tests = testRepository.findByCreatedBy(email);
        return ResponseEntity.ok(tests);
    }

    // Get test by code (for taking test)
    @GetMapping("/take/{testCode}")
    public ResponseEntity<?> getTestForTaking(
            @PathVariable String testCode,
            @RequestParam(required = false) String email) {
        
        Test test = testRepository.findByTestCode(testCode).orElse(null);
        
        if (test == null) {
            return ResponseEntity.status(404).body("Test not found");
        }

        // Check if test is active
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(test.getActivationDateTime())) {
            return ResponseEntity.status(403).body("Test not yet active");
        }

        // If email is provided, check if already taken
        if (email != null && !email.isEmpty()) {
            List<TestResult> existingResults = testResultRepository.findByTestId(test.getId());
            
            boolean alreadyTaken = existingResults.stream()
                    .anyMatch(result -> result.getStudentEmail().equalsIgnoreCase(email));
            
            if (alreadyTaken) {
                return ResponseEntity.status(403).body("You have already taken this test");
            }
        }

        // Build response without correct answers
        TestResponse response = new TestResponse();
        response.setId(test.getId());
        response.setTitle(test.getTitle());
        response.setDescription(test.getDescription());
        response.setDuration(test.getDuration());
        response.setActivationDateTime(test.getActivationDateTime());
        response.setTestCode(test.getTestCode());
        response.setTotalQuestions(test.getQuestions().size());

        // Add questions without revealing correct answers
        List<TestResponse.QuestionResponse> questions = new ArrayList<>();
        for (Question q : test.getQuestions()) {
            TestResponse.QuestionResponse qr = new TestResponse.QuestionResponse();
            qr.setId(q.getId());
            qr.setQuestionText(q.getQuestionText());
            qr.setOptionA(q.getOptionA());
            qr.setOptionB(q.getOptionB());
            qr.setOptionC(q.getOptionC());
            qr.setOptionD(q.getOptionD());
            questions.add(qr);
        }
        response.setQuestions(questions);

        return ResponseEntity.ok(response);
    }

    // Submit test answers
    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody SubmitTestRequest request) {
        Test test = testRepository.findByTestCode(request.getTestCode()).orElse(null);
        
        if (test == null) {
            return ResponseEntity.status(404).body("Test not found");
        }

        // Calculate score
        int score = 0;
        Map<Long, Integer> results = new HashMap<>();
        
        for (Question question : test.getQuestions()) {
            Integer studentAnswer = request.getAnswers().get(question.getId());
            if (studentAnswer != null && studentAnswer.equals(question.getCorrectAnswer())) {
                score++;
            }
            results.put(question.getId(), question.getCorrectAnswer());
        }

        // Save result
        TestResult result = new TestResult();
        result.setTest(test);
        result.setStudentEmail(request.getStudentEmail());
        result.setStudentName(request.getStudentName());
        result.setScore(score);
        result.setTotalQuestions(test.getQuestions().size());
        result.setStudentAnswers(request.getAnswers());
        
        testResultRepository.save(result);

        // Return results with correct answers
        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("totalQuestions", test.getQuestions().size());
        response.put("percentage", (score * 100.0) / test.getQuestions().size());
        response.put("correctAnswers", results);
        response.put("studentAnswers", request.getAnswers());

        return ResponseEntity.ok(response);
    }

    // Check if student already took the test
    @GetMapping("/check-attempt/{testCode}")
    public ResponseEntity<?> checkTestAttempt(
            @PathVariable String testCode,
            @RequestParam String email) {
        
        Test test = testRepository.findByTestCode(testCode).orElse(null);
        
        if (test == null) {
            return ResponseEntity.status(404).body("Test not found");
        }

        // Check if student already submitted this test
        List<TestResult> existingResults = testResultRepository.findByTestId(test.getId());
        
        boolean alreadyTaken = existingResults.stream()
                .anyMatch(result -> result.getStudentEmail().equalsIgnoreCase(email));
        
        if (alreadyTaken) {
            // Find the result
            TestResult result = existingResults.stream()
                    .filter(r -> r.getStudentEmail().equalsIgnoreCase(email))
                    .findFirst()
                    .orElse(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("alreadyTaken", true);
            response.put("score", result.getScore());
            response.put("totalQuestions", result.getTotalQuestions());
            response.put("submittedAt", result.getSubmittedAt());
            
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("alreadyTaken", false);
        
        return ResponseEntity.ok(response);
    }
}
