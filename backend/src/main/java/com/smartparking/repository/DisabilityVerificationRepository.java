package com.smartparking.repository;

import com.smartparking.model.DisabilityVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisabilityVerificationRepository extends JpaRepository<DisabilityVerification, Long> {
    Optional<DisabilityVerification> findByUserId(Long userId);
}
