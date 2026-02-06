package com.testplatform.backend.repository;

import com.testplatform.backend.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByStudentEmail(String studentEmail);
    List<TestResult> findByTestId(Long testId);
}

