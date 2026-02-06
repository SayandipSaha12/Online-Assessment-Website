package com.testplatform.backend.repository;

import com.testplatform.backend.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TestRepository extends JpaRepository<Test, Long> {
    Optional<Test> findByTestCode(String testCode);
    List<Test> findByCreatedBy(String createdBy);
}