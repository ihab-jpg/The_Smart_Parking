package com.smartparking.repository;

import com.smartparking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository
 * ===============
 * 
 * Handles database operations for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByLicensePlate(String licensePlate);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByLicensePlate(String licensePlate);
    Boolean existsByPhoneNumber(String phoneNumber);
}
