package com.testplatform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.testplatform.backend.entity.Question;
import com.testplatform.backend.entity.Test;
import com.testplatform.backend.repository.QuestionRepository;
import com.testplatform.backend.repository.TestRepository;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestRepository testRepository;

    // Get all questions for a specific test
    @GetMapping("/test/{testId}")
    public ResponseEntity<?> getQuestionsByTestId(@PathVariable Long testId) {
        Test test = testRepository.findById(testId).orElse(null);
        
        if (test == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(test.getQuestions());
    }

    // Get all questions for a test by test code
    @GetMapping("/test/code/{testCode}")
    public ResponseEntity<?> getQuestionsByTestCode(@PathVariable String testCode) {
        Test test = testRepository.findByTestCode(testCode).orElse(null);
        
        if (test == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(test.getQuestions());
    }

    // This is now handled by TestController when creating a test
    // But keeping this for manual question additions if needed
    @PostMapping("/test/{testId}")
    public ResponseEntity<?> addQuestionsToTest(
            @PathVariable Long testId,
            @RequestBody List<Question> questions) {

        Test test = testRepository.findById(testId).orElse(null);
        
        if (test == null) {
            return ResponseEntity.notFound().build();
        }

        for (Question question : questions) {
            test.addQuestion(question);
        }

        testRepository.save(test);
        
        return ResponseEntity.ok(test.getQuestions());
    }
}