package com.smartparking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Admin Entity
 * ===========
 * Represents an administrator in the Smart Parking System
 */
@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 80)
    private String username;
    
    @Column(unique = true, nullable = false, length = 120)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(nullable = false, length = 50)
    private String adminLevel; // super_admin, admin, moderator
    
    @Column(columnDefinition = "JSON")
    private Map<String, Object> permissions;
    
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
        return "Admin{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", adminLevel='" + adminLevel + '\'' +
                '}';
    }
}
