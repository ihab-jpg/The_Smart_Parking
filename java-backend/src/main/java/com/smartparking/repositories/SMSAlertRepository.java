package com.smartparking.repositories;

import com.smartparking.models.SMSAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SMSAlertRepository extends JpaRepository<SMSAlert, Long> {
    List<SMSAlert> findByUserId(Long userId);
    List<SMSAlert> findByStatus(String status);
}