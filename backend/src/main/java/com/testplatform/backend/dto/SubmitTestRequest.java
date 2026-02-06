package com.testplatform.backend.dto;

import java.util.Map;

public class SubmitTestRequest {
    
    private String testCode;
    private String studentEmail;
    private String studentName;
    private Map<Long, Integer> answers; // questionId -> selectedAnswer (0-3)

    public SubmitTestRequest() {}

    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Map<Long, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<Long, Integer> answers) { this.answers = answers; }
}