package com.smartparking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * User Entity
 * ===========
 * Represents a regular user in the Smart Parking System
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 80)
    private String username;
    
    @Column(unique = true, nullable = false, length = 120)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(nullable = false, length = 120)
    private String fullName;
    
    @Column(length = 20)
    private String phoneNumber;
    
    @Column(unique = true, nullable = false, length = 20)
    private String licensePlate;
    
    @Column(nullable = false)
    private Boolean hasDisability = false;
    
    @Column(columnDefinition = "JSON")
    private Map<String, Object> preferences; // {near_entrance, proximity_preference, etc.}
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
