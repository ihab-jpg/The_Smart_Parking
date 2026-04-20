package com.smartparking.repositories;

import com.smartparking.models.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findByUserId1(Long userId);
    List<ContactRequest> findByUserId2(Long userId);
    List<ContactRequest> findByStatus(String status);
}