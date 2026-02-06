package com.testplatform.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tests")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer duration; // in minutes

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime activationDateTime;

    @Column(unique = true, nullable = false)
    private String testCode; // Unique code for sharing

    @Column(nullable = false)
    private String createdBy; // User email who created the test

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String status; // "scheduled", "active", "completed"

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    // Constructors
    public Test() {
        this.createdAt = LocalDateTime.now();
        this.status = "scheduled";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getActivationDateTime() { return activationDateTime; }
    public void setActivationDateTime(LocalDateTime activationDateTime) { 
        this.activationDateTime = activationDateTime; 
    }

    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { 
        this.questions = questions;
        // Set the test reference for each question
        for (Question question : questions) {
            question.setTest(this);
        }
    }

    // Helper method to add question
    public void addQuestion(Question question) {
        questions.add(question);
        question.setTest(this);
    }
}