package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Spring Data JPA will auto-generate these queries
    List<Question> findByTestId(Long testId);
}